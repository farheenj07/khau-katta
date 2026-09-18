import { Router, Request, Response } from 'express';
import { adminStats, stalls, products, categories, users, reviews, reviewReports, getStallRating } from '../data/db';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/stats
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      ...adminStats,
      totalReviews: reviews.length,
      pendingReports: reviewReports.filter(r => r.status === 'PENDING').length,
      stallsList: stalls.map(s => {
        const { averageRating, reviewCount } = getStallRating(s.id);
        return {
          id: s.id,
          name: s.name,
          stallNumber: s.stallNumber,
          category: categories.find(c => c.id === s.categoryId)?.name,
          rating: averageRating,
          reviewCount,
          isOpen: s.isOpen,
          contactPhone: s.contactPhone
        };
      }),
      recentUsers: users
    }
  });
});

export default router;
