import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stall } from '../../types';
import { Star, Clock, Phone, ChevronRight, Store } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';

interface StallCardProps {
  stall: Stall;
}

const DEFAULT_STALL_IMAGE = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop';

export const StallCard: React.FC<StallCardProps> = ({ stall }) => {
  const [imageError, setImageError] = useState(false);

  // Dynamic rating values from review database
  const ratingValue = Number(stall.rating) > 0 ? Number(stall.rating).toFixed(1) : '5.0';
  const reviewCount = stall.reviewCount !== undefined ? stall.reviewCount : 0;
  const isInactive = stall.isActive === false || stall.status === 'INACTIVE';

  return (
    <div className={`group bg-[#fff8f2]/95 rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover ${
      isInactive ? 'border-stone-300 opacity-80' : 'border-[#f0bd9b]'
    }`}>
      {/* Stall Image Placeholder with Status Badge */}
      <div className="relative h-48 w-full bg-[#fce3d0] overflow-hidden">
        <img
          src={!imageError && stall.imageUrl ? stall.imageUrl : DEFAULT_STALL_IMAGE}
          alt={stall.name}
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Open / Closed / Inactive Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
              isInactive
                ? 'bg-rose-900/90 text-rose-200 border border-rose-600/40'
                : stall.isOpen
                ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                : 'bg-stone-900/90 text-stone-300 border border-stone-600/40'
            }`}
          >
            {isInactive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                INACTIVE
              </>
            ) : stall.isOpen ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                OPEN
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                CLOSED
              </>
            )}
          </span>
        </div>

        {/* Stall Number Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-[#fce3d0] border border-white/20">
            Stall {stall.stallNumber}
          </span>
        </div>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff8f2]/95 text-[#3c1e0a] shadow-sm backdrop-blur-sm border border-[#f0bd9b]/60">
            <CategoryIcon name={stall.category?.icon || 'Store'} size={13} className="text-[#b85018]" />
            <span>{stall.category?.name || 'Local Stall'}</span>
          </span>
        </div>
      </div>

      {/* Stall Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Dynamic Rating and Reviews badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#fff0e2] border border-[#f0bd9b] text-[#b85018] rounded-full text-xs font-black">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>{ratingValue}</span>
              <span className="text-[#7c4d2e] font-normal">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#7c4d2e]">
              <Clock size={12} className="text-[#7c4d2e]" />
              <span>{stall.openingTime} - {stall.closingTime}</span>
            </div>
          </div>

          {/* Stall Name */}
          <h3 className="font-serif text-lg font-bold text-[#3c1e0a] group-hover:text-[#b85018] transition-colors line-clamp-1 mb-1.5">
            {stall.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#7c4d2e] line-clamp-2 leading-relaxed mb-4">
            {stall.shortDescription}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#f0bd9b]/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#7c4d2e]">
            <Phone size={11} className="text-[#7c4d2e]" />
            <span>{stall.contactPhone}</span>
          </div>

          <Link
            to={`/stalls/${stall.id}`}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#fff0e2] hover:bg-[#b85018] text-[#b85018] hover:text-white text-xs font-bold transition-all duration-200 border border-[#f0bd9b] shadow-xs"
          >
            <span>View Stall &amp; Menu</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
