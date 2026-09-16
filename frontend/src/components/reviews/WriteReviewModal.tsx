import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { submitReview, getEligibleItems } from '../../services/api';
import { StarRating } from './StarRating';
import { EligibleReviewItem } from '../../types';
import { X, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles, ShoppingBag } from 'lucide-react';

interface WriteReviewModalProps {
  stallId: string;
  stallName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  stallId,
  stallName,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eligibleItems, setEligibleItems] = useState<EligibleReviewItem[]>([]);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingEligible, setFetchingEligible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && token) {
      setFetchingEligible(true);
      getEligibleItems(token)
        .then(items => {
          // Filter items specifically for this stall that haven't been reviewed
          const stallItems = items.filter(i => i.stallId === stallId);
          setEligibleItems(stallItems);
          const unreviewed = stallItems.find(i => !i.isReviewed);
          if (unreviewed) {
            setSelectedOrderItemId(unreviewed.orderItemId);
          }
        })
        .finally(() => setFetchingEligible(false));
    }
  }, [isOpen, stallId, token]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!comment.trim()) {
      setErrorMessage('Please write a short review sharing your experience.');
      return;
    }

    setLoading(true);
    try {
      const selectedItem = eligibleItems.find(i => i.orderItemId === selectedOrderItemId);

      const res = await submitReview(
        {
          stallId,
          orderId: selectedItem?.orderId,
          orderItemId: selectedItem?.orderItemId,
          productId: selectedItem?.productId,
          rating,
          comment: comment.trim(),
          images: imageUrl.trim() ? [imageUrl.trim()] : []
        },
        token || undefined
      );

      if (res.success) {
        showToast('Review submitted successfully! Thank you.', 'success');
        onReviewSubmitted();
        onClose();
      } else {
        setErrorMessage(res.message || 'Failed to submit review.');
      }
    } catch {
      setErrorMessage('Network error submitting review.');
    } finally {
      setLoading(false);
    }
  };

  const hasDeliveredOrders = eligibleItems.length > 0;
  const allAlreadyReviewed = hasDeliveredOrders && eligibleItems.every(i => i.isReviewed);

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#fff8f2] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-[#f0bd9b] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#7c4d2e] hover:text-[#3c1e0a] rounded-full hover:bg-[#fff0e2]"
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fffdfb] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-[#eed7c2] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#9c7f6e] hover:text-[#2e1b10] rounded-full hover:bg-[#faebd7]/60"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
<<<<<<< HEAD
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff0e2] text-[#b85018] border border-[#f0bd9b] rounded-full text-xs font-bold mb-2">
            <CheckCircle2 size={13} className="text-[#b85018]" />
            <span>Verified Belagavi Buyer Review</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3c1e0a] tracking-tight">
            Review {stallName}
          </h2>
          <p className="text-xs text-[#7c4d2e] mt-0.5">
=======
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faebd7] text-[#93370d] border border-[#eed7c2] rounded-full text-xs font-bold mb-2">
            <CheckCircle2 size={13} className="text-[#c86228]" />
            <span>Verified Belagavi Buyer Review</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2e1b10] tracking-tight">
            Review {stallName}
          </h2>
          <p className="text-xs text-[#735442] mt-0.5">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            Help other Belagavi locals discover the best stalls and dishes.
          </p>
        </div>

        {fetchingEligible ? (
<<<<<<< HEAD
          <div className="py-8 text-center text-xs text-[#7c4d2e] animate-pulse">
            Verifying your delivered purchases from {stallName}...
          </div>
        ) : !hasDeliveredOrders ? (
          <div className="p-6 bg-[#fff0e2] rounded-3xl border border-[#f0bd9b] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fff8f2] text-[#b85018] mx-auto flex items-center justify-center border border-[#f0bd9b]">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#3c1e0a]">Verified Purchase Required</h3>
            <p className="text-xs text-[#7c4d2e] max-w-sm mx-auto leading-relaxed">
              To keep Khau Katta ratings authentic, reviews can only be submitted by customers who placed an order from <strong>{stallName}</strong> and received home delivery.
            </p>
            <div className="pt-2 text-[11px] text-[#b85018] font-medium">
=======
          <div className="py-8 text-center text-xs text-[#735442] animate-pulse">
            Verifying your delivered purchases from {stallName}...
          </div>
        ) : !hasDeliveredOrders ? (
          <div className="p-6 bg-[#fdf8f3] rounded-3xl border border-[#eed7c2] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#faebd7] text-[#c86228] mx-auto flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-sm font-bold text-[#2e1b10]">Verified Purchase Required</h3>
            <p className="text-xs text-[#735442] max-w-sm mx-auto leading-relaxed">
              To keep Khau Katta ratings authentic, reviews can only be submitted by customers who placed an order from <strong>{stallName}</strong> and received home delivery.
            </p>
            <div className="pt-2 text-[11px] text-[#93370d] font-medium">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              Tip: Log in as <strong>Pooja Kulkarni (9845012345)</strong> in the Role bar or Login modal to test a verified delivered purchase.
            </div>
          </div>
        ) : allAlreadyReviewed ? (
          <div className="p-6 bg-[#e8f5ec] rounded-3xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
<<<<<<< HEAD
            <h3 className="font-serif text-sm font-bold text-[#3c1e0a]">You&apos;ve Reviewed All Your Purchases!</h3>
=======
            <h3 className="text-sm font-bold text-[#2e1b10]">You&apos;ve Reviewed All Your Purchases!</h3>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            <p className="text-xs text-emerald-800 leading-relaxed">
              You have already submitted reviews for all delivered items from {stallName}. Thank you for your feedback!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
<<<<<<< HEAD
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-rose-600" />
=======
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Select Eligible Purchased Item */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5">
=======
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                Select Delivered Item to Review
              </label>
              <select
                value={selectedOrderItemId}
                onChange={e => setSelectedOrderItemId(e.target.value)}
<<<<<<< HEAD
                className="w-full text-xs p-2.5 bg-[#fff0e2] rounded-xl border border-[#f0bd9b] font-medium text-[#3c1e0a] focus:border-[#b85018] focus:outline-none"
=======
                className="w-full text-xs p-2.5 bg-[#fdf8f3] rounded-xl border border-[#eed7c2] font-medium text-[#2e1b10] focus:border-[#c86228] focus:outline-none"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              >
                {eligibleItems.map(item => (
                  <option
                    key={item.orderItemId}
                    value={item.orderItemId}
                    disabled={item.isReviewed}
                  >
                    {item.productName || 'Order Item'} ({item.orderNumber}) {item.isReviewed ? '— [Already Reviewed]' : '— [Eligible]'}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Star Rating */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5">
                Your Overall Rating
              </label>
              <div className="flex items-center gap-3 p-3 bg-[#fff0e2] rounded-2xl border border-[#f0bd9b]">
=======
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
                Your Overall Rating
              </label>
              <div className="flex items-center gap-3 p-3 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                <StarRating
                  rating={rating}
                  interactive={true}
                  onRatingChange={setRating}
                  size={26}
                />
<<<<<<< HEAD
                <span className="text-xs font-bold text-[#b85018]">
=======
                <span className="text-xs font-bold text-[#93370d]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  {rating === 5 ? '5.0 — Excellent!' : rating === 4 ? '4.0 — Very Good' : rating === 3 ? '3.0 — Average' : rating === 2 ? '2.0 — Needs Improvement' : '1.0 — Poor'}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5">
=======
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                Written Review
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the taste, packaging, and freshness? What do you recommend ordering?"
<<<<<<< HEAD
                className="w-full p-3 bg-[#fff0e2] rounded-2xl text-xs sm:text-sm text-[#3c1e0a] border border-[#f0bd9b] focus:border-[#b85018] focus:bg-[#fff8f2] focus:outline-none transition-all placeholder:text-[#7c4d2e]/60"
=======
                className="w-full p-3 bg-[#fdf8f3] rounded-2xl text-xs sm:text-sm text-[#2e1b10] border border-[#eed7c2] focus:border-[#c86228] focus:bg-[#fffdfb] focus:outline-none transition-all placeholder:text-[#9c7f6e]/70"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              />
            </div>

            {/* Optional Photo URL */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5 flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#7c4d2e]" />
                <span>Add Photo URL <span className="font-normal text-[#7c4d2e]">(optional)</span></span>
=======
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5 flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#9c7f6e]" />
                <span>Add Photo URL <span className="font-normal text-[#9c7f6e]">(optional)</span></span>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
<<<<<<< HEAD
                className="w-full p-2.5 bg-[#fff0e2] rounded-xl text-xs text-[#3c1e0a] border border-[#f0bd9b] focus:border-[#b85018] focus:outline-none placeholder:text-[#7c4d2e]/60"
=======
                className="w-full p-2.5 bg-[#fdf8f3] rounded-xl text-xs text-[#2e1b10] border border-[#eed7c2] focus:border-[#c86228] focus:outline-none placeholder:text-[#9c7f6e]/70"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
<<<<<<< HEAD
                className="w-full py-3 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
=======
                className="w-full py-3 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              >
                {loading ? 'Publishing Review...' : 'Publish Verified Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
