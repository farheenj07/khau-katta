import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KhauKattaLogo } from '../common/KhauKattaLogo';
import {
  MapPin,
  Search,
  Menu,
  X,
  ChevronDown,
  Compass,
  Store,
  Info,
  ShieldCheck,
  Bike,
  ShoppingCart,
  User as UserIcon,
  LogIn,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Club Road / Camp, Belagavi 590001');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const belagaviLocalities = [
    'Club Road / Camp, Belagavi 590001',
    'Tilakwadi & Congress Road, Belagavi 590006',
    'Shahapur & Khade Bazar, Belagavi 590003',
    'Hindwadi & Goaves, Belagavi 590011',
    'Rani Chennamma Circle / CBT, Belagavi 590002',
    'Udyambag Industrial Hub, Belagavi 590008'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stalls?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass size={16} /> },
    { name: 'Explore Stalls', path: '/stalls', icon: <Store size={16} /> },
    { name: 'About & Vision', path: '/about', icon: <Info size={16} /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-[31px] z-40 border-b border-[#e8c4a2] shadow-[0_4px_20px_rgba(194,94,26,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <KhauKattaLogo size="md" withTagline={true} />
          </div>

          {/* Location / Address Selector */}
          <div className="relative hidden lg:flex items-center">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#4a2e1d] bg-[#fdf3e7] hover:bg-[#faebd7] rounded-2xl border border-[#e8c4a2] transition-colors text-left max-w-[260px] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-xl bg-[#c25e1a]/15 text-[#c25e1a] flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-[#c25e1a] animate-pulse" />
              </div>
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold text-[#c86228] tracking-wider">Delivery Area</div>
                <div className="font-semibold text-[#2e1b10] truncate">{selectedLocation}</div>
              </div>
              <ChevronDown size={14} className="text-[#9c7f6e] ml-1 flex-shrink-0" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#fffdfb] rounded-3xl shadow-xl border border-[#eed7c2] p-2.5 z-50">
                <div className="text-[11px] font-bold text-[#9c7f6e] px-3 py-1.5 uppercase tracking-wider">
                  Select Belagavi Locality
                </div>
                {belagaviLocalities.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-2xl text-xs flex items-center justify-between transition-colors ${
                      selectedLocation === loc
                        ? 'bg-[#faf2e8] font-bold text-[#c86228]'
                        : 'text-[#4a2e1d] hover:bg-[#faf2e8]/70'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#c86228]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Belgaum Kunda, Misal, Silver, Handlooms, Toys..."
                className="w-full pl-10 pr-24 py-2.5 bg-[#fdf3e7] hover:bg-[#faebd7] focus:bg-white text-xs md:text-sm text-[#2a1408] rounded-full border border-[#e8c4a2] focus:border-[#c25e1a] focus:ring-2 focus:ring-[#c25e1a]/20 focus:outline-none transition-all placeholder:text-[#9c7f6e]"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-[#9c7f6e] pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-[#c25e1a] to-[#d97706] hover:from-[#a84e12] hover:to-[#b45309] text-white rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <span>Find</span>
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#fdf0e2] text-[#c25e1a] font-bold border border-[#e8c4a2]/60'
                      : 'text-[#5c351f] hover:text-[#c25e1a] hover:bg-[#fdf0e2]'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Orders link (desktop) */}
            <Link
              to="/orders"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#5c351f] hover:text-[#c25e1a] hover:bg-[#fdf0e2] transition-colors"
            >
              <ShoppingBag size={16} />
              <span>Orders</span>
            </Link>

            {/* Cart link (desktop) */}
            <Link
              to="/cart"
              className="relative p-2 text-[#5c351f] hover:text-[#c25e1a] rounded-2xl hover:bg-[#fdf0e2] transition-colors flex items-center gap-1.5"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#c25e1a] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#2a1408]">
                Cart {totalItems > 0 ? `(${totalItems})` : ''}
              </span>
            </Link>

            {/* Customer Profile / Login */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#fdf3e7] hover:bg-[#faebd7] border border-[#e8c4a2] hover:border-[#c25e1a] transition-all text-xs font-bold text-[#2a1408]"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="max-w-[90px] truncate">{user?.name}</span>
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#c25e1a] to-[#d97706] hover:from-[#a84e12] hover:to-[#b45309] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <LogIn size={14} />
                <span>Log In</span>
              </button>
            )}
          </nav>

          {/* Mobile Actions (Cart, Login/Profile, Menu toggle) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/cart"
              className="p-2 text-[#4a2e1d] hover:text-[#c86228] relative"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#c86228] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full overflow-hidden border border-[#eed7c2]"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-1.5 bg-[#c86228] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4a2e1d] hover:text-[#c86228] rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 50+ stalls, food, jewellery..."
              className="w-full pl-9 pr-16 py-2 bg-[#faf2e8]/80 text-xs rounded-full border border-[#eed7c2] focus:border-[#c86228] focus:outline-none placeholder:text-[#a08372] text-[#2e1b10]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#9c7f6e]" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#c86228] text-white rounded-full text-xs font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#eed7c2] bg-[#fffdfb] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="p-3 bg-[#faf2e8] rounded-2xl flex items-center gap-2 border border-[#eed7c2] text-xs text-[#4a2e1d] font-medium">
            <MapPin size={16} className="text-[#c86228] flex-shrink-0" />
            <span className="truncate">{selectedLocation}</span>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#4a2e1d] hover:bg-[#faf2e8] hover:text-[#c86228]"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#4a2e1d] hover:bg-[#faf2e8] hover:text-[#c86228]"
            >
              <ShoppingBag size={16} />
              <span>My Orders</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#4a2e1d] hover:bg-[#faf2e8] hover:text-[#c86228]"
            >
              <UserIcon size={16} />
              <span>Customer Profile</span>
            </Link>

            <div className="pt-2 border-t border-[#eed7c2]/60">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#8c502b] hover:bg-[#faf2e8]"
              >
                <ShieldCheck size={16} className="text-[#c86228]" />
                <span>Admin Portal</span>
              </Link>
              <Link
                to="/delivery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                <Bike size={16} className="text-emerald-600" />
                <span>Delivery Partner Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
