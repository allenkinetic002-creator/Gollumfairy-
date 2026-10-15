import React, { useState, useRef } from 'react';
import { X, Trash2, User } from 'lucide-react';

export interface NewTweetPayload {
  text: string;
  mediaUrl?: string;
  tags?: string[];
}

interface CreateTweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishTweet: (payload: NewTweetPayload) => void;
  authorAvatar: string;
  authorName?: string;
  authorHandle?: string;
}

const SAMPLE_TWEET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
    title: 'Autumn Twilight',
  },
  {
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=900&auto=format&fit=crop&q=80',
    title: 'Mystical Woods',
  },
  {
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
    title: 'Neon Horizon',
  },
];

const PRESET_HASHTAGS = ['#design', '#crypto', '#art', '#tech', '#vibes', '#community'];

export const CreateTweetModal: React.FC<CreateTweetModalProps> = ({
  isOpen,
  onClose,
  onPublishTweet,
  authorAvatar,
  authorName = 'Elena Vance',
  authorHandle = '@elena_aeri',
}) => {
  const [tweetText, setTweetText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const MAX_CHARS = 280;
  const charsLeft = MAX_CHARS - tweetText.length;
  const progressRatio = Math.min(1, tweetText.length / MAX_CHARS);
  const isOverLimit = charsLeft < 0;
  const canPost = (tweetText.trim().length > 0 || Boolean(selectedImage)) && !isOverLimit;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowImagePicker(false);
    }
  };

  const handleAddHashtag = (tag: string) => {
    setTweetText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${tag} ` : `${tag} `;
    });
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;

    // Extract tags from text or defaults
    const extractedTags = tweetText.match(/#[a-z0-9_]+/gi) || [];

    onPublishTweet({
      text: tweetText.trim(),
      mediaUrl: selectedImage || undefined,
      tags: extractedTags,
    });

    // Reset and close
    setTweetText('');
    setSelectedImage(null);
    setShowPreview(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close post composer"
            >
              <X size={20} />
            </button>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Compose</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                showPreview
                  ? 'bg-purple-100 text-purple-700 border-purple-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 overflow-y-auto space-y-3">
          {showPreview ? (
            /* Post Preview mode */
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Post Preview
              </div>

              {/* Card header */}
              <div className="flex items-start gap-2.5">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400 stroke-[1.6]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-[13px] font-black text-slate-900">{authorName}</span>
                    <span className="text-xs text-slate-400 font-medium">{authorHandle}</span>
                    <span className="text-xs text-slate-300">&middot;</span>
                    <span className="text-xs text-slate-400 font-medium">Just now</span>
                  </div>

                  {/* Body text */}
                  <p className="text-[14px] leading-relaxed text-slate-900 mt-1 whitespace-pre-wrap">
                    {tweetText || <span className="italic text-slate-400">Your post text will appear here...</span>}
                  </p>

                  {/* Attached media (Full picture display) */}
                  {selectedImage && (
                    <div className="relative mt-2.5 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 max-h-[380px] flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-center bg-cover blur-xl opacity-20 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${selectedImage})` }}
                      />
                      <img
                        src={selectedImage}
                        alt="Attached media"
                        className="relative z-10 w-full h-auto max-h-[380px] object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Post Edit mode */
            <>
              {/* Author header */}
              <div className="flex items-start gap-3">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/30 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400 stroke-[1.6]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-sm font-bold text-slate-900">{authorName}</span>
                    <span className="text-xs text-slate-400">{authorHandle}</span>
                  </div>
                  <span className="text-[11px] text-purple-600 font-medium">Public Post</span>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder="What's on your mind?!"
                  rows={4}
                  className="w-full text-base placeholder:text-slate-400 text-slate-900 focus:outline-none resize-none bg-transparent py-1 border-0 leading-relaxed font-normal"
                  autoFocus
                />
              </div>

              {/* Attached image preview */}
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img
                    src={selectedImage}
                    alt="Selected attachment"
                    className="w-full h-44 object-cover object-center"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-md"
                    title="Remove attached photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {/* Quick Hashtags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Tags:</span>
                {PRESET_HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Photo presets drawer */}
              {showImagePicker && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Select an image for your Post</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-purple-600 hover:underline cursor-pointer"
                    >
                      Upload custom file
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_TWEET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSelectedImage(img.url);
                          setShowImagePicker(false);
                        }}
                        className="group relative rounded-lg overflow-hidden border border-slate-200 aspect-video hover:ring-2 hover:ring-purple-600 transition-all cursor-pointer"
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-[10px] text-white truncate font-medium">
                          {img.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => setShowImagePicker((prev) => !prev)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              {selectedImage ? 'Change Image' : 'Add Image'}
            </button>
          </div>

          {/* Right side: Character counter indicator ring & Post CTA */}
          <div className="flex items-center gap-3">
            {/* Circular progress counter */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-slate-200"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className={`transition-all duration-200 ${
                      isOverLimit
                        ? 'stroke-rose-500'
                        : charsLeft < 20
                        ? 'stroke-amber-500'
                        : 'stroke-purple-600'
                    }`}
                    strokeWidth="2.5"
                    strokeDasharray={56.5}
                    strokeDashoffset={56.5 * (1 - progressRatio)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span
                className={`text-[11px] font-bold tabular-nums ${
                  isOverLimit
                    ? 'text-rose-600'
                    : charsLeft < 20
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }`}
              >
                {charsLeft}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePost}
              disabled={!canPost}
              className={`px-5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase transition-all shadow-sm cursor-pointer ${
                canPost
                  ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white active:scale-95'
                  : 'bg-purple-200 text-purple-400 cursor-not-allowed'
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
