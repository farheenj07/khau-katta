import { Router, Request, Response } from 'express';
import {
  stalls,
  categories,
  products,
  orders,
  getStallRating,
  createStall,
  updateStall,
  toggleStallStatus,
<<<<<<< HEAD
  toggleStallOpenStatus,
=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  deleteStall,
  hasStallOrders
} from '../data/db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/stalls - list stalls with dynamic rating calculations and order/product counts
router.get('/', (req: Request, res: Response) => {
  const { category, search, isOpen, featured, status, includeInactive } = req.query;

  let results = [...stalls];

  // If not explicitly including inactive (e.g., admin queries), filter out INACTIVE stalls for public storefront
  if (includeInactive !== 'true') {
    results = results.filter(s => s.isActive !== false && s.status !== 'INACTIVE');
  } else if (status) {
    results = results.filter(s => s.status === status);
  }

  if (category) {
    const categorySlugOrId = String(category).toLowerCase();
    const matchedCategory = categories.find(
      c => c.slug === categorySlugOrId || c.id === categorySlugOrId || c.name.toLowerCase() === categorySlugOrId
    );
    if (matchedCategory) {
      results = results.filter(s => s.categoryId === matchedCategory.id);
    }
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.stallNumber.toLowerCase().includes(q)
    );
  }

  if (isOpen !== undefined) {
    const openVal = isOpen === 'true';
    results = results.filter(s => s.isOpen === openVal);
  }

  if (featured !== undefined) {
    const featuredVal = featured === 'true';
    results = results.filter(s => s.isFeatured === featuredVal);
  }

  // Calculate dynamic ratings and attach category & counts data
  const enrichedStalls = results.map(stall => {
    const { averageRating, reviewCount } = getStallRating(stall.id);
    const productCount = products.filter(p => p.stallId === stall.id).length;
    const orderCount = orders.filter(o => o.stallId === stall.id).length;

    return {
      ...stall,
      rating: averageRating,
      reviewCount,
      productCount,
      orderCount,
      category: categories.find(c => c.id === stall.categoryId)
    };
  });

  res.json({
    success: true,
    total: enrichedStalls.length,
    data: enrichedStalls
  });
});

// GET /api/stalls/:id - stall details with dynamic rating and full products
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const stall = stalls.find(s => s.id === id || s.slug === id);

  if (!stall) {
    return res.status(404).json({
      success: false,
      message: `Stall '${id}' not found`
    });
  }

  const category = categories.find(c => c.id === stall.categoryId);
  const stallProducts = products.filter(p => p.stallId === stall.id);
  const { averageRating, reviewCount } = getStallRating(stall.id);
  const orderCount = orders.filter(o => o.stallId === stall.id).length;

  res.json({
    success: true,
    data: {
      ...stall,
      rating: averageRating,
      reviewCount,
      productCount: stallProducts.length,
      orderCount,
      category,
      products: stallProducts
    }
  });
});

// POST /api/stalls - Create a new stall (Admin only)
router.post('/', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
  const {
    name,
    categoryId,
    stallNumber,
    shortDescription,
    description,
    imageUrl,
    bannerUrl,
    openingTime,
    closingTime,
    contactPhone,
    location,
    isOpen,
    isActive
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Stall name is required.'
    });
  }

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Stall category is required.'
    });
  }

  const newStall = createStall({
    name: name.trim(),
    categoryId,
    stallNumber: stallNumber?.trim(),
    shortDescription: shortDescription?.trim(),
    description: description?.trim(),
    imageUrl: imageUrl?.trim(),
    bannerUrl: bannerUrl?.trim() || imageUrl?.trim(),
    openingTime: openingTime?.trim() || '10:00 AM',
    closingTime: closingTime?.trim() || '10:00 PM',
    contactPhone: contactPhone?.trim() || '+91 94480 00000',
    location: location?.trim() || 'Khau Katta Food Street, Camp, Belagavi 590001',
    isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    status: isActive === false ? 'INACTIVE' : 'ACTIVE'
  });

  const category = categories.find(c => c.id === newStall.categoryId);

  res.status(201).json({
    success: true,
    message: `Stall "${newStall.name}" created successfully.`,
    data: {
      ...newStall,
      rating: 5.0,
      reviewCount: 0,
      productCount: 0,
      orderCount: 0,
      category
    }
  });
});

// PUT /api/stalls/:id - Update stall details & photo (Admin only)
router.put('/:id', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = stalls.find(s => s.id === id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Stall not found.'
    });
  }

  const updated = updateStall(id, req.body);
  if (!updated) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update stall.'
    });
  }

  const category = categories.find(c => c.id === updated.categoryId);
  const { averageRating, reviewCount } = getStallRating(updated.id);
  const productCount = products.filter(p => p.stallId === updated.id).length;
  const orderCount = orders.filter(o => o.stallId === updated.id).length;

  res.json({
    success: true,
    message: `Stall "${updated.name}" updated successfully.`,
    data: {
      ...updated,
      rating: averageRating,
      reviewCount,
      productCount,
      orderCount,
      category
    }
  });
});

// PATCH /api/stalls/:id/status - Activate or Deactivate stall (Admin only)
router.patch('/:id/status', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (isActive === undefined) {
    return res.status(400).json({
      success: false,
      message: 'isActive boolean flag is required.'
    });
  }

  const updated = toggleStallStatus(id, Boolean(isActive));
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Stall not found.'
    });
  }

  res.json({
    success: true,
    message: `Stall is now ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}.`,
    data: updated
  });
});

<<<<<<< HEAD
// PATCH /api/stalls/:id/toggle-open - Toggle shop Open/Closed status
router.patch('/:id/toggle-open', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isOpen } = req.body;

  if (isOpen === undefined) {
    return res.status(400).json({
      success: false,
      message: 'isOpen boolean flag is required.'
    });
  }

  const updated = toggleStallOpenStatus(id, Boolean(isOpen));
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Stall not found.'
    });
  }

  res.json({
    success: true,
    message: `Stall status updated to ${updated.isOpen ? 'OPEN' : 'CLOSED'}.`,
    data: updated
  });
});

=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
// DELETE /api/stalls/:id - Delete stall where safe (Admin only)
router.delete('/:id', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
  const { id } = req.params;

  const result = deleteStall(id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  res.json({
    success: true,
    message: 'Stall has been safely deleted.'
  });
});

export default router;
