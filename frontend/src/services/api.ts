import {
  Stall,
  StallCategory,
  Product,
  AdminStats,
  Review,
  ReviewRatingBreakdown,
  EligibleReviewItem,
  Order,
  UserAddress,
  User,
  CartItem,
<<<<<<< HEAD
  CartSummary,
  Delivery,
  DeliveryRoute
=======
  CartSummary
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
} from '../types';

// Fallbacks are preserved to ensure zero downtime
export const FALLBACK_CATEGORIES: StallCategory[] = [
  { id: 'cat-fb', name: 'Food & Beverages', slug: 'food-and-beverages', icon: 'Coffee', description: 'Authentic Belagavi chai, sharbats, juices, and specialty drinks', displayOrder: 1, isActive: true },
  { id: 'cat-ff', name: 'Fast Food', slug: 'fast-food', icon: 'Utensils', description: 'Belagavi girmit, chaats, spicy misal, bajjis, and quick bites', displayOrder: 2, isActive: true },
  { id: 'cat-des', name: 'Desserts', slug: 'desserts', icon: 'Cake', description: 'World-famous Belagavi Kunda, Gokak Karadant, pedhas, and sweets', displayOrder: 3, isActive: true },
  { id: 'cat-jew', name: 'Jewellery', slug: 'jewellery', icon: 'Gem', description: 'Traditional Kolhapuri saaj, silver trinkets, temple & antique jewellery', displayOrder: 4, isActive: true },
  { id: 'cat-clo', name: 'Clothing', slug: 'clothing', icon: 'Shirt', description: 'Shahapur handloom sarees, cotton kurtis, scarves, and ethnic wear', displayOrder: 5, isActive: true },
  { id: 'cat-toy', name: 'Toys', slug: 'toys', icon: 'Gamepad2', description: 'Handcrafted wooden toys, educational puzzles, and play collectibles', displayOrder: 6, isActive: true },
  { id: 'cat-gif', name: 'Gifts', slug: 'gifts', icon: 'Gift', description: 'Brass curios, Belagavi mementos, handmade cards, and festive gift hampers', displayOrder: 7, isActive: true },
  { id: 'cat-acc', name: 'Accessories', slug: 'accessories', icon: 'Watch', description: 'Handcrafted leather chappals, wallets, bags, belts, and daily essentials', displayOrder: 8, isActive: true },
  { id: 'cat-oth', name: 'Other', slug: 'other', icon: 'Store', description: 'Belagavi organic spices, pottery, natural soaps, and local artisanal supplies', displayOrder: 9, isActive: true }
];

export const FALLBACK_STALLS: Stall[] = [
  {
    id: 'stall-01',
    categoryId: 'cat-des',
    name: 'Belgaum Kunda & Sweets House',
    slug: 'belgaum-kunda-and-sweets',
    stallNumber: 'KK-01',
    shortDescription: 'Iconic caramelized Belagavi Kunda made from slow-cooked pure milk & dry fruits.',
    description: 'Founded in 1958, our stall at Khau Katta continues the golden legacy of Belagavi sweet-making. We specialize in hot oven Kunda, rich Gokak Karadant, and handmade Dharwad Pedha using pure A2 cow milk and organic jaggery.',
    imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 342,
    openingTime: '09:00 AM',
    closingTime: '10:30 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 11111'
  },
  {
    id: 'stall-02',
    categoryId: 'cat-ff',
    name: 'Camp Misal & Chaat Durbar',
    slug: 'camp-misal-chaat-durbar',
    stallNumber: 'KK-02',
    shortDescription: 'Fiery Kolhapuri-Belagavi rassa misal, crunchy farsan, and tangy street chaats.',
    description: 'A beloved institution at Khau Katta! Our spicy tarri misal is cooked with stone-ground spices and served with piping hot pav and lemon wedges. Also serving crispy sev puri, dahi bhel, and spicy ragda patties.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 410,
    openingTime: '10:00 AM',
    closingTime: '10:00 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 22222'
  },
  {
    id: 'stall-03',
    categoryId: 'cat-fb',
    name: 'Tilakwadi Kadak Chai & Bun Maska',
    slug: 'tilakwadi-kadak-chai-bun-maska',
    stallNumber: 'KK-03',
    shortDescription: 'Slow-brewed ginger cardamom tea paired with fluffy buttered Irani buns.',
    description: 'The premier meeting spot in Khau Katta. Brewed in brass samovars with fresh mountain spices, our kadak chai and warm maska buns offer pure nostalgic warmth on breezy Belagavi evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 280,
    openingTime: '07:30 AM',
    closingTime: '11:00 PM',
    isOpen: true,
    isFeatured: false,
    isActive: true,
    contactPhone: '+91 94480 33333'
  },
  {
    id: 'stall-04',
    categoryId: 'cat-jew',
    name: 'Belagavi Royal Silver & Kolhapuri Saaj',
    slug: 'belagavi-royal-silver-kolhapuri-saaj',
    stallNumber: 'KK-04',
    shortDescription: 'Artisanal 925 sterling silver jewelry, traditional Saaj necklaces, and payals.',
    description: 'Showcasing the glorious metallic craftsmanship of North Karnataka and Maharashtra borderlands. Each item is handcrafted by generational silversmiths with hallmarks of purity and heritage finish.',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 185,
    openingTime: '10:30 AM',
    closingTime: '09:00 PM',
    isOpen: true,
    isFeatured: true,
    isActive: true,
    contactPhone: '+91 94480 44444'
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  { id: 'prod-01', stallId: 'stall-01', name: 'Classic Belgaum Kunda (500g)', description: 'World famous caramelized milk delicacy roasted to deep brown perfection with cardamom.', price: 260, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&auto=format&fit=crop', badge: 'Bestseller', preparationTimeMins: 10, stallName: 'Belgaum Kunda & Sweets House', stallNumber: 'KK-01', rating: 4.9, reviewCount: 12 },
  { id: 'prod-02', stallId: 'stall-01', name: 'Dry Fruit Special Kunda (500g)', description: 'Enriched with roasted cashews, almonds, and pistachios in pure ghee base.', price: 340, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&auto=format&fit=crop', badge: 'Belagavi Special', preparationTimeMins: 10, stallName: 'Belgaum Kunda & Sweets House', stallNumber: 'KK-01', rating: 5.0, reviewCount: 8 },
  { id: 'prod-05', stallId: 'stall-02', name: 'Special Camp Tarri Misal Pav', description: 'Spicy sprouted moth bean curry served with crunchy farsan, 2 fresh pavs, lemon & curd.', price: 110, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', badge: 'Bestseller', preparationTimeMins: 15, stallName: 'Camp Misal & Chaat Durbar', stallNumber: 'KK-02', rating: 4.8, reviewCount: 14 }
];

export const FALLBACK_ADMIN_STATS: AdminStats = {
  totalUsers: 1240,
  totalStalls: 52,
  totalOrders: 3845,
  totalRevenue: 1428500,
  activeDeliveries: 18,
  totalProducts: 36,
  categoriesCount: 9,
  totalReviews: 4,
  pendingReports: 0
};

// --- AUTHENTICATION APIS ---
export async function sendOtp(phone: string): Promise<{ success: boolean; message: string; devOtp?: string }> {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return res.json();
}

export async function verifyOtp(phone: string, otp: string, name?: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, name })
  });
  return res.json();
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  const res = await fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getProfile(token?: string): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function updateProfile(data: { name?: string; avatarUrl?: string }, token?: string): Promise<{ success: boolean; message?: string; data?: User }> {
  const res = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getUserAddresses(token?: string): Promise<UserAddress[]> {
  try {
    const res = await fetch('/api/auth/addresses', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function saveUserAddress(addr: Partial<UserAddress>, token?: string): Promise<{ success: boolean; message: string; data?: UserAddress }> {
  const res = await fetch('/api/auth/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(addr)
  });
  return res.json();
}

// --- REVIEW & RATING APIS ---
export async function getStallReviews(stallId: string, sort = 'recent', rating?: number): Promise<{ reviews: Review[]; breakdown: ReviewRatingBreakdown }> {
  try {
    const query = new URLSearchParams();
    if (sort) query.append('sort', sort);
    if (rating) query.append('rating', String(rating));

    const res = await fetch(`/api/reviews/stall/${stallId}?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load reviews');
    const json = await res.json();
    return json.data;
  } catch {
    return {
      reviews: [],
      breakdown: {
        averageRating: 4.8,
        totalReviews: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    };
  }
}

export async function getEligibleItems(token?: string): Promise<EligibleReviewItem[]> {
  try {
    const res = await fetch('/api/reviews/eligible-items', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function submitReview(
  reviewData: {
    stallId: string;
    orderId?: string;
    orderItemId?: string;
    productId?: string;
    rating: number;
    comment: string;
    images?: string[];
  },
  token?: string
): Promise<{ success: boolean; message: string; data?: Review }> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(reviewData)
  });
  return res.json();
}

export async function getMyReviews(token?: string): Promise<Review[]> {
  try {
    const res = await fetch('/api/reviews/my-reviews', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function reportReview(reviewId: string, reason: string, token?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/reviews/${reviewId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ reason })
  });
  return res.json();
}

export async function getAdminReviews(params?: { search?: string; stallId?: string; rating?: number; status?: string }, token?: string): Promise<{ data: Review[]; total: number; reportsCount: number }> {
  try {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.stallId) q.append('stallId', params.stallId);
    if (params?.rating) q.append('rating', String(params.rating));
    if (params?.status) q.append('status', params.status);

    const res = await fetch(`/api/reviews/admin/all?${q.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    return { data: [], total: 0, reportsCount: 0 };
  }
}

export async function moderateReview(reviewId: string, status: string, reason?: string, token?: string): Promise<{ success: boolean; message: string; data?: Review }> {
  const res = await fetch(`/api/reviews/admin/${reviewId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ status, reason })
  });
  return res.json();
}

// --- ORDER APIS ---
export async function getMyOrders(token?: string): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders/my-orders', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

// --- STANDARD MARKETPLACE APIS ---
export async function getCategories(): Promise<StallCategory[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data || FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getStalls(params?: { category?: string; search?: string; isOpen?: boolean }): Promise<Stall[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.isOpen !== undefined) query.append('isOpen', String(params.isOpen));

    const res = await fetch(`/api/stalls?${query.toString()}`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data || FALLBACK_STALLS;
  } catch {
    return FALLBACK_STALLS;
  }
}

export async function getStallById(id: string): Promise<Stall | null> {
  try {
    const res = await fetch(`/api/stalls/${id}`);
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getPopularProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data || FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function getAdminStats(token?: string): Promise<AdminStats> {
  try {
    const res = await fetch('/api/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data || FALLBACK_ADMIN_STATS;
  } catch {
    return FALLBACK_ADMIN_STATS;
  }
}

// ============================================================================
// CART API SERVICES
// ============================================================================

export async function getCart(token?: string): Promise<CartSummary> {
  try {
    const res = await fetch('/api/cart', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    const json = await res.json();
    return json.data;
  } catch {
    return {
      id: 'cart-guest',
      userId: 'guest',
      items: [],
      totalItems: 0,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0
    };
  }
}

export async function addToCartApi(
  productId: string,
  quantity: number = 1,
  token?: string
): Promise<{ success: boolean; message?: string; data?: CartSummary }> {
  try {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ productId, quantity })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error adding item to cart.' };
  }
}

export async function updateCartQuantityApi(
  productId: string,
  quantity: number,
  token?: string
): Promise<{ success: boolean; message?: string; data?: CartSummary }> {
  try {
    const res = await fetch(`/api/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ quantity })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error updating cart quantity.' };
  }
}

export async function removeFromCartApi(
  productId: string,
  token?: string
): Promise<{ success: boolean; message?: string; data?: CartSummary }> {
  try {
    const res = await fetch(`/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error removing item from cart.' };
  }
}

export async function clearCartApi(
  token?: string
): Promise<{ success: boolean; message?: string; data?: CartSummary }> {
  try {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error clearing cart.' };
  }
}

// ============================================================================
// STALL ADMIN MANAGEMENT SERVICES
// ============================================================================

export async function getStallsAdmin(token?: string): Promise<Stall[]> {
  try {
    const res = await fetch('/api/stalls?includeInactive=true', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.data || FALLBACK_STALLS;
  } catch {
    return FALLBACK_STALLS;
  }
}

export async function createStall(
  data: Partial<Stall>,
  token?: string
): Promise<{ success: boolean; message?: string; data?: Stall }> {
  try {
    const res = await fetch('/api/stalls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error creating stall.' };
  }
}

export async function updateStall(
  id: string,
  data: Partial<Stall>,
  token?: string
): Promise<{ success: boolean; message?: string; data?: Stall }> {
  try {
    const res = await fetch(`/api/stalls/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error updating stall.' };
  }
}

export async function toggleStallStatus(
  id: string,
  isActive: boolean,
  token?: string
): Promise<{ success: boolean; message?: string; data?: Stall }> {
  try {
    const res = await fetch(`/api/stalls/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ isActive })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error toggling stall status.' };
  }
}

export async function deleteStall(
  id: string,
  token?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/stalls/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error deleting stall.' };
  }
}

export async function uploadStallImage(
  file: File,
  token?: string
): Promise<{ success: boolean; message?: string; imageUrl?: string }> {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch('/api/upload/stall-image', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error uploading image file.' };
  }
}

<<<<<<< HEAD
export async function toggleStallOpenStatusApi(
  id: string,
  isOpen: boolean
): Promise<{ success: boolean; message?: string; data?: Stall }> {
  try {
    const res = await fetch(`/api/stalls/${id}/toggle-open`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error toggling shop status.' };
  }
}

export async function createProductApi(
  productData: Partial<Product>
): Promise<{ success: boolean; message?: string; data?: Product }> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error creating menu item.' };
  }
}

export async function updateProductApi(
  id: string,
  productData: Partial<Product>
): Promise<{ success: boolean; message?: string; data?: Product }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error updating menu item.' };
  }
}

export async function toggleProductAvailabilityApi(
  id: string,
  isAvailable: boolean
): Promise<{ success: boolean; message?: string; data?: Product }> {
  try {
    const res = await fetch(`/api/products/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error toggling item availability.' };
  }
}

export async function deleteProductApi(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error deleting menu item.' };
  }
}

// --- ORDER & RIDER-VENDOR PICKUP OTP APIS ---

export async function checkoutOrderApi(
  payload: { paymentMode: 'ONLINE' | 'COD'; addressId?: string; specialInstructions?: string },
  token?: string
): Promise<{ success: boolean; message?: string; data?: Order }> {
  try {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error processing checkout.' };
  }
}

export async function getVendorOrders(stallId?: string, token?: string): Promise<Order[]> {
  try {
    const url = stallId ? `/api/orders/vendor/my-orders?stallId=${stallId}` : '/api/orders/vendor/my-orders';
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getRiderDeliveries(token?: string): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders/rider/my-deliveries', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getPickupOtpApi(
  orderId: string,
  token?: string
): Promise<{ success: boolean; data?: { otpCode: string; expiresAt: number; attempts: number; remainingSeconds: number }; message?: string }> {
  try {
    const res = await fetch(`/api/orders/${orderId}/pickup-otp`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error fetching pickup OTP.' };
  }
}

export async function regeneratePickupOtpApi(
  orderId: string,
  token?: string
): Promise<{ success: boolean; data?: { otpCode: string; expiresAt: number }; message?: string }> {
  try {
    const res = await fetch(`/api/orders/${orderId}/pickup-otp/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error regenerating pickup OTP.' };
  }
}

export async function verifyPickupOtpApi(
  orderId: string,
  otp: string,
  token?: string
): Promise<{ success: boolean; message: string; remainingAttempts?: number; order?: Order }> {
  try {
    const res = await fetch(`/api/orders/${orderId}/pickup-otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ otp })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error verifying pickup OTP.' };
  }
}

export async function updateOrderStatusApi(
  orderId: string,
  status: Order['status'],
  token?: string
): Promise<{ success: boolean; message?: string; data?: Order }> {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error updating order status.' };
  }
}

// --- REAL-TIME GPS TRACKING, SIMULATION & ML PREDICTION APIS ---

export async function getDeliveryTracking(
  deliveryId: string,
  token?: string
): Promise<Delivery | null> {
  try {
    const res = await fetch(`/api/deliveries/${deliveryId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function updateRiderGpsApi(
  deliveryId: string,
  latitude: number,
  longitude: number,
  speed?: number,
  heading?: number,
  token?: string
): Promise<{ success: boolean; message?: string; data?: Delivery }> {
  try {
    const res = await fetch(`/api/deliveries/${deliveryId}/gps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ latitude, longitude, speed, heading })
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error posting GPS coordinates.' };
  }
}

export async function stepSimulationApi(
  deliveryId: string
): Promise<{ success: boolean; message?: string; data?: Delivery }> {
  try {
    const res = await fetch(`/api/deliveries/${deliveryId}/simulation/step`, {
      method: 'POST'
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error stepping simulation.' };
  }
}

export async function toggleSimulationApi(
  deliveryId: string,
  token?: string
): Promise<{ success: boolean; message?: string; data?: Delivery }> {
  try {
    const res = await fetch(`/api/deliveries/${deliveryId}/simulation/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Network error toggling tracking mode.' };
  }
}

export async function getAdminLiveFleetApi(
  token?: string
): Promise<{ success: boolean; totalRiders: number; activeDeliveriesCount: number; data: any[] }> {
  try {
    const res = await fetch('/api/deliveries/admin/live-fleet', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) return { success: false, totalRiders: 0, activeDeliveriesCount: 0, data: [] };
    return await res.json();
  } catch {
    return { success: false, totalRiders: 0, activeDeliveriesCount: 0, data: [] };
  }
}

export async function optimizeRouteApi(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<{ success: boolean; data?: DeliveryRoute }> {
  try {
    const res = await fetch('/api/deliveries/optimize-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startLat, startLng, endLat, endLng })
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}



=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
