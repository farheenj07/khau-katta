import { Router, Response } from 'express';
import {
  orders,
  orderItems,
  stalls,
  products,
  users,
  getOrCreatePickupOtp,
  regeneratePickupOtp,
  verifyPickupOtp,
  getPickupAuditDetailsForOrder,
  pickupVerifications,
  getUserCartSummary,
  clearCart
} from '../data/db';
import { authenticate, requireAuth, AuthRequest } from '../middleware/auth';
import { Order } from '../types';

const router = Router();

// ---------------------------------------------------------------------------
// 0. POST /api/orders/checkout - Customer places order (Online UPI / COD)
// ---------------------------------------------------------------------------
router.post('/checkout', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { paymentMode, addressId, specialInstructions } = req.body;

  const cartSummary = getUserCartSummary(userId);
  if (!cartSummary.items || cartSummary.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty. Please add dishes from stalls first.' });
  }

  const primaryStallId = cartSummary.items[0].stallId;
  const stall = stalls.find(s => s.id === primaryStallId);

  const orderId = `ord-${Date.now()}`;
  const orderNum = `KK-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber: orderNum,
    userId,
    stallId: primaryStallId,
    addressId: addressId || 'addr-01',
    subtotal: cartSummary.subtotal,
    discountAmount: cartSummary.discount,
    deliveryFee: cartSummary.deliveryFee,
    taxAmount: 0,
    totalAmount: cartSummary.grandTotal,
    status: 'confirmed', // Order confirmed after Online payment / COD
    specialInstructions: specialInstructions || undefined,
    paymentMode: paymentMode === 'COD' ? 'COD' : 'ONLINE',
    paymentStatus: paymentMode === 'COD' ? 'PENDING' : 'PAID',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryPartnerId: 'usr-deliv-01',
    deliveryPartnerName: 'Ramesh Naik',
    deliveryPartnerPhone: '9740098765'
  };

  orders.unshift(newOrder);

  // Add line items
  cartSummary.items.forEach(ci => {
    orderItems.push({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      productId: ci.productId,
      quantity: ci.quantity,
      unitPrice: ci.price,
      totalPrice: ci.itemTotal,
      productName: ci.productName,
      productImageUrl: ci.productImage,
      isReviewed: false
    });
  });

  // Clear customer cart
  clearCart(userId);

  res.json({
    success: true,
    message: paymentMode === 'COD'
      ? '🎉 Order placed with Cash on Delivery!'
      : '🎉 Online payment successful! Order confirmed.',
    data: {
      ...newOrder,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      items: orderItems.filter(i => i.orderId === orderId)
    }
  });
});

// ---------------------------------------------------------------------------
// 1. GET /api/orders/my-orders - Customer's orders with tracking details
// ---------------------------------------------------------------------------
router.get('/my-orders', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userOrders = orders.filter(o => o.userId === userId);

  const enrichedOrders = userOrders.map(order => {
    const stall = stalls.find(s => s.id === order.stallId);
    const items = orderItems.filter(item => item.orderId === order.id).map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.name || item.productName,
        productImageUrl: product?.imageUrl
      };
    });

    const audit = getPickupAuditDetailsForOrder(order.id);

    return {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      stallImage: stall?.imageUrl,
      items,
      pickupAudit: audit
    };
  });

  // Sort latest first
  enrichedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: enrichedOrders
  });
});

// ---------------------------------------------------------------------------
// 2. GET /api/orders/vendor/my-orders - Vendor stall orders with OTP info
// ---------------------------------------------------------------------------
router.get('/vendor/my-orders', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const stallId = req.query.stallId as string;
  let filtered = [...orders];

  if (stallId) {
    filtered = filtered.filter(o => o.stallId === stallId);
  }

  const enriched = filtered.map(order => {
    const stall = stalls.find(s => s.id === order.stallId);
    const customer = users.find(u => u.id === order.userId);
    const items = orderItems.filter(i => i.orderId === order.id);

    // If order is ready_for_pickup, get or generate active OTP for vendor view
    let pickupOtp = null;
    if (order.status === 'ready_for_pickup') {
      const rec = getOrCreatePickupOtp(order.id, order.stallId);
      pickupOtp = {
        otpCode: rec.otpCode,
        expiresAt: rec.expiresAt,
        attempts: rec.attempts,
        remainingSeconds: Math.max(0, Math.floor((rec.expiresAt - Date.now()) / 1000))
      };
    }

    const audit = getPickupAuditDetailsForOrder(order.id);

    return {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      customerName: customer?.name || 'Belagavi Customer',
      customerPhone: customer?.phone || '9845012345',
      items,
      pickupOtp,
      pickupAudit: audit
    };
  });

  enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: enriched
  });
});

// ---------------------------------------------------------------------------
// 3. GET /api/orders/rider/my-deliveries - Assigned deliveries for Rider
// ---------------------------------------------------------------------------
router.get('/rider/my-deliveries', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const riderId = req.user!.id;

  // Filter orders assigned to rider or in active states
  const riderOrders = orders.filter(o => {
    if (o.deliveryPartnerId === riderId) return true;
    if (o.status === 'ready_for_pickup' || o.status === 'picked_up' || o.status === 'out_for_delivery') return true;
    return false;
  });

  const enriched = riderOrders.map(order => {
    const stall = stalls.find(s => s.id === order.stallId);
    const customer = users.find(u => u.id === order.userId);
    const items = orderItems.filter(i => i.orderId === order.id);
    const audit = getPickupAuditDetailsForOrder(order.id);

    // Explicitly DO NOT include plaintext otpCode for rider response
    const rec = pickupVerifications.get(order.id);
    const verificationState = {
      isVerified: order.status === 'picked_up' || order.status === 'out_for_delivery' || order.status === 'delivered',
      attempts: rec ? rec.attempts : 0,
      remainingAttempts: rec ? Math.max(0, 5 - rec.attempts) : 5,
      isExpired: rec ? Date.now() > rec.expiresAt : false
    };

    return {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      stallAddress: 'Khau Katta, Club Road, Belagavi 590001',
      stallContact: stall?.contactPhone || '+91 94480 11111',
      customerName: customer?.name || 'Pooja Kulkarni',
      customerPhone: customer?.phone || '9845012345',
      customerAddress: 'Flat 402, Sai Residency, Camp, Belagavi 590001',
      items,
      verificationState,
      pickupAudit: audit
    };
  });

  enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: enriched
  });
});

// ---------------------------------------------------------------------------
// 4. GET /api/orders/:id/pickup-otp - Authorized Vendor gets OTP for order
// ---------------------------------------------------------------------------
router.get('/:id/pickup-otp', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Generate or get existing OTP for vendor
  const rec = getOrCreatePickupOtp(order.id, order.stallId);

  res.json({
    success: true,
    data: {
      orderId: order.id,
      stallId: order.stallId,
      otpCode: rec.otpCode,
      expiresAt: rec.expiresAt,
      attempts: rec.attempts,
      isVerified: rec.isVerified,
      remainingSeconds: Math.max(0, Math.floor((rec.expiresAt - Date.now()) / 1000))
    }
  });
});

// ---------------------------------------------------------------------------
// 5. POST /api/orders/:id/pickup-otp/regenerate - Vendor regenerates 6-digit OTP
// ---------------------------------------------------------------------------
router.post('/:id/pickup-otp/regenerate', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const newRec = regeneratePickupOtp(order.id, order.stallId);

  res.json({
    success: true,
    message: 'New 6-digit Pickup OTP successfully generated for vendor.',
    data: {
      orderId: order.id,
      otpCode: newRec.otpCode,
      expiresAt: newRec.expiresAt,
      attempts: 0,
      remainingSeconds: 600
    }
  });
});

// ---------------------------------------------------------------------------
// 6. POST /api/orders/:id/pickup-otp/verify - Rider submits OTP to verify pickup
// ---------------------------------------------------------------------------
router.post('/:id/pickup-otp/verify', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { otp } = req.body;
  const riderId = req.user!.id;

  if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 6-digit numeric pickup OTP code.'
    });
  }

  const result = verifyPickupOtp(id, riderId, otp);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// ---------------------------------------------------------------------------
// 7. PATCH /api/orders/:id/status - Update Order Status with OTP enforcement
// ---------------------------------------------------------------------------
router.patch('/:id/status', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: Order['status'] };

  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const validStatuses: Order['status'][] = [
    'placed',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'picked_up',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status "${status}".` });
  }

  // Security enforcement: Cannot transition to 'picked_up' without OTP verification
  if (status === 'picked_up') {
    const rec = pickupVerifications.get(order.id);
    if (!rec || !rec.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Order pickup OTP has not been verified yet. The delivery partner must enter the 6-digit pickup OTP provided by the vendor.'
      });
    }
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  // If transition to ready_for_pickup, auto-generate OTP for vendor
  if (status === 'ready_for_pickup') {
    getOrCreatePickupOtp(order.id, order.stallId);
  }

  res.json({
    success: true,
    message: `Order status updated to "${status.replace('_', ' ')}".`,
    data: order
  });
});

// ---------------------------------------------------------------------------
// 8. GET /api/orders/:id - Single order details with pickup audit info
// ---------------------------------------------------------------------------
router.get('/:id', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const stall = stalls.find(s => s.id === order.stallId);
  const items = orderItems.filter(i => i.orderId === order.id);
  const audit = getPickupAuditDetailsForOrder(order.id);

  res.json({
    success: true,
    data: {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      items,
      pickupAudit: audit
    }
  });
});

export default router;
