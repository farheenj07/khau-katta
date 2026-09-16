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

const router = Router();

// GET /api/products - with dynamic product ratings
router.get('/', (req: Request, res: Response) => {
  const { stallId, search, isAvailable } = req.query;

  let results = [...products];

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

// POST /api/products - Create a new menu item
router.post('/', (req: Request, res: Response) => {
  const { name, stallId, price } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Product name is required.'
    });
  }

  if (!stallId) {
    return res.status(400).json({
      success: false,
      message: 'Stall ID is required.'
    });
  }

  if (price === undefined || isNaN(Number(price))) {
    return res.status(400).json({
      success: false,
      message: 'Valid price is required.'
    });
  }

  const newProd = createProduct({
    ...req.body,
    price: Number(price)
  });

  res.status(201).json({
    success: true,
    message: `Menu item "${newProd.name}" added successfully.`,
    data: newProd
  });
});

// PUT /api/products/:id - Edit an existing menu item
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const updated = updateProduct(id, req.body);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.'
    });
  }

  res.json({
    success: true,
    message: `Menu item "${updated.name}" updated successfully.`,
    data: updated
  });
});

// PATCH /api/products/:id/availability - Toggle item availability (In Stock / Out of Stock)
router.patch('/:id/availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  if (isAvailable === undefined) {
    return res.status(400).json({
      success: false,
      message: 'isAvailable boolean flag is required.'
    });
  }

  const updated = toggleProductAvailability(id, Boolean(isAvailable));
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.'
    });
  }

  res.json({
    success: true,
    message: `Item availability updated to ${updated.isAvailable ? 'In Stock' : 'Out of Stock'}.`,
    data: updated
  });
});

// DELETE /api/products/:id - Delete a menu item
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const result = deleteProduct(id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  res.json({
    success: true,
    message: 'Menu item deleted successfully.'
  });
});

export default router;
