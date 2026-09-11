import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendOtp, verifyOtp } from '../../services/api';
import { Phone, Lock, Sparkles, X, ArrowRight, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { KhauKattaLogo } from '../common/KhauKattaLogo';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithOtp } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer for resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean);
      if (res.success) {
        setDevOtp(res.devOtp || null);
        setStep('otp');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        showToast(`OTP sent to +91 ${clean}`, 'success');
      } else {
        setErrorMessage(res.message || 'Failed to send OTP. Try again.');
      }
    } catch {
      setErrorMessage('Network error while sending OTP. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      nextInput?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val.replace(/\D/g, '');
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(phone, fullOtp, name);
      if (res.success && res.token && res.user) {
        loginWithOtp(res.user, res.token);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        closeLoginModal();
      } else {
        setErrorMessage(res.message || 'Incorrect OTP. Please try again.');
      }
    } catch {
      setErrorMessage('Verification failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const fillDevOtp = () => {
    const codeToFill = devOtp || '123456';
    const split = codeToFill.split('');
    setOtp(split);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fffdfb] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-[#eed7c2] relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute right-4 top-4 p-2 text-[#9c7f6e] hover:text-[#2e1b10] rounded-full hover:bg-[#faebd7]/60 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <KhauKattaLogo size="md" withTagline={false} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2e1b10] tracking-tight">
            {step === 'phone' ? 'Login or Sign Up' : 'Verify Mobile OTP'}
          </h2>
          <p className="text-xs text-[#735442] mt-1">
            {step === 'phone'
              ? 'Access 50+ Belagavi stalls, saved addresses & orders'
              : `Enter the 6-digit code sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
          </p>
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER INPUT */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
                Indian Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1 text-xs font-bold text-[#735442] border-r border-[#eed7c2] pr-2 pointer-events-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  autoFocus
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="98450 12345"
                  maxLength={14}
                  className="w-full pl-20 pr-4 py-3 bg-[#fdf8f3] rounded-2xl text-sm font-semibold text-[#2e1b10] border border-[#eed7c2] focus:border-[#c86228] focus:bg-[#fffdfb] focus:outline-none transition-all placeholder:text-[#9c7f6e]/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2e1b10] mb-1.5">
                Your Full Name <span className="text-[#9c7f6e] font-normal">(optional for new users)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Pooja Kulkarni"
                className="w-full px-4 py-3 bg-[#fdf8f3] rounded-2xl text-sm font-semibold text-[#2e1b10] border border-[#eed7c2] focus:border-[#c86228] focus:bg-[#fffdfb] focus:outline-none transition-all placeholder:text-[#9c7f6e]/70"
              />
            </div>

            {/* Dev Demo Quick Fill */}
            <div className="p-3 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442]">
              <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider mb-1 text-[#93370d]">
                <Sparkles size={12} className="text-[#c86228]" /> Test Demo Account
              </span>
              <button
                type="button"
                onClick={() => {
                  setPhone('9845012345');
                  setName('Pooja Kulkarni');
                }}
                className="text-[11px] underline font-semibold text-[#c86228] hover:text-[#93370d] cursor-pointer"
              >
                Use Pooja Kulkarni (98450 12345) — Has delivered orders ready for review!
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  <span>Sending 6-Digit OTP...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#2e1b10] text-center mb-3">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-black text-xl text-[#2e1b10] bg-[#fdf8f3] border-2 border-[#eed7c2] focus:border-[#c86228] focus:bg-[#fffdfb] rounded-2xl focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Safe Development OTP Mechanism */}
            <div className="p-3 bg-[#fdf8f3] rounded-2xl border border-[#eed7c2] text-xs text-[#735442] text-center space-y-1">
              <p className="font-bold flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider text-[#93370d]">
                <Sparkles size={13} className="text-[#c86228]" /> Safe Development Mode OTP
              </p>
              <p className="text-[11px] text-[#735442]">
                Active OTP: <strong className="font-mono text-[#2e1b10] bg-[#fffdfb] px-2 py-0.5 rounded-lg border border-[#eed7c2]">{devOtp || '123456'}</strong>
              </p>
              <button
                type="button"
                onClick={fillDevOtp}
                className="mt-1 text-[11px] font-bold text-[#c86228] hover:text-[#93370d] underline cursor-pointer"
              >
                Auto-fill &ldquo;{devOtp || '123456'}&rdquo;
              </button>
            </div>

            {/* Countdown & Resend */}
            <div className="flex items-center justify-between text-xs text-[#735442] pt-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[#735442] hover:text-[#2e1b10] underline font-medium cursor-pointer"
              >
                Change Number
              </button>

              <div>
                {countdown > 0 ? (
                  <span className="font-medium text-[#9c7f6e]">
                    Resend in <strong className="text-[#2e1b10]">{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="font-bold text-[#c86228] hover:text-[#93370d] cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verify &amp; Continue</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
