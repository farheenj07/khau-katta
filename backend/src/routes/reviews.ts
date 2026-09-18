import { Router, Request, Response } from 'express';
import {
  reviews,
  orders,
  orderItems,
  stalls,
  products,
  users,
  reviewReports,
  getRatingBreakdown,
  getStallRating
} from '../data/db';
import { authenticate, requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { Review, ReviewStatus } from '../types';

const router = Router();

// 1. Get Reviews for a Stall (Public)
router.get('/stall/:stallId', (req: Request, res: Response) => {
  const { stallId } = req.params;
  const { sort = 'recent', rating } = req.query;

  let stallReviews = reviews.filter(r => r.stallId === stallId && r.status === 'ACTIVE');

  if (rating) {
    const rNum = Number(rating);
    stallReviews = stallReviews.filter(r => r.rating === rNum);
  }

  // Sorting
  if (sort === 'highest') {
    stallReviews.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'lowest') {
    stallReviews.sort((a, b) => a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // Recent by default
    stallReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const breakdown = getRatingBreakdown(stallId);

  res.json({
    success: true,
    data: {
      reviews: stallReviews,
      breakdown
    }
  });
});

// 2. Get Eligible Items to Review for Authenticated Customer
router.get('/eligible-items', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Find all delivered orders for this user
  const deliveredOrders = orders.filter(o => o.userId === userId && o.status === 'delivered');
  const deliveredOrderIds = deliveredOrders.map(o => o.id);

  // Find all items in these orders
  const customerItems = orderItems.filter(item => deliveredOrderIds.includes(item.orderId));

  // Check which items haven't been reviewed yet
  const eligibleItems = customerItems.map(item => {
    const order = deliveredOrders.find(o => o.id === item.orderId)!;
    const stall = stalls.find(s => s.id === order.stallId);
    const product = products.find(p => p.id === item.productId);
    const existingReview = reviews.find(r => r.orderItemId === item.id && r.userId === userId);

    return {
      orderItemId: item.id,
      orderId: item.orderId,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      stallId: order.stallId,
      stallName: stall?.name,
      productId: item.productId,
      productName: product?.name || item.productName,
      productImage: product?.imageUrl,
      price: item.unitPrice,
      isReviewed: Boolean(existingReview),
      reviewId: existingReview?.id
    };
  });

  res.json({
    success: true,
    data: eligibleItems
  });
});

// 3. Customer Writes a Review (VERIFIED PURCHASE VALIDATION)
router.post('/', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { orderId, orderItemId, stallId, productId, rating, comment, images } = req.body;

  // 1. Basic validation
  if (!stallId || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Stall ID, star rating (1-5), and written comment are required.'
    });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5 stars.'
    });
  }

  // 2. VERIFIED PURCHASE CHECK
  // Check that the user actually received a delivered order from this stall
  const userDeliveredOrders = orders.filter(
    o => o.userId === userId && o.stallId === stallId && o.status === 'delivered'
  );

  if (userDeliveredOrders.length === 0) {
    return res.status(403).json({
      success: false,
      message: 'Verified Purchase Required: You can only review stalls after completing an order that has been delivered.'
    });
  }

  // 3. Specific Order Item duplication check
  let targetOrderId = orderId;
  let targetOrderItemId = orderItemId;

  if (orderItemId) {
    // Check if this item exists and belongs to a delivered order of this user
    const item = orderItems.find(i => i.id === orderItemId);
    if (!item) {
      return res.status(400).json({ success: false, message: 'Invalid order item ID.' });
    }

    const order = orders.find(o => o.id === item.orderId && o.userId === userId && o.status === 'delivered');
    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'Order item does not belong to a delivered order placed by your account.'
      });
    }

    // Check if already reviewed
    const alreadyReviewed = reviews.some(r => r.orderItemId === orderItemId && r.userId === userId);
    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a review for this purchased item.'
      });
    }

    targetOrderId = order.id;
  } else {
    // If no order item specified, pick the most recent delivered order for this stall
    targetOrderId = userDeliveredOrders[0].id;
    // Prevent duplicate general stall reviews from same order
    const alreadyReviewedOrder = reviews.some(r => r.orderId === targetOrderId && r.userId === userId && !r.productId);
    if (alreadyReviewedOrder) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed your recent order from this stall.'
      });
    }
  }

  const stall = stalls.find(s => s.id === stallId);
  const product = productId ? products.find(p => p.id === productId) : undefined;

  const newReview: Review = {
    id: `rev-${Date.now().toString().slice(-6)}`,
    orderId: targetOrderId,
    orderItemId: targetOrderItemId,
    userId,
    userName: req.user!.name,
    userAvatar: req.user!.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    stallId,
    stallName: stall?.name,
    productId,
    productName: product?.name,
    rating: numRating,
    comment: comment.trim(),
    status: 'ACTIVE',
    images: Array.isArray(images) ? images : images ? [images] : [],
    createdAt: new Date().toISOString()
  };

  reviews.unshift(newReview);

  // Mark orderItem as reviewed
  if (targetOrderItemId) {
    const matchedItem = orderItems.find(i => i.id === targetOrderItemId);
    if (matchedItem) matchedItem.isReviewed = true;
  }

  res.status(201).json({
    success: true,
    message: 'Thank you! Your verified purchase review has been published.',
    data: newReview,
    updatedStallRating: getStallRating(stallId)
  });
});

// 4. Customer's Own Reviews
router.get('/my-reviews', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const userReviews = reviews.filter(r => r.userId === req.user!.id);
  res.json({
    success: true,
    data: userReviews
  });
});

// 5. Customer Reports Inappropriate Review
router.post('/:id/report', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const review = reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  const report = {
    id: `rep-${Date.now().toString().slice(-6)}`,
    reviewId: id,
    reportedByUserId: req.user!.id,
    reason: reason || 'Inappropriate or offensive content',
    status: 'PENDING' as const,
    createdAt: new Date().toISOString()
  };

  reviewReports.push(report);
  review.status = 'REPORTED';

  res.json({
    success: true,
    message: 'Review reported to Khau Katta moderation team for audit.'
  });
});

// 6. ADMIN REVIEW MANAGEMENT (View all, search, filter, moderate)
router.get('/admin/all', authenticate, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const { stallId, rating, status, search } = req.query;

  let list = [...reviews];

  if (stallId) {
    list = list.filter(r => r.stallId === stallId);
  }

  if (rating) {
    list = list.filter(r => r.rating === Number(rating));
  }

  if (status) {
    list = list.filter(r => r.status === String(status).toUpperCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(r =>
      (r.userName && r.userName.toLowerCase().includes(q)) ||
      (r.stallName && r.stallName.toLowerCase().includes(q)) ||
      r.comment.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    total: list.length,
    data: list,
    reportsCount: reviewReports.filter(r => r.status === 'PENDING').length
  });
});

// 7. ADMIN MODERATION ACTION (HIDE, REMOVE, RESTORE, ACTIVE)
router.put('/admin/:id/status', authenticate, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const validStatuses: ReviewStatus[] = ['ACTIVE', 'HIDDEN', 'REPORTED', 'REMOVED'];
  const newStatus = String(status).toUpperCase() as ReviewStatus;

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const review = reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  review.status = newStatus;
  review.moderationReason = reason || `Status set to ${newStatus} by Admin`;
  review.moderatedByUserId = req.user!.id;
  review.moderatedAt = new Date().toISOString();
  review.updatedAt = new Date().toISOString();

  // If reports exist for this review, mark them resolved
  reviewReports.filter(r => r.reviewId === id).forEach(r => (r.status = 'RESOLVED'));

  res.json({
    success: true,
    message: `Review #${id} status updated to ${newStatus}. Dynamic stall ratings refreshed.`,
    data: review,
    updatedStallRating: getStallRating(review.stallId)
  });
});

export default router;
