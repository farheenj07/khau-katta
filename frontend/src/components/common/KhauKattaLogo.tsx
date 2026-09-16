import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

export const KhauKattaLogo: React.FC<LogoProps> = ({ size = 'md', withTagline = true }) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const taglineSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none select-none">
      {/* Unique Khau Katta Emblem: Belagavi archway + Marketplace canopy + Steaming flavor swirl */}
      <div
<<<<<<< HEAD
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#b85018] via-[#c0541c] to-[#963e0e] shadow-md shadow-[#b85018]/25 group-hover:scale-105 transition-transform duration-200"
=======
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 shadow-md shadow-orange-900/20 group-hover:scale-105 transition-transform duration-200"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Marketplace Canopy Arch */}
          <path
            d="M8 24C8 16 16 10 24 10C32 10 40 16 40 24V28C40 29 39 30 38 30C37 30 36 29 36 28C36 29 35 30 34 30C33 30 32 29 32 28C32 29 31 30 30 30C29 30 28 29 28 28C28 29 27 30 26 30C25 30 24 29 24 28C24 29 23 30 22 30C21 30 20 29 20 28C20 29 19 30 18 30C17 30 16 29 16 28C16 29 15 30 14 30C13 30 12 29 12 28C12 29 11 30 10 30C9 30 8 29 8 28V24Z"
<<<<<<< HEAD
            fill="#FFF5EC"
=======
            fill="#FEF3C7"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          />
          {/* Traditional Brass / Terracotta Bowl */}
          <path
            d="M14 30C14 36 18.5 40 24 40C29.5 40 34 36 34 30H14Z"
<<<<<<< HEAD
            fill="#FCE3D0"
=======
            fill="#FDE68A"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          />
          {/* Rising Flavor Swirls */}
          <path
            d="M19 8C19 6 21 5 21 3"
<<<<<<< HEAD
            stroke="#FFF8F2"
=======
            stroke="#FFFBEB"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M24 8C24 5 26 4 26 2"
<<<<<<< HEAD
            stroke="#FFF8F2"
=======
            stroke="#FFFBEB"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M29 8C29 6 31 5 31 3"
<<<<<<< HEAD
            stroke="#FFF8F2"
=======
            stroke="#FFFBEB"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Gem / Artisan Sparkle */}
<<<<<<< HEAD
          <circle cx="24" cy="22" r="2.5" fill="#B85018" />
=======
          <circle cx="24" cy="22" r="2.5" fill="#B45309" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
<<<<<<< HEAD
          <span className={`font-serif font-black ${textSize} tracking-tight text-[#3c1e0a] leading-none group-hover:text-[#b85018] transition-colors`}>
            Khau Katta
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#fff8f2] text-[#b85018] rounded-full border border-[#f0bd9b] shadow-xs">
=======
          <span className={`font-black ${textSize} tracking-tight text-[#2e1b10] leading-none group-hover:text-[#c86228] transition-colors`}>
            Khau Katta
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#faebd7] text-[#93370d] rounded-md border border-[#eed7c2]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            Belagavi
          </span>
        </div>
        {withTagline && (
<<<<<<< HEAD
          <span className={`${taglineSize} font-medium text-[#7c4d2e] tracking-wide mt-0.5`}>
            50+ Local Stalls &amp; Artisan Shops
=======
          <span className={`${taglineSize} font-medium text-[#735442] tracking-wide mt-0.5`}>
            50+ Stalls • Food, Crafts &amp; Lifestyle
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          </span>
        )}
      </div>
    </Link>
  );
};
