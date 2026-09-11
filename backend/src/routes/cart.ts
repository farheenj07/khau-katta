import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getUserCartSummary,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from '../data/db';

const router = Router();

// Protect all cart routes for the authenticated customer
router.use(requireAuth);

// GET /api/cart - Get current user's cart
router.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const cartSummary = getUserCartSummary(user.id);
  res.json({
    success: true,
    data: cartSummary
  });
});

// POST /api/cart/items - Add item to cart
router.post('/items', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { productId, quantity = 1 } = req.body;

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required.'
    });
  }

  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive integer.'
    });
  }

  const result = addToCart(user.id, productId, parsedQty);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message || 'Failed to add item to cart.'
    });
  }

  res.json({
    success: true,
    message: 'Item added to cart.',
    data: result.cart
  });
});

// PUT /api/cart/items/:productId - Update item quantity
router.put('/items/:productId', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(parseInt(quantity, 10))) {
    return res.status(400).json({
      success: false,
      message: 'Valid quantity number is required.'
    });
  }

  const parsedQty = parseInt(quantity, 10);
  const result = updateCartItemQuantity(user.id, productId, parsedQty);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message || 'Failed to update item quantity.'
    });
  }

  res.json({
    success: true,
    message: parsedQty <= 0 ? 'Item removed from cart.' : 'Cart item quantity updated.',
    data: result.cart
  });
});

// DELETE /api/cart/items/:productId - Remove item from cart
router.delete('/items/:productId', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { productId } = req.params;

  const result = removeFromCart(user.id, productId);
  res.json({
    success: true,
    message: 'Item removed from cart.',
    data: result.cart
  });
});

// DELETE /api/cart - Clear entire cart
router.delete('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = clearCart(user.id);
  res.json({
    success: true,
    message: 'Cart cleared.',
    data: result.cart
  });
});

export default router;
