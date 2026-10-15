import React, { useState, useRef } from 'react';
import { AeriCommentIcon } from './AeriCommentIcon';
import { AeriDoubleTriangleIcon } from './AeriDoubleTriangleIcon';
import { AeriFlameIcon } from './AeriFlameIcon';
import { AeriHandPhoneIcon } from './AeriHandPhoneIcon';
import { AeriMaskedEyesIcon } from './AeriMaskedEyesIcon';
import { AeriMessageBubbleIcon } from './AeriMessageBubbleIcon';
import { AeriRaygunIcon } from './AeriRaygunIcon';
import { BrokenPencilIcon } from './BrokenPencilIcon';
import { FaceoffBattleModal } from './FaceoffBattleModal';
import { PhoneReactionPopup } from './PhoneReactionPopup';
import { InfluenceRatingModal } from './InfluenceRatingModal';
import { RaygunActionModal } from './RaygunActionModal';
import { User } from 'lucide-react';
import { getSafeMediaUrl, DEFAULT_FALLBACK_IMAGE } from '../lib/imageUpload';

export interface TweetPostItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified?: boolean;
  timeAgo: string;
  location?: string;
  mediaType?: 'image' | 'video' | 'tweet';
  isTweet?: boolean;
  tweetContent?: string;
  mediaUrl?: string;
  caption?: string;
  tags?: string[];
  audioTitle?: string;
  likeCount: number;
  isLiked: boolean;
  isTrending?: boolean;
  retweetCount?: number;
  isRetweeted?: boolean;
  replyCount?: number;
  viewCount?: string;
  isBookmarked?: boolean;
  faceoffConfig?: {
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
  };
}

interface TweetPostCardProps {
  post: TweetPostItem;
  onToggleLike: (id: string) => void;
  onOpenComments: () => void;
  onOpenSendMessage: (person: { id: string; name: string; handle: string; avatarUrl: string }) => void;
  onTogglePhoneReaction: (id: string) => void;
  onToggleInfluenceRating: (id: string) => void;
  onToggleRaygun?: (id: string, name: string, avatar?: string, handle?: string) => void;
  isRaygunActive?: boolean;
  onCloseRaygun?: () => void;
  onSelectVerb?: () => void;
  onSelectAdverb?: () => void;
  isPhoneReactionActive?: boolean;
  isInfluenceRatingActive?: boolean;
  onCloseInfluenceRating?: () => void;
  isFaceoffOpen?: boolean;
  isMorphed?: boolean;
  onToggleFaceoff: (id: string) => void;
  onCloseFaceoff: (id: string) => void;
  onMorphPencil: (id: string) => void;
  onNoAdverb?: () => void;
  onOpenStarStamps?: () => void;
  onRatingSubmit?: (rating: number) => void;
  onRatingReset?: () => void;
  authorPhoneLikes?: number;
  authorRank?: number;
  onPhoneVote?: (postId: string, authorName: string, type: 'like' | 'dislike' | 'unvote' | 'reset', newLikes: number, newDislikes: number) => void;
}

export const TweetPostCard: React.FC<TweetPostCardProps> = ({
  post,
  onToggleLike,
  onOpenComments,
  onOpenSendMessage,
  onTogglePhoneReaction,
  onToggleInfluenceRating,
  onToggleRaygun,
  isRaygunActive = false,
  onCloseRaygun,
  onSelectVerb,
  onSelectAdverb,
  isPhoneReactionActive = false,
  isInfluenceRatingActive = false,
  onCloseInfluenceRating,
  isFaceoffOpen = false,
  isMorphed = false,
  onToggleFaceoff,
  onCloseFaceoff,
  onMorphPencil,
  onNoAdverb,
  onOpenStarStamps,
  onRatingSubmit,
  onRatingReset,
  authorPhoneLikes = 0,
  authorRank,
  onPhoneVote,
}) => {
  const [isRetweeted, setIsRetweeted] = useState(Boolean(post.isRetweeted));
  const [retweetCount, setRetweetCount] = useState(post.retweetCount ?? 14);
  const [showNoAdverbNotice, setShowNoAdverbNotice] = useState(false);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBrokenPencilClick = () => {
    if (post.faceoffConfig) {
      onToggleFaceoff(post.id);
    } else {
      setShowNoAdverbNotice((prev) => {
        const next = !prev;
        if (noticeTimerRef.current) {
          clearTimeout(noticeTimerRef.current);
          noticeTimerRef.current = null;
        }
        if (next) {
          noticeTimerRef.current = setTimeout(() => {
            setShowNoAdverbNotice(false);
          }, 3500);
        }
        return next;
      });
      onNoAdverb?.();
    }
  };

  const handleToggleRetweet = () => {
    setIsRetweeted((prev) => {
      const next = !prev;
      setRetweetCount((count) => (next ? count + 1 : count - 1));
      return next;
    });
  };

  const displayText = post.tweetContent || post.caption || '';

  // Function to highlight hashtags and handles in tweet text
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/([#@][\w_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all duration-200 p-3.5 space-y-2.5 relative">
      {/* Top phone reaction popup if active */}
      {isPhoneReactionActive && (
        <div className="w-full flex justify-center pb-1">
          <PhoneReactionPopup
            personName={post.authorName}
            currentRank={authorRank}
            initialLikes={authorPhoneLikes}
            onVote={(type, newLikes, newDislikes) => {
              onPhoneVote?.(post.id, post.authorName, type, newLikes, newDislikes);
            }}
          />
        </div>
      )}

      {/* Tweet Author & Profile Header */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                onClick={() => onTogglePhoneReaction(post.id)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
              />
            ) : null}
            <div
              onClick={() => onTogglePhoneReaction(post.id)}
              style={{ display: post.authorAvatar ? 'none' : 'flex' }}
              className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 items-center justify-center p-0.5 shadow-xs cursor-pointer hover:border-slate-400 transition-all"
              title="Profile icon"
            >
              <User className="w-5 h-5 text-slate-400 stroke-[1.6]" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-black text-slate-900 tracking-tight hover:underline cursor-pointer">
                {post.authorName}
              </span>
              <span className="text-xs text-slate-400 font-medium">{post.authorHandle}</span>
              <span className="text-xs text-slate-300">&middot;</span>
              <span className="text-xs text-slate-400 font-medium">{post.timeAgo}</span>
            </div>
            {post.location && (
              <span className="text-[10.5px] text-slate-400 font-normal">{post.location}</span>
            )}
          </div>
        </div>

        {/* Right side: Trending badge & Ongoing status & Broken pencil toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {post.isTrending && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0F5] border border-pink-100/80 shadow-2xs">
              <AeriFlameIcon filled className="w-3 h-3 text-[#FF5722]" />
              <span className="text-[10px] font-black text-[#8B2FC9] tracking-tight">Trending</span>
            </div>
          )}

          {/* Ongoing Challenge Status Indicator when adverb challenge exists */}
          {Boolean(post.faceoffConfig) && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-2xs transition-all ${
                isFaceoffOpen
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
              title={
                isFaceoffOpen
                  ? 'Challenge is ongoing (display is ON)'
                  : 'Challenge is ongoing (display is OFF - click broken pencil to view)'
              }
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9.5px] font-extrabold tracking-tight">
                Ongoing
              </span>
            </div>
          )}

          {/* Simple 'No adverb yet' text (not a button) */}
          {!post.faceoffConfig && showNoAdverbNotice && (
            <span className="text-xs font-bold text-purple-700 tracking-tight animate-in fade-in select-none whitespace-nowrap">
              No adverb yet
            </span>
          )}

          {/* Broken pencil icon with on/off toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={handleBrokenPencilClick}
              title={
                post.faceoffConfig
                  ? isFaceoffOpen
                    ? 'Turn OFF challenge display'
                    : 'Turn ON challenge display (Challenge is ongoing)'
                  : showNoAdverbNotice
                    ? 'Turn OFF notice'
                    : 'Broken pencil · No adverb yet'
              }
              className={`cursor-pointer -translate-y-0.5 hover:opacity-80 transition-all active:scale-95 flex items-center justify-center ${
                post.faceoffConfig
                  ? isFaceoffOpen
                    ? 'ring-2 ring-emerald-400/50 rounded-md p-0.5 bg-emerald-50/40'
                    : 'opacity-90'
                  : 'opacity-75 hover:opacity-100'
              }`}
              aria-label="Broken pencil challenge toggle"
            >
              <BrokenPencilIcon className="w-[44px] h-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tweet Body Text */}
      <div className="text-[14.5px] leading-relaxed text-slate-900 font-normal whitespace-pre-wrap break-words pl-0.5">
        {renderFormattedText(displayText)}
      </div>

      {/* Embedded Twitter Faceoff Battle Challenge Card (Controlled by isFaceoffOpen toggle) */}
      {post.faceoffConfig && isFaceoffOpen && (
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-1 sm:p-2 mt-1.5 shadow-2xs overflow-hidden animate-fadeIn">
          {/* Header Bar indicating Ongoing Challenge status & Turn Off toggle */}
          <div className="w-full flex items-center justify-between px-2 pt-1 pb-1.5 mb-1 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black text-emerald-800 tracking-tight">
                Challenge Ongoing &bull; Live Match
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCloseFaceoff(post.id)}
              className="text-[10px] font-extrabold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Turn OFF challenge display"
            >
              Turn OFF
            </button>
          </div>
          <FaceoffBattleModal
            onClose={() => onCloseFaceoff(post.id)}
            battleQuestion={post.faceoffConfig.battleQuestion}
            totalParticipants={(post.faceoffConfig as any)?.totalParticipants}
            participants={(post.faceoffConfig as any)?.participants}
            redParticipant={post.faceoffConfig.redParticipant}
            blueParticipant={post.faceoffConfig.blueParticipant}
            className="w-full max-w-full border-0 shadow-none bg-transparent p-2 sm:p-2.5"
          />
        </div>
      )}

      {/* Attached Sitch Photo / Media if exists (Full picture display) */}
      {post.mediaUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 max-h-[550px] flex items-center justify-center shadow-2xs group">
          <div
            className="absolute inset-0 bg-center bg-cover blur-xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${getSafeMediaUrl(post.mediaUrl)})` }}
          />
          <img
            src={getSafeMediaUrl(post.mediaUrl)}
            alt="Sitch attachment"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
            }}
            className="relative z-10 w-full h-auto max-h-[550px] object-contain mx-auto"
          />
        </div>
      )}

      {/* User's Own Action Icons Bar (Flame, Comment, Message, Phone, Masked Eyes) */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 text-black w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2.5 sm:gap-4 shrink min-w-0">
          {/* 1. Like with AeriFlameIcon */}
          <button
            onClick={() => onToggleLike(post.id)}
            className="cursor-pointer transition-transform active:scale-90 flex items-center gap-1 group py-1"
            title="Like"
            aria-label="Like post"
          >
            <AeriFlameIcon
              filled={post.isLiked}
              className={`w-5 h-5 transition-colors ${
                post.isLiked ? 'text-[#FF6D00]' : 'text-black stroke-[1.8]'
              }`}
            />
            <span
              className={`text-xs tabular-nums font-semibold ${
                post.isLiked ? 'text-[#FF6D00]' : 'text-black'
              }`}
            >
              {post.likeCount}
            </span>
          </button>

          {/* 2. Comment / Reply with AeriCommentIcon */}
          <button
            onClick={onOpenComments}
            className="cursor-pointer transition-transform active:scale-90 hover:opacity-80 flex items-center gap-1 group py-1"
            title="Reply"
            aria-label="Reply"
          >
            <AeriCommentIcon className="w-5 h-5 text-black stroke-[1.8]" />
            <span className="text-xs text-black tabular-nums font-semibold">
              {post.replyCount ?? 18}
            </span>
          </button>

          {/* 3. Message icon (replaces 3rd icon only on sitch/tweet box) */}
          <button
            onClick={() =>
              onOpenSendMessage({
                id: 'p-' + post.authorHandle,
                name: post.authorName,
                handle: post.authorHandle,
                avatarUrl: post.authorAvatar,
              })
            }
            className="cursor-pointer transition-transform active:scale-90 hover:opacity-80 flex items-center gap-1.5 group py-1 text-black"
            title="Direct Message"
            aria-label="Direct Message"
          >
            <AeriMessageBubbleIcon className="w-5 h-5 text-black" color="#000000" />
          </button>

          {/* 4. Phone reaction with AeriHandPhoneIcon */}
          <button
            onClick={() => onTogglePhoneReaction(post.id)}
            className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center py-1 text-black"
            title="Phone Reaction"
            aria-label="Phone Reaction"
          >
            <AeriHandPhoneIcon className="w-5 h-5 text-black stroke-[1.8]" />
          </button>

          {/* 5. Masked eyes rating with AeriMaskedEyesIcon */}
          <button
            onClick={() => onToggleInfluenceRating(post.id)}
            className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center py-1 text-black"
            title="Overall ratings & Social reach"
            aria-label="Overall ratings & Social reach"
          >
            <AeriMaskedEyesIcon className="w-6 h-4 text-black shrink-0" />
          </button>
        </div>

        {/* Raygun button on far right */}
        <button
          onClick={() => {
            if (onToggleRaygun) {
              onToggleRaygun(post.id, post.authorName, post.authorAvatar, post.authorHandle);
            }
          }}
          className="cursor-pointer transition-transform active:scale-90 hover:opacity-80 flex items-center justify-center p-1 text-black hover:text-purple-600 shrink-0"
          title="Raygun Arena (Verb / Adverb)"
          aria-label="Raygun Arena (Verb / Adverb)"
        >
          <AeriRaygunIcon
            size={22}
            className={`w-5.5 h-5.5 transition-colors ${
              isRaygunActive || isRetweeted ? 'text-purple-600' : 'text-black'
            }`}
          />
        </button>
      </div>

      {/* Raygun Action Modal (Verb / Adverb) placed down on tweet post when raygun is active */}
      {isRaygunActive && (
        <div className="w-full pt-1.5 pb-1 flex justify-end animate-fadeIn">
          <RaygunActionModal
            isOpen={true}
            isInline={true}
            targetPersonName={post.authorName}
            targetPersonAvatar={post.authorAvatar}
            onClose={() => (onCloseRaygun ? onCloseRaygun() : onToggleRaygun?.(post.id, post.authorName, post.authorAvatar, post.authorHandle))}
            onSelectVerb={() => {
              onCloseRaygun?.();
              onSelectVerb?.();
            }}
            onSelectAdverb={() => {
              onCloseRaygun?.();
              onSelectAdverb?.();
            }}
          />
        </div>
      )}

      {/* Influence Rating Card placed down on tweet post when masked 2 eyes icon is clicked */}
      {isInfluenceRatingActive && (
        <div className="w-full pt-1 pb-1 px-0.5 border-t border-slate-100 animate-fadeIn">
          <InfluenceRatingModal
            isOpen={true}
            isInline={true}
            targetName={post.authorName}
            onClose={() => (onCloseInfluenceRating ? onCloseInfluenceRating() : onToggleInfluenceRating(post.id))}
            onRatingSubmit={onRatingSubmit}
            onRatingReset={onRatingReset}
            onOpenStarStamps={onOpenStarStamps}
          />
        </div>
      )}
    </div>
  );
};
