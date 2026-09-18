import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stall, Product, Order } from '../../types';
import {
  getStallById,
  getVendorStall,
  toggleStallOpenStatusApi,
  createProductApi,
  updateProductApi,
  toggleProductAvailabilityApi,
  deleteProductApi,
  getVendorOrders,
  regeneratePickupOtpApi,
  updateOrderStatusApi
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Store,
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  Clock,
  Phone,
  MapPin,
  X,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  Check,
  Eye,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { CategoryIcon } from '../../components/common/CategoryIcon';

export const VendorDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedStallId, setSelectedStallId] = useState<string>('');
  const [currentStall, setCurrentStall] = useState<Stall | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Modal State for Add / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<string>('100');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('10');

  const [submitting, setSubmitting] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);

  // Delete product confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { token, logout } = useAuth();
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [regeneratingOrderId, setRegeneratingOrderId] = useState<string | null>(null);

  // Load only the stall assigned to the authenticated vendor.
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await getVendorStall(token || undefined);
      if (!result.success || !result.data) {
        setCurrentStall(null);
        setProductsList([]);
        setLoadError(result.message || 'Your vendor account has not been assigned to a stall yet.');
        return;
      }
      setSelectedStallId(result.data.id);
      setCurrentStall(result.data);
      setProductsList(result.data.products || []);
      await loadVendorOrdersData(result.data.id);
    } catch {
      setLoadError('Unable to load vendor shops. Check that the backend is running, then try again.');
      showToast('Error loading vendor dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, token]);

  // Load orders for selected stall
  const loadVendorOrdersData = useCallback(async (stallId: string) => {
    if (!stallId) return;
    setLoadingOrders(true);
    try {
      const ordersData = await getVendorOrders(stallId, token || undefined);
      setVendorOrders(ordersData);
    } catch {
      // Graceful fallback
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  // Load details & menu for the selected stall
  const loadSelectedStallData = useCallback(async (stallId: string) => {
    if (!stallId) return;
    try {
      const data = await getStallById(stallId, token || undefined);
      if (!data) {
        setCurrentStall(null);
        setProductsList([]);
        setLoadError('Unable to load this vendor shop. Check the backend connection and try again.');
        return;
      }
      setLoadError(null);
      setCurrentStall(data);
      setProductsList(data.products || []);
      await loadVendorOrdersData(stallId);
    } catch {
      setCurrentStall(null);
      setProductsList([]);
      setLoadError('Unable to load this vendor shop. Check the backend connection and try again.');
      showToast('Error fetching stall menu.', 'error');
    }
  }, [showToast, loadVendorOrdersData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedStallId) {
      loadSelectedStallData(selectedStallId);
    }
  }, [selectedStallId, loadSelectedStallData]);

  // Vendor Regenerate Pickup OTP
  const handleRegenerateOtp = async (orderId: string) => {
    setRegeneratingOrderId(orderId);
    try {
      const res = await regeneratePickupOtpApi(orderId, token || undefined);
      if (res.success && res.data) {
        showToast('Fresh 6-digit Pickup OTP generated!', 'success');
        await loadVendorOrdersData(selectedStallId);
      } else {
        showToast(res.message || 'Failed to regenerate OTP.', 'error');
      }
    } catch {
      showToast('Error regenerating pickup OTP.', 'error');
    } finally {
      setRegeneratingOrderId(null);
    }
  };

  // Vendor status update (e.g. preparing -> ready_for_pickup)
  const handleVendorUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await updateOrderStatusApi(orderId, newStatus, token || undefined);
      if (res.success) {
        showToast(`Order status updated to "${newStatus.replace('_', ' ')}"!`, 'success');
        await loadVendorOrdersData(selectedStallId);
      } else {
        showToast(res.message || 'Failed to update order status.', 'error');
      }
    } catch {
      showToast('Error updating status.', 'error');
    }
  };

  // Toggle Shop Open / Closed status
  const handleLogout = () => {
    logout();
    showToast('Vendor session terminated.', 'info');
    navigate('/vendor/login', { replace: true });
  };

  const handleToggleShopOpen = async () => {
    if (!currentStall) return;
    setTogglingOpen(true);
    const newOpenState = !currentStall.isOpen;

    try {
      const res = await toggleStallOpenStatusApi(currentStall.id, newOpenState, token || undefined);
      if (res.success && res.data) {
        setCurrentStall(res.data);
        showToast(
          `Shop "${currentStall.name}" is now ${newOpenState ? 'OPEN for customer orders!' : 'CLOSED.'}`,
          newOpenState ? 'success' : 'info'
        );
      } else {
        showToast(res.message || 'Failed to update shop status.', 'error');
      }
    } catch {
      showToast('Network error toggling shop status.', 'error');
    } finally {
      setTogglingOpen(false);
    }
  };

  // Open Modal for Adding Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('120');
    setFormIsVeg(true);
    setFormIsAvailable(true);
    setFormImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop');
    setFormBadge('Special');
    setFormPrepTime('10');
    setIsModalOpen(true);
  };

  // Open Modal for Editing Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDescription(prod.description);
    setFormPrice(String(prod.price));
    setFormIsVeg(prod.isVeg);
    setFormIsAvailable(prod.isAvailable);
    setFormImageUrl(prod.imageUrl);
    setFormBadge(prod.badge || '');
    setFormPrepTime(String(prod.preparationTimeMins || 10));
    setIsModalOpen(true);
  };

  // Submit Product Add / Edit Form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Item name is required.', 'error');
      return;
    }
    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      showToast('Please enter a valid positive price.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Product> = {
        stallId: selectedStallId,
        name: formName.trim(),
        description: formDescription.trim(),
        price: priceNum,
        isVeg: formIsVeg,
        isAvailable: formIsAvailable,
        imageUrl: formImageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
        badge: formBadge.trim() || undefined,
        preparationTimeMins: parseInt(formPrepTime, 10) || 10
      };

      if (editingProduct) {
        const res = await updateProductApi(editingProduct.id, payload, token || undefined);
        if (res.success) {
          showToast(`Item "${formName}" updated successfully!`, 'success');
          setIsModalOpen(false);
          await loadSelectedStallData(selectedStallId);
        } else {
          showToast(res.message || 'Failed to update item.', 'error');
        }
      } else {
        const res = await createProductApi(payload, token || undefined);
        if (res.success) {
          showToast(`Item "${formName}" added to menu!`, 'success');
          setIsModalOpen(false);
          await loadSelectedStallData(selectedStallId);
        } else {
          showToast(res.message || 'Failed to add item.', 'error');
        }
      }
    } catch {
      showToast('Error saving menu item.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Item Availability (In Stock / Out of Stock)
  const handleToggleAvailability = async (prod: Product) => {
    const newAvail = !prod.isAvailable;
    try {
      const res = await toggleProductAvailabilityApi(prod.id, newAvail, token || undefined);
      if (res.success) {
        setProductsList(prev =>
          prev.map(p => (p.id === prod.id ? { ...p, isAvailable: newAvail } : p))
        );
        showToast(
          `"${prod.name}" marked as ${newAvail ? 'IN STOCK' : 'OUT OF STOCK'}.`,
          newAvail ? 'success' : 'info'
        );
      } else {
        showToast(res.message || 'Failed to update availability.', 'error');
      }
    } catch {
      showToast('Error updating item availability.', 'error');
    }
  };

  // Confirm Delete Product
  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteProductApi(productToDelete.id, token || undefined);
      if (res.success) {
        setProductsList(prev => prev.filter(p => p.id !== productToDelete.id));
        showToast(`Item "${productToDelete.name}" deleted from menu.`, 'info');
        setProductToDelete(null);
      } else {
        showToast(res.message || 'Failed to delete item.', 'error');
      }
    } catch {
      showToast('Error deleting item.', 'error');
    }
  };

  // Filter products by search and availability
  const filteredProducts = productsList.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (availabilityFilter === 'IN_STOCK' && !p.isAvailable) return false;
    if (availabilityFilter === 'OUT_OF_STOCK' && p.isAvailable) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans pb-24 md:pb-12">
      {/* Top Header & Assigned Stall */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fff8f2]/95 rounded-3xl p-6 border border-[#f0bd9b] shadow-xs backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff0e2] text-[#b85018] rounded-full text-xs font-bold mb-2 border border-[#f0bd9b]">
            <Store size={13} className="text-[#b85018]" />
            <span>Merchant Portal • Belagavi Khau Katta</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#3c1e0a] tracking-tight">
            Vendor Menu &amp; Shop Control Dashboard
          </h1>
          <p className="text-xs text-[#7c4d2e] mt-1">
            Manage your stall, menu, inventory and incoming orders
          </p>
        </div>

        {currentStall && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#f0bd9b] bg-[#fff0e2] p-3 min-w-[280px]">
            <img src={currentStall.imageUrl} alt={currentStall.name} className="h-14 w-14 rounded-xl object-cover" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#b85018]">Your Stall</p>
              <p className="text-sm font-black text-[#3c1e0a]">{currentStall.name}</p>
              <p className="text-[11px] text-[#7c4d2e]">Stall #{currentStall.stallNumber} • {currentStall.location || 'Club Road Khau Katta, Belagavi'}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#7c4d2e] flex items-center justify-center gap-2">
          <RotateCw size={18} className="animate-spin text-[#b85018]" />
          <span>Loading Vendor Shop details...</span>
        </div>
      ) : loadError ? (
        <div className="bg-[#fff8f2]/95 rounded-3xl p-10 border border-rose-200 shadow-md text-center space-y-4">
          <AlertCircle size={30} className="mx-auto text-rose-600" />
          <h2 className="font-serif text-xl font-bold text-[#3c1e0a]">Vendor shop unavailable</h2>
          <p className="text-sm text-[#7c4d2e]">{loadError}</p>
          <button
            type="button"
            onClick={loadInitialData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b85018] text-white text-sm font-bold"
          >
            <RotateCw size={15} /> Try again
          </button>
        </div>
      ) : currentStall ? (
        <>
          {/* SHOP OPEN / CLOSED TOGGLE CARD */}
          <div className="bg-[#fff8f2]/95 rounded-3xl p-6 border border-[#f0bd9b] shadow-md backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#fce3d0] border border-[#f0bd9b] flex-shrink-0 relative shadow-sm">
                  <img
                    src={currentStall.imageUrl}
                    alt={currentStall.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-[#3c1e0a]">{currentStall.name}</h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#fff0e2] text-[#b85018] border border-[#f0bd9b]">
                      Stall #{currentStall.stallNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7c4d2e] mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={13} className="text-[#b85018]" />
                      <span>{currentStall.location || 'Club Road Khau Katta, Belagavi'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{currentStall.openingTime} - {currentStall.closingTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Open / Closed Status Controls */}
              <div className="flex items-center gap-3 bg-[#fff0e2] p-3 rounded-2xl border border-[#f0bd9b]">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#7c4d2e]">Current Shop Status</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                        currentStall.isOpen
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${currentStall.isOpen ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'}`} />
                      <span>{currentStall.isOpen ? 'OPEN FOR ORDERS' : 'SHOP IS CLOSED'}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleShopOpen}
                  disabled={togglingOpen}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 ${
                    currentStall.isOpen
                      ? 'bg-rose-700 hover:bg-rose-800 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {togglingOpen ? (
                    <RotateCw size={15} className="animate-spin" />
                  ) : (
                    <Power size={15} />
                  )}
                  <span>{currentStall.isOpen ? 'Close Shop' : 'Open Shop'}</span>
                </button>
              </div>
            </div>

            {!currentStall.isOpen && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2 font-medium">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>Shop is set to <strong>CLOSED</strong>. Customers will see your stall as closed on the website and cannot place orders until you toggle the shop back to OPEN.</span>
              </div>
            )}
          </div>

          {/* ACTIVE ORDERS & RIDER PICKUP OTP SECTION */}
          <div className="bg-[#fff8f2]/95 rounded-3xl p-6 border border-[#f0bd9b] shadow-md backdrop-blur-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0bd9b]/60 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3c1e0a] flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#b85018]" />
                  <span>Stall Pickup Orders &amp; Security OTP</span>
                </h2>
                <p className="text-xs text-[#7c4d2e] mt-0.5">
                  View incoming stall orders and provide the 6-digit Pickup OTP to authorized delivery partners upon arrival
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadVendorOrdersData(selectedStallId)}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-[#fff0e2] hover:bg-[#fce5d2] text-[#b85018] text-xs font-bold rounded-full border border-[#f0bd9b] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw size={13} className={loadingOrders ? 'animate-spin' : ''} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center text-xs text-[#7c4d2e] flex items-center justify-center gap-2">
                <RotateCw size={16} className="animate-spin text-[#b85018]" />
                <span>Loading active stall orders...</span>
              </div>
            ) : vendorOrders.length > 0 ? (
              <div className="space-y-4">
                {vendorOrders.map(order => {
                  const isRegenerating = regeneratingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#fff0e2] border border-[#f0bd9b] space-y-4 shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0bd9b]/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs text-[#b85018] bg-white px-2.5 py-0.5 rounded-full border border-[#f0bd9b]">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              order.status === 'rider_arrived_at_vendor'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : order.status === 'picked_up'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-[#fff8f2] text-[#3c1e0a] border border-[#f0bd9b]'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-right text-xs">
                          <span className="font-black text-[#b85018] font-mono text-sm">₹{order.totalAmount}</span>
                          <span className="text-[10px] text-[#7c4d2e] block">
                            {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Items summary */}
                      <div className="text-xs text-[#3c1e0a] space-y-1">
                        <p className="font-bold text-[#3c1e0a]">Customer: {order.customerName} ({order.customerPhone})</p>
                        {order.deliveryStatus && order.deliveryStatus !== 'unassigned' && <p className="mt-1 font-bold text-emerald-700">Rider: {order.assignedRiderName || 'Assigned'} · Status: {order.deliveryStatus.replaceAll('_', ' ')}</p>}
                        <div className="text-[#7c4d2e]">
                          Items: {order.items?.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                      </div>

                      {/* OTP is released only after the authenticated assigned rider arrives. */}
                      {order.status === 'rider_arrived_at_vendor' && order.pickupOtp && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#291305] via-[#3d2314] to-[#291305] text-white border border-amber-400/30 space-y-3 shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                              <KeyRound size={16} />
                              <span>AUTHORIZED PICKUP OTP FOR DELIVERY RIDER</span>
                            </div>
                            <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-md border border-amber-400/30">
                              Expires in 10 mins
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1b0d04] p-4 rounded-xl border border-[#f0bd9b]/30">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#eed7c2]/70 block">
                                Share with Delivery Partner ({order.assignedRiderName || 'assigned rider'}):
                              </span>
                              <div className="font-mono text-3xl font-black text-amber-400 tracking-widest mt-0.5">
                                {order.pickupOtp.otpCode}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRegenerateOtp(order.id)}
                              disabled={isRegenerating}
                              className="px-4 py-2 bg-[#3d2314] hover:bg-[#52301c] text-[#eed7c2] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#f0bd9b]/40 flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <RotateCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
                              <span>Regenerate New OTP</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-[#eed7c2]/80 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
                            <span>Verbally state this 6-digit OTP code to the delivery rider when they reach your stall. Rider will enter it on their app to complete pickup verification.</span>
                          </p>
                        </div>
                      )}

                      {/* VENDOR STATUS UPDATE BUTTONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f0bd9b]/40">
                        <div className="text-xs text-[#7c4d2e]">
                          {order.pickupAudit?.statusText}
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleVendorUpdateStatus(order.id, 'preparing')}
                              className="px-4 py-1.5 bg-[#b85018] hover:bg-[#963e0e] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
                            >
                              Mark Preparing
                            </button>
                          )}

                          {(order.status === 'confirmed' || order.status === 'preparing') && (
                            <button
                              type="button"
                              onClick={() => handleVendorUpdateStatus(order.id, 'ready_for_pickup')}
                              className="px-4 py-1.5 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                            >
                              <CheckCircle2 size={13} />
                              <span>Mark Ready for Pickup (Generate OTP)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#7c4d2e] bg-[#fff0e2] rounded-2xl border border-[#f0bd9b]">
                No active orders for this stall right now. Incoming customer orders will display here with their Pickup OTP.
              </div>
            )}
          </div>

          {/* MENU / FOOD ITEMS MANAGEMENT SECTION */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-black text-[#3c1e0a] tracking-tight flex items-center gap-2">
                  <span>Menu &amp; Food Catalog</span>
                  <span className="text-xs bg-[#fff0e2] text-[#b85018] font-bold px-3 py-1 rounded-full border border-[#f0bd9b]">
                    {productsList.length} Total Dishes
                  </span>
                </h2>
                <p className="text-xs text-[#7c4d2e]">
                  Manage prices, descriptions, photos, and live inventory availability for your stall
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all flex-shrink-0"
              >
                <Plus size={16} />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Search & Availability Toolbar */}
            <div className="p-4 bg-[#fff8f2]/95 rounded-3xl border border-[#f0bd9b] shadow-xs flex flex-wrap items-center gap-3 backdrop-blur-sm">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3.5 top-2.5 text-[#7c4d2e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search item by name or description..."
                  className="w-full pl-10 pr-4 py-2 bg-[#fff0e2] text-xs text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] placeholder:text-[#7c4d2e]/60"
                />
              </div>

              <div className="w-full sm:w-auto min-w-[160px]">
                <select
                  value={availabilityFilter}
                  onChange={e => setAvailabilityFilter(e.target.value as any)}
                  className="w-full p-2 bg-[#fff0e2] text-xs text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] font-medium"
                >
                  <option value="ALL">All Items ({productsList.length})</option>
                  <option value="IN_STOCK">In Stock Only</option>
                  <option value="OUT_OF_STOCK">Out of Stock Only</option>
                </select>
              </div>
            </div>

            {/* Menu Items Cards / List */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    className={`bg-[#fff8f2]/95 rounded-3xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                      prod.isAvailable ? 'border-[#f0bd9b]' : 'border-[#f0bd9b]/40 opacity-85 bg-[#fff0e2]/50'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Left Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {/* Veg Dot */}
                          {prod.isVeg ? (
                            <span className="w-4 h-4 rounded border border-emerald-600 flex items-center justify-center p-0.5" title="Pure Vegetarian">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded border border-red-600 flex items-center justify-center p-0.5" title="Non-Vegetarian">
                              <span className="w-2 h-2 rounded-full bg-red-600" />
                            </span>
                          )}

                          {prod.badge && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#fff0e2] text-[#b85018] rounded-full border border-[#f0bd9b]">
                              {prod.badge}
                            </span>
                          )}

                          {/* Availability Badge */}
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                              prod.isAvailable
                                ? 'bg-[#e8f5ec] text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-bold text-[#3c1e0a] leading-snug mb-1">
                          {prod.name}
                        </h3>

                        <div className="flex items-baseline gap-1 text-base font-black text-[#b85018] mb-1">
                          <span className="text-xs">₹</span>
                          <span>{prod.price.toFixed(0)}</span>
                        </div>

                        <p className="text-xs text-[#7c4d2e] line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Right Photo */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#fce3d0] border border-[#f0bd9b] flex-shrink-0 relative">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-3 mt-3 border-t border-[#f0bd9b]/40 flex items-center justify-between">
                      {/* Availability Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(prod)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                          prod.isAvailable
                            ? 'bg-[#fff0e2] hover:bg-rose-100 text-[#7c4d2e] hover:text-rose-800 border-[#f0bd9b]'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <Power size={13} />
                        <span>{prod.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}</span>
                      </button>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 bg-[#fff0e2] hover:bg-[#fce5d2] text-[#b85018] rounded-xl text-xs font-semibold cursor-pointer border border-[#f0bd9b] transition-colors"
                          title="Edit Item Details"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer border border-rose-200 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#7c4d2e] bg-[#fff8f2]/90 rounded-3xl border border-[#f0bd9b]">
                No menu items match your search filter. Click &ldquo;Add New Food Item&rdquo; to add dishes to your menu.
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-[#fff8f2] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#f0bd9b] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-[#7c4d2e] hover:text-[#3c1e0a] rounded-full hover:bg-[#fff0e2] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-xl font-black text-[#3c1e0a] tracking-tight">
                {editingProduct ? `Edit Item: ${editingProduct.name}` : 'Add New Menu Item'}
              </h3>
              <p className="text-xs text-[#7c4d2e] mt-1">
                Fill in the details below. Item will appear immediately on your stall menu.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                  Item / Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Special Camp Tarri Misal Pav"
                  className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] font-semibold placeholder:text-[#7c4d2e]/60"
                />
              </div>

              {/* Price & Veg Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="120"
                    className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                    Food Classification
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(true)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                        formIsVeg
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-[#fff0e2] text-[#7c4d2e] border-[#f0bd9b]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-300" />
                      <span>Pure Veg</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(false)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                        !formIsVeg
                          ? 'bg-red-700 text-white border-red-700'
                          : 'bg-[#fff0e2] text-[#7c4d2e] border-[#f0bd9b]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-300" />
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                  Item Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Ingredients, taste profile, serving style..."
                  className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] placeholder:text-[#7c4d2e]/60"
                />
              </div>

              {/* Badge & Preparation Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                    Badge Tag (optional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="e.g. Bestseller, Special, Popular"
                    className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                    Initial Stock Availability
                  </label>
                  <select
                    value={formIsAvailable ? 'available' : 'unavailable'}
                    onChange={e => setFormIsAvailable(e.target.value === 'available')}
                    className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018] font-bold"
                  >
                    <option value="available">In Stock (Available)</option>
                    <option value="unavailable">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#3c1e0a] mb-1">
                  Item Image URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-3 bg-[#fff0e2] text-[#3c1e0a] rounded-xl border border-[#f0bd9b] focus:outline-none focus:border-[#b85018]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0bd9b]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#7c4d2e] hover:text-[#3c1e0a] rounded-xl hover:bg-[#fff0e2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      <span>Saving Item...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Menu Changes' : 'Add Item to Menu'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PRODUCT DIALOG */}
      {productToDelete && (
        <ConfirmDialog
          isOpen={Boolean(productToDelete)}
          title={`Delete Item: ${productToDelete.name}?`}
          message={`Are you sure you want to delete "${productToDelete.name}" from your stall menu? Customers will no longer be able to view or order this item.`}
          confirmText="Yes, Delete Item"
          isDestructive={true}
          onConfirm={handleConfirmDeleteProduct}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
};
