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
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#b85018] via-[#c0541c] to-[#963e0e] shadow-md shadow-[#b85018]/25 group-hover:scale-105 transition-transform duration-200"
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
            fill="#FFF5EC"
          />
          {/* Traditional Brass / Terracotta Bowl */}
          <path
            d="M14 30C14 36 18.5 40 24 40C29.5 40 34 36 34 30H14Z"
            fill="#FCE3D0"
          />
          {/* Rising Flavor Swirls */}
          <path
            d="M19 8C19 6 21 5 21 3"
            stroke="#FFF8F2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M24 8C24 5 26 4 26 2"
            stroke="#FFF8F2"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M29 8C29 6 31 5 31 3"
            stroke="#FFF8F2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Gem / Artisan Sparkle */}
          <circle cx="24" cy="22" r="2.5" fill="#B85018" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-serif font-black ${textSize} tracking-tight text-[#3c1e0a] leading-none group-hover:text-[#b85018] transition-colors`}>
            Khau Katta
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#fff8f2] text-[#b85018] rounded-full border border-[#f0bd9b] shadow-xs">
            Belagavi
          </span>
        </div>
        {withTagline && (
          <span className={`${taglineSize} font-medium text-[#7c4d2e] tracking-wide mt-0.5`}>
            50+ Local Stalls &amp; Artisan Shops
          </span>
        )}
      </div>
    </Link>
  );
};
