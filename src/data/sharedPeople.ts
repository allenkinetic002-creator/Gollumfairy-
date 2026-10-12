import elenaAvatar from '../assets/images/creator_portrait_elena_1791014499312.jpg';

export interface ChatMessageItem {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface SharedPerson {
  id: string;
  name: string;
  handle: string;
  city: string;
  percent: number; // match rating percentage
  matchPercent: number; // mirror for messenger
  approval: string;
  avatarBg: string;
  avatarInitial: string;
  avatarText: string; // mirror for messenger
  avatarUrl?: string;
  isOnline: boolean;
  unreadCount: number;
  lastActive: string;
  messages: ChatMessageItem[];
}

export const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
export const STORAGE_SHARED_PEOPLE_KEY = 'vibe_shared_people_v4';
export const STORAGE_SHARED_TIMERS_KEY = 'vibe_shared_5hr_timers_v4';

export const INITIAL_SHARED_PEOPLE: SharedPerson[] = [
  {
    id: 'p-elena',
    name: 'Elena Rostova',
    handle: '@elena_art',
    city: 'Berlin',
    percent: 91,
    matchPercent: 91,
    approval: '85+',
    avatarBg: 'bg-amber-600',
    avatarInitial: 'ER',
    avatarText: 'ER',
    avatarUrl: elenaAvatar,
    isOnline: true,
    unreadCount: 1,
    lastActive: 'Active now',
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Hey! Loved seeing Fairy trending today on the main feed.',
        time: '10:42 AM',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Thanks Elena! Your latest pavilion post was unbelievable. The brutalist lighting was unreal.',
        time: '10:45 AM',
      },
      {
        id: 'm3',
        sender: 'them',
        text: 'Appreciate it! Doing a new oil study this weekend. Want me to send over the initial WIP drafts?',
        time: '10:48 AM',
      },
    ],
  },
  {
    id: 'p-clara',
    name: 'Clara Vance',
    handle: '@clara_design',
    city: 'New York',
    percent: 88,
    matchPercent: 88,
    approval: '54+',
    avatarBg: 'bg-indigo-600',
    avatarInitial: 'CV',
    avatarText: 'CV',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 15m ago',
    messages: [
      {
        id: 'c1',
        sender: 'them',
        text: 'Hey! Loved your lighting breakdown in the latest Fairy editorial.',
        time: '9:15 AM',
      },
      {
        id: 'c2',
        sender: 'them',
        text: 'Would love to collaborate on a spring lookbook project in NYC next month!',
        time: '9:16 AM',
      },
      {
        id: 'c3',
        sender: 'me',
        text: 'That sounds amazing Clara! I have some moodboards ready to share.',
        time: '9:30 AM',
      },
    ],
  },
  {
    id: 'p-alex',
    name: 'Alex Rivers',
    handle: '@alex_rivers',
    city: 'San Francisco',
    percent: 94,
    matchPercent: 94,
    approval: '68+',
    avatarBg: 'bg-emerald-600',
    avatarInitial: 'AR',
    avatarText: 'AR',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 5m ago',
    messages: [
      {
        id: 'ar1',
        sender: 'them',
        text: 'Hey! Saw your vibe profile. Love the clean architecture you build!',
        time: '11:10 AM',
      },
      {
        id: 'ar2',
        sender: 'them',
        text: 'Are you experimenting with any creative UI or reactive animations recently?',
        time: '11:12 AM',
      },
      {
        id: 'ar3',
        sender: 'me',
        text: 'Yes! Implementing live countdown synchronization between match and messaging feeds.',
        time: '11:15 AM',
      },
    ],
  },
  {
    id: 'p-sarah',
    name: 'Sarah Chen',
    handle: '@sarah_chen',
    city: 'New York',
    percent: 89,
    matchPercent: 89,
    approval: '62+',
    avatarBg: 'bg-purple-600',
    avatarInitial: 'SC',
    avatarText: 'SC',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 20m ago',
    messages: [
      {
        id: 'sc1',
        sender: 'them',
        text: 'Hi there! Big fan of real-time state management and sleek typography.',
        time: 'Yesterday',
      },
      {
        id: 'sc2',
        sender: 'them',
        text: 'How do you handle background sync timers in your stacks?',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'p-zack',
    name: 'Zack Thorne',
    handle: '@zack_beats',
    city: 'Austin',
    percent: 76,
    matchPercent: 76,
    approval: '42+',
    avatarBg: 'bg-violet-600',
    avatarInitial: 'ZT',
    avatarText: 'ZT',
    isOnline: false,
    unreadCount: 0,
    lastActive: 'Active 2h ago',
    messages: [
      {
        id: 'z1',
        sender: 'them',
        text: 'Can I license your original audio track for an indie documentary soundtrack? We can discuss terms!',
        time: 'Yesterday',
      },
      {
        id: 'z2',
        sender: 'me',
        text: 'Hey Zack, absolutely! What timeline are you thinking for the project?',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'p-maya',
    name: 'Maya Lin',
    handle: '@maya_sky',
    city: 'London',
    percent: 62,
    matchPercent: 62,
    approval: '39+',
    avatarBg: 'bg-teal-600',
    avatarInitial: 'ML',
    avatarText: 'ML',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active now',
    messages: [
      {
        id: 'ml1',
        sender: 'them',
        text: 'Where is that yellow coat from?! The lighting in your shot is immaculate 💛',
        time: 'Yesterday',
      },
      {
        id: 'ml2',
        sender: 'me',
        text: 'Haha thank you! Vintage thrift find in SoHo. Golden hour did all the work!',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'p-devontae',
    name: 'Devontae Cole',
    handle: '@devontae_vibe',
    city: 'Atlanta',
    percent: 48, // under 50% -> red badge
    matchPercent: 48,
    approval: '27+',
    avatarBg: 'bg-rose-600',
    avatarInitial: 'DC',
    avatarText: 'DC',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 5m ago',
    messages: [
      {
        id: 'dc1',
        sender: 'them',
        text: 'Yo! Checked out your latest repository. Loving the snappy transitions.',
        time: 'Yesterday',
      },
      {
        id: 'dc2',
        sender: 'me',
        text: 'Thanks Devontae! Working on the reply timer flow today.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'p-marcus',
    name: 'Marcus Vance',
    handle: '@marcus_vision',
    city: 'San Francisco',
    percent: 95,
    matchPercent: 95,
    approval: '72+',
    avatarBg: 'bg-blue-600',
    avatarInitial: 'MV',
    avatarText: 'MV',
    isOnline: false,
    unreadCount: 0,
    lastActive: 'Active 1d ago',
    messages: [
      {
        id: 'mv1',
        sender: 'them',
        text: 'Hey, I just sent over the 35mm film scans for the desert drift series!',
        time: 'Oct 2',
      },
      {
        id: 'mv2',
        sender: 'me',
        text: 'Downloading now Marcus, colors look stunning.',
        time: 'Oct 2',
      },
    ],
  },
  {
    id: 'p-jordan',
    name: 'Jordan Taylor',
    handle: '@jordan_code',
    city: 'Seattle',
    percent: 45, // under 50% -> red badge
    matchPercent: 45,
    approval: '19+',
    avatarBg: 'bg-slate-700',
    avatarInitial: 'JT',
    avatarText: 'JT',
    isOnline: false,
    unreadCount: 0,
    lastActive: 'Active 3h ago',
    messages: [
      {
        id: 'jt1',
        sender: 'them',
        text: 'Hey! Seattle cloud developer here. Down to chat about distributed state sync.',
        time: 'Oct 1',
      },
    ],
  },
];

// Helper to load people
export function loadSharedPeople(): SharedPerson[] {
  try {
    const raw = localStorage.getItem(STORAGE_SHARED_PEOPLE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          percent: p.percent ?? p.matchPercent ?? 75,
          matchPercent: p.matchPercent ?? p.percent ?? 75,
          avatarInitial: p.avatarInitial ?? p.avatarText ?? 'U',
          avatarText: p.avatarText ?? p.avatarInitial ?? 'U',
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load shared people:', e);
  }
  return INITIAL_SHARED_PEOPLE;
}

// Helper to save people
export function saveSharedPeople(people: SharedPerson[]) {
  try {
    const normalized = people.map((p) => ({
      ...p,
      percent: p.percent ?? p.matchPercent ?? 75,
      matchPercent: p.matchPercent ?? p.percent ?? 75,
      avatarInitial: p.avatarInitial ?? p.avatarText ?? 'U',
      avatarText: p.avatarText ?? p.avatarInitial ?? 'U',
    }));
    const newJson = JSON.stringify(normalized);
    const oldJson = localStorage.getItem(STORAGE_SHARED_PEOPLE_KEY);
    if (newJson !== oldJson) {
      localStorage.setItem(STORAGE_SHARED_PEOPLE_KEY, newJson);
      localStorage.setItem('vibe_matches_people_v1', newJson);
      localStorage.setItem('vibe_messenger_convs_v2', newJson);
      window.dispatchEvent(new CustomEvent('vibe_shared_sync'));
    }
  } catch (e) {
    console.warn('Failed to save shared people:', e);
  }
}

// Helper to load timers
export function loadSharedTimers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_SHARED_TIMERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load shared timers:', e);
  }
  // Default running timers for Elena & Clara so user immediately sees live timers!
  const defaultTimers: Record<string, number> = {
    'p-elena': Date.now() - 3600000, // 1 hr ago -> 4 hours remaining
    'p-clara': Date.now() - 7200000, // 2 hrs ago -> 3 hours remaining
  };
  return defaultTimers;
}

// Helper to save timers
export function saveSharedTimers(timers: Record<string, number>) {
  try {
    const newJson = JSON.stringify(timers);
    const oldJson = localStorage.getItem(STORAGE_SHARED_TIMERS_KEY);
    if (newJson !== oldJson) {
      localStorage.setItem(STORAGE_SHARED_TIMERS_KEY, newJson);
      localStorage.setItem('vibe_matches_timers_v1', newJson);
      localStorage.setItem('vibe_messenger_timers_v2', newJson);
      window.dispatchEvent(new CustomEvent('vibe_shared_sync'));
    }
  } catch (e) {
    console.warn('Failed to save shared timers:', e);
  }
}
