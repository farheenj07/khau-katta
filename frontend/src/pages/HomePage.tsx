import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stall, StallCategory, Product } from '../types';
import { getCategories, getStalls, getPopularProducts } from '../services/api';
import { StallCard } from '../components/stalls/StallCard';
import { ProductCard } from '../components/products/ProductCard';
import { CategoryIcon } from '../components/common/CategoryIcon';
import {
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  HeartHandshake,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  Truck,
  CheckCircle,
  Tag
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<StallCategory[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const [cats, allStalls, prods] = await Promise.all([
        getCategories(),
        getStalls(),
        getPopularProducts()
      ]);
      setCategories(cats);
      setStalls(allStalls);
      setPopularProducts(prods.slice(0, 8)); // Top 8 popular items
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stalls?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductAdd = (product: Product) => {
    setToastMessage(`"${product.name}" selected! Cart & checkout will be available in Stage 2.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Group categories into Food & Shopping per requirements
  const foodCategorySlugs = ['food-and-beverages', 'fast-food', 'desserts'];
  const foodCategories = categories.filter(c => foodCategorySlugs.includes(c.slug));
  const shoppingCategories = categories.filter(c => !foodCategorySlugs.includes(c.slug));

  const featuredStalls = stalls.filter(s => s.isFeatured).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Stage 1 Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-3 animate-fade-in text-sm max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
            KK
          </div>
          <div>
            <p className="font-semibold text-xs text-orange-300">Stage 1 Notice</p>
            <p className="text-xs text-stone-200">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION & PROMOTIONAL BANNER */}
<<<<<<< HEAD
      <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#fff0e2]/40 to-transparent border-b border-[#f0bd9b]/60 pt-10 pb-16">
=======
      <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#faf0e4]/30 to-transparent border-b border-[#eed7c2]/60 pt-10 pb-16">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-7 space-y-6">
              {/* Cultural Tagline Pill */}
<<<<<<< HEAD
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff8f2] border border-[#f0bd9b] text-[#b85018] text-xs font-bold tracking-wide shadow-xs">
                <Sparkles size={14} className="text-[#b85018]" />
=======
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf2e8] border border-[#eed7c2] text-[#c86228] text-xs font-bold tracking-wide shadow-xs">
                <Sparkles size={14} className="text-[#c86228]" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                <span>Belagavi&apos;s Iconic 50+ Stall Marketplace Goes Digital</span>
              </div>

              {/* Main Headline */}
<<<<<<< HEAD
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#3c1e0a] tracking-tight leading-[1.15]">
                Savor the Flavors &amp; Treasures of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b85018] via-[#d97706] to-[#963e0e]">
=======
              <h1 className="text-3xl sm:text-5xl font-black text-[#2e1b10] tracking-tight leading-[1.15]">
                Savor the Flavors &amp; Treasures of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c86228] via-[#d97706] to-[#b2541f]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Khau Katta Belagavi
                </span>
              </h1>

              {/* Subtitle */}
<<<<<<< HEAD
              <p className="text-base sm:text-lg text-[#7c4d2e] max-w-xl leading-relaxed">
=======
              <p className="text-base sm:text-lg text-[#735442] max-w-xl leading-relaxed">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                From steaming <strong>Camp Misal</strong> and hot oven <strong>Belgaum Kunda</strong> to handwoven <strong>Shahapur sarees</strong> and handcrafted silver jewelry — order directly from Belagavi&apos;s most cherished local stalls.
              </p>

              {/* Integrated Hero Search */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
<<<<<<< HEAD
                <div className="relative flex items-center shadow-lg shadow-[#b85018]/10 rounded-full bg-[#fff8f2] p-2 border border-[#f0bd9b]">
                  <div className="pl-3 pr-2 text-[#7c4d2e]">
=======
                <div className="relative flex items-center shadow-lg shadow-[#c86228]/5 rounded-3xl bg-[#fffdfb] p-2 border border-[#eed7c2]">
                  <div className="pl-3 pr-2 text-[#9c7f6e]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search stalls, Kunda, Misal, Handlooms, Silver..."
<<<<<<< HEAD
                    className="w-full text-sm text-[#3c1e0a] placeholder-[#7c4d2e]/70 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-bold text-xs rounded-full shadow-md cursor-pointer transition-all flex items-center gap-1.5"
=======
                    className="w-full text-sm text-[#2e1b10] placeholder-[#a08372] bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b2541f] hover:to-[#c06a05] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  >
                    <span>Search</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                {/* Popular Search Tags */}
<<<<<<< HEAD
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#7c4d2e]">
                  <span className="font-semibold text-[#7c4d2e]">Popular:</span>
                  <Link to="/stalls?search=Kunda" className="px-3 py-1 bg-[#fff8f2] hover:bg-[#fff0e2] border border-[#f0bd9b] rounded-full text-[#3c1e0a] hover:text-[#b85018] transition-colors">Belgaum Kunda</Link>
                  <Link to="/stalls?search=Misal" className="px-3 py-1 bg-[#fff8f2] hover:bg-[#fff0e2] border border-[#f0bd9b] rounded-full text-[#3c1e0a] hover:text-[#b85018] transition-colors">Camp Misal</Link>
                  <Link to="/stalls?search=Chai" className="px-3 py-1 bg-[#fff8f2] hover:bg-[#fff0e2] border border-[#f0bd9b] rounded-full text-[#3c1e0a] hover:text-[#b85018] transition-colors">Kadak Chai</Link>
                  <Link to="/stalls?search=Silver" className="px-3 py-1 bg-[#fff8f2] hover:bg-[#fff0e2] border border-[#f0bd9b] rounded-full text-[#3c1e0a] hover:text-[#b85018] transition-colors">Kolhapuri Saaj</Link>
=======
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#735442]">
                  <span className="font-semibold text-[#9c7f6e]">Popular:</span>
                  <Link to="/stalls?search=Kunda" className="px-3 py-1 bg-[#fffdfb] hover:bg-[#faf2e8] border border-[#eed7c2] rounded-full text-[#4a2e1d] hover:text-[#c86228] transition-colors">Belgaum Kunda</Link>
                  <Link to="/stalls?search=Misal" className="px-3 py-1 bg-[#fffdfb] hover:bg-[#faf2e8] border border-[#eed7c2] rounded-full text-[#4a2e1d] hover:text-[#c86228] transition-colors">Camp Misal</Link>
                  <Link to="/stalls?search=Chai" className="px-3 py-1 bg-[#fffdfb] hover:bg-[#faf2e8] border border-[#eed7c2] rounded-full text-[#4a2e1d] hover:text-[#c86228] transition-colors">Kadak Chai</Link>
                  <Link to="/stalls?search=Silver" className="px-3 py-1 bg-[#fffdfb] hover:bg-[#faf2e8] border border-[#eed7c2] rounded-full text-[#4a2e1d] hover:text-[#c86228] transition-colors">Kolhapuri Saaj</Link>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                </div>
              </form>
            </div>

            {/* Right Promotional Hero Card — Styled directly from Pinterest Food App wireframe */}
            <div className="lg:col-span-5">
<<<<<<< HEAD
              <div className="relative rounded-3xl overflow-hidden bg-[#fff8f2] text-[#3c1e0a] p-6 sm:p-7 shadow-xl border border-[#f0bd9b] space-y-4">
                {/* Food Showcase Image */}
                <div className="relative h-52 sm:h-56 w-full rounded-2xl overflow-hidden bg-[#fce3d0] shadow-xs">
=======
              <div className="relative rounded-3xl overflow-hidden bg-white text-[#2a1408] p-6 sm:p-7 shadow-xl border border-[#e8c4a2] space-y-4">
                {/* Food Showcase Image */}
                <div className="relative h-52 sm:h-56 w-full rounded-2xl overflow-hidden bg-[#faebd7] shadow-xs">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"
                    alt="Belgaum Kunda and Khau Katta treats"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Top Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
<<<<<<< HEAD
                    <span className="px-3 py-1 bg-[#b85018] text-white font-black text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
=======
                    <span className="px-3 py-1 bg-[#c25e1a] text-white font-black text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      <Tag size={12} /> Special Festive Coupon
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
<<<<<<< HEAD
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[#fce3d0] font-bold text-xs rounded-full border border-white/20">
=======
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-amber-300 font-bold text-xs rounded-full border border-white/20">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      Stall #KK-01
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
<<<<<<< HEAD
                    <p className="font-serif text-base font-black drop-shadow-md">Belgaum Kunda &amp; Royal Sweets</p>
                    <p className="text-[11px] text-[#fce3d0]">Prepared fresh with pure milk &amp; cardamom</p>
=======
                    <p className="text-sm font-black drop-shadow-md">Belgaum Kunda &amp; Royal Sweets</p>
                    <p className="text-[11px] text-amber-200">Prepared fresh with pure milk &amp; cardamom</p>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  </div>
                </div>

                {/* Card Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
<<<<<<< HEAD
                    <h3 className="font-serif text-xl font-black text-[#3c1e0a]">
                      Taste Belagavi&apos;s Pride at Your Doorstep
                    </h3>
                  </div>
                  <p className="text-xs text-[#7c4d2e] leading-relaxed">
=======
                    <h3 className="text-xl font-black text-[#2a1408]">
                      Taste Belagavi&apos;s Pride at Your Doorstep
                    </h3>
                  </div>
                  <p className="text-xs text-[#735442] leading-relaxed">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                    Discover 50+ generational stalls from Club Road Khau Katta. Quick delivery, authentic recipes.
                  </p>
                </div>

                {/* Coupon Pill */}
<<<<<<< HEAD
                <div className="p-3 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#b85018] font-bold uppercase tracking-wider block">Use Code for 50% Off</span>
                    <span className="text-sm font-black tracking-widest text-[#3c1e0a]">KHAUKATTA50</span>
                  </div>
                  <span className="text-xs px-3 py-1 bg-[#b85018] text-white rounded-full font-bold shadow-xs">
=======
                <div className="p-3 rounded-2xl bg-[#fdf0e2] border border-[#e8c4a2] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#93370d] font-bold uppercase tracking-wider block">Use Code for 50% Off</span>
                    <span className="text-sm font-black tracking-widest text-[#2a1408]">KHAUKATTA50</span>
                  </div>
                  <span className="text-xs px-3 py-1 bg-[#c25e1a] text-white rounded-full font-bold shadow-xs">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                    50% OFF
                  </span>
                </div>

                {/* Action CTA */}
                <Link
                  to="/stalls"
<<<<<<< HEAD
                  className="w-full py-3 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-black text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
=======
                  className="w-full py-3 bg-gradient-to-r from-[#c25e1a] to-[#d97706] hover:from-[#a84e12] hover:to-[#b45309] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                >
                  <span>Explore All 50+ Stalls</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
<<<<<<< HEAD
            <span className="text-xs font-bold uppercase tracking-wider text-[#b85018]">Taste of Belagavi</span>
            <h2 className="font-serif text-2xl font-black text-[#3c1e0a] tracking-tight">Food &amp; Beverage Stalls</h2>
          </div>
          <Link
            to="/stalls?category=food-and-beverages"
            className="text-xs font-bold text-[#b85018] hover:text-[#963e0e] flex items-center gap-1 group"
=======
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Taste of Belagavi</span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Food &amp; Beverage Stalls</h2>
          </div>
          <Link
            to="/stalls?category=food-and-beverages"
            className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 group"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          >
            <span>View All Foods</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {foodCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/stalls?category=${cat.slug}`}
<<<<<<< HEAD
              className="p-5 rounded-3xl bg-[#fff8f2]/95 backdrop-blur-sm border border-[#f0bd9b] shadow-xs hover:shadow-xl hover:border-[#b85018] transition-all group flex items-start gap-4 card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#fff0e2] text-[#b85018] border border-[#f0bd9b] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CategoryIcon name={cat.icon} size={24} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#3c1e0a] group-hover:text-[#b85018] text-base mb-1 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#7c4d2e] leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b85018] mt-2">
=======
              className="p-5 rounded-3xl bg-[#fffdfb]/90 backdrop-blur-sm border border-[#eed7c2] shadow-xs hover:shadow-xl hover:border-[#c86228] transition-all group flex items-start gap-4 card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#faf2e8] to-[#f5e0c8] text-[#c86228] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CategoryIcon name={cat.icon} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#2e1b10] group-hover:text-[#c86228] text-base mb-1 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#735442] leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c86228] mt-2">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Browse Stalls <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SHOPPING CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">Artisans &amp; Lifestyle</span>
<<<<<<< HEAD
            <h2 className="font-serif text-2xl font-black text-[#3c1e0a] tracking-tight">Shopping Categories</h2>
          </div>
          <Link
            to="/stalls"
            className="text-xs font-bold text-[#7c4d2e] hover:text-[#b85018] flex items-center gap-1 group"
=======
            <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Shopping Categories</h2>
          </div>
          <Link
            to="/stalls"
            className="text-xs font-bold text-[#8c502b] hover:text-[#c86228] flex items-center gap-1 group"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          >
            <span>Explore All Stalls</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {shoppingCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/stalls?category=${cat.slug}`}
<<<<<<< HEAD
              className="p-4 rounded-3xl bg-[#fff8f2]/95 backdrop-blur-sm border border-[#f0bd9b] shadow-xs hover:shadow-xl hover:border-[#b85018] transition-all text-center flex flex-col items-center group card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#fff0e2] text-[#d97706] border border-[#f0bd9b] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#b85018] group-hover:text-white transition-all">
                <CategoryIcon name={cat.icon} size={22} />
              </div>
              <h4 className="text-xs font-bold text-[#3c1e0a] group-hover:text-[#b85018] leading-snug line-clamp-1 mb-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-[#7c4d2e]">Discover Stalls</span>
=======
              className="p-4 rounded-3xl bg-[#fffdfb]/90 backdrop-blur-sm border border-[#eed7c2] shadow-xs hover:shadow-xl hover:border-[#d97706] transition-all text-center flex flex-col items-center group card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#faf2e8] text-[#d97706] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#d97706] group-hover:text-white transition-all">
                <CategoryIcon name={cat.icon} size={22} />
              </div>
              <h4 className="text-xs font-bold text-[#2e1b10] group-hover:text-[#d97706] leading-snug line-clamp-1 mb-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-[#9c7f6e]">Discover Stalls</span>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED STALLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
<<<<<<< HEAD
            <span className="text-xs font-bold uppercase tracking-wider text-[#b85018]">Handpicked Recommendations</span>
            <h2 className="font-serif text-2xl font-black text-[#3c1e0a] tracking-tight">Featured Khau Katta Stalls</h2>
          </div>
          <Link
            to="/stalls"
            className="text-xs font-bold text-[#b85018] hover:text-[#963e0e] flex items-center gap-1 group"
          >
            <span>See All Stalls</span>
=======
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Handpicked Recommendations</span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Featured Khau Katta Stalls</h2>
          </div>
          <Link
            to="/stalls"
            className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 group"
          >
            <span>See All 10 Stalls (50+ Platform)</span>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStalls.map(stall => (
            <StallCard key={stall.id} stall={stall} />
          ))}
        </div>
      </section>

      {/* 5. POPULAR ITEMS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
<<<<<<< HEAD
            <span className="text-xs font-bold uppercase tracking-wider text-[#b85018]">Customer Favorites</span>
            <h2 className="font-serif text-2xl font-black text-[#3c1e0a] tracking-tight">Popular Belagavi Items</h2>
          </div>
          <span className="text-xs font-medium text-[#7c4d2e]">
            Fresh local specialties ready for order
=======
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Customer Favorites</span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Popular Belagavi Items</h2>
          </div>
          <span className="text-xs font-medium text-stone-400">
            Available for doorstep order in Stage 2
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddClick={handleProductAdd}
            />
          ))}
        </div>
      </section>

      {/* 6. VISION & MISSION TEASER / SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
        <div className="rounded-3xl bg-[#291305] text-[#fff8f2] p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#b85018]/30">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#f0bd9b] mb-3 block">
              Our Purpose &amp; Promise
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black tracking-tight mb-6 leading-snug">
              Bridging Belagavi&apos;s Heritage Stalls with Modern Digital Convenience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[#ffe8d6]">
              <div className="p-5 rounded-3xl bg-[#3c1e0a]/90 border border-[#b85018]/40">
                <div className="flex items-center gap-2 text-[#e89558] font-bold text-base mb-2">
                  <Award size={18} /> Our Vision
                </div>
                <p className="text-xs text-[#ffe8d6]/80 leading-relaxed">
=======
        <div className="rounded-3xl bg-[#24150b] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#3d2314]">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#f5a866] mb-3 block">
              Our Purpose &amp; Promise
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-6 leading-snug">
              Bridging Belagavi&apos;s Heritage Stalls with Modern Digital Convenience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[#eed7c2]">
              <div className="p-5 rounded-3xl bg-[#2f1c10]/90 border border-[#442818]">
                <div className="flex items-center gap-2 text-[#f5a866] font-bold text-base mb-2">
                  <Award size={18} /> Our Vision
                </div>
                <p className="text-xs text-[#eed7c2]/80 leading-relaxed">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Make Khau Katta accessible beyond its physical location by digitally connecting local businesses with customers across Belagavi.
                </p>
              </div>

<<<<<<< HEAD
              <div className="p-5 rounded-3xl bg-[#3c1e0a]/90 border border-[#b85018]/40">
                <div className="flex items-center gap-2 text-[#d97706] font-bold text-base mb-2">
                  <HeartHandshake size={18} /> Our Mission
                </div>
                <p className="text-xs text-[#ffe8d6]/80 leading-relaxed">
=======
              <div className="p-5 rounded-3xl bg-[#2f1c10]/90 border border-[#442818]">
                <div className="flex items-center gap-2 text-[#fbbf24] font-bold text-base mb-2">
                  <HeartHandshake size={18} /> Our Mission
                </div>
                <p className="text-xs text-[#eed7c2]/80 leading-relaxed">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Empower local stalls and businesses with a digital platform where customers can discover, order, and receive products conveniently at home.
                </p>
              </div>
            </div>

            <Link
              to="/about"
<<<<<<< HEAD
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-bold text-xs rounded-full shadow-lg transition-all"
=======
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b2541f] hover:to-[#c06a05] text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            >
              <span>Read Full Vision, Mission &amp; Merchant Benefits</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Decorative background watermark */}
          <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none text-9xl font-black select-none text-white hidden lg:block">
            BELAGAVI
          </div>
        </div>
      </section>

      {/* 7. EXPLORE STALLS BANNER / DIRECTORY LEAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<<<<<<< HEAD
        <div className="p-10 rounded-3xl bg-[#fff8f2]/95 backdrop-blur-sm border border-[#f0bd9b] shadow-xs">
          <h3 className="font-serif text-2xl font-black text-[#3c1e0a] mb-3">
            Looking for a specific stall in Khau Katta?
          </h3>
          <p className="text-sm text-[#7c4d2e] max-w-xl mx-auto mb-6">
=======
        <div className="p-10 rounded-3xl bg-[#fffdfb]/90 backdrop-blur-sm border border-[#eed7c2] shadow-xs">
          <h3 className="text-2xl font-black text-[#2e1b10] mb-3">
            Looking for a specific stall in Khau Katta?
          </h3>
          <p className="text-sm text-[#735442] max-w-xl mx-auto mb-6">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            Explore all current sample stalls (Belgaum Kunda, Camp Misal, Shahapur Handlooms, Kolhapuri Saaj, and more). Filter by category, rating, or open status.
          </p>
          <Link
            to="/stalls"
<<<<<<< HEAD
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#b85018] hover:bg-[#963e0e] text-white font-bold text-sm rounded-full shadow-md transition-colors"
=======
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c86228] hover:bg-[#b2541f] text-white font-bold text-sm rounded-2xl shadow-md transition-colors"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          >
            <span>Browse Full Stalls Directory</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};
