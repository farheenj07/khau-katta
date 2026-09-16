import React from 'react';
import { Link } from 'react-router-dom';
import { KhauKattaLogo } from '../common/KhauKattaLogo';
import { MapPin, Phone, Mail, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
<<<<<<< HEAD
    <footer className="bg-[#291305] text-[#fce3d0] pt-16 pb-12 border-t border-[#b85018]/30 mt-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#b85018]/25">
=======
    <footer className="bg-[#24150b] text-[#eed7c2] pt-16 pb-12 border-t border-[#3d2314] mt-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3d2314]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          {/* Col 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="brightness-125">
              <KhauKattaLogo size="md" withTagline={false} />
            </div>
<<<<<<< HEAD
            <p className="text-sm text-[#ffe8d6]/80 leading-relaxed max-w-sm">
              Khau Katta is Belagavi&apos;s celebrated community marketplace comprising 50+ vibrant stalls. From iconic Belgaum Kunda and Camp Misal to traditional Kolhapuri Saaj jewelry, Shahapur handlooms, and wooden toys — we bridge local artisans with every doorstep.
            </p>
            <div className="pt-2 text-xs text-[#ffe8d6]/80 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#b85018] flex-shrink-0" />
                <span>Khau Katta Plaza, Club Road, Camp, Belagavi, Karnataka 590001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#d97706] flex-shrink-0" />
                <span>+91 831 240 0050 (Belagavi Helpdesk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#e89558] flex-shrink-0" />
=======
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Khau Katta is Belagavi&apos;s celebrated community marketplace comprising approximately 50 vibrant stalls. From iconic Belgaum Kunda and Camp Misal to traditional Kolhapuri Saaj jewelry, Shahapur handlooms, and wooden toys — we bridge local artisans with every doorstep.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-orange-500 flex-shrink-0" />
                <span>Khau Katta Plaza, Club Road, Camp, Belagavi, Karnataka 590001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-amber-500 flex-shrink-0" />
                <span>+91 831 240 0050 (Belagavi Helpdesk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-emerald-500 flex-shrink-0" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                <span>hello@khaukatta.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Categories */}
          <div>
<<<<<<< HEAD
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              Market Categories
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/stalls?category=food-and-beverages" className="hover:text-[#b85018] transition-colors">
=======
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Market Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/stalls?category=food-and-beverages" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Food & Beverages
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=fast-food" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=fast-food" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Fast Food & Chaats
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=desserts" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=desserts" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Belgaum Kunda & Desserts
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=jewellery" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=jewellery" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Silver & Kolhapuri Saaj
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=clothing" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=clothing" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Shahapur Handlooms & Apparel
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=toys" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=toys" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Wooden Toys & Crafts
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=gifts" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=gifts" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Brass Metal Gifts
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls?category=accessories" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls?category=accessories" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Leather Chappals & Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Vision */}
          <div>
<<<<<<< HEAD
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              About Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/about" className="hover:text-[#b85018] transition-colors flex items-center gap-1">
=======
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              About Platform
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors flex items-center gap-1">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  <span>About Khau Katta</span> <ArrowRight size={12} />
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/about#vision" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/about#vision" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Vision & Mission
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/about#why" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/about#why" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Why Khau Katta?
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/about#benefits" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/about#benefits" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Benefits for Businesses
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/stalls" className="hover:text-[#b85018] transition-colors">
=======
                <Link to="/stalls" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Directory of 50+ Stalls
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Architecture */}
          <div>
<<<<<<< HEAD
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              Roles & Portals
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/" className="hover:text-[#b85018] transition-colors">
=======
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Roles & Portals
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Customer Experience
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/admin" className="hover:text-[#d97706] transition-colors flex items-center gap-1">
                  <span>Admin Dashboard</span>
                  <span className="text-[10px] bg-[#b85018]/40 text-[#fce3d0] px-1.5 py-0.5 rounded-full border border-[#b85018]/60">Portal</span>
=======
                <Link to="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Admin Dashboard</span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1 rounded">Stage 1</span>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Delivery Partner Portal</span>
<<<<<<< HEAD
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-full">Portal</span>
                </Link>
              </li>
              <li className="pt-3">
                <span className="inline-block px-3 py-1 bg-[#3c1e0a] rounded-full text-xs text-[#fce3d0] border border-[#f0bd9b]/40 shadow-xs">
                  Belagavi, Karnataka Marketplace
=======
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1 rounded">Stage 1</span>
                </Link>
              </li>
              <li className="pt-3">
                <span className="inline-block px-2.5 py-1 bg-stone-800 rounded-lg text-xs text-stone-400 border border-stone-700">
                  Belagavi, Karnataka • Stage 1 Foundation
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
<<<<<<< HEAD
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ffe8d6]/70">
          <p>© {new Date().getFullYear()} Khau Katta Belagavi. Crafted for local merchants & customers.</p>
          <div className="flex items-center gap-1 text-[#ffe8d6]/80">
            <span>Built with</span>
            <Heart size={13} className="text-[#b85018] fill-[#b85018]" />
=======
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Khau Katta Belagavi. Crafted for local merchants & customers.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with</span>
            <Heart size={13} className="text-orange-500 fill-orange-500" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            <span>for Belagavi&apos;s 50+ local entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
