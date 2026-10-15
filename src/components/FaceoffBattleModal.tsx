import React, { useState, useMemo } from 'react';
import { X, Heart, MessageCircle, Send, Plus, Users, Search, Trophy, Sparkles } from 'lucide-react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';
import { AeriCommentIcon } from './AeriCommentIcon';
import { syncActivityToRepo } from '../lib/repoSync';

export interface ChallengeCommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

const DEFAULT_CHALLENGE_COMMENTS: ChallengeCommentItem[] = [
  {
    id: 'foc-1',
    authorName: 'Marcus Vance',
    authorHandle: '@marcus_vision',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Freda had the lead in the morning but Heather is climbing fast! This is getting wild 🔥',
    timeAgo: '2h ago',
    likes: 84,
    isLiked: false,
  },
  {
    id: 'foc-2',
    authorName: 'Sora Takahashi',
    authorHandle: '@sora_art',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    text: 'The broken pencil stakes are crazy high. Dropped my vote right now!',
    timeAgo: '4h ago',
    likes: 49,
    isLiked: true,
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

export interface BattleParticipant {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  handle?: string;
  votes: number;
  color?: string;
}

const DEFAULT_CONTENDERS_SEED: BattleParticipant[] = [
  {
    id: 'p-1',
    name: 'Freda Da. pepper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Defending Champion',
    votes: 234095,
    color: '#E51E2B',
  },
  {
    id: 'p-2',
    name: 'Heather Slime',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Top Challenger',
    votes: 216000,
    color: '#1D3D8F',
  },
  {
    id: 'p-3',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Viral Contender',
    votes: 198400,
    color: '#9333EA',
  },
  {
    id: 'p-4',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Film Specialist',
    votes: 182100,
    color: '#D97706',
  },
  {
    id: 'p-5',
    name: 'Sora Takahashi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Neo-Tokyo Muralist',
    votes: 165300,
    color: '#059669',
  },
  {
    id: 'p-6',
    name: 'Dave Miller',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'Comedy Heavyweight',
    votes: 148900,
    color: '#0284C7',
  },
  {
    id: 'p-7',
    name: 'Camille Laurent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Gouache Master',
    votes: 139200,
    color: '#E11D48',
  },
  {
    id: 'p-8',
    name: 'Tyler Cruz',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'Crowd Roaster',
    votes: 125400,
    color: '#7C3AED',
  },
  {
    id: 'p-9',
    name: 'Samira Watts',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    title: 'Satire Queen',
    votes: 114800,
    color: '#EA580C',
  },
  {
    id: 'p-10',
    name: 'Victor Sterling',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    title: 'Haptic Innovator',
    votes: 102500,
    color: '#0D9488',
  },
];

export interface FaceoffBattleModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  battleQuestion?: string;
  participants?: BattleParticipant[];
  totalParticipants?: number;
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
  isLoggedIn?: boolean;
  onRequireAuth?: (action: string) => void;
}

export function FaceoffBattleModal({
  isOpen = true,
  onClose,
  className = '',
  battleQuestion = 'Who looks Hotter between me Freda pepper or this loser Slimy sticky',
  participants: initialParticipants,
  totalParticipants: initialTotalCount,
  redParticipant = {
    name: 'Freda Da. pepper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  blueParticipant = {
    name: 'Heather Slime',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  isLoggedIn = false,
  onRequireAuth,
}: FaceoffBattleModalProps) {
  // Configured total scale: 2, 3, 10, or up to 10,000!
  const [targetContenderCount, setTargetContenderCount] = useState<number>(() => {
    if (initialTotalCount && initialTotalCount > 0) return initialTotalCount;
    if (initialParticipants && initialParticipants.length > 2) return initialParticipants.length;
    return 2;
  });

  const [customScaleInput, setCustomScaleInput] = useState<string>('');
  const [showAddFighter, setShowAddFighter] = useState(false);
  const [newFighterName, setNewFighterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial list of active contenders
  const [contenders, setContenders] = useState<BattleParticipant[]>(() => {
    if (initialParticipants && initialParticipants.length > 0) {
      return initialParticipants;
    }
    return [
      {
        id: 'p-red',
        name: redParticipant.name,
        avatar: redParticipant.avatar,
        title: redParticipant.title || 'Red Corner',
        votes: 234095,
        color: '#E51E2B',
      },
      {
        id: 'p-blue',
        name: blueParticipant.name,
        avatar: blueParticipant.avatar,
        title: blueParticipant.title || 'Blue Corner',
        votes: 216000,
        color: '#1D3D8F',
      },
      ...DEFAULT_CONTENDERS_SEED.slice(2),
    ];
  });

  // Track user's voted contender IDs
  const [votedContenderId, setVotedContenderId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<ChallengeCommentItem[]>(DEFAULT_CHALLENGE_COMMENTS);
  const [newCommentText, setNewCommentText] = useState<string>('');

  if (!isOpen) return null;

  // Active contenders filtered by the target scale
  const activeContenders = useMemo(() => {
    if (targetContenderCount === 2) {
      return contenders.slice(0, 2);
    }
    if (targetContenderCount === 3) {
      return contenders.slice(0, 3);
    }
    if (targetContenderCount <= 10) {
      return contenders.slice(0, targetContenderCount);
    }

    // For 100 or 10,000 or large scales:
    // We display top contenders + synthesize the crowd stats
    return contenders;
  }, [contenders, targetContenderCount]);

  // Compute total votes and percentages
  const totalVotes = useMemo(() => {
    const directSum = activeContenders.reduce((sum, c) => sum + c.votes, 0);
    if (targetContenderCount > 10) {
      // Scale total votes to represent massive arena
      return directSum + (targetContenderCount - activeContenders.length) * 15400;
    }
    return directSum;
  }, [activeContenders, targetContenderCount]);

  const sortedContenders = useMemo(() => {
    return [...activeContenders].sort((a, b) => b.votes - a.votes);
  }, [activeContenders]);

  const filteredContenders = useMemo(() => {
    if (!searchQuery.trim()) return sortedContenders;
    const q = searchQuery.toLowerCase();
    return sortedContenders.filter((c) => c.name.toLowerCase().includes(q));
  }, [sortedContenders, searchQuery]);

  const handleVote = (contenderId: string) => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth('vote in faceoff battles');
      return;
    }
    setContenders((prev) =>
      prev.map((c) => {
        if (c.id === contenderId) {
          const isCurrent = votedContenderId === contenderId;
          return {
            ...c,
            votes: isCurrent ? Math.max(0, c.votes - 1) : c.votes + 1,
          };
        }
        return c;
      })
    );

    const isRemoving = votedContenderId === contenderId;
    setVotedContenderId(isRemoving ? null : contenderId);

    const votedPerson = contenders.find((c) => c.id === contenderId);
    if (!isRemoving && votedPerson) {
      syncActivityToRepo(
        'vote_faceoff',
        `Voted for ${votedPerson.name} in Faceoff (${targetContenderCount} fighters)`,
        { contenderId, name: votedPerson.name, totalContenders: targetContenderCount },
        true
      );
    } else if (isRemoving && votedPerson) {
      syncActivityToRepo(
        'reset_faceoff_vote',
        `Reset vote for ${votedPerson.name} in Faceoff`,
        { contenderId, name: votedPerson.name },
        true
      );
    }
  };

  const handleAddFighter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFighterName.trim()) return;

    const colors = ['#E51E2B', '#1D3D8F', '#9333EA', '#D97706', '#059669', '#0284C7', '#E11D48', '#7C3AED'];
    const newFighter: BattleParticipant = {
      id: `custom-fighter-${Date.now()}`,
      name: newFighterName.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + contenders.length}?w=150&auto=format&fit=crop&q=80`,
      title: 'New Challenger',
      votes: Math.floor(Math.random() * 50000) + 100000,
      color: colors[contenders.length % colors.length],
    };

    setContenders((prev) => [newFighter, ...prev]);
    setTargetContenderCount((prev) => Math.max(prev + 1, 3));
    setNewFighterName('');
    setShowAddFighter(false);

    syncActivityToRepo(
      'add_faceoff_contender',
      `Added new contender "${newFighter.name}" to Faceoff Battle`,
      { name: newFighter.name }
    );
  };

  const handleSetScale = (count: number) => {
    setTargetContenderCount(count);
  };

  const handleCustomScaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customScaleInput.replace(/,/g, ''), 10);
    if (!isNaN(num) && num >= 2) {
      setTargetContenderCount(num);
      setCustomScaleInput('');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ChallengeCommentItem = {
      id: `foc-user-${Date.now()}`,
      authorName: 'You',
      authorHandle: '@you',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
      isLiked: true,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  // 2-person percentages for dual view
  const p1 = activeContenders[0] || contenders[0];
  const p2 = activeContenders[1] || contenders[1];
  const dualSum = (p1?.votes || 1) + (p2?.votes || 1);
  const p1Pct = parseFloat((((p1?.votes || 0) / dualSum) * 100).toFixed(1));
  const p2Pct = parseFloat((100 - p1Pct).toFixed(1));

  return (
    <div
      className={`w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3.5 sm:p-4 relative select-none animate-in fade-in duration-150 ${className}`}
    >
      {/* Optional Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
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

      {/* CONTENDER SCALE SELECTOR: 2, 3, 10, or up to 10,000! */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Contenders in this Battle:</span>
          </span>
          <span className="font-mono text-purple-700 font-black bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            {targetContenderCount.toLocaleString()} {targetContenderCount === 1 ? 'Contender' : 'Contenders'}
          </span>
        </div>

        {/* Quick Scale Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
          {[
            { label: '2 (Dual)', count: 2 },
            { label: '3 (Triple)', count: 3 },
            { label: '5 (Pentagon)', count: 5 },
            { label: '10 (Royale)', count: 10 },
            { label: '100 (Mega)', count: 100 },
            { label: '10,000 (Global Arena)', count: 10000 },
          ].map((item) => (
            <button
              key={item.count}
              type="button"
              onClick={() => handleSetScale(item.count)}
              className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                targetContenderCount === item.count
                  ? 'bg-purple-600 text-white shadow-xs scale-102'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom Count or Add Fighter Input */}
        <div className="flex items-center gap-2 pt-0.5">
          <form onSubmit={handleCustomScaleSubmit} className="flex-1 flex items-center gap-1">
            <input
              type="text"
              value={customScaleInput}
              onChange={(e) => setCustomScaleInput(e.target.value)}
              placeholder="Custom e.g. 10000"
              className="flex-1 px-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-slate-800 hover:bg-black text-white text-[10px] font-bold rounded-lg cursor-pointer shrink-0"
            >
              Set Count
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowAddFighter((prev) => !prev)}
            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add Fighter</span>
          </button>
        </div>

        {/* Add Fighter Input Form */}
        {showAddFighter && (
          <form onSubmit={handleAddFighter} className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 animate-fadeIn">
            <label className="text-[10px] font-bold text-indigo-950 block">New Contender Name:</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newFighterName}
                onChange={(e) => setNewFighterName(e.target.value)}
                placeholder="e.g. Slimy Sticky, Phoenix Vibe..."
                className="flex-1 px-2.5 py-1 text-xs bg-white border border-indigo-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-sans"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2-CONTENDER MODE (Classic Red vs Blue WINNER vs LOSER) */}
      {/* ========================================================================= */}
      {targetContenderCount === 2 && (
        <div className="mt-2 animate-fadeIn">
          {/* WINNER vs LOSER Header */}
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[19px] sm:text-[21px] font-black text-[#E51E2B] tracking-tight leading-none">
              WINNER
            </span>
            <span className="text-[19px] sm:text-[21px] font-black text-[#1D3D8F] tracking-tight leading-none">
              LOSER
            </span>
          </div>

          <div className="text-[11.5px] font-extrabold text-slate-900 mb-1.5">
            Preference estimate
          </div>

          {/* Faces & Percentages Row */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={p1.avatar}
                alt={p1.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
              />
              <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
                {p1Pct.toFixed(1)}%
              </span>
            </div>

            <div className="text-[12px] font-bold text-slate-900 tabular-nums px-1">
              0:00:00
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
                {p2Pct.toFixed(1)}%
              </span>
              <img
                src={p2.avatar}
                alt={p2.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
              />
            </div>
          </div>

          {/* Names Row */}
          <div className="flex items-center justify-between mt-1 px-0.5 text-[11px] font-bold text-slate-900">
            <span>{p1.name}</span>
            <span>{p2.name}</span>
          </div>

          {/* Dual Like Buttons */}
          <div className="w-full flex items-center justify-between gap-2 mt-2.5">
            <button
              type="button"
              onClick={() => handleVote(p1.id)}
              className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
                votedContenderId === p1.id
                  ? 'bg-[#E51E2B] ring-2 ring-red-400 ring-offset-1'
                  : 'bg-[#E51E2B] hover:bg-[#D41825]'
              }`}
              title={`Vote for ${p1.name}`}
            >
              <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
            </button>

            <div className="flex items-center justify-center gap-2 shrink-0">
              <div className="text-center min-w-[50px]">
                <div className="text-[12px] font-bold text-black tabular-nums leading-none">
                  {p1.votes.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">Likes</div>
              </div>
              <div className="w-[1px] h-6 bg-slate-300 shrink-0" />
              <div className="text-center min-w-[50px]">
                <div className="text-[12px] font-bold text-black tabular-nums leading-none">
                  {p2.votes.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">Likes</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleVote(p2.id)}
              className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
                votedContenderId === p2.id
                  ? 'bg-[#1D3D8F] ring-2 ring-blue-400 ring-offset-1'
                  : 'bg-[#1D3D8F] hover:bg-[#183275]'
              }`}
              title={`Vote for ${p2.name}`}
            >
              <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" />
            </button>
          </div>

          {/* Split Color Progress Bar */}
          <div className="w-full mt-3">
            <div className="w-full flex items-center gap-[3px]">
              <div className="h-[6px] bg-[#E51E2B] rounded-full transition-all duration-300" style={{ width: `${p1Pct}%` }} />
              <div className="h-[6px] bg-[#1D3D8F] rounded-full transition-all duration-300" style={{ width: `${p2Pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10.5px] font-bold mt-0.5 px-0.5">
              <span className="text-[#E51E2B]">Red ({p1Pct.toFixed(1)}%)</span>
              <span className="text-[#1D3D8F]">Blue ({p2Pct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3+ OR 10 OR 10,000 CONTENDERS ARENA MODE */}
      {/* ========================================================================= */}
      {targetContenderCount > 2 && (
        <div className="mt-2.5 space-y-3 animate-fadeIn">
          {/* Header Banner for Arena */}
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {targetContenderCount >= 10000 ? '10,000 Global Contenders Battle' : `${targetContenderCount} Contenders Battle Arena`}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {totalVotes.toLocaleString()} Total Votes Cast
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
              Live Battle
            </span>
          </div>

          {/* Search Box if > 4 contenders */}
          {activeContenders.length > 4 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search among contenders...`}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Multi-Segment Proportional Progress Bar */}
          <div className="w-full space-y-1">
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
              {sortedContenders.slice(0, 8).map((c) => {
                const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 10;
                return (
                  <div
                    key={c.id}
                    className="h-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: c.color || '#9333EA' }}
                    title={`${c.name}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-0.5">
              <span className="text-amber-600 font-extrabold flex items-center gap-1">
                <span>🥇 Leader: {sortedContenders[0]?.name}</span>
              </span>
              <span>
                {totalVotes > 0
                  ? `${((sortedContenders[0]?.votes / totalVotes) * 100).toFixed(1)}% share`
                  : ''}
              </span>
            </div>
          </div>

          {/* Scrollable Contenders Ranked Leaderboard */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5 scrollbar-thin">
            {filteredContenders.map((c, idx) => {
              const rank = idx + 1;
              const isVoted = votedContenderId === c.id;
              const pct = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : '0.0';

              return (
                <div
                  key={c.id}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isVoted
                      ? 'bg-purple-50 border-purple-300 shadow-xs'
                      : rank === 1
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                        rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-2xs'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rank === 1 ? '1' : rank === 2 ? '2' : rank === 3 ? '3' : rank}
                    </div>

                    {/* Avatar */}
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />

                    {/* Name & Title */}
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-black text-slate-900 truncate">
                        {c.name}
                      </div>
                      <div className="text-[9.5px] text-slate-500 truncate flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-700">{pct}%</span>
                        <span>&bull;</span>
                        <span>{c.votes.toLocaleString()} votes</span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <button
                    type="button"
                    onClick={() => handleVote(c.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                      isVoted
                        ? 'bg-purple-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <AeriBattleThumbsUpIcon className="w-3 h-3" contrastColor={isVoted ? '#9333EA' : '#000000'} facing="right" />
                    <span>{isVoted ? 'Voted' : 'Vote'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {targetContenderCount > activeContenders.length && (
            <div className="text-center py-1 bg-slate-50 rounded-lg border border-slate-200/60 text-[10px] text-slate-500 font-medium">
              Showing top contenders in battle of <strong>{targetContenderCount.toLocaleString()}</strong> fighters worldwide
            </div>
          )}
        </div>
      )}

      {/* Bottom Double Yellow Line with Upward Triangle */}
      <div className="w-full mt-3 relative pt-1">
        <div className="w-full flex flex-col gap-[2.5px]">
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
          <div className="w-full h-[3px] bg-[#F5C21B] rounded-full" />
        </div>

        {/* Upward yellow triangle pointer */}
        <div
          className="absolute -top-[5.5px] -translate-x-1/2 pointer-events-none transition-all duration-300"
          style={{ left: targetContenderCount === 2 ? `${p1Pct}%` : '50%' }}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#F5C21B]" />
        </div>
      </div>

      {/* People's Comments on the Challenge */}
      <div className="w-full pt-2.5 mt-2.5 border-t border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11.5px] font-black text-slate-900 tracking-tight cursor-pointer hover:text-purple-600 transition-colors"
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
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
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
                    <p className="text-[10.5px] text-slate-700 leading-snug mt-0.5">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Comment on this challenge..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-sans"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
