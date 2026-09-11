import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!sessionStorage.getItem('khau_katta_pwa_dismissed')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // On mobile web, show lightweight mockable prompt after 3s if not already standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone && !sessionStorage.getItem('khau_katta_pwa_dismissed')) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for iOS / unsupported browsers
      alert('To install Khau Katta:\n1. Tap the Share button\n2. Select "Add to Home Screen"');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    sessionStorage.setItem('khau_katta_pwa_dismissed', 'true');
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#24150b] via-[#3a2012] to-[#24150b] text-[#f8efe4] px-4 py-2.5 shadow-lg border-b border-[#eed7c2]/20 relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c86228] to-[#d97706] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Smartphone size={16} />
          </div>
          <div className="text-xs">
            <p className="font-bold flex items-center gap-1.5 text-white">
              <span>Install Khau Katta App</span>
              <span className="text-[10px] bg-[#c86228]/50 text-[#faebd7] px-2 py-0.5 rounded font-semibold uppercase tracking-wider border border-[#eed7c2]/30">
                PWA
              </span>
            </p>
            <p className="text-[11px] text-[#eed7c2]/80 hidden sm:block">
              Fast, offline-ready mobile ordering from 50+ Belagavi stalls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="text-[#eed7c2]/70 hover:text-white p-1 cursor-pointer transition-colors"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
