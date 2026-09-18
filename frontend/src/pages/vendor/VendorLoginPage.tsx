import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { vendorLogin } from '../../services/api';

export const VendorLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginVendor } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await vendorLogin(email, password);
      if (!result.success || !result.token || !result.user) {
        setErrorMessage(result.message || 'Incorrect email or password. Please try again.');
        setLoading(false);
        return;
      }

      loginVendor(result.user, result.token);

      showToast('Vendor access approved.', 'success');
      navigate('/vendor/dashboard', { replace: true });
    } catch {
      setErrorMessage('Network error while signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/90 border border-[#eed7c2] rounded-[32px] shadow-[0_30px_80px_rgba(114,63,32,0.12)] p-6 sm:p-8 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#2e1b10]">Vendor Login</h1>
          <p className="mt-2 text-sm text-[#735442]">Manage your stall, products and orders</p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Email / Username</label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vendor@khaukatta.in"
                className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 pl-10 pr-4 text-sm text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Password</label>
            <div className="relative">
              <Lock size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 pl-10 pr-11 text-sm text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-3.5 text-[#735442]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-[#735442]">
            <button type="button" className="font-semibold text-[#c86228] hover:text-[#a84e12]">
              Forgot password?
            </button>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#eed7c2] bg-[#faf2e8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b75a26]">
              <ShieldCheck size={12} />
              Admin Approved
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c86228] to-[#d97706] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c86228]/20 transition-all hover:from-[#b2541f] hover:to-[#c06a05] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-5 rounded-2xl border border-[#efd7c4] bg-[#fff7f1] p-3 text-xs text-[#735442]">
          <p className="font-bold text-[#c86228] mb-1">Vendor account status</p>
          <p>Vendor accounts are created and approved by the admin team. Contact the platform administrator to become a vendor.</p>
        </div>

        <div className="mt-6 text-center text-sm text-[#735442]">
          <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-[#735442] hover:text-[#c86228]">
            <ArrowLeft size={15} />
            Choose portal
          </Link>
        </div>
      </div>
    </div>
  );
};
