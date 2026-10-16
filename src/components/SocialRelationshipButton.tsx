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
} from 'lucide-react';
import {
  getRelationship,
  updateRelationship,
  togglePrimaryAction,
  subscribeRelationships,
  RelationshipStatus,
  RelationshipButtonMode,
  normalizeTargetKey,
  isUserSelf,
} from '../lib/relationships';

interface SocialRelationshipButtonProps {
  targetHandle: string;
  targetName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  currentUser?: { handle?: string; name?: string; id?: string; email?: string } | null;
  onRequireAuth?: (action: string) => boolean | void;
  showModeHint?: boolean;
}

export const SocialRelationshipButton: React.FC<SocialRelationshipButtonProps> = ({
  targetHandle,
  targetName,
  className = '',
  size = 'sm',
  currentUser,
  onRequireAuth,
  showModeHint = false,
}) => {
  // Resolve current logged in user to prevent following yourself
  const activeCurrentUser = currentUser !== undefined ? currentUser : (() => {
    try {
      const raw = localStorage.getItem('fairy_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // A logged in user should never see Follow/Friend/Enemy on themselves
  if (activeCurrentUser && (isUserSelf(targetHandle, activeCurrentUser) || isUserSelf(targetName, activeCurrentUser))) {
    return null;
  }

  const normKey = normalizeTargetKey(targetHandle || targetName || 'user');
  const [record, setRecord] = useState(() => getRelationship(normKey));
  const [showQuickBar, setShowQuickBar] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [switchFeedback, setSwitchFeedback] = useState<string | null>(null);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideQuickBarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (autoHideQuickBarTimerRef.current) clearTimeout(autoHideQuickBarTimerRef.current);
    };
  }, []);

  // Click outside listener to dismiss quick-bar without modal
  useEffect(() => {
    if (!showQuickBar) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowQuickBar(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showQuickBar]);

  const showFeedback = (text: string) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setSwitchFeedback(text);
    feedbackTimerRef.current = setTimeout(() => {
      setSwitchFeedback(null);
    }, 1800);
  };

  /**
   * Inline mode cycle on long press (No modal!):
   * follow -> friend -> enemy -> follow
   */
  const handleCycleMode = async () => {
    const currentMode = record.mode || 'follow';
    let nextMode: RelationshipButtonMode = 'follow';

    if (currentMode === 'follow') {
      nextMode = 'friend';
    } else if (currentMode === 'friend') {
      nextMode = 'enemy';
    } else {
      nextMode = 'follow';
    }

    const updated = await updateRelationship(normKey, {
      mode: nextMode,
      targetName,
      targetHandle,
    });
    setRecord(updated);

    const label =
      nextMode === 'friend' ? 'Add Friend' : nextMode === 'enemy' ? 'Add Enemy' : 'Follow';
    showFeedback(`Switched to ${label}`);
    setShowQuickBar(true);

    // Auto-dismiss floating quick bar after 3 seconds
    if (autoHideQuickBarTimerRef.current) clearTimeout(autoHideQuickBarTimerRef.current);
    autoHideQuickBarTimerRef.current = setTimeout(() => {
      setShowQuickBar(false);
    }, 3200);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary click/touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    didLongPressRef.current = false;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const holdDuration = 380; // ms

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / holdDuration) * 100);
      setHoldProgress(progress);
    }, 20);

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setIsHolding(false);
      setHoldProgress(0);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

      // Trigger subtle vibration if mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch {
          // ignore
        }
      }

      // INLINE SWITCH (No modal!)
      handleCycleMode();
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
    // On desktop, right-click can directly switch mode inline
    e.preventDefault();
    e.stopPropagation();
    handleCycleMode();
  };

  const handleQuickBarSelect = async (mode: RelationshipButtonMode, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await updateRelationship(normKey, {
      mode,
      targetName,
      targetHandle,
    });
    setRecord(updated);

    const label = mode === 'friend' ? 'Add Friend' : mode === 'enemy' ? 'Add Enemy' : 'Follow';
    showFeedback(`Switched to ${label}`);

    if (autoHideQuickBarTimerRef.current) clearTimeout(autoHideQuickBarTimerRef.current);
    autoHideQuickBarTimerRef.current = setTimeout(() => {
      setShowQuickBar(false);
    }, 1500);
  };

  const currentStatus = record.status;
  const currentMode = record.mode || 'follow';

  // Render button content depending on status and active mode
  let buttonLabel = 'Follow';
  let buttonBg = 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs';
  let IconComponent = UserPlus;

  if (currentMode === 'friend') {
    if (currentStatus === 'friend') {
      IconComponent = isHovered ? UserX : HeartHandshake;
      buttonLabel = isHovered ? 'Unfriend' : 'Friends';
      buttonBg = isHovered
        ? 'bg-red-50 text-red-600 border border-red-200'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-black shadow-xs';
    } else {
      IconComponent = HeartHandshake;
      buttonLabel = 'Add Friend';
      buttonBg = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs';
    }
  } else if (currentMode === 'enemy') {
    if (currentStatus === 'enemy') {
      IconComponent = isHovered ? UserX : Swords;
      buttonLabel = isHovered ? 'Clear Enemy' : 'Enemy';
      buttonBg = isHovered
        ? 'bg-amber-50 text-amber-700 border border-amber-300'
        : 'bg-rose-50 text-rose-700 border border-rose-300 font-black shadow-xs';
    } else {
      IconComponent = Swords;
      buttonLabel = 'Add Enemy';
      buttonBg = 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs';
    }
  } else {
    // Mode is 'follow' (Twitter / Instagram style)
    if (currentStatus === 'following') {
      IconComponent = isHovered ? UserX : UserCheck;
      buttonLabel = isHovered ? 'Unfollow' : 'Following';
      buttonBg = isHovered
        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400';
    } else {
      IconComponent = UserPlus;
      buttonLabel = 'Follow';
      buttonBg = 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs';
    }
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10.5px] h-6'
      : size === 'lg'
      ? 'px-3 py-1 text-xs h-8'
      : 'px-2.5 py-0.5 text-[11px] h-6.5';

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Non-modal, Inline Mini Floating Reaction Bar (Pops directly above button) */}
      {showQuickBar && (
        <div
          className="absolute -top-8.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 p-0.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200 shadow-md animate-in fade-in zoom-in-90 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Follow Pill */}
          <button
            type="button"
            onClick={(e) => handleQuickBarSelect('follow', e)}
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              currentMode === 'follow'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
            }`}
            title="Follow mode"
          >
            <UserPlus className="w-2.5 h-2.5" />
            <span>Follow</span>
          </button>

          {/* Add Friend Pill */}
          <button
            type="button"
            onClick={(e) => handleQuickBarSelect('friend', e)}
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              currentMode === 'friend'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
            title="Add Friend mode"
          >
            <HeartHandshake className="w-2.5 h-2.5" />
            <span>Friend</span>
          </button>

          {/* Add Enemy Pill */}
          <button
            type="button"
            onClick={(e) => handleQuickBarSelect('enemy', e)}
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              currentMode === 'enemy'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
            title="Add Enemy mode"
          >
            <Swords className="w-2.5 h-2.5" />
            <span>Enemy</span>
          </button>
        </div>
      )}

      {/* Floating feedback toast badge (Non-modal) */}
      {switchFeedback && !showQuickBar && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-150">
          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/90 text-white text-[9px] font-extrabold shadow-md flex items-center gap-1">
            <Sparkles className="w-2 h-2 text-amber-300" />
            {switchFeedback}
          </span>
        </div>
      )}

      {/* Main Interactive Button */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerUp}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Tap to toggle &bull; Long-press to switch between Follow, Add Friend & Add Enemy"
        aria-label={`${buttonLabel} ${targetHandle}`}
        className={`relative group font-black rounded-full transition-all duration-150 flex items-center gap-1 cursor-pointer active:scale-95 overflow-hidden ${sizeClasses} ${buttonBg} ${className}`}
      >
        {/* Subtle hold progress ring/bar overlay */}
        {isHolding && (
          <span
            className="absolute inset-0 bg-white/35 pointer-events-none transition-all duration-75 origin-left"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        <IconComponent
          className={`shrink-0 transition-transform ${
            size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'
          } ${isHolding ? 'scale-120' : ''}`}
        />

        <span className="truncate">{buttonLabel}</span>

        {/* Small hold indicator dot */}
        <span
          className="w-1 h-1 rounded-full bg-current opacity-40 group-hover:opacity-80 transition-opacity ml-0.5"
          title="Hold to switch"
        />
      </button>

      {/* Optional Mode hint underneath for desktop discovery */}
      {showModeHint && (
        <span className="block text-[9.5px] text-slate-400 font-medium mt-0.5 text-center">
          Hold to switch
        </span>
      )}
    </div>
  );
};
