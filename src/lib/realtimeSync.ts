/**
 * Real-time Backend Synchronization Service for Fairy Social Feed
 * Connects via Server-Sent Events (SSE) to /api/realtime/stream
 * and manages real-time ratings, votes, likes, and actions.
 */

export interface RemoteRatingItem {
  targetName: string;
  rating: number;
  isFinalized: boolean;
  updatedAt: string;
}

export interface RemoteVoteItem {
  personName: string;
  vote: 'like' | 'dislike' | null;
  isFinal: boolean;
  likes: number;
  dislikes: number;
  updatedAt: string;
}

type RealtimeListener = (event: string, data: any) => void;
const listeners = new Set<RealtimeListener>();

let eventSource: EventSource | null = null;
let isConnected = false;
let reconnectTimer: any = null;

export function initRealtimeStream() {
  if (typeof window === 'undefined') return;
  if (eventSource && (eventSource.readyState === EventSource.OPEN || eventSource.readyState === EventSource.CONNECTING)) {
    return;
  }

  try {
    eventSource = new EventSource('/api/realtime/stream');

    eventSource.onopen = () => {
      isConnected = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    eventSource.addEventListener('rating_submitted', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('rating_submitted', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse rating_submitted event:', err);
      }
    });

    eventSource.addEventListener('rating_reset', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('rating_reset', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse rating_reset event:', err);
      }
    });

    eventSource.addEventListener('vote_submitted', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('vote_submitted', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse vote_submitted event:', err);
      }
    });

    eventSource.addEventListener('vote_reset', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('vote_reset', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse vote_reset event:', err);
      }
    });

    eventSource.addEventListener('post_action', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('post_action', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse post_action event:', err);
      }
    });

    eventSource.addEventListener('comment_added', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('comment_added', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse comment_added event:', err);
      }
    });

    eventSource.addEventListener('repo_updated', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        notifyListeners('repo_updated', data);
      } catch (err) {
        console.warn('[Realtime] Failed to parse repo_updated event:', err);
      }
    });

    eventSource.onerror = () => {
      isConnected = false;
      eventSource?.close();
      eventSource = null;
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          initRealtimeStream();
        }, 3000);
      }
    };
  } catch (err) {
    console.warn('[Realtime] EventSource initialization warning:', err);
  }
}

function notifyListeners(event: string, data: any) {
  listeners.forEach((listener) => {
    try {
      listener(event, data);
    } catch (e) {
      console.warn('[Realtime] Error in listener:', e);
    }
  });
}

export function subscribeToRealtime(listener: RealtimeListener): () => void {
  listeners.add(listener);
  initRealtimeStream();
  return () => {
    listeners.delete(listener);
  };
}

export async function fetchRemoteRatings(): Promise<Record<string, RemoteRatingItem>> {
  try {
    const res = await fetch('/api/ratings');
    if (!res.ok) return {};
    const data = await res.json();
    return data.ratings || {};
  } catch {
    return {};
  }
}

export async function submitRatingToBackend(targetName: string, rating: number): Promise<boolean> {
  try {
    const res = await fetch('/api/ratings/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetName, rating, isFinalized: true }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] submitRatingToBackend error:', err);
    return false;
  }
}

export async function resetRatingOnBackend(targetName: string): Promise<boolean> {
  try {
    const res = await fetch('/api/ratings/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetName }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] resetRatingOnBackend error:', err);
    return false;
  }
}

export async function fetchRemoteVotes(): Promise<Record<string, RemoteVoteItem>> {
  try {
    const res = await fetch('/api/votes');
    if (!res.ok) return {};
    const data = await res.json();
    return data.votes || {};
  } catch {
    return {};
  }
}

export async function submitVoteToBackend(
  personName: string,
  vote: 'like' | 'dislike',
  likes?: number,
  dislikes?: number
): Promise<boolean> {
  try {
    const res = await fetch('/api/votes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personName, vote, likes, dislikes, isFinal: true }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] submitVoteToBackend error:', err);
    return false;
  }
}

export async function resetVoteOnBackend(personName: string): Promise<boolean> {
  try {
    const res = await fetch('/api/votes/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personName }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] resetVoteOnBackend error:', err);
    return false;
  }
}

export async function togglePostLikeOnBackend(postId: string, isLiked: boolean, likeCount: number): Promise<boolean> {
  try {
    const res = await fetch('/api/posts/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, action: 'like', isLiked, likeCount }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] togglePostLikeOnBackend error:', err);
    return false;
  }
}

export async function addCommentToBackend(postId: string, comment: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime] addCommentToBackend error:', err);
    return false;
  }
}
