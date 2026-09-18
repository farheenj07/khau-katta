import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, LocateFixed, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkoutOrderApi, getUserAddresses } from '../services/api';
import { UserAddress } from '../types';
import { useToast } from '../context/ToastContext';

export const CheckoutPage: React.FC = () => {
  const { token, isAuthenticated, openLoginModal } = useAuth();
  const { items, subtotal, deliveryFee, grandTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressId, setAddressId] = useState('');
  const [deliveryLatitude, setDeliveryLatitude] = useState<number | undefined>();
  const [deliveryLongitude, setDeliveryLongitude] = useState<number | undefined>();
  const [locationAccuracy, setLocationAccuracy] = useState<number | undefined>();
  const [locationMessage, setLocationMessage] = useState('Location permission has not been requested.');
  const [locationError, setLocationError] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const locationMarkerRef = useRef<L.CircleMarker | null>(null);
  const [paymentMode, setPaymentMode] = useState<'COD' | 'ONLINE'>('COD');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    getUserAddresses(token).then(data => {
      setAddresses(data);
      setAddressId(data.find(address => address.isDefault)?.id || data[0]?.id || '');
    });
  }, [token]);

  const selectedAddress = addresses.find(address => address.id === addressId);

  useEffect(() => {
    if (!isMapOpen || !mapContainerRef.current) return;
    const initialLat = deliveryLatitude ?? 15.8522;
    const initialLng = deliveryLongitude ?? 74.5042;
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], deliveryLatitude ? 16 : 13);
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    const marker = L.circleMarker([initialLat, initialLng], { radius: 9, color: '#c86228', fillColor: '#f97316', fillOpacity: 0.9 }).addTo(map);
    locationMarkerRef.current = marker;
    map.on('click', event => {
      setDeliveryLatitude(event.latlng.lat);
      setDeliveryLongitude(event.latlng.lng);
      setLocationAccuracy(undefined);
      setLocationMessage('Map location selected. Confirm this destination to attach it to the order.');
      marker.setLatLng(event.latlng);
    });
    return () => {
      map.remove();
      mapRef.current = null;
      locationMarkerRef.current = null;
    };
  }, [isMapOpen]);

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by this device. You can manually use a saved address.');
      return;
    }
    setLocationError('');
    setLocationMessage('Requesting permission and improving location accuracy...');
    navigator.geolocation.getCurrentPosition(
      position => {
        setDeliveryLatitude(position.coords.latitude);
        setDeliveryLongitude(position.coords.longitude);
        setLocationAccuracy(position.coords.accuracy);
        setLocationMessage(`Location confirmed${position.coords.accuracy ? ` within ${Math.round(position.coords.accuracy)} m` : ''}.`);
      },
      () => {
        setLocationMessage('Location permission was not granted.');
        setLocationError('Location access is required for live delivery tracking. You can manually enter or select your delivery address.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  if (!isAuthenticated || !token) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ShieldCheck size={42} className="mx-auto text-orange-600 mb-4" />
        <h1 className="text-2xl font-black text-[#2e1b10]">Sign in to complete checkout</h1>
        <p className="text-sm text-[#735442] mt-2 mb-6">Your cart is ready. Sign in so we can securely create and track your order.</p>
        <button onClick={() => openLoginModal('/checkout')} className="px-5 py-3 rounded-2xl bg-orange-600 text-white font-bold">Sign in</button>
      </div>
    );
  }

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!items.length) {
      showToast('Your cart is empty.', 'error');
      navigate('/cart');
      return;
    }
    if (!addressId) {
      showToast('Please select a delivery address.', 'error');
      return;
    }

    setSubmitting(true);
    const result = await checkoutOrderApi({
      paymentMode,
      addressId,
      specialInstructions,
      deliveryAddress: selectedAddress ? `${selectedAddress.addressLine1}, ${selectedAddress.area}, ${selectedAddress.city} - ${selectedAddress.pincode}` : undefined,
      deliveryLatitude,
      deliveryLongitude,
      locationAccuracy,
      locationUpdatedAt: deliveryLatitude !== undefined ? new Date().toISOString() : undefined
    }, token);
    setSubmitting(false);
    if (!result.success) {
      showToast(result.message || 'Unable to place your order.', 'error');
      return;
    }
    showToast('Order placed successfully.', 'success');
    navigate(result.data?.id ? `/customer/orders/${result.data.id}/track` : '/orders');
  };

  return (
    <form onSubmit={placeOrder} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-6">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-orange-700"><ArrowLeft size={16} /> Back to cart</Link>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-orange-700">Secure checkout</p>
        <h1 className="text-3xl font-black text-[#2e1b10] mt-1">Complete your order</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <section className="bg-white rounded-3xl border border-[#eed7c2] p-5 space-y-4">
            <h2 className="font-black text-lg flex items-center gap-2"><MapPin size={19} className="text-orange-600" /> Delivery address</h2>
            {addresses.length ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {addresses.map(address => (
                  <label key={address.id} className={`block rounded-2xl border p-4 cursor-pointer ${addressId === address.id ? 'border-orange-600 bg-orange-50' : 'border-stone-200'}`}>
                    <input type="radio" name="address" value={address.id} checked={addressId === address.id} onChange={() => setAddressId(address.id)} className="sr-only" />
                    <span className="font-bold text-sm block">{address.label}</span>
                    <span className="text-xs text-stone-600 block mt-1">{address.addressLine1}, {address.area}, {address.city} - {address.pincode}</span>
                  </label>
                ))}
              </div>
            ) : <p className="text-sm text-stone-600">No saved address found. Add an address from your profile before ordering.</p>}
          </section>

          <section className="bg-white rounded-3xl border border-[#eed7c2] p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-lg flex items-center gap-2"><LocateFixed size={19} className="text-orange-600" /> Delivery Location</h2>
                <p className="text-xs text-stone-600 mt-1">Confirm the destination for this order. Your profile address will not be changed.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Private to this order</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={requestCurrentLocation} className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-black text-white flex items-center gap-2">
                <LocateFixed size={15} /> Use My Current Location
              </button>
              <button type="button" onClick={() => setIsMapOpen(true)} className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-black text-orange-800">
                Select Location on Map
              </button>
            </div>
            {isMapOpen && (
              <div className="space-y-2">
                <div ref={mapContainerRef} className="h-64 w-full rounded-2xl overflow-hidden border border-orange-200" />
                <p className="text-[11px] text-stone-500">Select a point on the map, then close it when the destination is confirmed.</p>
                <button type="button" onClick={() => setIsMapOpen(false)} className="rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700">Confirm Map Location</button>
              </div>
            )}
            <p className={`text-xs ${deliveryLatitude !== undefined ? 'text-emerald-700' : 'text-stone-600'}`}>{locationMessage}</p>
            {deliveryLatitude !== undefined && deliveryLongitude !== undefined && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                Confirmed destination: {deliveryLatitude.toFixed(6)}, {deliveryLongitude.toFixed(6)}
              </div>
            )}
            {locationError && <p className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">{locationError}</p>}
          </section>

          <section className="bg-white rounded-3xl border border-[#eed7c2] p-5 space-y-4">
            <h2 className="font-black text-lg flex items-center gap-2"><CreditCard size={19} className="text-orange-600" /> Payment method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(['COD', 'ONLINE'] as const).map(mode => (
                <label key={mode} className={`rounded-2xl border p-4 cursor-pointer ${paymentMode === mode ? 'border-orange-600 bg-orange-50' : 'border-stone-200'}`}>
                  <input type="radio" name="payment" value={mode} checked={paymentMode === mode} onChange={() => setPaymentMode(mode)} className="mr-2" />
                  <span className="font-bold text-sm">{mode === 'COD' ? 'Cash on Delivery' : 'Online payment (demo)'}</span>
                </label>
              ))}
            </div>
            <textarea value={specialInstructions} onChange={event => setSpecialInstructions(event.target.value)} placeholder="Delivery instructions (optional)" rows={3} className="w-full rounded-2xl border border-stone-200 p-3 text-sm outline-none focus:border-orange-500" />
          </section>
        </div>

        <aside className="bg-white rounded-3xl border border-[#eed7c2] p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-black text-lg border-b border-stone-100 pb-3">Order summary</h2>
          <div className="space-y-3 py-4 text-sm">
            <div className="flex justify-between"><span>Items</span><span>{items.length}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryFee}</span></div>
            <div className="flex justify-between border-t pt-3 font-black text-lg"><span>Total</span><span className="text-orange-700">₹{grandTotal}</span></div>
          </div>
          <button disabled={submitting || !addressId} className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-black disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? 'Placing order...' : <><CheckCircle2 size={17} /> Place order</>}
          </button>
        </aside>
      </div>
    </form>
  );
};
