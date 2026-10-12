import React, { useState } from 'react';
import { X, Star, Sparkles, ShieldCheck, Quote, Calendar, User, Tag } from 'lucide-react';
import { StarStamp, StarStampCategory, addStarStamp } from '../data/starStamps';

interface CreateStarStampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (stamp: StarStamp) => void;
  initialPromiserName?: string;
  initialRole?: string;
}

export function CreateStarStampModal({
  isOpen,
  onClose,
  onCreated,
  initialPromiserName = '',
  initialRole = '',
}: CreateStarStampModalProps) {
  const [promiserName, setPromiserName] = useState(initialPromiserName);
  const [promiserRole, setPromiserRole] = useState(initialRole);
  const [promiserHandle, setPromiserHandle] = useState('');
  const [category, setCategory] = useState<StarStampCategory>('Politician');
  const [verbalCommitment, setVerbalCommitment] = useState('');
  const [contextSource, setContextSource] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [initialRating, setInitialRating] = useState<number>(4.0);
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const categories: StarStampCategory[] = [
    'Politician',
    'CEO / Tech',
    'Creator / Artist',
    'Everyday / Peer',
    'Company / Brand',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promiserName.trim()) {
      setErrorMessage('Please enter the name of the person who made the verbal commitment.');
      return;
    }
    if (!verbalCommitment.trim()) {
      setErrorMessage('Please enter the exact verbal promise or commitment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const initials = promiserName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

    const bgColors = [
      'bg-indigo-700',
      'bg-purple-700',
      'bg-emerald-700',
      'bg-blue-700',
      'bg-amber-600',
      'bg-rose-700',
    ];
    const pickedBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const newStamp: StarStamp = {
      id: `star-${Date.now()}`,
      stampNumber: `STAR-${randomSuffix}`,
      promiserName: promiserName.trim(),
      promiserRole: promiserRole.trim() || `${category} figure`,
      promiserHandle: promiserHandle.trim()
        ? promiserHandle.startsWith('@')
          ? promiserHandle.trim()
          : `@${promiserHandle.trim()}`
        : `@${promiserName.toLowerCase().replace(/\s+/g, '')}`,
      promiserAvatarBg: pickedBg,
      promiserAvatarInitial: initials,
      category,
      verbalCommitment: verbalCommitment.trim(),
      contextSource: contextSource.trim() || 'Verbal public pledge',
      targetDate: targetDate.trim() || 'Open timeline',
      createdAt: Date.now(),
      status: 'active',
      overallRating: initialRating,
      ratingsCount: 1,
      userRating: initialRating,
      communityVotes: {
        fulfilled: 0,
        active: 1,
        broken: 0,
      },
      comments: [
        {
          id: `c-init-${Date.now()}`,
          author: 'You',
          authorHandle: '@you',
          text: `Issued Star Stamp recording verbal commitment: "${verbalCommitment.trim()}".`,
          rating: initialRating,
          timestamp: Date.now(),
          timeAgo: 'Just now',
          isVerifiedReceipt: true,
        },
      ],
      createdBy: 'You',
      createdHandle: '@you',
      tags: tags.length > 0 ? tags : ['verbalcommitment', category.toLowerCase().replace(/\s+/g, '')],
    };

    addStarStamp(newStamp);
    onCreated?.(newStamp);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header with Star Seal */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                  Make a Star Stamp
                </h3>
                <span className="px-1.5 py-0.2 rounded-full text-[9.5px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider shrink-0">
                  Open
                </span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                Hold politicians, CEOs & peers to their word
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 py-4 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold text-[11px]">
              {errorMessage}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-black text-white shadow-xs scale-102 ring-2 ring-black/10'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Promiser Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Who Made the Verbal Promise? *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Gov. Adebayo, CEO Sarah, Elena"
                  value={promiserName}
                  onChange={(e) => setPromiserName(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Role or Title
              </label>
              <input
                type="text"
                placeholder="e.g. State Governor, Tech CEO, Freelancer"
                value={promiserRole}
                onChange={(e) => setPromiserRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Handle */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
              Social Handle / Identifier (Optional)
            </label>
            <input
              type="text"
              placeholder="@handle"
              value={promiserHandle}
              onChange={(e) => setPromiserHandle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Exact Verbal Commitment */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-600 mb-1 flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-amber-500" />
              <span>Exact Verbal Commitment *</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder='e.g. "I promise we will pave the commercial street before Q4" or "I verbally agreed to deliver the wireframes by tomorrow noon."'
              value={verbalCommitment}
              onChange={(e) => setVerbalCommitment(e.target.value)}
              className="w-full p-3 bg-amber-50/40 border border-amber-200/80 rounded-2xl font-medium text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none leading-relaxed"
            />
          </div>

          {/* Context & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                Where & When Was It Spoken?
              </label>
              <input
                type="text"
                placeholder="e.g. Town Hall speech, Podcast Ep. 12, Phone Call"
                value={contextSource}
                onChange={(e) => setContextSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Target Date / Deadline</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dec 31, 2026 or Next Friday"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Initial Trust Rating (1 - 5 Stars) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-black uppercase text-slate-700">
                Initial Trust / Confidence Rating
              </span>
              <p className="text-[10px] text-slate-500">
                How credible or reliable is this verbal commitment?
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  onClick={() => setInitialRating(starVal)}
                  className="p-1 cursor-pointer transition-transform hover:scale-115 active:scale-90"
                >
                  <Star
                    className={`w-5 h-5 ${
                      initialRating >= starVal
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="font-black text-xs text-slate-900 ml-1.5 w-6">
                {initialRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-600 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. infrastructure, speech, pledge, publictrust"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium">
              ★ Minted immediately to the public Star Stamp directory
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-black hover:bg-slate-800 active:scale-95 text-white font-black text-xs shadow-lg shadow-black/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{isSubmitting ? 'Minting...' : 'Stamp Verbal Commitment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStarStampModal;
