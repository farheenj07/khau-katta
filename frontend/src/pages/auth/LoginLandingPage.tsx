import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bike,
  BriefcaseBusiness,
  ShieldCheck,
  ShoppingBag,
  Store
} from 'lucide-react';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';

const portals = [
  {
    title: 'CUSTOMER',
    description: 'Order from Khau Katta',
    path: '/customer/login',
    accent: 'from-[#fdf2e3] via-[#fffaf3] to-[#f9e3d0]',
    icon: <ShoppingBag size={28} className="text-[#c86228]" />,
    border: 'border-[#f2d2b2]'
  },
  {
    title: 'VENDOR',
    description: 'Manage your stall',
    path: '/vendor/login',
    accent: 'from-[#fff3ea] via-[#fffaf5] to-[#f7e7d8]',
    icon: <Store size={28} className="text-[#a84e12]" />,
    border: 'border-[#ecd6bf]'
  },
  {
    title: 'DELIVERY PARTNER',
    description: 'Deliver orders',
    path: '/delivery/login',
    accent: 'from-[#f6f5ee] via-[#fffdf7] to-[#e9e1cf]',
    icon: <Bike size={28} className="text-[#544330]" />,
    border: 'border-[#e0d4ba]'
  },
  {
    title: 'ADMIN',
    description: 'Manage Khau Katta',
    path: '/admin/login',
    accent: 'from-[#fff1ee] via-[#fffaf7] to-[#f5dccd]',
    icon: <ShieldCheck size={28} className="text-[#8b2d20]" />,
    border: 'border-[#eec9bc]'
  }
];

export const LoginLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(226,135,67,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(212,122,59,0.12),_transparent_35%)]" />

      <div className="relative w-full max-w-6xl bg-white/90 border border-[#eed7c2] rounded-[32px] shadow-[0_30px_80px_rgba(114,63,32,0.12)] backdrop-blur-sm p-6 sm:p-10">
        <div className="flex justify-center mb-8">
          <KhauKattaLogo size="lg" withTagline={false} />
        </div>

        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c86228] mb-3">Khau Katta</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2e1b10]">Welcome to Khau Katta</h1>
          <p className="mt-3 text-base text-[#735442]">Choose how you want to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {portals.map(portal => (
            <Link
              key={portal.path}
              to={portal.path}
              className={`group block rounded-[28px] border bg-gradient-to-br ${portal.accent} ${portal.border} p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white/70 shadow-sm flex items-center justify-center">
                  {portal.icon}
                </div>
                <ArrowRight size={18} className="text-[#6b4a35] group-hover:text-[#c86228] transition-colors" />
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a5b46]">{portal.title}</div>
                <div className="text-xl font-black text-[#2e1b10]">{portal.description}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-[#735442]">
          Need a quick return to the storefront?{' '}
          <Link to="/" className="font-bold text-[#c86228] hover:text-[#a84e12] underline-offset-4 underline">
            Explore Khau Katta
          </Link>
        </div>
      </div>
    </div>
  );
};
