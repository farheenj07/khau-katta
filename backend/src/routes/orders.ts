import { Router, Response } from 'express';
import { orders, orderItems, stalls, products } from '../data/db';
import { authenticate, requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

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
