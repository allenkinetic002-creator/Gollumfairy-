import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Flame,
  Search,
  X,
  Filter,
  ThumbsDown,
  FileCheck,
  Plus,
  Calendar,
  Lock,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { AeriCommentIcon } from './AeriCommentIcon';
import { AeriRaygunIcon } from './AeriRaygunIcon';
import {
  SharedPerson,
  INITIAL_SHARED_PEOPLE,
  loadSharedPeople,
  saveSharedPeople,
  loadSharedTimers,
  saveSharedTimers,
  FIVE_HOURS_MS,
} from '../data/sharedPeople';
import {
  TrustReceipt,
  loadTrustReceipts,
  computeReceiptStatus,
} from '../data/trustReceipts';
import { TrustReceiptsView } from './TrustReceiptsView';
import { CreateTrustReceiptModal } from './CreateTrustReceiptModal';
import { StarStampsScreen } from './StarStampsScreen';
import { CreateStarStampModal } from './CreateStarStampModal';
import {
  getAllUserSwitchesMap,
  checkUsersSeeEachOtherViaGenreSupport,
  getGenreSupportMatchesForUser,
  FairySystemSwitches,
  DEFAULT_FAIRY_SWITCHES,
  normalizeUserKey,
} from '../lib/fairySwitches';

export type Person = SharedPerson;

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface MatchesScreenProps {
  onBackToFeed: () => void;
}

export function MatchesScreen({ onBackToFeed }: MatchesScreenProps) {
  // People list state (paired directly with chat screen)
  const [people, setPeople] = useState<SharedPerson[]>(() => loadSharedPeople());

  // Timers state: Map of personId -> startedAt (timestamp in ms, synchronized across both screens)
  const [timers, setTimers] = useState<Record<string, number>>(() => loadSharedTimers());

  // Listen to cross-screen live synchronization
  useEffect(() => {
    const handleSync = () => {
      const updatedPeople = loadSharedPeople();
      setPeople((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(updatedPeople)) return prev;
        return updatedPeople;
      });
      const updatedTimers = loadSharedTimers();
      setTimers((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(updatedTimers)) return prev;
        return updatedTimers;
      });
    };
    window.addEventListener('vibe_shared_sync', handleSync);
    return () => window.removeEventListener('vibe_shared_sync', handleSync);
  }, []);

  // Chats state: Map of personId -> ChatMessage[]
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    const initialHistories: Record<string, ChatMessage[]> = {};
    const loadedPeople = loadSharedPeople();
    loadedPeople.forEach((p) => {
      if (p.messages && p.messages.length > 0) {
        initialHistories[p.id] = p.messages;
      }
    });
    return initialHistories;
  });

  // Active navigation: null = Matches List, personId = Chat Screen with that person
  const [activeChatPersonId, setActiveChatPersonId] = useState<string | null>(null);

  // Time's up modal state
  const [showTimesUpDialog, setShowTimesUpDialog] = useState(false);
  const [dialogPerson, setDialogPerson] = useState<SharedPerson | null>(null);

  // Live timer tick state (updates every 1 second)
  const [now, setNow] = useState<number>(Date.now());
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const lastActiveChatIdRef = useRef<string | null>(null);
  const lastMsgCountRef = useRef<number>(0);

  // Search & Filter state for matches
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'chatting' | 'receipts' | 'genre-support'>('all');
  const [switchesMap, setSwitchesMap] = useState<Record<string, FairySystemSwitches>>(() => getAllUserSwitchesMap());
  const currentActiveUserKey = (typeof window !== 'undefined' ? localStorage.getItem('fairy_last_active_user_key') : '') || 'guest';

  // Listen to live fairy switch updates so cross-system visibility updates dynamically
  useEffect(() => {
    const handleSwitchesSync = () => {
      setSwitchesMap(getAllUserSwitchesMap());
    };
    window.addEventListener('fairy_switches_sync', handleSwitchesSync);
    window.addEventListener('storage', handleSwitchesSync);
    return () => {
      window.removeEventListener('fairy_switches_sync', handleSwitchesSync);
      window.removeEventListener('storage', handleSwitchesSync);
    };
  }, []);

  // Score feedback toast state
  const [scoreToast, setScoreToast] = useState<{
    type: 'good' | 'bad';
    message: string;
  } | null>(null);

  // Sub-tab: 'matches' or 'receipts' or 'star-stamps'
  const [matchScreenTab, setMatchScreenTab] = useState<'matches' | 'receipts' | 'star-stamps'>('matches');

  // Trust Receipt state & creation modal
  const [showCreateReceiptModal, setShowCreateReceiptModal] = useState(false);
  const [showCreateStarStampModal, setShowCreateStarStampModal] = useState(false);
  const [createReceiptPersonId, setCreateReceiptPersonId] = useState<string | null>(null);
  const [createReceiptQuote, setCreateReceiptQuote] = useState<string>('');
  const [receiptsList, setReceiptsList] = useState<TrustReceipt[]>(() => loadTrustReceipts());
  const [trustReceiptsCount, setTrustReceiptsCount] = useState<number>(() => loadTrustReceipts().length);

  // Quick Deal & Time Inspector Modal target
  const [inspectingReceipt, setInspectingReceipt] = useState<TrustReceipt | null>(null);

  // Sync receipts count & list across components
  useEffect(() => {
    const handleReceiptsSync = () => {
      const all = loadTrustReceipts();
      setReceiptsList(all);
      setTrustReceiptsCount(all.length);
    };
    window.addEventListener('fairy_receipts_sync', handleReceiptsSync);
    return () => window.removeEventListener('fairy_receipts_sync', handleReceiptsSync);
  }, []);

  // Helper to find the most recent Trust Receipt for any person
  const getRecentReceiptForPerson = (personId: string): TrustReceipt | undefined => {
    return receiptsList.find((r) => r.promiserId === personId);
  };

  // Remaining countdown formatted for tweet/comment previews
  const getCountdownRemaining = (deadlineAt: number): string => {
    const diff = deadlineAt - now;
    if (diff <= 0) return 'Expired';
    const totalSecs = Math.floor(diff / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs >= 24) {
      const days = Math.floor(hrs / 24);
      const remHrs = hrs % 24;
      return `${days}d ${remHrs}h left`;
    }
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} left`;
  };

  // Detailed remaining countdown for modal inspector
  const getRemainingTimeFormattedForReceipt = (deadlineAt: number): string => {
    const diff = deadlineAt - now;
    if (diff <= 0) return '00:00:00 (Expired)';
    const totalSecs = Math.floor(diff / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  const handleOpenCreateReceiptForPerson = (personId: string, quote?: string) => {
    setCreateReceiptPersonId(personId);
    setCreateReceiptQuote(quote || '');
    setShowCreateReceiptModal(true);
  };

  useEffect(() => {
    if (scoreToast) {
      const t = setTimeout(() => setScoreToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [scoreToast]);

  // 1-second interval for countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if active chat has expired timer
  useEffect(() => {
    if (!activeChatPersonId) return;

    const startedAt = timers[activeChatPersonId];
    if (startedAt) {
      const remainingMs = startedAt + FIVE_HOURS_MS - now;
      if (remainingMs <= 0 && !showTimesUpDialog) {
        const p = people.find((item) => item.id === activeChatPersonId);
        if (p) {
          setDialogPerson(p);
          setShowTimesUpDialog(true);
        }
      }
    }
  }, [now, activeChatPersonId, timers, people, showTimesUpDialog]);

  // Scroll to bottom only when chat is opened or a new message arrives (allows free scrolling up)
  useEffect(() => {
    if (!activeChatPersonId) return;
    const msgs = chatHistories[activeChatPersonId] || [];
    const isNewChat = lastActiveChatIdRef.current !== activeChatPersonId;
    const isNewMessage = msgs.length > lastMsgCountRef.current;

    if (isNewChat || isNewMessage) {
      lastActiveChatIdRef.current = activeChatPersonId;
      lastMsgCountRef.current = msgs.length;
      chatBottomRef.current?.scrollIntoView({ behavior: isNewChat ? 'auto' : 'smooth' });
    }
  }, [activeChatPersonId, chatHistories]);

  // Handle open chat & start timer
  const handleOpenChat = (person: Person) => {
    // 1. Starting the timer
    // The first time opening a given person's chat, start 5-hour countdown.
    // Reopening the same chat must NOT reset the timer.
    setTimers((prev) => {
      if (prev[person.id]) {
        return prev;
      }
      const next = {
        ...prev,
        [person.id]: Date.now(),
      };
      saveSharedTimers(next);
      return next;
    });

    // Seed default chat messages if first time opening
    if (!chatHistories[person.id]) {
      const initialMsgs: ChatMessage[] = (person.messages && person.messages.length > 0)
        ? person.messages
        : [
            {
              id: `msg-${person.id}-0`,
              sender: 'them',
              text: 'Hey! Nice to connect.',
              time: 'Just now',
            },
          ];
      setChatHistories((prev) => ({
        ...prev,
        [person.id]: initialMsgs,
      }));
    }

    // Check if 5 hours already passed while app was closed
    const existingStart = timers[person.id];
    if (existingStart && existingStart + FIVE_HOURS_MS - Date.now() <= 0) {
      setDialogPerson(person);
      setShowTimesUpDialog(true);
    }

    setActiveChatPersonId(person.id);
  };

  // Helper to format remaining time HH:MM:SS
  const getRemainingTimeFormatted = (personId: string): string => {
    const startedAt = timers[personId];
    if (!startedAt) return '05:00:00';
    const remainingMs = Math.max(0, startedAt + FIVE_HOURS_MS - now);
    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if person has active timer running
  const hasActiveTimer = (personId: string): boolean => {
    const startedAt = timers[personId];
    if (!startedAt) return false;
    return startedAt + FIVE_HOURS_MS - now > 0;
  };

  // Good reply action:
  // ADD to their score (+5%, max 100%), increase approval, clear timer, stay in chat
  const handleGoodReply = (customTargetId?: string) => {
    const targetId = customTargetId || dialogPerson?.id || activeChatPersonId;
    if (!targetId) return;
    const targetPerson = people.find((p) => p.id === targetId);
    if (!targetPerson) return;
    const oldPercent = targetPerson.percent;
    const newPercent = Math.min(100, oldPercent + 5);

    // Update score in people list
    const updatedPeople = people.map((p) => {
      if (p.id === targetId) {
        const currentAppr = parseInt(p.approval.replace('+', '')) || 50;
        return {
          ...p,
          percent: newPercent,
          matchPercent: newPercent,
          approval: `${currentAppr + 1}+`,
        };
      }
      return p;
    });
    setPeople(updatedPeople);
    saveSharedPeople(updatedPeople);

    // Clear timer
    const updatedTimers = { ...timers };
    delete updatedTimers[targetId];
    setTimers(updatedTimers);
    saveSharedTimers(updatedTimers);

    // Show score added feedback toast
    setScoreToast({
      type: 'good',
      message: `Score Boosted! +5% ADDED to ${targetPerson.name} (${oldPercent}% → ${newPercent}%)`,
    });

    // Add celebration message to chat
    setChatHistories((prev) => ({
      ...prev,
      [targetId]: [
        ...(prev[targetId] || []),
        {
          id: `good-${Date.now()}`,
          sender: 'them',
          text: `Good reply! 🌟 Match score ADDED by +5% (${oldPercent}% → ${newPercent}%). Let's keep collaborating!`,
          time: 'Just now',
        },
      ],
    }));

    setShowTimesUpDialog(false);
    setDialogPerson(null);
  };

  // Bad reply action:
  // SUBTRACT from their score (-50%, min 0%), decrease approval, clear timer
  const handleBadReply = (customTargetId?: string) => {
    const targetId = customTargetId || dialogPerson?.id || activeChatPersonId;
    if (!targetId) return;
    const targetPerson = people.find((p) => p.id === targetId);
    if (!targetPerson) return;
    const oldPercent = targetPerson.percent;
    const newPercent = Math.max(0, oldPercent - 50);

    // Subtract score in people list
    const updatedPeople = people.map((p) => {
      if (p.id === targetId) {
        const currentAppr = Math.max(0, parseInt(p.approval.replace('+', '')) - 1) || 20;
        return {
          ...p,
          percent: newPercent,
          matchPercent: newPercent,
          approval: `${currentAppr}+`,
        };
      }
      return p;
    });
    setPeople(updatedPeople);
    saveSharedPeople(updatedPeople);

    // Clear timer
    const updatedTimers = { ...timers };
    delete updatedTimers[targetId];
    setTimers(updatedTimers);
    saveSharedTimers(updatedTimers);

    // Show score subtracted feedback toast
    setScoreToast({
      type: 'bad',
      message: `Score Penalized! -50% SUBTRACTED from ${targetPerson.name} (${oldPercent}% → ${newPercent}%)`,
    });

    // Add penalty message to chat
    setChatHistories((prev) => ({
      ...prev,
      [targetId]: [
        ...(prev[targetId] || []),
        {
          id: `bad-${Date.now()}`,
          sender: 'them',
          text: `Bad reply rated. ⚠️ Match score SUBTRACTED by -50% (${oldPercent}% → ${newPercent}%).`,
          time: 'Just now',
        },
      ],
    }));

    setShowTimesUpDialog(false);
    setDialogPerson(null);
  };

  // Fast-forward / Test Timer trigger
  const handleTestExpireTimer = (personId: string) => {
    const expiredTimers = {
      ...timers,
      [personId]: Date.now() - FIVE_HOURS_MS - 1000,
    };
    setTimers(expiredTimers);
    saveSharedTimers(expiredTimers);

    const p = people.find((item) => item.id === personId);
    if (p) {
      setDialogPerson(p);
      setShowTimesUpDialog(true);
    }
  };

  // Send message in chat
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatPersonId) return;
    const newMsg: ChatMessage = {
      id: `my-${Date.now()}`,
      sender: 'me',
      text: inputMessage.trim(),
      time: 'Just now',
    };
    setChatHistories((prev) => ({
      ...prev,
      [activeChatPersonId]: [...(prev[activeChatPersonId] || []), newMsg],
    }));
    setInputMessage('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        'Totally agree! Let’s code this out.',
        'Brilliant concept. I’m pushing a commit to review now.',
        'Sounds like a vibe! What libraries are you pulling in?',
        'Super clean! Let’s sync up on the next sprint.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatHistories((prev) => ({
        ...prev,
        [activeChatPersonId]: [
          ...(prev[activeChatPersonId] || []),
          {
            id: `reply-${Date.now()}`,
            sender: 'them',
            text: randomReply,
            time: 'Just now',
          },
        ],
      }));
    }, 1200);
  };

  // Reset people list if emptied
  const handleResetPeople = () => {
    setPeople(INITIAL_SHARED_PEOPLE);
    setTimers({});
    setChatHistories({});
    saveSharedPeople(INITIAL_SHARED_PEOPLE);
    saveSharedTimers({});
  };

  const activePerson = people.find((p) => p.id === activeChatPersonId);

  // =========================================================================
  // VIEW: CHAT SCREEN
  // =========================================================================
  if (activeChatPersonId && activePerson) {
    const isTimerActive = hasActiveTimer(activePerson.id);
    const countdown = getRemainingTimeFormatted(activePerson.id);

    return (
      <div className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
        {/* Toast notification inside chat */}
        {scoreToast && (
          <div
            className={`w-full px-4 py-2 text-xs font-bold flex items-center justify-between z-20 shadow-xs animate-in slide-in-from-top-2 duration-200 ${
              scoreToast.type === 'good'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {scoreToast.type === 'good' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{scoreToast.message}</span>
            </div>
            <button
              onClick={() => setScoreToast(null)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Chat App Bar (Material 3 style) */}
        <header className="w-full bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChatPersonId(null)}
              className="p-1.5 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Back to matches list"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full ${activePerson.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-xs overflow-hidden`}
              >
                {activePerson.avatarUrl ? (
                  <img
                    src={activePerson.avatarUrl}
                    alt={activePerson.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  activePerson.avatarInitial
                )}
              </div>
              {isTimerActive && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200 animate-pulse" />
              )}
            </div>
            <div className="leading-tight">
              <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{activePerson.name}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full transition-all ${
                    activePerson.percent >= 50
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                  title="Match rating percentage"
                >
                  {activePerson.percent}%
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Vibe coder &middot; {activePerson.city}
              </p>
            </div>
          </div>

          {/* Right: Live Timer Badge & Simulate Zero trigger */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider shadow-2xs border ${
                isTimerActive
                  ? 'bg-amber-50 text-amber-900 border-amber-200/80 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="5-hour reply countdown"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span>{countdown}</span>
            </div>

            {/* End Timer Lightning Trigger */}
            <button
              onClick={() => handleTestExpireTimer(activePerson.id)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-extrabold rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title="End timer (fast-forward to 0 to trigger Good/Bad reply popup)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
              <span>End Timer</span>
            </button>

            {/* Create Trust Receipt Button in Chat */}
            <button
              onClick={() => handleOpenCreateReceiptForPerson(activePerson.id)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-extrabold rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title="Record a commitment from this chat into a Trust Receipt"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Trust Receipt</span>
            </button>
          </div>
        </header>

        {/* Pinned Deal Banner in Chat: Shows How This Person Deals */}
        {(() => {
          const chatReceipt = getRecentReceiptForPerson(activePerson.id);
          if (chatReceipt) {
            return (
              <div
                onClick={() => setInspectingReceipt(chatReceipt)}
                className="bg-gradient-to-r from-amber-50 to-orange-50/80 border-b border-amber-200/90 px-3.5 py-2.5 flex items-center justify-between gap-2.5 shrink-0 cursor-pointer hover:bg-amber-100/70 transition-colors shadow-2xs group"
                title={`See how ${activePerson.name} deals on Trust Receipt #${chatReceipt.receiptNumber}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-xs text-slate-900">
                        #{chatReceipt.receiptNumber}
                      </span>
                      <span className="text-[10px] font-black text-amber-950 bg-amber-100 px-1.5 py-0.2 rounded-md border border-amber-200">
                        {chatReceipt.amount ? `Stake: ${chatReceipt.amount}` : 'Deal Active'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                        &middot; {chatReceipt.deadlineLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium italic truncate max-w-[200px] sm:max-w-md">
                      "{chatReceipt.commitment}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingReceipt(chatReceipt);
                    }}
                    className="px-2.5 py-1.5 bg-black text-white hover:bg-slate-800 rounded-xl text-[11px] font-black flex items-center gap-1 shadow-2xs group-hover:scale-102 transition-transform cursor-pointer"
                  >
                    <span>How They Deal</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Chat message stream */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 overscroll-contain touch-pan-y">
          <div className="text-center my-2">
            <span className="inline-block px-3 py-1 bg-slate-200/70 text-slate-600 text-[10px] font-semibold rounded-full">
              5-hour reply window active &middot; Reply on time!
            </span>
          </div>

          {(chatHistories[activePerson.id] || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                  msg.sender === 'me'
                    ? 'bg-black text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="bg-white border-t border-slate-200 p-3 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activePerson.name}...`}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-full bg-black hover:bg-slate-800 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <AeriRaygunIcon className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* Time's Up Dialog */}
        {renderTimesUpDialog()}
      </div>
    );
  }

  // Computed filtered list for search & chips
  const filteredPeople = people.filter((person) => {
    const query = searchQuery.toLowerCase().trim();
    const recentReceipt = getRecentReceiptForPerson(person.id);

    const matchesSearch =
      !query ||
      person.name.toLowerCase().includes(query) ||
      person.city.toLowerCase().includes(query) ||
      'vibe coder'.includes(query) ||
      (recentReceipt && (
        recentReceipt.commitment.toLowerCase().includes(query) ||
        recentReceipt.receiptNumber.toLowerCase().includes(query) ||
        (recentReceipt.amount && recentReceipt.amount.toLowerCase().includes(query)) ||
        recentReceipt.promiserHandle.toLowerCase().includes(query)
      ));

    if (!matchesSearch) return false;

    if (selectedFilter === 'receipts') {
      return !!recentReceipt;
    }
    if (selectedFilter === 'high') {
      return person.percent >= 80;
    }
    if (selectedFilter === 'chatting') {
      return hasActiveTimer(person.id);
    }
    if (selectedFilter === 'genre-support') {
      const conn = checkUsersSeeEachOtherViaGenreSupport(currentActiveUserKey, person.id);
      if (conn.seesEachOther) return true;
      const targetSwitches = switchesMap[normalizeUserKey(person.id)];
      const viewerSwitches = switchesMap[normalizeUserKey(currentActiveUserKey)] || DEFAULT_FAIRY_SWITCHES;
      return Boolean(
        (viewerSwitches.genre && targetSwitches?.support) ||
        (viewerSwitches.support && targetSwitches?.genre) ||
        (!viewerSwitches.genre && !viewerSwitches.support && (targetSwitches?.genre || targetSwitches?.support))
      );
    }
    return true;
  });

  // Count of people with at least one Trust Receipt
  const peopleWithReceiptsCount = people.filter((p) => !!getRecentReceiptForPerson(p.id)).length;

  // Count of people with active Genre ↔ Support mutual visibility
  const genreSupportMatchesCount = people.filter((person) => {
    const conn = checkUsersSeeEachOtherViaGenreSupport(currentActiveUserKey, person.id);
    if (conn.seesEachOther) return true;
    const targetSwitches = switchesMap[normalizeUserKey(person.id)];
    const viewerSwitches = switchesMap[normalizeUserKey(currentActiveUserKey)] || DEFAULT_FAIRY_SWITCHES;
    return Boolean(
      (viewerSwitches.genre && targetSwitches?.support) ||
      (viewerSwitches.support && targetSwitches?.genre) ||
      (!viewerSwitches.genre && !viewerSwitches.support && (targetSwitches?.genre || targetSwitches?.support))
    );
  }).length;

  // =========================================================================
  // VIEW: MATCHES LIST SCREEN ("See for your matches")
  // =========================================================================
  return (
    <div className="w-full h-full flex flex-col bg-white text-slate-900 overflow-hidden font-sans select-none">
      {/* Score Notification Toast Banner */}
      {scoreToast && (
        <div
          className={`w-full px-4 py-2 text-xs font-black flex items-center justify-between text-white shrink-0 shadow-md animate-in slide-in-from-top duration-200 z-30 ${
            scoreToast.type === 'good' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {scoreToast.type === 'good' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{scoreToast.message}</span>
          </div>
          <button
            onClick={() => setScoreToast(null)}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Single Unified Header */}
      <header className="w-full px-3 sm:px-4 pt-3 pb-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 shadow-2xs z-10 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => {
              if (matchScreenTab !== 'matches') {
                setMatchScreenTab('matches');
              } else {
                onBackToFeed();
              }
            }}
            className="p-1.5 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
            aria-label="Back"
            title={matchScreenTab !== 'matches' ? 'Back to Integrity Score' : 'Back to Fairy Feed'}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight truncate">
              {matchScreenTab === 'star-stamps'
                ? 'Star Stamp Directory'
                : matchScreenTab === 'receipts'
                ? 'Trust Receipts'
                : 'Integrity Score'}
            </h1>
            <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {matchScreenTab === 'star-stamps'
                ? 'Hold politicians, CEOs, creators & peers accountable'
                : matchScreenTab === 'receipts'
                ? 'Record promises, verify acknowledgements & track deadlines'
                : '5-hour reply countdown &middot; Vibe coder community'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {matchScreenTab === 'star-stamps' ? (
            <button
              onClick={() => setShowCreateStarStampModal(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Create Star Stamp"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Create Star Stamp</span>
              <span className="sm:hidden">+ Create</span>
            </button>
          ) : matchScreenTab === 'receipts' ? (
            <button
              onClick={() => {
                setCreateReceiptPersonId(null);
                setCreateReceiptQuote('');
                setShowCreateReceiptModal(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Create Trust Receipt"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Create Receipt</span>
              <span className="sm:hidden">+ Create</span>
            </button>
          ) : (
            <>
              {people.length < INITIAL_SHARED_PEOPLE.length && (
                <button
                  onClick={handleResetPeople}
                  className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Reset removed people"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Sub-tab switcher in horizontal scroll view with right-edge fade */}
      <div className="relative w-full bg-slate-50 border-b border-slate-200/80 px-3 py-1.5 shrink-0 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pr-8">
          <button
            onClick={() => setMatchScreenTab('matches')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              matchScreenTab === 'matches'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-200/70'
            }`}
          >
            <span>Integrity Score</span>
          </button>

          <button
            onClick={() => setMatchScreenTab('receipts')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              matchScreenTab === 'receipts'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-200/70'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Trust Receipts</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                matchScreenTab === 'receipts'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 text-purple-900'
              }`}
            >
              {trustReceiptsCount}
            </span>
          </button>

          <button
            onClick={() => setMatchScreenTab('star-stamps')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              matchScreenTab === 'star-stamps'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-200/70'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>Star Stamps</span>
          </button>
        </div>
        {/* Subtle fade on right edge so users can tell it scrolls */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent" />
      </div>

      {matchScreenTab === 'star-stamps' ? (
        <StarStampsScreen
          hideHeader={true}
          onBackToFeed={() => setMatchScreenTab('matches')}
        />
      ) : matchScreenTab === 'receipts' ? (
        <TrustReceiptsView
          hideHeader={true}
          availablePeople={people}
          onOpenCreateModal={() => {
            setCreateReceiptPersonId(null);
            setCreateReceiptQuote('');
            setShowCreateReceiptModal(true);
          }}
          onOpenCreateModalForPerson={(personId) => {
            handleOpenCreateReceiptForPerson(personId);
          }}
          onOpenChatWithPerson={(personId) => {
            setMatchScreenTab('matches');
            setActiveChatPersonId(personId);
          }}
          onBackToMatches={() => setMatchScreenTab('matches')}
        />
      ) : (
        <>
          {/* Search Bar for Matches Screen */}
          <div className="px-3 sm:px-4 pt-2.5 pb-2 bg-white border-b border-slate-100 shrink-0 space-y-2 max-w-full overflow-hidden">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people or promises..."
                className="w-full bg-slate-100 rounded-full pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black truncate"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Chips with horizontal scroll & right-edge fade */}
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 pr-8 text-[10.5px]">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedFilter === 'all'
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('receipts')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    selectedFilter === 'receipts'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                  }`}
                  title="Show matches with recent Trust Receipts"
                >
                  <FileCheck className="w-3 h-3 text-amber-500" />
                  <span>With Receipts</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('high')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    selectedFilter === 'high'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Top Ratings (&ge;80%)</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('chatting')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    selectedFilter === 'chatting'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>Chatting (Active)</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('genre-support')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    selectedFilter === 'genre-support'
                      ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-2xs ring-2 ring-purple-300'
                      : 'bg-purple-50 text-purple-900 border border-purple-200/90 hover:bg-purple-100'
                  }`}
                  title="Users who activate Genre and Support see each other"
                >
                  <span className="flex items-center -space-x-1">
                    <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  </span>
                  <span>Genre ↔ Support ({genreSupportMatchesCount})</span>
                </button>
              </div>
              {/* Fade on right edge so users can tell they scroll */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-7 bg-gradient-to-l from-white to-transparent" />
            </div>
          </div>

      {/* Main List Area (SafeArea container) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
        {/* Active Genre ↔ Support Mutual Visibility Banner */}
        {genreSupportMatchesCount > 0 && (
          <div className="mb-2 p-3 bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 text-white rounded-2xl shadow-sm border border-purple-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black flex items-center gap-1.5 flex-wrap">
                  <span className="text-white">Genre ↔ Support Mutual Visibility</span>
                  <span className="text-[9px] bg-purple-500/30 text-purple-200 border border-purple-400/30 px-1.5 py-0.2 rounded-full font-mono">
                    {genreSupportMatchesCount} Connected
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-300 leading-tight mt-0.5 truncate">
                  Active rule: Users who activate Genre and users who activate Support can see each other!
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'genre-support' ? 'all' : 'genre-support')}
              className="px-2.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-[10.5px] font-black cursor-pointer shrink-0 transition-transform active:scale-95 shadow-xs whitespace-nowrap"
            >
              {selectedFilter === 'genre-support' ? 'Show All' : 'Filter Connected'}
            </button>
          </div>
        )}

        {people.length === 0 ? (
          /* Empty State: "No one left" in center of list screen */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3 text-2xl shadow-inner">
              ✨
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-1">
              No one left
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              All integrity scores have been evaluated or removed after the 5-hour reply timer.
            </p>
            <button
              onClick={handleResetPeople}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Integrity Scores
            </button>
          </div>
        ) : filteredPeople.length === 0 ? (
          /* Search Empty State */
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3 text-xl shadow-inner">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              No integrity records found
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              No results found for "{searchQuery}". Try searching for another name or city.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          filteredPeople.map((person) => {
            const isChatting = hasActiveTimer(person.id);
            const isGreenPercent = person.percent >= 50;
            const recentReceipt = getRecentReceiptForPerson(person.id);
            const genreSupportConn = checkUsersSeeEachOtherViaGenreSupport(currentActiveUserKey, person.id);
            const targetSwitches = switchesMap[normalizeUserKey(person.id)];
            const viewerSwitches = switchesMap[normalizeUserKey(currentActiveUserKey)] || DEFAULT_FAIRY_SWITCHES;
            const hasCrossSynergy = genreSupportConn.seesEachOther ||
              Boolean(viewerSwitches.genre && targetSwitches?.support) ||
              Boolean(viewerSwitches.support && targetSwitches?.genre) ||
              Boolean(!viewerSwitches.genre && !viewerSwitches.support && (targetSwitches?.genre || targetSwitches?.support));

            return (
              <div
                key={person.id}
                className="w-full max-w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-2.5 overflow-hidden box-border"
              >
                {/* Top Row: Circular Avatar & Details (Left) + Match Rating & Message (Right) */}
                <div className="flex items-center justify-between gap-2 min-w-0 max-w-full">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${person.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs overflow-hidden`}
                    >
                      {person.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        person.avatarInitial
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-sm text-slate-900 truncate leading-tight">
                          {person.name}
                        </h3>
                        <span
                          className="text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200"
                          title="Verified Integrity Profile"
                        >
                          Verified
                        </span>
                      </div>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        Vibe coder &middot; {person.city} &middot; <span className="font-semibold text-slate-700">Verified</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Message / Chatting Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenChat(person)}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs shrink-0 ${
                        isChatting
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300 flex items-center gap-1'
                          : 'bg-black hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isChatting ? (
                        <>
                          <Clock className="w-3 h-3 text-emerald-200 animate-spin-slow shrink-0" />
                          <span>Chatting</span>
                        </>
                      ) : (
                        'Message'
                      )}
                    </button>
                  </div>
                </div>

                {/* Genre ↔ Support Cross-System Visibility Badge */}
                {hasCrossSynergy && (
                  <div className="w-full bg-gradient-to-r from-purple-50/90 via-slate-50 to-rose-50/90 border border-purple-200/90 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs ring-1 ring-white" title="Genre: Purple">
                          G
                        </span>
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs ring-1 ring-white" title="Support: Red">
                          S
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-900 leading-tight">
                          <span className="text-purple-700">Genre</span>
                          <span className="text-slate-400">↔</span>
                          <span className="text-red-700">Support</span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-extrabold border border-purple-200">
                            Mutual Visibility Active
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-600 font-medium truncate mt-0.5">
                          {genreSupportConn.description || (
                            targetSwitches?.genre
                              ? `${person.name} activated Genre (Purple) · Seen because Support is active`
                              : `${person.name} activated Support (Red) · Seen because Genre is active`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      {targetSwitches?.genre && (
                        <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-purple-600 text-white shadow-2xs">
                          Genre ON
                        </span>
                      )}
                      {targetSwitches?.support && (
                        <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white shadow-2xs">
                          Support ON
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* "How [Person] Deals" - Tweet / Comment Writing Container */}
                {recentReceipt ? (
                  <div
                    onClick={() => setInspectingReceipt(recentReceipt)}
                    className="w-full max-w-full bg-amber-50/40 hover:bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 transition-all cursor-pointer group shadow-2xs hover:shadow-xs active:scale-[0.99] space-y-2 overflow-hidden"
                  >
                    {/* Tweet Header Row */}
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                        <div className="w-5 h-5 rounded-md bg-black text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                          <FileCheck className="w-3 h-3" />
                        </div>
                        <span className="font-black text-[11px] text-slate-900 truncate">
                          How {person.name.split(' ')[0]} Deals
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[9px] font-mono font-bold shrink-0">
                          #{recentReceipt.receiptNumber}
                        </span>
                      </div>

                      {/* Status Chip */}
                      <div className="shrink-0 text-[9.5px] font-bold">
                        {recentReceipt.outcome === 'fulfilled' ? (
                          <span className="text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Fulfilled
                          </span>
                        ) : recentReceipt.acknowledgedAt ? (
                          <span className="text-purple-700 bg-purple-100/90 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        ) : (
                          <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                            <Clock className="w-2.5 h-2.5" /> Awaiting
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quoted Commitment in Tweet Writing Style */}
                    <div className="bg-white/90 rounded-xl p-2 sm:p-2.5 border border-amber-200/60 shadow-2xs max-w-full overflow-hidden">
                      <p className="text-xs text-slate-800 font-medium leading-relaxed italic break-words">
                        "{recentReceipt.commitment}"
                      </p>
                    </div>

                    {/* Deal Stakes & Timeline Pill Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] min-w-0 max-w-full">
                      {recentReceipt.amount && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-mono font-black border border-amber-200 shrink-0">
                          Stake: {recentReceipt.amount}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-sans font-bold flex items-center gap-1 shrink-0">
                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                        {recentReceipt.deadlineLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black text-amber-400 font-mono font-extrabold flex items-center gap-1 ml-auto shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {getCountdownRemaining(recentReceipt.deadlineAt)}
                      </span>
                    </div>

                    {/* Full-Width Mobile Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingReceipt(recentReceipt);
                      }}
                      className="w-full max-w-full mt-1.5 py-2 px-2.5 sm:px-3 bg-black hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl text-xs font-black flex items-center justify-between shadow-xs transition-all cursor-pointer overflow-hidden min-w-0"
                    >
                      <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
                        <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">See How {person.name.split(' ')[0]} Deals &amp; Agreement</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                    </button>
                  </div>
                ) : (
                  /* Option to propose a deal if no deal yet */
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCreateReceiptForPerson(person.id);
                    }}
                    className="w-full max-w-full py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Propose Deal with {person.name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* Create Trust Receipt Modal */}
      <CreateTrustReceiptModal
        isOpen={showCreateReceiptModal}
        onClose={() => setShowCreateReceiptModal(false)}
        availablePeople={people}
        initialPersonId={createReceiptPersonId}
        initialQuote={createReceiptQuote}
        onReceiptCreated={(r) => {
          const updated = loadTrustReceipts();
          setReceiptsList(updated);
          setTrustReceiptsCount(updated.length);
          setScoreToast({
            type: 'good',
            message: `Trust Receipt #${r.receiptNumber} issued to ${r.promiserName}! Check out their deal on the match card.`,
          });
          setSearchQuery(r.promiserName);
          setMatchScreenTab('matches');
          setInspectingReceipt(r);
        }}
      />

      {/* Deal & Time Quick Inspector Modal */}
      {inspectingReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setInspectingReceipt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-black text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-black text-xs text-slate-900 tracking-wider">
                      #{inspectingReceipt.receiptNumber}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black uppercase">
                      TRUST RECEIPT
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 truncate">
                    How {inspectingReceipt.promiserName} Deals
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectingReceipt(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto overscroll-contain">
              {/* Promiser Profile & Reliability Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full ${inspectingReceipt.promiserAvatarBg} text-white font-bold text-sm flex items-center justify-center shadow-xs overflow-hidden shrink-0`}
                  >
                    {inspectingReceipt.promiserAvatarUrl ? (
                      <img
                        src={inspectingReceipt.promiserAvatarUrl}
                        alt={inspectingReceipt.promiserName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      inspectingReceipt.promiserAvatarInitial
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {inspectingReceipt.promiserName}
                      </span>
                      <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        {inspectingReceipt.promiserPercent}% Match
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block truncate">
                      {inspectingReceipt.promiserHandle} &middot; {inspectingReceipt.promiserCity}
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide block">
                      Promiser (The Deal Maker)
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Recorded By
                  </span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {inspectingReceipt.creatorName}
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-semibold block">You (Creator)</span>
                </div>
              </div>

              {/* The Deal Agreement */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <span>1. Agreed Commitment (The Deal)</span>
                  </span>
                  {inspectingReceipt.amount && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-black text-xs border border-amber-200/80">
                      Stake: {inspectingReceipt.amount}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-amber-50/50 rounded-2xl border-l-4 border-amber-500 border border-slate-200/70 text-xs font-semibold text-slate-900 leading-relaxed shadow-2xs">
                  "{inspectingReceipt.commitment}"
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-0.5">
                  &bull; This is the exact binding promise recorded on FAIRY.
                </p>
              </div>

              {/* The Deal Timeline & Countdown */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    <span>2. Delivery Target &amp; Live Time</span>
                  </span>
                  <span className="text-[9.5px] font-mono font-bold text-slate-500">
                    Created {new Date(inspectingReceipt.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Scheduled Target */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      Target:
                    </span>
                    <span className="font-extrabold text-slate-900 text-[11px]">
                      {inspectingReceipt.deadlineLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      Exact Time:
                    </span>
                    <span className="font-bold text-slate-700 text-[10.5px]">
                      {new Date(inspectingReceipt.deadlineAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Live Remaining Ticking Clock - Responsive Stack for Mobile */}
                <div className="p-3 bg-black text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Live Countdown Remaining
                      </span>
                      <span className="font-mono text-sm sm:text-base font-black text-amber-400 tracking-wider">
                        {getRemainingTimeFormattedForReceipt(inspectingReceipt.deadlineAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      Status:
                    </span>
                    <span className="text-xs font-black text-white">
                      {inspectingReceipt.outcome === 'fulfilled'
                        ? 'Fulfilled ✅'
                        : inspectingReceipt.acknowledgedAt
                        ? 'Locked & Active 🔒'
                        : 'Awaiting Acknowledgement ⏳'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deal Integrity Guarantee Box */}
              <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200 text-[10.5px] text-slate-600 leading-relaxed">
                <span className="font-black text-slate-900 block text-[10px] uppercase mb-0.5">
                  🛡️ FAIRY Integrity Guarantee
                </span>
                Deals on FAIRY cannot be silently edited. On-time delivery directly raises {inspectingReceipt.promiserName}'s reputation score.
              </div>
            </div>

            {/* Modal Actions - Grid for Mobile Touch */}
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const promiser = people.find((p) => p.id === inspectingReceipt.promiserId);
                  setInspectingReceipt(null);
                  if (promiser) {
                    handleOpenChat(promiser);
                  }
                }}
                className="py-2.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <AeriCommentIcon className="w-3.5 h-3.5 text-slate-600" />
                <span className="truncate">Chat with {inspectingReceipt.promiserName.split(' ')[0]}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInspectingReceipt(null);
                  setMatchScreenTab('receipts');
                }}
                className="py-2.5 px-2 rounded-xl bg-black hover:bg-slate-800 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">View in Receipts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Time's Up Dialog if triggered on list view */}
      {renderTimesUpDialog()}

      {/* Render CreateStarStampModal if triggered from header */}
      {showCreateStarStampModal && (
        <CreateStarStampModal
          isOpen={showCreateStarStampModal}
          onClose={() => setShowCreateStarStampModal(false)}
        />
      )}
    </div>
  );

  // =========================================================================
  // TIME'S UP DIALOG
  // Centered dialog, dimmed barrier, white card, radius ~20, soft shadow, barrierDismissible: false
  // Title: "Time's up!"
  // Text: "How was [name]'s reply?"
  // Two full-width buttons:
  // - "Good reply" (green): keep person, clear timer, stay in chat
  // - "Bad reply" (red): REMOVE that person completely, clear timer, navigate to list
  // =========================================================================
  function renderTimesUpDialog() {
    if (!showTimesUpDialog || !dialogPerson) return null;

    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowTimesUpDialog(false);
            setDialogPerson(null);
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      >
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-[340px] bg-white rounded-[20px] p-6 shadow-2xl text-center border border-slate-100 transform transition-all scale-100"
        >
          {/* Dismiss button */}
          <button
            onClick={() => {
              setShowTimesUpDialog(false);
              setDialogPerson(null);
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
            Time's up!
          </h3>

          {/* Text */}
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            How was <strong className="text-slate-900 font-extrabold">{dialogPerson.name}</strong>'s reply?
          </p>

          {/* Current Score vs Expected Outcome */}
          <div className="mb-5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-around text-xs">
            <div>
              <span className="text-slate-400 block text-[9.5px] font-bold">CURRENT</span>
              <span className="font-black text-slate-900 text-sm">{dialogPerson.percent}%</span>
            </div>
            <div className="text-slate-300 font-bold">&rarr;</div>
            <div>
              <span className="text-emerald-600 block text-[9.5px] font-bold">GOOD (+5% ADD)</span>
              <span className="font-black text-emerald-700 text-sm">{Math.min(100, dialogPerson.percent + 5)}%</span>
            </div>
            <div className="text-slate-300 font-bold">&middot;</div>
            <div>
              <span className="text-rose-600 block text-[9.5px] font-bold">BAD (-50% SUBTRACT)</span>
              <span className="font-black text-rose-700 text-sm">{Math.max(0, dialogPerson.percent - 50)}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* Good reply (green) - adds +5% score */}
            <button
              onClick={() => handleGoodReply(dialogPerson.id)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Good reply (+5% Score ADDED)</span>
            </button>

            {/* Bad reply (red) - subtracts -50% score */}
            <button
              onClick={() => handleBadReply(dialogPerson.id)}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Bad reply (-50% Score SUBTRACTED)</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowTimesUpDialog(false);
                setDialogPerson(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchesScreen;
