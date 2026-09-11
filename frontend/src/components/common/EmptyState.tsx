import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionPath,
  onActionClick
}) => {
  return (
    <div className="bg-[#fffdfb]/95 rounded-3xl p-10 border border-[#eed7c2] text-center max-w-md mx-auto space-y-4 shadow-xs backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#faebd7] text-[#c86228] mx-auto flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-[#2e1b10]">{title}</h3>
        <p className="text-xs text-[#735442] mt-1 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {(actionText && actionPath) && (
        <Link
          to={actionPath}
          className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          {actionText}
        </Link>
      )}

      {(actionText && onActionClick && !actionPath) && (
        <button
          onClick={onActionClick}
          className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#c86228] to-[#d97706] hover:from-[#b0521e] hover:to-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
