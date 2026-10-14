import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Video, Users, Plus, Trophy } from 'lucide-react';
import { AeriBattleThumbsUpIcon } from './AeriBattleThumbsUpIcon';
import { BattleParticipant } from './FaceoffBattleModal';

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
  totalParticipants?: number;
  participants?: BattleParticipant[];
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
 * Supports any amount of contenders: 2, 3, 10, up to 10,000!
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
  const [totalContenders, setTotalContenders] = useState<number>(2);
  const [customScale, setCustomScale] = useState<string>('');
  const [showAddFighter, setShowAddFighter] = useState(false);
  const [newFighterName, setNewFighterName] = useState('');

  // Additional custom named contenders
  const [extraContenders, setExtraContenders] = useState<Array<{ name: string; avatar: string }>>([]);

  // Single synchronized challenge state so what the user types changes title in real-time
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

  const handleAddExtraFighter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFighterName.trim()) return;

    setExtraContenders((prev) => [
      ...prev,
      {
        name: newFighterName.trim(),
        avatar: `https://images.unsplash.com/photo-${1534528741775 + extraContenders.length}?w=150&auto=format&fit=crop&q=80`,
      },
    ]);
    setTotalContenders((prev) => Math.max(prev + 1, 3));
    setNewFighterName('');
    setShowAddFighter(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalChallenge = challengeText.trim();
    if (!finalChallenge) return;

    const participantsList: BattleParticipant[] = [
      {
        id: 'p-challenger',
        name: currentUser.name,
        avatar: currentUser.avatar,
        title: 'Challenger',
        votes: likes,
        color: '#E51E2B',
      },
      {
        id: 'p-opponent',
        name: opponentName,
        avatar: opponentAvatar,
        title: 'Challenged Opponent',
        votes: dislikes,
        color: '#1D3D8F',
      },
      ...extraContenders.map((ec, idx) => ({
        id: `p-extra-${idx}`,
        name: ec.name,
        avatar: ec.avatar,
        title: 'Challenger',
        votes: Math.floor(Math.random() * 80000) + 120000,
        color: ['#9333EA', '#D97706', '#059669', '#0284C7', '#E11D48'][idx % 5],
      })),
    ];

    onPublishChallenge({
      caption: finalChallenge,
      battleQuestion: finalChallenge,
      mediaUrl,
      tags: ['#brokenpencil', '#faceoff', '#onlinefight', `#arena${totalContenders}`],
      opponentName,
      opponentHandle,
      opponentAvatar,
      challengerName: currentUser.name,
      challengerAvatar: currentUser.avatar,
      totalParticipants: totalContenders,
      participants: participantsList,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 sm:p-4 relative select-none animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto scrollbar-thin"
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
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md uppercase tracking-wide">
            Adverb &bull; Challenge Person Online
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            {totalContenders.toLocaleString()} Fighters
          </span>
        </div>

        {/* Header Question */}
        <div className="pr-6">
          <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900 leading-snug tracking-tight transition-all">
            {challengeText || `Who looks Hotter between me ${currentUser.name} or this loser ${opponentName}`}
          </h2>
        </div>

        {/* Contender Scale Selector: 2, 3, 10, or up to 10,000! */}
        <div className="my-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Contenders in Battle:</span>
            </span>
            <span className="font-mono text-purple-700 font-black">
              {totalContenders.toLocaleString()} Fighters
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { label: '2 Fighters', val: 2 },
              { label: '3 Fighters', val: 3 },
              { label: '5 Fighters', val: 5 },
              { label: '10 Fighters', val: 10 },
              { label: '100 Mega', val: 100 },
              { label: '10,000 Global Arena', val: 10000 },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => {
                  setTotalContenders(s.val);
                  if (s.val > 2) {
                    setChallengeText(`Who is the Hottest between me ${currentUser.name}, ${opponentName} and all ${s.val.toLocaleString()} contenders?`);
                  }
                }}
                className={`px-2 py-1 rounded-md font-bold shrink-0 transition-all cursor-pointer ${
                  totalContenders === s.val
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <input
              type="text"
              value={customScale}
              onChange={(e) => setCustomScale(e.target.value)}
              placeholder="Custom scale e.g. 10000"
              className="flex-1 px-2 py-1 text-[10.5px] bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const parsed = parseInt(customScale.replace(/,/g, ''), 10);
                if (!isNaN(parsed) && parsed >= 2) {
                  setTotalContenders(parsed);
                  setChallengeText(`Who is the Hottest between me ${currentUser.name}, ${opponentName} and all ${parsed.toLocaleString()} contenders?`);
                  setCustomScale('');
                }
              }}
              className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Set Count
            </button>
            <button
              type="button"
              onClick={() => setShowAddFighter(!showAddFighter)}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          {showAddFighter && (
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newFighterName}
                onChange={(e) => setNewFighterName(e.target.value)}
                placeholder="Fighter name e.g. Slimy Sticky"
                className="flex-1 px-2 py-1 text-[11px] bg-white border border-indigo-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddExtraFighter}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* WINNER vs LOSER Header */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[19px] sm:text-[21px] font-black text-[#E51E2B] tracking-tight leading-none">
            WINNER
          </span>
          <span className="text-[19px] sm:text-[21px] font-black text-[#1D3D8F] tracking-tight leading-none">
            {totalContenders > 2 ? `${totalContenders - 1} CONTENDERS` : 'LOSER'}
          </span>
        </div>

        <div className="text-[11.5px] font-extrabold text-slate-900 mb-1.5">
          Preference estimate
        </div>

        {/* Faces & Percentages Row */}
        <div className="flex items-center justify-between px-0.5">
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

          <div className="text-[12px] font-bold text-slate-900 tabular-nums px-1">
            0:00:00
          </div>

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

        {/* Names Row */}
        <div className="flex items-center justify-between mt-1 px-0.5 text-[11px] font-bold text-slate-900">
          <span>{currentUser.name}</span>
          <span>{totalContenders > 2 ? `${opponentName} + ${totalContenders - 2} more` : opponentName}</span>
        </div>

        {/* Interaction Row (Dual buttons) */}
        <div className="w-full flex items-center justify-between gap-2 mt-2.5">
          <button
            type="button"
            onClick={() => handleVote('red')}
            className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
              userVote === 'red' ? 'bg-[#E51E2B] ring-2 ring-red-400 ring-offset-1' : 'bg-[#E51E2B] hover:bg-[#D41825]'
            }`}
          >
            <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#E51E2B" facing="right" />
          </button>

          <div className="flex items-center justify-center gap-2 shrink-0">
            <div className="text-center min-w-[50px]">
              <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
                {likes.toLocaleString()}
              </div>
              <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">Likes</div>
            </div>
            <div className="w-[1px] h-6 bg-slate-300 shrink-0" />
            <div className="text-center min-w-[50px]">
              <div className="text-[12px] sm:text-[12.5px] font-bold text-black tabular-nums leading-none">
                {dislikes.toLocaleString()}
              </div>
              <div className="text-[10px] font-medium text-slate-700 leading-tight mt-0.5">Dislikes</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleVote('blue')}
            className={`cursor-pointer w-[56px] sm:w-[62px] h-[28px] rounded-[8px] flex items-center justify-center transition-all active:scale-90 ${
              userVote === 'blue' ? 'bg-[#1D3D8F] ring-2 ring-blue-400 ring-offset-1' : 'bg-[#1D3D8F] hover:bg-[#183275]'
            }`}
          >
            <AeriBattleThumbsUpIcon className="w-3.5 h-3.5" contrastColor="#1D3D8F" facing="left" />
          </button>
        </div>

        {/* Split Color Progress Bar */}
        <div className="w-full mt-3">
          <div className="w-full flex items-center gap-[3px]">
            <div className="h-[6px] bg-[#E51E2B] rounded-full transition-all duration-300" style={{ width: `${redPct}%` }} />
            <div className="h-[6px] bg-[#1D3D8F] rounded-full transition-all duration-300" style={{ width: `${bluePct}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10.5px] font-bold mt-0.5 px-0.5">
            <span className="text-[#E51E2B]">Red ({redPct.toFixed(1)}%)</span>
            <span className="text-[#1D3D8F]">Blue ({bluePct.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Bottom Double Yellow Line */}
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

        {/* Form Fields: Media Upload and Writing */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-slate-800">
                Post Photo / Video (Visual Media):
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Media</span>
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 transition-colors cursor-pointer overflow-hidden relative group bg-slate-50 flex items-center justify-center"
            >
              {mediaType === 'video' ? (
                <video src={mediaUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
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

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#E51E2B] hover:bg-[#D41825] active:scale-98 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center text-center"
          >
            Submit Challenge Post ({totalContenders.toLocaleString()} Fighters)
          </button>
        </form>
      </div>
    </div>
  );
};
