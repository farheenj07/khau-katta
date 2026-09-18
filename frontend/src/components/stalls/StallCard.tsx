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
    <div className={`group bg-[#fffdfb]/95 rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover ${
      isInactive ? 'border-stone-300 opacity-80' : 'border-[#eed7c2]'
    }`}>
      {/* Stall Image Placeholder with Status Badge */}
      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
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
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/20">
            Stall {stall.stallNumber}
          </span>
        </div>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 text-stone-800 shadow-sm backdrop-blur-sm">
            <CategoryIcon name={stall.category?.icon || 'Store'} size={13} className="text-orange-600" />
            <span>{stall.category?.name || 'Local Stall'}</span>
          </span>
        </div>
      </div>

      {/* Stall Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Dynamic Rating and Reviews badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#faf2e8] border border-[#eed7c2] text-[#8c502b] rounded-2xl text-xs font-black">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>{ratingValue}</span>
              <span className="text-[#9c7f6e] font-normal">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#9c7f6e]">
              <Clock size={12} className="text-[#9c7f6e]" />
              <span>{stall.openingTime} - {stall.closingTime}</span>
            </div>
          </div>

          {/* Stall Name */}
          <h3 className="text-base font-bold text-[#2e1b10] group-hover:text-[#c86228] transition-colors line-clamp-1 mb-1.5">
            {stall.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#735442] line-clamp-2 leading-relaxed mb-4">
            {stall.shortDescription}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#eed7c2]/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9c7f6e]">
            <Phone size={11} className="text-[#9c7f6e]" />
            <span>{stall.contactPhone}</span>
          </div>

          <Link
            to={`/stalls/${stall.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#faf2e8] hover:bg-[#c86228] text-[#c86228] hover:text-white text-xs font-bold transition-all duration-200"
          >
            <span>View Stall &amp; Menu</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
