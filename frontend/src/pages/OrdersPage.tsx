import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { Order, OrderItem } from '../types';
import { ShoppingBag, Star, Clock, CheckCircle2, ArrowRight, Store } from 'lucide-react';
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
        <h1 className="text-2xl font-black text-[#2e1b10] tracking-tight">Your Orders</h1>
        <p className="text-xs text-[#735442]">Live order tracking and past purchases from Khau Katta Belagavi</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-44 bg-[#faf2e8]/80 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Top Order Meta */}
              <div className="flex items-start justify-between gap-4 border-b border-[#eed7c2]/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#c86228] bg-[#faf2e8] px-2.5 py-0.5 rounded-xl border border-[#eed7c2]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-1.5 flex items-center gap-1.5">
                    <Store size={16} className="text-orange-600" />
                    <span>{order.stallName || 'Khau Katta Stall'}</span>
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-stone-900">
                    ₹{order.totalAmount}
                  </div>
                  <span className="text-[10px] text-stone-400">Total Bill</span>
                </div>
              </div>

              {/* Order Line Items */}
              <div className="space-y-2 text-xs text-stone-700">
                {order.items?.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="font-medium">{item.quantity}x {item.productName || 'Dish'}</span>
                    <span className="font-mono font-bold text-stone-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  {order.status === 'delivered' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Delivered to your doorstep
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock size={14} /> Stall is preparing fresh order
                    </span>
                  )}
                </div>

                {order.status === 'delivered' ? (
                  <Link
                    to={`/stalls/${order.stallId}`}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Star size={13} />
                    <span>Review This Stall</span>
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <Link
                    to={`/customer/orders/${order.id}/track`}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Track Order
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
