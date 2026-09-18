import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminLogin } from '../../services/api';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, RotateCw, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e28743]/18 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#d47a3b]/14 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#fffdfb]/95 border border-[#eed7c2] rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        {/* Top Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faf2e8] border border-[#eed7c2] rounded-full text-[#c86228] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <ShieldCheck size={13} />
              <span>Admin Central Portal</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#2e1b10]">
              Administrator Login
            </h1>
            <p className="text-xs text-[#735442] mt-1">
              Restricted access for Belagavi marketplace operations &amp; moderation
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4a2e1d] mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-[#9c7f6e] pointer-events-none" />
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@khaukatta.in"
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf2e8]/80 rounded-2xl text-xs text-[#2e1b10] placeholder-[#a08372] border border-[#e5cdaf] focus:border-[#c86228] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a2e1d] mb-1.5">
              Security Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-[#9c7f6e] pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf2e8]/80 rounded-2xl text-xs text-[#2e1b10] placeholder-[#a08372] border border-[#e5cdaf] focus:border-[#c86228] focus:bg-white focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-[#faf2e8]/90 rounded-2xl border border-[#eed7c2] text-[11px] text-[#735442] space-y-1">
            <div className="font-bold text-[#c86228] flex items-center gap-1">
              <span>Default Admin Demo Credentials:</span>
            </div>
            <div>Email: <strong className="text-[#2e1b10]">admin@khaukatta.in</strong></div>
            <div>Password: <strong className="text-[#2e1b10] font-mono">KhauKatta@Admin2026</strong></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b2541f] hover:to-[#c06a05] text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#c86228]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
            className="inline-flex items-center gap-1.5 text-xs text-[#735442] hover:text-[#c86228] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Khau Katta Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
