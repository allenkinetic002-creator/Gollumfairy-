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
export const STORAGE_SHARED_PEOPLE_KEY = 'vibe_shared_people_v5_real';
export const STORAGE_SHARED_TIMERS_KEY = 'vibe_shared_5hr_timers_v5_real';

export const INITIAL_SHARED_PEOPLE: SharedPerson[] = [
  {
    id: 'user-allen',
    name: 'Allen Dharak',
    handle: '@allenkinetic002-creator',
    city: 'London',
    percent: 98,
    matchPercent: 98,
    approval: '95+',
    avatarBg: 'bg-indigo-600',
    avatarInitial: 'AD',
    avatarText: 'AD',
    isOnline: true,
    unreadCount: 1,
    lastActive: 'Active now',
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Welcome to Fairy! Live GitHub sync is active with your repository.',
        time: '10:42 AM',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Awesome! All posts and interactions are syncing in real time.',
        time: '10:45 AM',
      },
    ],
  },
  {
    id: 'user-gollumfairy',
    name: 'Gollumfairy',
    handle: '@Gollumfairy',
    city: 'Fairy Realm',
    percent: 96,
    matchPercent: 96,
    approval: '92+',
    avatarBg: 'bg-purple-600',
    avatarInitial: 'GF',
    avatarText: 'GF',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 5m ago',
    messages: [
      {
        id: 'gf1',
        sender: 'them',
        text: 'Welcome to Fairy network! Official curator and trust receipts partner.',
        time: '9:15 AM',
      },
      {
        id: 'gf2',
        sender: 'me',
        text: 'Glad to connect on the real feed!',
        time: '9:30 AM',
      },
    ],
  },
  {
    id: 'user-kinetic',
    name: 'Kinetic',
    handle: '@kinetic',
    city: 'Kyoto',
    percent: 94,
    matchPercent: 94,
    approval: '88+',
    avatarBg: 'bg-emerald-600',
    avatarInitial: 'K',
    avatarText: 'K',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 20m ago',
    messages: [
      {
        id: 'k1',
        sender: 'them',
        text: 'Hey! Loved the Kyoto photo posts and atmosphere.',
        time: '11:10 AM',
      },
      {
        id: 'k2',
        sender: 'me',
        text: 'Thanks! Capturing quiet tea house moments.',
        time: '11:15 AM',
      },
    ],
  },
  {
    id: 'user-karak',
    name: 'Karak',
    handle: '@karak',
    city: 'Kyoto',
    percent: 92,
    matchPercent: 92,
    approval: '98%',
    avatarBg: 'bg-amber-600',
    avatarInitial: 'KK',
    avatarText: 'KK',
    isOnline: true,
    unreadCount: 0,
    lastActive: 'Active 1h ago',
    messages: [
      {
        id: 'kk1',
        sender: 'them',
        text: 'Hey! Ready to collaborate on visual stories and street frames.',
        time: 'Yesterday',
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
        // filter out any lingering fake users from old localstorage
        const filtered = parsed.filter(
          (p) =>
            p &&
            !['p-elena', 'p-clara', 'p-alex', 'p-sarah', 'p-maya', 'p-liam', 'p-james', 'p-nina', 'user-elena'].includes(
              p.id
            ) &&
            !p.name?.includes('Rostova') &&
            !p.name?.includes('Elena')
        );
        if (filtered.length > 0) {
          return filtered.map((p) => ({
            ...p,
            percent: p.percent ?? p.matchPercent ?? 85,
            matchPercent: p.matchPercent ?? p.percent ?? 85,
            avatarInitial: p.avatarInitial ?? p.avatarText ?? 'U',
            avatarText: p.avatarText ?? p.avatarInitial ?? 'U',
          }));
        }
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
      percent: p.percent ?? p.matchPercent ?? 85,
      matchPercent: p.matchPercent ?? p.percent ?? 85,
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
  const defaultTimers: Record<string, number> = {
    'user-allen': Date.now() - 3600000,
    'user-gollumfairy': Date.now() - 7200000,
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
