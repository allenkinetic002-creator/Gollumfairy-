/**
 * Social Relationship Manager (Follow, Friend, Enemy)
 * Handles Instagram/Twitter-style Following and long-press switching to Friend and Enemy
 */
import { syncActivityToRepo } from './repoSync';

export type RelationshipStatus = 'none' | 'following' | 'friend' | 'enemy';
export type RelationshipButtonMode = 'follow' | 'friend' | 'enemy';

export interface RelationshipRecord {
  targetKey: string;
  targetHandle: string;
  targetName: string;
  status: RelationshipStatus;
  mode: RelationshipButtonMode;
  updatedAt: string;
}

export interface RelationshipState {
  [normalizedKey: string]: RelationshipRecord;
}

const STORAGE_KEY = 'fairy_social_relationships_v1';
const DEFAULT_BUTTON_MODE_KEY = 'fairy_default_relationship_button_mode';

let inMemoryState: RelationshipState = {};
const listeners: Set<() => void> = new Set();

export function normalizeTargetKey(key: string): string {
  if (!key) return '';
  return key.toLowerCase().replace(/^@/, '').replace(/\s+/g, '_').trim();
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
  } catch {
    // fallback
  }
  return 'follow';
}

export function setDefaultButtonMode(mode: RelationshipButtonMode) {
  try {
    localStorage.setItem(DEFAULT_BUTTON_MODE_KEY, mode);
  } catch {
    // fallback
  }
  notify();
}

export function getRelationship(targetIdentifier: string): RelationshipRecord {
  const norm = normalizeTargetKey(targetIdentifier);
  if (inMemoryState[norm]) {
    return inMemoryState[norm];
  }
  return {
    targetKey: norm,
    targetHandle: targetIdentifier.startsWith('@') ? targetIdentifier : `@${targetIdentifier}`,
    targetName: targetIdentifier,
    status: 'none',
    mode: getDefaultButtonMode(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateRelationship(
  targetIdentifier: string,
  updates: {
    status?: RelationshipStatus;
    mode?: RelationshipButtonMode;
    targetName?: string;
    targetHandle?: string;
  }
): Promise<RelationshipRecord> {
  const norm = normalizeTargetKey(targetIdentifier);
  const current = getRelationship(targetIdentifier);

  const nextStatus = updates.status !== undefined ? updates.status : current.status;
  const nextMode = updates.mode !== undefined ? updates.mode : current.mode;
  const name = updates.targetName || current.targetName;
  const handle = updates.targetHandle || current.targetHandle;

  const nextRecord: RelationshipRecord = {
    targetKey: norm,
    targetName: name,
    targetHandle: handle,
    status: nextStatus,
    mode: nextMode,
    updatedAt: new Date().toISOString(),
  };

  inMemoryState[norm] = nextRecord;
  saveLocal();
  notify();

  // Sync to backend & GitHub repo
  try {
    fetch('/api/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: norm,
        record: nextRecord,
      }),
    }).catch(() => {});
  } catch {
    // ignore network
  }

  const actionText =
    nextStatus === 'following'
      ? `Followed ${handle}`
      : nextStatus === 'friend'
      ? `Added ${handle} as Friend`
      : nextStatus === 'enemy'
      ? `Added ${handle} as Enemy`
      : `Removed relationship with ${handle}`;

  syncActivityToRepo(
    'social_relationship',
    actionText,
    { target: norm, status: nextStatus, mode: nextMode },
    true
  );

  return nextRecord;
}

/**
 * Normal single-click action:
 * - If current button mode is 'follow': toggles between 'following' and 'none' (just like Twitter / Instagram)
 * - If current button mode is 'friend': toggles between 'friend' and 'none'
 * - If current button mode is 'enemy': toggles between 'enemy' and 'none'
 */
export async function togglePrimaryAction(
  targetIdentifier: string,
  targetName?: string,
  targetHandle?: string
): Promise<RelationshipRecord> {
  const current = getRelationship(targetIdentifier);
  const mode = current.mode || 'follow';

  let nextStatus: RelationshipStatus = 'none';

  if (mode === 'follow') {
    nextStatus = current.status === 'following' ? 'none' : 'following';
  } else if (mode === 'friend') {
    nextStatus = current.status === 'friend' ? 'none' : 'friend';
  } else if (mode === 'enemy') {
    nextStatus = current.status === 'enemy' ? 'none' : 'enemy';
  }

  return updateRelationship(targetIdentifier, {
    status: nextStatus,
    targetName,
    targetHandle,
  });
}
