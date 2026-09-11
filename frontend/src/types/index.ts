export type UserRole = 'customer' | 'admin' | 'delivery_partner';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface StallCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Stall {
  id: string;
  categoryId: string;
  ownerUserId?: string;
  name: string;
  slug: string;
  stallNumber: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isFeatured: boolean;
  isActive: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  location?: string;
  contactPhone: string;
  category?: StallCategory;
  products?: Product[];
  rating: number; // Calculated dynamically from reviews
  reviewCount: number; // Calculated dynamically from reviews
  productCount?: number;
  orderCount?: number;
}

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  productName: string;
  productImage: string;
  stallId: string;
  stallName: string;
  price: number;
  quantity: number;
  itemTotal: number;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface CartSummary {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
}


export interface Product {
  id: string;
  stallId: string;
  productCategoryId?: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  imageUrl: string;
  badge?: string;
  preparationTimeMins: number;
  stallName?: string;
  stallNumber?: string;
  rating?: number; // Calculated dynamically
  reviewCount?: number; // Calculated dynamically
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  productName?: string;
  productImageUrl?: string;
  isReviewed?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  stallId: string;
  stallName?: string;
  stallNumber?: string;
  stallImage?: string;
  addressId: string;
  couponId?: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export type ReviewStatus = 'ACTIVE' | 'HIDDEN' | 'REPORTED' | 'REMOVED';

export interface Review {
  id: string;
  orderId: string;
  orderItemId?: string;
  userId: string;
  stallId: string;
  productId?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  images: string[];
  moderationReason?: string;
  moderatedByUserId?: string;
  moderatedAt?: string;
  createdAt: string;
  updatedAt?: string;
  userName?: string;
  userAvatar?: string;
  stallName?: string;
  productName?: string;
}

export interface ReviewRatingBreakdown {
  averageRating: number;
  totalReviews: number;
  counts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface EligibleReviewItem {
  orderItemId: string;
  orderId: string;
  orderNumber: string;
  orderDate: string;
  stallId: string;
  stallName?: string;
  productId: string;
  productName?: string;
  productImage?: string;
  price: number;
  isReviewed: boolean;
  reviewId?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStalls: number;
  totalOrders: number;
  totalRevenue: number;
  activeDeliveries: number;
  totalProducts: number;
  categoriesCount: number;
  totalReviews?: number;
  pendingReports?: number;
  stallsList?: Array<{
    id: string;
    name: string;
    stallNumber: string;
    category?: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
    contactPhone: string;
  }>;
  recentUsers?: Array<{
    id: string;
    name: string;
    email?: string;
    phone: string;
    status: string;
  }>;
}
