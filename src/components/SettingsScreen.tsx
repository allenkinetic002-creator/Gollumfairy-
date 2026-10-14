import React, { useState } from 'react';
import {
  User,
  Globe,
  Sun,
  Mic,
  Volume2,
  Info,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Shield,
  Play,
  RotateCw,
  Send,
  Sparkles,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  Database,
  Server
} from 'lucide-react';
import { checkSupabaseConnection } from '../lib/supabase';


export interface SettingsScreenProps {
  onBack: () => void;
  onOpenDMControl?: () => void;
  onLogout?: () => void;
  onOpenGitHubSync?: () => void;
  currentUser?: {
    name: string;
    handle: string;
    email: string;
  };
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenDMControl,
  onLogout,
  onOpenGitHubSync,
  currentUser,
}) => {
  // Navigation / active modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App settings state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [selectedAppearance, setSelectedAppearance] = useState<'System' | 'Light' | 'Dark'>('System');
  const [fontSize, setFontSize] = useState<'Small' | 'Standard' | 'Large' | 'Extra Large'>('Standard');
  const [audioMainLanguage, setAudioMainLanguage] = useState<string>('Use App language');
  const [selectedVoice, setSelectedVoice] = useState<string>('Breeze (Warm & Gentle)');
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  
  // Data & cache state
  const [cacheSize, setCacheSize] = useState<string>('48.6 MB');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateCheckedAt, setUpdateCheckedAt] = useState<string>('Just now');

  // Account editing state
  const [displayName, setDisplayName] = useState<string>(
    currentUser?.name || 'Allen Dharak'
  );
  const [username, setUsername] = useState<string>(
    currentUser?.handle.replace('@', '') || 'allenkinetic002-creator'
  );
  const [email, setEmail] = useState<string>(
    currentUser?.email || 'allendharak9@gmail.com'
  );
  const [phone, setPhone] = useState<string>('+44 20 7946 0912');


  // Feedback form state
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackCategory, setFeedbackCategory] = useState<string>('General feedback');

  // Personalization toggles
  const [personalization, setPersonalization] = useState({
    recommendations: true,
    trendingTopics: true,
    targetedAnalytics: false,
    contentDiscovery: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    showToast('Cache cleared successfully (48.6 MB freed)');
  };

  const handleCheckUpdateModal = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateCheckedAt('Just now');
      showToast('FAIRY is up to date (v2.5.3)');
    }, 1200);
  };

  const handleVoicePreview = () => {
    setIsPlayingVoice(true);
    setTimeout(() => {
      setIsPlayingVoice(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f7f9] text-gray-900 select-none overflow-y-auto font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-white/10 animate-fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#f6f7f9]/90 backdrop-blur-md px-4 pt-3 pb-3 flex items-center justify-between border-b border-gray-200/40">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-200/60 flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900 tracking-tight">Settings</h1>
        <div className="w-9 h-9" /> {/* Spacer to balance header */}
      </header>

      {/* Main Settings List */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-3 space-y-5 pb-12">
        {/* SECTION: Profile */}
        <div>
          <h2 className="px-3 pb-2 text-[13px] font-medium text-gray-400">Profile</h2>
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/70">
            {/* Account settings */}
            <button
              onClick={() => setActiveModal('account')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <User className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Account settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
            </button>

            {/* Data controls */}
            <button
              onClick={() => setActiveModal('data')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <svg
                  className="w-5 h-5 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v6c0 1.66 4 3 9 3" />
                  <path d="M3 12v7c0 1.66 4 3 9 3" />
                  <circle cx="17.5" cy="15.5" r="3.5" />
                  <path d="M17.5 12v7" />
                </svg>
                <span className="text-[15px] font-medium text-gray-900">Data controls</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
            </button>

            {/* Supabase Backend */}
            <button
              onClick={() => setActiveModal('supabase_backend')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Database className="w-5 h-5 text-emerald-600 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Supabase Backend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>
          </div>
        </div>


        {/* SECTION: App */}
        <div>
          <h2 className="px-3 pb-2 text-[13px] font-medium text-gray-400">App</h2>
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/70">
            {/* Language */}
            <button
              onClick={() => setActiveModal('language')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Globe className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Language</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal">{selectedLanguage}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>

            {/* Appearance */}
            <button
              onClick={() => setActiveModal('appearance')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Sun className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Appearance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal">{selectedAppearance}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>

            {/* Font size */}
            <button
              onClick={() => setActiveModal('font_size')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-5 h-5 flex items-baseline justify-start font-bold tracking-tight text-gray-800 select-none">
                  <span className="text-[13px] leading-none">A</span>
                  <span className="text-[10px] leading-none -ml-0.5">A</span>
                </div>
                <span className="text-[15px] font-medium text-gray-900">Font size</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal">{fontSize}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>

            {/* Personalization */}
            <button
              onClick={() => setActiveModal('personalization')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <svg
                  className="w-5 h-5 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-[15px] font-medium text-gray-900">Personalization</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* SECTION: Audio */}
        <div>
          <h2 className="px-3 pb-2 text-[13px] font-medium text-gray-400">Audio</h2>
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/70">
            {/* Main language */}
            <button
              onClick={() => setActiveModal('audio_language')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Mic className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Main language</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal">{audioMainLanguage}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>

            {/* Voice */}
            <button
              onClick={() => setActiveModal('voice')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Volume2 className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Voice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal truncate max-w-[120px]">
                  {selectedVoice.split(' ')[0]}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>
          </div>
          <p className="px-4 pt-2 text-[12px] text-gray-400 leading-normal">
            Select the primary language you use for voice input to achieve better recognition results
          </p>
        </div>

        {/* SECTION: About */}
        <div>
          <h2 className="px-3 pb-2 text-[13px] font-medium text-gray-400">About</h2>
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100/70">
            {/* Check for updates */}
            <button
              onClick={() => setActiveModal('updates')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Info className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Check for updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-400 font-normal">2.5.3(276)</span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
              </div>
            </button>

            {/* Service agreement */}
            <button
              onClick={() => setActiveModal('agreement')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Service agreement</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
            </button>

            {/* Cloud & Repository Sync */}
            {onOpenGitHubSync && (
              <button
                onClick={onOpenGitHubSync}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Database className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
                  <span className="text-[15px] font-medium text-gray-900">Cloud & Repository Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-emerald-600 font-semibold">Active</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* SECTION: Help & Feedback (standalone card) */}
        <div className="pt-1">
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden">
            <button
              onClick={() => setActiveModal('help_feedback')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <HelpCircle className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Help & Feedback</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* SECTION: Log out (standalone card) */}
        <div className="pt-1">
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100/80 overflow-hidden">
            <button
              onClick={() => setActiveModal('logout')}
              className="w-full px-4 py-3.5 flex items-center gap-3.5 hover:bg-red-50/40 active:bg-red-50/80 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-gray-800 stroke-[1.8]" />
              <span className="text-[15px] font-medium text-gray-900">Log out</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 pb-6 text-center">
          <p className="text-[12px] text-gray-400 font-normal">
            AI-generated, for reference only. Use legally.
          </p>
        </div>
      </div>

      {/* ----------------- NORMAL CENTERED MODALS ----------------- */}

      {/* 1. Account Settings Normal Modal */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Account settings</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Username</label>
                <div className="flex items-center px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 mr-1 font-bold">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-transparent outline-none font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-purple-600 font-medium"
                />
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">Verified Creator Status</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Account details updated successfully');
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Data Controls Normal Modal */}
      {activeModal === 'data' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Data controls</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">App Cache</p>
                  <p className="text-xs text-gray-500">Temporarily cached media & feeds: {cacheSize}</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg border border-gray-200 shadow-2xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Search History</p>
                  <p className="text-xs text-gray-500">Cached tags and query history</p>
                </div>
                <button
                  onClick={() => showToast('Search history cleared')}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg border border-gray-200 shadow-2xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Export Archive</p>
                  <p className="text-xs text-gray-500">Download a full JSON archive of posts</p>
                </div>
                <button
                  onClick={() => showToast('Archive requested. Download link sent to email.')}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg border border-gray-200 shadow-2xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Request
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Language Selector Normal Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-3 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Select language</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 max-h-[55vh] overflow-y-auto pr-1">
              {[
                'English',
                'Español (Spanish)',
                'Français (French)',
                'Deutsch (German)',
                'Italiano (Italian)',
                '日本語 (Japanese)',
                '한국어 (Korean)',
                '简体中文 (Simplified Chinese)',
                'Português (Portuguese)',
              ].map(lang => {
                const isSelected = selectedLanguage === lang.split(' ')[0] || (lang.startsWith('English') && selectedLanguage === 'English');
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang.split(' ')[0]);
                      showToast(`Language set to ${lang}`);
                      setActiveModal(null);
                    }}
                    className={`w-full py-3 px-3 flex items-center justify-between text-left rounded-xl transition-colors cursor-pointer ${
                      isSelected ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{lang}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Appearance Selector Normal Modal */}
      {activeModal === 'appearance' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Appearance</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { id: 'System', label: 'System', desc: 'Match device operating system settings' },
                { id: 'Light', label: 'Light', desc: 'Bright, clean white aesthetic' },
                { id: 'Dark', label: 'Dark', desc: 'Dim, battery-saving dark interface' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedAppearance(opt.id as any);
                    showToast(`Appearance changed to ${opt.label}`);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3.5 flex items-center justify-between rounded-xl border text-left cursor-pointer transition-all ${
                    selectedAppearance === opt.id
                      ? 'border-purple-600 bg-purple-50/40 text-purple-950 font-bold'
                      : 'border-gray-200/80 bg-gray-50/50 hover:bg-gray-100/60'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500 font-normal">{opt.desc}</p>
                  </div>
                  {selectedAppearance === opt.id && <Check className="w-5 h-5 text-purple-600 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Font Size Selector Normal Modal */}
      {activeModal === 'font_size' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-gray-800 flex items-center justify-center font-bold">
                  AA
                </div>
                <h3 className="text-base font-bold text-gray-900">Font size</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
              <p className="text-xs font-semibold text-gray-400 mb-1">Preview</p>
              <p
                className={`text-gray-800 transition-all ${
                  fontSize === 'Small'
                    ? 'text-xs'
                    : fontSize === 'Standard'
                    ? 'text-sm'
                    : fontSize === 'Large'
                    ? 'text-base'
                    : 'text-lg'
                }`}
              >
                "The fairy dust shines brightest in silent twilight hours."
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {(['Small', 'Standard', 'Large', 'Extra Large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setFontSize(size);
                    showToast(`Font size set to ${size}`);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3.5 flex items-center justify-between rounded-xl border text-left cursor-pointer transition-all ${
                    fontSize === size
                      ? 'border-purple-600 bg-purple-50/40 text-purple-950 font-bold'
                      : 'border-gray-200/80 bg-gray-50/50 hover:bg-gray-100/60'
                  }`}
                >
                  <span className="text-sm font-bold text-gray-900">{size}</span>
                  {fontSize === size && <Check className="w-5 h-5 text-purple-600 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Personalization Normal Modal */}
      {activeModal === 'personalization' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Personalization</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Personalized Feed</p>
                  <p className="text-xs text-gray-500">Show posts matched to your interactions</p>
                </div>
                <input
                  type="checkbox"
                  checked={personalization.recommendations}
                  onChange={e => setPersonalization({ ...personalization, recommendations: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Curated Trends</p>
                  <p className="text-xs text-gray-500">Filter topics relevant to your interests</p>
                </div>
                <input
                  type="checkbox"
                  checked={personalization.trendingTopics}
                  onChange={e => setPersonalization({ ...personalization, trendingTopics: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Discover New Creators</p>
                  <p className="text-xs text-gray-500">Showcase emerging digital artists</p>
                </div>
                <input
                  type="checkbox"
                  checked={personalization.contentDiscovery}
                  onChange={e => setPersonalization({ ...personalization, contentDiscovery: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Personalization preferences saved');
                setActiveModal(null);
              }}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* 7. Audio Main Language Normal Modal */}
      {activeModal === 'audio_language' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-3 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Main language</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              Select the primary language you use for voice input to achieve better recognition results.
            </p>

            <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto pr-1">
              {[
                'Use App language',
                'English (United States)',
                'English (United Kingdom)',
                'Español (España)',
                'Español (Latinoamérica)',
                'Français (France)',
                'Deutsch (Deutschland)',
                '日本語 (Japan)',
                '中文 (Mandarin)',
              ].map(item => {
                const isSelected = audioMainLanguage === item;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setAudioMainLanguage(item);
                      showToast(`Voice language set to ${item}`);
                      setActiveModal(null);
                    }}
                    className={`w-full py-3 px-3 flex items-center justify-between text-left rounded-xl transition-colors cursor-pointer ${
                      isSelected ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{item}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. Voice Style Normal Modal */}
      {activeModal === 'voice' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Voice</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { name: 'Breeze (Warm & Gentle)', tone: 'Warm, natural tone' },
                { name: 'Nova (Energetic & Crisp)', tone: 'Upbeat and clear' },
                { name: 'Ember (Calm & Reflective)', tone: 'Deep, comforting pace' },
                { name: 'Sol (Bright & Optimistic)', tone: 'Lively and expressive' },
              ].map(voice => (
                <div
                  key={voice.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    selectedVoice === voice.name
                      ? 'border-purple-600 bg-purple-50/40'
                      : 'border-gray-200/80 bg-gray-50/50'
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedVoice(voice.name);
                      showToast(`Selected voice: ${voice.name.split(' ')[0]}`);
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="text-sm font-bold text-gray-900">{voice.name}</p>
                    <p className="text-xs text-gray-500">{voice.tone}</p>
                  </div>
                  <button
                    onClick={handleVoicePreview}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-purple-600 cursor-pointer"
                    title="Preview voice"
                  >
                    {isPlayingVoice ? (
                      <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Supabase Backend Modal */}
      {activeModal === 'supabase_backend' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Supabase Backend</h3>
                  <p className="text-xs text-gray-400">PostgreSQL Cloud Database & Sync</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800">PostgreSQL Status: Connected</span>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">eu-west-1</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 space-y-1">
                <span className="text-gray-400 font-medium">Project Reference / URL:</span>
                <p className="font-mono text-gray-800 text-[11px] select-all break-all">
                  https://khixsxyyulxpwlkxtaag.supabase.co
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 space-y-2">
                <span className="text-gray-400 font-medium">Synced Cloud Tables:</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  <div className="bg-white px-2 py-1.5 rounded border border-gray-200 flex items-center justify-between text-gray-700">
                    <span>fairy_posts</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded border border-gray-200 flex items-center justify-between text-gray-700">
                    <span>fairy_messages</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded border border-gray-200 flex items-center justify-between text-gray-700">
                    <span>fairy_trust_receipts</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded border border-gray-200 flex items-center justify-between text-gray-700">
                    <span>fairy_star_stamps</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 space-y-1 text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Real-time Subscriptions:</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Row Level Security (RLS):</span>
                  <span className="font-semibold text-emerald-600">Enforced</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Check for Updates Normal Modal */}
      {activeModal === 'updates' && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 text-left">Check for updates</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-gray-900 mt-3">FAIRY</h4>
              <p className="text-xs text-purple-700 font-bold">Version 2.5.3 (Build 276)</p>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mt-2 border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>You're on the latest build</span>
              </div>
            </div>

            <div className="text-left bg-gray-50 rounded-xl p-3.5 border border-gray-200/60 text-xs space-y-1.5">
              <p className="font-bold text-gray-800">What's New in 2.5.3:</p>
              <ul className="text-gray-600 space-y-1 list-disc list-inside">
                <li>Revamped modern mobile Settings architecture</li>
                <li>Instant voice language and sound preview support</li>
                <li>Granular data controls with cache management</li>
                <li>Full real-time repository sync and push</li>
              </ul>
            </div>

            <p className="text-[11px] text-gray-400">
              Last checked: {updateCheckedAt}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCheckUpdateModal}
                disabled={isCheckingUpdate}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {isCheckingUpdate ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Service Agreement Normal Modal */}
      {activeModal === 'agreement' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-gray-800 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Service agreement</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
              <p className="font-bold text-gray-900 text-sm">FAIRY Terms of Service & Privacy</p>
              <p>
                Welcome to FAIRY. By using this service, you consent to our terms regarding community integrity, content sharing, and data privacy.
              </p>
              <p className="font-semibold text-gray-800">1. User Rights and Content Ownership</p>
              <p>
                You retain full copyright over original creations, voice recordings, and creative contributions shared on the platform.
              </p>
              <p className="font-semibold text-gray-800">2. Community Standards</p>
              <p>
                Zero tolerance for harassment, discrimination, hate speech, or non-consensual content. Infractions lead to account restrictions.
              </p>
              <p className="font-semibold text-gray-800">3. Artificial Intelligence Disclaimer</p>
              <p>
                AI-generated feedback, assistance, and responses are provided for reference only. Please verify information and use legally.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* 11. Help & Feedback Normal Modal */}
      {activeModal === 'help_feedback' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Help & Feedback</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Feedback Category</label>
                <select
                  value={feedbackCategory}
                  onChange={e => setFeedbackCategory(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-purple-600"
                >
                  <option>General feedback</option>
                  <option>UI / Design suggestions</option>
                  <option>Audio / Voice recognition bug</option>
                  <option>Account & login assistance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Your Message</label>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Tell us what you love or how we can improve..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-purple-600 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Thank you for your feedback!');
                  setFeedbackText('');
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Log Out Normal Modal */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-center border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Log out of FAIRY?</h3>
              <p className="text-xs text-gray-500 mt-1">
                You will need to sign back in with your username or connected account.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onLogout?.();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
