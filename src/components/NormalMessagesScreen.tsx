import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Image,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Phone,
  Video,
  Sparkles,
  Clock,
  UserCheck,
  Plus,
  X,
  Bell,
  SlidersHorizontal,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { AeriRaygunIcon } from './AeriRaygunIcon';
import elenaAvatar from '../assets/images/creator_portrait_elena_1791014499312.jpg';
import { sendRemoteMessage } from '../lib/fairyBackend';
import { syncActivityToRepo } from '../lib/repoSync';


import {
  SharedPerson,
  INITIAL_SHARED_PEOPLE,
  loadSharedPeople,
  saveSharedPeople,
  loadSharedTimers,
  saveSharedTimers,
  FIVE_HOURS_MS,
} from '../data/sharedPeople';

export type NormalConversation = SharedPerson;

export interface NormalMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface DMRequest {
  id: string;
  name: string;
  handle: string;
  avatarBg: string;
  avatarText: string;
  intro: string;
  time: string;
}

const INITIAL_REQUESTS: DMRequest[] = [
  {
    id: 'req-1',
    name: 'Leo Sterling',
    handle: '@leo_3d',
    avatarBg: 'bg-teal-600',
    avatarText: 'L',
    intro: 'Hey! Loved your 3D spatial interface layout. Would love to connect about WebGL shader pipelines.',
    time: '4h ago',
  },
  {
    id: 'req-2',
    name: 'Amara Okafor',
    handle: '@amara_solar',
    avatarBg: 'bg-amber-600',
    avatarText: 'A',
    intro: 'Saw your feature on clean UI and brutalist typography. Let’s do a creative design exchange!',
    time: '1d ago',
  },
];

export interface TargetMessagePerson {
  id?: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  avatarBg?: string;
  avatarInitial?: string;
  city?: string;
}

interface NormalMessagesScreenProps {
  onBackToFeed: () => void;
  onOpenExclusiveMatches: () => void;
  targetPerson?: TargetMessagePerson | null;
  onClearTargetPerson?: () => void;
  isLoggedIn?: boolean;
  onRequireAuth?: (action: string) => void;
}

export function NormalMessagesScreen({
  onBackToFeed,
  onOpenExclusiveMatches,
  targetPerson,
  onClearTargetPerson,
  isLoggedIn = false,
  onRequireAuth,
}: NormalMessagesScreenProps) {
  // Conversations list state with persistence (paired directly with match screen)
  const [conversations, setConversations] = useState<SharedPerson[]>(() => loadSharedPeople());

  // Timers state: map of personId -> startedAt (timestamp in ms, synchronized across both screens)
  const [timers, setTimers] = useState<Record<string, number>>(() => loadSharedTimers());

  // Listen to cross-screen live synchronization
  useEffect(() => {
    const handleSync = () => {
      setConversations(loadSharedPeople());
      setTimers(loadSharedTimers());
    };
    window.addEventListener('vibe_shared_sync', handleSync);
    return () => window.removeEventListener('vibe_shared_sync', handleSync);
  }, []);

  const [requests, setRequests] = useState<DMRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<'messages' | 'requests'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Time's up modal state
  const [showTimesUpDialog, setShowTimesUpDialog] = useState(false);
  const [dialogConv, setDialogConv] = useState<NormalConversation | null>(null);

  // Score feedback toast state
  const [scoreToast, setScoreToast] = useState<{
    type: 'good' | 'bad';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (scoreToast) {
      const t = setTimeout(() => setScoreToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [scoreToast]);

  // Live clock tick (every second)
  const [now, setNow] = useState<number>(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const lastSelectedConvIdRef = useRef<string | null>(null);
  const lastConvMsgCountRef = useRef<number>(0);

  // If targetPerson prop is passed, auto-select or dynamically create conversation for that person
  useEffect(() => {
    if (!targetPerson) return;

    const currentPeople = loadSharedPeople();
    const normTargetName = targetPerson.name.toLowerCase().trim();
    const normTargetHandle = (targetPerson.handle || '').toLowerCase().trim();

    // Check if this person already exists in conversations
    let found = currentPeople.find((c) => {
      if (targetPerson.id && c.id === targetPerson.id) return true;
      if (c.name.toLowerCase().trim() === normTargetName) return true;
      if (normTargetHandle && c.handle.toLowerCase().trim() === normTargetHandle) return true;
      if (normTargetName.includes('elena') && c.name.toLowerCase().includes('elena')) return true;
      return false;
    });

    if (found) {
      setSelectedConvId(found.id);
    } else {
      // Create new shared person conversation entry
      const newId = targetPerson.id || `person-${Date.now()}`;
      const initials =
        targetPerson.avatarInitial ||
        targetPerson.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) ||
        'CR';

      const newPerson: SharedPerson = {
        id: newId,
        name: targetPerson.name,
        handle: targetPerson.handle || `@${targetPerson.name.toLowerCase().replace(/\s+/g, '_')}`,
        city: targetPerson.city || 'Creator',
        percent: 94,
        matchPercent: 94,
        approval: '85+',
        avatarBg: targetPerson.avatarBg || 'bg-purple-600',
        avatarInitial: initials,
        avatarText: initials,
        avatarUrl: targetPerson.avatarUrl,
        isOnline: true,
        unreadCount: 0,
        lastActive: 'Active now',
        messages: [
          {
            id: `msg-welcome-${Date.now()}`,
            sender: 'them',
            text: `Hey! Thanks for connecting. Drop me a message anytime! ✨`,
            time: 'Just now',
          },
        ],
      };

      const updated = [newPerson, ...currentPeople];
      setConversations(updated);
      saveSharedPeople(updated);
      setSelectedConvId(newId);
    }
  }, [targetPerson]);

  // Auto-focus chat input whenever a conversation is active
  useEffect(() => {
    if (selectedConvId) {
      const timer = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedConvId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync across tabs & screens
  useEffect(() => {
    const handleSync = () => {
      const updatedConvs = loadSharedPeople();
      setConversations((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(updatedConvs)) return prev;
        return updatedConvs;
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

  // Check if active chat's timer has reached 0
  useEffect(() => {
    if (!selectedConvId) return;

    const startedAt = timers[selectedConvId];
    if (startedAt) {
      const remainingMs = startedAt + FIVE_HOURS_MS - now;
      if (remainingMs <= 0 && !showTimesUpDialog) {
        const c = conversations.find((item) => item.id === selectedConvId);
        if (c) {
          setDialogConv(c);
          setShowTimesUpDialog(true);
        }
      }
    }
  }, [now, selectedConvId, timers, conversations, showTimesUpDialog]);

  // Scroll to bottom only when opening chat or when a new message is sent/received (allows free scrolling up)
  useEffect(() => {
    if (!selectedConvId) return;
    const conv = conversations.find((c) => c.id === selectedConvId);
    const msgs = conv?.messages || [];
    const isNewConv = lastSelectedConvIdRef.current !== selectedConvId;
    const isNewMessage = msgs.length > lastConvMsgCountRef.current;

    if (isNewConv || isNewMessage) {
      lastSelectedConvIdRef.current = selectedConvId;
      lastConvMsgCountRef.current = msgs.length;
      messagesEndRef.current?.scrollIntoView({ behavior: isNewConv ? 'auto' : 'smooth' });
    }
  }, [selectedConvId, conversations]);

  // Helper: get remaining time HH:MM:SS
  const getRemainingFormatted = (convId: string): string => {
    const startedAt = timers[convId];
    if (!startedAt) return '05:00:00';
    const remainingMs = Math.max(0, startedAt + FIVE_HOURS_MS - now);
    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const hasActiveTimer = (convId: string): boolean => {
    const startedAt = timers[convId];
    if (!startedAt) return false;
    return startedAt + FIVE_HOURS_MS - now > 0;
  };

  // Open chat: starts 5-hour countdown timestamp if first time
  const handleOpenConversation = (conv: NormalConversation) => {
    // Start 5-hour timer if not started yet
    setTimers((prev) => {
      if (prev[conv.id]) return prev; // never reset on reopen!
      const next = {
        ...prev,
        [conv.id]: Date.now(),
      };
      saveSharedTimers(next);
      return next;
    });

    // Check if 5 hours already elapsed
    const existingStart = timers[conv.id];
    if (existingStart && existingStart + FIVE_HOURS_MS - Date.now() <= 0) {
      setDialogConv(conv);
      setShowTimesUpDialog(true);
    }

    setSelectedConvId(conv.id);
  };

  // Fast-forward / Test Timer trigger
  const handleTestExpireTimer = (convId: string) => {
    const expiredTimers = {
      ...timers,
      [convId]: Date.now() - FIVE_HOURS_MS - 1000,
    };
    setTimers(expiredTimers);
    saveSharedTimers(expiredTimers);

    const target = conversations.find((c) => c.id === convId);
    if (target) {
      setDialogConv(target);
      setShowTimesUpDialog(true);
    }
  };

  // Good reply action:
  // ADD to their score (+5%, max 100%), clear timer, stay in chat
  const handleGoodReply = (customTargetId?: string) => {
    const targetId = customTargetId || dialogConv?.id || selectedConvId;
    if (!targetId) return;
    const target = conversations.find((c) => c.id === targetId);
    if (!target) return;
    const oldScore = target.percent ?? target.matchPercent;
    const newScore = Math.min(100, oldScore + 5);

    // Clear timer
    const updatedTimers = { ...timers };
    delete updatedTimers[targetId];
    setTimers(updatedTimers);
    saveSharedTimers(updatedTimers);

    // Update score in conversations
    const updatedConvs = conversations.map((c) => {
      if (c.id === targetId) {
        return {
          ...c,
          percent: newScore,
          matchPercent: newScore,
          messages: [
            ...c.messages,
            {
              id: `good-${Date.now()}`,
              sender: 'them' as const,
              text: `Good reply! 🌟 Match score ADDED by +5% (${oldScore}% → ${newScore}%).`,
              time: 'Just now',
            },
          ],
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    saveSharedPeople(updatedConvs);

    setScoreToast({
      type: 'good',
      message: `Score Boosted! +5% ADDED to ${target.name} (${oldScore}% → ${newScore}%)`,
    });

    syncActivityToRepo('dm_rating_boost', `Rated positive reply for ${target.name} (+5% score boost)`, { person: target.name, newScore }, true);

    setShowTimesUpDialog(false);
    setDialogConv(null);
  };

  // Bad reply action:
  // SUBTRACT from their score (-50%, min 0%), clear timer, keep in chat
  const handleBadReply = (customTargetId?: string) => {
    const targetId = customTargetId || dialogConv?.id || selectedConvId;
    if (!targetId) return;
    const target = conversations.find((c) => c.id === targetId);
    if (!target) return;
    const oldScore = target.percent ?? target.matchPercent;
    const newScore = Math.max(0, oldScore - 50);

    // Clear timer
    const updatedTimers = { ...timers };
    delete updatedTimers[targetId];
    setTimers(updatedTimers);
    saveSharedTimers(updatedTimers);

    // Update score in conversations
    const updatedConvs = conversations.map((c) => {
      if (c.id === targetId) {
        return {
          ...c,
          percent: newScore,
          matchPercent: newScore,
          messages: [
            ...c.messages,
            {
              id: `bad-${Date.now()}`,
              sender: 'them' as const,
              text: `Bad reply rated. ⚠️ Match score SUBTRACTED by -50% (${oldScore}% → ${newScore}%).`,
              time: 'Just now',
            },
          ],
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    saveSharedPeople(updatedConvs);

    setScoreToast({
      type: 'bad',
      message: `Score Penalized! -50% SUBTRACTED from ${target.name} (${oldScore}% → ${newScore}%)`,
    });

    syncActivityToRepo('dm_rating_penalty', `Rated negative reply for ${target.name} (-50% score penalty)`, { person: target.name, newScore }, true);

    setShowTimesUpDialog(false);
    setDialogConv(null);
  };

  // Send message
  const handleSendMessage = () => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth('send direct messages');
      return;
    }
    if (!inputText.trim() || !selectedConvId) return;

    const newMsg: NormalMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now',
    };

    const targetConv = conversations.find((c) => c.id === selectedConvId);

    const updatedConvs = conversations.map((c) => {
      if (c.id === selectedConvId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    saveSharedPeople(updatedConvs);

    // Sync sent message to Supabase & GitHub repository
    sendRemoteMessage({
      id: newMsg.id,
      sender_id: 'me',
      receiver_id: selectedConvId,
      text: newMsg.text,
    }).catch((err) => console.warn('[Supabase] Failed to sync message:', err));

    syncActivityToRepo('send_dm_message', `Sent DM message to ${targetConv?.name || 'chat'}: "${inputText.trim().slice(0, 35)}"`, { receiverId: selectedConvId }, true);

    setInputText('');


    // Simulate reply from the user after 1.4 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Awesome, totally agree! Let’s ship this.',
        'Sounds good, let me check the specs and ping you back.',
        'Brilliant! I will send the files over soon.',
        'Love that! Keep me posted on how it goes.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: NormalMessage = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: randomResponse,
        time: 'Just now',
      };

      setConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id === selectedConvId) {
            return {
              ...c,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        });
        saveSharedPeople(next);
        return next;
      });
    }, 1400);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Accept request (adds to shared paired list so it shows in Matches too!)
  const handleAcceptRequest = (req: DMRequest) => {
    const newConv: SharedPerson = {
      id: `p-req-${Date.now()}`,
      name: req.name,
      handle: req.handle,
      avatarBg: req.avatarBg,
      avatarInitial: req.avatarText,
      avatarText: req.avatarText,
      city: 'San Francisco',
      percent: 78,
      matchPercent: 78,
      approval: '40+',
      isOnline: true,
      unreadCount: 0,
      lastActive: 'Active now',
      messages: [
        {
          id: `req-msg-${Date.now()}`,
          sender: 'them',
          text: req.intro,
          time: 'Just now',
        },
      ],
    };
    const updatedConvs = [newConv, ...conversations];
    setConversations(updatedConvs);
    saveSharedPeople(updatedConvs);

    // Start 5-hour countdown timer
    const updatedTimers = {
      ...timers,
      [newConv.id]: Date.now(),
    };
    setTimers(updatedTimers);
    saveSharedTimers(updatedTimers);

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    handleOpenConversation(newConv);
  };

  const handleDeclineRequest = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const activeConv = conversations.find((c) => c.id === selectedConvId);

  // =========================================================================
  // VIEW: INDIVIDUAL CHAT THREAD WITH 5-HOUR REPLY TIMER & MATCH SCREEN LINK
  // =========================================================================
  if (selectedConvId && activeConv) {
    const isTimerRunning = hasActiveTimer(activeConv.id);
    const countdown = getRemainingFormatted(activeConv.id);

    return (
      <div className="w-full h-full flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
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
                <AlertCircle className="w-4 h-4" />
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

        {/* Top App Bar with Live Timer & Match Link */}
        <header className="w-full px-3 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => {
                setSelectedConvId(null);
                if (onClearTargetPerson) onClearTargetPerson();
              }}
              className="p-1 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label="Back to conversations"
              title="All conversations"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="relative shrink-0">
              <div
                className={`w-9 h-9 rounded-full ${activeConv.avatarBg} text-white font-bold text-xs flex items-center justify-center overflow-hidden shadow-xs`}
              >
                {activeConv.avatarUrl ? (
                  <img
                    src={activeConv.avatarUrl}
                    alt={activeConv.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  activeConv.avatarText
                )}
              </div>
              {activeConv.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-xs text-slate-900 leading-tight truncate flex items-center gap-1.5">
                {activeConv.name}
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                    activeConv.matchPercent >= 50
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                  title="Match Rating (No word Match)"
                >
                  {activeConv.matchPercent}%
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {activeConv.city} &middot; {activeConv.approval} approval
              </p>
            </div>
          </div>

          {/* Right: Live Countdown Timer & Test Time's Up trigger & Match Screen link */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Live 5-Hour Countdown Badge */}
            <div
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 font-mono text-[11px] font-bold tracking-wider shadow-2xs border ${
                isTimerRunning
                  ? 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="5-hour reply timer"
            >
              <Clock className="w-3 h-3 text-amber-600 animate-spin-slow" />
              <span>{countdown}</span>
            </div>

            {/* End Timer Lightning Trigger */}
            <button
              onClick={() => handleTestExpireTimer(activeConv.id)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-extrabold rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title="End timer (fast-forward to 0 to trigger Good/Bad reply popup)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
              <span>End Timer</span>
            </button>

            {/* Direct Link to Match Screen */}
            <button
              onClick={onOpenExclusiveMatches}
              className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open See for your matches screen"
            >
              <ExternalLink className="w-4 h-4 text-slate-700" />
            </button>

            {/* Return to Feed */}
            <button
              onClick={onBackToFeed}
              className="p-1.5 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close chat & return to feed"
              aria-label="Return to feed"
            >
              <X className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </header>

        {/* 5-Hour Reply Timer Banner in Chat */}
        <div className="bg-amber-50 border-b border-amber-100 px-3 py-1.5 flex items-center justify-between text-[10px] text-amber-900 font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>5-hour reply timer: {countdown} left</span>
          </div>
          <button
            onClick={() => handleTestExpireTimer(activeConv.id)}
            className="text-amber-800 underline font-extrabold cursor-pointer hover:text-amber-950 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>End timer now &rarr;</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC] overscroll-contain touch-pan-y">
          <div className="text-center my-2">
            <div
              className={`w-12 h-12 mx-auto mb-1.5 rounded-full ${activeConv.avatarBg} text-white font-bold text-sm flex items-center justify-center overflow-hidden shadow-xs`}
            >
              {activeConv.avatarUrl ? (
                <img
                  src={activeConv.avatarUrl}
                  alt={activeConv.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                activeConv.avatarText
              )}
            </div>
            <h3 className="font-extrabold text-xs text-slate-900">{activeConv.name}</h3>
            <p className="text-[10px] text-slate-400">
              {activeConv.handle} &middot; Vibe coder &middot; {activeConv.city}
            </p>
          </div>

          {activeConv.messages.map((m) => {
            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-black text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1 text-[9.5px] text-slate-400">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-full w-fit text-slate-500 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-slate-200 p-3 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 max-w-3xl mx-auto"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={inputText}
              onFocus={(e) => {
                if (!isLoggedIn && onRequireAuth) {
                  e.target.blur();
                  onRequireAuth('send direct messages');
                }
              }}
              onChange={(e) => {
                if (!isLoggedIn && onRequireAuth) {
                  onRequireAuth('send direct messages');
                  return;
                }
                setInputText(e.target.value);
              }}
              placeholder={isLoggedIn ? `Message ${activeConv.name}...` : 'Sign in to message...'}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <AeriRaygunIcon className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* Render Time's Up Dialog */}
        {renderTimesUpDialog()}
      </div>
    );
  }

  // =========================================================================
  // VIEW: MESSAGES INBOX LIST WITH 5-HOUR TIMERS & DIRECT LINK TO MATCH SCREEN
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
              <AlertCircle className="w-4 h-4" />
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

      {/* Messenger Header with Direct Link to Match Screen */}
      <header className="w-full px-4 pt-3 pb-2.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToFeed}
            className="p-1.5 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
            Messages
          </h1>
        </div>

        {/* Direct Link to Integrity Score Screen */}
        <button
          onClick={onOpenExclusiveMatches}
          className="px-3 py-1.5 rounded-full bg-black hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          title="Open Integrity Score screen"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Integrity Score &rarr;</span>
        </button>
      </header>

      {/* Prominent Banner linking to Integrity Score Screen */}
      <div className="px-4 pt-2.5 pb-1 shrink-0">
        <div
          onClick={onOpenExclusiveMatches}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white flex items-center justify-between shadow-xs cursor-pointer hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white leading-tight flex items-center gap-1.5">
                Integrity Score
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full">
                  5h Reply Timer
                </span>
              </h4>
              <p className="text-[10px] text-slate-300">
                Percentages (no Match word) &middot; Good/Bad Reply Dialog
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-300 px-2 py-1 rounded-md bg-white/10">
            Open &rarr;
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 shrink-0 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages or vibe coders..."
            className="w-full bg-slate-100 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Messages vs Requests */}
      <div className="w-full px-4 border-b border-slate-100 flex items-center gap-6 shrink-0 bg-white">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-2 text-xs font-extrabold transition-all relative cursor-pointer ${
            activeTab === 'messages' ? 'text-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          All Chats ({conversations.length})
          {activeTab === 'messages' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-2 text-xs font-extrabold transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests' ? 'text-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Requests ({requests.length})
          {requests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          )}
          {activeTab === 'requests' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
          )}
        </button>
      </div>

      {/* Conversation List with Live Timer Badges */}
      <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 scrollbar-thin">
        {activeTab === 'messages' ? (
          filteredConversations.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No conversations left. Check the Integrity Score screen to connect with new users!
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isTimerRunning = hasActiveTimer(conv.id);
              const timerStr = getRemainingFormatted(conv.id);

              return (
                <div
                  key={conv.id}
                  onClick={() => handleOpenConversation(conv)}
                  className="w-full px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full ${conv.avatarBg} text-white font-bold text-sm flex items-center justify-center overflow-hidden shadow-xs`}
                      >
                        {conv.avatarUrl ? (
                          <img
                            src={conv.avatarUrl}
                            alt={conv.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          conv.avatarText
                        )}
                      </div>
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">
                          {conv.name}
                        </h4>
                        {/* Rating percentage (NO word Match) */}
                        <span
                          className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                            conv.matchPercent >= 50
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {conv.matchPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {conv.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : 'Start conversation...'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Live Countdown Badge on Each Row */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    {/* Live Timer Pill */}
                    <div
                      className={`px-2 py-0.5 rounded-full flex items-center gap-1 font-mono text-[10px] font-extrabold shadow-2xs border ${
                        isTimerRunning
                          ? 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                      title="5-hour countdown"
                    >
                      <Clock className="w-2.5 h-2.5 text-amber-600" />
                      <span>{timerStr}</span>
                    </div>

                    <span className="text-[9.5px] text-slate-400 font-medium">
                      {lastMsg ? lastMsg.time : ''}
                    </span>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* Requests View */
          requests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No pending message requests.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-100 my-2 shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full ${req.avatarBg} text-white font-bold text-xs flex items-center justify-center`}
                  >
                    {req.avatarText}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{req.name}</h4>
                    <p className="text-[10px] text-slate-400">{req.handle} &middot; {req.time}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 mb-3">
                  "{req.intro}"
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req)}
                    className="flex-1 py-1.5 bg-black hover:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-colors cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-full transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Render Time's Up Dialog */}
      {renderTimesUpDialog()}
    </div>
  );

  // =========================================================================
  // TIME'S UP DIALOG:
  // Centered dialog, dimmed barrier, white card, radius ~20, soft shadow, barrierDismissible: false
  // Title: "Time's up!"
  // Text: "How was [name]'s reply?"
  // Two full-width buttons:
  // - "Good reply" (green): keep person, clear timer, stay in chat.
  // - "Bad reply" (red): REMOVE that person completely from list, clear timer,
  //   AND NAVIGATE / LINK TO THE MATCH SCREEN ("See for your matches")!
  // =========================================================================
  function renderTimesUpDialog() {
    if (!showTimesUpDialog || !dialogConv) return null;

    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowTimesUpDialog(false);
            setDialogConv(null);
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
              setDialogConv(null);
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
            How was <strong className="text-slate-900 font-extrabold">{dialogConv.name}</strong>'s reply?
          </p>

          {/* Current Score vs Expected Outcome */}
          <div className="mb-5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-around text-xs">
            <div>
              <span className="text-slate-400 block text-[9.5px] font-bold">CURRENT</span>
              <span className="font-black text-slate-900 text-sm">{dialogConv.matchPercent}%</span>
            </div>
            <div className="text-slate-300 font-bold">&rarr;</div>
            <div>
              <span className="text-emerald-600 block text-[9.5px] font-bold">GOOD (+5% ADD)</span>
              <span className="font-black text-emerald-700 text-sm">{Math.min(100, dialogConv.matchPercent + 5)}%</span>
            </div>
            <div className="text-slate-300 font-bold">&middot;</div>
            <div>
              <span className="text-rose-600 block text-[9.5px] font-bold">BAD (-50% SUBTRACT)</span>
              <span className="font-black text-rose-700 text-sm">{Math.max(0, dialogConv.matchPercent - 50)}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* Good reply (green): keep person, add +5% score, clear timer, stay in chat */}
            <button
              onClick={() => handleGoodReply(dialogConv.id)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Good reply (+5% Score ADDED)</span>
            </button>

            {/* Bad reply (red): subtract -50% score, clear timer */}
            <button
              onClick={() => handleBadReply(dialogConv.id)}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Bad reply (-50% Score SUBTRACTED)</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowTimesUpDialog(false);
                setDialogConv(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>

            {/* Direct Link to Match Screen */}
            <button
              onClick={() => {
                setShowTimesUpDialog(false);
                onOpenExclusiveMatches();
              }}
              className="w-full py-2 px-3 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Match Screen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
