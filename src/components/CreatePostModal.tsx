import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Video,
  Upload,
  Music,
  MapPin,
  Sparkles,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  Smile,
  Hash,
} from 'lucide-react';
import { BrokenPencilIcon } from './BrokenPencilIcon';

export interface NewPostPayload {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  tags: string[];
  audioTitle: string;
  location: string;
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

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: NewPostPayload) => void;
  authorAvatar: string;
  authorName?: string;
  authorHandle?: string;
}

// Preset creative medias for quick 1-click selection if user doesn't have a local file ready
const SAMPLE_PRESETS: { type: 'image' | 'video'; url: string; label: string; previewThumb: string }[] = [
  {
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    label: '🎥 Golden Blaze Video',
    previewThumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  },
  {
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    label: '🎥 Autumn Road Video',
    previewThumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=900&auto=format&fit=crop&q=80',
    label: '📸 Mystical Forest Photo',
    previewThumb: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=500&auto=format&fit=crop&q=80',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
    label: '📸 Twilight Sky Photo',
    previewThumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
  },
];

const PRESET_TAGS = ['#fairy', '#autumnlight', '#aeri', '#dreamscape', '#creatives', '#naturemagic'];
const PRESET_EMOJIS = ['🧚', '✨', '🍂', '🍄', '💛', '🌙', '🔥', '🌸'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  authorAvatar,
  authorName = 'Elena Vance',
  authorHandle = '@elena_aeri',
}) => {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#fairy', '#autumnlight']);
  const [audioTitle, setAudioTitle] = useState<string>('Original Audio');
  const [location, setLocation] = useState<string>('Kyoto, Japan');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attachFaceoff, setAttachFaceoff] = useState<boolean>(false);
  const [faceoffQuestion, setFaceoffQuestion] = useState<string>(
    `Who looks Hotter between me ${authorName} or this loser Slimy sticky`
  );
  const [opponentName, setOpponentName] = useState<string>('Slimy sticky');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    setMediaType(isVid ? 'video' : 'image');
    setMediaUrl(url);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addEmoji = (emoji: string) => {
    setCaption((prev) => prev + emoji);
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim() && !caption.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onPublish({
        mediaType,
        mediaUrl: mediaUrl.trim() || 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=900&auto=format&fit=crop&q=80',
        caption: caption.trim() || 'Sharing moments from the enchanted grove ✨',
        tags: selectedTags,
        audioTitle: audioTitle.trim() || 'Original Audio',
        location: location.trim() || 'Kyoto, Japan',
        faceoffConfig: attachFaceoff
          ? {
              battleQuestion: faceoffQuestion.trim(),
              redParticipant: {
                name: authorName,
                avatar: authorAvatar,
              },
              blueParticipant: {
                name: opponentName.trim(),
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
              },
            }
          : undefined,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scaleUp max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-4.5 py-3 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-slate-900 leading-tight">Create Post</h2>
              <p className="text-[10px] text-slate-500 font-medium">Publish photo or video to Fairy feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {/* Author Badge */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs font-black text-slate-900">{authorName}</span>
                <CheckCircle2 className="w-3 h-3 text-purple-600 fill-purple-100" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{authorHandle}</span>
            </div>
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Public Feed
            </span>
          </div>

          {/* Media Upload & Preview Box */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 mb-1.5">
              Post Media (Photo or Video)
            </label>

            {mediaUrl ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/90 group shadow-xs border border-slate-200">
                {mediaType === 'video' ? (
                  <>
                    <video
                      ref={videoRef}
                      src={mediaUrl}
                      playsInline
                      loop
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={toggleVideoPlayback}
                      className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[9.5px] font-bold flex items-center gap-1">
                      <Video className="w-3 h-3 text-indigo-400" /> Video
                    </span>
                  </>
                ) : (
                  <>
                    <img src={mediaUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[9.5px] font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-amber-400" /> Photo
                    </span>
                  </>
                )}

                {/* Remove Media Button */}
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Remove media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 hover:bg-purple-50/60 rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 group-hover:bg-purple-200 text-purple-700 flex items-center justify-center mb-2 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to upload a <span className="text-purple-700">Photo</span> or <span className="text-indigo-700">Video</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports MP4, WebM, PNG, JPG, GIF</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Quick Preset Selector */}
            <div className="mt-2">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Or choose a sample:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMediaType(preset.type);
                      setMediaUrl(preset.url);
                    }}
                    className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      mediaUrl === preset.url
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-black'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <img
                      src={preset.previewThumb}
                      alt={preset.label}
                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-[10.5px] font-bold truncate leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Post Writing & Caption */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-slate-700">Post Writing & Caption</label>
              <span className="text-[10px] text-slate-400 font-medium">{caption.length}/500</span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write what's on your mind... Describe the vibe, aesthetics, and story 🧚✨"
              rows={3}
              maxLength={500}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all resize-none"
            />

            {/* Quick Emojis */}
            <div className="flex items-center gap-1 mt-1 overflow-x-auto py-0.5 scrollbar-none">
              <Smile className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5" />
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs cursor-pointer transition-colors shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-black text-slate-700 mb-1">
              <Hash className="w-3 h-3 text-purple-600" />
              <span>Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Location Meta */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1 mb-1">
                <Music className="w-3 h-3 text-slate-400" /> Soundtrack
              </label>
              <input
                type="text"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="e.g. Original Audio"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Attach Broken Pencil Faceoff Battle Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <div
              onClick={() => setAttachFaceoff((prev) => !prev)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-50 border border-purple-200/90 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <BrokenPencilIcon className="w-5 h-auto text-purple-700" />
                <div>
                  <div className="text-[11px] font-black text-purple-950">
                    Attach Broken Pencil Challenge
                  </div>
                  <div className="text-[9.5px] text-slate-500">
                    Pop out faceoff battle card directly on this post
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={attachFaceoff}
                onChange={(e) => setAttachFaceoff(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {attachFaceoff && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fadeIn">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Battle Question / Stakes:
                  </label>
                  <input
                    type="text"
                    value={faceoffQuestion}
                    onChange={(e) => setFaceoffQuestion(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Opponent to Challenge:
                  </label>
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (!mediaUrl && !caption.trim())}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Publishing to Fairy Feed...' : 'Publish Post to Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
