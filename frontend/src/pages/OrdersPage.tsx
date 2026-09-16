import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { Order, OrderItem } from '../types';
import { ShoppingBag, Star, Clock, CheckCircle2, ArrowRight, Store, Bike } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const OrdersPage: React.FC = () => {
  const { user, token, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (token) {
      getMyOrders(token)
        .then(setOrders)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 px-4">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Sign in to View Orders"
          description="Log in with your mobile OTP to check live status and review delivered Belagavi stall orders."
          actionText="Log In with Mobile OTP"
          onActionClick={() => openLoginModal('/orders')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#3c1e0a] tracking-tight">Your Orders</h1>
        <p className="text-xs text-[#7c4d2e]">Live order tracking and past purchases from Khau Katta Belagavi</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-44 bg-[#fff0e2]/80 rounded-3xl animate-pulse border border-[#f0bd9b]" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-[#fff8f2]/95 rounded-3xl border border-[#f0bd9b] p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Top Order Meta */}
              <div className="flex items-start justify-between gap-4 border-b border-[#f0bd9b]/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#b85018] bg-[#fff0e2] px-3 py-0.5 rounded-full border border-[#f0bd9b]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#fff0e2] text-[#b85018] border border-[#f0bd9b]'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#3c1e0a] mt-1.5 flex items-center gap-1.5">
                    <Store size={16} className="text-[#b85018]" />
                    <span>{order.stallName || 'Khau Katta Stall'}</span>
                  </h3>
                  <p className="text-[11px] text-[#7c4d2e] mt-0.5">
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-[#b85018] font-mono">
                    ₹{order.totalAmount}
                  </div>
                  <span className="text-[10px] text-[#7c4d2e]">Total Bill</span>
                </div>
              </div>

              {/* Live Tracking Banner for picked_up and out_for_delivery */}
              {(order.status === 'picked_up' || order.status === 'out_for_delivery') && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white border border-[#f0bd9b]/30 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <Bike size={18} className="animate-bounce text-amber-400" />
                      <span>LIVE DELIVERY TRACKING</span>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                      Verified Rider Pickup
                    </span>
                  </div>

                  <p className="text-xs text-[#eed7c2]/90 leading-relaxed">
                    {order.status === 'picked_up' ? (
                      <>🚴 <strong>Ramesh Naik (Delivery Partner)</strong> has verified the 6-digit pickup OTP at <em>{order.stallName || 'the stall'}</em> and picked up your food!</>
                    ) : (
                      <>🚀 <strong>Ramesh Naik</strong> is en route to your location with your piping hot order from <em>{order.stallName || 'Belagavi Stall'}</em>.</>
                    )}
                  </p>

                  <div className="pt-2 border-t border-[#f0bd9b]/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#eed7c2]">
                    <span>Rider: <strong>Ramesh Naik</strong> (Scooter KA-22-EX-4589)</span>
                    <Link
                      to="/tracking/dlv-001"
                      className="px-3.5 py-1.5 bg-[#b85018] hover:bg-[#963e0e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bike size={14} />
                      <span>Track Live Map &amp; Route</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Order Line Items */}
              <div className="space-y-2 text-xs text-[#3c1e0a]">
                {order.items?.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-[#f0bd9b]/20 last:border-0">
                    <span className="font-medium">{item.quantity}x {item.productName || 'Dish'}</span>
                    <span className="font-mono font-bold text-[#3c1e0a]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons & Status Footer */}
              <div className="pt-3 border-t border-[#f0bd9b]/40 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#7c4d2e] flex items-center gap-1">
                  {order.status === 'delivered' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Delivered to your doorstep
                    </span>
                  ) : order.status === 'picked_up' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Order Picked Up (OTP Verified)
                    </span>
                  ) : order.status === 'out_for_delivery' ? (
                    <span className="text-[#b85018] font-bold flex items-center gap-1">
                      <Bike size={14} /> Delivery Partner on the way
                    </span>
                  ) : (
                    <span className="text-[#b85018] font-semibold flex items-center gap-1">
                      <Clock size={14} /> Stall is preparing fresh order
                    </span>
                  )}
                </div>

                {order.status === 'delivered' ? (
                  <Link
                    to={`/stalls/${order.stallId}`}
                    className="px-4 py-2 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Star size={13} />
                    <span>Review This Stall</span>
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <Link
                    to={`/stalls/${order.stallId}`}
                    className="px-4 py-1.5 bg-[#fff0e2] hover:bg-[#fce5d2] text-[#b85018] font-semibold text-xs rounded-full transition-colors border border-[#f0bd9b]"
                  >
                    View Stall
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="No Orders Yet"
          description="Your order history will appear here once you place orders with Belagavi stalls."
          actionText="Explore 50+ Stalls"
          actionPath="/stalls"
        />
      )}
    </div>
  );
};
