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
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('khau_katta_role') as UserRole;
    return saved && ['customer', 'admin', 'delivery_partner'].includes(saved) ? saved : 'customer';
  });

  useEffect(() => {
    localStorage.setItem('khau_katta_role', currentRole);
  }, [currentRole]);

  const roleMeta: Record<UserRole, { title: string; defaultUser: string }> = {
    customer: { title: 'Customer / Food Lover', defaultUser: 'Pooja Kulkarni (Belagavi)' },
    admin: { title: 'Super Admin', defaultUser: 'Basavaraj Patil (Marketplace Ops)' },
    delivery_partner: { title: 'Belagavi Delivery Rider', defaultUser: 'Ramesh Naik (KA-22 Scooter)' }
  };

  const value: RoleContextType = {
    currentRole,
    setRole: (role: UserRole) => setCurrentRole(role),
    userName: roleMeta[currentRole].defaultUser,
    roleTitle: roleMeta[currentRole].title,
    isCustomer: currentRole === 'customer',
    isAdmin: currentRole === 'admin',
    isDeliveryPartner: currentRole === 'delivery_partner'
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
