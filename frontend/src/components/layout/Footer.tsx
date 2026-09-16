import React from 'react';
import { Link } from 'react-router-dom';
import { KhauKattaLogo } from '../common/KhauKattaLogo';
import { MapPin, Phone, Mail, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#291305] text-[#fce3d0] pt-16 pb-12 border-t border-[#b85018]/30 mt-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#b85018]/25">
          {/* Col 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="brightness-125">
              <KhauKattaLogo size="md" withTagline={false} />
            </div>
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
                <span>hello@khaukatta.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              Market Categories
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/stalls?category=food-and-beverages" className="hover:text-[#b85018] transition-colors">
                  Food & Beverages
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=fast-food" className="hover:text-[#b85018] transition-colors">
                  Fast Food & Chaats
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=desserts" className="hover:text-[#b85018] transition-colors">
                  Belgaum Kunda & Desserts
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=jewellery" className="hover:text-[#b85018] transition-colors">
                  Silver & Kolhapuri Saaj
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=clothing" className="hover:text-[#b85018] transition-colors">
                  Shahapur Handlooms & Apparel
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=toys" className="hover:text-[#b85018] transition-colors">
                  Wooden Toys & Crafts
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=gifts" className="hover:text-[#b85018] transition-colors">
                  Brass Metal Gifts
                </Link>
              </li>
              <li>
                <Link to="/stalls?category=accessories" className="hover:text-[#b85018] transition-colors">
                  Leather Chappals & Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Vision */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              About Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/about" className="hover:text-[#b85018] transition-colors flex items-center gap-1">
                  <span>About Khau Katta</span> <ArrowRight size={12} />
                </Link>
              </li>
              <li>
                <Link to="/about#vision" className="hover:text-[#b85018] transition-colors">
                  Vision & Mission
                </Link>
              </li>
              <li>
                <Link to="/about#why" className="hover:text-[#b85018] transition-colors">
                  Why Khau Katta?
                </Link>
              </li>
              <li>
                <Link to="/about#benefits" className="hover:text-[#b85018] transition-colors">
                  Benefits for Businesses
                </Link>
              </li>
              <li>
                <Link to="/stalls" className="hover:text-[#b85018] transition-colors">
                  Directory of 50+ Stalls
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Architecture */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white mb-4">
              Roles & Portals
            </h4>
            <ul className="space-y-2 text-sm text-[#ffe8d6]/80">
              <li>
                <Link to="/" className="hover:text-[#b85018] transition-colors">
                  Customer Experience
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#d97706] transition-colors flex items-center gap-1">
                  <span>Admin Dashboard</span>
                  <span className="text-[10px] bg-[#b85018]/40 text-[#fce3d0] px-1.5 py-0.5 rounded-full border border-[#b85018]/60">Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Delivery Partner Portal</span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-full">Portal</span>
                </Link>
              </li>
              <li className="pt-3">
                <span className="inline-block px-3 py-1 bg-[#3c1e0a] rounded-full text-xs text-[#fce3d0] border border-[#f0bd9b]/40 shadow-xs">
                  Belagavi, Karnataka Marketplace
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ffe8d6]/70">
          <p>© {new Date().getFullYear()} Khau Katta Belagavi. Crafted for local merchants & customers.</p>
          <div className="flex items-center gap-1 text-[#ffe8d6]/80">
            <span>Built with</span>
            <Heart size={13} className="text-[#b85018] fill-[#b85018]" />
            <span>for Belagavi&apos;s 50+ local entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
