import React, { useState } from 'react';
import { X, Star, Info, ChevronDown, CheckCircle2 } from 'lucide-react';

export interface InfluenceRatingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
  className?: string;
  onOpenStarStamps?: () => void;
}

export function InfluenceRatingModal({
  isOpen = true,
  onClose,
  isInline = false,
  className = '',
  onOpenStarStamps,
}: InfluenceRatingModalProps) {
  // Selected rating (default 8.9 as in screenshot)
  const [rating, setRating] = useState<number>(8.9);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeFace, setActiveFace] = useState<number>(4); // 0: Fail, 1: Poor, 2: Fair, 3: Good, 4: Very good

  if (!isOpen) return null;

  const ratingOptions = [8.5, 8.6, 8.7, 8.8, 8.9, 9.0];

  const handleSelectRating = (val: number) => {
    setRating(val);
    if (val >= 8.9) setActiveFace(4);
    else if (val >= 8.7) setActiveFace(3);
    else if (val >= 8.5) setActiveFace(2);
    else if (val >= 7.0) setActiveFace(1);
    else setActiveFace(0);
  };

  const handleSelectFace = (faceIndex: number) => {
    setActiveFace(faceIndex);
    if (faceIndex === 4) setRating(8.9);
    else if (faceIndex === 3) setRating(8.7);
    else if (faceIndex === 2) setRating(8.5);
    else if (faceIndex === 1) setRating(7.2);
    else setRating(5.4);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose?.();
    }, 1400);
  };

  const cardContent = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        isInline
          ? `w-full max-w-[420px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in duration-150 select-none ${className}`
          : `w-[94%] sm:w-full max-w-[380px] bg-white rounded-[24px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[88vh] ${className}`
      }
    >
      {/* Header bar with close button */}
      <div className="px-4 pt-3 pb-1.5 flex items-center justify-between shrink-0 border-b border-slate-100/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
            Fairy Influence Metrics
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-4 pt-2.5 overflow-y-auto space-y-3.5 overscroll-contain">
        {/* Top Blue-tinted Overall Ratings & Completion Rates Card */}
        <div className="bg-[#EEF3FD] rounded-[18px] p-3 sm:p-3.5 flex items-start justify-between shadow-xs border border-[#E0E9FA]">
          {/* Left: Overall ratings */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[22px] sm:text-[24px] font-black text-slate-900 leading-none tracking-tight">
                {rating.toFixed(1)}
              </span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 -mt-0.5" />
              <span className="text-[13px] sm:text-[14px] font-black text-[#15803D] leading-none">
                {rating >= 8.8 ? 'Very good' : rating >= 8.6 ? 'Good' : rating >= 8.0 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 mt-1.5 leading-tight">
              Overall ratings
            </h4>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
              1.3M ratings
            </p>
          </div>

          {/* Right: Completion rates */}
          <div className="text-left pl-3 border-l border-slate-200/70">
            <span className="text-[22px] sm:text-[24px] font-black text-slate-900 leading-none tracking-tight">
              97%
            </span>
            <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 mt-1.5 leading-tight flex items-center gap-1">
              <span>Completion rates</span>
              <Info className="w-3 h-3 text-slate-400" />
            </h4>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
              400K check-ins
            </p>
          </div>
        </div>

        {/* Row of 5 Emotional Faces (Smooth, high-def vector graphics - zero pixelation) */}
        <div className="flex items-center justify-between px-1 pt-0.5">
          {/* 1. Red Fail (Smooth X eyes, wavy mouth) */}
          <button
            type="button"
            onClick={() => handleSelectFace(0)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 0 ? 'ring-2.5 ring-rose-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            }`}
            title="Fail"
          >
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 44 44"
              fill="none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <circle cx="22" cy="22" r="19" stroke="#E11D48" strokeWidth="2.4" fill="#FFF1F2" />
              {/* Left X eye */}
              <line x1="14" y1="15" x2="18" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="18" y1="15" x2="14" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              {/* Right X eye */}
              <line x1="26" y1="15" x2="30" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="30" y1="15" x2="26" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              {/* Smooth squiggly mouth */}
              <path d="M15 28 C17.5 25.5, 20.5 29.5, 23 27 C25.5 24.5, 28.5 28.5, 29 27" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 2. Orange Poor (Smooth sad frown) */}
          <button
            type="button"
            onClick={() => handleSelectFace(1)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 1 ? 'ring-2.5 ring-orange-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            }`}
            title="Poor"
          >
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 44 44"
              fill="none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <circle cx="22" cy="22" r="19" stroke="#EA580C" strokeWidth="2.4" fill="#FFF7ED" />
              <circle cx="16" cy="18" r="2.2" fill="#EA580C" />
              <circle cx="28" cy="18" r="2.2" fill="#EA580C" />
              <path d="M15 29 C18 24.5, 26 24.5, 29 29" stroke="#EA580C" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 3. Yellow Fair (Smooth straight mouth) */}
          <button
            type="button"
            onClick={() => handleSelectFace(2)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 2 ? 'ring-2.5 ring-amber-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            }`}
            title="Fair"
          >
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 44 44"
              fill="none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <circle cx="22" cy="22" r="19" stroke="#CA8A04" strokeWidth="2.4" fill="#FEFCE8" />
              <circle cx="16" cy="18" r="2.2" fill="#CA8A04" />
              <circle cx="28" cy="18" r="2.2" fill="#CA8A04" />
              <line x1="16" y1="27.5" x2="28" y2="27.5" stroke="#CA8A04" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* 4. Light Green Good (Smooth crisp smiling face) */}
          <button
            type="button"
            onClick={() => handleSelectFace(3)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 3 ? 'ring-2.5 ring-emerald-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            }`}
            title="Good"
          >
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 44 44"
              fill="none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <circle cx="22" cy="22" r="19" stroke="#16A34A" strokeWidth="2.4" fill="#F0FDF4" />
              <circle cx="16" cy="18" r="2.2" fill="#16A34A" />
              <circle cx="28" cy="18" r="2.2" fill="#16A34A" />
              <path d="M15 25.5 C17.5 30.5, 26.5 30.5, 29 25.5" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 5. Rich Green Very Good (Smooth curved eyes, joyful anti-aliased smile) */}
          <button
            type="button"
            onClick={() => handleSelectFace(4)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 4 ? 'ring-2.5 ring-emerald-600 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            }`}
            title="Very good"
          >
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 44 44"
              fill="none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              {/* Crisp smooth circle with soft mint fill */}
              <circle cx="22" cy="22" r="19" stroke="#059669" strokeWidth="2.4" fill="#ECFDF5" />
              {/* Smooth joyful arc eyes with round caps */}
              <path d="M13.5 18 C15.2 15, 18.8 15, 20.5 18" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M23.5 18 C25.2 15, 28.8 15, 30.5 18" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              {/* Soft blush cheeks */}
              <circle cx="12" cy="21.5" r="2" fill="#34D399" fillOpacity="0.45" />
              <circle cx="32" cy="21.5" r="2" fill="#34D399" fillOpacity="0.45" />
              {/* Smooth open joyful smile */}
              <path
                d="M14.5 24 C14.5 31.5, 29.5 31.5, 29.5 24 C27.5 25.2, 16.5 25.2, 14.5 24 Z"
                fill="#059669"
              />
              {/* Teeth glint */}
              <path
                d="M16.5 24.8 C19 26, 25 26, 27.5 24.8 C26.2 25.6, 17.8 25.6, 16.5 24.8 Z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
        </div>

        {/* Color Rating Progress Bar & Labels */}
        <div className="space-y-1 pt-0.5">
          {/* Multi-color segment bar */}
          <div className="w-full h-1.5 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-[#E11D48]" />
            <div className="flex-1 bg-[#EA580C]" />
            <div className="flex-1 bg-[#EAB308]" />
            <div className="flex-1 bg-[#22C55E]" />
            <div className="flex-1 bg-[#059669]" />
          </div>

          {/* Labels across zones */}
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-0.5">
            <span className="text-[#E11D48]">- Fail</span>
            <span className="text-[#EA580C]">Poor</span>
            <span className="text-[#CA8A04]">Fair</span>
            <span className="text-[#16A34A]">Good</span>
            <span className="text-[#059669]">Very good +</span>
          </div>

          {/* Ruler with tick marks & selector circle */}
          <div className="relative py-2 flex items-center justify-center">
            {/* Horizontal deep blue line */}
            <div className="w-full h-[4px] bg-[#1E40AF] rounded-full relative flex items-center justify-between px-1.5">
              {/* 12 vertical ticks */}
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-[2.5px] h-3 bg-[#1E40AF] rounded-full shrink-0" />
              ))}

              {/* Circular slider thumb */}
              <div
                className="absolute w-4.5 h-4.5 rounded-full border-[2.5px] border-[#1E40AF] bg-white shadow-md transition-all duration-200 pointer-events-none"
                style={{
                  left: `${Math.min(94, Math.max(4, ((rating - 7.5) / 2) * 100))}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </div>

          {/* Stepper minus & plus row */}
          <div className="flex items-center justify-between px-1 text-slate-400">
            <button
              type="button"
              onClick={() => setRating((prev) => Math.max(7.0, parseFloat((prev - 0.1).toFixed(1))))}
              className="hover:text-slate-800 transition-colors cursor-pointer text-base font-bold leading-none p-0.5"
              title="Decrease rating"
            >
              &minus;
            </button>
            <button
              type="button"
              onClick={() => setRating((prev) => Math.min(10.0, parseFloat((prev + 0.1).toFixed(1))))}
              className="hover:text-slate-800 transition-colors cursor-pointer text-base font-bold leading-none p-0.5"
              title="Increase rating"
            >
              &#43;
            </button>
          </div>
        </div>

        {/* Social Reach Text + High-Definition Smooth Vector Thumbs Up */}
        <div className="flex items-center justify-between pt-0.5 gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="space-y-0.5">
            <p className="font-extrabold text-[12.5px] sm:text-[13px] text-slate-900 leading-tight">
              Max out your social reach.
            </p>
            <p className="font-extrabold text-[12.5px] sm:text-[13px] text-slate-900 leading-tight">
              500X your presence.
            </p>
            <p className="font-medium text-[10.5px] sm:text-[11px] text-slate-600 pt-0.5 flex items-center gap-1">
              <span>Only on Fairy where Influence gets real.</span>
              <Info className="w-3 h-3 text-slate-400 shrink-0 inline" />
            </p>
          </div>

          {/* Ultra-smooth, high-def vector Thumbs Up Hand (no pixelation) */}
          <div className="shrink-0 p-1 bg-white rounded-xl shadow-2xs border border-slate-200/60">
            <svg
              className="w-8 h-8 sm:w-8.5 sm:h-8.5"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              {/* Smooth wrist sleeve / cuff */}
              <rect
                x="3"
                y="13"
                width="5.5"
                height="13.5"
                rx="2.5"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="1.6"
              />
              {/* Smooth modern thumbs-up hand contour */}
              <path
                d="
                  M8.5 14H13.2
                  C14.2 14 15 13.2 15.2 12.2
                  L15.8 8.4
                  C16.1 6.5 17.5 5 19.3 5
                  C20.6 5 21.6 6 21.6 7.3
                  C21.6 9 20.8 11.2 20.2 12.8
                  C20 13.5 20.5 14.2 21.2 14.2
                  H26.2
                  C27.8 14.2 29 15.5 29 17.1
                  C29 17.6 28.8 18.1 28.5 18.5
                  C29 19 29.2 19.7 29.2 20.4
                  C29.2 21 29 21.6 28.6 22
                  C29 22.5 29.1 23.2 29 23.9
                  C28.7 25.5 27.3 26.6 25.7 26.8
                  L19.5 27.2
                  C15.8 27.4 12.2 27 8.5 26.2
                  V14
                  Z
                "
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Smooth finger crease lines */}
              <path
                d="M20.5 17.5H26.2"
                stroke="#0F172A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M20.5 20.8H25.8"
                stroke="#0F172A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M20 24.1H25"
                stroke="#0F172A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Rating Number Selector Chips: 8.5, 8.6, 8.7, 8.8, 8.9, 9.0 */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          {ratingOptions.map((val) => {
            const isSelected = rating === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectRating(val)}
                className={`flex-1 min-w-[42px] py-1.5 rounded-lg text-center font-black text-xs sm:text-[13px] transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#16A34A] text-white shadow-xs scale-102 ring-2 ring-emerald-300'
                    : 'bg-[#F1F5F9] text-slate-800 hover:bg-slate-200'
                }`}
              >
                {val.toFixed(1)}
              </button>
            );
          })}
        </div>

        {/* Expandable Accordion: "Unlock the Rest...." */}
        <div className="pt-0.5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsUnlocked(!isUnlocked)}
            className="w-full flex items-center justify-between py-1 text-slate-900 font-extrabold text-xs sm:text-sm hover:text-purple-700 transition-colors cursor-pointer group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">
              Unlock the Rest....
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${
                isUnlocked ? 'rotate-180 text-purple-600' : ''
              }`}
            />
          </button>

          {isUnlocked && (
            <div className="mt-2 p-3 bg-gradient-to-r from-purple-50/70 to-pink-50/50 rounded-xl border border-purple-200/80 space-y-1.5 text-[11px] animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span>Viral Reach Multiplier:</span>
                <span className="font-mono text-purple-700 font-black">500X Boost</span>
              </div>
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span>Creator Audience Check-in:</span>
                <span className="font-mono text-emerald-700 font-black">Top 3% Global</span>
              </div>
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span>Fairy Verified Checkmark:</span>
                <span className="text-purple-600 font-black">Unlocked with &ge; 8.8</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-0.5 leading-relaxed border-t border-purple-100">
                By submitting with this rating, your posts on Fairy enter prioritized algorithmic distribution across trending vibe coder channels.
              </p>
            </div>
          )}
        </div>

        {/* Star Stamp Link Button */}
        {onOpenStarStamps && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onOpenStarStamps();
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-black text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>★ Open Star Stamps & Verbal Commitments</span>
            </button>
          </div>
        )}

        {/* Bottom Submit Button Row */}
        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted}
            className="px-6 py-2 rounded-full bg-[#D900FF] hover:bg-[#C000E0] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Submitted!</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return cardContent;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {cardContent}
    </div>
  );
}
