export type StarStampCategory =
  | 'Politician'
  | 'CEO / Tech'
  | 'Creator / Artist'
  | 'Company / Brand'
  | 'Everyday / Peer';

export type StarStampStatus = 'active' | 'fulfilled' | 'broken' | 'in_progress';

export interface StarStampComment {
  id: string;
  author: string;
  authorHandle: string;
  authorAvatar?: string;
  text: string;
  rating?: number;
  timestamp: number;
  timeAgo: string;
  isVerifiedReceipt?: boolean;
}

export interface StarStamp {
  id: string;
  stampNumber: string; // e.g. "STAR-101"
  promiserName: string; // e.g. "Gov. Michael Adebayo" or "CEO Alexander Ross"
  promiserRole: string; // e.g. "State Governor / Politician", "CEO Horizon Cloud"
  promiserHandle: string;
  promiserAvatar?: string;
  promiserAvatarBg: string;
  promiserAvatarInitial: string;
  category: StarStampCategory;
  verbalCommitment: string; // The exact verbal promise quoted
  contextSource: string; // Where it was spoken
  targetDate: string; // Target deadline
  createdAt: number;
  status: StarStampStatus;
  overallRating: number; // e.g. 4.6 out of 5
  ratingsCount: number;
  userRating?: number;
  communityVotes: {
    fulfilled: number;
    active: number;
    broken: number;
  };
  comments: StarStampComment[];
  createdBy: string;
  createdHandle: string;
  tags: string[];
}

export const STORAGE_STAR_STAMPS_KEY = 'fairy_star_stamps_v1';

const now = Date.now();

export const INITIAL_STAR_STAMPS: StarStamp[] = [
  {
    id: 'star-gov-adebayo',
    stampNumber: 'STAR-101',
    promiserName: 'Gov. Michael Adebayo',
    promiserRole: 'State Governor / Politician',
    promiserHandle: '@gov_adebayo',
    promiserAvatarBg: 'bg-emerald-700',
    promiserAvatarInitial: 'MA',
    category: 'Politician',
    verbalCommitment:
      'I give you my personal verbal word: all 14 municipal general hospitals will have 24-hour uninterrupted solar power grids installed before December 31st.',
    contextSource: 'Live Town Hall Q&A & State Broadcast',
    targetDate: 'December 31, 2026',
    createdAt: now - 3600 * 24 * 3 * 1000,
    status: 'active',
    overallRating: 3.8,
    ratingsCount: 4210,
    communityVotes: {
      fulfilled: 340,
      active: 2890,
      broken: 980,
    },
    createdBy: 'Civic Watchdog Coalition',
    createdHandle: '@civic_watch',
    tags: ['healthcare', 'publicinfrastructure', 'solarpledge', 'governance'],
    comments: [
      {
        id: 'c-1',
        author: 'Dr. Kunle Adams',
        authorHandle: '@dr_kunle',
        text: 'Hospital #3 in Ikeja just had solar inverters delivered today! Keeping an eye on the other 13 locations.',
        rating: 4.5,
        timestamp: now - 3600 * 12 * 1000,
        timeAgo: '12h ago',
        isVerifiedReceipt: true,
      },
      {
        id: 'c-2',
        author: 'Ngozi Eze',
        authorHandle: '@ngozi_ez',
        text: 'This Star Stamp is crucial. Verbal promises in speeches are too easily forgotten without receipts.',
        rating: 4.0,
        timestamp: now - 3600 * 5 * 1000,
        timeAgo: '5h ago',
      },
    ],
  },
  {
    id: 'star-ceo-alexander',
    stampNumber: 'STAR-102',
    promiserName: 'Alexander Ross',
    promiserRole: 'Tech CEO & Founder (Horizon Cloud)',
    promiserHandle: '@alex_ross_ceo',
    promiserAvatarBg: 'bg-blue-700',
    promiserAvatarInitial: 'AR',
    category: 'CEO / Tech',
    verbalCommitment:
      'We will never paywall our open community developer APIs or charge indie creators for export tools. That commitment is permanent.',
    contextSource: 'Q3 Global Developer Keynote & Press Livestream',
    targetDate: 'Permanent verbal commitment',
    createdAt: now - 3600 * 24 * 7 * 1000,
    status: 'active',
    overallRating: 4.7,
    ratingsCount: 8930,
    communityVotes: {
      fulfilled: 6100,
      active: 2500,
      broken: 330,
    },
    createdBy: 'OpenDev Alliance',
    createdHandle: '@opendev',
    tags: ['openapi', 'developerfirst', 'ceo_pledge', 'techtok'],
    comments: [
      {
        id: 'c-3',
        author: 'Maya Lin',
        authorHandle: '@mayacodes',
        text: 'Rated 5 stars. They updated their terms last week and reaffirmed zero API rate hike for indie builders.',
        rating: 5.0,
        timestamp: now - 3600 * 20 * 1000,
        timeAgo: '20h ago',
        isVerifiedReceipt: true,
      },
    ],
  },
  {
    id: 'star-elena-art',
    stampNumber: 'STAR-103',
    promiserName: 'Elena Rostova',
    promiserRole: 'Top Creator & Brutalist Architect',
    promiserHandle: '@elena_art',
    promiserAvatarBg: 'bg-amber-600',
    promiserAvatarInitial: 'ER',
    category: 'Creator / Artist',
    verbalCommitment:
      'I will personally review every vibe-coder design submitted to the Fairy Pavilion gallery and publish an annotated feedback book by Friday.',
    contextSource: 'Fairy Audio Space Live Session',
    targetDate: 'Friday 6:00 PM',
    createdAt: now - 3600 * 24 * 2 * 1000,
    status: 'fulfilled',
    overallRating: 4.9,
    ratingsCount: 1540,
    communityVotes: {
      fulfilled: 1490,
      active: 35,
      broken: 15,
    },
    createdBy: 'You',
    createdHandle: '@you',
    tags: ['fairypavilion', 'critique', 'creatorpledge', 'architecture'],
    comments: [
      {
        id: 'c-4',
        author: 'Leo Vance',
        authorHandle: '@leo_v',
        text: 'She delivered on time! The PDF review guide is already pinned on her profile.',
        rating: 5.0,
        timestamp: now - 3600 * 2 * 1000,
        timeAgo: '2h ago',
        isVerifiedReceipt: true,
      },
    ],
  },
  {
    id: 'star-tunde-dev',
    stampNumber: 'STAR-104',
    promiserName: 'Tunde Ojo',
    promiserRole: 'Senior Freelance Engineer',
    promiserHandle: '@tunde_dev',
    promiserAvatarBg: 'bg-purple-700',
    promiserAvatarInitial: 'TO',
    category: 'Everyday / Peer',
    verbalCommitment:
      'I will finalize the database indexing migration and test all webhook listeners before Sunday midnight with zero extra charges.',
    contextSource: 'Project Handover Call Agreement',
    targetDate: 'Sunday 11:59 PM',
    createdAt: now - 3600 * 18 * 1000,
    status: 'active',
    overallRating: 4.4,
    ratingsCount: 28,
    communityVotes: {
      fulfilled: 19,
      active: 8,
      broken: 1,
    },
    createdBy: 'You',
    createdHandle: '@you',
    tags: ['freelance', 'peercommitment', 'trustreceipt', 'engineering'],
    comments: [
      {
        id: 'c-5',
        author: 'Sarah Jenkins',
        authorHandle: '@s_jenkins',
        text: 'Tunde is one of the most reliable contractors on the platform. Rated 5 stars.',
        rating: 5.0,
        timestamp: now - 3600 * 4 * 1000,
        timeAgo: '4h ago',
      },
    ],
  },
];

import { syncStarStampToSupabase, fetchRemoteStarStamps } from '../lib/fairyBackend';
import { supabase } from '../lib/supabase';

export function loadStarStamps(): StarStamp[] {
  try {
    const raw = localStorage.getItem(STORAGE_STAR_STAMPS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_STAR_STAMPS_KEY, JSON.stringify(INITIAL_STAR_STAMPS));
      return INITIAL_STAR_STAMPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load star stamps from localStorage', err);
  }
  return INITIAL_STAR_STAMPS;
}

export function saveStarStamps(stamps: StarStamp[]): void {
  try {
    localStorage.setItem(STORAGE_STAR_STAMPS_KEY, JSON.stringify(stamps));
    window.dispatchEvent(new Event('fairy_star_stamps_sync'));

    // Sync latest to Supabase in the background
    if (stamps.length > 0) {
      stamps.slice(0, 5).forEach((stamp) => {
        syncStarStampToSupabase(stamp).catch((err) =>
          console.warn('[Supabase] background star stamp sync err:', err)
        );
      });
    }

    // Auto-sync update to GitHub repository
    import('../lib/repoSync').then(({ syncActivityToRepo }) => {
      const latest = stamps[0];
      syncActivityToRepo(
        'star_stamp_update',
        `Star stamp saved: ${latest?.stampNumber || 'stamp'} - ${latest?.promiserName || 'entry'}`,
        { count: stamps.length, latestId: latest?.id }
      );
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save star stamps to localStorage', err);
  }
}

// Auto-sync with remote Supabase database on launch & live changes
let isStarSyncInitialized = false;
export function initializeStarStampsSync() {
  if (isStarSyncInitialized || typeof window === 'undefined') return;
  isStarSyncInitialized = true;

  fetchRemoteStarStamps().then((remoteData) => {
    if (remoteData && remoteData.length > 0) {
      const local = loadStarStamps();
      const mergedMap = new Map<string, StarStamp>();
      local.forEach((s) => mergedMap.set(s.id, s));
      remoteData.forEach((s) => mergedMap.set(s.id, s));
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      localStorage.setItem(STORAGE_STAR_STAMPS_KEY, JSON.stringify(combined));
      window.dispatchEvent(new Event('fairy_star_stamps_sync'));
    }
  });

  // Subscribe to real-time postgres changes
  try {
    supabase
      .channel('public:fairy_star_stamps')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fairy_star_stamps' },
        () => {
          fetchRemoteStarStamps().then((fresh) => {
            if (fresh && fresh.length > 0) {
              localStorage.setItem(STORAGE_STAR_STAMPS_KEY, JSON.stringify(fresh));
              window.dispatchEvent(new Event('fairy_star_stamps_sync'));
            }
          });
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('[Supabase] Realtime star stamp subscription error:', err);
  }
}

export function addStarStamp(newStamp: StarStamp): StarStamp[] {
  const current = loadStarStamps();
  const updated = [newStamp, ...current];
  saveStarStamps(updated);
  return updated;
}

export function addStarStampComment(
  stampId: string,
  comment: Omit<StarStampComment, 'id' | 'timestamp' | 'timeAgo'>
): StarStamp[] {
  const current = loadStarStamps();
  const updated = current.map((stamp) => {
    if (stamp.id !== stampId) return stamp;
    const newCommentEntry: StarStampComment = {
      ...comment,
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      timeAgo: 'Just now',
    };
    const newComments = [newCommentEntry, ...stamp.comments];
    // recalculate rating if user provided rating
    let newOverallRating = stamp.overallRating;
    let newRatingsCount = stamp.ratingsCount;
    if (comment.rating) {
      newRatingsCount += 1;
      newOverallRating = Number(
        ((stamp.overallRating * stamp.ratingsCount + comment.rating) / newRatingsCount).toFixed(1)
      );
    }
    return {
      ...stamp,
      comments: newComments,
      overallRating: newOverallRating,
      ratingsCount: newRatingsCount,
    };
  });
  saveStarStamps(updated);
  return updated;
}

export function rateStarStamp(stampId: string, ratingValue: number): StarStamp[] {
  const current = loadStarStamps();
  const updated = current.map((stamp) => {
    if (stamp.id !== stampId) return stamp;
    const previousUserRating = stamp.userRating;
    let newRatingsCount = stamp.ratingsCount;
    let sum = stamp.overallRating * stamp.ratingsCount;

    if (previousUserRating !== undefined) {
      sum = sum - previousUserRating + ratingValue;
    } else {
      newRatingsCount += 1;
      sum += ratingValue;
    }

    const newAvg = Number((sum / Math.max(1, newRatingsCount)).toFixed(1));
    return {
      ...stamp,
      userRating: ratingValue,
      overallRating: newAvg,
      ratingsCount: newRatingsCount,
    };
  });
  saveStarStamps(updated);
  return updated;
}

export function voteStarStampOutcome(
  stampId: string,
  voteType: 'fulfilled' | 'active' | 'broken'
): StarStamp[] {
  const current = loadStarStamps();
  const updated = current.map((stamp) => {
    if (stamp.id !== stampId) return stamp;
    const votes = { ...stamp.communityVotes, [voteType]: stamp.communityVotes[voteType] + 1 };
    let status = stamp.status;
    if (votes.fulfilled > votes.broken * 2 && votes.fulfilled > 10) {
      status = 'fulfilled';
    } else if (votes.broken > votes.fulfilled * 2 && votes.broken > 10) {
      status = 'broken';
    }
    return {
      ...stamp,
      communityVotes: votes,
      status,
    };
  });
  saveStarStamps(updated);
  return updated;
}

