import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Video } from 'lucide-react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';

export interface ChallengePostPayload {
  caption: string;
  battleQuestion: string;
  mediaUrl: string;
  tags: string[];
  opponentName: string;
  opponentHandle: string;
  opponentAvatar: string;
  challengerName: string;
  challengerAvatar: string;
}

interface ChallengePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishChallenge: (payload: ChallengePostPayload) => void;
  opponentName: string;
  opponentHandle?: string;
  opponentAvatar?: string;
  currentUser?: {
    name: string;
    handle: string;
    avatar: string;
  };
}

/**
 * Adverb Mode - Challenge the person.
 * What you type in the challenge box live-updates and changes
 * "Who looks Hotter between me [Name] or this loser [Opponent]".
 */
export const ChallengePostModal: React.FC<ChallengePostModalProps> = ({
  isOpen,
  onClose,
  onPublishChallenge,
  opponentName,
  opponentHandle = '@opponent',
  opponentAvatar = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  currentUser = {
    name: 'Freda Da. pepper',
    handle: '@freda_pepper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
}) => {
  // Single synchronized challenge state so what the user types changes "Who looks Hotter between..." in real-time
  const [challengeText, setChallengeText] = useState(
    `Who looks Hotter between me ${currentUser.name} or this loser ${opponentName}`
  );

  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80'
  );
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const [userVote, setUserVote] = useState<'red' | 'blue' | null>(null);
  const [likes, setLikes] = useState<number>(234095);
  const [dislikes, setDislikes] = useState<number>(90000);
  const [redPct, setRedPct] = useState<number>(52.0);
  const [bluePct, setBluePct] = useState<number>(48.0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');
    setMediaUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalChallenge = challengeText.trim();
    if (!finalChallenge) return;

    onPublishChallenge({
      caption: finalChallenge,
      battleQuestion: finalChallenge,
      mediaUrl,
      tags: ['#brokenpencil', '#faceoff', '#onlinefight'],
      opponentName,
      opponentHandle,
      opponentAvatar,
      challengerName: currentUser.name,
      challengerAvatar: currentUser.avatar,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 sm:p-4 relative select-none animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close"
          title="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Mode Tag */}
        <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md mb-2 uppercase tracking-wide">
          Adverb &bull; Challenge Person Online
        </div>

        {/* 1. Header Question: changes in real-time as you type your challenge below */}
        <div className="pr-6">
          <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900 leading-snug tracking-tight transition-all">
            {challengeText || `Who looks Hotter between me ${currentUser.name} or this loser ${opponentName}`}
          </h2>
        </div>

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
          {/* Challenger Left / Red */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
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

          {/* Opponent Right / Blue */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 tabular-nums">
              {bluePct.toFixed(1)}%
            </span>
            <img
              src={opponentAvatar}
              alt={opponentName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs ring-1 ring-slate-200"
            />
          </div>
        </div>

        {/* 5. Names Row */}
        <div className="flex items-center justify-between mt-1 px-0.5 text-[11px] font-bold text-slate-900">
          <span>{currentUser.name}</span>
          <span>{opponentName}</span>
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
            title="Vote Red"
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

          {/* Blue Like Button (in former place on right, facing left) */}
          <button
            type="button"
            onClick={() => handleVote('blue')}
            className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
              userVote === 'blue'
                ? 'bg-[#1D3D8F] ring-2 ring-blue-400 ring-offset-1'
                : 'bg-[#1D3D8F] hover:bg-[#183275]'
            }`}
            title="Vote Blue"
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

          <div
            className="absolute -top-[5.5px] -translate-x-1/2 pointer-events-none transition-all duration-300"
            style={{ left: `${redPct}%` }}
          >
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#F5C21B]" />
          </div>
        </div>

        {/* 9. Create Post Section: Media & Writing */}
        <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-200/80 space-y-3">
          {/* Post Media (Photo / Video for the challenge post) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Post Media (Photo / Video):</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Change Media</span>
              </button>
            </div>

            <div className="relative w-full h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
              {mediaType === 'video' ? (
                <video src={mediaUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={mediaUrl} alt="Post preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-1.5 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-md text-white text-[9.5px] font-bold flex items-center gap-1">
                {mediaType === 'video' ? <Video className="w-3 h-3 text-indigo-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                <span>Challenge Post Media</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Post Challenge Writing: Directly updates the header above */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-slate-800">
                Write your challenge:
              </label>
              <span className="text-[9.5px] font-semibold text-purple-600">
                Live-updates card title above
              </span>
            </div>
            <textarea
              rows={2}
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder={`Write what appears on the faceoff card (e.g. Who looks Hotter between me ${currentUser.name} or this loser ${opponentName})`}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 text-xs font-bold text-slate-900 outline-none resize-none leading-snug"
              required
            />
          </div>

          {/* Submit Button WITHOUT paper plane icon */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#E51E2B] hover:bg-[#D41825] active:scale-98 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center text-center"
          >
            Submit Challenge Post
          </button>
        </form>
      </div>
    </div>
  );
};
