/**
 * GitHub Repository & Activity Sync Manager
 * Automatically syncs user actions to allenkinetic002-creator/Gollumfairy- on main branch
 */

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastCommit?: string;
  lastSyncTime?: Date;
  error?: string;
  autoSyncEnabled: boolean;
}

type SyncListener = (status: SyncStatus) => void;

const listeners: Set<SyncListener> = new Set();

let currentStatus: SyncStatus = {
  status: 'idle',
  autoSyncEnabled: localStorage.getItem('fairy_auto_sync_repo') !== 'false',
};

function notify() {
  listeners.forEach((listener) => {
    try {
      listener({ ...currentStatus });
    } catch (e) {
      console.warn('Sync listener error:', e);
    }
  });
}

export function subscribeToSyncStatus(listener: SyncListener): () => void {
  listeners.add(listener);
  listener({ ...currentStatus });
  return () => {
    listeners.delete(listener);
  };
}

export function setAutoSyncEnabled(enabled: boolean) {
  currentStatus.autoSyncEnabled = enabled;
  localStorage.setItem('fairy_auto_sync_repo', enabled ? 'true' : 'false');
  notify();
}

let syncTimeout: any = null;
const pendingActions: Array<{ action: string; description: string; details?: any; timestamp: string }> = [];

/**
 * Triggers a repo sync when the user uses the app
 */
export async function syncActivityToRepo(
  action: string,
  description: string,
  details?: any,
  forceImmediate = false
): Promise<void> {
  if (!currentStatus.autoSyncEnabled && !forceImmediate) {
    return;
  }

  pendingActions.push({
    action,
    description,
    details,
    timestamp: new Date().toISOString(),
  });

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Debounce rapid user events by 1.2s to batch cleanly, or execute immediately if forced
  const delay = forceImmediate ? 0 : 1200;

  syncTimeout = setTimeout(async () => {
    if (pendingActions.length === 0) return;

    const itemsToSync = [...pendingActions];
    pendingActions.length = 0;

    currentStatus = {
      ...currentStatus,
      status: 'syncing',
      error: undefined,
    };
    notify();

    try {
      const lastItem = itemsToSync[itemsToSync.length - 1];
      const commitMsg = itemsToSync.length === 1
        ? `feat(app): ${lastItem.description}`
        : `feat(app): batch update (${itemsToSync.length} actions: ${lastItem.description})`;

      const res = await fetch('/api/sync/repo-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: itemsToSync,
          message: commitMsg,
        }),
      });

      const data = await res.json();
      if (data.success) {
        currentStatus = {
          ...currentStatus,
          status: 'synced',
          lastCommit: data.lastCommit || 'Synced',
          lastSyncTime: new Date(),
          error: undefined,
        };
      } else {
        currentStatus = {
          ...currentStatus,
          status: 'error',
          error: data.error || 'Failed to sync to GitHub',
        };
      }
    } catch (err: any) {
      currentStatus = {
        ...currentStatus,
        status: 'error',
        error: err.message || 'Network error syncing to repo',
      };
    } finally {
      notify();
      // Revert from "synced" to "idle" after 4 seconds
      setTimeout(() => {
        if (currentStatus.status === 'synced') {
          currentStatus = { ...currentStatus, status: 'idle' };
          notify();
        }
      }, 4000);
    }
  }, delay);
}
