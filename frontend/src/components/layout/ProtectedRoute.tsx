import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, UserCheck, LogIn } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAdmin, isCustomer, isDeliveryPartner, isVendor } = useAuth();
  const location = useLocation();

  const userRole = user?.role;
  const isRoleAllowed =
    !!userRole && allowedRoles.includes(userRole) ||
    (allowedRoles.includes('admin') && isAdmin) ||
    (allowedRoles.includes('customer') && isCustomer) ||
    (allowedRoles.includes('delivery_partner') && isDeliveryPartner) ||
    ((allowedRoles.includes('vendor') || allowedRoles.includes('stall_owner')) && isVendor);

  if (!user && allowedRoles.includes('customer')) {
    return <Navigate to="/customer/login" state={{ from: location }} replace />;
  }

  if (!user && allowedRoles.includes('vendor')) {
    return <Navigate to="/vendor/login" state={{ from: location }} replace />;
  }

  if (!user && allowedRoles.includes('stall_owner')) {
    return <Navigate to="/vendor/login" state={{ from: location }} replace />;
  }

  if (!user && allowedRoles.includes('delivery_partner')) {
    return <Navigate to="/delivery/login" state={{ from: location }} replace />;
  }

  if (!user && allowedRoles.includes('admin')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isRoleAllowed) {
    const redirectMap: Record<string, string> = {
      customer: '/customer/login',
      vendor: '/vendor/login',
      stall_owner: '/vendor/login',
      delivery_partner: '/delivery/login',
      admin: '/admin/login'
    };

    const target = allowedRoles[0] ? redirectMap[allowedRoles[0]] || '/login' : '/login';

    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

