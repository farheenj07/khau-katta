import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Clock3, MessageSquareText, RotateCw, Smartphone } from 'lucide-react';
import { KhauKattaLogo } from '../../components/common/KhauKattaLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendOtp, verifyOtp } from '../../services/api';

export const CustomerLoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginWithOtp, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== 'otp') return;
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, step]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/customer/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
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
        setCountdown(120);
        showToast(`OTP sent to +91 ${cleanPhone}`, 'success');
      } else {
        setErrorMessage(res.message || 'Unable to send OTP right now.');
      }
    } catch {
      setErrorMessage('Network error while sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyOtp(cleanPhone, otp, 'Khau Katta Customer');
      if (res.success && res.token && res.user) {
        loginWithOtp(res.user, res.token);
        showToast('Customer login successful.', 'success');
        navigate('/customer/home', { replace: true });
      } else {
        setErrorMessage(res.message || 'Invalid OTP. Please check the code and try again.');
      }
    } catch {
      setErrorMessage('A network issue occurred while verifying the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen theme-artisan-bg text-[#2e1b10] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/90 border border-[#eed7c2] rounded-[32px] shadow-[0_30px_80px_rgba(114,63,32,0.12)] p-6 sm:p-8 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#2e1b10]">Customer Login</h1>
          <p className="mt-2 text-sm text-[#735442]">Order from your favorite Khau Katta stalls</p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4a2e1d]">Mobile Number</label>
              <div className="relative">
                <Smartphone size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-[#9c7f6e]" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full rounded-2xl border border-[#e5cdaf] bg-[#faf2e8]/80 py-3 pl-11 pr-4 text-sm text-[#2e1b10] placeholder-[#a08372] focus:border-[#c86228] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
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
                  Send OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 pt-1 text-sm text-[#735442]">
              <span>New here?</span>
              <Link to="/customer/signup" className="font-bold text-[#c86228] hover:text-[#a84e12]">
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#f2d7c0] bg-[#fff7f1] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#c86228]">
                <MessageSquareText size={16} />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Verify OTP</span>
              </div>
              <p className="text-sm text-[#4a2e1d]">
                We sent a 6-digit code to <span className="font-bold">+91 {phone}</span>
              </p>
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

            <div className="flex items-center justify-between rounded-xl bg-[#faf2e8] px-3 py-2 text-xs text-[#735442]">
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-[#c86228]" />
                <span>Code expires in {formatTime(countdown)}</span>
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="font-bold text-[#c86228] disabled:text-[#9c7f6e]"
                disabled={countdown > 110 || loading}
              >
                Resend OTP
              </button>
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
                  Verify & Continue
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e5cdaf] bg-[#fffdfb] px-4 py-2.5 text-sm font-semibold text-[#4a2e1d] transition-colors hover:bg-[#faf2e8]"
            >
              <ArrowLeft size={15} />
              Change mobile number
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-[#f1e1d1] pt-4 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#735442] hover:text-[#c86228]">
            <CheckCircle2 size={15} />
            Choose another portal
          </Link>
        </div>
      </div>
    </div>
  );
};
