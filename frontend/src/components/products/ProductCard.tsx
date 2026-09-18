import React, { useState } from 'react';
import { Product } from '../../types';
import { Plus, Minus, Check, UtensilsCrossed, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddClick }) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const currentQty = getItemQuantity(product.id);

  const handleAdd = () => {
    if (!product.isAvailable) return;
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
      className={`bg-[#fffdfb]/95 rounded-3xl border p-4 transition-all duration-200 flex flex-col justify-between ${
        product.isAvailable
          ? 'border-[#eed7c2] hover:border-[#c86228] hover:shadow-lg'
          : 'border-[#eed7c2]/40 opacity-75 bg-[#faf2e8]/40'
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
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-md">
                {product.badge}
              </span>
            )}

            {product.stallNumber && (
              <span className="text-[10px] text-stone-400 font-medium">
                {product.stallNumber}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h4 className="text-sm font-bold text-stone-900 leading-snug mb-1">
            {product.name}
          </h4>

          {/* Price & Dynamic Rating */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-baseline gap-0.5 text-base font-extrabold text-stone-900">
              <span className="text-xs text-orange-700 font-bold">₹</span>
              <span>{product.price.toFixed(0)}</span>
            </div>

            {/* Dynamic Product Rating: ⭐ 4.5 (82) */}
            <div className="flex items-center gap-1 text-xs font-bold text-stone-700 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{dynamicRating}</span>
              {dynamicReviewCount > 0 && (
                <span className="text-stone-400 font-normal">({dynamicReviewCount})</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Right: Product Image Placeholder & Add Button */}
        <div className="flex flex-col items-center flex-shrink-0 w-28">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            {!imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 text-orange-700 p-2 text-center">
                <UtensilsCrossed size={20} className="mb-1 opacity-60" />
                <span className="text-[9px] font-medium leading-tight">{product.name}</span>
              </div>
            )}

            {/* Out of Stock Ribbon */}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center text-center p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-600/90 px-1.5 py-0.5 rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Add Button or Quantity Stepper */}
          <div className="w-full mt-2">
            {!product.isAvailable ? (
              <span className="w-full py-1 text-center text-[10px] font-semibold text-stone-400 block">
                Unavailable
              </span>
            ) : currentQty > 0 ? (
              <div className="w-full py-1 px-2 rounded-2xl bg-[#c86228] text-white flex items-center justify-between shadow-xs">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, currentQty - 1)}
                  className="p-0.5 hover:bg-[#b2541f] rounded text-white transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-black font-mono">{currentQty}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, currentQty + 1)}
                  className="p-0.5 hover:bg-[#b2541f] rounded text-white transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-1.5 px-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#faf2e8] hover:bg-[#c86228] text-[#c86228] hover:text-white border border-[#eed7c2] hover:border-[#c86228] shadow-xs'
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
