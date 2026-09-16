import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Stall, StallCategory } from '../types';
import { getStalls, getCategories } from '../services/api';
import { StallCard } from '../components/stalls/StallCard';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { Search, Filter, Store, Star, CheckCircle, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ExploreStallsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [categories, setCategories] = useState<StallCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const selectedCategorySlug = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'reviews'>('rating');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [allCategories, allStalls] = await Promise.all([
        getCategories(),
        getStalls()
      ]);
      setCategories(allCategories);
      setStalls(allStalls);
      setLoading(false);
    }
    load();
  }, []);

  // Update query params when category changes
  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  // Filter and sort stalls
  const filteredStalls = useMemo(() => {
    return stalls.filter(stall => {
      // Category check
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategorySlug);
        if (cat && stall.categoryId !== cat.id) return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = stall.name.toLowerCase().includes(q);
        const matchesDesc = stall.shortDescription.toLowerCase().includes(q) || stall.description.toLowerCase().includes(q);
        const matchesNumber = stall.stallNumber.toLowerCase().includes(q);
        const matchesCategory = stall.category?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesNumber && !matchesCategory) return false;
      }

      // Open only check
      if (onlyOpen && !stall.isOpen) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });
  }, [stalls, categories, selectedCategorySlug, searchQuery, onlyOpen, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setOnlyOpen(false);
    setSortBy('rating');
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#b85018] via-[#c0541c] to-[#963e0e] text-[#fff8f2] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#f0bd9b]/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 border border-white/30 rounded-full text-[#fce3d0] text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
            <Store size={13} /> Belagavi Marketplace Directory
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Explore All 50+ Khau Katta Stalls
          </h1>
          <p className="text-sm text-[#ffe8d6]/90 leading-relaxed">
            Browse through Belagavi&apos;s renowned street foods, sweets, silverware, handlooms, brassware, and artisan workshops. Filter by your favorite category or search specific local stalls.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hidden lg:block pointer-events-none">
          <Store size={220} />
        </div>
      </div>

      {/* Category Filter Pills (All 9 Categories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7c4d2e] flex items-center gap-1">
            <Filter size={13} /> Select Marketplace Category
          </span>
          <span className="text-xs text-[#7c4d2e] font-medium">
            Showing {filteredStalls.length} of {stalls.length} stalls
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-[#b85018] text-white shadow-md'
                : 'bg-[#fff8f2] text-[#3c1e0a] hover:bg-[#fff0e2] border border-[#f0bd9b]'
            }`}
          >
            <span>All Stalls (50+ Capacity)</span>
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#b85018] text-white shadow-md'
                    : 'bg-[#fff8f2] text-[#3c1e0a] hover:bg-[#fff0e2] border border-[#f0bd9b]'
                }`}
              >
                <CategoryIcon
                  name={cat.icon}
                  size={15}
                  className={isSelected ? 'text-white' : 'text-[#b85018]'}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#fff8f2]/95 backdrop-blur-sm p-4 rounded-3xl border border-[#f0bd9b] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-3 text-[#7c4d2e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search stall name, menu item, or stall number (e.g. KK-01)..."
            className="w-full pl-10 pr-4 py-2 bg-[#fff0e2] rounded-full text-xs sm:text-sm text-[#3c1e0a] border border-[#f0bd9b] focus:border-[#b85018] focus:bg-white focus:outline-none placeholder:text-[#7c4d2e]/70"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Open Now Checkbox Toggle */}
          <label className="flex items-center gap-2 text-xs font-bold text-[#3c1e0a] cursor-pointer select-none bg-[#fff0e2] px-4 py-2 rounded-full border border-[#f0bd9b] hover:bg-[#fce5d2]">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={e => setOnlyOpen(e.target.checked)}
              className="rounded text-[#b85018] focus:ring-[#b85018] h-4 w-4"
            />
            <span>Open Stalls Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#fff0e2] px-4 py-2 rounded-full border border-[#f0bd9b] text-xs">
            <SlidersHorizontal size={13} className="text-[#7c4d2e]" />
            <span className="text-[#7c4d2e] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-[#3c1e0a] focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Reset button */}
          {(searchQuery || onlyOpen || selectedCategorySlug !== 'all') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs text-[#7c4d2e] hover:text-[#b85018] font-medium cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Stalls Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-80 rounded-3xl bg-[#fff0e2] animate-pulse border border-[#f0bd9b]" />
          ))}
        </div>
      ) : filteredStalls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStalls.map(stall => (
            <StallCard key={stall.id} stall={stall} />
          ))}
        </div>
      ) : (
        <div className="bg-[#fff8f2] rounded-3xl p-12 text-center border border-[#f0bd9b] max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#fff0e2] text-[#b85018] mx-auto flex items-center justify-center border border-[#f0bd9b]">
            <Store size={32} />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3c1e0a]">No stalls matched your filters</h3>
          <p className="text-xs text-[#7c4d2e]">
            Try adjusting your search terms, choosing a different category, or resetting the filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#b85018] text-white rounded-full text-xs font-bold hover:bg-[#963e0e] transition-colors cursor-pointer shadow-xs"
          >
            Show All Stalls
          </button>
        </div>
      )}
    </div>
  );
};
