import { Router, Request, Response } from 'express';
import {
  orders,
  orderItems,
  stalls,
  users,
  products,
  userAddresses,
  getUserCartSummary,
  clearCart
  ,getOrCreatePickupOtp,
  regeneratePickupOtp,
  getPickupAuditDetailsForOrder,
  revealPickupOtp,
  verifyPickupOtp,
  deliveries,
  createDeliveryForOrder,
  getOrCreateDeliveryOtp
} from '../data/db';
import { Order } from '../types';
import { authenticate, requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

function canManageStall(req: AuthRequest, stallId: string): boolean {
  if (req.user?.roleName === 'admin') return true;
  if (req.user?.roleName !== 'stall_owner') return false;
  return stalls.some(stall => stall.id === stallId && stall.ownerUserId === req.user!.id);
}

// POST /api/orders/checkout - Validate the cart and create one order per stall.
router.post('/checkout', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const {
    paymentMode = 'COD',
    addressId,
    specialInstructions,
    deliveryAddress,
    deliveryLatitude,
    deliveryLongitude,
    locationAccuracy,
    locationUpdatedAt
  } = req.body || {};

  if (paymentMode !== 'COD' && paymentMode !== 'ONLINE') {
    return res.status(400).json({ success: false, message: 'Select a valid payment method.' });
  }

  const cart = getUserCartSummary(userId);
  if (!cart.items.length) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  const address = addressId
    ? userAddresses.find(item => item.id === addressId && item.userId === userId)
    : userAddresses.find(item => item.userId === userId && item.isDefault);

  if (!address) {
    return res.status(400).json({ success: false, message: 'Please select a delivery address.' });
  }

  if ((deliveryLatitude !== undefined || deliveryLongitude !== undefined) &&
      (typeof deliveryLatitude !== 'number' || typeof deliveryLongitude !== 'number' ||
       deliveryLatitude < -90 || deliveryLatitude > 90 || deliveryLongitude < -180 || deliveryLongitude > 180)) {
    return res.status(400).json({ success: false, message: 'Delivery location coordinates are invalid.' });
  }

  const now = new Date().toISOString();
  const groups = new Map<string, typeof cart.items>();
  for (const item of cart.items) {
    if (!item.isAvailable) {
      return res.status(400).json({ success: false, message: `${item.productName} is currently unavailable.` });
    }
    const group = groups.get(item.stallId) || [];
    group.push(item);
    groups.set(item.stallId, group);
  }

  const createdOrders = [...groups.entries()].map(([stallId, items], groupIndex) => {
    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const deliveryFee = groupIndex === 0 ? cart.deliveryFee : 0;
    const order: Order = {
      id: `ord-${Date.now()}-${groupIndex}`,
      orderNumber: `KK-${Date.now().toString().slice(-8)}-${groupIndex + 1}`,
      userId,
      stallId,
      addressId: address.id,
      deliveryAddress: typeof deliveryAddress === 'string' && deliveryAddress.trim()
        ? deliveryAddress.trim()
        : `${address.addressLine1}, ${address.area}, ${address.city} - ${address.pincode}`,
      deliveryLatitude,
      deliveryLongitude,
      locationAccuracy: typeof locationAccuracy === 'number' ? locationAccuracy : undefined,
      locationUpdatedAt: typeof locationUpdatedAt === 'string' ? locationUpdatedAt : undefined,
      statusHistory: [{ status: 'placed', timestamp: now }],
      subtotal,
      discountAmount: cart.discount,
      deliveryFee,
      taxAmount: 0,
      totalAmount: subtotal + deliveryFee - cart.discount,
      status: 'placed',
      specialInstructions,
      createdAt: now,
      updatedAt: now,
      paymentMode,
      paymentStatus: paymentMode === 'ONLINE' ? 'PAID' : 'PENDING'
    };
    orders.push(order);
    createDeliveryForOrder(order, address);
    orderItems.push(...items.map(item => ({
      id: `oi-${order.id}-${item.productId}`,
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.itemTotal,
      productName: item.productName,
      productImageUrl: item.productImage
    })));
    return order;
  });

  clearCart(userId);
  return res.status(201).json({
    success: true,
    message: createdOrders.length > 1 ? 'Orders placed successfully.' : 'Order placed successfully.',
    data: createdOrders[0],
    orders: createdOrders
  });
});

// GET /api/orders/my-orders - Authenticated customer's orders
router.get('/my-orders', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userOrders = orders.filter(o => o.userId === userId);

  // Attach stall details and line items to each order
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

    return {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      stallImage: stall?.imageUrl,
      items
    };
  });

  // Sort latest first
  enrichedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: enrichedOrders
  });
});

router.get('/vendor/my-orders', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const stallId = typeof req.query.stallId === 'string' ? req.query.stallId : undefined;
  if (!stallId || !canManageStall(req, stallId)) {
    return res.status(403).json({ success: false, message: 'Only the authorized vendor or admin can view these orders.' });
  }
  const vendorOrders = orders
    .filter(order => order.stallId === stallId)
    .map(order => ({
      ...order,
      stallName: stalls.find(stall => stall.id === order.stallId)?.name,
      deliveryStatus: deliveries.find(item => item.orderId === order.id)?.status,
      assignedRiderName: deliveries.find(item => item.orderId === order.id)?.partnerName,
      assignedRiderId: deliveries.find(item => item.orderId === order.id)?.partnerId,
      items: orderItems.filter(item => item.orderId === order.id),
      pickupOtp: order.status === 'rider_arrived_at_vendor' && deliveries.find(item => item.orderId === order.id)?.status === 'arrived_at_vendor' ? (() => {
        const otp = getOrCreatePickupOtp(order.id, order.stallId);
        return { otpCode: revealPickupOtp(otp), expiresAt: otp.expiresAt, attempts: otp.attempts };
      })() : undefined,
      pickupAudit: getPickupAuditDetailsForOrder(order.id)
    }));
  return res.json({ success: true, data: vendorOrders });
});

router.get('/rider/my-deliveries', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  if (req.user!.roleName !== 'delivery_partner') {
    return res.status(403).json({ success: false, message: 'Only delivery partners can view assigned deliveries.' });
  }
  const assignedOrders = orders
    .filter(order => order.deliveryPartnerId === req.user!.id)
    .map(order => {
      const delivery = deliveries.find(item => item.orderId === order.id);
      return ({
      ...order,
      deliveryId: delivery?.id,
      assignmentStatus: delivery?.status,
      currentLat: delivery?.currentLat,
      currentLng: delivery?.currentLng,
      destinationLat: delivery?.destinationLat,
      destinationLng: delivery?.destinationLng,
      deliveryLastUpdated: delivery?.lastUpdated,
      stallName: stalls.find(stall => stall.id === order.stallId)?.name,
      items: orderItems.filter(item => item.orderId === order.id).map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      })),
      customerName: users.find(user => user.id === order.userId)?.name,
      customerAddress: order.deliveryAddress || userAddresses.find(address => address.id === order.addressId)?.area,
      pickupAudit: getPickupAuditDetailsForOrder(order.id)
      });
    });
  return res.json({ success: true, data: assignedOrders });
});

router.patch('/:id/status', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const order = orders.find(item => item.id === req.params.id);
  const allowed = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  if (!canManageStall(req, order.stallId)) {
    return res.status(403).json({ success: false, message: 'Only the authorized vendor or admin can update this order.' });
  }
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ success: false, message: 'Invalid order status.' });
  if (req.body.status === 'picked_up') return res.status(403).json({ success: false, message: 'Pickup requires successful OTP verification.' });
  order.status = req.body.status;
  order.updatedAt = new Date().toISOString();
  order.statusHistory = [...(order.statusHistory || []), { status: order.status, timestamp: order.updatedAt }];
  const delivery = deliveries.find(item => item.orderId === order.id);
  if (delivery && ['placed', 'confirmed', 'preparing', 'ready_for_pickup'].includes(req.body.status)) {
    delivery.status = req.body.status === 'ready_for_pickup' ? 'ready_for_pickup' : delivery.status;
    delivery.lastUpdated = order.updatedAt;
  }
  return res.json({ success: true, message: 'Order status updated.', data: order });
});

router.get('/:id/pickup-otp', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const order = orders.find(item => item.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  if (!canManageStall(req, order.stallId)) {
    return res.status(403).json({ success: false, message: 'Only the authorized vendor or admin can view the pickup OTP.' });
  }
  if (order.status !== 'rider_arrived_at_vendor') return res.status(409).json({ success: false, message: 'Pickup OTP is available once the assigned rider arrives at the stall.' });
  const otp = getOrCreatePickupOtp(order.id, order.stallId);
  return res.json({ success: true, data: { otpCode: revealPickupOtp(otp), expiresAt: otp.expiresAt, attempts: otp.attempts, remainingSeconds: Math.max(0, Math.floor((otp.expiresAt - Date.now()) / 1000)) } });
});

router.post('/:id/pickup-otp/regenerate', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const order = orders.find(item => item.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  if (!canManageStall(req, order.stallId)) {
    return res.status(403).json({ success: false, message: 'Only the authorized vendor or admin can regenerate the pickup OTP.' });
  }
  if (order.status !== 'rider_arrived_at_vendor') return res.status(409).json({ success: false, message: 'Pickup OTP is available once the assigned rider arrives at the stall.' });
  const otp = regeneratePickupOtp(order.id, order.stallId);
  return res.json({ success: true, data: { otpCode: revealPickupOtp(otp), expiresAt: otp.expiresAt } });
});

router.post('/:id/pickup-otp/verify', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const order = orders.find(item => item.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  if (req.user!.roleName !== 'delivery_partner') {
    return res.status(403).json({ success: false, message: 'Only the assigned delivery partner can verify pickup.' });
  }
  if (order.deliveryPartnerId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'This order is not assigned to you.' });
  }
  if (order.status !== 'rider_arrived_at_vendor') return res.status(409).json({ success: false, message: 'Rider must arrive at the vendor before pickup verification.' });
  const inputOtp = typeof req.body?.otp === 'string' ? req.body.otp : '';
  if (!/^\d{6}$/.test(inputOtp)) {
    return res.status(400).json({ success: false, message: 'Enter the 6-digit pickup OTP.' });
  }

  const result = verifyPickupOtp(order.id, req.user!.id, inputOtp);
  if (!result.success) return res.status(400).json(result);

  const delivery = deliveries.find(item => item.orderId === order.id);
  if (!delivery || delivery.partnerId !== req.user!.id || delivery.status !== 'arrived_at_vendor') {
    return res.status(409).json({ success: false, message: 'Rider must arrive at the vendor before pickup verification.' });
  }
  if (delivery) {
    delivery.status = 'pickup_verified';
    delivery.pickedUpAt = order.pickupVerifiedAt;
    delivery.lastUpdated = order.updatedAt;
  }
  if (result.order) {
    result.order.status = 'pickup_verified';
    result.order.statusHistory = [...(result.order.statusHistory || []), { status: 'pickup_verified', timestamp: result.order.updatedAt }];
  }
  return res.json({ success: true, message: 'Pickup verified successfully.', data: result.order, delivery });
});

router.get('/:id/delivery-otp', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const order = orders.find(item => item.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  if (req.user!.roleName !== 'customer' || order.userId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Only the customer who placed this order can view its Delivery OTP.' });
  }
  const record = getOrCreateDeliveryOtp(order.id);
  return res.json({ success: true, data: { otpCode: record.otpCode, expiresAt: record.expiresAt, remainingSeconds: Math.max(0, Math.floor((record.expiresAt - Date.now()) / 1000)) } });
});

// GET /api/orders/:id - Single order details
router.get('/:id', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Access check: User must own the order or be Admin/Delivery partner
  if (order.userId !== req.user!.id && req.user!.roleName === 'customer') {
    return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
  }

  const stall = stalls.find(s => s.id === order.stallId);
  const items = orderItems.filter(i => i.orderId === order.id);

  res.json({
    success: true,
    data: {
      ...order,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      items
    }
  });
});

export default router;
