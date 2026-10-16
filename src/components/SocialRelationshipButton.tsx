import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  UserCheck,
  UserX,
  HeartHandshake,
  Swords,
  Flame,
  Check,
  Sparkles,
  ChevronDown,
  X,
  HelpCircle,
} from 'lucide-react';
import {
  getRelationship,
  updateRelationship,
  togglePrimaryAction,
  subscribeRelationships,
  RelationshipStatus,
  RelationshipButtonMode,
  normalizeTargetKey,
} from '../lib/relationships';

interface SocialRelationshipButtonProps {
  targetHandle: string;
  targetName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onRequireAuth?: (action: string) => boolean | void;
  showModeHint?: boolean;
}

export const SocialRelationshipButton: React.FC<SocialRelationshipButtonProps> = ({
  targetHandle,
  targetName,
  className = '',
  size = 'sm',
  onRequireAuth,
  showModeHint = false,
}) => {
  const normKey = normalizeTargetKey(targetHandle || targetName || 'user');
  const [record, setRecord] = useState(() => getRelationship(normKey));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didLongPressRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setRecord(getRelationship(normKey));
    const unsubscribe = subscribeRelationships(() => {
      setRecord(getRelationship(normKey));
    });
    return () => unsubscribe();
  }, [normKey]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary click/touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    didLongPressRef.current = false;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const holdDuration = 420; // ms

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / holdDuration) * 100);
      setHoldProgress(progress);
    }, 25);

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setIsHolding(false);
      setHoldProgress(0);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

      // Trigger subtle vibration if mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(40);
        } catch {
          // ignore
        }
      }

      setIsMenuOpen(true);
    }, holdDuration);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handlePointerCancel = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If long press triggered, do not run click toggle
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    if (onRequireAuth) {
      const allowed = onRequireAuth('follow or interact with creators');
      if (allowed === false) return;
    }

    togglePrimaryAction(normKey, targetName, targetHandle);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Support right-click on desktop to open relationship menu directly
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  const selectRelationship = async (
    status: RelationshipStatus,
    mode?: RelationshipButtonMode,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (onRequireAuth) {
      const allowed = onRequireAuth('update relationship status');
      if (allowed === false) return;
    }
    await updateRelationship(normKey, {
      status,
      mode: mode || (status === 'none' ? record.mode : (status as RelationshipButtonMode)),
      targetName,
      targetHandle,
    });
    setIsMenuOpen(false);
  };

  const switchButtonModeOnly = async (mode: RelationshipButtonMode, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateRelationship(normKey, {
      mode,
      targetName,
      targetHandle,
    });
  };

  const currentStatus = record.status;
  const currentMode = record.mode || 'follow';

  // Render button content depending on status and mode
  let buttonLabel = 'Follow';
  let buttonBg = 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs';
  let IconComponent = UserPlus;

  if (currentStatus === 'following') {
    IconComponent = isHovered ? UserX : UserCheck;
    buttonLabel = isHovered ? 'Unfollow' : 'Following';
    buttonBg = isHovered
      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
      : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400';
  } else if (currentStatus === 'friend') {
    IconComponent = isHovered ? UserX : HeartHandshake;
    buttonLabel = isHovered ? 'Remove Friend' : 'Friends';
    buttonBg = isHovered
      ? 'bg-red-50 text-red-600 border border-red-200'
      : 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-black shadow-xs';
  } else if (currentStatus === 'enemy') {
    IconComponent = isHovered ? UserX : Swords;
    buttonLabel = isHovered ? 'Clear Enemy' : 'Enemy';
    buttonBg = isHovered
      ? 'bg-amber-50 text-amber-700 border border-amber-300'
      : 'bg-rose-50 text-rose-700 border border-rose-300 font-black shadow-xs';
  } else {
    // Status is 'none', show based on button mode
    if (currentMode === 'friend') {
      IconComponent = HeartHandshake;
      buttonLabel = 'Add Friend';
      buttonBg = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs';
    } else if (currentMode === 'enemy') {
      IconComponent = Swords;
      buttonLabel = 'Add Enemy';
      buttonBg = 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs';
    } else {
      IconComponent = UserPlus;
      buttonLabel = 'Follow';
      buttonBg = 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs';
    }
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-[11px] h-7'
      : size === 'lg'
      ? 'px-4 py-2 text-sm h-10'
      : 'px-3 py-1.5 text-xs h-8';

  return (
    <div className="relative inline-block select-none" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerUp}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click to toggle • Long press to switch to Add Friend / Add Enemy"
        aria-label={`${buttonLabel} ${targetHandle}`}
        className={`relative group font-black rounded-full transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95 overflow-hidden ${sizeClasses} ${buttonBg} ${className}`}
      >
        {/* Subtle hold progress ring/bar overlay */}
        {isHolding && (
          <span
            className="absolute inset-0 bg-white/30 pointer-events-none transition-all duration-75 origin-left"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        <IconComponent
          className={`shrink-0 transition-transform ${
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'
          } ${isHolding ? 'scale-110' : ''}`}
        />

        <span className="truncate">{buttonLabel}</span>

        {/* Small hold indicator dot */}
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-40 group-hover:opacity-80 transition-opacity ml-0.5"
          title="Long press for Friend / Enemy"
        />
      </button>

      {/* Optional Mode hint underneath for desktop discovery */}
      {showModeHint && (
        <span className="block text-[9.5px] text-slate-400 font-medium mt-0.5 text-center">
          Hold for options
        </span>
      )}

      {/* Relationship Selection Popup Modal */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-2xl p-4.5 space-y-4 text-slate-900 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                  {targetName ? targetName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    {targetName || targetHandle}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500">{targetHandle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick explanation banner */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Social Relationship Options</span>
                <p className="text-purple-700 text-[10.5px] mt-0.5 leading-snug">
                  Choose how you connect with this creator. You can switch to standard Following, Add as Friend, or Add as Enemy.
                </p>
              </div>
            </div>

            {/* 3 Main Relationship Actions */}
            <div className="space-y-2">
              {/* Option 1: Standard Follow (Twitter / Instagram) */}
              <div
                onClick={(e) =>
                  selectRelationship(
                    currentStatus === 'following' ? 'none' : 'following',
                    'follow',
                    e
                  )
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentStatus === 'following'
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      currentStatus === 'following'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Follow</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                        Twitter/Insta
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 truncate">
                      Get updates & see posts in your main feed
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {currentStatus === 'following' ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Following
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-purple-600 hover:underline">
                      Follow
                    </span>
                  )}
                </div>
              </div>

              {/* Option 2: Add Friend / Friends */}
              <div
                onClick={(e) =>
                  selectRelationship(
                    currentStatus === 'friend' ? 'none' : 'friend',
                    'friend',
                    e
                  )
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentStatus === 'friend'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      currentStatus === 'friend'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-emerald-950">Add Friend</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Mutual Circle
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 truncate">
                      Mark as friendly contact & direct chat
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {currentStatus === 'friend' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Friends
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 hover:underline">
                      Add Friend
                    </span>
                  )}
                </div>
              </div>

              {/* Option 3: Add Enemy / Enemy */}
              <div
                onClick={(e) =>
                  selectRelationship(
                    currentStatus === 'enemy' ? 'none' : 'enemy',
                    'enemy',
                    e
                  )
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentStatus === 'enemy'
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      currentStatus === 'enemy'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    <Swords className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-rose-950">Add Enemy</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-semibold">
                        Faceoff Rival
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 truncate">
                      Highlight faceoff battle rivalry & challenge
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {currentStatus === 'enemy' ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Enemy
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-600 hover:underline">
                      Add Enemy
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Switch Primary Button Display Mode */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Switch button appearance:</span>
                <span className="text-slate-400 font-normal">Active: {currentMode}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={(e) => switchButtonModeOnly('follow', e)}
                  className={`py-1.5 px-2 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center justify-center gap-1 ${
                    currentMode === 'follow'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3 h-3" /> Follow
                </button>
                <button
                  type="button"
                  onClick={(e) => switchButtonModeOnly('friend', e)}
                  className={`py-1.5 px-2 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center justify-center gap-1 ${
                    currentMode === 'friend'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HeartHandshake className="w-3 h-3" /> Friend
                </button>
                <button
                  type="button"
                  onClick={(e) => switchButtonModeOnly('enemy', e)}
                  className={`py-1.5 px-2 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center justify-center gap-1 ${
                    currentMode === 'enemy'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Swords className="w-3 h-3" /> Enemy
                </button>
              </div>
            </div>

            {/* Bottom Actions: Clear / Done */}
            <div className="flex items-center justify-between pt-1">
              {currentStatus !== 'none' ? (
                <button
                  type="button"
                  onClick={(e) => selectRelationship('none', record.mode, e)}
                  className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Reset Relationship
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
