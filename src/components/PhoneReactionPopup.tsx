import React, { useState } from 'react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';

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
 * - Serves as a live Tie-Breaker indicator to move a person up or down in Top 10
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
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);

  React.useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleVote = (type: 'like' | 'dislike') => {
    let nextVote: 'like' | 'dislike' | null = null;
    if (userVote === type) {
      // Toggle off -> restore base likes
      nextVote = null;
      setLikes(initialLikes);
      setDislikes(initialDislikes);
    } else {
      nextVote = type;
      if (type === 'like') {
        // Red button: +1 like -> moves person UP in Top 10
        setLikes(initialLikes + 1);
        setDislikes(initialDislikes);
      } else {
        // Blue button: subtracts like (-1) -> moves person DOWN in Top 10
        setLikes(Math.max(0, initialLikes - 1));
        setDislikes(initialDislikes + 1);
      }
    }
    setUserVote(nextVote);
    if (onVote) {
      onVote(type, nextVote);
    }
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
        {userVote && (
          <span
            className={`font-black text-[10px] px-2 py-0.5 rounded-md shrink-0 shadow-2xs ${
              userVote === 'like'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {userVote === 'like' ? '▲ Moved UP (+1 like)' : '▼ Moved DOWN (-1 like)'}
          </span>
        )}
      </div>

      {/* Top row: Red Like button at left end, centered writing, Blue button at right end with thumbsup facing left */}
      <div className="w-full flex items-center justify-between gap-2 mt-0.5">
        {/* Red Like Button (moves person UP in Top 10) */}
        <button
          type="button"
          onClick={() => handleVote('like')}
          className={`cursor-pointer w-[58px] sm:w-[64px] h-[30px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 shrink-0 shadow-xs ${
            userVote === 'like'
              ? 'bg-[#E51E2B] ring-3 ring-red-400 ring-offset-1 scale-105'
              : 'bg-[#E51E2B] hover:bg-[#D41825]'
          }`}
          title="Vote Up: Move UP in Top 10 rankings"
          aria-label="Move Up"
        >
          <div className="flex items-center gap-1">
            <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
            <span className="text-[10px] font-black text-white">▲</span>
          </div>
        </button>

        {/* Centered Writing: Likes | Dislikes matching broken position */}
        <div className="flex-1 flex items-center justify-center gap-2 shrink-0">
          <div className="text-center min-w-[50px]">
            <div className={`text-[12px] sm:text-[12.5px] font-bold tabular-nums leading-none ${userVote === 'like' ? 'text-[#E51E2B]' : 'text-black'}`}>
              {likes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5 flex items-center justify-center gap-0.5">
              <span>Likes</span>
              <span className="text-[9px] text-red-600 font-bold">▲</span>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-300 shrink-0" />

          <div className="text-center min-w-[50px]">
            <div className={`text-[12px] sm:text-[12.5px] font-bold tabular-nums leading-none ${userVote === 'dislike' ? 'text-[#1D3D8F]' : 'text-black'}`}>
              {dislikes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5 flex items-center justify-center gap-0.5">
              <span>Dislikes</span>
              <span className="text-[9px] text-blue-700 font-bold">▼</span>
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
          }`}
          title="Vote Down: Move DOWN in Top 10 rankings"
          aria-label="Move Down"
        >
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-white">▼</span>
            <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" direction="down" />
          </div>
        </button>
      </div>

      {/* Yellow stuff: Double yellow line with upward yellow triangle matching broken position */}
      <div className="w-full mt-2 relative pt-1">
        {/* Wide double yellow lines */}
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
