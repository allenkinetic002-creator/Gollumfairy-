import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
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

interface PastChallengeData {
  id: string;
  title: string;
  redParticipant: {
    name: string;
    avatar: string;
  };
  blueParticipant: {
    name: string;
    avatar: string;
  };
  likes: number;
  dislikes: number;
  redPct: number;
  bluePct: number;
  date: string;
  comments: ChallengeCommentItem[];
}

interface PastChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
  personAvatar?: string;
}

const SAMPLE_PAST_CHALLENGES: PastChallengeData[] = [
  {
    id: 'past-1',
    title: 'Who looks Hotter between me Freda pepper or this loser Slimy sticky',
    redParticipant: {
      name: 'Freda Da. pepper',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    blueParticipant: {
      name: 'Heather Slime',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    likes: 234095,
    dislikes: 90000,
    redPct: 52.0,
    bluePct: 48.0,
    date: 'Previous Challenge &bull; Finished',
    comments: [
      {
        id: 'c-101',
        authorName: 'Sophia Vance',
        authorHandle: '@sophia_v',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'Freda definitely took this round, that outfit and confidence was unmatched 🔥',
        timeAgo: '1h ago',
        likes: 142,
        isLiked: false,
      },
      {
        id: 'c-102',
        authorName: 'Marcus Kane',
        authorHandle: '@marcus_k',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Nah Heather actually had the better vibe, this poll was wildly close imo 🤷‍♂️',
        timeAgo: '3h ago',
        likes: 89,
        isLiked: false,
      },
      {
        id: 'c-103',
        authorName: 'Chloe Taylor',
        authorHandle: '@chloe_t',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        text: '52% to 48% is super tight! That final rush in the last 10 minutes decided it all.',
        timeAgo: '6h ago',
        likes: 34,
        isLiked: false,
      },
      {
        id: 'c-104',
        authorName: 'Jordan Pulse',
        authorHandle: '@jordan_p',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'Waiting for the rematch already! Winner earned it though 👑',
        timeAgo: '12h ago',
        likes: 19,
        isLiked: false,
      },
    ],
  },
  {
    id: 'past-2',
    title: 'Who has better aesthetics: Elena Rostova or Milo Sterling',
    redParticipant: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    blueParticipant: {
      name: 'Milo Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    likes: 184500,
    dislikes: 102000,
    redPct: 54.2,
    bluePct: 45.8,
    date: 'Previous Challenge &bull; Finished',
    comments: [
      {
        id: 'c-201',
        authorName: 'Alex River',
        authorHandle: '@alex_r',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: "Elena's color grading and lighting is top tier aesthetic ✨ deserved win!",
        timeAgo: '2h ago',
        likes: 210,
        isLiked: false,
      },
      {
        id: 'c-202',
        authorName: 'Noah Sterling',
        authorHandle: '@noah_craft',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: "Milo's minimalist aesthetic is so underrated, but Elena was tough competition.",
        timeAgo: '4h ago',
        likes: 95,
        isLiked: false,
      },
      {
        id: 'c-203',
        authorName: 'Tess Visuals',
        authorHandle: '@tess_v',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'Both of them had incredible submissions, loved seeing this faceoff!',
        timeAgo: '8h ago',
        likes: 41,
        isLiked: false,
      },
    ],
  },
];

/**
 * Verb Mode - Shows the person's past / previous challenge(s) in the exact
 * broken pencil feature card style, along with people's comments on the challenge.
 */
export const PastChallengesModal: React.FC<PastChallengesModalProps> = ({
  isOpen,
  onClose,
  personName,
  personAvatar,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [challenges, setChallenges] = useState<PastChallengeData[]>(SAMPLE_PAST_CHALLENGES);
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const current = challenges[currentIndex] || challenges[0];

  const handleToggleCommentLike = (commentId: string) => {
    setChallenges((prev) =>
      prev.map((ch, idx) => {
        if (idx !== currentIndex) return ch;
        return {
          ...ch,
          comments: ch.comments.map((c) => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ChallengeCommentItem = {
      id: `c-user-${Date.now()}`,
      authorName: 'Elena Vance',
      authorHandle: '@elena_aeri',
      authorAvatar:
        personAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
      isLiked: true,
    };

    setChallenges((prev) =>
      prev.map((ch, idx) => {
        if (idx !== currentIndex) return ch;
        return {
          ...ch,
          comments: [newComment, ...ch.comments],
        };
      })
    );

    setNewCommentText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 relative select-none animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close"
          title="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 scrollbar-thin">
          {/* Top Tag & Switcher */}
          <div className="flex items-center justify-between mb-2 pr-6">
            <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md uppercase tracking-wide">
              Verb &bull; Past Challenge ({currentIndex + 1}/{challenges.length})
            </div>

            {challenges.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev > 0 ? prev - 1 : challenges.length - 1
                    )
                  }
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Previous past challenge"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev < challenges.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Next past challenge"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 1. Header Question */}
          <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900 leading-snug tracking-tight pr-4">
            {current.title}
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
            {/* Winner Left / Red */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={current.redParticipant.avatar}
                alt={current.redParticipant.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
              />
              <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
                {current.redPct.toFixed(1)}%
              </span>
            </div>

            {/* Center Timer */}
            <div className="text-[12px] font-bold text-slate-900 tabular-nums px-1">
              0:00:00
            </div>

            {/* Loser Right / Blue */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
                {current.bluePct.toFixed(1)}%
              </span>
              <img
                src={current.blueParticipant.avatar}
                alt={current.blueParticipant.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
              />
            </div>
          </div>

          {/* 5. Names Row */}
          <div className="flex items-center justify-between mt-1 px-0.5 text-[11px] font-bold text-slate-900">
            <span>{current.redParticipant.name}</span>
            <span>{current.blueParticipant.name}</span>
          </div>

          {/* 6. Interaction Row (Red button + Likes | Dislikes + Blue button) */}
          <div className="w-full flex items-center justify-between gap-2 mt-2.5">
            {/* Red Like Button */}
            <button
              type="button"
              className="cursor-default w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center bg-[#E51E2B]"
            >
              <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
            </button>

            <div className="flex items-center justify-center gap-2 shrink-0">
              <div className="text-center min-w-[50px]">
                <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
                  {current.likes.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
                  Likes
                </div>
              </div>

              <div className="w-[1px] h-6 bg-slate-300 shrink-0" />

              <div className="text-center min-w-[50px]">
                <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
                  {current.dislikes.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">
                  Dislikes
                </div>
              </div>
            </div>

            {/* Blue Like Button */}
            <button
              type="button"
              className="cursor-default w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center bg-[#1D3D8F]"
            >
              <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" />
            </button>
          </div>

          {/* 7. Split Color Progress Bar */}
          <div className="w-full mt-3">
            <div className="w-full flex items-center gap-[3px]">
              <div
                className="h-[6px] bg-[#E51E2B] rounded-full transition-all duration-300"
                style={{ width: `${current.redPct}%` }}
              />
              <div
                className="h-[6px] bg-[#1D3D8F] rounded-full transition-all duration-300"
                style={{ width: `${current.bluePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10.5px] font-bold mt-0.5 px-0.5">
              <span className="text-[#E51E2B]">Red</span>
              <span className="text-[#1D3D8F]">Blue</span>
            </div>
          </div>

          {/* 8. Bottom Double Yellow Line with Upward Triangle */}
          <div className="w-full mt-2.5 relative pt-1 mb-4">
            <div className="w-full flex flex-col gap-[2.5px]">
              <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
              <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
            </div>

            <div
              className="absolute -top-[5.5px] -translate-x-1/2 pointer-events-none transition-all duration-300"
              style={{ left: `${current.redPct}%` }}
            >
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#F5C21B]" />
            </div>
          </div>

          {/* 9. People's Comments on the Challenge */}
          <div className="w-full pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <AeriCommentIcon className="w-4 h-4 text-purple-600 stroke-[1.8]" />
                <span className="text-[12.5px] font-black text-slate-900 tracking-tight">
                  People's Comments ({current.comments.length})
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Live Debate
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {current.comments.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-100 flex items-start gap-2.5 transition-colors"
                >
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 leading-tight">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[11.5px] font-bold text-slate-900 truncate">
                          {item.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {item.authorHandle}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 shrink-0">
                        {item.timeAgo}
                      </span>
                    </div>

                    <p className="text-[11.5px] leading-snug text-slate-800 mt-1">
                      {item.text}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleCommentLike(item.id)}
                        className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
                          item.isLiked
                            ? 'text-red-600'
                            : 'text-slate-500 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`w-3 h-3 ${
                            item.isLiked ? 'fill-red-500 text-red-500' : 'stroke-[1.8]'
                          }`}
                        />
                        <span className="tabular-nums">{item.likes}</span>
                      </button>
                      <button
                        type="button"
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input to add a new comment */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
              <img
                src={
                  personAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt="You"
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
              />
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Comment on this challenge..."
                className="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer shrink-0"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

