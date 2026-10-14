import React, { useState, useRef, useEffect } from 'react';
import { X, Star, Info, ChevronDown, CheckCircle2, ChevronLeft, ChevronRight, Edit3, RotateCcw, Lock } from 'lucide-react';
import { syncActivityToRepo } from '../lib/repoSync';

export interface InfluenceRatingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
  className?: string;
  onOpenStarStamps?: () => void;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
  targetName?: string;
}

export function InfluenceRatingModal({
  isOpen = true,
  onClose,
  isInline = false,
  className = '',
  onOpenStarStamps,
  initialRating = 8.9,
  onRatingSubmit,
  targetName,
}: InfluenceRatingModalProps) {
  const finalizedStorageKey = `fairy_influence_finalized_${targetName || 'default'}`;

  // Check if user previously finalized rating for this item
  const [isFinalized, setIsFinalized] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(finalizedStorageKey));
    } catch {}
    return false;
  });

  const [rating, setRating] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(finalizedStorageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed;
      }
    } catch {}
    return initialRating;
  });

  const [typedValue, setTypedValue] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(finalizedStorageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed.toFixed(1);
      }
    } catch {}
    return initialRating.toFixed(1);
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [activeFace, setActiveFace] = useState<number>(4);

  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  // Generate full range of numbers from 1.0 to 10.0 in 0.1 increments (91 values)
  const allRatingNumbers: number[] = React.useMemo(() => {
    const list: number[] = [];
    for (let i = 10; i <= 100; i++) {
      list.push(parseFloat((i / 10).toFixed(1)));
    }
    return list;
  }, []);

  const updateFaceForRating = (val: number) => {
    if (val >= 8.8) setActiveFace(4);
    else if (val >= 8.6) setActiveFace(3);
    else if (val >= 8.0) setActiveFace(2);
    else if (val >= 7.0) setActiveFace(1);
    else setActiveFace(0);
  };

  useEffect(() => {
    updateFaceForRating(rating);
  }, [rating]);

  const handleSelectRating = (val: number, scrollIntoView = false) => {
    if (isFinalized) {
      setSubmittedMessage('Rating is final! Click "Reset Rating & Rate Again" below to change it.');
      setTimeout(() => setSubmittedMessage(null), 3000);
      return;
    }

    const clamped = Math.max(0, Math.min(10, parseFloat(val.toFixed(1))));
    setRating(clamped);
    setTypedValue(clamped.toFixed(1));
    updateFaceForRating(clamped);

    if (scrollIntoView && scrollTrackRef.current) {
      const activeEl = scrollTrackRef.current.querySelector(`[data-rating="${clamped.toFixed(1)}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handleTypedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinalized) return;
    const raw = e.target.value;
    setTypedValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      const clamped = Math.max(0, Math.min(10, num));
      setRating(clamped);
      updateFaceForRating(clamped);

      if (scrollTrackRef.current) {
        const roundedKey = (Math.round(clamped * 10) / 10).toFixed(1);
        const activeEl = scrollTrackRef.current.querySelector(`[data-rating="${roundedKey}"]`) as HTMLElement;
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  };

  const handleSelectFace = (faceIndex: number) => {
    if (isFinalized) return;
    setActiveFace(faceIndex);
    let targetVal = 8.9;
    if (faceIndex === 4) targetVal = 8.9;
    else if (faceIndex === 3) targetVal = 8.7;
    else if (faceIndex === 2) targetVal = 8.5;
    else if (faceIndex === 1) targetVal = 7.2;
    else targetVal = 5.4;

    handleSelectRating(targetVal, true);
  };

  const handleScrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -140, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  // Center selected rating on open
  useEffect(() => {
    if (isOpen && scrollTrackRef.current) {
      setTimeout(() => {
        const activeEl = scrollTrackRef.current?.querySelector(`[data-rating="${rating.toFixed(1)}"]`) as HTMLElement;
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsFinalized(true);
    setSubmittedMessage(`✓ Rating Finalized: ${rating.toFixed(1)} ★`);
    try {
      localStorage.setItem(finalizedStorageKey, rating.toString());
    } catch {}

    onRatingSubmit?.(rating);
    syncActivityToRepo(
      'rate_masked_eyes_final',
      `Finalized rating ${rating.toFixed(1)} on ${targetName || 'post'} via 2 eyes mask`,
      { rating, targetName }
    );

    setTimeout(() => {
      setSubmittedMessage(null);
    }, 3500);
  };

  const handleReset = () => {
    setIsFinalized(false);
    try {
      localStorage.removeItem(finalizedStorageKey);
    } catch {}

    setSubmittedMessage('Rating reset! You can now choose or type a new number.');
    setTimeout(() => {
      setSubmittedMessage(null);
    }, 3000);

    syncActivityToRepo(
      'reset_masked_eyes_rating',
      `Reset rating on ${targetName || 'post'} via 2 eyes mask`,
      { targetName }
    );
  };

  const cardContent = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        isInline
          ? `w-full max-w-[440px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in duration-150 select-none ${className}`
          : `w-[94%] sm:w-full max-w-[420px] bg-white rounded-[24px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] ${className}`
      }
    >
      {/* Header bar with close button */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0 border-b border-slate-100/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Fairy Influence Rating & Metrics
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
              <span className="text-[24px] sm:text-[26px] font-black text-slate-900 leading-none tracking-tight">
                {rating.toFixed(1)}
              </span>
              <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400 -mt-0.5" />
              <span className="text-[13px] sm:text-[14px] font-black text-[#15803D] leading-none">
                {rating >= 8.8 ? 'Very good' : rating >= 8.6 ? 'Good' : rating >= 8.0 ? 'Fair' : rating >= 7.0 ? 'Poor' : 'Fail'}
              </span>
            </div>
            <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 mt-1.5 leading-tight">
              Overall ratings {targetName ? `for ${targetName}` : ''}
            </h4>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
              1.3M verified rating submissions
            </p>
          </div>

          {/* Right: Completion rates */}
          <div className="text-left pl-3 border-l border-slate-200/70">
            <span className="text-[22px] sm:text-[24px] font-black text-slate-900 leading-none tracking-tight">
              97%
            </span>
            <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 mt-1.5 leading-tight flex items-center gap-1">
              <span>Completion</span>
              <Info className="w-3 h-3 text-slate-400" />
            </h4>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
              400K check-ins
            </p>
          </div>
        </div>

        {/* Finalized Banner if submitted */}
        {isFinalized && (
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <Lock className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Rating is Final ({rating.toFixed(1)} ★)</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-800 text-[10.5px] font-black border border-purple-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Reset your rating and submit a new one"
            >
              <RotateCcw className="w-3 h-3 text-purple-600" />
              <span>Reset & Rate Again</span>
            </button>
          </div>
        )}

        {/* Status Toast Message */}
        {submittedMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Row of 5 Emotional Faces */}
        <div className="flex items-center justify-between px-1 pt-0.5">
          {/* 1. Red Fail */}
          <button
            type="button"
            onClick={() => handleSelectFace(0)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 0 ? 'ring-2.5 ring-rose-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Fail"
          >
            <svg className="w-8 h-8 sm:w-8.5 sm:h-8.5" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke="#E11D48" strokeWidth="2.4" fill="#FFF1F2" />
              <line x1="14" y1="15" x2="18" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="18" y1="15" x2="14" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="26" y1="15" x2="30" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="30" y1="15" x2="26" y2="19" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M15 28 C17.5 25.5, 20.5 29.5, 23 27 C25.5 24.5, 28.5 28.5, 29 27" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 2. Orange Poor */}
          <button
            type="button"
            onClick={() => handleSelectFace(1)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 1 ? 'ring-2.5 ring-orange-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Poor"
          >
            <svg className="w-8 h-8 sm:w-8.5 sm:h-8.5" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke="#EA580C" strokeWidth="2.4" fill="#FFF7ED" />
              <circle cx="16" cy="18" r="2.2" fill="#EA580C" />
              <circle cx="28" cy="18" r="2.2" fill="#EA580C" />
              <path d="M15 29 C18 24.5, 26 24.5, 29 29" stroke="#EA580C" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 3. Yellow Fair */}
          <button
            type="button"
            onClick={() => handleSelectFace(2)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 2 ? 'ring-2.5 ring-amber-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Fair"
          >
            <svg className="w-8 h-8 sm:w-8.5 sm:h-8.5" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke="#CA8A04" strokeWidth="2.4" fill="#FEFCE8" />
              <circle cx="16" cy="18" r="2.2" fill="#CA8A04" />
              <circle cx="28" cy="18" r="2.2" fill="#CA8A04" />
              <line x1="16" y1="27.5" x2="28" y2="27.5" stroke="#CA8A04" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* 4. Light Green Good */}
          <button
            type="button"
            onClick={() => handleSelectFace(3)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 3 ? 'ring-2.5 ring-emerald-400 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Good"
          >
            <svg className="w-8 h-8 sm:w-8.5 sm:h-8.5" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke="#16A34A" strokeWidth="2.4" fill="#F0FDF4" />
              <circle cx="16" cy="18" r="2.2" fill="#16A34A" />
              <circle cx="28" cy="18" r="2.2" fill="#16A34A" />
              <path d="M15 25.5 C17.5 30.5, 26.5 30.5, 29 25.5" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* 5. Rich Green Very Good */}
          <button
            type="button"
            onClick={() => handleSelectFace(4)}
            className={`transition-all active:scale-95 cursor-pointer rounded-full p-0.5 ${
              activeFace === 4 ? 'ring-2.5 ring-emerald-600 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
            } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Very good"
          >
            <svg className="w-8 h-8 sm:w-8.5 sm:h-8.5" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke="#059669" strokeWidth="2.4" fill="#ECFDF5" />
              <path d="M13.5 18 C15.2 15, 18.8 15, 20.5 18" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M23.5 18 C25.2 15, 28.8 15, 30.5 18" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <circle cx="12" cy="21.5" r="2" fill="#34D399" fillOpacity="0.45" />
              <circle cx="32" cy="21.5" r="2" fill="#34D399" fillOpacity="0.45" />
              <path d="M14.5 24 C14.5 31.5, 29.5 31.5, 29.5 24 C27.5 25.2, 16.5 25.2, 14.5 24 Z" fill="#059669" />
              <path d="M16.5 24.8 C19 26, 25 26, 27.5 24.8 C26.2 25.6, 17.8 25.6, 16.5 24.8 Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>

        {/* Color Rating Progress Bar */}
        <div className="space-y-1 pt-0.5">
          <div className="w-full h-1.5 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-[#E11D48]" />
            <div className="flex-1 bg-[#EA580C]" />
            <div className="flex-1 bg-[#EAB308]" />
            <div className="flex-1 bg-[#22C55E]" />
            <div className="flex-1 bg-[#059669]" />
          </div>

          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-0.5">
            <span className="text-[#E11D48]">- Fail</span>
            <span className="text-[#EA580C]">Poor</span>
            <span className="text-[#CA8A04]">Fair</span>
            <span className="text-[#16A34A]">Good</span>
            <span className="text-[#059669]">Very good +</span>
          </div>
        </div>

        {/* NUMERIC ENTRY SECTION: TYPE OR SCROLL SIDEWAYS */}
        <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2.5">
          {/* Header row with Type input box */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div>
                <label htmlFor="rating-direct-input" className="text-[11.5px] font-black text-slate-900 leading-tight block">
                  Type Number to Rate:
                </label>
                <span className="text-[9.5px] text-slate-500">
                  {isFinalized ? 'Rating is final & locked in' : 'Type any number (0.0 – 10.0) or scroll sideways below'}
                </span>
              </div>
            </div>

            {/* Direct Number Input */}
            <div className="relative shrink-0 flex items-center">
              <input
                id="rating-direct-input"
                type="number"
                min="0"
                max="10"
                step="0.1"
                disabled={isFinalized}
                value={typedValue}
                onChange={handleTypedInputChange}
                onBlur={() => {
                  const num = parseFloat(typedValue);
                  if (isNaN(num)) {
                    setTypedValue(rating.toFixed(1));
                  } else {
                    const clamped = Math.max(0, Math.min(10, num));
                    setRating(clamped);
                    setTypedValue(clamped.toFixed(1));
                  }
                }}
                className={`w-20 px-2 py-1.5 bg-white border-2 text-center text-sm rounded-xl shadow-xs tabular-nums font-black ${
                  isFinalized
                    ? 'border-purple-300 text-purple-900 bg-purple-50/60 cursor-not-allowed'
                    : 'border-indigo-500 text-indigo-950 focus:ring-2 focus:ring-indigo-400 focus:outline-none'
                }`}
                placeholder="8.9"
              />
              <span className="ml-1 text-[11px] font-black text-amber-500">★</span>
            </div>
          </div>

          {/* Quick Preset Jumps */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 overflow-x-auto pb-0.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0 mr-0.5">Presets:</span>
            {[
              { label: '5.0', val: 5.0 },
              { label: '7.5', val: 7.5 },
              { label: '8.5', val: 8.5 },
              { label: '8.8', val: 8.8 },
              { label: '8.9', val: 8.9 },
              { label: '9.0', val: 9.0 },
              { label: '9.5', val: 9.5 },
              { label: '10.0', val: 10.0 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                disabled={isFinalized}
                onClick={() => handleSelectRating(p.val, true)}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                  Math.abs(rating - p.val) < 0.05
                    ? 'bg-indigo-600 text-white font-extrabold'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                } ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sideways Scrollable Numbers Strip with Left/Right Arrow Controls */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1 px-0.5">
              <span>Scroll sideways &larr; &rarr;</span>
              <span className="font-mono text-indigo-700 font-extrabold">
                {isFinalized ? `Final: ${rating.toFixed(1)} / 10.0` : `Selected: ${rating.toFixed(1)} / 10.0`}
              </span>
            </div>

            <div className="relative flex items-center">
              {/* Left Scroll Arrow */}
              <button
                type="button"
                onClick={handleScrollLeft}
                aria-label="Scroll left"
                className="w-6 h-9 rounded-l-lg bg-slate-200/90 hover:bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 z-10 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Horizontal Scroll Track */}
              <div
                ref={scrollTrackRef}
                tabIndex={0}
                aria-label="Sideways scrollable rating numbers"
                className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-white border-y border-slate-200 scrollbar-thin scroll-smooth select-none focus:outline-none"
                style={{ scrollbarWidth: 'thin' }}
              >
                {allRatingNumbers.map((val) => {
                  const isSelected = Math.abs(rating - val) < 0.05;
                  return (
                    <button
                      key={val}
                      data-rating={val.toFixed(1)}
                      type="button"
                      disabled={isFinalized}
                      onClick={() => handleSelectRating(val)}
                      className={`min-w-[44px] h-8 rounded-lg text-center font-black text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#16A34A] text-white shadow-md scale-105 ring-2 ring-emerald-400'
                          : 'bg-[#F1F5F9] text-slate-800 hover:bg-slate-200'
                      } ${isFinalized && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {val.toFixed(1)}
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Arrow */}
              <button
                type="button"
                onClick={handleScrollRight}
                aria-label="Scroll right"
                className="w-6 h-9 rounded-r-lg bg-slate-200/90 hover:bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 z-10 cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Social Reach Boost Info */}
        <div className="flex items-center justify-between gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="space-y-0.5">
            <p className="font-extrabold text-[12px] sm:text-[12.5px] text-slate-900 leading-tight">
              Max out your social reach.
            </p>
            <p className="font-extrabold text-[12px] sm:text-[12.5px] text-indigo-900 leading-tight">
              500X your presence.
            </p>
            <p className="font-medium text-[10px] text-slate-600 pt-0.5 flex items-center gap-1">
              <span>Only on Fairy where Influence gets real.</span>
              <Info className="w-3 h-3 text-slate-400 shrink-0 inline" />
            </p>
          </div>
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

        {/* Bottom Actions: Submit or Reset Button */}
        <div className="pt-1 flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-600">
            Rating: <span className="font-black text-slate-900">{rating.toFixed(1)}</span>
            {isFinalized && <span className="ml-1 text-[10px] font-bold text-purple-600">(Final)</span>}
          </div>

          <div className="flex items-center gap-2">
            {isFinalized ? (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="Reset this rating to rate again"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                <span>Reset Rating & Rate Again</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 rounded-full bg-[#D900FF] hover:bg-[#C000E0] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Submit Rating</span>
              </button>
            )}
          </div>
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
