import { Router, Request, Response } from 'express';
import {
  products,
  stalls,
  getProductRating,
  createProduct,
  updateProduct,
  toggleProductAvailability,
  deleteProduct
} from '../data/db';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

function canManageProduct(req: AuthRequest, stallId: string): boolean {
  if (req.user?.roleName === 'admin') return true;
  return req.user?.roleName === 'stall_owner' && stalls.some(stall => stall.id === stallId && stall.ownerUserId === req.user!.id);
}

// GET /api/products - with dynamic product ratings
router.get('/', (req: AuthRequest, res: Response) => {
  const { stallId, search, isAvailable } = req.query;

  let results = [...products];

  if (req.user?.roleName === 'stall_owner') {
    const assignedStallId = stalls.find(stall => stall.ownerUserId === req.user!.id)?.id;
    if (!assignedStallId) return res.json({ success: true, total: 0, data: [] });
    results = results.filter(product => product.stallId === assignedStallId);
  }

  if (stallId) {
    results = results.filter(p => p.stallId === stallId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (isAvailable !== undefined) {
    const availVal = isAvailable === 'true';
    results = results.filter(p => p.isAvailable === availVal);
  }

  const enrichedProducts = results.map(p => {
    const stall = stalls.find(s => s.id === p.stallId);
    const { averageRating, reviewCount } = getProductRating(p.id);

    return {
      ...p,
      stallName: stall?.name,
      stallNumber: stall?.stallNumber,
      rating: averageRating,
      reviewCount
    };
  });

  res.json({
    success: true,
    total: enrichedProducts.length,
    data: enrichedProducts
  });
});

router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { stallId, name, description, price } = req.body || {};
  if (!stallId || !name?.trim() || price === undefined || Number(price) < 0) {
    return res.status(400).json({ success: false, message: 'Stall, item name, and valid price are required.' });
  }
  if (!stalls.some(stall => stall.id === stallId)) {
    return res.status(404).json({ success: false, message: 'Stall not found.' });
  }
  if (!canManageProduct(req, stallId)) return res.status(403).json({ success: false, message: 'You are not authorized to manage products for this stall.' });
  const product = createProduct({ ...req.body, price: Number(price) });
  return res.status(201).json({ success: true, message: 'Menu item created.', data: product });
});

router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const existing = products.find(item => item.id === req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
  if (!canManageProduct(req, existing.stallId)) return res.status(403).json({ success: false, message: 'You are not authorized to manage this product.' });
  const product = updateProduct(req.params.id, req.body || {});
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  return res.json({ success: true, message: 'Menu item updated.', data: product });
});

router.patch('/:id/availability', requireAuth, (req: AuthRequest, res: Response) => {
  if (typeof req.body?.isAvailable !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isAvailable boolean flag is required.' });
  }
  const existing = products.find(item => item.id === req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
  if (!canManageProduct(req, existing.stallId)) return res.status(403).json({ success: false, message: 'You are not authorized to manage this product.' });
  const product = toggleProductAvailability(req.params.id, req.body.isAvailable);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  return res.json({ success: true, message: 'Availability updated.', data: product });
});

router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const existing = products.find(item => item.id === req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
  if (!canManageProduct(req, existing.stallId)) return res.status(403).json({ success: false, message: 'You are not authorized to manage this product.' });
  const result = deleteProduct(req.params.id);
  return res.status(result.success ? 200 : 404).json(result);
});

export default router;
