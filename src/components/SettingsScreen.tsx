import React, { useState } from 'react';
import {
  User,
  Globe,
  Sun,
  Sparkles,
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
  Trash2,
  Download,
  Shield,
  Play,
  RotateCw,
  Send,
  AlertCircle
} from 'lucide-react';

export interface SettingsScreenProps {
  onBack: () => void;
  onOpenDMControl?: () => void;
  onLogout?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenDMControl,
  onLogout,
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
  const [updateStatus, setUpdateStatus] = useState<string>('Up to date');

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

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('Latest version installed');
      showToast('You are on the latest version 2.5.3(276)');
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
              onClick={handleCheckUpdate}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Info className="w-5 h-5 text-gray-800 stroke-[1.8]" />
                <span className="text-[15px] font-medium text-gray-900">Check for updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isCheckingUpdate ? (
                  <RotateCw className="w-4 h-4 text-purple-600 animate-spin" />
                ) : (
                  <span className="text-[14px] text-gray-400 font-normal">2.5.3(276)</span>
                )}
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

      {/* ----------------- SUB-MODALS / SHEETS ----------------- */}

      {/* 1. Account Settings Modal */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Account settings</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 pt-2">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Username
                </label>
                <p className="text-sm font-bold text-gray-900">@aerifairy</p>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Email
                </label>
                <p className="text-sm font-bold text-gray-900">elena.vance@aeri.studio</p>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <p className="text-sm font-bold text-gray-900">+1 (555) 234-8901</p>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Account Status
                </label>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verified Creator (Active)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                showToast('Account details verified');
                setActiveModal(null);
              }}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-4"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. Data Controls Modal */}
      {activeModal === 'data' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Data controls</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 pt-2">
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
                  <p className="text-xs text-gray-500">Recently searched profiles and tags</p>
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
                  <p className="text-sm font-semibold text-gray-900">Export My Data</p>
                  <p className="text-xs text-gray-500">Download a JSON archive of your activity</p>
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
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 3. Language Selector Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Select language</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
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
                    className="w-full py-3.5 px-2 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <span className={`text-sm ${isSelected ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                      {lang}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Appearance Selector Modal */}
      {activeModal === 'appearance' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Appearance</h3>
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

      {/* 5. Font Size Selector Modal */}
      {activeModal === 'font_size' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Font size</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
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

      {/* 6. Personalization Modal */}
      {activeModal === 'personalization' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Personalization</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Recommended for You</p>
                  <p className="text-xs text-gray-500">Personalize posts based on reading habits</p>
                </div>
                <input
                  type="checkbox"
                  checked={personalization.recommendations}
                  onChange={e => setPersonalization({ ...personalization, recommendations: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Curated Trending Topics</p>
                  <p className="text-xs text-gray-500">Filter topics relevant to your interests</p>
                </div>
                <input
                  type="checkbox"
                  checked={personalization.trendingTopics}
                  onChange={e => setPersonalization({ ...personalization, trendingTopics: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Explore New Creators</p>
                  <p className="text-xs text-gray-500">Allow Fairy to showcase emerging artists</p>
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
                showToast('Personalization preferences updated');
                setActiveModal(null);
              }}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-3"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* 7. Audio Main Language Modal */}
      {activeModal === 'audio_language' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Voice input language</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Select the primary language you use for voice input to achieve better recognition results.
            </p>
            <div className="divide-y divide-gray-100">
              {[
                'Use App language',
                'English (United States)',
                'English (United Kingdom)',
                'Español (España)',
                'Español (Latinoamérica)',
                'Français',
                'Deutsch',
                '日本語',
                '中文 (普通话)',
              ].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    setAudioMainLanguage(item);
                    showToast(`Voice language set to ${item}`);
                    setActiveModal(null);
                  }}
                  className="w-full py-3.5 px-2 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <span className={`text-sm ${audioMainLanguage === item ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                    {item}
                  </span>
                  {audioMainLanguage === item && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Voice Style Modal */}
      {activeModal === 'voice' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Speech Voice</h3>
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
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-3"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 9. Service Agreement Modal */}
      {activeModal === 'agreement' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Service agreement</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p className="font-bold text-gray-900 text-sm">FAIRY Terms of Service & Agreement</p>
              <p>
                Welcome to FAIRY. By accessing or using our services, you agree to be bound by our terms and community guidelines.
              </p>
              <p className="font-semibold text-gray-800">1. User Content & Conduct</p>
              <p>
                You retain ownership of the original artwork, soundscapes, and writing you publish. You agree not to post infringing, abusive, or unlawful material.
              </p>
              <p className="font-semibold text-gray-800">2. Privacy & Data Integrity</p>
              <p>
                We value your autonomy and do not sell your personal biometric or voice data. Content generated or reviewed via AI complies with standard safety benchmarks.
              </p>
              <p className="font-semibold text-gray-800">3. Artificial Intelligence Disclaimer</p>
              <p>
                AI-assisted outputs are provided for reference only. Users must verify outputs and use them legally within appropriate jurisdictions.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer mt-4"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* 10. Help & Feedback Modal */}
      {activeModal === 'help_feedback' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Help & Feedback</h3>
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
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Thank you for your feedback!');
                  setFeedbackText('');
                  setActiveModal(null);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Log Out Confirmation Modal */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-center">
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
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors cursor-pointer"
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
