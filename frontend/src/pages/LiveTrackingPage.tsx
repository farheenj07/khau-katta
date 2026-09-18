import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bike,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCw,
  Play,
  Pause,
  Share2,
  Navigation,
  Star,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getDeliveryOtpApi, getDeliveryTracking, stepSimulationApi, toggleSimulationApi } from '../services/api';
import { Delivery } from '../types';
import { DeliveryTrackingMap } from '../components/map/DeliveryTrackingMap';

export const LiveTrackingPage: React.FC = () => {
  const { id, orderId } = useParams<{ id?: string; orderId?: string }>();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const previousStatusRef = React.useRef<string | null>(null);
  const [chatLogs, setChatLogs] = useState<{ sender: 'rider' | 'customer'; text: string; time: string }[]>([
    { sender: 'rider', text: 'Namaste! I have collected your hot order from Belgaum Kunda House and am navigating via Camp Road.', time: 'Just now' }
  ]);
  const [deliveryOtp, setDeliveryOtp] = useState<string | null>(null);

  const deliveryId = id || orderId || 'dlv-001';

  const loadData = useCallback(async () => {
    try {
      const data = await getDeliveryTracking(deliveryId, token || undefined);
      if (data) {
        setDelivery(data);
      }
    } catch {
      // Graceful handling
    } finally {
      setLoading(false);
    }
  }, [deliveryId, token]);

  useEffect(() => {
    loadData();
    if (delivery?.status === 'delivered' || delivery?.status === 'cancelled') return;
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [loadData, delivery?.status]);

  useEffect(() => {
    if (!delivery) return;
    const previousStatus = previousStatusRef.current;
    if (previousStatus && previousStatus !== delivery.status) {
      const messages: Record<string, string> = {
        confirmed: 'Your order has been confirmed.',
        preparing: 'Your order is being prepared.',
        ready_for_pickup: 'Your rider has been assigned and is heading to the stall.',
        picked_up: 'Your rider has picked up your order.',
        out_for_delivery: 'Your order is on the way.',
        delivered: 'Your order has been delivered.'
      };
      if (messages[delivery.status]) showToast(messages[delivery.status], delivery.status === 'delivered' ? 'success' : 'info');
    }
    previousStatusRef.current = delivery.status;
    if (delivery.status === 'delivered') {
      setIsSimulating(false);
      showToast('Your order has been delivered.', 'success');
    }
  }, [delivery?.status, showToast]);

  useEffect(() => {
    if (delivery?.status !== 'arrived_at_customer' || !token) return;
    getDeliveryOtpApi(delivery.orderId, token).then(result => {
      if (result.success && result.data) setDeliveryOtp(result.data.otpCode);
    });
  }, [delivery?.status, delivery?.orderId, token]);

  // Demo Simulation Interval Runner
  useEffect(() => {
    let simInterval: any = null;
    if (isSimulating) {
      simInterval = setInterval(async () => {
        const res = await stepSimulationApi(deliveryId, token || undefined);
        if (res.success && res.data) {
          setDelivery(res.data);
          if (res.data.simulationProgress >= 1.0) {
            setIsSimulating(false);
            showToast('🎉 Order Delivered successfully!', 'success');
          }
        }
      }, 1500);
    }
    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [isSimulating, deliveryId, showToast]);

  const handleToggleSimulation = async () => {
    const res = await toggleSimulationApi(deliveryId, token || undefined);
    if (res.success && res.data) {
      setDelivery(res.data);
      setIsSimulating(res.data.simulationMode);
      showToast(
        res.data.simulationMode ? '▶ Simulation Demo Mode Enabled! Watch rider move live.' : '⏸ Simulation Paused.',
        'info'
      );
    }
  };

  const handleShareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Khau Katta Live Delivery Tracking',
        text: `Track delivery for order ${delivery?.orderNumber} live!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Live tracking link copied to clipboard!', 'success');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = { sender: 'customer' as const, text: chatMessage.trim(), time: 'Just now' };
    setChatLogs(prev => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatLogs(prev => [
        ...prev,
        { sender: 'rider', text: 'Received! Approaching your residency in 5 minutes.', time: 'Just now' }
      ]);
    }, 1000);
  };

  if (loading || !delivery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4 font-sans">
        <RotateCw size={28} className="animate-spin text-[#b85018] mx-auto" />
        <p className="text-xs text-[#7c4d2e] font-bold">Connecting to Belagavi GPS Telemetry Stream...</p>
      </div>
    );
  }

  const isDelivered = delivery.status === 'delivered';
  const remainingDist = delivery.remainingDistanceKm?.toFixed(1);
  const remainingTime = delivery.remainingDurationMins;
  const lastUpdatedSeconds = Math.max(0, Math.floor((Date.now() - new Date(delivery.lastUpdated).getTime()) / 1000));
  const statusMessage = delivery.status === 'delivered'
    ? 'Your order has been delivered'
    : delivery.status === 'out_for_delivery'
    ? 'Your order is on the way'
    : delivery.status === 'picked_up'
    ? 'Your order has been picked up'
    : delivery.status === 'ready_for_pickup'
    ? 'Your rider is heading to the stall'
    : delivery.status === 'assigned'
    ? 'Your rider has been assigned'
    : 'Your order is being prepared';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans pb-28 md:pb-12 animate-fade-in">
      {/* Top Header & Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fff8f2]/95 rounded-3xl p-6 border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff0e2] text-[#b85018] rounded-full text-xs font-mono font-bold mb-1 border border-[#f0bd9b]">
            <Package size={14} />
            <span>Order #{delivery?.orderNumber || 'KK-2026-00180'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#3c1e0a] tracking-tight">
            Real-Time Delivery Tracking &amp; Navigation
          </h1>
          <p className="text-xs text-[#7c4d2e]">
            Belagavi GPS telemetry • Stall: <strong>{delivery?.stallName || 'Belgaum Kunda House'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* DEMO MODE SIMULATION TOGGLE BUTTON */}
          <button
            onClick={handleToggleSimulation}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] text-white'
            }`}
          >
            {isSimulating ? <Pause size={14} /> : <Play size={14} />}
            <span>{isSimulating ? 'Pause Simulation' : '▶ Play Simulation Demo Mode'}</span>
          </button>

          <button
            onClick={handleShareTracking}
            className="px-3.5 py-2 bg-[#fff0e2] hover:bg-[#fce5d2] text-[#3c1e0a] text-xs font-bold rounded-2xl border border-[#f0bd9b] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 size={14} className="text-[#b85018]" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC ETA CARD */}
      <div className="bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#f0bd9b]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-amber-300 font-mono font-bold uppercase tracking-wider">
              {isDelivered ? 'Order Complete' : 'Live Delivery In Progress'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-white">
            {isDelivered ? 'Your Order Has Arrived!' : statusMessage}
          </h2>
          <p className="text-xs text-[#eed7c2]/90 flex items-center gap-2">
            <Navigation size={14} className="text-amber-400" />
            <span>{isDelivered ? 'Delivered to your doorstep' : `${remainingDist} km remaining • Estimated arrival ${remainingTime} min`}</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">{lastUpdatedSeconds < 15 ? 'Live update' : `Last updated ${lastUpdatedSeconds}s ago`}</span>
          </p>
        </div>

        {/* Machine Learning Delay Prediction Badge */}
        <div className="p-4 rounded-2xl bg-[#1d0e04] border border-[#f0bd9b]/30 space-y-2 max-w-xs text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-[#eed7c2]/80 uppercase text-[10px] tracking-wider">AI Delivery Prediction</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                delivery.mlPrediction?.prediction === 'ON_TIME'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}
            >
              {delivery.mlPrediction?.prediction === 'ON_TIME' ? '🟢 Likely On Time' : '🟠 Possible Delay'}
            </span>
          </div>
          <div className="text-xs text-white font-bold font-mono">
            {delivery.mlPrediction?.confidencePercentage ?? 85}% Confidence • Risk Score: {delivery.mlPrediction?.riskScore ?? 30}/100
          </div>
          <p className="text-[10px] text-[#eed7c2]/70">
            {delivery.mlPrediction?.contributingFactors?.[2]?.description || delivery.mlPrediction?.contributingFactors?.[0]?.description || 'Optimal traffic corridor flow'}
          </p>
        </div>
      </div>

      {/* FULL SCREEN INTERACTIVE LEAFLET MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#3c1e0a] flex items-center gap-2">
            <Layers size={18} className="text-[#b85018]" />
            <span>Live Interactive GPS Navigation Map</span>
          </h3>
          <span className="text-xs text-[#7c4d2e] font-mono font-bold">
            {delivery.currentLocationAccuracy && delivery.currentLocationAccuracy > 100 ? 'Improving rider location accuracy...' : `Rider: ${delivery.currentLat ?? 0}, ${delivery.currentLng ?? 0}`}
          </span>
        </div>

        <DeliveryTrackingMap
          delivery={delivery}
          height="480px"
          showRouteOptimizerToggle={false}
          autoFollowRider={true}
        />
      </div>

      {delivery.status === 'arrived_at_customer' && deliveryOtp && (
        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-orange-700">Delivery Verification</p>
          <p className="mt-1 text-sm text-[#3c1e0a]">Share this 6-digit Delivery OTP with your rider.</p>
          <p className="mt-2 font-mono text-3xl font-black tracking-[0.35em] text-[#b85018]">{deliveryOtp}</p>
        </div>
      )}

      {/* TWO COLUMN LOWER LAYOUT: Timeline & Rider Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Delivery Status Timeline */}
        <div className="lg:col-span-7 bg-[#fff8f2]/95 rounded-3xl p-6 sm:p-8 border border-[#f0bd9b] shadow-xs space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#3c1e0a] border-b border-[#f0bd9b]/60 pb-3">
            Delivery Status Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#f0bd9b]">
            {[
              { status: 'placed', title: 'Order Placed', desc: 'Your order was received by Khau Katta', done: true },
              { status: 'confirmed', title: 'Order Confirmed', desc: 'Vendor accepted your order', done: ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(delivery.status) },
              { status: 'preparing', title: 'Preparing', desc: 'Your stall is preparing the order', done: ['preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(delivery.status) },
              { status: 'ready_for_pickup', title: 'Packed & Rider Assigned', desc: 'The rider is going to the stall', done: ['ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(delivery.status) },
              { status: 'picked_up', title: 'Pickup Verified', desc: 'The rider collected your order with OTP', done: ['picked_up', 'out_for_delivery', 'delivered'].includes(delivery.status) },
              { status: 'out_for_delivery', title: 'Out for Delivery', desc: 'Your rider is heading to your destination', done: ['out_for_delivery', 'delivered'].includes(delivery.status), current: delivery.status === 'out_for_delivery' },
              { status: 'delivered', title: 'Delivered', desc: 'Handed over at your destination', done: isDelivered, current: isDelivered }
            ].map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-10">
                <div
                  className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    step.done
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : step.current
                      ? 'bg-[#b85018] border-[#b85018] text-white animate-pulse'
                      : 'bg-[#fff0e2] border-[#f0bd9b] text-[#7c4d2e]'
                  }`}
                >
                  {step.done ? <CheckCircle2 size={16} /> : idx + 1}
                </div>

                <div>
                  <h4 className={`font-serif text-sm font-bold ${step.done ? 'text-[#3c1e0a]' : 'text-[#7c4d2e]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#7c4d2e] mt-0.5">{step.desc}</p>
                  {delivery.statusHistory?.find(history => history.status === step.status) && (
                    <p className="text-[10px] text-[#9c7f6e] mt-1">{new Date(delivery.statusHistory.find(history => history.status === step.status)!.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Road-route details: no fabricated alternate or AI route comparison. */}
          <div className="p-5 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] space-y-3 text-xs text-[#3c1e0a]">
            <div className="flex items-center justify-between font-bold border-b border-[#f0bd9b]/60 pb-2">
              <span className="flex items-center gap-1.5 text-[#b85018]">
                <TrendingUp size={15} />
                <span>Recommended driving route</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                OSRM road routing
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-[#fff8f2] rounded-xl border border-[#f0bd9b]/50">
                <span className="text-[10px] text-[#7c4d2e] block">Road distance</span>
                <span className="font-mono font-bold text-[#b85018] text-sm">{remainingDist ?? '—'} km</span>
              </div>
              <div className="p-2 bg-[#fff8f2] rounded-xl border border-[#f0bd9b]/50">
                <span className="text-[10px] text-[#7c4d2e] block">Routing ETA</span>
                <span className="font-mono font-bold text-[#b85018] text-sm">{remainingTime ?? '—'} min</span>
              </div>
              <div className="p-2 bg-[#fff8f2] rounded-xl border border-[#f0bd9b]/50">
                <span className="text-[10px] text-[#7c4d2e] block">Route status</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{delivery.roadRoute ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Partner Card & Chat Drawer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#fff8f2]/95 rounded-3xl p-6 sm:p-8 border border-[#f0bd9b] shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#3c1e0a] border-b border-[#f0bd9b]/60 pb-3 flex items-center justify-between">
              <span>Your Delivery Partner</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                Verified Rider
              </span>
            </h3>

            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt={delivery?.partnerName || 'Rider'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#b85018] shadow-md"
              />
              <div>
                <h4 className="font-serif text-base font-bold text-[#3c1e0a]">{delivery?.partnerName || 'Ramesh Naik'}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#7c4d2e] mt-0.5">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star size={13} className="fill-amber-500" /> 4.85
                  </span>
                  <span>•</span>
                  <span>142 Belagavi Trips</span>
                </div>
                <p className="text-[11px] font-mono text-[#b85018] font-bold mt-1">
                  Scooter: {delivery?.partnerVehicleNumber || 'KA-22-EX-4589'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${delivery?.partnerPhone || '9880054321'}`}
                className="py-3 px-4 bg-[#fff0e2] hover:bg-[#fce5d2] text-[#b85018] font-bold text-xs rounded-2xl border border-[#f0bd9b] flex items-center justify-center gap-2 transition-colors"
              >
                <Phone size={15} />
                <span>Call Rider</span>
              </a>

              <button
                onClick={() => setIsChatOpen(true)}
                className="py-3 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] text-white font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>In-App Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIDER CHAT MODAL DRAWER */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fff8f2] rounded-3xl max-w-md w-full border border-[#f0bd9b] shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#291305] to-[#3d2314] text-white flex items-center justify-between border-b border-[#f0bd9b]/30">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" className="w-8 h-8 rounded-full" alt="" />
                <div>
                  <h4 className="text-xs font-bold text-white">{delivery.partnerName}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Online • Navigating</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {chatLogs.map((log, idx) => (
                <div key={idx} className={`flex flex-col ${log.sender === 'customer' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${log.sender === 'customer' ? 'bg-[#b85018] text-white' : 'bg-[#fff0e2] text-[#3c1e0a] border border-[#f0bd9b]'}`}>
                    {log.text}
                  </div>
                  <span className="text-[9px] text-[#7c4d2e] mt-1">{log.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 bg-[#fff0e2] border-t border-[#f0bd9b] flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Type message to rider..."
                className="flex-1 p-2.5 bg-white text-xs text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none"
              />
              <button type="submit" className="px-4 py-2.5 bg-[#b85018] text-white text-xs font-bold rounded-xl">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
