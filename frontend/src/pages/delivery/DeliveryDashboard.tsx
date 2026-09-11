import React, { useState } from 'react';
import { Bike, MapPin, Package, CheckCircle2, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export const DeliveryDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { setRole } = useRole();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Rider Header */}
      <div className="bg-gradient-to-r from-[#24150b] via-[#3a2012] to-[#24150b] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#eed7c2]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#c86228] flex items-center justify-center text-white shadow-lg shadow-black/30">
            <Bike size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">Ramesh Naik</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#d97706]/30 text-amber-300 border border-amber-400/40 rounded-md">
                Verified Rider
              </span>
            </div>
            <p className="text-xs text-[#eed7c2]/80">
              Vehicle: Scooter KA-22-EX-4589 • Belagavi Hub: Club Road Khau Katta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#3d2314] hover:bg-[#4d2c19] text-[#eed7c2]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-stone-400'}`} />
            <span>{isOnline ? 'ONLINE • ACCEPTING TRIPS' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={() => setRole('customer')}
            className="px-3.5 py-2.5 bg-[#3d2314] hover:bg-[#4d2c19] text-[#eed7c2] text-xs rounded-xl font-semibold transition-colors cursor-pointer border border-[#52392a]"
          >
            Customer View
          </button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#735442] font-medium">Completed Deliveries</span>
          <div className="text-3xl font-black text-[#2e1b10] mt-1">142</div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% On-time Belagavi</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#735442] font-medium">Rider Rating</span>
          <div className="text-3xl font-black text-[#2e1b10] mt-1">4.85 ⭐</div>
          <span className="text-[11px] text-[#9c7f6e]">Based on 110 customer reviews</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#735442] font-medium">Estimated Earnings</span>
          <div className="text-3xl font-black text-[#c86228] mt-1">₹8,450</div>
          <span className="text-[11px] text-[#9c7f6e]">Current pay cycle</span>
        </div>
      </div>

      {/* Sample Assigned Order Preview */}
      <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2e1b10] flex items-center gap-2">
            <Package size={18} className="text-[#c86228]" />
            <span>Assigned Delivery Assignment (Stage 1 Architecture)</span>
          </h2>
          <span className="px-3 py-1 bg-[#faebd7] text-[#93370d] font-mono text-xs font-bold rounded-lg border border-[#eed7c2]">
            KK-2026-00129
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#fdf8f3] border border-[#eed7c2] space-y-3 text-xs text-[#735442]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-[#2e1b10] text-sm">Pickup: Belgaum Kunda &amp; Sweets House</p>
              <p className="text-[#735442]">Stall #KK-01, Khau Katta, Club Road</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5ec] text-emerald-800 border border-emerald-200">
              Delivered
            </span>
          </div>

          <div className="border-t border-[#eed7c2] pt-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-[#2e1b10]">Dropoff: Pooja Kulkarni</p>
              <p className="text-[#735442]">Flat 402, Sai Residency, Near Nucleus Mall, Camp, Belagavi 590001</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#2e1b10]">₹450 (Paid via UPI)</p>
              <p className="text-[#9c7f6e]">Delivery fee: ₹30</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#faebd7]/70 rounded-2xl border border-[#eed7c2] text-xs text-[#735442] flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0" />
          <span>Rider role validation and delivery assignments schema (<code>delivery_assignments</code>, <code>delivery_locations</code>) are fully active. Live GPS updates will be enabled in Stage 2.</span>
        </div>
      </div>
    </div>
  );
};
