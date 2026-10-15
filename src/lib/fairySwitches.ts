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
}

export const FAIRY_SWITCHES_STORAGE_KEY = 'fairy_system_switches_v1';

export const DEFAULT_FAIRY_SWITCHES: FairySystemSwitches = {
  support: false,
  favorite: false,
  trending: false,
  loyalty: false,
  genre: false,
};

type SwitchListener = (switches: FairySystemSwitches) => void;
const listeners = new Set<SwitchListener>();

export function getStoredFairySwitches(): FairySystemSwitches {
  try {
    const raw = localStorage.getItem(FAIRY_SWITCHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        support: Boolean(parsed.support),
        favorite: Boolean(parsed.favorite),
        trending: Boolean(parsed.trending),
        loyalty: Boolean(parsed.loyalty),
        genre: Boolean(parsed.genre),
        updatedAt: parsed.updatedAt,
      };
    }
  } catch (e) {
    console.warn('[FairySwitches] Failed to parse local storage switches:', e);
  }
  return { ...DEFAULT_FAIRY_SWITCHES };
}

export function saveStoredFairySwitches(switches: FairySystemSwitches): void {
  const payload: FairySystemSwitches = {
    support: Boolean(switches.support),
    favorite: Boolean(switches.favorite),
    trending: Boolean(switches.trending),
    loyalty: Boolean(switches.loyalty),
    genre: Boolean(switches.genre),
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(FAIRY_SWITCHES_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('[FairySwitches] Failed to save local storage switches:', e);
  }

  // Notify active listeners
  listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch {}
  });

  // Sync to server
  fetch('/api/fairy-switches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ switches: payload }),
  }).catch(() => {});
}

export function subscribeToFairySwitches(listener: SwitchListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function fetchServerFairySwitches(): Promise<FairySystemSwitches | null> {
  try {
    const res = await fetch('/api/fairy-switches');
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
        };
      }
    }
  } catch (e) {
    // Non-fatal
  }
  return null;
}
