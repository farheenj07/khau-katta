import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Store, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const BottomNav: React.FC = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  // Don't show bottom nav inside /admin or /delivery
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/delivery')) {
    return null;
  }

  interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    requiresAuth?: boolean;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: <Compass size={20} /> },
    { label: 'Explore', path: '/stalls', icon: <Store size={20} /> },
    { label: 'Orders', path: '/orders', icon: <ShoppingBag size={20} />, requiresAuth: true },
    { label: 'Cart', path: '/cart', icon: <ShoppingCart size={20} />, badge: totalItems > 0 ? String(totalItems) : undefined },
    { label: 'Profile', path: '/profile', icon: <User size={20} />, requiresAuth: true }
  ];


  return (
<<<<<<< HEAD
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#b85018] via-[#c0541c] to-[#963e0e] text-[#fff8f2] border-t border-[#f0bd9b]/30 shadow-[0_-6px_25px_rgba(184,80,24,0.3)] pb-safe">
=======
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfb]/95 backdrop-blur-md border-t border-[#eed7c2] shadow-[0_-4px_20px_rgba(200,98,40,0.06)] pb-safe">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          if (item.requiresAuth && !isAuthenticated) {
            return (
              <button
                key={item.path}
                onClick={() => openLoginModal(item.path)}
<<<<<<< HEAD
                className="flex flex-col items-center justify-center flex-1 py-1 text-[#ffe8d6]/80 hover:text-white transition-colors relative cursor-pointer"
=======
                className="flex flex-col items-center justify-center flex-1 py-1 text-[#735442] hover:text-[#c86228] transition-colors relative cursor-pointer"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
<<<<<<< HEAD
                    <span className="absolute -top-1 -right-2 bg-[#fff8f2] text-[#b85018] text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs border border-[#f0bd9b]">
=======
                    <span className="absolute -top-1 -right-2 bg-[#c86228] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
<<<<<<< HEAD
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive ? 'text-white font-bold scale-105' : 'text-[#ffe8d6]/75 hover:text-white'
              }`}
            >
              <div className={`relative p-1.5 rounded-full transition-all ${isActive ? 'bg-[#fff8f2]/20 shadow-xs' : ''}`}>
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#fff8f2] text-[#b85018] text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs border border-[#f0bd9b]">
=======
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? 'text-[#c86228] font-bold' : 'text-[#735442] hover:text-[#2e1b10]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#c86228] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                    {item.badge}
                  </span>
                )}
              </div>
<<<<<<< HEAD
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-white' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#fff8f2] absolute bottom-0.5 shadow-xs" />
=======
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-[#c86228]' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#c86228] absolute bottom-1 shadow-xs" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
