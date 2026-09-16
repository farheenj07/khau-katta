import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserAddresses, saveUserAddress, updateProfile, getMyReviews, getMyOrders } from '../services/api';
import { UserAddress, Review, Order, OrderItem } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Star,
  Heart,
  HelpCircle,
  LogOut,
  Edit2,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, token, logout, updateUserProfile, openLoginModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'reviews' | 'wishlist' | 'support'>('profile');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // New address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressLine1, setAddressLine1] = useState('');
  const [area, setArea] = useState('Camp');
  const [pincode, setPincode] = useState('590001');

  useEffect(() => {
    if (!user) {
      openLoginModal('/profile');
      return;
    }

    setNameInput(user.name);
    setAvatarUrlInput(user.avatarUrl || '');

    if (token) {
      getUserAddresses(token).then(setAddresses);
      getMyOrders(token).then(setOrders);
      getMyReviews(token).then(setReviews);
    }
  }, [user, token, openLoginModal]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-stone-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 mx-auto flex items-center justify-center">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Please Log In</h2>
        <p className="text-xs text-stone-500">
          Sign in with your mobile OTP to view your orders, reviews, and saved addresses.
        </p>
        <button
          onClick={() => openLoginModal('/profile')}
          className="px-6 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Login with Mobile OTP
        </button>
      </div>
    );
  }

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    try {
      const res = await updateProfile({ name: nameInput.trim() }, token || undefined);
      if (res.success) {
        updateUserProfile({ name: nameInput.trim() });
        setIsEditingName(false);
        showToast('Name updated successfully!', 'success');
      }
    } catch {
      showToast('Failed to update name.', 'error');
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarUrlInput.trim()) return;
    try {
      const res = await updateProfile({ avatarUrl: avatarUrlInput.trim() }, token || undefined);
      if (res.success) {
        updateUserProfile({ avatarUrl: avatarUrlInput.trim() });
        setIsChangingAvatar(false);
        showToast('Profile photo updated!', 'success');
      }
    } catch {
      showToast('Failed to update photo.', 'error');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1.trim()) return;

    try {
      const res = await saveUserAddress({ addressLine1, area, pincode, isDefault: true }, token || undefined);
      if (res.success && res.data) {
        setAddresses(prev => [...prev, res.data!]);
        setShowAddAddress(false);
        setAddressLine1('');
        showToast('Address saved successfully!', 'success');
      }
    } catch {
      showToast('Failed to save address.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header Profile Hero Card */}
<<<<<<< HEAD
      <div className="bg-gradient-to-r from-[#3c1e0a] via-[#291305] to-[#4c240c] text-[#fff8f2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#f0bd9b]/30 relative overflow-hidden">
=======
      <div className="bg-gradient-to-r from-[#3d2012] via-[#24130b] to-[#4a2717] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#eed7c2]/30 relative overflow-hidden">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user.name}
<<<<<<< HEAD
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#f0bd9b]/80 shadow-lg"
              />
              <button
                onClick={() => setIsChangingAvatar(!isChangingAvatar)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#b85018] hover:bg-[#963e0e] text-white rounded-full shadow-md text-xs cursor-pointer"
=======
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
              />
              <button
                onClick={() => setIsChangingAvatar(!isChangingAvatar)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#c86228] hover:bg-[#b2541f] text-white rounded-xl shadow-md text-xs cursor-pointer"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                title="Change photo"
              >
                <Edit2 size={12} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
<<<<<<< HEAD
                      className="px-3 py-1 text-sm bg-[#291305] text-white rounded-xl border border-[#b85018] focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
=======
                      className="px-2 py-1 text-sm bg-stone-800 text-white rounded-lg border border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <>
<<<<<<< HEAD
                    <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight">{user.name}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[#ffe8d6]/80 hover:text-white p-1"
=======
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.name}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[#eed7c2]/80 hover:text-white p-1"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      title="Edit Name"
                    >
                      <Edit2 size={13} />
                    </button>
                  </>
                )}
              </div>

<<<<<<< HEAD
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#ffe8d6]/90">
                <span className="flex items-center gap-1 font-mono">
                  <Phone size={12} className="text-[#e89558]" />
=======
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#eed7c2]/90">
                <span className="flex items-center gap-1 font-mono">
                  <Phone size={12} className="text-[#f5a866]" />
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  +91 {user.phone}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1">
<<<<<<< HEAD
                    <Mail size={12} className="text-[#d97706]" />
                    {user.email}
                  </span>
                )}
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
=======
                    <Mail size={12} className="text-[#fbbf24]" />
                    {user.email}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                  Verified Customer
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
<<<<<<< HEAD
            className="px-4 py-2 bg-[#291305]/90 hover:bg-rose-950 text-[#ffe8d6] hover:text-rose-200 text-xs font-bold rounded-full border border-[#f0bd9b]/30 flex items-center gap-2 cursor-pointer transition-colors"
=======
            className="px-4 py-2 bg-[#2f1c10]/90 hover:bg-rose-950 text-[#eed7c2] hover:text-rose-200 text-xs font-bold rounded-2xl border border-[#eed7c2]/30 flex items-center gap-2 cursor-pointer transition-colors"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        {/* Change Avatar Selector drawer */}
        {isChangingAvatar && (
<<<<<<< HEAD
          <div className="mt-4 pt-4 border-t border-[#f0bd9b]/20 text-xs space-y-2">
            <p className="font-bold text-[#f0bd9b]">Select an Avatar Preset or enter photo URL:</p>
=======
          <div className="mt-4 pt-4 border-t border-[#eed7c2]/20 text-xs space-y-2">
            <p className="font-bold text-[#f5a866]">Select an Avatar Preset or enter photo URL:</p>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            <div className="flex items-center gap-2 flex-wrap">
              {avatarPresets.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAvatarUrlInput(url);
                    updateProfile({ avatarUrl: url }, token || undefined).then(() => {
                      updateUserProfile({ avatarUrl: url });
                      setIsChangingAvatar(false);
                      showToast('Avatar updated!', 'success');
                    });
                  }}
<<<<<<< HEAD
                  className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-[#f0bd9b]/40 hover:border-[#b85018] cursor-pointer"
=======
                  className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#eed7c2]/40 hover:border-[#c86228] cursor-pointer"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Navigation Tabs */}
<<<<<<< HEAD
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#f0bd9b]">
=======
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#eed7c2]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        {[
          { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
          { id: 'orders', label: `My Orders (${orders.length})`, icon: <ShoppingBag size={15} /> },
          { id: 'reviews', label: `My Reviews (${reviews.length})`, icon: <Star size={15} /> },
          { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: <MapPin size={15} /> },
          { id: 'wishlist', label: 'Wishlist (2)', icon: <Heart size={15} /> },
          { id: 'support', label: 'Help & Support', icon: <HelpCircle size={15} /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
<<<<<<< HEAD
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#b85018] text-white shadow-md'
                  : 'bg-[#fff8f2] text-[#3c1e0a] hover:bg-[#fff0e2] border border-[#f0bd9b]'
=======
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#c86228] text-white shadow-md'
                  : 'bg-[#fffdfb] text-[#735442] hover:bg-[#faf2e8] border border-[#eed7c2]'
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
              <span className="text-stone-400 font-medium">Customer Name</span>
              <p className="text-sm font-bold text-stone-900">{user.name}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
              <span className="text-stone-400 font-medium">Verified Phone</span>
              <p className="text-sm font-bold text-stone-900 font-mono">+91 {user.phone}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
              <span className="text-stone-400 font-medium">Email Address</span>
              <p className="text-sm font-bold text-stone-900">{user.email || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
              <span className="text-stone-400 font-medium">Marketplace City</span>
              <p className="text-sm font-bold text-stone-900">Belagavi, Karnataka 590001</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Order History</h3>
            <span className="text-xs text-stone-400">{orders.length} Total Orders</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(o => (
                <div
                  key={o.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                        {o.orderNumber}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 mt-1">
                        {o.stallName || 'Khau Katta Stall'}
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status.replace('_', ' ')}
                      </span>
                      <div className="text-sm font-black text-stone-900 mt-1">
                        ₹{o.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2 text-xs text-stone-700">
                    {o.items?.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{item.quantity}x {item.productName || 'Dish'}</span>
                        <span className="font-mono font-semibold">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Review CTA if Delivered */}
                  {o.status === 'delivered' && (
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <Check size={14} /> Delivered to your address
                      </span>
                      <Link
                        to={`/stalls/${o.stallId}`}
                        className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Star size={12} />
                        <span>Review Items</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs bg-white rounded-3xl border border-stone-200">
              No orders placed yet. Explore 50+ stalls to place your first order!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">My Written Reviews</h3>
            <span className="text-xs text-stone-400">{reviews.length} Reviews Submitted</span>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map(r => (
                <div
                  key={r.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                        {r.stallName || 'Khau Katta Stall'}
                      </h4>
                      {r.productName && (
                        <p className="text-[11px] text-stone-500">Item: {r.productName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <div className="text-[10px] text-stone-400 pt-1">
                    Submitted on {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs bg-white rounded-3xl border border-stone-200">
              You haven&apos;t written any reviews yet. Complete an order to review items!
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Saved Addresses</h3>
            <button
              onClick={() => setShowAddAddress(true)}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="p-5 rounded-3xl bg-white border border-orange-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-700">New Belagavi Delivery Address</h4>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">House / Flat / Street</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 301, Silver Crest, Club Road"
                  className="w-full text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Area / Locality</label>
                  <select
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-200"
                  >
                    <option value="Camp">Camp (Club Road)</option>
                    <option value="Tilakwadi">Tilakwadi</option>
                    <option value="Shahapur">Shahapur</option>
                    <option value="Hindwadi">Hindwadi</option>
                    <option value="CBT / Fort">CBT / Fort Area</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 bg-stone-100 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-xs font-bold text-white rounded-xl shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold uppercase">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <Check size={12} /> Default
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-stone-900">{addr.addressLine1}</p>
                <p className="text-xs text-stone-500">{addr.area}, Belagavi - {addr.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900">Saved Items (Wishlist)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200"
                alt="Belgaum Kunda"
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-stone-900">Classic Belgaum Kunda (500g)</h4>
                <p className="text-[11px] text-stone-500">Belgaum Kunda House</p>
                <span className="text-xs font-black text-orange-700">₹260</span>
              </div>
              <Link
                to="/stalls/stall-01"
                className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold"
              >
                View
              </Link>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200"
                alt="Camp Misal"
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-stone-900">Special Camp Tarri Misal Pav</h4>
                <p className="text-[11px] text-stone-500">Camp Misal &amp; Chaat</p>
                <span className="text-xs font-black text-orange-700">₹110</span>
              </div>
              <Link
                to="/stalls/stall-02"
                className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HELP & SUPPORT */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-stone-900">Belagavi Khau Katta Support</h3>
            <p className="text-xs text-stone-500 mt-0.5">Need assistance with your order or stall inquiry?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-1">
              <span className="font-bold text-orange-900">Direct Customer Helpline</span>
              <p className="text-sm font-black text-stone-900 font-mono">+91 831 240 0050</p>
              <p className="text-[10px] text-stone-500">Operating hours: 9:00 AM - 11:00 PM Daily</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
              <span className="font-bold text-amber-900">Email Support</span>
              <p className="text-sm font-black text-stone-900">support@khaukatta.in</p>
              <p className="text-[10px] text-stone-500">Average response time: Under 2 hours</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
            <h4 className="font-bold text-stone-800">Frequently Asked Questions</h4>
            <details className="p-3 bg-stone-50 rounded-xl cursor-pointer">
              <summary className="font-semibold text-stone-800">How does doorstep delivery from Khau Katta work?</summary>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Orders are freshly prepared at the respective stall in Khau Katta (Club Road) and picked up by our local Belagavi delivery riders on scooters for rapid direct delivery.
              </p>
            </details>
            <details className="p-3 bg-stone-50 rounded-xl cursor-pointer">
              <summary className="font-semibold text-stone-800">Can I write reviews for items I haven&apos;t ordered?</summary>
              <p className="mt-2 text-stone-600 leading-relaxed">
                No. To ensure 100% genuine feedback for Belagavi merchants, Khau Katta enforces verified purchases. Only delivered orders can be reviewed.
              </p>
            </details>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log Out of Khau Katta?"
        message="Are you sure you want to log out? You will need to verify your mobile number via OTP again to place orders and submit reviews."
        confirmText="Yes, Log Out"
        isDestructive={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};
