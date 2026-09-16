import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminLogin } from '../../services/api';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, RotateCw, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@khaukatta.in');
  const [password, setPassword] = useState('KhauKatta@Admin2026');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      if (res.success && res.token && res.user) {
        loginAdmin(res.user, res.token);
        showToast('Admin authenticated successfully.', 'success');
        navigate('/admin');
      } else {
        setErrorMessage(res.message || 'Invalid administrative credentials.');
      }
    } catch {
      setErrorMessage('Network error during admin authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-artisan-bg text-[#3c1e0a] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#b85018]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#d97706]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#fff8f2]/95 border border-[#f0bd9b] rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        {/* Top Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff0e2] border border-[#f0bd9b] rounded-full text-[#b85018] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <ShieldCheck size={13} />
              <span>Admin Central Portal</span>
            </div>
            <h1 className="font-serif text-2xl font-black tracking-tight text-[#3c1e0a]">
              Administrator Login
            </h1>
            <p className="text-xs text-[#7c4d2e] mt-1">
              Restricted access for Belagavi marketplace operations &amp; moderation
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-[#7c4d2e] pointer-events-none" />
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@khaukatta.in"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fff0e2] rounded-2xl text-xs text-[#3c1e0a] placeholder-[#7c4d2e]/60 border border-[#f0bd9b] focus:border-[#b85018] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3c1e0a] mb-1.5">
              Security Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-[#7c4d2e] pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fff0e2] rounded-2xl text-xs text-[#3c1e0a] placeholder-[#7c4d2e]/60 border border-[#f0bd9b] focus:border-[#b85018] focus:bg-white focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-[#fff0e2] rounded-2xl border border-[#f0bd9b] text-[11px] text-[#7c4d2e] space-y-1">
            <div className="font-bold text-[#b85018] flex items-center gap-1">
              <span>Default Admin Demo Credentials:</span>
            </div>
            <div>Email: <strong className="text-[#3c1e0a]">admin@khaukatta.in</strong></div>
            <div>Password: <strong className="text-[#3c1e0a] font-mono">KhauKatta@Admin2026</strong></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#b85018] to-[#d97706] hover:from-[#963e0e] hover:to-[#b45309] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw size={15} className="animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#7c4d2e] hover:text-[#b85018] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Khau Katta Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
