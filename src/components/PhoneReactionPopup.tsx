import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, ThumbsUp, ChevronUp, Check } from 'lucide-react';
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
  onVote?: (type: 'like' | 'dislike' | 'unvote' | 'reset', newLikes: number, newDislikes: number) => void;
}

/**
 * Reaction Widget for Phone Hand Icon:
 * - One vote per user: click ONCE to like (+1), click again to UN-CLICK ("unonce", -1 like)
 * - Click once to dislike, click again to un-dislike
 * - Highest likes on the phone hand takes #1 / Top 10 on the leaderboard (works for any number)
 * - Protected against unclicking itself: local user vote is preserved and never overwritten by remote polls
 */
export function PhoneReactionPopup({
  initialLikes = 0,
  initialDislikes = 0,
  className = '',
  personName = 'Creator',
  isTied = false,
  tiedWith,
  currentRank,
  onVote,
}: PhoneReactionWidgetProps) {
  const normKey = (personName || 'default').toLowerCase().trim();
  const storageKey = `fairy_user_phone_vote_${normKey}`;

  // User's own vote state (click once to vote, click again to un-click / unonce)
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'like' || saved === 'dislike') return saved;
    } catch {}
    return null;
  });

  const [likes, setLikes] = useState<number>(() => {
    return typeof initialLikes === 'number' ? initialLikes : 0;
  });

  const [dislikes, setDislikes] = useState<number>(() => {
    return typeof initialDislikes === 'number' ? initialDislikes : 0;
  });

  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);

  // Sync aggregate likes/dislikes counts from remote votes (does NOT touch userVote so it never unclicks itself)
  useEffect(() => {
    let mounted = true;
    fetchRemoteVotes().then((remoteVotes) => {
      if (!mounted) return;
      const remote = remoteVotes[personName] || remoteVotes[normKey];
      if (remote) {
        if (typeof remote.likes === 'number') setLikes(remote.likes);
        if (typeof remote.dislikes === 'number') setDislikes(remote.dislikes);
      }
    });

    const unsubscribe = subscribeToRealtime((event, data) => {
      const eventName = (data?.personName || '').toLowerCase().trim();
      if (eventName === normKey || eventName === personName.toLowerCase().trim()) {
        if (event === 'vote_submitted') {
          if (typeof data.likes === 'number') setLikes(data.likes);
          if (typeof data.dislikes === 'number') setDislikes(data.dislikes);
        } else if (event === 'vote_reset') {
          setLikes(0);
          setDislikes(0);
          setUserVote(null);
          try {
            localStorage.removeItem(storageKey);
          } catch {}
          setVoteFeedback('Votes reset to 0');
          setTimeout(() => setVoteFeedback(null), 2500);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [personName, normKey, storageKey]);

  // Keep likes and dislikes in sync when parent props change
  useEffect(() => {
    if (typeof initialLikes === 'number') {
      setLikes(initialLikes);
    }
  }, [initialLikes]);

  useEffect(() => {
    if (typeof initialDislikes === 'number') {
      setDislikes(initialDislikes);
    }
  }, [initialDislikes]);

  // Toggle Like / Dislike (Click once to vote, click again to unclick / unonce)
  const handleVote = (type: 'like' | 'dislike') => {
    let nextLikes = likes;
    let nextDislikes = dislikes;
    let actionType: 'like' | 'dislike' | 'unvote' = type;

    if (type === 'like') {
      if (userVote === 'like') {
        // UN-CLICK / UNONCE: user clicked like again to cancel their vote
        nextLikes = Math.max(0, likes - 1);
        setUserVote(null);
        actionType = 'unvote';
        try {
          localStorage.removeItem(storageKey);
        } catch {}
        setVoteFeedback('Like unclicked (-1 like)');
      } else {
        // First click: vote like (+1)
        nextLikes = likes + 1;
        if (userVote === 'dislike') {
          nextDislikes = Math.max(0, dislikes - 1);
        }
        setUserVote('like');
        try {
          localStorage.setItem(storageKey, 'like');
        } catch {}
        setVoteFeedback(`Liked! (+1 like) · Click again to unclick`);
      }
    } else {
      // Dislike action
      if (userVote === 'dislike') {
        // UN-CLICK dislike
        nextDislikes = Math.max(0, dislikes - 1);
        setUserVote(null);
        actionType = 'unvote';
        try {
          localStorage.removeItem(storageKey);
        } catch {}
        setVoteFeedback('Dislike unclicked');
      } else {
        nextDislikes = dislikes + 1;
        if (userVote === 'like') {
          nextLikes = Math.max(0, likes - 1);
        }
        setUserVote('dislike');
        try {
          localStorage.setItem(storageKey, 'dislike');
        } catch {}
        setVoteFeedback('Disliked · Click again to unclick');
      }
    }

    setLikes(nextLikes);
    setDislikes(nextDislikes);

    // Notify parent to re-rank leaderboard
    if (onVote) {
      onVote(actionType, nextLikes, nextDislikes);
    }

    submitVoteToBackend(personName, actionType === 'unvote' ? 'dislike' : actionType, nextLikes, nextDislikes);
    syncActivityToRepo(
      'phone_hand_vote',
      `Phone Hand vote for ${personName}: ${actionType === 'unvote' ? `unclicked vote (${nextLikes} likes)` : `${actionType} (${nextLikes} likes)`}`,
      { personName, vote: actionType, likes: nextLikes, dislikes: nextDislikes },
      true
    );

    setTimeout(() => {
      setVoteFeedback(null);
    }, 2500);
  };

  const handleReset = () => {
    setUserVote(null);
    setLikes(0);
    setDislikes(0);

    try {
      localStorage.removeItem(storageKey);
    } catch {}

    if (onVote) {
      onVote('reset', 0, 0);
    }

    resetVoteOnBackend(personName);
    setVoteFeedback('Votes reset to 0');
    setTimeout(() => setVoteFeedback(null), 2500);

    syncActivityToRepo(
      'phone_hand_reset',
      `Reset Phone Hand likes for ${personName} to 0`,
      { personName },
      true
    );
  };

  return (
    <div className={`w-full max-w-[430px] mx-auto flex flex-col items-center select-none pt-0.5 pb-2 px-1 sm:px-2 ${className}`}>
      {/* Live Phone Hand Rank & Status Banner */}
      <div className="w-full flex items-center justify-between mb-1.5 px-2.5 py-1 rounded-lg bg-amber-50/90 border border-amber-300 text-[11px] shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-950 truncate">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span className="uppercase tracking-wider text-[9.5px] font-black text-amber-900">Phone Hand:</span>
          <span className="font-extrabold text-slate-900 truncate">
            {personName} · {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
          </span>
        </div>

        {/* Live Rank Badge: Gold for #1, Silver for #2, Bronze for #3, Red for #4+ */}
        {typeof currentRank === 'number' && (
          <span
            className={`font-black text-[10.5px] px-2 py-0.5 rounded-md shrink-0 shadow-2xs flex items-center gap-1 ${
              currentRank === 1
                ? 'bg-amber-400 text-amber-950 border border-amber-500'
                : currentRank === 2
                ? 'bg-slate-300 text-slate-900 border border-slate-400'
                : currentRank === 3
                ? 'bg-amber-700 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {currentRank === 1 && <Trophy className="w-3 h-3 text-amber-950" />}
            <span>Rank #{currentRank}</span>
          </span>
        )}
      </div>

      {/* Real-time Feedback Toast */}
      {voteFeedback && (
        <div className="w-full mb-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10.5px] font-bold rounded-lg flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-1">
            <ChevronUp className="w-3 h-3 text-emerald-600 animate-bounce" />
            {voteFeedback}
          </span>
          <span className="text-[9.5px] font-normal text-emerald-700">Highest likes = #1</span>
        </div>
      )}

      {/* Main Action Row: Red Like Button (Left), Centered Counts, Blue Dislike Button (Right) */}
      <div className="w-full flex items-center justify-between gap-2 mt-0.5">
        {/* Red Like Button (Click once to like, click again to unclick / unonce) */}
        <button
          type="button"
          onClick={() => handleVote('like')}
          className={`cursor-pointer w-[62px] sm:w-[70px] h-[34px] rounded-[10px] flex items-center justify-center transition-all shrink-0 shadow-sm relative ${
            userVote === 'like'
              ? 'bg-[#D41825] ring-3 ring-red-400 ring-offset-2 scale-105'
              : 'bg-[#E51E2B] hover:bg-[#D41825] active:scale-95'
          }`}
          title={userVote === 'like' ? 'Click to unclick your like' : 'Click to like (+1)'}
          aria-label={userVote === 'like' ? 'Unclick like' : 'Like'}
        >
          <AeriBattleThumbsUpIcon className="w-4.5 h-4.5" contrastColor="#E51E2B" facing="right" />
          {userVote === 'like' && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-red-600 flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </button>

        {/* Centered Writing: Phone Hand Likes | Dislikes */}
        <div className="flex-1 flex items-center justify-center gap-3 shrink-0">
          <div className="text-center min-w-[55px]">
            <div className={`text-[13px] sm:text-[14px] font-black tabular-nums leading-none ${userVote === 'like' ? 'text-[#E51E2B]' : 'text-slate-900'}`}>
              {likes.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">
              Phone Likes
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-300 shrink-0" />

          <div className="text-center min-w-[55px]">
            <div className={`text-[13px] sm:text-[14px] font-black tabular-nums leading-none ${userVote === 'dislike' ? 'text-[#1D3D8F]' : 'text-slate-900'}`}>
              {dislikes.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">
              Dislikes
            </div>
          </div>
        </div>

        {/* Blue Dislike Button (Click once to dislike, click again to unclick / unonce) */}
        <button
          type="button"
          onClick={() => handleVote('dislike')}
          className={`cursor-pointer w-[62px] sm:w-[70px] h-[34px] rounded-[10px] flex items-center justify-center transition-all shrink-0 shadow-sm relative ${
            userVote === 'dislike'
              ? 'bg-[#183275] ring-3 ring-blue-400 ring-offset-2 scale-105'
              : 'bg-[#1D3D8F] hover:bg-[#183275] active:scale-95'
          }`}
          title={userVote === 'dislike' ? 'Click to unclick your dislike' : 'Click to dislike'}
          aria-label={userVote === 'dislike' ? 'Unclick dislike' : 'Dislike'}
        >
          <AeriBattleThumbsUpIcon className="w-4.5 h-4.5" contrastColor="#1D3D8F" facing="left" direction="down" />
          {userVote === 'dislike' && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </button>
      </div>

      {/* Explanatory subtitle and Reset button */}
      <div className="w-full flex items-center justify-between mt-2 pt-1 border-t border-slate-200/80 px-1">
        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <ThumbsUp className="w-2.5 h-2.5 text-red-500" />
          <span>Click once to vote, click again to unclick</span>
        </span>

        {(likes > 0 || dislikes > 0) && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md border border-slate-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Reset votes for this person back to 0"
          >
            <RotateCcw className="w-2.5 h-2.5 text-purple-600" />
            <span>Reset to 0</span>
          </button>
        )}
      </div>

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
