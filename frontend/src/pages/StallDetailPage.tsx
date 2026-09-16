import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Stall, Product } from '../types';
import { getStallById } from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { ReviewSection } from '../components/reviews/ReviewSection';
import {
  ArrowLeft,
  Star,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  Store
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const StallDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'veg' | 'available'>('all');

  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadStall() {
      if (!id) return;
      setLoading(true);
      const data = await getStallById(id);
      setStall(data);
      setLoading(false);
    }
    loadStall();
  }, [id]);

  const handleProductAdd = (product: Product) => {
    if (stall?.isActive === false || stall?.status === 'INACTIVE') {
      showToast('This stall is currently inactive and not accepting orders.', 'warning');
      return;
    }
    if (stall?.isOpen === false) {
      showToast(`"${stall.name}" is currently CLOSED. Cannot add items to cart.`, 'warning');
      return;
    }
    addItem(product, 1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
        <div className="h-64 bg-stone-100 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-36 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stall) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-stone-200 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <Store size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Stall Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          The requested stall does not exist or may have been moved within Khau Katta.
        </p>
        <Link
          to="/stalls"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Stalls</span>
        </Link>
      </div>
    );
  }

  const stallProducts = stall.products || [];
  const filteredProducts = stallProducts.filter(p => {
    if (selectedFilter === 'veg') return p.isVeg;
    if (selectedFilter === 'available') return p.isAvailable;
    return true;
  });

  const ratingValue = Number(stall.rating) > 0 ? Number(stall.rating).toFixed(1) : '5.0';
  const reviewCount = stall.reviewCount !== undefined ? stall.reviewCount : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/stalls"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c4d2e] hover:text-[#b85018] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Stalls</span>
        </Link>
      </div>

      {/* Inactive Stall Alert */}
      {(stall.isActive === false || stall.status === 'INACTIVE') && (
        <div className="p-4 bg-[#fff0e2] border-2 border-[#f0bd9b] rounded-3xl text-[#3c1e0a] text-xs font-bold flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-2xl bg-[#fce3d0] text-[#b85018] flex items-center justify-center flex-shrink-0 border border-[#f0bd9b]">
            <Store size={18} />
          </div>
          <div>
            <span className="block text-sm font-black text-[#3c1e0a]">Stall Currently Inactive</span>
            <span className="text-[11px] font-medium text-[#7c4d2e]">This merchant is currently not taking online orders at Khau Katta Belagavi.</span>
          </div>
        </div>
      )}

      {/* Stall Hero Header Card */}
      <div className="bg-[#fff8f2]/95 rounded-3xl overflow-hidden border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
        {/* Banner Graphic */}
        <div className="relative h-60 sm:h-72 w-full bg-[#fce3d0] overflow-hidden">
          <img
            src={stall.bannerUrl || stall.imageUrl}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-black/60 text-[#fce3d0] backdrop-blur-md border border-white/20">
              Stall {stall.stallNumber}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#fff8f2]/95 text-[#3c1e0a] backdrop-blur-md flex items-center gap-1.5 border border-[#f0bd9b]/60">
              <CategoryIcon name={stall.category?.icon || 'Store'} size={14} className="text-[#b85018]" />
              <span>{stall.category?.name}</span>
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                stall.isOpen
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-stone-900/90 text-stone-300 border border-stone-700'
              }`}
            >
              {stall.isOpen ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  OPEN FOR ORDERS
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  CURRENTLY CLOSED
                </>
              )}
            </span>
          </div>

          {/* Bottom Title & Dynamic Rating on Banner */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-stone-950 rounded-full text-xs font-black">
                <Star size={13} className="fill-stone-950" />
                <span>{ratingValue}</span>
                <span className="font-normal text-stone-800">
                  ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#ffe8d6]">
                <Clock size={13} className="text-amber-400" />
                <span>{stall.openingTime} – {stall.closingTime} Daily</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#ffe8d6]">
                <Phone size={13} className="text-emerald-400" />
                <span>{stall.contactPhone}</span>
              </div>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
              {stall.name}
            </h1>
          </div>
        </div>

        {/* Description & Stall Meta Info Bar */}
        <div className="p-6 sm:p-8 bg-[#fff0e2] border-t border-[#f0bd9b]">
          <div className="max-w-4xl space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7c4d2e] mb-1">
                About this Khau Katta Merchant
              </h3>
              <p className="text-sm text-[#3c1e0a] leading-relaxed">
                {stall.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7c4d2e] pt-2 border-t border-[#f0bd9b]/60">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin size={14} className="text-[#b85018]" />
                <span>Stall #{stall.stallNumber}, Khau Katta Food &amp; Artisan Street, Club Road, Belagavi</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Verified Khau Katta Belagavi Merchant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu / Products Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0bd9b] pb-4">
          <div>
            <h2 className="font-serif text-xl font-black text-[#3c1e0a] tracking-tight">
              Products &amp; Specialties ({stallProducts.length} Items)
            </h2>
            <p className="text-xs text-[#7c4d2e]">
              Prepared fresh and packaged at Stall {stall.stallNumber}
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#b85018] text-white shadow-xs'
                  : 'bg-[#fff0e2] text-[#7c4d2e] border border-[#f0bd9b] hover:bg-[#fce5d2]'
              }`}
            >
              All Items ({stallProducts.length})
            </button>
            <button
              onClick={() => setSelectedFilter('veg')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                selectedFilter === 'veg'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#fff0e2] text-[#7c4d2e] border border-[#f0bd9b] hover:bg-[#fce5d2]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Pure Veg
            </button>
            <button
              onClick={() => setSelectedFilter('available')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedFilter === 'available'
                  ? 'bg-[#d97706] text-white shadow-xs'
                  : 'bg-[#fff0e2] text-[#7c4d2e] border border-[#f0bd9b] hover:bg-[#fce5d2]'
              }`}
            >
              In Stock Only
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isStallOpen={stall.isOpen}
                onAddClick={handleProductAdd}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#fff8f2]/90 rounded-3xl border border-[#f0bd9b] text-center text-[#7c4d2e] text-xs shadow-xs">
            No products match the selected filter.
          </div>
        )}
      </div>

      {/* Embedded Review & Rating Section */}
      <ReviewSection
        stallId={stall.id}
        stallName={stall.name}
      />
    </div>
  );
};
