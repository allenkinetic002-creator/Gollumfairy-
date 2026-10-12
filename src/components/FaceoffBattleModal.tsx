import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';
import { AeriCommentIcon } from './AeriCommentIcon';

export interface ChallengeCommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

const DEFAULT_CHALLENGE_COMMENTS: ChallengeCommentItem[] = [
  {
    id: 'foc-1',
    authorName: 'Sophia Vance',
    authorHandle: '@sophia_v',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'Freda definitely took this round, that outfit and confidence was unmatched 🔥',
    timeAgo: '1h ago',
    likes: 142,
    isLiked: false,
  },
  {
    id: 'foc-2',
    authorName: 'Marcus Kane',
    authorHandle: '@marcus_k',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Nah Heather actually had the better vibe, this poll was wildly close imo 🤷‍♂️',
    timeAgo: '3h ago',
    likes: 89,
    isLiked: false,
  },
  {
    id: 'foc-3',
    authorName: 'Chloe Taylor',
    authorHandle: '@chloe_t',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    text: '52% to 48% is super tight! That final rush in the last 10 minutes decided it all.',
    timeAgo: '6h ago',
    likes: 34,
    isLiked: false,
  },
];

export interface FaceoffBattleModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  battleQuestion?: string;
  redParticipant?: {
    name: string;
    avatar: string;
    title?: string;
  };
  blueParticipant?: {
    name: string;
    avatar: string;
    title?: string;
  };
}

/**
 * FaceoffBattleModal - In-post card placed directly on top of the profile pic attached to its post.
 * Features:
 * - "Who looks Hotter between me Freda pepper or this loser Slimy sticky"
 * - WINNER (Red) vs LOSER (Blue)
 * - Preference estimate
 * - Freda 52.0% | 0:00:00 | 48.0% Heather
 * - Red & Blue Voting Buttons with live Likes / Dislikes counters
 * - Split Progress Bar (Red vs Blue)
 * - Bottom double yellow lines with upward triangle
 */
export function FaceoffBattleModal({
  isOpen = true,
  onClose,
  className = '',
  battleQuestion = 'Who looks Hotter between me Freda pepper or this loser Slimy sticky',
  redParticipant = {
    name: 'Freda Da. pepper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  blueParticipant = {
    name: 'Heather Slime',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
}: FaceoffBattleModalProps) {
  const [userVote, setUserVote] = useState<'red' | 'blue' | null>(null);
  const [likes, setLikes] = useState<number>(234095);
  const [dislikes, setDislikes] = useState<number>(90000);
  const [redPct, setRedPct] = useState<number>(52.0);
  const [bluePct, setBluePct] = useState<number>(48.0);
  const [showComments, setShowComments] = useState<boolean>(true);
  const [comments, setComments] = useState<ChallengeCommentItem[]>(DEFAULT_CHALLENGE_COMMENTS);
  const [newCommentText, setNewCommentText] = useState<string>('');

  if (!isOpen) return null;

  const handleToggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ChallengeCommentItem = {
      id: `foc-user-${Date.now()}`,
      authorName: 'Elena Vance',
      authorHandle: '@elena_aeri',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
      isLiked: true,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleVote = (side: 'red' | 'blue') => {
    if (userVote === side) {
      setUserVote(null);
      if (side === 'red') {
        setLikes((prev) => Math.max(234095, prev - 1));
      } else {
        setDislikes((prev) => Math.max(90000, prev - 1));
      }
      setRedPct(52.0);
      setBluePct(48.0);
    } else {
      if (side === 'red') {
        setLikes((prev) => prev + 1);
        if (userVote === 'blue') {
          setDislikes((prev) => Math.max(90000, prev - 1));
        }
        setRedPct(52.5);
        setBluePct(47.5);
      } else {
        setDislikes((prev) => prev + 1);
        if (userVote === 'red') {
          setLikes((prev) => Math.max(234095, prev - 1));
        }
        setRedPct(51.5);
        setBluePct(48.5);
      }
      setUserVote(side);
    }
  };

  return (
    <div
      className={`w-full max-w-[420px] bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3.5 sm:p-4 relative select-none animate-in fade-in duration-150 ${className}`}
    >
      {/* Optional Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
          title="Close faceoff card"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* 1. Header Question */}
      <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900 leading-snug tracking-tight pr-6">
        {battleQuestion}
      </h2>

      {/* 2. WINNER vs LOSER Header */}
      <div className="flex items-center justify-between mt-2.5 mb-0.5">
        <span className="text-[20px] sm:text-[22px] font-black text-[#E51E2B] tracking-tight leading-none">
          WINNER
        </span>
        <span className="text-[20px] sm:text-[22px] font-black text-[#1D3D8F] tracking-tight leading-none">
          LOSER
        </span>
      </div>

      {/* 3. Sub-heading: Preference estimate */}
      <div className="text-[11.5px] font-extrabold text-slate-900 mb-1.5">
        Preference estimate
      </div>

      {/* 4. Faces & Percentages Row */}
      <div className="flex items-center justify-between px-0.5">
        {/* Freda Left / Red */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img
            src={redParticipant.avatar}
            alt={redParticipant.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
          />
          <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
            {redPct.toFixed(1)}%
          </span>
        </div>

        {/* Center Timer */}
        <div className="text-[12px] font-bold text-slate-900 tabular-nums px-1">
          0:00:00
        </div>

        {/* Heather Right / Blue */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
            {bluePct.toFixed(1)}%
          </span>
          <img
            src={blueParticipant.avatar}
            alt={blueParticipant.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
          />
        </div>
      </div>

      {/* 5. Names Row */}
      <div className="flex items-center justify-between mt-1 px-0.5 text-[11px] font-bold text-slate-900">
        <span>{redParticipant.name}</span>
        <span>{blueParticipant.name}</span>
      </div>

      {/* 6. Interaction Row (Red button + Likes | Dislikes + Blue button) */}
      <div className="w-full flex items-center justify-between gap-2 mt-2.5">
        {/* Red Like Button (in former place on left) */}
        <button
          type="button"
          onClick={() => handleVote('red')}
          className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
            userVote === 'red'
              ? 'bg-[#E51E2B] ring-2 ring-red-400 ring-offset-1'
              : 'bg-[#E51E2B] hover:bg-[#D41825]'
          }`}
          title={`Vote for ${redParticipant.name} (Red)`}
        >
          <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
        </button>

        {/* Likes & Dislikes Counters */}
        <div className="flex items-center justify-center gap-2 shrink-0">
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

        {/* Blue Like Button (in former place on right, with thumbs up facing left) */}
        <button
          type="button"
          onClick={() => handleVote('blue')}
          className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
            userVote === 'blue'
              ? 'bg-[#1D3D8F] ring-2 ring-blue-400 ring-offset-1'
              : 'bg-[#1D3D8F] hover:bg-[#183275]'
          }`}
          title={`Vote for ${blueParticipant.name} (Blue)`}
        >
          <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" />
        </button>
      </div>

      {/* 7. Split Color Progress Bar */}
      <div className="w-full mt-3">
        <div className="w-full flex items-center gap-[3px]">
          <div
            className="h-[6px] bg-[#E51E2B] rounded-full transition-all duration-300"
            style={{ width: `${redPct}%` }}
          />
          <div
            className="h-[6px] bg-[#1D3D8F] rounded-full transition-all duration-300"
            style={{ width: `${bluePct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10.5px] font-bold mt-0.5 px-0.5">
          <span className="text-[#E51E2B]">Red</span>
          <span className="text-[#1D3D8F]">Blue</span>
        </div>
      </div>

      {/* 8. Bottom Double Yellow Line with Upward Triangle */}
      <div className="w-full mt-2.5 relative pt-1">
        <div className="w-full flex flex-col gap-[2.5px]">
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
        </div>

        {/* Upward yellow triangle pointer */}
        <div
          className="absolute -top-[5.5px] -translate-x-1/2 pointer-events-none transition-all duration-300"
          style={{ left: `${redPct}%` }}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#F5C21B]" />
        </div>
      </div>

      {/* 9. People's Comments on the Challenge */}
      <div className="w-full pt-3 mt-3 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 text-[12px] font-black text-slate-900 tracking-tight cursor-pointer hover:text-purple-600 transition-colors"
          >
            <AeriCommentIcon className="w-3.5 h-3.5 text-purple-600 stroke-[1.8]" />
            <span>People's Comments ({comments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="text-[10px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
          >
            {showComments ? 'Collapse' : 'Show Comments'}
          </button>
        </div>

        {showComments && (
          <div className="space-y-2 mt-2 animate-fadeIn">
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-slate-50/90 border border-slate-100 flex items-start gap-2"
                >
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 leading-tight">
                      <span className="text-[11px] font-bold text-slate-900 truncate">
                        {item.authorName}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {item.timeAgo}
                      </span>
                    </div>
                    <p className="text-[11px] leading-snug text-slate-800 mt-0.5">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleCommentLike(item.id)}
                        className={`flex items-center gap-0.5 text-[9.5px] font-semibold cursor-pointer ${
                          item.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`w-2.5 h-2.5 ${
                            item.isLiked ? 'fill-red-500 text-red-500' : 'stroke-[1.8]'
                          }`}
                        />
                        <span className="tabular-nums">{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Comment on this challenge..."
                className="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-full px-2.5 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-[10px] font-bold rounded-full transition-colors cursor-pointer shrink-0"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaceoffBattleModal;
