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
  const { currentRole, setRole, roleTitle } = useRole();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isRoleAllowed = allowedRoles.includes(currentRole) || (allowedRoles.includes('admin') && isAdmin);

  if (!isRoleAllowed) {
    // If attempting to access admin and not authenticated as admin, redirect to admin login page
    if (allowedRoles.includes('admin') && !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-orange-100 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-200">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 text-sm mb-6">
            This section requires one of these roles: <span className="font-semibold text-orange-700">{allowedRoles.join(', ')}</span>.
            Your current active role is <span className="font-semibold text-gray-800">{roleTitle}</span> ({currentRole}).
          </p>

          <div className="bg-amber-50/70 rounded-xl p-4 mb-6 border border-amber-100 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
              <UserCheck size={14} /> Stage 2 Role Architecture
            </p>
            <p className="text-xs text-amber-900/80">
              Switch role or log in with verified credentials:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allowedRoles.map(role => (
                <button
                  key={role}
                  onClick={() => setRole(role)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Switch to {role === 'admin' ? 'Admin' : role === 'delivery_partner' ? 'Delivery Partner' : 'Customer'}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-700 font-medium transition-colors"
          >
            Back to Khau Katta Home <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

