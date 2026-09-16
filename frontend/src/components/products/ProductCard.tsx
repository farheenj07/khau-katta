import React, { useState } from 'react';
import { Product } from '../../types';
import { Plus, Minus, Check, UtensilsCrossed, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  isStallOpen?: boolean;
  onAddClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isStallOpen = true, onAddClick }) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const currentQty = getItemQuantity(product.id);

  const isAvailableToOrder = product.isAvailable && isStallOpen;

  const handleAdd = () => {
    if (!isAvailableToOrder) return;
    setJustAdded(true);
    if (onAddClick) {
      onAddClick(product);
    } else {
      addItem(product, 1);
    }
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const dynamicRating = Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : '4.8';
  const dynamicReviewCount = product.reviewCount !== undefined ? product.reviewCount : 0;

  return (
    <div
      className={`bg-[#fff8f2]/95 rounded-3xl border p-4 transition-all duration-200 flex flex-col justify-between ${
        isAvailableToOrder
          ? 'border-[#f0bd9b] hover:border-[#b85018] hover:shadow-lg'
          : 'border-[#f0bd9b]/40 opacity-75 bg-[#fff0e2]/40'
      }`}
    >
      <div className="flex gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0">
          {/* Badges: Veg indicator & custom tag */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {/* Indian Green Veg Dot Symbol */}
            {product.isVeg ? (
              <span className="w-4 h-4 rounded border border-emerald-600 flex items-center justify-center p-0.5" title="Pure Vegetarian">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded border border-red-600 flex items-center justify-center p-0.5" title="Non-Vegetarian">
                <span className="w-2 h-2 rounded-full bg-red-600" />
              </span>
            )}

            {product.badge && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#fff0e2] text-[#b85018] rounded-full border border-[#f0bd9b]">
                {product.badge}
              </span>
            )}

            {product.stallNumber && (
              <span className="text-[10px] text-[#7c4d2e] font-medium">
                {product.stallNumber}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h4 className="font-serif text-base font-bold text-[#3c1e0a] leading-snug mb-1">
            {product.name}
          </h4>

          {/* Price & Dynamic Rating */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-baseline gap-0.5 text-base font-extrabold text-[#3c1e0a]">
              <span className="text-xs text-[#b85018] font-bold">₹</span>
              <span className="text-[#b85018]">{product.price.toFixed(0)}</span>
            </div>

            {/* Dynamic Product Rating: ⭐ 4.5 (82) */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#3c1e0a] bg-[#fff0e2] px-2.5 py-0.5 rounded-full border border-[#f0bd9b]">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{dynamicRating}</span>
              {dynamicReviewCount > 0 && (
                <span className="text-[#7c4d2e] font-normal">({dynamicReviewCount})</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#7c4d2e] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Right: Product Image Placeholder & Add Button */}
        <div className="flex flex-col items-center flex-shrink-0 w-28">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#fce3d0] border border-[#f0bd9b]">
            {!imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#fff0e2] text-[#b85018] p-2 text-center">
                <UtensilsCrossed size={20} className="mb-1 opacity-60" />
                <span className="text-[9px] font-medium leading-tight">{product.name}</span>
              </div>
            )}

            {/* Out of Stock / Closed Vendor Ribbon */}
            {!isStallOpen ? (
              <div className="absolute inset-0 bg-[#3c1e0a]/70 backdrop-blur-[1px] flex items-center justify-center text-center p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-stone-800/90 px-1.5 py-0.5 rounded-full">
                  Vendor Closed
                </span>
              </div>
            ) : !product.isAvailable ? (
              <div className="absolute inset-0 bg-[#3c1e0a]/60 backdrop-blur-[1px] flex items-center justify-center text-center p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-600/90 px-1.5 py-0.5 rounded-full">
                  Out of Stock
                </span>
              </div>
            ) : null}
          </div>

          {/* Add Button or Quantity Stepper */}
          <div className="w-full mt-2">
            {!isStallOpen ? (
              <span className="w-full py-1 text-center text-[10px] font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-200 block">
                Vendor Closed
              </span>
            ) : !product.isAvailable ? (
              <span className="w-full py-1 text-center text-[10px] font-semibold text-[#7c4d2e] bg-[#fff0e2] rounded-full border border-[#f0bd9b] block">
                Out of Stock
              </span>
            ) : currentQty > 0 ? (
              <div className="w-full py-1 px-2.5 rounded-full bg-[#b85018] text-white flex items-center justify-between shadow-xs">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, currentQty - 1)}
                  className="p-0.5 hover:bg-[#963e0e] rounded-full text-white transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-black font-mono">{currentQty}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, currentQty + 1)}
                  className="p-0.5 hover:bg-[#963e0e] rounded-full text-white transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#fff0e2] hover:bg-[#b85018] text-[#b85018] hover:text-white border border-[#f0bd9b] shadow-xs'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={13} />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    <span>ADD</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
