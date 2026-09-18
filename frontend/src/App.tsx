import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RoleProvider } from './context/RoleContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { HomePage } from './pages/HomePage';
import { ExploreStallsPage } from './pages/ExploreStallsPage';
import { StallDetailPage } from './pages/StallDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryLoginPage } from './pages/delivery/DeliveryLoginPage';
import { CustomerLoginPage } from './pages/customer/CustomerLoginPage';
import { CustomerSignupPage } from './pages/customer/CustomerSignupPage';
import { LoginLandingPage } from './pages/auth/LoginLandingPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <RoleProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginLandingPage />} />
              <Route path="/customer/login" element={<CustomerLoginPage />} />
              <Route path="/customer/signup" element={<CustomerSignupPage />} />
              <Route path="/vendor/login" element={<VendorLoginPage />} />
              <Route path="/delivery/login" element={<DeliveryLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Customer & Public Routes */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="stalls" element={<ExploreStallsPage />} />
                <Route path="stalls/:id" element={<StallDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="tracking/:id" element={<LiveTrackingPage />} />
                <Route path="customer/orders/:orderId/track" element={<LiveTrackingPage />} />
              </Route>

              <Route path="/customer/home" element={<ProtectedRoute allowedRoles={['customer']}><HomePage /></ProtectedRoute>} />
              <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><HomePage /></ProtectedRoute>} />

              {/* Admin Protected Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><AdminDashboard /></div></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><AdminDashboard /></div></ProtectedRoute>} />

              <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={['stall_owner', 'vendor']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><VendorDashboardPage /></div></ProtectedRoute>} />
              <Route path="/vendor" element={<ProtectedRoute allowedRoles={['stall_owner', 'vendor']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><VendorDashboardPage /></div></ProtectedRoute>} />

              {/* Delivery Partner Protected Routes */}
              <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={['delivery_partner']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><DeliveryDashboard /></div></ProtectedRoute>} />
              <Route path="/delivery" element={<ProtectedRoute allowedRoles={['delivery_partner']}><div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col"><DeliveryDashboard /></div></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </RoleProvider>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
);
};

export default App;

