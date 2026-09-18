import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, MapPin, Package, CheckCircle2, Clock, Phone, AlertCircle, ShieldCheck, KeyRound, LogOut, Navigation, WifiOff } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { declineDeliveryApi, getDeliveryTracking, getRiderDeliveries, updateDeliveryStatusApi, updateRiderGpsApi, updateRiderPresenceApi, verifyDeliveryOtpApi, verifyPickupOtpApi } from '../../services/api';
import { Delivery, Order } from '../../types';
import { DeliveryTrackingMap } from '../../components/map/DeliveryTrackingMap';

export const DeliveryDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { setRole } = useRole();
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [otpByOrder, setOtpByOrder] = useState<Record<string, string>>({});
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
  const [deliveryOtpByOrder, setDeliveryOtpByOrder] = useState<Record<string, string>>({});
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const [locationMessage, setLocationMessage] = useState('GPS starts after pickup verification.');
  const lastGpsSentRef = React.useRef<{ timestamp: number; latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!token) return;
    const load = () => getRiderDeliveries(token).then(setDeliveries);
    load();
    const interval = window.setInterval(load, 4000);
    return () => window.clearInterval(interval);
  }, [token]);

  const activeOrder = deliveries.find(order => ['assigned', 'accepted', 'arrived_at_vendor', 'ready_for_pickup', 'pickup_verified', 'picked_up', 'out_for_delivery', 'arrived_at_customer'].includes(order.assignmentStatus || order.status));

  useEffect(() => {
    if (token) updateRiderPresenceApi(isOnline, token);
  }, [isOnline, token]);

  useEffect(() => {
    if (!token || !activeOrder) {
      setActiveDelivery(null);
      return;
    }
    const deliveryId = activeOrder.deliveryId || activeOrder.id;
    const load = () => getDeliveryTracking(deliveryId, token).then(data => data && setActiveDelivery(data));
    load();
    const interval = window.setInterval(load, 4000);
    return () => window.clearInterval(interval);
  }, [activeOrder?.deliveryId, activeOrder?.id, token]);

  useEffect(() => {
    if (!token || !activeOrder || !['picked_up', 'out_for_delivery'].includes(activeOrder.assignmentStatus || activeOrder.status)) return;
    if (!navigator.geolocation) {
      setLocationMessage('GPS is not supported on this device.');
      return;
    }
    setLocationMessage('Requesting rider location permission...');
    const deliveryId = activeOrder.deliveryId || activeOrder.id;
    const watchId = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const previous = lastGpsSentRef.current;
        const elapsed = previous ? Date.now() - previous.timestamp : Infinity;
        const distance = previous ? Math.hypot(latitude - previous.latitude, longitude - previous.longitude) : Infinity;
        if (elapsed < 5000 && distance < 0.0004) return;
        lastGpsSentRef.current = { timestamp: Date.now(), latitude, longitude };
        setLocationMessage(accuracy && accuracy > 100 ? 'Improving location accuracy...' : 'Live GPS location is updating.');
        updateRiderGpsApi(deliveryId, latitude, longitude, accuracy, speed === null ? undefined : (speed || 0) * 3.6, heading === null ? undefined : heading, token);
      },
      () => setLocationMessage('Location permission is required to send live rider updates.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeOrder?.deliveryId, activeOrder?.id, activeOrder?.assignmentStatus, activeOrder?.status, token]);

  const handleLogout = () => {
    logout();
    showToast('Delivery partner session terminated.', 'info');
    navigate('/delivery/login', { replace: true });
  };

  const openCustomerView = () => {
    // This is a public marketplace preview; it must not try to grant the
    // rider access to another customer's protected order data.
    setRole('customer');
    navigate('/');
  };

  const verifyPickup = async (order: Order) => {
    const otp = otpByOrder[order.id] || '';
    if (!/^\d{6}$/.test(otp)) {
      showToast('Enter the 6-digit pickup OTP provided by the vendor.', 'error');
      return;
    }
    setVerifyingOrderId(order.id);
    const result = await verifyPickupOtpApi(order.id, otp, token || undefined);
    setVerifyingOrderId(null);
    if (!result.success) {
      showToast(result.message || 'Incorrect pickup OTP.', 'error');
      return;
    }
    showToast('Pickup verified successfully. Delivery tracking is now active.', 'success');
    setDeliveries(previous => previous.map(item => item.id === order.id ? { ...item, status: 'pickup_verified', assignmentStatus: 'pickup_verified' } : item));
  };

  const declineDelivery = async (order: Order) => {
    const result = await declineDeliveryApi(order.deliveryId || order.id, token || undefined);
    if (!result.success) {
      showToast(result.message || 'Unable to decline delivery.', 'error');
      return;
    }
    showToast('Delivery returned to the admin assignment queue.', 'info');
    setDeliveries(previous => previous.filter(item => item.id !== order.id));
  };

  const updateDeliveryStatus = async (order: Order, status: 'accepted' | 'arrived_at_vendor' | 'out_for_delivery' | 'arrived_at_customer') => {
    const result = await updateDeliveryStatusApi(order.deliveryId || order.id, status, token || undefined);
    if (!result.success) {
      showToast(result.message || 'Unable to update delivery status.', 'error');
      return;
    }
    showToast(status === 'out_for_delivery' ? 'Delivery is now on the way.' : `Delivery marked ${status.replaceAll('_', ' ')}.`, 'success');
    setDeliveries(previous => previous.map(item => item.id === order.id ? { ...item, assignmentStatus: status } : item));
  };

  const verifyDelivery = async (order: Order) => {
    const otp = deliveryOtpByOrder[order.id] || '';
    if (!/^\d{6}$/.test(otp)) {
      showToast('Enter the 6-digit Delivery OTP.', 'error');
      return;
    }
    const result = await verifyDeliveryOtpApi(order.deliveryId || order.id, otp, token || undefined);
    if (!result.success) {
      showToast(result.message || 'Incorrect Delivery OTP.', 'error');
      return;
    }
    showToast('Order delivered successfully.', 'success');
    setDeliveries(previous => previous.map(item => item.id === order.id ? { ...item, status: 'delivered' } : item));
    setActiveDelivery(null);
  };

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
              <h1 className="text-2xl font-black text-white">{user?.name || 'Delivery Partner'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#d97706]/30 text-amber-300 border border-amber-400/40 rounded-md">
                Verified Rider
              </span>
            </div>
            <p className="text-xs text-[#eed7c2]/80">
              Delivery partner account • Belagavi Hub: Club Road Khau Katta
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
            onClick={openCustomerView}
            className="px-3.5 py-2.5 bg-[#3d2314] hover:bg-[#4d2c19] text-[#eed7c2] text-xs rounded-xl font-semibold transition-colors cursor-pointer border border-[#52392a]"
          >
            Customer View
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs rounded-xl font-bold transition-colors cursor-pointer border border-rose-800/80 flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Logout</span>
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
      {deliveries.filter(order => ['assigned', 'accepted', 'arrived_at_vendor', 'ready_for_pickup', 'pickup_verified'].includes(order.assignmentStatus || order.status)).map(order => (
        <div key={order.id} className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-orange-700">{(order.assignmentStatus || order.status) === 'assigned' ? 'New Delivery Assignment' : 'Pickup Workflow'}</p>
              <h2 className="text-xl font-black text-[#2e1b10] mt-1">Order #{order.orderNumber}</h2>
              <p className="text-sm text-[#735442] mt-1">Pickup: {order.stallName} · Drop-off: {order.customerAddress || 'Customer address'}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{(order.assignmentStatus || order.status).replaceAll('_', ' ')}</span>
          </div>
          {(order.assignmentStatus || order.status) === 'assigned' && <div className="flex flex-wrap gap-3"><button type="button" onClick={() => updateDeliveryStatus(order, 'accepted')} className="rounded-xl bg-orange-600 px-5 py-3 text-white font-black text-sm">Accept Delivery</button><button type="button" onClick={() => declineDelivery(order)} className="rounded-xl border border-rose-300 px-5 py-3 text-rose-700 font-black text-sm">Decline</button></div>}
          {(order.assignmentStatus || order.status) === 'accepted' && <div className="flex flex-wrap gap-3"><button type="button" onClick={() => updateDeliveryStatus(order, 'arrived_at_vendor')} className="rounded-xl bg-orange-600 px-5 py-3 text-white font-black text-sm">Arrived at Vendor</button><span className="text-xs text-[#735442] self-center">Navigate to {order.stallName}</span></div>}
          {['arrived_at_vendor', 'ready_for_pickup'].includes(order.assignmentStatus || order.status) && <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
            <p className="text-sm font-bold text-[#2e1b10] flex items-center gap-2"><KeyRound size={17} className="text-orange-600" /> Enter the 6-digit pickup OTP provided by the vendor</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <input
                value={otpByOrder[order.id] || ''}
                onChange={event => setOtpByOrder(previous => ({ ...previous, [order.id]: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full sm:w-44 text-center tracking-[0.45em] text-xl font-black rounded-xl border border-orange-300 px-3 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={`Pickup OTP for order ${order.orderNumber}`}
              />
              <button type="button" onClick={() => verifyPickup(order)} disabled={verifyingOrderId === order.id} className="rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black px-5 py-3 flex items-center justify-center gap-2">
                <ShieldCheck size={17} /> {verifyingOrderId === order.id ? 'Verifying...' : 'Verify Pickup'}
              </button>
            </div>
          </div>}
          {(order.assignmentStatus || order.status) === 'pickup_verified' && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-3"><span className="text-sm font-black text-emerald-800"><CheckCircle2 size={17} className="inline mr-2" />Pickup Verified</span><button type="button" onClick={() => updateDeliveryStatus(order, 'out_for_delivery')} className="rounded-xl bg-orange-600 px-4 py-2.5 text-white font-black text-xs">Start Delivery</button></div>}
        </div>
      ))}

      {activeOrder && activeDelivery && (
        <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-emerald-700">Active Delivery</p>
              <h2 className="text-xl font-black text-[#2e1b10] mt-1">Order #{activeDelivery.orderNumber}</h2>
              <p className="text-sm text-[#735442] mt-1">{activeDelivery.stallName} to {activeDelivery.deliveryAddress}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{activeDelivery.status.replaceAll('_', ' ')}</span>
          </div>
          <DeliveryTrackingMap delivery={activeDelivery} height="320px" showRouteOptimizerToggle={false} autoFollowRider={false} />
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#735442]">
            <span className="inline-flex items-center gap-1.5"><Navigation size={14} className="text-emerald-700" /> {activeDelivery.remainingDistanceKm?.toFixed(1) || '0.0'} km remaining</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> ETA {activeDelivery.remainingDurationMins || 0} min</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {locationMessage}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {(activeOrder.assignmentStatus || activeOrder.status) === 'picked_up' && <button type="button" onClick={() => updateDeliveryStatus(activeOrder, 'out_for_delivery')} className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-black text-white flex items-center gap-2"><Navigation size={15} /> Start Delivery</button>}
            {(activeOrder.assignmentStatus || activeOrder.status) === 'out_for_delivery' && (
              <button type="button" onClick={() => updateDeliveryStatus(activeOrder, 'arrived_at_customer')} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white flex items-center gap-2"><MapPin size={15} /> Arrived at Customer</button>
            )}
            {(activeOrder.assignmentStatus || activeOrder.status) === 'arrived_at_customer' && <div className="w-full rounded-2xl bg-orange-50 border border-orange-200 p-4 space-y-3"><p className="text-sm font-black text-[#2e1b10]">Ask the customer for the 6-digit Delivery OTP.</p><div className="flex gap-3"><input value={deliveryOtpByOrder[activeOrder.id] || ''} onChange={event => setDeliveryOtpByOrder(previous => ({ ...previous, [activeOrder.id]: event.target.value.replace(/\D/g, '').slice(0, 6) }))} maxLength={6} inputMode="numeric" placeholder="000000" className="w-40 rounded-xl border border-orange-300 px-3 py-2 text-center font-black tracking-[0.3em]" /><button type="button" onClick={() => verifyDelivery(activeOrder)} className="rounded-xl bg-orange-600 px-4 py-2 text-white font-black text-xs">Verify Delivery OTP</button></div></div>}
          </div>
        </div>
      )}

      {!activeOrder && (
        <div className="rounded-3xl border border-[#eed7c2] bg-[#fffdfb]/95 p-8 text-center shadow-xs">
          <Package size={30} className="mx-auto text-[#c86228]" />
          <h2 className="mt-3 text-lg font-black text-[#2e1b10]">No delivery assignment yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#735442]">
            When an admin assigns you an order, it will appear here automatically. The Pickup OTP entry is shown only after you accept the assignment and tap “Arrived at Vendor”.
          </p>
          <p className="mt-3 text-xs font-semibold text-[#c86228]">Stay online to be available for assignment.</p>
        </div>
      )}

    </div>
  );
};
