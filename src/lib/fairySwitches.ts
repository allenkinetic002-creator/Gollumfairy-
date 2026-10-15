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
  updatedAt?: string;
  activatedBy?: string;
}

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

export function getAllUserSwitchesMap(): Record<string, FairySystemSwitches> {
  try {
    const raw = localStorage.getItem(FAIRY_USER_SWITCHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.warn('[FairySwitches] Failed to parse user switches map:', e);
  }
  return {};
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
      if (data?.switches) {
        return {
          support: Boolean(data.switches.support),
          favorite: Boolean(data.switches.favorite),
          trending: Boolean(data.switches.trending),
          loyalty: Boolean(data.switches.loyalty),
          genre: Boolean(data.switches.genre),
          updatedAt: data.switches.updatedAt,
          activatedBy: data.switches.activatedBy || userKey,
        };
      }
    }
  } catch (e) {}
  return null;
}
