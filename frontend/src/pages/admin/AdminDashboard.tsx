import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  BarChart3,
  Star,
  Tag,
  Settings,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Clock,
  Phone,
  LogOut,
  ShieldCheck,
  EyeOff,
  Eye,
  Trash2,
  Flag,
  RotateCw,
  Filter
} from 'lucide-react';
import { AdminStats, Review, Stall } from '../../types';
<<<<<<< HEAD
import { getAdminStats, getAdminReviews, moderateReview, getStalls, getAdminLiveFleetApi } from '../../services/api';
=======
import { getAdminStats, getAdminReviews, moderateReview, getStalls } from '../../services/api';
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StarRating } from '../../components/reviews/StarRating';
import { StallManagement } from '../../components/admin/StallManagement';

type AdminTab =
  | 'dashboard'
  | 'users'
  | 'stalls'
  | 'products'
  | 'orders'
  | 'delivery'
  | 'analytics'
  | 'reviews'
  | 'offers'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [stallsList, setStallsList] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);

  // Reviews moderation state
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStallFilter, setReviewStallFilter] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | undefined>(undefined);
  const [reviewStatusFilter, setReviewStatusFilter] = useState('');
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  // Moderation dialog state
  const [modTargetReview, setModTargetReview] = useState<Review | null>(null);
  const [modAction, setModAction] = useState<'HIDDEN' | 'REMOVED' | 'ACTIVE' | null>(null);

<<<<<<< HEAD
  // Live Fleet monitoring state
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [fleetStats, setFleetStats] = useState({ totalRiders: 18, activeCount: 1 });

=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  const { user, token, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

<<<<<<< HEAD
  const loadFleet = useCallback(async () => {
    try {
      const res = await getAdminLiveFleetApi(token || undefined);
      if (res.data) {
        setFleetData(res.data);
        setFleetStats({
          totalRiders: res.totalRiders || 18,
          activeCount: res.activeDeliveriesCount || res.data.length
        });
      }
    } catch {
      // Graceful fallback
    }
  }, [token]);

=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, stallsData] = await Promise.all([
        getAdminStats(token || undefined),
        getStalls()
      ]);
      setStats(statsData);
      setStallsList(stallsData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadReviews = useCallback(async () => {
    try {
      const res = await getAdminReviews(
        {
          search: reviewSearch || undefined,
          stallId: reviewStallFilter || undefined,
          rating: reviewRatingFilter,
          status: reviewStatusFilter || undefined
        },
        token || undefined
      );
      setAdminReviews(res.data);
      setPendingReportsCount(res.reportsCount);
    } catch {
      // Handled gracefully
    }
  }, [reviewSearch, reviewStallFilter, reviewRatingFilter, reviewStatusFilter, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      loadReviews();
<<<<<<< HEAD
    } else if (activeTab === 'delivery') {
      loadFleet();
    }
  }, [activeTab, loadReviews, loadFleet]);
=======
    }
  }, [activeTab, loadReviews]);
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d

  const handleExecuteModeration = async () => {
    if (!modTargetReview || !modAction) return;

    try {
      const reason = `Status changed to ${modAction} by Admin ${user?.name || ''}`;
      const res = await moderateReview(modTargetReview.id, modAction, reason, token || undefined);

      if (res.success) {
        showToast(res.message, 'success');
        setModTargetReview(null);
        setModAction(null);
        loadReviews();
        loadData(); // Refresh dynamic statistics
      } else {
        showToast(res.message || 'Moderation failed', 'error');
      }
    } catch {
      showToast('Error during review moderation', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Admin session terminated.', 'info');
    navigate('/admin/login');
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={18} />, badge: pendingReportsCount > 0 ? `${pendingReportsCount} Reports` : undefined },
    { id: 'stalls', label: 'Stalls', icon: <Store size={18} />, badge: '52' },
    { id: 'products', label: 'Products / Food', icon: <UtensilsCrossed size={18} />, badge: '36' },
    { id: 'users', label: 'Users', icon: <Users size={18} />, badge: '1.2k' },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} />, badge: 'Live' },
    { id: 'delivery', label: 'Delivery Partners', icon: <Bike size={18} />, badge: '18 Active' },
    { id: 'analytics', label: 'Revenue & Analytics', icon: <BarChart3 size={18} /> },
    { id: 'offers', label: 'Offers', icon: <Tag size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen theme-artisan-bg text-[#3c1e0a] flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#291305] text-[#fff8f2] px-6 py-4 border-b border-[#3d2314] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#b85018] flex items-center justify-center text-white font-black text-sm shadow-md">
            KK
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2 font-serif">
              Khau Katta Belagavi
              <span className="text-xs px-2.5 py-0.5 bg-[#b85018]/25 text-[#fff0e2] rounded-full font-semibold border border-[#b85018]/40">
=======
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#24150b] text-[#f8efe4] px-6 py-4 border-b border-[#3d2314] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#c86228] flex items-center justify-center text-white font-black text-sm shadow-md">
            KK
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Khau Katta Belagavi
              <span className="text-xs px-2.5 py-0.5 bg-[#e28743]/20 text-[#f6d2b5] rounded-full font-semibold border border-[#e28743]/40">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                Admin Central
              </span>
            </h1>
            <p className="text-[11px] text-[#eed7c2]/80">
              Authenticated Admin: <strong className="text-white">{user?.name || 'Basavaraj Patil'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex px-3.5 py-1.5 bg-[#3d2314] hover:bg-[#52301c] text-[#eed7c2] text-xs rounded-xl font-medium transition-colors cursor-pointer border border-[#52301c]"
          >
            Storefront View
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs rounded-xl font-bold transition-colors cursor-pointer border border-rose-800/80 flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
<<<<<<< HEAD
        <aside className="w-full md:w-64 bg-[#fff8f2]/95 backdrop-blur-md border-r border-[#f0bd9b] p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7c4d2e]">
=======
        <aside className="w-full md:w-64 bg-[#fffdfb]/95 backdrop-blur-md border-r border-[#eed7c2] p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#9c7f6e]">
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
              Operations Menu
            </div>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
<<<<<<< HEAD
                      ? 'bg-gradient-to-r from-[#b85018] to-[#d97706] text-white shadow-md'
                      : 'text-[#7c4d2e] hover:bg-[#fff0e2] hover:text-[#3c1e0a]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-[#7c4d2e]'}>
=======
                      ? 'bg-gradient-to-r from-[#c86228] to-[#d97706] text-white shadow-md'
                      : 'text-[#735442] hover:bg-[#faf2e8] hover:text-[#2e1b10]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-[#9c7f6e]'}>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive
<<<<<<< HEAD
                          ? 'bg-[#963e0e] text-orange-100'
                          : item.badge.includes('Reports')
                          ? 'bg-rose-100 text-rose-700 font-black animate-pulse'
                          : 'bg-[#fff0e2] text-[#7c4d2e]'
=======
                          ? 'bg-orange-700 text-orange-100'
                          : item.badge.includes('Reports')
                          ? 'bg-rose-100 text-rose-700 font-black animate-pulse'
                          : 'bg-stone-100 text-stone-600'
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100 text-[11px] text-stone-500">
            <p className="font-semibold text-stone-700">Khau Katta Market Operations</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Club Road, Belagavi 590001</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* TAB: REVIEWS & RATINGS MODERATION (Dedicated Stage 2 Requirement) */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">
                    Review Management &amp; Moderation
                  </h2>
                  <p className="text-xs text-[#735442]">
                    Audit verified customer reviews, inspect reported comments, and manage stall ratings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-[#faebd7] text-[#93370d] rounded-xl border border-[#eed7c2] font-bold">
                    {adminReviews.length} Reviews Indexed
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-[#fffdfb]/95 p-4 rounded-3xl border border-[#eed7c2] shadow-xs space-y-3 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search box */}
                  <div className="sm:col-span-4 relative">
                    <Search size={15} className="absolute left-3.5 top-3 text-[#9c7f6e] pointer-events-none" />
                    <input
                      type="text"
                      value={reviewSearch}
                      onChange={e => setReviewSearch(e.target.value)}
                      placeholder="Search customer, comment, stall..."
                      className="w-full pl-10 pr-3 py-2 bg-[#fdf8f3] rounded-xl text-xs text-[#2e1b10] border border-[#eed7c2] focus:outline-none focus:border-[#c86228] placeholder:text-[#9c7f6e]/70"
                    />
                  </div>

                  {/* Filter by Stall */}
                  <div className="sm:col-span-3">
                    <select
                      value={reviewStallFilter}
                      onChange={e => setReviewStallFilter(e.target.value)}
                      className="w-full py-2 px-3 bg-[#fdf8f3] rounded-xl text-xs text-[#2e1b10] border border-[#eed7c2] focus:outline-none focus:border-[#c86228]"
                    >
                      <option value="">All Stalls</option>
                      {stallsList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.stallNumber})</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Rating */}
                  <div className="sm:col-span-2">
                    <select
                      value={reviewRatingFilter !== undefined ? reviewRatingFilter : ''}
                      onChange={e => setReviewRatingFilter(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full py-2 px-3 bg-[#fdf8f3] rounded-xl text-xs text-[#2e1b10] border border-[#eed7c2] focus:outline-none focus:border-[#c86228]"
                    >
                      <option value="">All Stars</option>
                      <option value="5">5 Stars ⭐</option>
                      <option value="4">4 Stars ⭐</option>
                      <option value="3">3 Stars ⭐</option>
                      <option value="2">2 Stars ⭐</option>
                      <option value="1">1 Star ⭐</option>
                    </select>
                  </div>

                  {/* Filter by Status */}
                  <div className="sm:col-span-3">
                    <select
                      value={reviewStatusFilter}
                      onChange={e => setReviewStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 bg-[#fdf8f3] rounded-xl text-xs text-[#2e1b10] border border-[#eed7c2] focus:outline-none focus:border-[#c86228]"
                    >
                      <option value="">All Statuses (Active, Hidden, Reported, Removed)</option>
                      <option value="ACTIVE">ACTIVE Only</option>
                      <option value="REPORTED">REPORTED (Needs Audit)</option>
                      <option value="HIDDEN">HIDDEN</option>
                      <option value="REMOVED">REMOVED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reviews Table */}
              <div className="bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] shadow-xs overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#fdf8f3] border-b border-[#eed7c2] text-[#9c7f6e] font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Stall / Item</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Comment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eed7c2]/60 text-[#735442]">
                      {adminReviews.length > 0 ? (
                        adminReviews.map(rev => (
                          <tr key={rev.id} className="hover:bg-[#fdf8f3]/60 transition-colors">
                            {/* Customer */}
                            <td className="py-3.5 px-4 font-semibold text-[#2e1b10] whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover border border-[#eed7c2]"
                                />
                                <div>
                                  <p className="font-bold leading-tight">{rev.userName || 'Customer'}</p>
                                  <span className="text-[10px] text-emerald-800 font-semibold">Verified Order</span>
                                </div>
                              </div>
                            </td>

                            {/* Stall & Product */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-bold text-[#2e1b10]">{rev.stallName || rev.stallId}</p>
                              {rev.productName && (
                                <p className="text-[11px] text-[#735442]">Dish: {rev.productName}</p>
                              )}
                            </td>

                            {/* Rating */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 font-bold text-[#93370d] bg-[#faebd7] px-2 py-0.5 rounded-lg border border-[#eed7c2]">
                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                {rev.rating}.0
                              </span>
                            </td>

                            {/* Comment */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="line-clamp-2 text-[#52392a] leading-relaxed italic">
                                &ldquo;{rev.comment}&rdquo;
                              </p>
                              {rev.moderationReason && (
                                <p className="text-[10px] text-[#9c7f6e] mt-1">Audit: {rev.moderationReason}</p>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  rev.status === 'ACTIVE'
                                    ? 'bg-[#e8f5ec] text-emerald-800 border border-emerald-200'
                                    : rev.status === 'REPORTED'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                    : rev.status === 'HIDDEN'
                                    ? 'bg-[#faebd7] text-[#735442] border border-[#eed7c2]'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {rev.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-[11px] text-[#9c7f6e] whitespace-nowrap">
                              {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                {rev.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => {
                                      setModTargetReview(rev);
                                      setModAction('HIDDEN');
                                    }}
                                    className="px-2.5 py-1 bg-[#fdf8f3] hover:bg-[#faebd7] text-[#735442] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-[#eed7c2]"
                                    title="Hide from public view"
                                  >
                                    <EyeOff size={12} />
                                    <span>Hide</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setModTargetReview(rev);
                                      setModAction('ACTIVE');
                                    }}
                                    className="px-2.5 py-1 bg-[#e8f5ec] hover:bg-[#d0ebd7] text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-emerald-200"
                                    title="Restore review"
                                  >
                                    <Eye size={12} />
                                    <span>Restore</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setModTargetReview(rev);
                                    setModAction('REMOVED');
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-rose-200"
                                  title="Mark permanently removed"
                                >
                                  <Trash2 size={12} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#735442]">
                            No reviews match the current filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DASHBOARD (Overview with 5 Metric Cards & Stalls Preview) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">
                    Marketplace Dashboard Overview
                  </h2>
                  <p className="text-xs text-[#735442]">
                    Live operational statistics across 50+ stalls in Belagavi Khau Katta
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#735442] bg-[#fffdfb] px-3.5 py-1.5 rounded-2xl border border-[#eed7c2] flex items-center gap-1.5 shadow-xs">
                    <Clock size={13} className="text-[#c86228]" />
                    <span>Realtime Feed • Belagavi</span>
                  </span>
                </div>
              </div>

              {/* 5 REQUIRED STATISTIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Total Users */}
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#735442]">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#2e1b10]">
                    {stats?.totalUsers.toLocaleString() || '1,240'}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>+18% from last month</span>
                  </div>
                </div>

                {/* 2. Total Stalls */}
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#735442]">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Stalls</span>
                    <div className="w-8 h-8 rounded-xl bg-[#faebd7] text-[#c86228] flex items-center justify-center">
                      <Store size={16} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#2e1b10]">
                    {stats?.totalStalls || '52'}
                  </div>
                  <div className="text-[11px] text-[#c86228] font-semibold">
                    <span>10 Active Samples (~50 Max)</span>
                  </div>
                </div>

                {/* 3. Total Orders */}
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#735442]">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#2e1b10]">
                    {stats?.totalOrders.toLocaleString() || '3,845'}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>+24% this week</span>
                  </div>
                </div>

                {/* 4. Total Revenue */}
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#735442]">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <span className="font-bold text-xs">₹</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#2e1b10]">
                    ₹14.28 L
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    <span>Target: ₹20L Q3</span>
                  </div>
                </div>

                {/* 5. Active Deliveries */}
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#735442]">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Deliveries</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Bike size={16} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#2e1b10]">
                    {stats?.activeDeliveries || '18'}
                  </div>
                  <div className="text-[11px] text-purple-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Across Belagavi City</span>
                  </div>
                </div>
              </div>

              {/* Stalls Directory in Dashboard */}
              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#2e1b10]">
                      Stall Directory &amp; Status
                    </h3>
                    <p className="text-xs text-[#735442]">
                      Dynamic ratings calculated from authentic reviews
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('stalls')}
                    className="text-xs font-bold text-[#c86228] hover:text-[#93370d] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage All</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eed7c2] text-[#9c7f6e] font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Stall #</th>
                        <th className="pb-3">Stall Name</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Dynamic Rating</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eed7c2]/60 text-[#735442]">
                      {stats?.stallsList?.map(s => (
                        <tr key={s.id} className="hover:bg-[#fdf8f3]/60 transition-colors">
                          <td className="py-3 pl-2 font-mono font-bold text-[#2e1b10]">{s.stallNumber}</td>
                          <td className="py-3 font-semibold text-[#2e1b10]">{s.name}</td>
                          <td className="py-3 text-[#735442]">{s.category || 'Food'}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 text-[#93370d] font-bold">
                              <Star size={12} className="fill-amber-500 text-amber-500" />
                              {s.rating} ({s.reviewCount} reviews)
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                s.isOpen
                                  ? 'bg-[#e8f5ec] text-emerald-800 border border-emerald-200'
                                  : 'bg-[#faebd7] text-[#735442] border border-[#eed7c2]'
                              }`}
                            >
                              {s.isOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-[#735442]">{s.contactPhone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Users Management</h2>
                <p className="text-xs text-[#735442]">Customer and Merchant accounts registered in Belagavi</p>
              </div>

              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eed7c2] text-[#9c7f6e] font-bold uppercase tracking-wider">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eed7c2]/60 text-[#735442]">
                      {stats?.recentUsers?.map(u => (
                        <tr key={u.id} className="hover:bg-[#fdf8f3]/60 transition-colors">
                          <td className="py-3 font-bold text-[#2e1b10]">{u.name}</td>
                          <td className="py-3 text-[#735442]">{u.email || 'N/A'}</td>
                          <td className="py-3 font-mono text-[#735442]">+91 {u.phone}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5ec] text-emerald-800 border border-emerald-200">
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-[#c86228] capitalize">
                            {u.email?.includes('admin') ? 'Admin' : u.email?.includes('deliv') ? 'Delivery' : 'Customer'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STALLS */}
          {activeTab === 'stalls' && (
            <StallManagement />
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Products &amp; Food Catalog</h2>
                <p className="text-xs text-[#735442]">Items offered across Khau Katta food, jewellery, clothing, and artisan stalls</p>
              </div>

              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Classic Belgaum Kunda (500g)', stall: 'Belgaum Kunda House', price: '₹260', veg: true, rating: '5.0', reviews: '2' },
                    { name: 'Special Camp Tarri Misal Pav', stall: 'Camp Misal & Chaat', price: '₹110', veg: true, rating: '4.8', reviews: '1' },
                    { name: 'Handcrafted Kolhapuri Saaj Necklace', stall: 'Belagavi Royal Silver', price: '₹1450', veg: true, rating: '5.0', reviews: '1' },
                    { name: 'Shahapur Handloom Cotton Saree', stall: 'Shahapur Handlooms', price: '₹1250', veg: true, rating: '4.7', reviews: '0' },
                    { name: 'Wooden Rocking Horse Toy', stall: 'Chennamma Wooden Toys', price: '₹780', veg: true, rating: '4.8', reviews: '0' },
                    { name: 'Belagavi Brass Mayur Diya', stall: 'Brass & Bell Metal Gifts', price: '₹890', veg: true, rating: '4.9', reviews: '0' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-[#eed7c2] bg-[#fdf8f3] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2e1b10]">{item.name}</span>
                        <span className="text-xs font-black text-[#c86228]">{item.price}</span>
                      </div>
                      <p className="text-[11px] text-[#735442]">{item.stall}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#eed7c2] text-[10px]">
                        <span className="text-[#93370d] font-bold">⭐ {item.rating} ({item.reviews})</span>
                        <span className="text-[#9c7f6e]">Pure Veg: {item.veg ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
<<<<<<< HEAD
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Order Queue &amp; Pickup Verification Audit</h2>
                  <p className="text-xs text-[#735442]">Live order fulfillment and rider-vendor OTP verification logs across Belagavi</p>
                </div>
              </div>

              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2e1b10] font-mono text-sm">Order #KK-2026-00180</span>
                    <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold">READY FOR PICKUP</span>
                  </div>
                  <div>Customer: Pooja Kulkarni (+91 9845012345) • Stall: Belgaum Kunda &amp; Sweets House</div>
                  <div>Total: ₹550 • Assigned Rider: Ramesh Naik (Scooter KA-22-EX-4589)</div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-700" />
                      <span>Pickup Verification Status: <strong>⏳ Pending Rider OTP Submission (0/5 attempts)</strong></span>
                    </div>
                    <span className="text-[10px] text-amber-700 italic">Plaintext OTP protected (Vendor/Stall view only)</span>
                  </div>
                </div>

                <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2e1b10] font-mono text-sm">Order #KK-2026-00129</span>
                    <span className="text-emerald-800 bg-[#e8f5ec] px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">DELIVERED</span>
                  </div>
                  <div>Customer: Pooja Kulkarni (+91 9845012345) • Stall: Belgaum Kunda &amp; Sweets House</div>
                  <div>Total: ₹450 • Rider: Ramesh Naik</div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <span>Pickup Verification Status: <strong>✅ Pickup Verified at 6:32 PM (Verified by Rider Ramesh Naik at Stall Belgaum Kunda House)</strong></span>
                  </div>
                </div>

                <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2e1b10] font-mono text-sm">Order #KK-2026-00145</span>
                    <span className="text-emerald-800 bg-[#e8f5ec] px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">DELIVERED</span>
                  </div>
                  <div>Customer: Pooja Kulkarni (+91 9845012345) • Stall: Camp Misal &amp; Chaat Durbar</div>
                  <div>Total: ₹210 • Rider: Ramesh Naik</div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <span>Pickup Verification Status: <strong>✅ Pickup Verified (OTP Matched)</strong></span>
                  </div>
=======
              <div>
                <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Order Queue</h2>
                <p className="text-xs text-[#735442]">Live order fulfillment across Belagavi</p>
              </div>

              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2e1b10]">Order #KK-2026-00129</span>
                    <span className="text-emerald-800 bg-[#e8f5ec] px-2 py-0.5 rounded-md border border-emerald-200">DELIVERED</span>
                  </div>
                  <div>Customer: Pooja Kulkarni (+91 9845012345) • Stall: Belgaum Kunda House</div>
                  <div>Total: ₹450 • Verified Review Submitted</div>
                </div>

                <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2e1b10]">Order #KK-2026-00145</span>
                    <span className="text-emerald-800 bg-[#e8f5ec] px-2 py-0.5 rounded-md border border-emerald-200">DELIVERED</span>
                  </div>
                  <div>Customer: Pooja Kulkarni (+91 9845012345) • Stall: Camp Misal &amp; Chaat Durbar</div>
                  <div>Total: ₹210 • Eligible for Review</div>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                </div>
              </div>
            </div>
          )}

          {/* TAB: DELIVERY PARTNERS */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
<<<<<<< HEAD
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Real-Time Delivery Fleet &amp; Live Tracking</h2>
                  <p className="text-xs text-[#735442]">Centralized GPS Monitoring &amp; AI-Optimized Route Telemetry across Belagavi</p>
                </div>
                <Link
                  to="/tracking/dlv-001"
                  className="px-4 py-2 bg-gradient-to-r from-[#c86228] to-[#d97706] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 hover:opacity-95 transition-all"
                >
                  <Bike size={16} />
                  <span>Open Customer Map View</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Fleet Telemetry Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs">
                  <span className="text-xs text-[#735442]">Registered Fleet</span>
                  <div className="text-2xl font-black text-[#2e1b10] font-mono mt-1">{fleetStats.totalRiders} Riders</div>
                  <span className="text-[10px] text-emerald-700 font-bold">🟢 15 Available • 3 On Duty</span>
                </div>
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs">
                  <span className="text-xs text-[#735442]">Active Trips</span>
                  <div className="text-2xl font-black text-[#c86228] font-mono mt-1">{fleetStats.activeCount} Live</div>
                  <span className="text-[10px] text-[#735442]">Real-time GPS Connected</span>
                </div>
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs">
                  <span className="text-xs text-[#735442]">Avg Speed (Belagavi Traffic)</span>
                  <div className="text-2xl font-black text-[#2e1b10] font-mono mt-1">22.4 km/h</div>
                  <span className="text-[10px] text-emerald-700 font-bold">⚡ Optimal Pace</span>
                </div>
                <div className="p-5 rounded-3xl bg-[#fffdfb]/95 border border-[#eed7c2] shadow-xs">
                  <span className="text-xs text-[#735442]">SLA Guarantee</span>
                  <div className="text-2xl font-black text-emerald-800 font-mono mt-1">99.2%</div>
                  <span className="text-[10px] text-[#735442]">Under 25 min delivery</span>
                </div>
              </div>

              {/* Active Riders Telemetry Table & Cards */}
              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-[#eed7c2] pb-3">
                  <h3 className="font-serif text-base font-bold text-[#2e1b10] flex items-center gap-2">
                    <Bike size={18} className="text-[#c86228]" />
                    <span>Active Riders Fleet Status</span>
                  </h3>
                  <button
                    onClick={loadFleet}
                    className="p-1.5 hover:bg-[#faebd7] rounded-lg text-[#735442] transition-colors cursor-pointer"
                    title="Refresh fleet data"
                  >
                    <RotateCw size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Highlight Rider */}
                  <div className="p-5 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-[#2e1b10] text-sm">Ramesh Naik</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        🟠 EN ROUTE TO CUSTOMER
                      </span>
                    </div>

                    <div className="text-xs text-[#735442] space-y-1">
                      <div>Vehicle: <strong>Scooter KA-22-EX-4589</strong> • Phone: <strong>+91 98800 54321</strong></div>
                      <div>Assigned Order: <strong className="font-mono text-[#c86228]">#KK-2026-00180</strong> (Belgaum Kunda House)</div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span>Current GPS: <strong>15.8580° N, 74.5085° E</strong></span>
                        <span className="font-mono text-emerald-700 font-bold">Speed: 24 km/h</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#eed7c2]/60 flex items-center justify-between text-xs">
                      <span className="text-[#93370d] font-bold">ETA: 12 mins • Battery: 94%</span>
                      <Link
                        to="/tracking/dlv-001"
                        className="text-xs text-[#c86228] font-bold hover:underline flex items-center gap-1"
                      >
                        Inspect Route &amp; Prediction <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Secondary Standby Riders */}
                  {[
                    { name: 'Suresh Patil', vehicle: 'Bike KA-22-HG-9012', status: '🟢 AVAILABLE', hub: 'Tilakwadi Hub', completed: 98, battery: '88%' },
                    { name: 'Vijay Kulkarni', vehicle: 'EV KA-22-EV-1102', status: '🟢 AVAILABLE', hub: 'Shahapur Hub', completed: 115, battery: '91%' },
                    { name: 'Anand Shinde', vehicle: 'Scooter KA-22-MM-3344', status: '🟢 STANDBY', hub: 'Camp Hub', completed: 76, battery: '79%' }
                  ].map((rider, idx) => (
                    <div key={idx} className="p-4 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2]/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-[#2e1b10]">
                        <span>{rider.name}</span>
                        <span className="text-[10px] text-emerald-800 bg-[#e8f5ec] px-2 py-0.5 rounded-full border border-emerald-300">
                          {rider.status}
                        </span>
                      </div>
                      <div className="text-[#735442]">{rider.vehicle} • {rider.hub}</div>
                      <div className="flex items-center justify-between text-[10px] text-[#9c7f6e] pt-1 border-t border-[#eed7c2]/40">
                        <span>{rider.completed} trips completed</span>
                        <span>Battery: {rider.battery}</span>
                      </div>
                    </div>
                  ))}
=======
              <div>
                <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Delivery Fleet Foundation</h2>
                <p className="text-xs text-[#735442]">18 active riders covering Club Road, Camp, Tilakwadi, and Shahapur</p>
              </div>

              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 backdrop-blur-sm">
                <div className="p-5 bg-[#fdf8f3] rounded-2xl text-xs text-[#735442] border border-[#eed7c2]">
                  <strong className="text-[#2e1b10]">Partner Highlight:</strong> Ramesh Naik (Scooter KA-22-EX-4589) • 142 successful deliveries from Khau Katta stalls.
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVENUE & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Revenue &amp; Analytics</h2>
                <p className="text-xs text-[#735442]">Sales breakdown and category turnover in Belagavi marketplace</p>
              </div>

              <div className="p-6 sm:p-8 bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] shadow-xs space-y-2 text-xs text-[#735442] backdrop-blur-sm">
                <p><strong className="text-[#2e1b10]">Gross Merchandise Value (GMV):</strong> ₹14,28,500</p>
                <p><strong className="text-[#2e1b10]">Stalls Onboarded:</strong> 10 of 50 active</p>
                <p><strong className="text-[#2e1b10]">Reviews Logged:</strong> {adminReviews.length}</p>
              </div>
            </div>
          )}

          {/* TAB: OFFERS */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Promotional Offers</h2>
              <div className="p-6 sm:p-8 bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] shadow-xs space-y-2 text-xs backdrop-blur-sm">
                <span className="font-mono font-bold text-[#93370d] bg-[#faebd7] px-3 py-1 rounded-lg border border-[#eed7c2]">KHAUKATTA50</span>
                <p className="text-[#735442] pt-2">50% off first order for Belagavi customers.</p>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight">Marketplace Settings</h2>
              <div className="bg-[#fffdfb]/95 rounded-3xl p-6 sm:p-8 border border-[#eed7c2] shadow-xs space-y-4 max-w-xl text-xs backdrop-blur-sm">
                <div>
                  <label className="font-bold text-[#2e1b10]">Marketplace Name</label>
                  <input type="text" readOnly value="Khau Katta Belagavi" className="w-full p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] mt-1.5 font-medium" />
                </div>
                <div>
                  <label className="font-bold text-[#2e1b10]">Central Hub</label>
                  <input type="text" readOnly value="Club Road / Camp, Belagavi 590001" className="w-full p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] mt-1.5 font-medium" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Moderation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(modTargetReview && modAction)}
        title={`${modAction === 'HIDDEN' ? 'Hide Review' : modAction === 'REMOVED' ? 'Remove Review' : 'Restore Review'}?`}
        message={`Are you sure you want to change the status of Review #${modTargetReview?.id} (by ${modTargetReview?.userName}) to ${modAction}? This action is audited.`}
        confirmText={`Yes, Set as ${modAction}`}
        isDestructive={modAction === 'REMOVED'}
        onConfirm={handleExecuteModeration}
        onCancel={() => {
          setModTargetReview(null);
          setModAction(null);
        }}
      />
    </div>
  );
};
