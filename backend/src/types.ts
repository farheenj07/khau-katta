export type UserRole = 'customer' | 'admin' | 'delivery_partner' | 'stall_owner';

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  roleId: string;
  name: string;
  email?: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
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
  rating?: number; // Calculated dynamically
  reviewCount?: number; // Calculated dynamically
  productCount?: number;
  orderCount?: number;
}

export interface CartItem {
  id: string;
  cartId: string;
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

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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


export interface ProductCategory {
  id: string;
  stallId: string;
  name: string;
  displayOrder: number;
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

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  stallId: string;
  addressId: string;
  deliveryAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  locationAccuracy?: number;
  locationUpdatedAt?: string;
  statusHistory?: { status: Order['status']; timestamp: string }[];
  couponId?: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'rider_assigned' | 'rider_arrived_at_vendor' | 'pickup_verified' | 'picked_up' | 'out_for_delivery' | 'arrived_at_customer' | 'delivered' | 'cancelled';
  assignmentStatus?: 'unassigned' | 'assigned' | 'accepted' | 'arrived_at_vendor' | 'ready_for_pickup' | 'pickup_verified' | 'picked_up' | 'out_for_delivery' | 'arrived_at_customer' | 'delivered' | 'cancelled';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  stallName?: string;
  stallNumber?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  pickupVerifiedAt?: string;
  pickupVerifiedBy?: string;
  paymentMode?: 'ONLINE' | 'COD';
  paymentStatus?: 'PAID' | 'PENDING';
}

export interface PickupVerificationRecord {
  id: string;
  orderId: string;
  stallId: string;
  deliveryPartnerId?: string;
  otpCiphertext: string;
  expiresAt: number; // Unix timestamp in ms
  attempts: number;
  isVerified: boolean;
  status: 'ACTIVE' | 'VERIFIED' | 'EXPIRED' | 'BLOCKED' | 'CANCELLED';
  blockedUntil?: number;
  verifiedAt?: string;
  verifiedByRiderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickupAuditLog {
  id: string;
  orderId: string;
  stallId: string;
  riderId?: string;
  riderName?: string;
  action: 'OTP_GENERATED' | 'OTP_REGENERATED' | 'OTP_EXPIRED' | 'VERIFICATION_SUCCESS' | 'VERIFICATION_FAILED' | 'ATTEMPTS_EXCEEDED';
  details: string;
  timestamp: string;
}

/** Immutable record of each administrator assignment or reassignment. */
export interface DeliveryAssignmentAudit {
  id: string;
  orderId: string;
  previousRiderId?: string;
  nextRiderId?: string;
  assignedByUserId: string;
  action: 'ASSIGNED' | 'REASSIGNED' | 'DECLINED';
  timestamp: string;
}

export interface DeliveryVerificationRecord {
  orderId: string;
  otpCode: string;
  expiresAt: number;
  attempts: number;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedByRiderId?: string;
}

export interface DeliveryWaypoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface DeliveryRoute {
  standardPath: DeliveryWaypoint[];
  optimizedPath: DeliveryWaypoint[];
  standardDistanceKm: number;
  optimizedDistanceKm: number;
  standardDurationMins: number;
  optimizedDurationMins: number;
  distanceSavedKm: number;
  timeSavedMins: number;
  fuelSavedLiters: number;
  algorithmUsed: 'A_STAR' | 'DIJKSTRA' | 'VRP_MULTI_CONSTRAINT';
}

/** A route returned by a road-routing provider, never an interpolated line. */
export interface RoadRoute {
  geometry: DeliveryWaypoint[];
  distanceKm: number;
  durationMins: number;
  provider: 'OSRM';
  roadBased: true;
}

export interface MLDeliveryPrediction {
  prediction: 'ON_TIME' | 'POSSIBLE_DELAY';
  confidencePercentage: number;
  predictedDurationMins: number;
  riskScore: number; // 0 to 100
  contributingFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }[];
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  stallId: string;
  stallName: string;
  stallLat: number;
  stallLng: number;
  customerUserId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  destinationLat: number;
  destinationLng: number;
  destinationAccuracy?: number;
  currentLocationAccuracy?: number;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerVehicleNumber?: string;
  status: 'unassigned' | 'assigned' | 'accepted' | 'arrived_at_vendor' | 'ready_for_pickup' | 'pickup_verified' | 'picked_up' | 'out_for_delivery' | 'arrived_at_customer' | 'delivered' | 'cancelled';
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  headingDeg: number;
  simulationMode: boolean;
  simulationProgress: number; // 0.0 to 1.0
  route: DeliveryRoute;
  roadRoute?: RoadRoute;
  routeError?: string;
  mlPrediction: MLDeliveryPrediction;
  lastUpdated: string;
  assignedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  statusHistory?: { status: Order['status']; timestamp: string }[];
}

export interface LocationLog {
  id: string;
  deliveryId: string;
  partnerId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed: number;
  heading: number;
  timestamp: string;
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

export interface DeliveryPartner {
  id: string;
  userId: string;
  vehicleType: 'motorcycle' | 'scooter' | 'bicycle' | 'electric_bike';
  vehicleNumber: string;
  drivingLicenseNumber: string;
  status: 'pending' | 'approved' | 'suspended' | 'offline';
  isAvailable: boolean;
  rating: number;
  totalDeliveries: number;
  user?: User;
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

export interface ReviewReport {
  id: string;
  reviewId: string;
  reportedByUserId: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface OtpRecord {
  id: string;
  phone: string;
  otpCode: string;
  expiresAt: number;
  isVerified: boolean;
  attempts: number;
  createdAt: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStalls: number;
  totalOrders: number;
  totalRevenue: number;
  activeDeliveries: number;
  totalProducts: number;
  categoriesCount: number;
  totalReviews: number;
  pendingReports: number;
}
