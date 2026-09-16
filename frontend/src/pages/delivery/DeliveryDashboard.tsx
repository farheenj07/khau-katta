import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bike,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Phone,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  RotateCw,
  Navigation,
  Store,
  UserCheck
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getRiderDeliveries, verifyPickupOtpApi, updateOrderStatusApi } from '../../services/api';
import { Order } from '../../types';

export const DeliveryDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { setRole } = useRole();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Input state keyed by orderId
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
  const [verificationErrors, setVerificationErrors] = useState<Record<string, string>>({});
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRiderDeliveries(token || undefined);
      setDeliveries(data);
    } catch {
      showToast('Error loading active deliveries.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  // Handle OTP submission for a specific order
  const handleVerifyOtp = async (orderId: string) => {
    const otpCode = otpInputs[orderId] || '';
    if (!otpCode || otpCode.trim().length !== 6) {
      setVerificationErrors(prev => ({ ...prev, [orderId]: 'Please enter a complete 6-digit numeric pickup OTP code.' }));
      return;
    }

    setVerifyingOrderId(orderId);
    setVerificationErrors(prev => ({ ...prev, [orderId]: '' }));

    try {
      const res = await verifyPickupOtpApi(orderId, otpCode.trim(), token || undefined);

      if (res.success) {
        showToast('✅ Pickup Verified! Order marked as Picked Up.', 'success');
        // Refresh deliveries list
        await loadDeliveries();
      } else {
        setVerificationErrors(prev => ({ ...prev, [orderId]: res.message || 'Verification failed.' }));
        showToast(res.message || 'Pickup OTP verification failed.', 'error');
      }
    } catch {
      showToast('Network error during OTP verification.', 'error');
    } finally {
      setVerifyingOrderId(null);
    }
  };

  // Transition order status from 'picked_up' -> 'out_for_delivery' or 'out_for_delivery' -> 'delivered'
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatusOrderId(orderId);
    try {
      const res = await updateOrderStatusApi(orderId, newStatus, token || undefined);
      if (res.success) {
        showToast(
          newStatus === 'out_for_delivery'
            ? '🚀 Delivery started! Customer notified.'
            : '🎉 Order marked as Delivered!',
          'success'
        );
        await loadDeliveries();
      } else {
        showToast(res.message || 'Status update failed.', 'error');
      }
    } catch {
      showToast('Error updating status.', 'error');
    } finally {
      setUpdatingStatusOrderId(null);
    }
  };

  const activeDeliveries = deliveries.filter(
    d => d.status === 'ready_for_pickup' || d.status === 'picked_up' || d.status === 'out_for_delivery'
  );
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Rider Header */}
      <div className="bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#f0bd9b]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#b85018] flex items-center justify-center text-white shadow-lg shadow-black/30 flex-shrink-0">
            <Bike size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-2xl font-black text-white">{user?.name || 'Ramesh Naik'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#d97706]/30 text-amber-300 border border-amber-400/40 rounded-md">
                Verified Rider
              </span>
            </div>
            <p className="text-xs text-[#eed7c2]/80">
              Vehicle: Scooter KA-22-EX-4589 • Belagavi Hub: Club Road Khau Katta
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isOnline
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-[#3d2314] hover:bg-[#4d2c19] text-[#eed7c2]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-stone-400'}`} />
            <span>{isOnline ? 'ONLINE • ACCEPTING TRIPS' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={loadDeliveries}
            className="p-2.5 bg-[#3d2314] hover:bg-[#4d2c19] text-[#eed7c2] rounded-xl transition-colors cursor-pointer border border-[#52392a]"
            title="Refresh deliveries"
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            to="/tracking/dlv-001"
            className="px-4 py-2.5 bg-[#b85018] hover:bg-[#963e0e] text-white text-xs rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation size={15} />
            <span>Live Navigation &amp; Map Demo</span>
          </Link>

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
        <div className="p-6 rounded-3xl bg-[#fff8f2]/95 border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#7c4d2e] font-medium">Active Pickup &amp; Deliveries</span>
          <div className="font-serif text-3xl font-black text-[#3c1e0a] mt-1">{activeDeliveries.length}</div>
          <span className="text-[11px] text-[#b85018] font-semibold">Ready for OTP verification</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#fff8f2]/95 border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#7c4d2e] font-medium">Completed Deliveries</span>
          <div className="font-serif text-3xl font-black text-[#3c1e0a] mt-1">
            {142 + completedDeliveries.length}
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold">100% On-time Belagavi</span>
        </div>
        <div className="p-6 rounded-3xl bg-[#fff8f2]/95 border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
          <span className="text-xs text-[#7c4d2e] font-medium">Estimated Earnings</span>
          <div className="font-serif text-3xl font-black text-[#b85018] mt-1">₹8,450</div>
          <span className="text-[11px] text-[#7c4d2e]">Current pay cycle</span>
        </div>
      </div>

      {/* ACTIVE DELIVERIES LIST WITH OTP VERIFICATION */}
      <div className="space-y-6">
        <h2 className="font-serif text-xl font-black text-[#3c1e0a] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package size={20} className="text-[#b85018]" />
            <span>Assigned Delivery Assignments</span>
          </span>
          <span className="text-xs bg-[#fff0e2] text-[#b85018] font-bold px-3 py-1 rounded-full border border-[#f0bd9b]">
            {activeDeliveries.length} Pending Actions
          </span>
        </h2>

        {loading ? (
          <div className="h-44 bg-[#fff0e2]/80 rounded-3xl animate-pulse border border-[#f0bd9b]" />
        ) : activeDeliveries.length > 0 ? (
          <div className="space-y-6">
            {activeDeliveries.map(order => {
              const errorMsg = verificationErrors[order.id];
              const isVerifying = verifyingOrderId === order.id;
              const isUpdating = updatingStatusOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-[#fff8f2]/95 rounded-3xl border border-[#f0bd9b] p-6 shadow-sm space-y-5 transition-all hover:border-[#b85018]"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0bd9b]/60 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-[#b85018] bg-[#fff0e2] px-3 py-1 rounded-full border border-[#f0bd9b]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${
                          order.status === 'picked_up' || order.status === 'out_for_delivery'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {order.status === 'ready_for_pickup' ? '⏳ Waiting for Pickup OTP' : order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-[#b85018]">₹{order.totalAmount}</span>
                      <span className="text-[10px] text-[#7c4d2e] block">Delivery fee: ₹30</span>
                    </div>
                  </div>

                  {/* Pickup & Dropoff Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup Stall Box */}
                    <div className="p-4 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] space-y-2 text-xs text-[#3c1e0a]">
                      <div className="flex items-center gap-1.5 font-bold text-[#b85018]">
                        <Store size={15} />
                        <span>PICKUP VENDOR STALL</span>
                      </div>
                      <p className="font-bold text-sm text-[#3c1e0a]">
                        {order.stallName || 'Belgaum Kunda & Sweets House'}
                      </p>
                      <p className="text-[#7c4d2e]">Stall {order.stallNumber || '#KK-01'}, Khau Katta, Club Road, Belagavi 590001</p>
                      <div className="pt-1 text-[11px] text-[#7c4d2e] flex items-center gap-1">
                        <Phone size={12} className="text-[#b85018]" />
                        <span>Vendor Contact: +91 94480 11111</span>
                      </div>
                    </div>

                    {/* Dropoff Customer Box */}
                    <div className="p-4 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] space-y-2 text-xs text-[#3c1e0a]">
                      <div className="flex items-center gap-1.5 font-bold text-[#b85018]">
                        <MapPin size={15} />
                        <span>DROPOFF CUSTOMER</span>
                      </div>
                      <p className="font-bold text-sm text-[#3c1e0a]">
                        {order.customerName || 'Pooja Kulkarni'}
                      </p>
                      <p className="text-[#7c4d2e]">{order.customerAddress || 'Flat 402, Sai Residency, Camp, Belagavi 590001'}</p>
                      <div className="pt-1 text-[11px] text-[#7c4d2e] flex items-center gap-1">
                        <Phone size={12} className="text-[#b85018]" />
                        <span>Customer Contact: +91 98450 12345</span>
                      </div>
                    </div>
                  </div>

                  {/* RIDER OTP VERIFICATION CARD (When status === 'ready_for_pickup') */}
                  {order.status === 'ready_for_pickup' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white shadow-md border border-[#f0bd9b]/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={20} className="text-amber-400" />
                          <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                            Rider–Vendor Pickup OTP Verification
                          </h3>
                        </div>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          {order.verificationState?.remainingAttempts ?? 5} Attempts Remaining
                        </span>
                      </div>

                      <p className="text-xs text-[#eed7c2]/90">
                        Ask the authorized vendor at <strong>{order.stallName || 'Stall'}</strong> for their 6-digit pickup OTP and enter it below to confirm pickup:
                      </p>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                          <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0bd9b]" />
                          <input
                            type="text"
                            maxLength={6}
                            value={otpInputs[order.id] || ''}
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setOtpInputs(prev => ({ ...prev, [order.id]: val }));
                              if (errorMsg) setVerificationErrors(prev => ({ ...prev, [order.id]: '' }));
                            }}
                            placeholder="Enter 6-digit Pickup OTP"
                            className="w-full pl-10 pr-4 py-3 bg-[#1e0e04] border border-[#f0bd9b]/50 rounded-xl text-white font-mono text-base tracking-widest focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>

                        <button
                          onClick={() => handleVerifyOtp(order.id)}
                          disabled={isVerifying || (otpInputs[order.id] || '').length !== 6}
                          className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            (otpInputs[order.id] || '').length === 6 && !isVerifying
                              ? 'bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white'
                              : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                          }`}
                        >
                          {isVerifying ? (
                            <>
                              <RotateCw size={14} className="animate-spin" />
                              <span>Verifying OTP...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Verify Pickup OTP</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Error Message Display */}
                      {errorMsg && (
                        <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="flex-shrink-0 text-rose-400" />
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTION CONTROLS AFTER OTP VERIFICATION */}
                  {order.status === 'picked_up' && (
                    <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 text-white space-y-3">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                        <CheckCircle2 size={18} />
                        <span>Pickup Verified Successfully! Order is in your possession.</span>
                      </div>
                      <p className="text-xs text-emerald-100">
                        Vendor OTP verified at {order.pickupVerifiedAt ? new Date(order.pickupVerifiedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'stall'}. Click below to start delivery trip to customer.
                      </p>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                        disabled={isUpdating}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Navigation size={14} />
                        <span>Start Delivery Trip (Mark Out for Delivery)</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white border border-[#f0bd9b]/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                          <Navigation size={18} className="animate-bounce" />
                          <span>Live Delivery in Progress — En Route to Customer</span>
                        </div>
                        <span className="text-[10px] bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-bold">
                          GPS Live Tracking Active
                        </span>
                      </div>

                      <p className="text-xs text-[#eed7c2]/90">
                        Deliver dish to <strong>{order.customerName || 'Pooja Kulkarni'}</strong> at <em>{order.customerAddress || 'Camp, Belagavi'}</em>.
                      </p>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={isUpdating}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        <span>Complete Delivery &amp; Mark Delivered</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#fff8f2]/95 rounded-3xl p-8 border border-[#f0bd9b] text-center space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-emerald-700" />
            <h3 className="font-serif text-base font-bold text-[#3c1e0a]">No Active Pickup Assignments</h3>
            <p className="text-xs text-[#7c4d2e]">All assigned stall orders have been picked up and delivered!</p>
          </div>
        )}
      </div>
    </div>
  );
};
