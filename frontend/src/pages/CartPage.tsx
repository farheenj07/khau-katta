import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { checkoutOrderApi } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Order } from '../types';
=======
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
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
<<<<<<< HEAD
  UtensilsCrossed,
  CreditCard,
  Banknote,
  CheckCircle2,
  X,
  Bike,
  Lock
=======
  UtensilsCrossed
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, totalItems, subtotal, deliveryFee, grandTotal, updateQuantity, removeItem, clearCart, loading } = useCart();
<<<<<<< HEAD
  const { user, token, isAuthenticated, openLoginModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
=======
  const { user, isAuthenticated, openLoginModal } = useAuth();
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

<<<<<<< HEAD
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [onlineGateway, setOnlineGateway] = useState<'PHONEPE' | 'GPAY' | 'PAYTM' | 'CARD'>('PHONEPE');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Success Modal State after payment done
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

<<<<<<< HEAD
  const handleProceedToPayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Simulate 1.2 second secure gateway processing delay for online payment
      if (paymentMode === 'ONLINE') {
        await new Promise(res => setTimeout(res, 1200));
      }

      const res = await checkoutOrderApi(
        {
          paymentMode,
          specialInstructions: specialInstructions.trim() || undefined
        },
        token || undefined
      );

      if (res.success && res.data) {
        // Clear local cart
        clearCart();
        setIsCheckoutOpen(false);
        setConfirmedOrder(res.data);
        showToast(res.message || '🎉 Order placed successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to place order. Please try again.', 'error');
      }
    } catch {
      showToast('Network error processing checkout.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 pb-24 md:pb-12 animate-fade-in font-sans">
=======
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 pb-24 md:pb-12 animate-fade-in">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
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
<<<<<<< HEAD
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28 md:pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0bd9b] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#3c1e0a] tracking-tight flex items-center gap-2">
            <span>Your Cart</span>
            <span className="text-xs bg-[#fff0e2] border border-[#f0bd9b] text-[#b85018] font-bold px-3 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </h1>
          <p className="text-xs text-[#7c4d2e] mt-0.5">
=======
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
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            Hot &amp; fresh delivery from Khau Katta stalls in Belagavi
          </p>
        </div>

<<<<<<< HEAD
        {items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="self-start sm:self-auto text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map(item => {
              const hasError = imageErrors[item.id] || !item.productImage;
              return (
                <div
                  key={item.id}
                  className="bg-[#fff8f2]/95 rounded-3xl p-4 sm:p-5 border border-[#f0bd9b] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#b85018]"
                >
                  {/* Product Info with Image */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#fce3d0] border border-[#f0bd9b] flex-shrink-0 relative">
                      {!hasError ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          onError={() => handleImageError(item.id)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#fff0e2] text-[#b85018] p-1">
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
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7c4d2e] mb-0.5 truncate">
                        <Store size={12} className="text-[#b85018] flex-shrink-0" />
                        <span className="truncate">{item.stallName}</span>
                      </div>

                      <h3 className="font-serif text-sm font-bold text-[#3c1e0a] leading-snug truncate">
                        {item.productName}
                      </h3>

                      <div className="text-xs text-[#3c1e0a] mt-1 font-mono font-bold">
                        <span>₹{item.price}</span>
                        <span className="text-[#7c4d2e] font-normal mx-1">×</span>
                        <span>{item.quantity}</span>
                        <span className="text-[#7c4d2e] font-normal mx-1">=</span>
                        <span className="text-[#b85018] font-black">₹{item.itemTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Remove */}
                  <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0bd9b]/40">
                    <div className="flex items-center gap-2 bg-[#fff0e2] rounded-full p-1 border border-[#f0bd9b] shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white hover:bg-[#fce5d2] text-[#3c1e0a] hover:text-[#b85018] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-6 text-center text-xs font-black text-[#3c1e0a] font-mono">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white hover:bg-[#fce5d2] text-[#3c1e0a] hover:text-[#b85018] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-[11px] text-[#7c4d2e] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer py-1"
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
            <div className="bg-[#fff8f2]/95 rounded-3xl p-6 border border-[#f0bd9b] shadow-sm space-y-5 sticky top-28">
              <h2 className="font-serif text-base font-black text-[#3c1e0a] tracking-tight pb-3 border-b border-[#f0bd9b]/60">
                Bill Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#7c4d2e]">
                  <span>Total Items</span>
                  <span className="font-bold font-mono text-[#3c1e0a]">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-[#7c4d2e]">
                  <span>Items Subtotal</span>
                  <span className="font-bold font-mono text-[#3c1e0a]">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-[#7c4d2e]">
                  <div className="flex items-center gap-1.5">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Belagavi Standard
                    </span>
                  </div>
                  <span className="font-bold font-mono text-[#3c1e0a]">₹{deliveryFee}</span>
                </div>

                <div className="pt-3 border-t border-[#f0bd9b] flex items-baseline justify-between text-sm">
                  <div>
                    <span className="font-black text-[#3c1e0a] text-base">Grand Total</span>
                    <p className="text-[10px] text-[#7c4d2e]">Inclusive of all local taxes</p>
                  </div>
                  <span className="text-xl font-black text-[#b85018] font-mono">₹{grandTotal}</span>
                </div>
              </div>

              {/* Belagavi Delivery Address Pill */}
              <div className="p-3.5 bg-[#fff0e2] rounded-2xl border border-[#f0bd9b] text-xs text-[#3c1e0a] flex items-start gap-2.5">
                <MapPin size={16} className="text-[#b85018] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#3c1e0a] block">Delivering to Belagavi</span>
                  <span className="text-[11px] text-[#7c4d2e]">
                    Flat 402, Sai Residency, Camp, Belagavi 590001
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-black text-sm rounded-full shadow-lg shadow-[#b85018]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment (₹{grandTotal})</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => openLoginModal('/cart')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-black text-sm rounded-full shadow-lg shadow-[#b85018]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Log In to Checkout (₹{grandTotal})</span>
                  <ArrowRight size={16} />
                </button>
              )}

              <div className="text-center">
                <Link
                  to="/stalls"
                  className="text-xs text-[#b85018] hover:text-[#963e0e] font-bold underline transition-colors"
                >
                  + Add more delicious food from 50+ stalls
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT & PAYMENT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fff8f2] rounded-3xl max-w-lg w-full border border-[#f0bd9b] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#291305] to-[#3d2314] text-white flex items-center justify-between border-b border-[#f0bd9b]/30">
              <div>
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-amber-400" />
                  <span>Select Payment Method</span>
                </h2>
                <p className="text-xs text-[#eed7c2]/80 mt-0.5">
                  Khau Katta Secure Checkout • Total: ₹{grandTotal}
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Delivery Address Review */}
              <div className="p-4 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] space-y-1 text-xs text-[#3c1e0a]">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-[#b85018]">
                    <MapPin size={14} />
                    <span>Delivering To:</span>
                  </span>
                  <span className="text-[10px] text-[#7c4d2e] underline">Default Address</span>
                </div>
                <p className="font-bold text-sm text-[#3c1e0a] pt-1">{user?.name || 'Pooja Kulkarni'} ({user?.phone || '9845012345'})</p>
                <p className="text-[#7c4d2e]">Flat 402, Sai Residency, Camp, Belagavi 590001</p>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7c4d2e] block">
                  Choose Payment Option:
                </label>

                {/* Option 1: ONLINE PAYMENT */}
                <div
                  onClick={() => setPaymentMode('ONLINE')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    paymentMode === 'ONLINE'
                      ? 'border-[#b85018] bg-[#fff0e2] shadow-sm'
                      : 'border-[#f0bd9b]/60 bg-white hover:border-[#f0bd9b]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#b85018] text-white flex items-center justify-center font-bold shadow-xs">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-[#3c1e0a]">
                          Pay Online (UPI / Credit Card / NetBanking)
                        </h3>
                        <p className="text-[11px] text-[#7c4d2e]">
                          Instant order confirmation &amp; automated stall dispatch
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === 'ONLINE'}
                      onChange={() => setPaymentMode('ONLINE')}
                      className="accent-[#b85018] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {paymentMode === 'ONLINE' && (
                    <div className="pt-3 border-t border-[#f0bd9b]/60 grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'PHONEPE', name: 'PhonePe UPI', badge: 'Fastest' },
                        { id: 'GPAY', name: 'Google Pay', badge: 'Instant' },
                        { id: 'PAYTM', name: 'Paytm Wallet/UPI', badge: 'Active' },
                        { id: 'CARD', name: 'Credit/Debit Card', badge: 'Secure' }
                      ].map(gw => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setOnlineGateway(gw.id as any)}
                          className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                            onlineGateway === gw.id
                              ? 'bg-[#3c1e0a] text-white border-[#3c1e0a] shadow-xs'
                              : 'bg-white text-[#3c1e0a] border-[#f0bd9b] hover:bg-[#fff0e2]'
                          }`}
                        >
                          <span>{gw.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-[#3c1e0a] font-mono">
                            {gw.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Option 2: CASH ON DELIVERY */}
                <div
                  onClick={() => setPaymentMode('COD')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMode === 'COD'
                      ? 'border-[#b85018] bg-[#fff0e2] shadow-sm'
                      : 'border-[#f0bd9b]/60 bg-white hover:border-[#f0bd9b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#3c1e0a]">
                        Cash on Delivery (COD)
                      </h3>
                      <p className="text-[11px] text-[#7c4d2e]">
                        Pay ₹{grandTotal} in cash or UPI to rider upon delivery
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'COD'}
                    onChange={() => setPaymentMode('COD')}
                    className="accent-[#b85018] w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Special Instructions Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3c1e0a] block">
                  Cooking / Delivery Instructions (Optional):
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please make misal extra spicy, ring bell twice"
                  className="w-full p-3 bg-white text-xs text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018]"
                />
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-6 bg-[#fff0e2] border-t border-[#f0bd9b] flex items-center justify-between gap-4">
              <div className="text-xs text-[#7c4d2e]">
                <span className="font-bold text-[#3c1e0a] block">Grand Total: ₹{grandTotal}</span>
                <span className="text-[10px]">
                  {paymentMode === 'ONLINE' ? `Paid via ${onlineGateway}` : 'Cash on Delivery'}
                </span>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment}
                className="px-6 py-3.5 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-black text-sm rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RotateCw size={16} className="animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay &amp; Place Order (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMED SUCCESS MODAL (Appears after payment completed) */}
      {confirmedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fff8f2] rounded-3xl max-w-md w-full border border-[#f0bd9b] shadow-2xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-4 border-emerald-200 shadow-lg animate-bounce">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-full border border-emerald-300">
                {confirmedOrder.orderNumber}
              </span>
              <h2 className="font-serif text-2xl font-black text-[#3c1e0a] tracking-tight">
                Order Placed &amp; Payment Successful!
              </h2>
              <p className="text-xs text-[#7c4d2e]">
                {confirmedOrder.paymentMode === 'ONLINE'
                  ? '✅ Online payment confirmed via PhonePe UPI.'
                  : '💵 Order confirmed! Please pay ₹' + confirmedOrder.totalAmount + ' cash to delivery partner upon arrival.'}
              </p>
            </div>

            {/* Order Meta details */}
            <div className="p-4 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] text-left text-xs space-y-2 text-[#3c1e0a]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#b85018]">Assigned Delivery Partner:</span>
                <span className="font-bold">{confirmedOrder.deliveryPartnerName || 'Ramesh Naik'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7c4d2e]">Estimated Delivery Time:</span>
                <span className="font-bold font-mono">18–25 Mins</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#f0bd9b]/50 pt-2 font-bold">
                <span>Total Amount:</span>
                <span className="text-[#b85018] font-mono text-sm">₹{confirmedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <Bike size={18} className="text-[#b85018] flex-shrink-0 animate-pulse" />
              <span>Stall will mark "Ready for Pickup" and generate the 6-digit Rider OTP for pickup verification.</span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  navigate('/tracking/dlv-001');
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-black text-sm rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Bike size={18} />
                <span>Track Live Order &amp; Delivery</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  navigate('/stalls');
                }}
                className="w-full py-2.5 text-xs text-[#7c4d2e] hover:text-[#3c1e0a] font-bold cursor-pointer transition-colors"
              >
                Back to Stalls
              </button>
            </div>
          </div>
        </div>
      )}
=======
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
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d

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
