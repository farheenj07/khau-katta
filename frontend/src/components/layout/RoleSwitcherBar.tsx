import React from 'react';
import { useRole } from '../../context/RoleContext';
import { UserRole } from '../../types';
import { ShieldCheck, Bike, User, Layers, ArrowUpRight, Store } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setRole, roleTitle, userName } = useRole();
  const location = useLocation();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string }[] = [
    { role: 'customer', label: 'Customer View', icon: <User size={13} />, path: '/' },
    { role: 'vendor', label: 'Vendor Dashboard', icon: <Store size={13} />, path: '/vendor/dashboard' },
    { role: 'admin', label: 'Admin Portal', icon: <ShieldCheck size={13} />, path: '/admin' },
    { role: 'delivery_partner', label: 'Delivery Partner', icon: <Bike size={13} />, path: '/delivery' }
  ];

  return (
    <div className="bg-[#3c1e0a] text-[#fff8f2] text-xs py-1.5 px-4 border-b border-[#b85018]/40 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left info badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#b85018]/40 text-[#fce3d0] font-bold px-2.5 py-0.5 rounded-full border border-[#b85018]/60 uppercase text-[10px] tracking-wider">
            <Layers size={11} /> Belagavi Multi-Role System
          </span>
          <span className="hidden md:inline text-[#ffe8d6]/90">
            Current Role: <strong className="text-white font-medium">{roleTitle}</strong> ({userName})
          </span>
        </div>

        {/* Right role switcher buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#ffe8d6]/70 text-[11px] mr-1 hidden sm:inline">Switch Role:</span>
          {roles.map(r => {
            const isActive = currentRole === r.role;
            return (
              <div key={r.role} className="flex items-center">
                <button
                  onClick={() => setRole(r.role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#b85018] text-white shadow-xs ring-1 ring-[#f0bd9b]/60 font-bold'
                      : 'bg-[#291305] text-[#fce3d0] hover:bg-[#b85018]/50 hover:text-white'
                  }`}
                  title={`Switch active persona to ${r.label}`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
                {isActive && !location.pathname.startsWith(r.path === '/' ? '/customer-non-existent' : r.path) && (
                  <Link
                    to={r.path}
                    className="ml-1 p-1 bg-[#b85018]/40 hover:bg-[#b85018]/70 text-[#fce3d0] rounded-lg text-[10px] flex items-center gap-0.5"
                    title={`Go to ${r.label} dashboard`}
                  >
                    Go <ArrowUpRight size={10} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
