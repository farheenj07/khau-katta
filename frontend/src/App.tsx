import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RoleProvider } from './context/RoleContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { HomePage } from './pages/HomePage';
import { ExploreStallsPage } from './pages/ExploreStallsPage';
import { StallDetailPage } from './pages/StallDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <RoleProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer & Public Routes */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="stalls" element={<ExploreStallsPage />} />
                <Route path="vendors" element={<ExploreStallsPage />} />
                <Route path="stalls/:id" element={<StallDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="tracking/:id" element={<LiveTrackingPage />} />
              </Route>

              {/* Vendor Portal Routes */}
              <Route
                path="/vendor/*"
                element={
                  <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col">
                    <RoleSwitcherBar />
                    <VendorDashboardPage />
                  </div>
                }
              />

              {/* Admin Login Route (Publicly accessible to authenticate) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col">
                    <RoleSwitcherBar />
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </div>
                }
              />

              {/* Delivery Partner Protected Routes */}
              <Route
                path="/delivery/*"
                element={
                  <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col">
                    <RoleSwitcherBar />
                    <ProtectedRoute allowedRoles={['delivery_partner']}>
                      <DeliveryDashboard />
                    </ProtectedRoute>
                  </div>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </RoleProvider>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
);
};

export default App;

