import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Bike, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { deliveryLogin } from '../../services/api';

export const DeliveryLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginDelivery } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await deliveryLogin(identifier, password);
      if (!result.success || !result.token || !result.user) {
        setErrorMessage(result.message || 'Incorrect mobile number or password. Please try again.');
        setLoading(false);
        return;
      }

      loginDelivery(result.user, result.token);

      showToast('Delivery partner access approved.', 'success');
      navigate('/delivery/dashboard', { replace: true });
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
          <h1 className="text-3xl font-black tracking-tight text-[#2e1b10]">Delivery Partner Login</h1>
          <p className="mt-2 text-sm text-[#735442]">Deliver orders with Khau Katta</p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Mobile Number or Email</label>
            <div className="relative">
              <Bike size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="ramesh.delivery@khaukatta.in or 9740098765"
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
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e7dcc8] bg-[#f5f0e8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#685a43]">
              <ShieldCheck size={12} />
              Approved riders
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3d2314] to-[#5a341d] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d2314]/15 transition-all hover:from-[#2f1a0f] hover:to-[#4f2a17] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-5 rounded-2xl border border-[#ebdec5] bg-[#faf5ee] p-3 text-xs text-[#735442]">
          <p className="font-bold text-[#4a2e1d] mb-1">Want to become a delivery partner?</p>
          <p>Send a request to the admin team for approval before your rider profile becomes active.</p>
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
