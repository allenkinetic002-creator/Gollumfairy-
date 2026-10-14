import React, { useState, useEffect } from 'react';
import { RotateCcw, Lock, CheckCircle2 } from 'lucide-react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';
import { syncActivityToRepo } from '../lib/repoSync';
import { submitVoteToBackend, resetVoteOnBackend, subscribeToRealtime, fetchRemoteVotes } from '../lib/realtimeSync';

export interface PhoneReactionWidgetProps {
  initialLikes?: number;
  initialDislikes?: number;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  postAuthor?: string;
  personName?: string;
  isTied?: boolean;
  tiedWith?: string;
  currentRank?: number;
  onVote?: (type: 'like' | 'dislike', newVote: 'like' | 'dislike' | null) => void;
}

/**
 * Pure Reaction Widget for Phone Hand Icon:
 * - Once used, the vote is FINAL (locked in)
 * - Has an explicit RESET button to reset the vote and do it again at any time!
 * - Red button at the left end with wrist line thumbs-up icon (adds +1, moves person UP)
 * - Centered writing: Likes | Dislikes
 * - Blue button at the right end with wrist line thumbs-up icon facing left (subtracts -1, moves person DOWN)
 * - Wide double yellow horizontal line spanning across with upward yellow triangle
 */
export function PhoneReactionPopup({
  initialLikes = 100,
  initialDislikes = 0,
  className = '',
  personName,
  isTied = false,
  tiedWith,
  currentRank,
  onVote,
}: PhoneReactionWidgetProps) {
  const storageKey = `fairy_phone_vote_${personName || 'default'}`;

  // Check if user previously finalized vote
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'like' || saved === 'dislike') return saved;
    } catch {}
    return null;
  });

  const [isFinal, setIsFinal] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(storageKey));
    } catch {}
    return false;
  });

  const [likes, setLikes] = useState<number>(() => {
    if (userVote === 'like') return initialLikes + 1;
    if (userVote === 'dislike') return Math.max(0, initialLikes - 1);
    return initialLikes;
  });

  const [dislikes, setDislikes] = useState<number>(() => {
    if (userVote === 'dislike') return initialDislikes + 1;
    return initialDislikes;
  });

  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Sync with remote votes & realtime stream
  useEffect(() => {
    let mounted = true;
    fetchRemoteVotes().then((remoteVotes) => {
      if (!mounted) return;
      const remote = remoteVotes[personName || 'default'];
      if (remote) {
        setIsFinal(Boolean(remote.isFinal));
        setUserVote(remote.vote);
        if (typeof remote.likes === 'number') setLikes(remote.likes);
        if (typeof remote.dislikes === 'number') setDislikes(remote.dislikes);
      }
    });

    const unsubscribe = subscribeToRealtime((event, data) => {
      if (data?.personName === (personName || 'default')) {
        if (event === 'vote_submitted') {
          setIsFinal(true);
          setUserVote(data.vote);
          if (typeof data.likes === 'number') setLikes(data.likes);
          if (typeof data.dislikes === 'number') setDislikes(data.dislikes);
        } else if (event === 'vote_reset') {
          setIsFinal(false);
          setUserVote(null);
          setLikes(initialLikes);
          setDislikes(initialDislikes);
          setResetMessage('Vote reset! You can now vote again.');
          setTimeout(() => setResetMessage(null), 3000);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [personName, initialLikes, initialDislikes]);

  const handleVote = (type: 'like' | 'dislike') => {
    // If already finalized, user must click Reset to vote again
    if (isFinal) {
      setResetMessage('Vote is finalized! Click "Reset & Vote Again" below to change it.');
      setTimeout(() => setResetMessage(null), 3000);
      return;
    }

    const nextLikes = type === 'like' ? initialLikes + 1 : Math.max(0, initialLikes - 1);
    const nextDislikes = type === 'like' ? initialDislikes : initialDislikes + 1;

    setLikes(nextLikes);
    setDislikes(nextDislikes);
    setUserVote(type);
    setIsFinal(true);

    try {
      localStorage.setItem(storageKey, type);
    } catch {}

    if (onVote) {
      onVote(type, type);
    }

    submitVoteToBackend(personName || 'default', type, nextLikes, nextDislikes);
    syncActivityToRepo(
      'phone_hand_vote',
      `Finalized ${type === 'like' ? 'UP (+1 like)' : 'DOWN (-1 like)'} vote for ${personName || 'creator'} via Phone Hand`,
      { personName, vote: type },
      true
    );
  };

  const handleReset = () => {
    const previousVote = userVote;
    setUserVote(null);
    setIsFinal(false);
    setLikes(initialLikes);
    setDislikes(initialDislikes);

    try {
      localStorage.removeItem(storageKey);
    } catch {}

    if (onVote && previousVote) {
      onVote(previousVote, null); // Revert the rank shift
    }

    resetVoteOnBackend(personName || 'default');
    setResetMessage('Vote reset! You can now vote again.');
    setTimeout(() => setResetMessage(null), 3000);

    syncActivityToRepo(
      'phone_hand_reset',
      `Reset Phone Hand tie-breaker vote for ${personName || 'creator'}`,
      { personName },
      true
    );
  };

  return (
    <div className={`w-full max-w-[430px] mx-auto flex flex-col items-center select-none pt-0.5 pb-2 px-1 sm:px-2 ${className}`}>
      {/* Tie Breaker Indicator Banner */}
      <div className="w-full flex items-center justify-between mb-1.5 px-2 py-1 rounded-lg bg-amber-50/90 border border-amber-300 text-[10.5px] shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-950 truncate">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span className="uppercase tracking-wider text-[9.5px] font-black text-amber-900">Tie-Breaker:</span>
          <span className="font-semibold text-slate-800 truncate">
            {isTied && tiedWith
              ? `Tied with ${tiedWith} · Red ▲ moves UP, Blue ▼ moves DOWN`
              : personName
              ? `${personName} · Red ▲ (+1 like) moves UP, Blue ▼ (-1 like) moves DOWN`
              : 'Red ▲ (+1 like) moves UP, Blue ▼ (-1 like) moves DOWN'}
          </span>
        </div>

        {/* Finalized Status Badge */}
        {isFinal && (
          <span
            className={`font-black text-[10px] px-2 py-0.5 rounded-md shrink-0 shadow-2xs flex items-center gap-1 ${
              userVote === 'like'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <Lock className="w-2.5 h-2.5" />
            <span>{userVote === 'like' ? 'Final: Moved UP (+1)' : 'Final: Moved DOWN (-1)'}</span>
          </span>
        )}
      </div>

      {/* Reset Notification Message */}
      {resetMessage && (
        <div className="w-full mb-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10.5px] font-bold rounded-lg flex items-center justify-between animate-fadeIn">
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Top row: Red Like button at left end, centered writing, Blue button at right end */}
      <div className="w-full flex items-center justify-between gap-2 mt-0.5">
        {/* Red Like Button (moves person UP in Top 10) */}
        <button
          type="button"
          onClick={() => handleVote('like')}
          className={`cursor-pointer w-[58px] sm:w-[64px] h-[30px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 shrink-0 shadow-xs ${
            userVote === 'like'
              ? 'bg-[#E51E2B] ring-3 ring-red-400 ring-offset-1 scale-105'
              : 'bg-[#E51E2B] hover:bg-[#D41825]'
          } ${isFinal && userVote !== 'like' ? 'opacity-40 cursor-not-allowed' : ''}`}
          title={isFinal ? 'Vote finalized (use Reset button to vote again)' : 'Vote Up: Move UP in Top 10 rankings'}
          aria-label="Move Up"
        >
          <AeriBattleThumbsUpIcon className="w-4 h-4" contrastColor="#E51E2B" facing="right" />
        </button>

        {/* Centered Writing: Likes | Dislikes matching broken position */}
        <div className="flex-1 flex items-center justify-center gap-2 shrink-0">
          <div className="text-center min-w-[50px]">
            <div className={`text-[12px] sm:text-[12.5px] font-bold tabular-nums leading-none ${userVote === 'like' ? 'text-[#E51E2B]' : 'text-black'}`}>
              {likes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
              Likes
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-300 shrink-0" />

          <div className="text-center min-w-[50px]">
            <div className={`text-[12px] sm:text-[12.5px] font-bold tabular-nums leading-none ${userVote === 'dislike' ? 'text-[#1D3D8F]' : 'text-black'}`}>
              {dislikes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
              Dislikes
            </div>
          </div>
        </div>

        {/* Blue Dislike Button (moves person DOWN in Top 10) */}
        <button
          type="button"
          onClick={() => handleVote('dislike')}
          className={`cursor-pointer w-[58px] sm:w-[64px] h-[30px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 shrink-0 shadow-xs ${
            userVote === 'dislike'
              ? 'bg-[#1D3D8F] ring-3 ring-blue-400 ring-offset-1 scale-105'
              : 'bg-[#1D3D8F] hover:bg-[#183275]'
          } ${isFinal && userVote !== 'dislike' ? 'opacity-40 cursor-not-allowed' : ''}`}
          title={isFinal ? 'Vote finalized (use Reset button to vote again)' : 'Vote Down: Move DOWN in Top 10 rankings'}
          aria-label="Move Down"
        >
          <AeriBattleThumbsUpIcon className="w-4 h-4" contrastColor="#1D3D8F" facing="left" direction="down" />
        </button>
      </div>

      {/* RESET OPTION: Allows user to reset vote and do it again */}
      {isFinal && (
        <div className="w-full flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/80 px-1">
          <div className="flex items-center gap-1 text-[11px] font-black text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Choice is final & locked</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10.5px] font-black rounded-lg border border-slate-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Reset your vote and vote again"
          >
            <RotateCcw className="w-3 h-3 text-purple-600" />
            <span>Reset & Vote Again</span>
          </button>
        </div>
      )}

      {/* Double yellow line with upward yellow triangle */}
      <div className="w-full mt-2 relative pt-1">
        <div className="w-full flex flex-col gap-[2.5px]">
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
        </div>

        {/* Center upward yellow triangle indicator */}
        <div className="absolute left-1/2 -top-[5.5px] -translate-x-1/2 pointer-events-none">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#F5C21B]" />
        </div>
      </div>
    </div>
  );
}

export default PhoneReactionPopup;
