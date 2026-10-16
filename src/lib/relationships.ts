/**
 * Social Relationship Manager (Follow, Friend, Enemy)
 * Handles Instagram/Twitter-style Following and long-press switching to Friend and Enemy.
 * Supports generalized user social networks (Friends, Enemies, Followers, Following)
 * across all registered and community users with real-time sync & GitHub repository commit.
 */
import { syncActivityToRepo } from './repoSync';

export type RelationshipStatus = 'none' | 'following' | 'friend' | 'enemy';
export type RelationshipButtonMode = 'follow' | 'friend' | 'enemy';

export interface RelationshipRecord {
  targetKey: string;
  targetHandle: string;
  targetName: string;
  targetAvatar?: string;
  targetInitial?: string;
  targetBg?: string;
  targetProfession?: string;
  targetCity?: string;
  sourceKey?: string;
  sourceHandle?: string;
  sourceName?: string;
  status: RelationshipStatus;
  mode: RelationshipButtonMode;
  updatedAt: string;
}

export interface RelationshipState {
  [key: string]: RelationshipRecord;
}

const STORAGE_KEY = 'fairy_social_relationships_v1';
const DEFAULT_BUTTON_MODE_KEY = 'fairy_default_relationship_button_mode';

let inMemoryState: RelationshipState = {};
const listeners: Set<() => void> = new Set();

export function normalizeTargetKey(key?: string): string {
  if (!key) return '';
  return key.toLowerCase().replace(/^@/, '').replace(/\s+/g, '_').trim();
}

/**
 * Standard community users profile directory for auto-enrichment
 */
export const KNOWN_COMMUNITY_USERS = [
  {
    id: 'user-allen',
    handle: '@allenkinetic002-creator',
    name: 'Allen Dharak',
    profession: 'Creative Developer & Founder',
    city: 'London, UK',
    avatarInitial: 'AD',
    avatarBg: 'bg-indigo-600',
    avatarUrl: '',
    baseFollowers: 1200,
    baseFollowing: 24,
  },
  {
    id: 'user-gollumfairy',
    handle: '@Gollumfairy',
    name: 'Gollumfairy',
    profession: 'Official Fairy Creator & Curator',
    city: 'Fairy Realm',
    avatarInitial: 'GF',
    avatarBg: 'bg-purple-600',
    avatarUrl: '',
    baseFollowers: 850,
    baseFollowing: 15,
  },
  {
    id: 'user-kinetic',
    handle: '@kinetic',
    name: 'Kinetic',
    profession: 'Photographer & Digital Artist',
    city: 'Kyoto, Japan',
    avatarInitial: 'K',
    avatarBg: 'bg-emerald-600',
    avatarUrl: '',
    baseFollowers: 420,
    baseFollowing: 30,
  },
  {
    id: 'user-karak',
    handle: '@karak',
    name: 'Karak',
    profession: 'Visual Storyteller',
    city: 'Kyoto, Japan',
    avatarInitial: 'KK',
    avatarBg: 'bg-amber-600',
    avatarUrl: '',
    baseFollowers: 310,
    baseFollowing: 18,
  },
];

export function enrichUserInfo(key: string, name?: string, handle?: string) {
  const norm = normalizeTargetKey(key);
  const found = KNOWN_COMMUNITY_USERS.find(
    (u) =>
      normalizeTargetKey(u.handle) === norm ||
      normalizeTargetKey(u.name) === norm ||
      normalizeTargetKey(u.id) === norm
  );

  if (found) {
    return {
      targetName: found.name,
      targetHandle: found.handle,
      targetProfession: found.profession,
      targetCity: found.city,
      targetInitial: found.avatarInitial,
      targetBg: found.avatarBg,
      targetAvatar: found.avatarUrl,
    };
  }

  const cleanHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${norm}`;
  const cleanName = name || handle?.replace(/^@/, '') || norm;
  const initial = cleanName.slice(0, 2).toUpperCase() || 'U';

  return {
    targetName: cleanName,
    targetHandle: cleanHandle,
    targetProfession: 'Creator & Community Member',
    targetCity: 'Global',
    targetInitial: initial,
    targetBg: 'bg-purple-600',
    targetAvatar: '',
  };
}

export function getActiveUserKey(): string {
  try {
    const raw = localStorage.getItem('fairy_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const k = parsed.handle || parsed.username || parsed.name || parsed.id;
      if (k) return normalizeTargetKey(k);
    }
  } catch {}
  return 'allenkinetic002-creator';
}

function loadInitialState(): RelationshipState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Relationships] Error parsing local storage:', err);
  }
  return {};
}

inMemoryState = loadInitialState();

// Fetch initial data from server if available
if (typeof window !== 'undefined') {
  fetch('/api/relationships')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && typeof data === 'object') {
        inMemoryState = { ...inMemoryState, ...data };
        saveLocal();
        notify();
      }
    })
    .catch(() => {});
}

function saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryState));
  } catch (e) {
    console.warn('[Relationships] Local storage save error:', e);
  }
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('[Relationships] Listener error:', e);
    }
  });
}

export function subscribeRelationships(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDefaultButtonMode(): RelationshipButtonMode {
  try {
    const val = localStorage.getItem(DEFAULT_BUTTON_MODE_KEY);
    if (val === 'friend' || val === 'enemy' || val === 'follow') {
      return val;
    }
  } catch {}
  return 'follow';
}

export function setDefaultButtonMode(mode: RelationshipButtonMode) {
  try {
    localStorage.setItem(DEFAULT_BUTTON_MODE_KEY, mode);
  } catch {}
  notify();
}

/**
 * Resolves relationship from source user to target user
 */
export function getRelationship(
  targetIdentifier: string,
  sourceIdentifier?: string
): RelationshipRecord {
  const normTarget = normalizeTargetKey(targetIdentifier);
  const normSource = normalizeTargetKey(sourceIdentifier || getActiveUserKey());

  const compositeKey = `${normSource}->${normTarget}`;

  // Check composite key first, then legacy flat key
  const match = inMemoryState[compositeKey] || inMemoryState[normTarget];
  if (match) {
    const enriched = enrichUserInfo(normTarget, match.targetName, match.targetHandle);
    return {
      ...match,
      ...enriched,
      targetKey: normTarget,
      sourceKey: match.sourceKey || normSource,
    };
  }

  const enriched = enrichUserInfo(normTarget, targetIdentifier, targetIdentifier);
  return {
    targetKey: normTarget,
    ...enriched,
    sourceKey: normSource,
    status: 'none',
    mode: getDefaultButtonMode(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates a relationship and syncs to backend & GitHub
 */
export async function updateRelationship(
  targetIdentifier: string,
  updates: {
    status?: RelationshipStatus;
    mode?: RelationshipButtonMode;
    targetName?: string;
    targetHandle?: string;
    targetAvatar?: string;
    targetProfession?: string;
    targetCity?: string;
  },
  sourceIdentifier?: string
): Promise<RelationshipRecord> {
  const normTarget = normalizeTargetKey(targetIdentifier);
  const normSource = normalizeTargetKey(sourceIdentifier || getActiveUserKey());
  const current = getRelationship(normTarget, normSource);

  const nextStatus = updates.status !== undefined ? updates.status : current.status;
  const nextMode = updates.mode !== undefined ? updates.mode : current.mode;
  const name = updates.targetName || current.targetName;
  const handle = updates.targetHandle || current.targetHandle;
  const enriched = enrichUserInfo(normTarget, name, handle);

  const nextRecord: RelationshipRecord = {
    targetKey: normTarget,
    targetName: name || enriched.targetName,
    targetHandle: handle || enriched.targetHandle,
    targetProfession: updates.targetProfession || enriched.targetProfession,
    targetCity: updates.targetCity || enriched.targetCity,
    targetInitial: enriched.targetInitial,
    targetBg: enriched.targetBg,
    targetAvatar: updates.targetAvatar || enriched.targetAvatar,
    sourceKey: normSource,
    status: nextStatus,
    mode: nextMode,
    updatedAt: new Date().toISOString(),
  };

  const compositeKey = `${normSource}->${normTarget}`;

  // Save under composite key
  inMemoryState[compositeKey] = nextRecord;

  // Also maintain flat key for primary user backwards compatibility
  const activeKey = getActiveUserKey();
  if (normSource === activeKey || normSource === 'allenkinetic002-creator') {
    inMemoryState[normTarget] = nextRecord;
  }

  saveLocal();
  notify();

  // Sync to backend
  try {
    fetch('/api/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: normTarget,
        compositeKey,
        record: nextRecord,
      }),
    }).catch(() => {});
  } catch {}

  const actionText =
    nextStatus === 'following'
      ? `Followed ${nextRecord.targetHandle}`
      : nextStatus === 'friend'
      ? `Added ${nextRecord.targetHandle} as Friend`
      : nextStatus === 'enemy'
      ? `Added ${nextRecord.targetHandle} as Enemy`
      : `Removed relationship with ${nextRecord.targetHandle}`;

  syncActivityToRepo(
    'social_relationship',
    actionText,
    { target: normTarget, source: normSource, status: nextStatus, mode: nextMode },
    true
  );

  return nextRecord;
}

/**
 * Normal single-click action toggle
 */
export async function togglePrimaryAction(
  targetIdentifier: string,
  targetName?: string,
  targetHandle?: string,
  sourceIdentifier?: string
): Promise<RelationshipRecord> {
  const normSource = normalizeTargetKey(sourceIdentifier || getActiveUserKey());
  const current = getRelationship(targetIdentifier, normSource);
  const mode = current.mode || 'follow';

  let nextStatus: RelationshipStatus = 'none';

  if (mode === 'follow') {
    nextStatus = current.status === 'following' ? 'none' : 'following';
  } else if (mode === 'friend') {
    nextStatus = current.status === 'friend' ? 'none' : 'friend';
  } else if (mode === 'enemy') {
    nextStatus = current.status === 'enemy' ? 'none' : 'enemy';
  }

  return updateRelationship(
    targetIdentifier,
    {
      status: nextStatus,
      targetName,
      targetHandle,
    },
    normSource
  );
}

/**
 * Checks if target matches the given user
 */
export function isUserSelf(
  targetIdentifier?: string,
  currentUser?: { handle?: string; name?: string; id?: string; email?: string } | null
): boolean {
  if (!targetIdentifier || !currentUser) return false;
  const targetNorm = normalizeTargetKey(targetIdentifier);
  if (!targetNorm) return false;

  const currentHandleNorm = normalizeTargetKey(currentUser.handle || '');
  const currentNameNorm = normalizeTargetKey(currentUser.name || '');
  const currentIdNorm = normalizeTargetKey(currentUser.id || '');

  return (
    (Boolean(currentHandleNorm) && targetNorm === currentHandleNorm) ||
    (Boolean(currentNameNorm) && targetNorm === currentNameNorm) ||
    (Boolean(currentIdNorm) && targetNorm === currentIdNorm)
  );
}

/**
 * Generalized Query: Get all Friends for a user
 */
export function getUserFriends(userIdentifier?: string): RelationshipRecord[] {
  const userKey = normalizeTargetKey(userIdentifier || getActiveUserKey());
  const resultsMap = new Map<string, RelationshipRecord>();

  Object.entries(inMemoryState).forEach(([key, record]) => {
    if (record.status !== 'friend') return;

    const source = normalizeTargetKey(record.sourceKey || 'allenkinetic002-creator');
    const target = normalizeTargetKey(record.targetKey || key);

    // If this user initiated the friend request
    if (source === userKey) {
      const enriched = enrichUserInfo(target, record.targetName, record.targetHandle);
      resultsMap.set(target, { ...record, ...enriched, targetKey: target });
    }
    // Or if another user friended this user (mutual friendship reflection)
    else if (target === userKey) {
      const enriched = enrichUserInfo(source, record.sourceName, record.sourceHandle);
      resultsMap.set(source, {
        targetKey: source,
        ...enriched,
        status: 'friend',
        mode: 'friend',
        updatedAt: record.updatedAt,
      });
    }
  });

  return Array.from(resultsMap.values());
}

/**
 * Generalized Query: Get all Enemies for a user
 */
export function getUserEnemies(userIdentifier?: string): RelationshipRecord[] {
  const userKey = normalizeTargetKey(userIdentifier || getActiveUserKey());
  const resultsMap = new Map<string, RelationshipRecord>();

  Object.entries(inMemoryState).forEach(([key, record]) => {
    if (record.status !== 'enemy') return;

    const source = normalizeTargetKey(record.sourceKey || 'allenkinetic002-creator');
    const target = normalizeTargetKey(record.targetKey || key);

    // If this user marked the target as enemy
    if (source === userKey) {
      const enriched = enrichUserInfo(target, record.targetName, record.targetHandle);
      resultsMap.set(target, { ...record, ...enriched, targetKey: target });
    }
    // Or if someone marked this user as enemy (rivalry reflection)
    else if (target === userKey) {
      const enriched = enrichUserInfo(source, record.sourceName, record.sourceHandle);
      resultsMap.set(source, {
        targetKey: source,
        ...enriched,
        status: 'enemy',
        mode: 'enemy',
        updatedAt: record.updatedAt,
      });
    }
  });

  return Array.from(resultsMap.values());
}

/**
 * Generalized Query: Get all Following for a user
 */
export function getUserFollowing(userIdentifier?: string): RelationshipRecord[] {
  const userKey = normalizeTargetKey(userIdentifier || getActiveUserKey());
  const resultsMap = new Map<string, RelationshipRecord>();

  Object.entries(inMemoryState).forEach(([key, record]) => {
    if (record.status !== 'following' && record.status !== 'friend') return;

    const source = normalizeTargetKey(record.sourceKey || 'allenkinetic002-creator');
    const target = normalizeTargetKey(record.targetKey || key);

    if (source === userKey) {
      const enriched = enrichUserInfo(target, record.targetName, record.targetHandle);
      resultsMap.set(target, { ...record, ...enriched, targetKey: target });
    }
  });

  return Array.from(resultsMap.values());
}

/**
 * Generalized Query: Get all Followers for a user
 */
export function getUserFollowers(userIdentifier?: string): RelationshipRecord[] {
  const userKey = normalizeTargetKey(userIdentifier || getActiveUserKey());
  const resultsMap = new Map<string, RelationshipRecord>();

  // 1. Direct recorded followers in state
  Object.entries(inMemoryState).forEach(([key, record]) => {
    if (record.status !== 'following' && record.status !== 'friend') return;

    const target = normalizeTargetKey(record.targetKey || key);
    const source = normalizeTargetKey(record.sourceKey || 'allenkinetic002-creator');

    if (target === userKey && source !== userKey) {
      const enriched = enrichUserInfo(source, record.sourceName, record.sourceHandle);
      resultsMap.set(source, {
        targetKey: source,
        ...enriched,
        status: record.status,
        mode: record.mode,
        updatedAt: record.updatedAt,
      });
    }
  });

  // 2. Default community peer followers for major platform creators
  if (userKey === 'allenkinetic002-creator' || userKey === 'user-allen') {
    ['karak', 'gollumfairy'].forEach((peerKey) => {
      if (!resultsMap.has(peerKey)) {
        const enriched = enrichUserInfo(peerKey);
        resultsMap.set(peerKey, {
          targetKey: peerKey,
          ...enriched,
          status: 'following',
          mode: 'follow',
          updatedAt: new Date().toISOString(),
        });
      }
    });
  } else if (userKey === 'gollumfairy' || userKey === 'user-gollumfairy') {
    ['allenkinetic002-creator', 'kinetic'].forEach((peerKey) => {
      if (!resultsMap.has(peerKey)) {
        const enriched = enrichUserInfo(peerKey);
        resultsMap.set(peerKey, {
          targetKey: peerKey,
          ...enriched,
          status: 'following',
          mode: 'follow',
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  return Array.from(resultsMap.values());
}

/**
 * Backwards compatible functions for current user
 */
export function getAllFollowing(): RelationshipRecord[] {
  return getUserFollowing();
}

export function getAllFriends(): RelationshipRecord[] {
  return getUserFriends();
}

export function getAllEnemies(): RelationshipRecord[] {
  return getUserEnemies();
}

export function getAllFollowers(): RelationshipRecord[] {
  return getUserFollowers();
}
