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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfb]/95 backdrop-blur-md border-t border-[#eed7c2] shadow-[0_-4px_20px_rgba(200,98,40,0.06)] pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          if (item.requiresAuth && !isAuthenticated) {
            return (
              <button
                key={item.path}
                onClick={() => openLoginModal(item.path)}
                className="flex flex-col items-center justify-center flex-1 py-1 text-[#735442] hover:text-[#c86228] transition-colors relative cursor-pointer"
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 bg-[#c86228] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
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
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? 'text-[#c86228] font-bold' : 'text-[#735442] hover:text-[#2e1b10]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#c86228] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-[#c86228]' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#c86228] absolute bottom-1 shadow-xs" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
