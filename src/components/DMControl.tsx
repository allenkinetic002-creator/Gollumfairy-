import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Users,
  Clock,
  Heart,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  Check,
  X,
  UserCheck,
  Flame,
  ArrowLeft,
  Bot,
  RefreshCw,
  Bell,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { AeriCommentIcon } from './AeriCommentIcon';
import { AeriRaygunIcon } from './AeriRaygunIcon';

export type DMMode =
  | 'open'
  | 'closed'
  | 'limited'
  | 'scheduled'
  | 'friends'
  | 'request'
  | 'auto';

export interface DMRequestItem {
  id: string;
  name: string;
  handle: string;
  avatarBg: string;
  avatarText: string;
  intro: string;
  timestamp: string;
  mutualFriends: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface ActiveConversation {
  id: string;
  name: string;
  handle: string;
  avatarBg: string;
  avatarText: string;
  messages: ChatMessage[];
}

const INITIAL_REQUESTS: DMRequestItem[] = [
  {
    id: 'req-1',
    name: 'Clara Vance',
    handle: '@clara_design',
    avatarBg: 'bg-amber-500',
    avatarText: 'C',
    intro:
      'Hey! Loved your lighting breakdown in the latest Fairy editorial. Would love to collaborate on a spring lookbook project in NYC.',
    timestamp: '15m ago',
    mutualFriends: 4,
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Zack Thorne',
    handle: '@zack_beats',
    avatarBg: 'bg-indigo-600',
    avatarText: 'Z',
    intro:
      'Can I license your original audio track for an indie documentary soundtrack? We can discuss terms!',
    timestamp: '2h ago',
    mutualFriends: 2,
    status: 'pending',
  },
  {
    id: 'req-3',
    name: 'Nova Sparks',
    handle: '@nova_sparks',
    avatarBg: 'bg-rose-500',
    avatarText: 'N',
    intro:
      'Loved your typography and preset styles! Are you taking 1-on-1 portfolio review requests?',
    timestamp: '5h ago',
    mutualFriends: 1,
    status: 'pending',
  },
];

const INITIAL_CONVERSATIONS: ActiveConversation[] = [
  {
    id: 'chat-1',
    name: 'Elena Rostova',
    handle: '@elena_art',
    avatarBg: 'bg-amber-600',
    avatarText: 'E',
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Hey! Loved seeing Fairy trending today.',
        time: 'Yesterday',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Thanks Elena! Your latest pavilion post was unbelievable.',
        time: 'Yesterday',
      },
    ],
  },
];

interface DMControlProps {
  onBackToFeed: () => void;
  onSwitchToFairyControl?: () => void;
}

export const DMControl: React.FC<DMControlProps> = ({ onBackToFeed, onSwitchToFairyControl }) => {
  // Main mode state
  const [currentMode, setCurrentMode] = useState<DMMode>('request');
  const [lastActiveMode, setLastActiveMode] = useState<DMMode>('request');

  // Sub-view: 'settings' (default), 'requests', 'chats', 'chat-thread'
  const [view, setView] = useState<
    'settings' | 'requests' | 'chats' | 'chat-thread'
  >('settings');

  // Simulator modal state (Test as Visitor)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simVisitorName, setSimVisitorName] = useState('Jordan Miller');
  const [simVisitorHandle, setSimVisitorHandle] = useState('@jordan_create');
  const [simVisitorIntro, setSimVisitorIntro] = useState('');
  const [simVisitorDirectMsg, setSimVisitorDirectMsg] = useState('');
  const [simRequestSent, setSimRequestSent] = useState(false);

  // Active chat thread state
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [chatInputText, setChatInputText] = useState('');

  // Mode Specific Configuration Settings
  // 1. Open Mode
  const [openFilterUnverified, setOpenFilterUnverified] = useState(true);
  const [openSpamShield, setOpenSpamShield] = useState(true);

  // 2. Closed Mode
  const [closedNotice, setClosedNotice] = useState(
    'Taking a digital detox 🌿 Check back soon or reach out via email.',
  );
  const [closedAutoReply, setClosedAutoReply] = useState(true);

  // 3. Limited Mode
  const [limitedTotalSlots, setLimitedTotalSlots] = useState(5);
  const [limitedActiveSlots, setLimitedActiveSlots] = useState<string[]>([
    '@marcus_vision',
    '@elena_art',
    '@maya_sky',
  ]);

  // 4. Scheduled Mode
  const [scheduleStartTime, setScheduleStartTime] = useState('09:00');
  const [scheduleEndTime, setScheduleEndTime] = useState('19:00');
  const [scheduleDays, setScheduleDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);

  // 5. Friends Mode
  const [friendsScope, setFriendsScope] = useState<'mutual' | 'close'>('mutual');

  // 6. Request Mode (Crucial settings requested)
  const [requestWhoCan, setRequestWhoCan] = useState<
    'everyone' | 'following' | 'mutuals'
  >('everyone');
  const [requestIntroRequired, setRequestIntroRequired] = useState(true);
  const [requestCooldownHours, setRequestCooldownHours] = useState(24);
  const [requestMaxPerPerson, setRequestMaxPerPerson] = useState(1);

  // 7. Auto Mode
  const [autoPreset, setAutoPreset] = useState<
    'day-night' | 'work-hours' | 'weekend-closed'
  >('day-night');

  // Data lists
  const [requests, setRequests] = useState<DMRequestItem[]>(INITIAL_REQUESTS);
  const [conversations, setConversations] = useState<ActiveConversation[]>(
    INITIAL_CONVERSATIONS,
  );

  const pendingRequestsCount = requests.filter(
    (r) => r.status === 'pending',
  ).length;

  // Actions for requests
  const handleAcceptRequest = (req: DMRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r)),
    );

    // Create or open active conversation
    const existing = conversations.find((c) => c.handle === req.handle);
    if (!existing) {
      const newChat: ActiveConversation = {
        id: `chat-${Date.now()}`,
        name: req.name,
        handle: req.handle,
        avatarBg: req.avatarBg,
        avatarText: req.avatarText,
        messages: [
          {
            id: 'm-intro',
            sender: 'them',
            text: req.intro,
            time: req.timestamp,
          },
          {
            id: 'm-system',
            sender: 'me',
            text: 'Request accepted! You can now message each other directly.',
            time: 'Just now',
          },
        ],
      };
      setConversations([newChat, ...conversations]);
      setActiveChatId(newChat.id);
    } else {
      setActiveChatId(existing.id);
    }

    // Switch view directly to the opened chat
    setView('chat-thread');
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)),
    );
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: chatInputText.trim(),
      time: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      }),
    );
    setChatInputText('');
  };

  const activeChat = conversations.find((c) => c.id === activeChatId);

  // Simulator Visitor action
  const handleSimSendRequest = () => {
    if (requestIntroRequired && !simVisitorIntro.trim()) return;

    const newReq: DMRequestItem = {
      id: `req-${Date.now()}`,
      name: simVisitorName,
      handle: simVisitorHandle,
      avatarBg: 'bg-emerald-600',
      avatarText: 'J',
      intro:
        simVisitorIntro.trim() ||
        'Hey @fairy! Sending a DM request to connect.',
      timestamp: 'Just now',
      mutualFriends: 1,
      status: 'pending',
    };

    setRequests([newReq, ...requests]);
    setSimRequestSent(true);
  };

  const handleSimSendDirect = () => {
    if (!simVisitorDirectMsg.trim()) return;

    // Direct message in open or limited mode
    const newChat: ActiveConversation = {
      id: `chat-${Date.now()}`,
      name: simVisitorName,
      handle: simVisitorHandle,
      avatarBg: 'bg-emerald-600',
      avatarText: 'J',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'them',
          text: simVisitorDirectMsg.trim(),
          time: 'Just now',
        },
      ],
    };

    setConversations([newChat, ...conversations]);
    setActiveChatId(newChat.id);
    setSimVisitorDirectMsg('');
    setIsSimulatorOpen(false);
    setView('chat-thread');
  };

  // Helper for mode presentation
  const getModeBadge = (mode: DMMode) => {
    switch (mode) {
      case 'open':
        return {
          icon: '🟢',
          title: 'Open',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'Anyone can send a direct message.',
          publicText: '@fairy is Open to DMs',
          colorHex: '#22C55E',
        };
      case 'closed':
        return {
          icon: '🔴',
          title: 'Closed',
          badgeColor: 'bg-red-100 text-red-800 border-red-300',
          desc: 'Nobody can send you a message.',
          publicText: 'DMs are currently closed.',
          colorHex: '#EF4444',
        };
      case 'limited':
        return {
          icon: '🟠',
          title: 'Limited',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
          desc: `${limitedTotalSlots - limitedActiveSlots.length} of ${limitedTotalSlots} DM slots available.`,
          publicText: `${limitedTotalSlots - limitedActiveSlots.length} DM slots available`,
          colorHex: '#F97316',
        };
      case 'scheduled':
        return {
          icon: '🟣',
          title: 'Scheduled',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          desc: `Active ${scheduleStartTime} – ${scheduleEndTime} (${scheduleDays.join(', ')}).`,
          publicText: `DMs open Friday at ${scheduleStartTime}`,
          colorHex: '#A855F7',
        };
      case 'friends':
        return {
          icon: '💗',
          title: 'Friends',
          badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
          desc: 'Only mutual friends can DM you.',
          publicText: 'Friends only',
          colorHex: '#EC4899',
        };
      case 'request':
        return {
          icon: '🟡',
          title: 'Request',
          badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          desc: 'Requires an intro note and your approval.',
          publicText: 'DM Request required',
          colorHex: '#EAB308',
        };
      case 'auto':
        return {
          icon: '⚙️',
          title: 'Auto',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: 'Automated rules by time and day.',
          publicText: 'Auto: Day Open / Night Request',
          colorHex: '#64748B',
        };
    }
  };

  const currentBadge = getModeBadge(currentMode);

  return (
    <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* 1. Header Row */}
      <header className="px-4 pt-3 pb-2.5 bg-white border-b border-slate-100 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <Shield className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-[17px] font-black tracking-tight leading-tight flex items-center gap-1.5">
                DM CONTROL
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Fairy Privacy
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Choose who can reach you and when.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToFeed}
            className="text-[11px] font-bold text-slate-600 hover:text-black px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Back to Feed
          </button>
        </div>

        {/* Status preview banner */}
        <div className="mt-2.5 p-2 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">{currentBadge.icon}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                Your Public DM Status
              </span>
              <span className="text-[11.5px] font-extrabold text-slate-900 leading-tight">
                {currentBadge.publicText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSimRequestSent(false);
                setIsSimulatorOpen(true);
              }}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-[10.5px] rounded-lg transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Test how other users see and interact with your DMs"
            >
              <Eye className="w-3 h-3" />
              Test as Visitor
            </button>
          </div>
        </div>

        {/* Top Header Switcher: FAIRY CONTROL vs DM CONTROL */}
        {onSwitchToFairyControl && (
          <div className="flex items-center gap-1.5 mt-2 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={onSwitchToFairyControl}
              className="flex-1 py-1.5 text-[11px] font-extrabold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open Fairy Discovery & Control Systems"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-800" />
              FAIRY CONTROL (5 Systems)
            </button>
            <button
              className="flex-1 py-1.5 text-[11px] font-extrabold rounded-lg bg-white text-slate-900 shadow-2xs flex items-center justify-center gap-1.5 cursor-default"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              DM Control & Chats
            </button>
          </div>
        )}

        {/* View Switcher: Settings / Pending Requests / Active Chats */}
        <div className="flex items-center gap-1.5 mt-2 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setView('settings')}
            className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              view === 'settings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            DM Modes
          </button>

          <button
            onClick={() => setView('requests')}
            className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
              view === 'requests'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            Requests
            {pendingRequestsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('chats')}
            className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              view === 'chats' || view === 'chat-thread'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AeriCommentIcon className="w-3.5 h-3.5 text-purple-600" />
            Conversations ({conversations.length})
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* VIEW 1: DM MODES & SETTINGS */}
      {/* ===================================================================== */}
      {view === 'settings' && (
        <div className="flex-1 min-h-0 w-full overflow-y-auto p-3 space-y-3 scrollbar-thin overscroll-contain pb-12">
          {/* Master On/Off Switch Selector */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all shadow-xs ${
                  currentMode !== 'closed'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-red-500 text-white shadow-red-500/20'
                }`}
              >
                {currentMode !== 'closed' ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <X className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-slate-900 tracking-tight">
                    Master DM Switch
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      currentMode !== 'closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {currentMode !== 'closed' ? 'STATUS: ON' : 'STATUS: OFF'}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                  {currentMode !== 'closed'
                    ? `Access permitted: ${currentBadge.title} Mode`
                    : 'All incoming direct messages are blocked'}
                </p>
              </div>
            </div>

            {/* Tactile Master ON / OFF Toggle Switch */}
            <div
              onClick={() => {
                if (currentMode === 'closed') {
                  setCurrentMode(lastActiveMode || 'request');
                } else {
                  setLastActiveMode(currentMode);
                  setCurrentMode('closed');
                }
              }}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Master DMs On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 ${
                  currentMode !== 'closed' ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {currentMode !== 'closed' ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  currentMode !== 'closed' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    currentMode !== 'closed' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Quick Segmented Mode Selector Switch */}
          <div>
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                DM Modes Switcher
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Switch on desired mode
              </span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'open', label: 'Open', icon: '🟢' },
                { id: 'request', label: 'Request', icon: '🟡' },
                { id: 'limited', label: 'Limited', icon: '🟠' },
                { id: 'scheduled', label: 'Scheduled', icon: '🟣' },
                { id: 'friends', label: 'Friends', icon: '💗' },
                { id: 'auto', label: 'Auto', icon: '⚙️' },
                { id: 'closed', label: 'Off', icon: '🔴' },
              ].map((tab) => {
                const isSel = currentMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id !== 'closed') setLastActiveMode(tab.id as DMMode);
                      setCurrentMode(tab.id as DMMode);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSel
                        ? 'bg-slate-900 text-white shadow-xs scale-102 ring-1 ring-slate-800'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7 Modern Selectable Cards with On/Off Style Switches */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. 🟢 OPEN */}
              <div
                onClick={() => {
                  if (currentMode === 'open') {
                    setLastActiveMode('open');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('open');
                    setCurrentMode('open');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentMode === 'open'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟢</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        OPEN
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Anyone can send direct DMs
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'open' ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'open' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'open' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'open' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 🔴 CLOSED */}
              <div
                onClick={() => {
                  if (currentMode === 'closed') {
                    setCurrentMode(lastActiveMode || 'request');
                  } else {
                    setLastActiveMode(currentMode);
                    setCurrentMode('closed');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentMode === 'closed'
                    ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔴</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        CLOSED (OFF)
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Nobody can DM you
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'closed' ? 'text-red-700' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'closed' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'closed' ? 'bg-red-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'closed' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 🟠 LIMITED */}
              <div
                onClick={() => {
                  if (currentMode === 'limited') {
                    setLastActiveMode('limited');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('limited');
                    setCurrentMode('limited');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentMode === 'limited'
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟠</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        LIMITED
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Cap direct DM spaces ({limitedTotalSlots - limitedActiveSlots.length} left)
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'limited' ? 'text-orange-700' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'limited' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'limited' ? 'bg-orange-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'limited' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 🟣 SCHEDULED */}
              <div
                onClick={() => {
                  if (currentMode === 'scheduled') {
                    setLastActiveMode('scheduled');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('scheduled');
                    setCurrentMode('scheduled');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentMode === 'scheduled'
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟣</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        SCHEDULED
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {scheduleStartTime}–{scheduleEndTime} active
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'scheduled' ? 'text-purple-700' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'scheduled' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'scheduled' ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'scheduled' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. 💗 FRIENDS */}
              <div
                onClick={() => {
                  if (currentMode === 'friends') {
                    setLastActiveMode('friends');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('friends');
                    setCurrentMode('friends');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentMode === 'friends'
                    ? 'border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💗</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        FRIENDS
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Mutual friends only
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'friends' ? 'text-pink-700' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'friends' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'friends' ? 'bg-pink-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'friends' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. 🟡 REQUEST (VERY IMPORTANT) */}
              <div
                onClick={() => {
                  if (currentMode === 'request') {
                    setLastActiveMode('request');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('request');
                    setCurrentMode('request');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between sm:col-span-2 ${
                  currentMode === 'request'
                    ? 'border-yellow-500 ring-2 ring-yellow-500/20 bg-yellow-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟡</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                          REQUEST
                        </h3>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-yellow-200 text-yellow-900 rounded">
                          Permission Gate
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Requires an intro note &amp; recipient approval (Accept / Decline)
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'request' ? 'text-yellow-800' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'request' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'request' ? 'bg-yellow-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'request' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. ⚙️ AUTO */}
              <div
                onClick={() => {
                  if (currentMode === 'auto') {
                    setLastActiveMode('auto');
                    setCurrentMode('closed');
                  } else {
                    setLastActiveMode('auto');
                    setCurrentMode('auto');
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between sm:col-span-2 ${
                  currentMode === 'auto'
                    ? 'border-slate-600 ring-2 ring-slate-500/20 bg-slate-100 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                        AUTO RULES
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Automatic mode switching (e.g. Day Open, Night Request, Weekend Closed)
                      </p>
                    </div>
                  </div>
                  {/* On/Off Style Switch */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider ${
                        currentMode === 'auto' ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {currentMode === 'auto' ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        currentMode === 'auto' ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          currentMode === 'auto' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SETTINGS CARD UNDERNEATH THE SELECTED MODE */}
          {/* ================================================================= */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
            {/* Header of Active Mode Settings */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentBadge.icon}</span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-tight">
                    {currentBadge.title} Mode Settings
                  </h4>
                  <p className="text-[10.5px] text-slate-400">
                    {currentBadge.desc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Active
              </span>
            </div>

            {/* 1. SETTINGS FOR 🟢 OPEN */}
            {currentMode === 'open' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Anyone who meets standard Fairy community guidelines can send
                  you a direct message immediately.
                </p>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Filter Unverified Accounts
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Block new accounts created under 7 days ago
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openFilterUnverified}
                    onChange={(e) => setOpenFilterUnverified(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Link &amp; Anti-Spam Shield
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Scan external links for safety before delivering
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openSpamShield}
                    onChange={(e) => setOpenSpamShield(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 2. SETTINGS FOR 🔴 CLOSED */}
            {currentMode === 'closed' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-700 leading-snug font-medium">
                    When someone tries to message you, they will see:{' '}
                    <strong>“DMs are currently closed.”</strong> No new messages
                    or requests will enter your inbox.
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block text-[11px] mb-1">
                    Custom Away Notice
                  </label>
                  <input
                    type="text"
                    value={closedNotice}
                    onChange={(e) => setClosedNotice(e.target.value)}
                    placeholder="Enter an optional away notice..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-slate-800 text-[11px]">
                    Send automated polite bounce response
                  </span>
                  <input
                    type="checkbox"
                    checked={closedAutoReply}
                    onChange={(e) => setClosedAutoReply(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 3. SETTINGS FOR 🟠 LIMITED */}
            {currentMode === 'limited' && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800 text-[11px]">
                      Maximum Allowed DM Slots
                    </span>
                    <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">
                      {limitedTotalSlots} total slots
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 4, 10, 25].map((num) => (
                      <button
                        key={num}
                        onClick={() => setLimitedTotalSlots(num)}
                        className={`flex-1 py-1.5 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                          limitedTotalSlots === num
                            ? 'bg-orange-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-[11px] text-orange-900">
                      Public Display Preview:
                    </span>
                    <span className="text-[10px] text-orange-700 font-bold">
                      {Math.max(0, limitedTotalSlots - limitedActiveSlots.length)}{' '}
                      slots available
                    </span>
                  </div>
                  <p className="text-[10.5px] text-orange-800 leading-snug">
                    Once all {limitedTotalSlots} slots are claimed, newcomers
                    cannot directly enter your DMs until you release an existing
                    conversation.
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 text-[10.5px] uppercase block mb-1">
                    Current Occupants ({limitedActiveSlots.length}):
                  </span>
                  <div className="space-y-1">
                    {limitedActiveSlots.map((occupant) => (
                      <div
                        key={occupant}
                        className="flex items-center justify-between px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px]"
                      >
                        <span className="font-medium text-slate-800">
                          {occupant}
                        </span>
                        <button
                          onClick={() =>
                            setLimitedActiveSlots(
                              limitedActiveSlots.filter((o) => o !== occupant),
                            )
                          }
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Release Slot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SETTINGS FOR 🟣 SCHEDULED */}
            {currentMode === 'scheduled' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-800 block text-[10.5px] mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={scheduleStartTime}
                      onChange={(e) => setScheduleStartTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block text-[10.5px] mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={scheduleEndTime}
                      onChange={(e) => setScheduleEndTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block text-[10.5px] mb-1">
                    Recurring Active Days
                  </label>
                  <div className="flex items-center gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => {
                        const isDaySelected = scheduleDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              if (isDaySelected) {
                                setScheduleDays(
                                  scheduleDays.filter((d) => d !== day),
                                );
                              } else {
                                setScheduleDays([...scheduleDays, day]);
                              }
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                              isDaySelected
                                ? 'bg-purple-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 leading-snug">
                  Visitors attempting to message outside these hours see:{' '}
                  <strong>
                    “DMs open on {scheduleDays[0] || 'Monday'} at{' '}
                    {scheduleStartTime}.”
                  </strong>
                </div>
              </div>
            )}

            {/* 5. SETTINGS FOR 💗 FRIENDS */}
            {currentMode === 'friends' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-900">
                  <span className="font-extrabold text-[11px] block mb-0.5">
                    Mutual Friends Only
                  </span>
                  <p className="text-[10.5px] leading-snug text-pink-800">
                    Non-friends cannot directly enter your DMs, even if your
                    profile is public. You currently have{' '}
                    <strong>142 eligible friends</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block text-[10.5px]">
                    Who Qualifies as Friend?
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFriendsScope('mutual')}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-colors ${
                        friendsScope === 'mutual'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Mutual Followers
                    </button>
                    <button
                      onClick={() => setFriendsScope('close')}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-colors ${
                        friendsScope === 'close'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Close Friends List (34)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SETTINGS FOR 🟡 REQUEST (CRITICAL REQUIREMENT) */}
            {currentMode === 'request' && (
              <div className="space-y-3 text-xs">
                {/* Highlight banner on how request works */}
                <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-950">
                  <span className="font-extrabold text-[11px] block mb-0.5">
                    Permission Gate Enabled
                  </span>
                  <p className="text-[10.5px] text-yellow-800 leading-snug">
                    New people cannot directly message you. They must submit an
                    introductory request with why they want to connect. You have
                    full power to <strong>Accept</strong> or{' '}
                    <strong>Decline</strong>.
                  </p>
                </div>

                {/* 1. Who can request to DM me? */}
                <div>
                  <label className="font-bold text-slate-800 block text-[11px] mb-1">
                    Who can request to DM me?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['everyone', 'following', 'mutuals'] as const).map(
                      (scope) => (
                        <button
                          key={scope}
                          onClick={() => setRequestWhoCan(scope)}
                          className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold capitalize transition-all cursor-pointer ${
                            requestWhoCan === scope
                              ? 'bg-yellow-500 text-white shadow-2xs font-extrabold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {scope === 'everyone'
                            ? 'Everyone'
                            : scope === 'following'
                            ? 'People I Follow'
                            : 'Mutuals Only'}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* 2. Intro message requirement */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Intro Message Requirement
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Must explain why they want to contact you
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => setRequestIntroRequired(true)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        requestIntroRequired
                          ? 'bg-yellow-500 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      Required
                    </button>
                    <button
                      onClick={() => setRequestIntroRequired(false)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        !requestIntroRequired
                          ? 'bg-yellow-500 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      Optional
                    </button>
                  </div>
                </div>

                {/* 3. Anti-Spam: Rate Limit & Cooldown */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-slate-800 text-[10.5px] block mb-1">
                      Max Requests Per Person
                    </span>
                    <span className="text-[10px] text-slate-500 block mb-1.5">
                      Prevents repetitive inbox spam
                    </span>
                    <select
                      value={requestMaxPerPerson}
                      onChange={(e) =>
                        setRequestMaxPerPerson(Number(e.target.value))
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      <option value={1}>1 Pending Request</option>
                      <option value={2}>2 Max Requests</option>
                    </select>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-slate-800 text-[10.5px] block mb-1">
                      Request Cooldown
                    </span>
                    <span className="text-[10px] text-slate-500 block mb-1.5">
                      Time between re-requests
                    </span>
                    <select
                      value={requestCooldownHours}
                      onChange={(e) =>
                        setRequestCooldownHours(Number(e.target.value))
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      <option value={24}>24 Hours Cooldown</option>
                      <option value={48}>48 Hours Cooldown</option>
                      <option value={168}>7 Days Cooldown</option>
                    </select>
                  </div>
                </div>

                {/* Direct button to open Pending Requests section */}
                <button
                  onClick={() => setView('requests')}
                  className="w-full py-2.5 px-3 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Open Pending Requests Inbox
                  </span>
                  <span className="bg-yellow-600 px-2 py-0.5 rounded-full text-[10px]">
                    {pendingRequestsCount} Pending &rarr;
                  </span>
                </button>
              </div>
            )}

            {/* 7. SETTINGS FOR ⚙️ AUTO */}
            {currentMode === 'auto' && (
              <div className="space-y-3 text-xs">
                <p className="text-[11px] text-slate-600 leading-snug">
                  The system automatically shifts between DM modes based on your
                  schedule and routine.
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block text-[10.5px]">
                    Automatic Availability Presets:
                  </label>

                  <div
                    onClick={() => setAutoPreset('day-night')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      autoPreset === 'day-night'
                        ? 'border-slate-800 bg-slate-50 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">
                        Day Open &middot; Night Request
                      </span>
                      {autoPreset === 'day-night' && (
                        <Check className="w-3.5 h-3.5 text-slate-800" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      🟢 Open 9:00 AM – 6:00 PM &middot; 🟡 Request 6:00 PM –
                      10:00 PM &middot; 🔴 Closed overnight.
                    </p>
                  </div>

                  <div
                    onClick={() => setAutoPreset('work-hours')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      autoPreset === 'work-hours'
                        ? 'border-slate-800 bg-slate-50 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">
                        Work Hours Only
                      </span>
                      {autoPreset === 'work-hours' && (
                        <Check className="w-3.5 h-3.5 text-slate-800" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      🟢 Open Mon-Fri 10:00 AM – 5:00 PM &middot; 🔴 Closed all
                      other times.
                    </p>
                  </div>

                  <div
                    onClick={() => setAutoPreset('weekend-closed')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      autoPreset === 'weekend-closed'
                        ? 'border-slate-800 bg-slate-50 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">
                        Weekday Open &middot; Weekend Friends Only
                      </span>
                      {autoPreset === 'weekend-closed' && (
                        <Check className="w-3.5 h-3.5 text-slate-800" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      🟢 Open weekdays &middot; 💗 Friends only on Saturday
                      &amp; Sunday.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: RECIPIENT'S DM REQUESTS INBOX (ACCEPT / DECLINE FLOW) */}
      {/* ===================================================================== */}
      {view === 'requests' && (
        <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden bg-slate-50">
          <div className="px-4 py-2 bg-yellow-50/70 border-b border-yellow-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🟡</span>
              <span className="text-xs font-black text-yellow-900 uppercase">
                Pending DM Requests ({pendingRequestsCount})
              </span>
            </div>
            <span className="text-[10px] text-yellow-700 font-medium">
              Accepting opens the chat
            </span>
          </div>

          <div className="flex-1 min-h-0 w-full overflow-y-auto p-3 space-y-2.5 scrollbar-thin overscroll-contain pb-12">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-xs">No pending requests</p>
                <p className="text-[10px] mt-0.5">
                  When new people request to DM, they appear here.
                </p>
              </div>
            ) : (
              requests.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-3 border transition-all shadow-xs ${
                    item.status === 'accepted'
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : item.status === 'declined'
                      ? 'border-slate-200 opacity-50 bg-slate-100/50'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Requester Profile Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full ${item.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}
                      >
                        {item.avatarText}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-xs text-slate-900 leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.handle}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-slate-400">
                          {item.timestamp} &middot; {item.mutualFriends} mutual
                          friends
                        </span>
                      </div>
                    </div>

                    {item.status === 'accepted' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Accepted
                      </span>
                    ) : item.status === 'declined' ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        Declined
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Pending
                      </span>
                    )}
                  </div>

                  {/* Intro Message Card */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-2.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Introductory Message:
                    </span>
                    <p className="text-[11.5px] text-slate-800 leading-relaxed font-medium">
                      &ldquo;{item.intro}&rdquo;
                    </p>
                  </div>

                  {/* Action Buttons: ACCEPT & DECLINE */}
                  {item.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(item)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        ACCEPT (Start Chat)
                      </button>

                      <button
                        onClick={() => handleDeclineRequest(item.id)}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        DECLINE
                      </button>
                    </div>
                  ) : item.status === 'accepted' ? (
                    <button
                      onClick={() => {
                        const c = conversations.find(
                          (conv) => conv.handle === item.handle,
                        );
                        if (c) setActiveChatId(c.id);
                        setView('chat-thread');
                      }}
                      className="w-full py-1 text-center font-bold text-emerald-700 text-[11px] bg-emerald-100/70 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Active Chat &rarr;
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic block text-center">
                      Request declined. User cannot re-request during cooldown (
                      {requestCooldownHours}h).
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: ACTIVE CONVERSATIONS LIST */}
      {/* ===================================================================== */}
      {view === 'chats' && (
        <div className="flex-1 min-h-0 w-full overflow-y-auto p-3 space-y-2 scrollbar-thin overscroll-contain pb-12">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Active Conversations ({conversations.length})
            </span>
          </div>

          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setView('chat-thread');
              }}
              className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-full ${chat.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}
                >
                  {chat.avatarText}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                    {chat.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {chat.messages[chat.messages.length - 1]?.text ||
                      'Start conversation...'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 4: LIVE CHAT THREAD WITH ACCEPTED RECIPIENT */}
      {/* ===================================================================== */}
      {view === 'chat-thread' && activeChat && (
        <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden bg-slate-50">
          {/* Chat Header */}
          <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('chats')}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <div
                className={`w-7 h-7 rounded-full ${activeChat.avatarBg} text-white font-bold text-[10px] flex items-center justify-center`}
              >
                {activeChat.avatarText}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                  {activeChat.name}
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold block leading-none">
                  Direct Channel Open
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {activeChat.handle}
              </span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 min-h-0 w-full overflow-y-auto p-3 space-y-2.5 overscroll-contain pb-12">
            {activeChat.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'me' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[78%] px-3 py-1.5 rounded-2xl text-[11.5px] leading-relaxed shadow-2xs ${
                    m.sender === 'me'
                      ? 'bg-purple-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendChatMessage}
            className="p-2 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder={`Message ${activeChat.name}...`}
              className="flex-1 bg-slate-100 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-full px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInputText.trim()}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <AeriRaygunIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. VISITOR SIMULATOR MODAL: DEMONSTRATING THE DM ACCESS FLOW */}
      {/* ===================================================================== */}
      {isSimulatorOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsSimulatorOpen(false)}
        >
          <div
            className="w-full max-w-[340px] max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-scaleUp border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <div>
                  <h3 className="font-black text-xs uppercase tracking-tight">
                    Visitor Perspective Test
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Testing as: @jordan_create visiting @fairy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated Profile DM Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base mx-auto mb-1.5 shadow-xs">
                F
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Fairy Creator (@fairy)
              </h4>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold mt-1 border shadow-2xs">
                <span>{currentBadge.icon}</span>
                <span>{currentBadge.publicText}</span>
              </div>
            </div>

            {/* Dynamic Interactive Flow based on currently selected mode */}
            <div className="p-4 text-xs overflow-y-auto max-h-[55vh] overscroll-contain">
              {/* If MODE is 🟢 OPEN */}
              {currentMode === 'open' && (
                <div className="space-y-3">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] leading-snug">
                    ✅ <strong>DMs are Open.</strong> You can message @fairy
                    directly right now.
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block text-[10.5px] mb-1">
                      Direct Message:
                    </label>
                    <textarea
                      rows={2}
                      value={simVisitorDirectMsg}
                      onChange={(e) => setSimVisitorDirectMsg(e.target.value)}
                      placeholder="Hey Fairy, loved your post!"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={handleSimSendDirect}
                    disabled={!simVisitorDirectMsg.trim()}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold rounded-xl transition-colors cursor-pointer"
                  >
                    Send Direct Message &rarr;
                  </button>
                </div>
              )}

              {/* If MODE is 🔴 CLOSED */}
              {currentMode === 'closed' && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">
                      DMs are currently closed.
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug px-2">
                      &ldquo;{closedNotice}&rdquo;
                    </p>
                  </div>
                  <button
                    disabled
                    className="w-full py-2 bg-slate-200 text-slate-400 font-bold rounded-xl cursor-not-allowed text-xs"
                  >
                    Messaging Unavailable
                  </button>
                </div>
              )}

              {/* If MODE is 🟠 LIMITED */}
              {currentMode === 'limited' && (
                <div className="space-y-3">
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-[11px] leading-snug">
                    🟠 <strong>Limited Slots:</strong>{' '}
                    {limitedTotalSlots - limitedActiveSlots.length} available
                    slots remain out of {limitedTotalSlots}.
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block text-[10.5px] mb-1">
                      Direct Message:
                    </label>
                    <textarea
                      rows={2}
                      value={simVisitorDirectMsg}
                      onChange={(e) => setSimVisitorDirectMsg(e.target.value)}
                      placeholder="Claiming a slot to reach out!"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (limitedActiveSlots.length >= limitedTotalSlots) {
                        alert(
                          'Sorry, all DM slots are currently taken by other users!',
                        );
                        return;
                      }
                      setLimitedActiveSlots([
                        ...limitedActiveSlots,
                        simVisitorHandle,
                      ]);
                      handleSimSendDirect();
                    }}
                    disabled={!simVisitorDirectMsg.trim()}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-extrabold rounded-xl transition-colors cursor-pointer"
                  >
                    Claim Slot &amp; Send Message
                  </button>
                </div>
              )}

              {/* If MODE is 🟣 SCHEDULED */}
              {currentMode === 'scheduled' && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">
                      Outside Scheduled Hours
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug px-2">
                      @fairy only receives messages between {scheduleStartTime}{' '}
                      and {scheduleEndTime} on ({scheduleDays.join(', ')}).
                    </p>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-xl text-[10.5px] text-slate-600 font-bold">
                    Next Window: Today at {scheduleStartTime}
                  </div>
                </div>
              )}

              {/* If MODE is 💗 FRIENDS */}
              {currentMode === 'friends' && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">
                      Friends Only
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug px-2">
                      Only mutual friends can directly message @fairy. Follow and
                      wait for a follow back to unlock direct messaging.
                    </p>
                  </div>
                </div>
              )}

              {/* If MODE is 🟡 REQUEST (THE FULL FLOW: Person A → Send Request → Person B Accept/Decline) */}
              {(currentMode === 'request' || currentMode === 'auto') && (
                <div className="space-y-3">
                  {!simRequestSent ? (
                    <>
                      <div className="p-2 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 text-[11px] leading-snug">
                        🟡 <strong>DM Request Required:</strong> You cannot
                        directly enter @fairy&apos;s DM. Submit an introduction
                        for approval.
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-700 text-[10.5px]">
                            Introductory Message{' '}
                            {requestIntroRequired && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <span className="text-[9.5px] text-slate-400">
                            {simVisitorIntro.length}/240
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={simVisitorIntro}
                          onChange={(e) => setSimVisitorIntro(e.target.value)}
                          placeholder="Explain why you want to connect (e.g. collaboration, inquiry)..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Shield className="w-3 h-3 text-yellow-600 shrink-0" />
                        <span>
                          Rate limited: Max 1 pending request &middot;{' '}
                          {requestCooldownHours}h cooldown
                        </span>
                      </div>

                      <button
                        onClick={handleSimSendRequest}
                        disabled={requestIntroRequired && !simVisitorIntro.trim()}
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <AeriRaygunIcon className="w-4 h-4" />
                        Send DM Request to @fairy
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-3 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mx-auto animate-bounce">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">
                        Request Pending Approval ⏳
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug px-1">
                        Your request was sent to @fairy with your intro note. You
                        will receive a notification when accepted or declined.
                      </p>
                      <button
                        onClick={() => {
                          setIsSimulatorOpen(false);
                          setView('requests');
                        }}
                        className="mt-2 w-full py-2 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Switch to Recipient Inbox &rarr;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
