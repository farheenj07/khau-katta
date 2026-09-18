import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, MessageSquareText, RotateCw, UserRound } from 'lucide-react';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendOtp, verifyOtp } from '../../services/api';

export const CustomerSignupPage: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginWithOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = form.phone.replace(/\D/g, '').slice(-10);

    if (!form.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setStep('otp');
        setOtp('');
        showToast(`OTP sent to +91 ${cleanPhone}`, 'success');
      } else {
        setErrorMessage(res.message || 'Unable to send OTP.');
      }
    } catch {
      setErrorMessage('Network error while creating your account.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanPhone = form.phone.replace(/\D/g, '').slice(-10);
    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyOtp(cleanPhone, otp, form.fullName.trim());
      if (res.success && res.token && res.user) {
        loginWithOtp(res.user, res.token);
        showToast('Account created and signed in.', 'success');
        navigate('/customer/home', { replace: true });
      } else {
        setErrorMessage(res.message || 'Invalid OTP. Please try again.');
      }
    } catch {
      setErrorMessage('Network issue while verifying your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white/90 border border-[#eed7c2] rounded-[32px] shadow-[0_30px_80px_rgba(114,63,32,0.12)] p-6 sm:p-8 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#2e1b10]">Create Customer Account</h1>
          <p className="mt-2 text-sm text-[#735442]">Join Khau Katta and order from local stalls</p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Full Name</label>
              <div className="relative">
                <UserRound size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 pl-10 pr-4 text-sm text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Mobile Number</label>
              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit mobile number"
                className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 px-4 text-sm text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Email (optional)</label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
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
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a password"
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c86228] to-[#d97706] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c86228]/20 transition-all hover:from-[#b2541f] hover:to-[#c06a05] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue with OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#f2d7c0] bg-[#fff7f1] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#c86228]">
                <MessageSquareText size={16} />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Verify OTP</span>
              </div>
              <p className="text-sm text-[#4a2e1d]">We sent a 6-digit code to <span className="font-bold">+91 {form.phone}</span></p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">OTP Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 px-4 text-center text-lg font-black tracking-[0.45em] text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c86228] to-[#d97706] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c86228]/20 transition-all hover:from-[#b2541f] hover:to-[#c06a05] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e5cdaf] bg-[#fffdfb] px-4 py-2.5 text-sm font-semibold text-[#4a2e1d] transition-colors hover:bg-[#faf2e8]"
            >
              <ArrowLeft size={15} />
              Edit details
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-[#f1e1d1] pt-4 text-center text-sm text-[#735442]">
          Already have an account?{' '}
          <Link to="/customer/login" className="font-bold text-[#c86228] hover:text-[#a84e12]">
            Sign in
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#735442]">
          <CheckCircle2 size={14} className="text-emerald-600" />
          Address can be added later from your profile
        </div>
      </div>
    </div>
  );
};
