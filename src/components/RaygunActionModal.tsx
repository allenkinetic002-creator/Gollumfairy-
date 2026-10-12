import React from 'react';
import { X } from 'lucide-react';

export interface RaygunActionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  targetPersonName: string;
  targetPersonAvatar?: string;
  onSelectVerb: () => void;
  onSelectAdverb: () => void;
  isInline?: boolean;
  className?: string;
}

/**
 * Very small card popping up on clicking Raygun icon with "Verb" and "Adverb".
 * Supports inline rendering directly on post without modal backdrop.
 */
export const RaygunActionModal: React.FC<RaygunActionModalProps> = ({
  isOpen = true,
  onClose,
  targetPersonName,
  onSelectVerb,
  onSelectAdverb,
  isInline = false,
  className = '',
}) => {
  if (!isOpen) return null;

  const card = (
    <div
      className={
        isInline
          ? `w-full max-w-[280px] bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3 relative select-none animate-in fade-in duration-150 ${className}`
          : `w-[230px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 relative select-none animate-in zoom-in-95 duration-150 ${className}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Small Header */}
      <div className="text-center mb-2.5 pr-4 pl-1">
        <div className="text-[12px] font-black text-slate-900 leading-tight truncate">
          {targetPersonName}
        </div>
        <div className="text-[10px] font-semibold text-slate-400">
          Choose Action
        </div>
      </div>

      {/* Action Buttons: Verb & Adverb */}
      <div className="flex flex-col gap-2">
        {/* Verb Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectVerb();
          }}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 border border-slate-200 hover:border-amber-300 text-slate-900 font-black text-[13px] tracking-tight transition-all cursor-pointer active:scale-95 flex items-center justify-between"
        >
          <span>Verb</span>
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide">
            Past
          </span>
        </button>

        {/* Adverb Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectAdverb();
          }}
          className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-[13px] tracking-tight shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-between"
        >
          <span>Adverb</span>
          <span className="text-[9.5px] font-bold text-purple-200 uppercase tracking-wide">
            Challenge
          </span>
        </button>
      </div>
    </div>
  );

  if (isInline) {
    return card;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      {card}
    </div>
  );
};
