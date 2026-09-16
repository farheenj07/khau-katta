import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />;
      default:
        return <Info size={18} className="text-orange-500 flex-shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Fixed Toast Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#24150b]/95 text-[#f8efe4] p-3.5 rounded-2xl shadow-2xl border border-[#eed7c2]/30 flex items-start justify-between gap-3 text-xs animate-slide-up backdrop-blur-md"
          >
            <div className="flex items-start gap-2.5">
              {getIcon(t.type)}
              <span className="leading-snug font-medium text-[#f8efe4]">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#eed7c2]/70 hover:text-white p-0.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
