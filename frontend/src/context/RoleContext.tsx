import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  roleTitle: string;
  isCustomer: boolean;
  isAdmin: boolean;
  isDeliveryPartner: boolean;
<<<<<<< HEAD
  isVendor: boolean;
=======
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('khau_katta_role') as UserRole;
<<<<<<< HEAD
    return saved && ['customer', 'admin', 'delivery_partner', 'vendor'].includes(saved) ? saved : 'customer';
=======
    return saved && ['customer', 'admin', 'delivery_partner'].includes(saved) ? saved : 'customer';
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  });

  useEffect(() => {
    localStorage.setItem('khau_katta_role', currentRole);
  }, [currentRole]);

  const roleMeta: Record<UserRole, { title: string; defaultUser: string }> = {
    customer: { title: 'Customer / Food Lover', defaultUser: 'Pooja Kulkarni (Belagavi)' },
    admin: { title: 'Super Admin', defaultUser: 'Basavaraj Patil (Marketplace Ops)' },
<<<<<<< HEAD
    delivery_partner: { title: 'Belagavi Delivery Rider', defaultUser: 'Ramesh Naik (KA-22 Scooter)' },
    vendor: { title: 'Food Vendor / Stall Owner', defaultUser: 'Belgaum Sweets Merchant (KK-01)' }
=======
    delivery_partner: { title: 'Belagavi Delivery Rider', defaultUser: 'Ramesh Naik (KA-22 Scooter)' }
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  };

  const value: RoleContextType = {
    currentRole,
    setRole: (role: UserRole) => setCurrentRole(role),
    userName: roleMeta[currentRole].defaultUser,
    roleTitle: roleMeta[currentRole].title,
    isCustomer: currentRole === 'customer',
    isAdmin: currentRole === 'admin',
<<<<<<< HEAD
    isDeliveryPartner: currentRole === 'delivery_partner',
    isVendor: currentRole === 'vendor'
=======
    isDeliveryPartner: currentRole === 'delivery_partner'
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
