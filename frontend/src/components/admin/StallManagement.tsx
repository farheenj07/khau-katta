import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Stall, StallCategory } from '../../types';
import {
  getStallsAdmin,
  createStall,
  updateStall,
  toggleStallStatus,
  deleteStall,
  uploadStallImage,
  getCategories
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Store,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Power,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Clock,
  Phone,
  MapPin,
  X,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed
} from 'lucide-react';

const DEFAULT_STALL_IMAGE = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop';

export const StallManagement: React.FC = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [categories, setCategories] = useState<StallCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStallNumber, setFormStallNumber] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLocation, setFormLocation] = useState('Club Road Khau Katta, Belagavi 590001');
  const [formOpeningTime, setFormOpeningTime] = useState('10:00 AM');
  const [formClosingTime, setFormClosingTime] = useState('10:00 PM');
  const [formPhone, setFormPhone] = useState('+91 94480 00000');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action dialogs
  const [stallToToggle, setStallToToggle] = useState<Stall | null>(null);
  const [stallToDelete, setStallToDelete] = useState<Stall | null>(null);
  const [orderCheckWarning, setOrderCheckWarning] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stallsData, catsData] = await Promise.all([
        getStallsAdmin(token || undefined),
        getCategories()
      ]);
      setStalls(stallsData);
      setCategories(catsData);
    } catch {
      showToast('Error loading stalls data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open modal for Adding a new stall
  const handleOpenAdd = () => {
    setEditingStall(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || 'cat-fb');
    setFormStallNumber(`KK-${stalls.length + 1 < 10 ? '0' + (stalls.length + 1) : stalls.length + 1}`);
    setFormShortDesc('');
    setFormDesc('');
    setFormLocation('Club Road Khau Katta, Belagavi 590001');
    setFormOpeningTime('10:00 AM');
    setFormClosingTime('10:00 PM');
    setFormPhone('+91 94480 ');
    setFormStatus('ACTIVE');
    setFormImageUrl('');
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing stall
  const handleOpenEdit = (stall: Stall) => {
    setEditingStall(stall);
    setFormName(stall.name);
    setFormCategoryId(stall.categoryId || categories[0]?.id || '');
    setFormStallNumber(stall.stallNumber);
    setFormShortDesc(stall.shortDescription);
    setFormDesc(stall.description || '');
    setFormLocation(stall.location || 'Club Road Khau Katta, Belagavi 590001');
    setFormOpeningTime(stall.openingTime);
    setFormClosingTime(stall.closingTime);
    setFormPhone(stall.contactPhone);
    setFormStatus(stall.isActive === false || stall.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE');
    setFormImageUrl(stall.imageUrl || '');
    setImageFile(null);
    setImagePreview(stall.imageUrl || null);
    setIsModalOpen(true);
  };

  // Handle file selection with format validation (JPG, JPEG, PNG, WebP)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Please upload a valid JPG, JPEG, PNG, or WebP image.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be under 5MB.', 'error');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemovePhoto = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save Stall (Create or Update)
  const handleSaveStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Stall name is required.', 'error');
      return;
    }
    if (!formCategoryId) {
      showToast('Category is required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = formImageUrl || DEFAULT_STALL_IMAGE;

      // If a new image file was selected, upload it first
      if (imageFile) {
        const uploadRes = await uploadStallImage(imageFile, token || undefined);
        if (uploadRes.success && uploadRes.imageUrl) {
          finalImageUrl = uploadRes.imageUrl;
        } else {
          showToast(uploadRes.message || 'Image upload failed, using fallback.', 'warning');
        }
      }

      const stallPayload = {
        name: formName.trim(),
        categoryId: formCategoryId,
        stallNumber: formStallNumber.trim(),
        shortDescription: formShortDesc.trim() || 'Authentic Belagavi marketplace stall.',
        description: formDesc.trim() || 'Welcome to our stall in Khau Katta.',
        imageUrl: finalImageUrl,
        bannerUrl: finalImageUrl,
        location: formLocation.trim(),
        openingTime: formOpeningTime.trim(),
        closingTime: formClosingTime.trim(),
        contactPhone: formPhone.trim(),
        isActive: formStatus === 'ACTIVE',
        status: formStatus
      };

      if (editingStall) {
        const res = await updateStall(editingStall.id, stallPayload, token || undefined);
        if (res.success) {
          showToast(`Stall "${formName}" updated successfully!`, 'success');
          setIsModalOpen(false);
          await loadData();
        } else {
          showToast(res.message || 'Failed to update stall.', 'error');
        }
      } else {
        const res = await createStall(stallPayload, token || undefined);
        if (res.success) {
          showToast(`Stall "${formName}" created successfully!`, 'success');
          setIsModalOpen(false);
          await loadData();
        } else {
          showToast(res.message || 'Failed to create stall.', 'error');
        }
      }
    } catch {
      showToast('Error saving stall. Please check network connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status
  const handleConfirmToggle = async () => {
    if (!stallToToggle) return;
    const newActiveState = !(stallToToggle.isActive !== false && stallToToggle.status !== 'INACTIVE');
    try {
      const res = await toggleStallStatus(stallToToggle.id, newActiveState, token || undefined);
      if (res.success) {
        showToast(`Stall status updated to ${newActiveState ? 'ACTIVE' : 'INACTIVE'}.`, 'success');
        setStallToToggle(null);
        await loadData();
      } else {
        showToast(res.message || 'Failed to toggle stall status.', 'error');
      }
    } catch {
      showToast('Error toggling stall status.', 'error');
    }
  };

  // Delete Stall with Order History Protection
  const handleConfirmDelete = async () => {
    if (!stallToDelete) return;
    setOrderCheckWarning(null);

    try {
      const res = await deleteStall(stallToDelete.id, token || undefined);
      if (res.success) {
        showToast(`Stall "${stallToDelete.name}" safely deleted.`, 'info');
        setStallToDelete(null);
        await loadData();
      } else {
        // Show safe deletion warning
        setOrderCheckWarning(res.message || 'Cannot delete stall with historical orders.');
      }
    } catch {
      showToast('Network error during stall deletion.', 'error');
    }
  };

  // Filter stalls
  const filteredStalls = stalls.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.stallNumber.toLowerCase().includes(q) ||
        (s.shortDescription && s.shortDescription.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory && s.categoryId !== selectedCategory) {
      return false;
    }

    if (selectedStatus === 'ACTIVE') {
      if (s.isActive === false || s.status === 'INACTIVE') return false;
    } else if (selectedStatus === 'INACTIVE') {
      if (s.isActive !== false && s.status !== 'INACTIVE') return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2e1b10] tracking-tight flex items-center gap-2">
            <span>Stall Management Registry</span>
            <span className="text-xs bg-[#faebd7] text-[#93370d] font-bold px-3 py-1 rounded-full border border-[#eed7c2]">
              {stalls.length} Total Stalls
            </span>
          </h2>
          <p className="text-xs text-[#735442]">
            Create, edit, toggle active status, and manage storefront photos across Belagavi Khau Katta
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all flex-shrink-0"
        >
          <Plus size={16} />
          <span>Add New Stall</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] shadow-xs flex flex-wrap items-center gap-3 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-2.5 text-[#9c7f6e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search stall name or KK number..."
            className="w-full pl-10 pr-4 py-2 bg-[#fdf8f3] text-xs text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] placeholder:text-[#9c7f6e]/70"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto min-w-[170px]">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-[#fdf8f3] text-xs text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-medium"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto min-w-[140px]">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as any)}
            className="w-full p-2 bg-[#fdf8f3] text-xs text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Stall Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#735442] flex items-center justify-center gap-2">
          <RotateCw size={18} className="animate-spin text-[#c86228]" />
          <span>Loading Khau Katta stalls registry...</span>
        </div>
      ) : filteredStalls.length > 0 ? (
        <div className="bg-[#fffdfb]/95 rounded-3xl border border-[#eed7c2] shadow-xs overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#eed7c2] bg-[#fdf8f3] text-[#9c7f6e] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Stall Photo</th>
                  <th className="py-3.5 px-4">Stall &amp; Number</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4 text-center">Products</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eed7c2]/60">
                {filteredStalls.map(s => {
                  const isInactive = s.isActive === false || s.status === 'INACTIVE';
                  const catName = categories.find(c => c.id === s.categoryId)?.name || 'Local Stall';
                  return (
                    <tr key={s.id} className="hover:bg-[#fdf8f3]/60 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#faebd7]/50 border border-[#eed7c2] flex-shrink-0 relative">
                          <img
                            src={s.imageUrl || DEFAULT_STALL_IMAGE}
                            alt={s.name}
                            onError={e => {
                              (e.target as HTMLImageElement).src = DEFAULT_STALL_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Stall & Number */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] text-[#93370d] bg-[#faebd7] px-1.5 py-0.5 rounded border border-[#eed7c2]">
                            {s.stallNumber}
                          </span>
                          <span className="font-bold text-[#2e1b10] text-sm">{s.name}</span>
                        </div>
                        <p className="text-[11px] text-[#735442] line-clamp-1 max-w-xs mt-0.5">
                          {s.shortDescription}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[#52392a] font-medium">{catName}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isInactive
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-[#e8f5ec] text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isInactive ? 'INACTIVE' : 'ACTIVE'}
                        </span>
                      </td>

                      {/* Hours */}
                      <td className="py-3.5 px-4 text-[#735442] whitespace-nowrap font-medium">
                        {s.openingTime} - {s.closingTime}
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#2e1b10]">
                        {s.productCount !== undefined ? s.productCount : s.products?.length || 0}
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#2e1b10]">
                        {s.orderCount !== undefined ? s.orderCount : 0}
                      </td>

                      {/* Actions: Edit, View, Activate/Deactivate, Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Stall */}
                          <Link
                            to={`/stalls/${s.id}`}
                            target="_blank"
                            className="p-1.5 bg-[#fdf8f3] hover:bg-[#faebd7] text-[#735442] rounded-lg text-xs border border-[#eed7c2] transition-colors"
                            title="View Customer Page"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          {/* Edit Stall */}
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 bg-[#faebd7] hover:bg-[#f5d7b5] text-[#c86228] rounded-lg text-xs font-semibold cursor-pointer border border-[#eed7c2] transition-colors"
                            title="Edit Stall & Photo"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Toggle Active / Inactive */}
                          <button
                            onClick={() => setStallToToggle(s)}
                            className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                              isInactive
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                            }`}
                            title={isInactive ? 'Activate Stall' : 'Deactivate Stall'}
                          >
                            <Power size={13} />
                          </button>

                          {/* Safe Delete */}
                          <button
                            onClick={() => {
                              setOrderCheckWarning(null);
                              setStallToDelete(s);
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold cursor-pointer border border-rose-200 transition-colors"
                            title="Delete Stall"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-[#735442] bg-[#fffdfb]/90 rounded-3xl border border-[#eed7c2]">
          No stalls match the current search or category filter.
        </div>
      )}

      {/* ADD / EDIT STALL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fffdfb] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#eed7c2] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-[#9c7f6e] hover:text-[#2e1b10] rounded-full hover:bg-[#faebd7]/60 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-[#2e1b10] tracking-tight">
                {editingStall ? `Edit Stall: ${editingStall.name}` : 'Register New Belagavi Stall'}
              </h3>
              <p className="text-xs text-[#735442] mt-1">
                Fill in the details below. Uploaded photos appear live on customer cards.
              </p>
            </div>

            <form onSubmit={handleSaveStall} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stall Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Stall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Royal Biryani Corner"
                    className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-semibold placeholder:text-[#9c7f6e]/70"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Marketplace Category *
                  </label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stall Number & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Stall Number / Code
                  </label>
                  <input
                    type="text"
                    value={formStallNumber}
                    onChange={e => setFormStallNumber(e.target.value)}
                    placeholder="e.g. KK-08"
                    className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-mono font-bold placeholder:text-[#9c7f6e]/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] font-bold"
                  >
                    <option value="ACTIVE">ACTIVE (Accepting Orders)</option>
                    <option value="INACTIVE">INACTIVE (Temporarily Closed)</option>
                  </select>
                </div>
              </div>

              {/* STALL PHOTO UPLOAD WITH PREVIEW */}
              <div>
                <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
                  Stall Photo (JPG, JPEG, PNG, WebP)
                </label>
                <div className="p-4 bg-[#fdf8f3] rounded-2xl border-2 border-dashed border-[#eed7c2] space-y-3">
                  {imagePreview ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-28 h-24 rounded-xl overflow-hidden bg-[#faebd7]/60 border border-[#eed7c2] flex-shrink-0 relative shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Stall Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1 text-xs text-center sm:text-left">
                        <p className="font-bold text-[#2e1b10]">Live Image Preview</p>
                        <p className="text-[11px] text-[#735442]">
                          {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)` : 'Current saved photo'}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-[#c86228] hover:text-[#93370d] underline cursor-pointer"
                          >
                            Replace Photo
                          </button>
                          <span className="text-[#eed7c2]">•</span>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer py-4 text-center space-y-1.5 text-[#735442] hover:text-[#c86228] transition-colors"
                    >
                      <Upload size={24} className="mx-auto text-[#9c7f6e]" />
                      <p className="text-xs font-bold text-[#2e1b10]">
                        Click to upload stall photo
                      </p>
                      <p className="text-[10px] text-[#9c7f6e]">
                        Supports JPG, PNG, and WebP (Max: 5MB)
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                  Short Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  placeholder="e.g. Authentic aromatic Hyderabadi & Belagavi dum biryani."
                  className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] placeholder:text-[#9c7f6e]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                  Full Description &amp; History
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Details about specialties, heritage recipes, ingredients..."
                  className="w-full text-xs p-3 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] focus:outline-none focus:border-[#c86228] placeholder:text-[#9c7f6e]/70"
                />
              </div>

              {/* Timings & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={formOpeningTime}
                    onChange={e => setFormOpeningTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full text-xs p-2.5 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={formClosingTime}
                    onChange={e => setFormClosingTime(e.target.value)}
                    placeholder="10:00 PM"
                    className="w-full text-xs p-2.5 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2e1b10] mb-1">
                    Merchant Phone
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="+91 94480 00000"
                    className="w-full text-xs p-2.5 bg-[#fdf8f3] text-[#2e1b10] rounded-xl border border-[#eed7c2] font-mono"
                  />
                </div>
              </div>

              {/* Automatic Rating Notice */}
              <div className="p-3 bg-[#faebd7]/70 rounded-xl border border-[#eed7c2] text-xs text-[#735442] flex items-start gap-2">
                <Sparkles size={14} className="text-[#c86228] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#2e1b10]">Dynamic Verified Rating Protection</span>
                  <span className="text-[11px] text-[#735442]">
                    Stall ratings cannot be entered manually. They are automatically calculated from verified customer purchase reviews to preserve marketplace integrity.
                  </span>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#eed7c2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#735442] hover:text-[#2e1b10] rounded-xl hover:bg-[#faebd7]/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      <span>Saving Stall...</span>
                    </>
                  ) : (
                    <span>{editingStall ? 'Save Stall Changes' : 'Create Stall'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOGGLE STATUS CONFIRMATION DIALOG */}
      {stallToToggle && (
        <ConfirmDialog
          isOpen={Boolean(stallToToggle)}
          title={`${stallToToggle.isActive !== false && stallToToggle.status !== 'INACTIVE' ? 'Deactivate' : 'Activate'} Stall: ${stallToToggle.name}?`}
          message={
            stallToToggle.isActive !== false && stallToToggle.status !== 'INACTIVE'
              ? 'Deactivating will mark this stall as INACTIVE. Customers will not be able to add dishes from this stall to their cart.'
              : 'Activating will open this stall for customer discovery and doorstep ordering.'
          }
          confirmText={stallToToggle.isActive !== false && stallToToggle.status !== 'INACTIVE' ? 'Deactivate Stall' : 'Activate Stall'}
          isDestructive={stallToToggle.isActive !== false && stallToToggle.status !== 'INACTIVE'}
          onConfirm={handleConfirmToggle}
          onCancel={() => setStallToToggle(null)}
        />
      )}

      {/* DELETE STALL CONFIRMATION DIALOG */}
      {stallToDelete && (
        <ConfirmDialog
          isOpen={Boolean(stallToDelete)}
          title={`Delete Stall: ${stallToDelete.name}?`}
          message={
            orderCheckWarning
              ? orderCheckWarning
              : `Are you sure you want to delete stall "${stallToDelete.name}"? If this stall has historical orders, deletion will be blocked to safeguard customer receipts.`
          }
          confirmText={orderCheckWarning ? 'Understood' : 'Yes, Delete Stall'}
          isDestructive={!orderCheckWarning}
          onConfirm={() => {
            if (orderCheckWarning) {
              setStallToDelete(null);
              setOrderCheckWarning(null);
            } else {
              handleConfirmDelete();
            }
          }}
          onCancel={() => {
            setStallToDelete(null);
            setOrderCheckWarning(null);
          }}
        />
      )}
    </div>
  );
};
