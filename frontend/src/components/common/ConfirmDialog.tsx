import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#fff8f2] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#f0bd9b] text-center space-y-4">
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
            isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-[#fff0e2] text-[#b85018]'
          }`}
        >
          <AlertTriangle size={24} />
        </div>

        <div>
          <h3 className="font-serif text-base font-bold text-[#3c1e0a]">{title}</h3>
          <p className="text-xs text-[#7c4d2e] mt-1 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#fff0e2] hover:bg-[#ffe6d1] text-[#7c4d2e] font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-[#f0bd9b]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer ${
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#b85018] hover:bg-[#963e0e]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
