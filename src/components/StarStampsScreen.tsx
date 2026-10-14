import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Plus,
  Quote,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Send,
  Sparkles,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  StarStamp,
  StarStampCategory,
  StarStampStatus,
  loadStarStamps,
  rateStarStamp,
  addStarStampComment,
  voteStarStampOutcome,
} from '../data/starStamps';
import { CreateStarStampModal } from './CreateStarStampModal';
import { syncStarStampToSupabase } from '../lib/fairyBackend';
import { syncActivityToRepo } from '../lib/repoSync';

interface StarStampsScreenProps {
  onBackToFeed: () => void;
  initialSearchQuery?: string;
  hideHeader?: boolean;
}

export function StarStampsScreen({
  onBackToFeed,
  initialSearchQuery = '',
  hideHeader = false,
}: StarStampsScreenProps) {
  const [stamps, setStamps] = useState<StarStamp[]>(() => loadStarStamps());
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [ratingInputs, setRatingInputs] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync when stamps change
  useEffect(() => {
    const handleSync = () => {
      setStamps(loadStarStamps());
    };
    window.addEventListener('fairy_star_stamps_sync', handleSync);
    return () => window.removeEventListener('fairy_star_stamps_sync', handleSync);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleRate = (stampId: string, rating: number) => {
    const updated = rateStarStamp(stampId, rating);
    setStamps(updated);
    const targetStamp = updated.find((s) => s.id === stampId);
    if (targetStamp) {
      syncStarStampToSupabase(targetStamp);
      syncActivityToRepo('rate_star_stamp', `Rated ${rating} stars on Star Stamp #${targetStamp.stampNumber} (${targetStamp.promiserName})`, { stampId, rating }, true);
    }
    showToast(`Rated ${rating} stars on verbal commitment!`);
  };

  const handleVote = (stampId: string, voteType: 'fulfilled' | 'active' | 'broken') => {
    const updated = voteStarStampOutcome(stampId, voteType);
    setStamps(updated);
    const targetStamp = updated.find((s) => s.id === stampId);
    if (targetStamp) {
      syncStarStampToSupabase(targetStamp);
      syncActivityToRepo('vote_star_stamp_outcome', `Voted "${voteType}" on Star Stamp #${targetStamp.stampNumber} (${targetStamp.promiserName})`, { stampId, voteType }, true);
    }
    showToast(`Recorded outcome vote: ${voteType}!`);
  };

  const handleAddComment = (stampId: string) => {
    const text = commentInputs[stampId]?.trim();
    if (!text) return;
    const rating = ratingInputs[stampId];

    const updated = addStarStampComment(stampId, {
      author: 'You',
      authorHandle: '@you',
      text,
      rating,
    });
    setStamps(updated);
    setCommentInputs((prev) => ({ ...prev, [stampId]: '' }));
    setRatingInputs((prev) => ({ ...prev, [stampId]: 0 }));

    const targetStamp = updated.find((s) => s.id === stampId);
    if (targetStamp) {
      syncStarStampToSupabase(targetStamp);
      syncActivityToRepo('comment_star_stamp', `Added proof comment to Star Stamp #${targetStamp.stampNumber} (${targetStamp.promiserName})`, { stampId, text }, true);
    }
    showToast('Feedback and proof posted to Star Stamp!');
  };

  const filteredStamps = stamps.filter((stamp) => {
    // Category filter
    if (selectedCategory !== 'all' && stamp.category !== selectedCategory) {
      return false;
    }
    // Status filter
    if (selectedStatus !== 'all' && stamp.status !== selectedStatus) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = stamp.promiserName.toLowerCase().includes(q);
      const matchRole = stamp.promiserRole.toLowerCase().includes(q);
      const matchHandle = stamp.promiserHandle.toLowerCase().includes(q);
      const matchQuote = stamp.verbalCommitment.toLowerCase().includes(q);
      const matchSource = stamp.contextSource.toLowerCase().includes(q);
      const matchCreator = stamp.createdBy.toLowerCase().includes(q);
      const matchTags = stamp.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchRole || matchHandle || matchQuote || matchSource || matchCreator || matchTags;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Politician', label: 'Politicians' },
    { id: 'CEO / Tech', label: 'CEOs & Tech' },
    { id: 'Creator / Artist', label: 'Creators' },
    { id: 'Everyday / Peer', label: 'Everyday / Peers' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFA] text-slate-900 select-none overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header (Single header - only rendered if not embedded) */}
      {!hideHeader && (
        <header className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0 z-10 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={onBackToFeed}
              className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-black transition-colors cursor-pointer shrink-0"
              aria-label="Back to feed"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-white" />
                </span>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight truncate">
                  Star Stamp Directory
                </h1>
                <span className="px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold bg-amber-100 text-amber-900 shrink-0">
                  Verbal
                </span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                Hold politicians, CEOs, creators & peers accountable
              </p>
            </div>
          </div>

          {/* Action Button: Create a Star Stamp - compact "+ Create" on narrow screens */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 active:scale-95 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer shrink-0"
            title="Create Star Stamp"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Create Star Stamp</span>
            <span className="sm:hidden">+ Create</span>
          </button>
        </header>
      )}

      {/* Search & Filter Controls */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-b border-slate-100 space-y-2 shrink-0 max-w-full overflow-hidden">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people or promises..."
            className="w-full pl-9 pr-14 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200/70 focus:border-amber-400 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-colors truncate"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category & Status Filter Pills with Horizontal Scroll & Right Edge Fade */}
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 pr-8">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-slate-200 shrink-0 mx-1" />

            {/* Status quick toggle */}
            {['all', 'active', 'fulfilled', 'broken'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {/* Fade on right edge so users can tell they scroll */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0.5 w-7 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-4">
        {filteredStamps.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800">
              No Star Stamps found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Nobody with that name or quote has been stamped yet. Anyone can create the first Star Stamp!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              ★ Stamp This Commitment Now
            </button>
          </div>
        ) : (
          filteredStamps.map((stamp) => {
            const isCommentsOpen = expandedCommentsId === stamp.id;
            const currentRatingInput = ratingInputs[stamp.id] || 0;

            return (
              <div
                key={stamp.id}
                className="w-full max-w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Official Star Stamp Top Ribbon */}
                <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-purple-500/10 border-b border-amber-200/60 flex items-center justify-between gap-1.5 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                    {/* Golden Star Stamp Badge */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs tracking-wider shrink-0">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{stamp.stampNumber}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-700 uppercase tracking-wide truncate">
                      Verbal Commitment
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0">
                    {stamp.status === 'fulfilled' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Fulfilled</span>
                      </span>
                    ) : stamp.status === 'broken' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Broken</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Speaker Profile Header */}
                <div className="px-3 sm:px-5 pt-3 pb-2 flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${stamp.promiserAvatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white`}
                    >
                      {stamp.promiserAvatarInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="text-sm font-black text-slate-900 leading-tight truncate">
                          {stamp.promiserName}
                        </h2>
                        <span className="px-1.5 py-0.2 rounded-md text-[9.5px] font-bold bg-slate-100 text-slate-700 shrink-0">
                          {stamp.category}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                        {stamp.promiserRole} &middot; <span className="text-slate-700">{stamp.promiserHandle}</span>
                      </p>
                    </div>
                  </div>

                  {/* Overall Star Score */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span className="text-base font-black text-slate-900">
                        {stamp.overallRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block">
                      {stamp.ratingsCount.toLocaleString()} ratings
                    </span>
                  </div>
                </div>

                {/* The Exact Verbal Commitment Quotation Box */}
                <div className="px-3 sm:px-5 py-2 max-w-full overflow-hidden">
                  <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 relative max-w-full overflow-hidden">
                    <Quote className="w-5 h-5 text-amber-300 absolute top-2.5 right-3 pointer-events-none" />
                    <span className="text-[9.5px] font-black uppercase text-amber-800 tracking-wider block mb-1">
                      Verbal Commitment Quoted:
                    </span>
                    <p className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-relaxed italic pr-5 break-words">
                      &ldquo;{stamp.verbalCommitment}&rdquo;
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-[10.5px] text-slate-600 gap-1.5 min-w-0">
                      <div className="flex items-center gap-1 font-medium min-w-0 truncate">
                        <span className="font-bold text-slate-800 shrink-0">Spoken at:</span>
                        <span className="truncate">{stamp.contextSource}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium shrink-0">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span className="font-bold text-slate-800">Due:</span>
                        <span className="text-amber-900 font-bold">{stamp.targetDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {stamp.tags.length > 0 && (
                  <div className="px-3 sm:px-5 py-1 flex flex-wrap gap-1 max-w-full overflow-hidden">
                    {stamp.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[10px] sm:text-[10.5px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Accountability & Rating Action Bar */}
                <div className="px-3 sm:px-5 py-2.5 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2 min-w-0 overflow-hidden">
                  {/* Left: Interactive 5-Star Rating Widget */}
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-[10.5px] font-black text-slate-700 shrink-0">
                      Rate:
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (stamp.userRating || 0) >= starVal;
                        return (
                          <button
                            key={starVal}
                            onClick={() => handleRate(stamp.id, starVal)}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                            title={`Rate ${starVal} stars`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    {stamp.userRating && (
                      <span className="text-[9.5px] font-bold text-emerald-600 shrink-0">
                        ({stamp.userRating}★)
                      </span>
                    )}
                  </div>

                  {/* Right: Community Status Voting & Comments Toggle */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 p-0.5 rounded-xl text-[10px] font-bold shrink-0">
                      <button
                        onClick={() => handleVote(stamp.id, 'fulfilled')}
                        className="px-1.5 py-0.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg cursor-pointer transition-colors"
                        title="Vote Fulfilled"
                      >
                        ✓ ({stamp.communityVotes.fulfilled})
                      </button>
                      <button
                        onClick={() => handleVote(stamp.id, 'broken')}
                        className="px-1.5 py-0.5 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                        title="Vote Broken"
                      >
                        ✗ ({stamp.communityVotes.broken})
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedCommentsId(isCommentsOpen ? null : stamp.id)
                      }
                      className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
                    >
                      <MessageSquare className="w-3 h-3 text-purple-600" />
                      <span>{stamp.comments.length}</span>
                      {isCommentsOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Comments & Public Proof Section */}
                {isCommentsOpen && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3 animate-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Public Comments & Receipt Proofs ({stamp.comments.length})
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Stamped by {stamp.createdBy} ({stamp.createdHandle})
                      </span>
                    </div>

                    {/* New Comment / Feedback Input Box */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <textarea
                        rows={2}
                        value={commentInputs[stamp.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [stamp.id]: e.target.value,
                          }))
                        }
                        placeholder="Add your comments, verify whether they delivered, or post proof..."
                        className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                      />

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        {/* Rating selector for this comment */}
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                          <span>Include rating:</span>
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setRatingInputs((prev) => ({
                                  ...prev,
                                  [stamp.id]: val,
                                }))
                              }
                              className="cursor-pointer"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  currentRatingInput >= val
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleAddComment(stamp.id)}
                          className="px-3.5 py-1.5 bg-black hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Send className="w-3 h-3 text-amber-400" />
                          <span>Post Feedback</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {stamp.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-slate-900">
                                {comm.author}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {comm.authorHandle}
                              </span>
                              {comm.isVerifiedReceipt && (
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black">
                                  RECEIPT ATTACHED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                              {comm.timeAgo}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 leading-relaxed">
                            {comm.text}
                          </p>

                          {comm.rating && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 pt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Rated {comm.rating.toFixed(1)} ★</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal to make new Star Stamp */}
      <CreateStarStampModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setStamps(loadStarStamps());
          showToast('★ Star Stamp created and published to directory!');
        }}
      />
    </div>
  );
}

export default StarStampsScreen;
