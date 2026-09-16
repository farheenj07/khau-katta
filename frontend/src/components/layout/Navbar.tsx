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
    { name: 'View Stalls', path: '/stalls', icon: <Store size={16} /> },
    { name: 'About & Vision', path: '/about', icon: <Info size={16} /> },
  ];

  return (
    <header className="bg-[#fff8f2]/95 backdrop-blur-md sticky top-[31px] z-40 border-b border-[#f0bd9b] shadow-[0_4px_20px_rgba(184,80,24,0.08)] transition-all">
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
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#3c1e0a] bg-[#fff0e2] hover:bg-[#fce5d2] rounded-2xl border border-[#f0bd9b] transition-colors text-left max-w-[260px] cursor-pointer shadow-xs"
            >
              <div className="w-6 h-6 rounded-xl bg-[#b85018]/15 text-[#b85018] flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-[#b85018] animate-pulse" />
              </div>
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold text-[#b85018] tracking-wider">Delivery Area</div>
                <div className="font-semibold text-[#3c1e0a] truncate">{selectedLocation}</div>
              </div>
              <ChevronDown size={14} className="text-[#7c4d2e] ml-1 flex-shrink-0" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#fff8f2] rounded-3xl shadow-xl border border-[#f0bd9b] p-2.5 z-50">
                <div className="text-[11px] font-bold text-[#7c4d2e] px-3 py-1.5 uppercase tracking-wider">
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
                        ? 'bg-[#fce5d2] font-bold text-[#b85018]'
                        : 'text-[#3c1e0a] hover:bg-[#fce5d2]/60'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#b85018]" />}
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
                placeholder="Search Belgaum Kunda, Misal, Silver, Handlooms..."
                className="w-full pl-10 pr-24 py-2.5 bg-[#fff0e2] hover:bg-[#fce5d2] focus:bg-white text-xs md:text-sm text-[#3c1e0a] rounded-full border border-[#f0bd9b] focus:border-[#b85018] focus:ring-2 focus:ring-[#b85018]/20 focus:outline-none transition-all placeholder:text-[#7c4d2e]/70"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-[#7c4d2e] pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#fce5d2] text-[#b85018] font-bold border border-[#f0bd9b]'
                      : 'text-[#5c351f] hover:text-[#b85018] hover:bg-[#fce5d2]/60'
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold text-[#5c351f] hover:text-[#b85018] hover:bg-[#fce5d2]/60 transition-colors"
            >
              <ShoppingBag size={16} />
              <span>Orders</span>
            </Link>

            {/* Cart link (desktop) */}
            <Link
              to="/cart"
              className="relative px-3 py-2 text-[#5c351f] hover:text-[#b85018] rounded-2xl hover:bg-[#fce5d2]/60 transition-colors flex items-center gap-1.5"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#b85018] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#3c1e0a]">
                Cart {totalItems > 0 ? `(${totalItems})` : ''}
              </span>
            </Link>

            {/* Customer Profile / Login */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#fff0e2] hover:bg-[#fce5d2] border border-[#f0bd9b] hover:border-[#b85018] transition-all text-xs font-bold text-[#3c1e0a]"
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
                onClick={() => openLoginModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <LogIn size={14} />
                <span>Log In</span>
              </button>
            )}

            {/* Admin Portal Shortcut */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#fce5d2] text-[#b85018] border border-[#f0bd9b]'
                  : 'text-[#7c4d2e] hover:bg-[#fce5d2]/60'
              }`}
            >
              <ShieldCheck size={16} className="text-[#b85018]" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Actions (Cart, Login/Profile, Menu toggle) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/cart"
              className="p-2 text-[#3c1e0a] hover:text-[#b85018] relative"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#b85018] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full overflow-hidden border border-[#f0bd9b]"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-3.5 py-1.5 bg-[#b85018] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer hover:bg-[#963e0e]"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3c1e0a] hover:text-[#b85018] rounded-xl"
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
              className="w-full pl-9 pr-16 py-2 bg-[#fff0e2] text-xs rounded-full border border-[#f0bd9b] focus:border-[#b85018] focus:outline-none placeholder:text-[#7c4d2e]/70 text-[#3c1e0a]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#7c4d2e]" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#b85018] text-white rounded-full text-xs font-bold"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#f0bd9b] bg-[#fff8f2] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="p-3 bg-[#fff0e2] rounded-2xl flex items-center gap-2 border border-[#f0bd9b] text-xs text-[#3c1e0a] font-medium">
            <MapPin size={16} className="text-[#b85018] flex-shrink-0" />
            <span className="truncate">{selectedLocation}</span>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#3c1e0a] hover:bg-[#fce5d2] hover:text-[#b85018]"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#3c1e0a] hover:bg-[#fce5d2] hover:text-[#b85018]"
            >
              <ShoppingBag size={16} />
              <span>My Orders</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#3c1e0a] hover:bg-[#fce5d2] hover:text-[#b85018]"
            >
              <UserIcon size={16} />
              <span>Customer Profile</span>
            </Link>

            <div className="pt-2 border-t border-[#f0bd9b]/60">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-semibold text-[#7c4d2e] hover:bg-[#fce5d2]"
              >
                <ShieldCheck size={16} className="text-[#b85018]" />
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
