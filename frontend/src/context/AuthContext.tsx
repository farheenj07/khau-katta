import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isVendor: boolean;
  isDeliveryPartner: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
  loginWithOtp: (user: User, token: string) => void;
  loginAdmin: (user: User, token: string) => void;
  loginVendor: (user: User, token: string) => void;
  loginDelivery: (user: User, token: string) => void;
  logout: () => void;
  updateUserProfile: (updated: Partial<User>) => void;
  redirectAfterLogin?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('khau_katta_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('khau_katta_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | undefined>(undefined);

  // Sync with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('khau_katta_token', token);
    } else {
      localStorage.removeItem('khau_katta_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('khau_katta_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('khau_katta_user');
    }
  }, [user]);

  const openLoginModal = useCallback((redirectPath?: string) => {
    setRedirectAfterLogin(redirectPath);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setRedirectAfterLogin(undefined);
  }, []);

  const loginWithOtp = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setIsLoginModalOpen(false);
  }, []);

  const loginAdmin = useCallback((adminData: User, authToken: string) => {
    setUser(adminData);
    setToken(authToken);
  }, []);

  const loginVendor = useCallback((vendorData: User, authToken: string) => {
    setUser(vendorData);
    setToken(authToken);
    setIsLoginModalOpen(false);
  }, []);

  const loginDelivery = useCallback((deliveryData: User, authToken: string) => {
    setUser(deliveryData);
    setToken(authToken);
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('khau_katta_token');
    localStorage.removeItem('khau_katta_user');
    localStorage.removeItem('khau_katta_role');
  }, []);

  const updateUserProfile = useCallback((updated: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updated } : null));
  }, []);

  const role: UserRole = user?.role || 'customer';

  const value: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isVendor: user?.role === 'vendor' || user?.role === 'stall_owner',
    isDeliveryPartner: user?.role === 'delivery_partner',
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    loginWithOtp,
    loginAdmin,
    loginVendor,
    loginDelivery,
    logout,
    updateUserProfile,
    redirectAfterLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
