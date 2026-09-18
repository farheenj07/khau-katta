import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  totalReviews?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  showValue = false,
  totalReviews,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFull = displayRating >= starValue;
          const isHalf = !isFull && displayRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-115 transition-transform p-0.5' : 'cursor-default'
              } text-amber-400 focus:outline-none`}
              aria-label={`${starValue} stars`}
            >
              <Star
                size={size}
                className={`${
                  isFull
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-stone-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-bold text-stone-800 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-[11px] text-stone-500 font-normal">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
