import { Router, Request, Response } from 'express';
import { categories } from '../data/db';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: categories.sort((a, b) => a.displayOrder - b.displayOrder)
  });
});

export default router;
