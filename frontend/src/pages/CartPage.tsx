import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Store,
  Sparkles,
  MapPin,
  ShieldCheck,
  RotateCw,
  UtensilsCrossed
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, totalItems, subtotal, deliveryFee, grandTotal, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 pb-24 md:pb-12 animate-fade-in">
        <div className="bg-[#fffdfb]/95 rounded-3xl p-8 sm:p-12 border border-[#eed7c2] shadow-sm text-center">
          <EmptyState
            icon={<ShoppingCart size={36} />}
            title="Your cart is empty"
            description="Explore Khau Katta and discover something delicious."
            actionText="Explore Stalls"
            actionPath="/stalls"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28 md:pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eed7c2] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2e1b10] tracking-tight flex items-center gap-2">
            <span>Your Cart</span>
            <span className="text-xs bg-[#faf2e8] border border-[#eed7c2] text-[#c86228] font-bold px-3 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </h1>
          <p className="text-xs text-[#735442] mt-0.5">
            Hot &amp; fresh delivery from Khau Katta stalls in Belagavi
          </p>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="self-start sm:self-auto text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map(item => {
            const hasError = imageErrors[item.id] || !item.productImage;
            return (
              <div
                key={item.id}
                className="bg-[#fffdfb]/95 rounded-3xl p-4 sm:p-5 border border-[#eed7c2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#c86228]"
              >
                {/* Product Info with Image */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 relative">
                    {!hasError ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        onError={() => handleImageError(item.id)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 text-orange-700 p-1">
                        <UtensilsCrossed size={20} className="opacity-70" />
                        <span className="text-[8px] font-bold text-center mt-1 truncate max-w-full">
                          {item.productName}
                        </span>
                      </div>
                    )}
                    {item.isVeg ? (
                      <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded bg-white/95 border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                    ) : (
                      <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded bg-white/95 border border-rose-600 flex items-center justify-center p-0.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-0.5 truncate">
                      <Store size={12} className="text-orange-600 flex-shrink-0" />
                      <span className="truncate">{item.stallName}</span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 leading-snug truncate">
                      {item.productName}
                    </h3>

                    <div className="text-xs text-stone-600 mt-1 font-mono font-bold">
                      <span>₹{item.price}</span>
                      <span className="text-stone-400 font-normal mx-1">×</span>
                      <span>{item.quantity}</span>
                      <span className="text-stone-400 font-normal mx-1">=</span>
                      <span className="text-orange-700 font-black">₹{item.itemTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quantity Stepper & Remove */}
                <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="flex items-center gap-2 bg-[#faf2e8] rounded-2xl p-1 border border-[#eed7c2] shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-[#faf2e8] text-[#2e1b10] hover:text-[#c86228] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="w-6 text-center text-xs font-black text-[#2e1b10] font-mono">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-[#faf2e8] text-[#2e1b10] hover:text-[#c86228] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-[11px] text-[#9c7f6e] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer py-1"
                    title="Remove item"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Bill Summary & Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fffdfb]/95 rounded-3xl p-6 border border-[#eed7c2] shadow-sm space-y-5 sticky top-28">
            <h2 className="text-base font-black text-[#2e1b10] tracking-tight pb-3 border-b border-[#eed7c2]/60">
              Bill Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#735442]">
                <span>Total Items</span>
                <span className="font-bold font-mono text-[#2e1b10]">{totalItems}</span>
              </div>

              <div className="flex items-center justify-between text-[#735442]">
                <span>Items Subtotal</span>
                <span className="font-bold font-mono text-[#2e1b10]">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-[#735442]">
                <div className="flex items-center gap-1.5">
                  <span>Delivery Fee</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Belagavi Standard
                  </span>
                </div>
                <span className="font-bold font-mono text-[#2e1b10]">₹{deliveryFee}</span>
              </div>

              <div className="pt-3 border-t border-[#eed7c2] flex items-baseline justify-between text-sm">
                <div>
                  <span className="font-black text-[#2e1b10] text-base">Grand Total</span>
                  <p className="text-[10px] text-[#9c7f6e]">Inclusive of all local taxes</p>
                </div>
                <span className="text-xl font-black text-[#c86228] font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Belagavi Delivery Address Pill */}
            <div className="p-3.5 bg-[#faf2e8] rounded-2xl border border-[#eed7c2] text-xs text-[#4a2e1d] flex items-start gap-2.5">
              <MapPin size={16} className="text-[#c86228] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2e1b10] block">Delivering to Belagavi</span>
                <span className="text-[11px] text-[#735442]">
                  Club Road, Camp, Tilakwadi, Shahapur &amp; Hindwadi
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            {isAuthenticated ? (
              <button
                onClick={() => alert(`Khau Katta Checkout Prototype:\n\nTotal Bill: ₹${grandTotal}\nTotal Items: ${totalItems}\nDelivering to: ${user?.name} (${user?.phone})\n\nPayment gateways & order dispatch will be connected in next stage!`)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b2541f] hover:to-[#c06a05] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#c86228]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => openLoginModal('/cart')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b2541f] hover:to-[#c06a05] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#c86228]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Log In to Checkout (₹{grandTotal})</span>
                <ArrowRight size={16} />
              </button>
            )}

            <div className="text-center">
              <Link
                to="/stalls"
                className="text-xs text-orange-700 hover:text-orange-900 font-bold underline transition-colors"
              >
                + Add more delicious food from 50+ stalls
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Empty Your Cart?"
        message="Are you sure you want to remove all items from your cart? You will need to browse stalls to add them again."
        confirmText="Yes, Clear Cart"
        isDestructive={true}
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
