import { Router, Request, Response } from 'express';
import { products, stalls, getProductRating } from '../data/db';

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

export default router;
