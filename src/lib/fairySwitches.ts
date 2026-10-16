/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FairySystemSwitches {
  support: boolean;
  favorite: boolean;
  trending: boolean;
  loyalty: boolean;
  genre: boolean;
  supportedGenre?: string;
  updatedAt?: string;
  activatedBy?: string;
}

export interface FairyUserProfile {
  id: string;
  name: string;
  handle: string;
  avatarInitial: string;
  avatarBg: string;
  bio?: string;
  role?: string;
}

export const KNOWN_USERS: FairyUserProfile[] = [
  {
    id: 'user-allen',
    name: 'Allen Dharak',
    handle: '@allenkinetic002-creator',
    avatarInitial: 'AD',
    avatarBg: 'bg-indigo-600',
    bio: 'Founder & Creative Developer',
  },
  {
    id: 'user-gollumfairy',
    name: 'Gollumfairy',
    handle: '@Gollumfairy',
    avatarInitial: 'GF',
    avatarBg: 'bg-purple-600',
    bio: 'Official Fairy Creator & Curator',
  },
  {
    id: 'user-kinetic',
    name: 'Kinetic',
    handle: '@kinetic',
    avatarInitial: 'K',
    avatarBg: 'bg-emerald-600',
    bio: 'Photographer & Digital Artist',
  },
  {
    id: 'user-karak',
    name: 'Karak',
    handle: '@karak',
    avatarInitial: 'KK',
    avatarBg: 'bg-amber-600',
    bio: 'Visual Storyteller',
  },
];

export const FAIRY_USER_SWITCHES_STORAGE_KEY = 'fairy_user_switches_map_v2';
export const FAIRY_LAST_USER_KEY = 'fairy_last_active_user_key';

export const DEFAULT_FAIRY_SWITCHES: FairySystemSwitches = {
  support: false,
  favorite: false,
  trending: false,
  loyalty: false,
  genre: false,
};

export type SwitchListener = (switches: FairySystemSwitches, userKey?: string) => void;
const listeners = new Set<SwitchListener>();

export function normalizeUserKey(user?: { id?: string; handle?: string; username?: string; email?: string } | null | string): string {
  if (!user) return '';
  if (typeof user === 'string') return user.toLowerCase().replace('@', '').trim();
  const raw = user.id || user.handle || user.username || user.email || '';
  return raw.toLowerCase().replace('@', '').trim();
}

export function getAllKnownUsers(): FairyUserProfile[] {
  const map = new Map<string, FairyUserProfile>();
  KNOWN_USERS.forEach((u) => {
    map.set(normalizeUserKey(u), u);
  });

  try {
    const raw = localStorage.getItem('fairy_registered_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((u: any) => {
          const key = normalizeUserKey(u);
          if (key && !map.has(key)) {
            map.set(key, {
              id: u.id || `user-${key}`,
              name: u.name || key,
              handle: u.handle || `@${key}`,
              avatarInitial: (u.name || key).slice(0, 2).toUpperCase(),
              avatarBg: u.avatarBg || 'bg-purple-600',
              bio: u.bio || '',
            });
          }
        });
      }
    }
  } catch (e) {}

  return Array.from(map.values());
}

export const SEED_USER_SWITCHES: Record<string, FairySystemSwitches> = {
  'user-karak': {
    support: false,
    favorite: false,
    trending: false,
    loyalty: false,
    genre: true,
    supportedGenre: 'Artist',
    activatedBy: 'user-karak',
  },
  'user-kinetic': {
    support: true,
    favorite: false,
    trending: false,
    loyalty: false,
    genre: false,
    supportedGenre: 'Artist',
    activatedBy: 'user-kinetic',
  },
  'user-allen': {
    support: true,
    favorite: true,
    trending: false,
    loyalty: true,
    genre: true,
    supportedGenre: 'Artist',
    activatedBy: 'user-allen',
  },
  'user-gollumfairy': {
    support: true,
    favorite: false,
    trending: true,
    loyalty: false,
    genre: true,
    supportedGenre: 'Artist',
    activatedBy: 'user-gollumfairy',
  },
  guest: {
    support: true,
    favorite: false,
    trending: false,
    loyalty: false,
    genre: true,
    supportedGenre: 'Artist',
    activatedBy: 'guest',
  },
};

export function getAllUserSwitchesMap(): Record<string, FairySystemSwitches> {
  let userMap: Record<string, FairySystemSwitches> = { ...SEED_USER_SWITCHES };
  try {
    const raw = localStorage.getItem(FAIRY_USER_SWITCHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        userMap = { ...userMap, ...parsed };
      }
    }
  } catch (e) {
    console.warn('[FairySwitches] Failed to parse user switches map:', e);
  }
  return userMap;
}

export interface GenreSupportMatch {
  user: FairyUserProfile;
  targetSwitches: FairySystemSwitches;
  matchType: 'they_support_you_genre' | 'they_genre_you_support' | 'both_mutual' | 'community_pair';
  badgeLabel: string;
  badgeDetail: string;
}

/**
 * Checks if two users see each other under the rule:
 * "any user who activate genre and other user who activate support suppose to see each other"
 */
export function checkUsersSeeEachOtherViaGenreSupport(
  userAIdOrKey?: string,
  userBIdOrKey?: string
): {
  seesEachOther: boolean;
  matchType?: 'a_genre_b_support' | 'a_support_b_genre' | 'both_mutual';
  badgeLabel: string;
  description: string;
  userARole?: 'genre' | 'support' | 'both';
  userBRole?: 'genre' | 'support' | 'both';
} {
  const keyA = normalizeUserKey(userAIdOrKey);
  const keyB = normalizeUserKey(userBIdOrKey);
  if (!keyA || !keyB || keyA === keyB) {
    return { seesEachOther: false, badgeLabel: '', description: '' };
  }

  const map = getAllUserSwitchesMap();
  const switchesA = map[keyA] || DEFAULT_FAIRY_SWITCHES;
  const switchesB = map[keyB] || DEFAULT_FAIRY_SWITCHES;

  const aHasGenre = Boolean(switchesA.genre);
  const aHasSupport = Boolean(switchesA.support);
  const bHasGenre = Boolean(switchesB.genre);
  const bHasSupport = Boolean(switchesB.support);

  const aGenreBSupport = aHasGenre && bHasSupport;
  const aSupportBGenre = aHasSupport && bHasGenre;

  if (aGenreBSupport && aSupportBGenre) {
    return {
      seesEachOther: true,
      matchType: 'both_mutual',
      badgeLabel: 'Mutual Genre ↔ Support',
      description: 'You both have active Genre and Support! Full bidirectional synergy.',
      userARole: 'both',
      userBRole: 'both',
    };
  }

  if (aGenreBSupport) {
    return {
      seesEachOther: true,
      matchType: 'a_genre_b_support',
      badgeLabel: 'Genre ↔ Support Match',
      description: 'You activated Genre (Purple) and they activated Support (Red). You see each other!',
      userARole: 'genre',
      userBRole: 'support',
    };
  }

  if (aSupportBGenre) {
    return {
      seesEachOther: true,
      matchType: 'a_support_b_genre',
      badgeLabel: 'Support ↔ Genre Match',
      description: 'You activated Support (Red) and they activated Genre (Purple). You see each other!',
      userARole: 'support',
      userBRole: 'genre',
    };
  }

  return { seesEachOther: false, badgeLabel: '', description: '' };
}

/**
 * Returns all other users that the viewer sees because of Genre ↔ Support activation.
 */
export function getGenreSupportMatchesForUser(viewerKey?: string): GenreSupportMatch[] {
  const normViewer = normalizeUserKey(viewerKey);
  const map = getAllUserSwitchesMap();
  const viewerSwitches = normViewer ? (map[normViewer] || DEFAULT_FAIRY_SWITCHES) : getStoredFairySwitchesForUser();
  const knownUsers = getAllKnownUsers();

  const viewerHasGenre = Boolean(viewerSwitches.genre);
  const viewerHasSupport = Boolean(viewerSwitches.support);

  const matches: GenreSupportMatch[] = [];

  for (const user of knownUsers) {
    const targetKey = normalizeUserKey(user);
    if (normViewer && targetKey === normViewer) continue;

    const targetSwitches = map[targetKey] || DEFAULT_FAIRY_SWITCHES;
    const targetHasGenre = Boolean(targetSwitches.genre);
    const targetHasSupport = Boolean(targetSwitches.support);

    if (viewerHasGenre && viewerHasSupport && (targetHasGenre || targetHasSupport)) {
      matches.push({
        user,
        targetSwitches,
        matchType: 'both_mutual',
        badgeLabel: 'Genre & Support Match',
        badgeDetail: `You & ${user.name} both have active Genre/Support synergy!`,
      });
    } else if (viewerHasGenre && targetHasSupport) {
      matches.push({
        user,
        targetSwitches,
        matchType: 'they_support_you_genre',
        badgeLabel: 'Seen via Support (Red)',
        badgeDetail: `${user.name} activated Support (Red) & you activated Genre (Purple). You see each other!`,
      });
    } else if (viewerHasSupport && targetHasGenre) {
      matches.push({
        user,
        targetSwitches,
        matchType: 'they_genre_you_support',
        badgeLabel: 'Seen via Genre (Purple)',
        badgeDetail: `${user.name} activated Genre (Purple) & you activated Support (Red). You see each other!`,
      });
    } else if (!viewerHasGenre && !viewerHasSupport && (targetHasGenre || targetHasSupport)) {
      // Community preview when viewer hasn't turned either on yet
      matches.push({
        user,
        targetSwitches,
        matchType: 'community_pair',
        badgeLabel: targetHasGenre ? 'Genre Active (Purple)' : 'Support Active (Red)',
        badgeDetail: targetHasGenre
          ? `${user.name} activated Genre — sees anyone on Support!`
          : `${user.name} activated Support — sees anyone on Genre!`,
      });
    }
  }

  return matches;
}

/**
 * Returns all active community pairs where User A has Genre and User B has Support
 */
export function getAllCommunityGenreSupportPairs(): Array<{
  genreUser: FairyUserProfile;
  supportUser: FairyUserProfile;
  genreSwitches: FairySystemSwitches;
  supportSwitches: FairySystemSwitches;
}> {
  const map = getAllUserSwitchesMap();
  const knownUsers = getAllKnownUsers();
  const genreUsers = knownUsers.filter((u) => Boolean(map[normalizeUserKey(u)]?.genre));
  const supportUsers = knownUsers.filter((u) => Boolean(map[normalizeUserKey(u)]?.support));

  const pairs: Array<{
    genreUser: FairyUserProfile;
    supportUser: FairyUserProfile;
    genreSwitches: FairySystemSwitches;
    supportSwitches: FairySystemSwitches;
  }> = [];

  for (const gUser of genreUsers) {
    for (const sUser of supportUsers) {
      if (normalizeUserKey(gUser) !== normalizeUserKey(sUser)) {
        pairs.push({
          genreUser: gUser,
          supportUser: sUser,
          genreSwitches: map[normalizeUserKey(gUser)] || DEFAULT_FAIRY_SWITCHES,
          supportSwitches: map[normalizeUserKey(sUser)] || DEFAULT_FAIRY_SWITCHES,
        });
      }
    }
  }

  return pairs;
}

/**
 * Returns all real users who currently have the given feature switched ON.
 */
export function getActiveUsersForFeature(
  featureKey: 'support' | 'favorite' | 'trending' | 'loyalty' | 'genre'
): FairyUserProfile[] {
  const userSwitchesMap = getAllUserSwitchesMap();
  const knownUsers = getAllKnownUsers();
  const activeUserKeys = new Set<string>();

  for (const [rawKey, switches] of Object.entries(userSwitchesMap)) {
    if (switches && switches[featureKey]) {
      activeUserKeys.add(normalizeUserKey(rawKey));
    }
  }

  const result: FairyUserProfile[] = [];
  for (const key of activeUserKeys) {
    const user = knownUsers.find((u) => normalizeUserKey(u) === key);
    if (user) {
      result.push(user);
    } else {
      result.push({
        id: `user-${key}`,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        handle: key.startsWith('@') ? key : `@${key}`,
        avatarInitial: key.slice(0, 2).toUpperCase(),
        avatarBg: 'bg-purple-600',
      });
    }
  }

  return result;
}

export function getStoredFairySwitchesForUser(user?: { id?: string; handle?: string; username?: string; email?: string } | null | string): FairySystemSwitches {
  const key = normalizeUserKey(user);
  const map = getAllUserSwitchesMap();

  // If a logged-in user is provided:
  if (key) {
    if (map[key]) {
      const s = map[key];
      return {
        support: Boolean(s.support),
        favorite: Boolean(s.favorite),
        trending: Boolean(s.trending),
        loyalty: Boolean(s.loyalty),
        genre: Boolean(s.genre),
        supportedGenre: typeof s.supportedGenre === 'string' ? s.supportedGenre : undefined,
        updatedAt: s.updatedAt,
        activatedBy: key,
      };
    }
    // New / other user who hasn't activated anything yet:
    // ALL SWITCHES MUST BE OFF!
    return { ...DEFAULT_FAIRY_SWITCHES, activatedBy: key };
  }

  // If NOT logged in (guest / logged out view):
  // Preserve the last user's activated state so "it stays that way" on logout
  const lastKey = localStorage.getItem(FAIRY_LAST_USER_KEY);
  if (lastKey && map[lastKey]) {
    const s = map[lastKey];
    return {
      support: Boolean(s.support),
      favorite: Boolean(s.favorite),
      trending: Boolean(s.trending),
      loyalty: Boolean(s.loyalty),
      genre: Boolean(s.genre),
      supportedGenre: typeof s.supportedGenre === 'string' ? s.supportedGenre : undefined,
      updatedAt: s.updatedAt,
      activatedBy: lastKey,
    };
  }

  return { ...DEFAULT_FAIRY_SWITCHES };
}

// Backward compatible helper
export function getStoredFairySwitches(user?: { id?: string; handle?: string; username?: string; email?: string } | null | string): FairySystemSwitches {
  return getStoredFairySwitchesForUser(user);
}

export function saveStoredFairySwitchesForUser(
  user?: { id?: string; handle?: string; username?: string; email?: string } | null | string,
  switches?: FairySystemSwitches
): void {
  const safeSwitches = switches || DEFAULT_FAIRY_SWITCHES;
  const key = normalizeUserKey(user) || localStorage.getItem(FAIRY_LAST_USER_KEY) || 'guest';
  const map = getAllUserSwitchesMap();

  const payload: FairySystemSwitches = {
    support: Boolean(safeSwitches.support),
    favorite: Boolean(safeSwitches.favorite),
    trending: Boolean(safeSwitches.trending),
    loyalty: Boolean(safeSwitches.loyalty),
    genre: Boolean(safeSwitches.genre),
    supportedGenre: typeof safeSwitches.supportedGenre === 'string' ? safeSwitches.supportedGenre : undefined,
    updatedAt: new Date().toISOString(),
    activatedBy: key,
  };

  map[key] = payload;

  try {
    localStorage.setItem(FAIRY_USER_SWITCHES_STORAGE_KEY, JSON.stringify(map));
    if (key && key !== 'guest') {
      localStorage.setItem(FAIRY_LAST_USER_KEY, key);
    }
  } catch (e) {
    console.warn('[FairySwitches] Failed to save local storage switches:', e);
  }

  // Notify active listeners
  listeners.forEach((listener) => {
    try {
      listener(payload, key);
    } catch {}
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairy_switches_sync', { detail: { userId: key, switches: payload } }));
  }

  // Sync to server
  fetch('/api/fairy-switches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: key, switches: payload }),
  }).catch(() => {});
}

// Backward compatible helper
export function saveStoredFairySwitches(switches: FairySystemSwitches, user?: { id?: string; handle?: string; username?: string; email?: string } | null | string): void {
  saveStoredFairySwitchesForUser(user, switches);
}

export function subscribeToFairySwitches(listener: SwitchListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function fetchServerFairySwitches(userKey?: string): Promise<FairySystemSwitches | null> {
  try {
    const url = userKey ? `/api/fairy-switches?userId=${encodeURIComponent(userKey)}` : '/api/fairy-switches';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.userSwitches && typeof data.userSwitches === 'object') {
        const currentMap = getAllUserSwitchesMap();
        const merged = { ...currentMap, ...data.userSwitches };
        try {
          localStorage.setItem(FAIRY_USER_SWITCHES_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
      }
      if (data?.switches) {
        return {
          support: Boolean(data.switches.support),
          favorite: Boolean(data.switches.favorite),
          trending: Boolean(data.switches.trending),
          loyalty: Boolean(data.switches.loyalty),
          genre: Boolean(data.switches.genre),
          supportedGenre: typeof data.switches.supportedGenre === 'string' ? data.switches.supportedGenre : undefined,
          updatedAt: data.switches.updatedAt,
          activatedBy: data.switches.activatedBy || userKey,
        };
      }
    }
  } catch (e) {}
  return null;
}
