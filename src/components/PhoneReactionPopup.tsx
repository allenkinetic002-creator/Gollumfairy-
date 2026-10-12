import React, { useState } from 'react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';

export interface PhoneReactionWidgetProps {
  initialLikes?: number;
  initialDislikes?: number;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  postAuthor?: string;
}

/**
 * Pure Reaction Widget for Phone Hand Icon:
 * - Red button at the left end with wrist line thumbs-up icon
 * - Centered writing: Likes | Dislikes
 * - Blue button at the right end with wrist line thumbs-up icon facing left
 * - Sized and styled matching the broken pencil faceoff position
 * - Wide double yellow horizontal line spanning across with upward yellow triangle
 */
export function PhoneReactionPopup({
  initialLikes = 230789,
  initialDislikes = 90099,
  className = '',
}: PhoneReactionWidgetProps) {
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);

  const handleVote = (type: 'like' | 'dislike') => {
    if (userVote === type) {
      setUserVote(null);
      if (type === 'like') {
        setLikes((prev) => Math.max(initialLikes, prev - 1));
      } else {
        setDislikes((prev) => Math.max(initialDislikes, prev - 1));
      }
    } else {
      if (type === 'like') {
        setLikes((prev) => prev + 1);
        if (userVote === 'dislike') {
          setDislikes((prev) => Math.max(initialDislikes, prev - 1));
        }
      } else {
        setDislikes((prev) => prev + 1);
        if (userVote === 'like') {
          setLikes((prev) => Math.max(initialLikes, prev - 1));
        }
      }
      setUserVote(type);
    }
  };

  return (
    <div className={`w-full max-w-[420px] mx-auto flex flex-col items-center select-none pt-0.5 pb-2 px-1 sm:px-2 ${className}`}>
      {/* Top row: Red Like button at left end, centered writing, Blue button at right end with thumbsup facing left */}
      <div className="w-full flex items-center justify-between gap-2 mt-0.5">
        {/* Red Like Button (matching broken position on left) */}
        <button
          type="button"
          onClick={() => handleVote('like')}
          className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 shrink-0 ${
            userVote === 'like'
              ? 'bg-[#E51E2B] ring-2 ring-red-400 ring-offset-1'
              : 'bg-[#E51E2B] hover:bg-[#D41825]'
          }`}
          title="Likes"
          aria-label="Like"
        >
          <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
        </button>

        {/* Centered Writing: Likes | Dislikes matching broken position */}
        <div className="flex-1 flex items-center justify-center gap-2 shrink-0">
          <div className="text-center min-w-[50px]">
            <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
              {likes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
              Likes
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-300 shrink-0" />

          <div className="text-center min-w-[50px]">
            <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
              {dislikes.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
              Dislikes
            </div>
          </div>
        </div>

        {/* Blue Dislike Button (matching broken position on right, with thumbsup flipped up to down) */}
        <button
          type="button"
          onClick={() => handleVote('dislike')}
          className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 shrink-0 ${
            userVote === 'dislike'
              ? 'bg-[#1D3D8F] ring-2 ring-blue-400 ring-offset-1'
              : 'bg-[#1D3D8F] hover:bg-[#183275]'
          }`}
          title="Dislikes"
          aria-label="Dislike"
        >
          <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" direction="down" />
        </button>
      </div>

      {/* Yellow stuff: Double yellow line with upward yellow triangle matching broken position */}
      <div className="w-full mt-2.5 relative pt-1">
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
