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
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#fff8f2] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#f0bd9b] text-center space-y-4">
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
            isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-[#fff0e2] text-[#b85018]'
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fffdfb] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#eed7c2] text-center space-y-4">
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
            isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-[#faebd7] text-[#c86228]'
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          }`}
        >
          <AlertTriangle size={24} />
        </div>

        <div>
<<<<<<< HEAD
          <h3 className="font-serif text-base font-bold text-[#3c1e0a]">{title}</h3>
          <p className="text-xs text-[#7c4d2e] mt-1 leading-relaxed">{message}</p>
=======
          <h3 className="text-base font-bold text-[#2e1b10]">{title}</h3>
          <p className="text-xs text-[#735442] mt-1 leading-relaxed">{message}</p>
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
<<<<<<< HEAD
            className="flex-1 py-2.5 bg-[#fff0e2] hover:bg-[#ffe6d1] text-[#7c4d2e] font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-[#f0bd9b]"
=======
            className="flex-1 py-2.5 bg-[#faebd7]/70 hover:bg-[#faebd7] text-[#735442] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer ${
<<<<<<< HEAD
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#b85018] hover:bg-[#963e0e]'
=======
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#c86228] hover:bg-[#b0521e]'
>>>>>>> 2d5cac8094c8604d7a92822b0517e8194337d80d
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
