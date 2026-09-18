import React, { useState, useEffect, useCallback } from 'react';
import { Review, ReviewRatingBreakdown } from '../../types';
import { getStallReviews, reportReview } from '../../services/api';
import { StarRating } from './StarRating';
import { WriteReviewModal } from './WriteReviewModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  MessageSquarePlus,
  SlidersHorizontal,
  Flag,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  ThumbsUp
} from 'lucide-react';

interface ReviewSectionProps {
  stallId: string;
  stallName: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ stallId, stallName }) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [breakdown, setBreakdown] = useState<ReviewRatingBreakdown | null>(null);
  const [sort, setSort] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStallReviews(stallId, sort, ratingFilter);
      setReviews(data.reviews);
      setBreakdown(data.breakdown);
    } finally {
      setLoading(false);
    }
  }, [stallId, sort, ratingFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      showToast('Please log in with your mobile number to write a review.', 'info');
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handleReport = async (reviewId: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    const reason = prompt('Why are you reporting this review? (e.g. spam, abusive language):');
    if (!reason) return;

    const res = await reportReview(reviewId, reason);
    if (res.success) {
      showToast('Review reported to Khau Katta moderation team.', 'info');
      loadReviews();
    }
  };

  return (
    <div className="space-y-8 bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs backdrop-blur-sm">
      {/* Header with Title & Write Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed7c2] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faebd7] text-[#93370d] rounded-full text-xs font-bold mb-1.5 border border-[#eed7c2]">
            <Sparkles size={12} className="text-[#c86228]" />
            <span>Community Feedback</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#2e1b10] tracking-tight">
            Customer Reviews &amp; Ratings
          </h3>
          <p className="text-xs text-[#735442]">
            Real experiences from verified Belagavi customers
          </p>
        </div>

        <button
          onClick={handleWriteReviewClick}
          className="px-5 py-2.5 bg-[#c86228] hover:bg-[#b0521e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Breakdown & Distribution Bars */}
      {breakdown && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 bg-[#fdf8f3] rounded-3xl border border-[#eed7c2]">
          {/* Left: Overall Score Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-[#fffdfb] rounded-2xl border border-[#eed7c2] shadow-xs">
            <span className="text-4xl sm:text-5xl font-black text-[#2e1b10] leading-none mb-2">
              {breakdown.averageRating > 0 ? breakdown.averageRating.toFixed(1) : '5.0'}
            </span>
            <StarRating rating={breakdown.averageRating} size={20} />
            <p className="text-xs text-[#735442] font-medium mt-2">
              Based on <strong>{breakdown.totalReviews} verified reviews</strong>
            </p>
          </div>

          {/* Right: 5-Star Distribution Percentages */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = breakdown.counts[stars as keyof typeof breakdown.counts] || 0;
              const pct = breakdown.percentages[stars as keyof typeof breakdown.percentages] || 0;
              const isFiltered = ratingFilter === stars;

              return (
                <button
                  key={stars}
                  onClick={() => setRatingFilter(isFiltered ? undefined : stars)}
                  className={`flex items-center gap-3 text-xs text-[#735442] hover:text-[#2e1b10] transition-colors w-full group cursor-pointer ${
                    isFiltered ? 'font-bold text-[#c86228]' : ''
                  }`}
                >
                  <span className="w-12 text-right flex items-center justify-end gap-1 font-semibold">
                    <span>{stars}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                  </span>

                  <div className="flex-1 h-3 bg-[#eed7c2]/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stars >= 4 ? 'bg-[#c86228]' : stars === 3 ? 'bg-amber-500' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="w-14 text-right text-[#9c7f6e] font-mono text-[11px]">
                    {pct}% ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sorting & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#9c7f6e]" />
          <span className="text-xs font-bold text-[#2e1b10]">Sort Reviews:</span>
          <div className="inline-flex rounded-xl border border-[#eed7c2] p-1 bg-[#fdf8f3] text-xs">
            <button
              onClick={() => setSort('recent')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                sort === 'recent' ? 'bg-[#fffdfb] shadow-xs text-[#c86228] font-bold' : 'text-[#735442] hover:text-[#2e1b10]'
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSort('highest')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                sort === 'highest' ? 'bg-[#fffdfb] shadow-xs text-[#c86228] font-bold' : 'text-[#735442] hover:text-[#2e1b10]'
              }`}
            >
              Highest Rated
            </button>
            <button
              onClick={() => setSort('lowest')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                sort === 'lowest' ? 'bg-[#fffdfb] shadow-xs text-[#c86228] font-bold' : 'text-[#735442] hover:text-[#2e1b10]'
              }`}
            >
              Lowest Rated
            </button>
          </div>
        </div>

        {ratingFilter && (
          <button
            onClick={() => setRatingFilter(undefined)}
            className="text-xs text-[#c86228] font-bold hover:underline cursor-pointer"
          >
            Clear {ratingFilter}-Star Filter
          </button>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-32 bg-[#faebd7]/50 rounded-2xl animate-pulse border border-[#eed7c2]" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#fffdfb] border border-[#eed7c2] space-y-3 transition-all hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-[#eed7c2] shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#2e1b10]">
                        {rev.userName || 'Belagavi Customer'}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#e8f5ec] text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 size={10} /> Verified Purchase
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#9c7f6e] mt-0.5">
                      <Calendar size={11} />
                      <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {rev.productName && (
                        <span>• Reviewed: <strong className="text-[#52392a]">{rev.productName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={rev.rating} size={14} />
                  <button
                    onClick={() => handleReport(rev.id)}
                    className="text-[#9c7f6e] hover:text-rose-600 p-1 text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Report review"
                  >
                    <Flag size={12} />
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-[#52392a] leading-relaxed pl-1">
                {rev.comment}
              </p>

              {/* Review Images */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex gap-2 pt-1 pl-1">
                  {rev.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 rounded-xl overflow-hidden border border-[#eed7c2] hover:opacity-90 transition-opacity"
                    >
                      <img src={img} alt="Customer upload" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-[#735442] text-xs bg-[#fdf8f3] rounded-3xl border border-[#eed7c2]">
          No reviews found for this selection. Be the first verified customer to share your thoughts!
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        stallId={stallId}
        stallName={stallName}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onReviewSubmitted={loadReviews}
      />
    </div>
  );
};
