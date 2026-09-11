import React from 'react';
import { useRole } from '../../context/RoleContext';
import { UserRole } from '../../types';
import { ShieldCheck, Bike, User, Layers, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setRole, roleTitle, userName } = useRole();
  const location = useLocation();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string }[] = [
    { role: 'customer', label: 'Customer View', icon: <User size={13} />, path: '/' },
    { role: 'admin', label: 'Admin Portal', icon: <ShieldCheck size={13} />, path: '/admin' },
    { role: 'delivery_partner', label: 'Delivery Partner', icon: <Bike size={13} />, path: '/delivery' }
  ];

  return (
    <div className="bg-[#5a2912] text-[#fce6d2] text-xs py-1.5 px-4 border-b border-[#733718] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left info badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#c25e1a]/40 text-[#ffcca8] font-semibold px-2.5 py-0.5 rounded-full border border-[#c25e1a]/60 uppercase text-[10px] tracking-wider">
            <Layers size={11} /> Belagavi Multi-Role System
          </span>
          <span className="hidden md:inline text-[#fce6d2]/85">
            Current Role: <strong className="text-white font-medium">{roleTitle}</strong> ({userName})
          </span>
        </div>

        {/* Right role switcher buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#fce6d2]/70 text-[11px] mr-1 hidden sm:inline">Switch Role:</span>
          {roles.map(r => {
            const isActive = currentRole === r.role;
            return (
              <div key={r.role} className="flex items-center">
                <button
                  onClick={() => setRole(r.role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#c25e1a] text-white shadow-sm ring-1 ring-[#e28743]/60 font-bold'
                      : 'bg-[#451f0e] text-[#f5d9c2] hover:bg-[#6e3317] hover:text-white'
                  }`}
                  title={`Switch active persona to ${r.label}`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
                {isActive && !location.pathname.startsWith(r.path === '/' ? '/customer-non-existent' : r.path) && (
                  <Link
                    to={r.path}
                    className="ml-1 p-1 bg-[#c25e1a]/40 hover:bg-[#c25e1a]/70 text-[#ffcca8] rounded-lg text-[10px] flex items-center gap-0.5"
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
