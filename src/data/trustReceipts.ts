import { SharedPerson } from './sharedPeople';

export type TrustReceiptStatus =
  | 'awaiting_acknowledgement'
  | 'acknowledged'
  | 'expired'
  | 'fulfilled'
  | 'not_fulfilled';

export interface ReceiptHistoryEntry {
  id: string;
  action: string;
  timestamp: number;
  actor: string;
  note?: string;
}

export interface TrustReceipt {
  id: string;
  receiptNumber: string; // e.g. "TR-5892"
  promiserId: string;    // User A (the person who made the promise)
  promiserName: string;
  promiserHandle: string;
  promiserAvatarUrl?: string;
  promiserAvatarInitial: string;
  promiserAvatarBg: string;
  promiserCity: string;
  promiserPercent: number;

  creatorId: string;     // User B (the creator)
  creatorName: string;

  commitment: string;    // "Their Commitment" exact quote
  amount?: string;       // Optional amount e.g. "₦50,000"

  createdAt: number;
  deadlineAt: number;
  deadlineLabel: string; // human readable deadline

  acknowledgedAt?: number;
  acknowledgedBy?: string;

  expiredAt?: number;
  outcome?: 'fulfilled' | 'not_fulfilled';
  outcomeRecordedAt?: number;
  outcomeRecordedBy?: string;
  outcomeNotes?: string;

  history: ReceiptHistoryEntry[];
}

export const STORAGE_TRUST_RECEIPTS_KEY = 'fairy_trust_receipts_v1';

const now = Date.now();

export const INITIAL_TRUST_RECEIPTS: TrustReceipt[] = [
  {
    id: 'tr-alex-50k',
    receiptNumber: 'TR-5021',
    promiserId: 'p-alex',
    promiserName: 'Alex Chen',
    promiserHandle: '@alexchen',
    promiserAvatarInitial: 'A',
    promiserAvatarBg: 'bg-indigo-600',
    promiserCity: 'Berlin',
    promiserPercent: 88,
    creatorId: 'user-me',
    creatorName: 'You',
    commitment: 'I will pay you ₦50,000 for the frontend commission by the end of today.',
    amount: '₦50,000',
    createdAt: now - 3600 * 2 * 1000,
    deadlineAt: now + 3600 * 3.5 * 1000, // 3.5 hours from now
    deadlineLabel: 'Due today at 6:00 PM',
    acknowledgedAt: now - 3600 * 1.5 * 1000,
    acknowledgedBy: 'Alex Chen',
    history: [
      {
        id: 'h-1',
        action: 'Receipt Created',
        timestamp: now - 3600 * 2 * 1000,
        actor: 'You',
        note: 'Quoted from chat: "I will pay you ₦50,000 for the frontend commission by the end of today."',
      },
      {
        id: 'h-2',
        action: 'Acknowledged',
        timestamp: now - 3600 * 1.5 * 1000,
        actor: 'Alex Chen',
        note: 'Confirmed commitment & deadline. Record permanently locked.',
      },
    ],
  },
  {
    id: 'tr-elena-ui',
    receiptNumber: 'TR-7842',
    promiserId: 'p-elena',
    promiserName: 'Elena Rostova',
    promiserHandle: '@elenacodes',
    promiserAvatarInitial: 'E',
    promiserAvatarBg: 'bg-emerald-600',
    promiserCity: 'San Francisco',
    promiserPercent: 92,
    creatorId: 'user-me',
    creatorName: 'You',
    commitment: 'I will deliver the completed mobile layout Figma kit by tonight 11:59 PM.',
    amount: '₦75,000',
    createdAt: now - 3600 * 1000,
    deadlineAt: now + 3600 * 5 * 1000, // 5 hours from now
    deadlineLabel: 'Due tonight at 11:59 PM',
    history: [
      {
        id: 'h-elena-1',
        action: 'Receipt Created',
        timestamp: now - 3600 * 1000,
        actor: 'You',
        note: 'Created from agreement: "I will deliver the completed mobile layout Figma kit by tonight 11:59 PM."',
      },
    ],
  },
  {
    id: 'tr-clara-feedback',
    receiptNumber: 'TR-3918',
    promiserId: 'p-clara',
    promiserName: 'Clara Moreau',
    promiserHandle: '@claram',
    promiserAvatarInitial: 'C',
    promiserAvatarBg: 'bg-rose-600',
    promiserCity: 'Paris',
    promiserPercent: 78,
    creatorId: 'user-me',
    creatorName: 'You',
    commitment: 'I will test the vibe code prototype and send a 5-point audio breakdown.',
    createdAt: now - 3600 * 26 * 1000,
    deadlineAt: now - 3600 * 2 * 1000,
    deadlineLabel: 'Due yesterday at 8:00 PM',
    acknowledgedAt: now - 3600 * 24 * 1000,
    acknowledgedBy: 'Clara Moreau',
    expiredAt: now - 3600 * 2 * 1000,
    outcome: 'fulfilled',
    outcomeRecordedAt: now - 3600 * 1 * 1000,
    outcomeRecordedBy: 'You',
    outcomeNotes: 'Received all 5 points in audio notes as promised.',
    history: [
      {
        id: 'h-c-1',
        action: 'Receipt Created',
        timestamp: now - 3600 * 26 * 1000,
        actor: 'You',
      },
      {
        id: 'h-c-2',
        action: 'Acknowledged',
        timestamp: now - 3600 * 24 * 1000,
        actor: 'Clara Moreau',
      },
      {
        id: 'h-c-3',
        action: 'Marked as Fulfilled',
        timestamp: now - 3600 * 1 * 1000,
        actor: 'You',
        note: 'Promise successfully fulfilled.',
      },
    ],
  },
];

export function loadTrustReceipts(): TrustReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_TRUST_RECEIPTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load trust receipts from storage:', e);
  }
  return INITIAL_TRUST_RECEIPTS;
}

export function saveTrustReceipts(receipts: TrustReceipt[]) {
  try {
    const json = JSON.stringify(receipts);
    localStorage.setItem(STORAGE_TRUST_RECEIPTS_KEY, json);
    window.dispatchEvent(new CustomEvent('fairy_receipts_sync'));
  } catch (e) {
    console.warn('Failed to save trust receipts:', e);
  }
}

export function computeReceiptStatus(receipt: TrustReceipt, currentTime: number): TrustReceiptStatus {
  if (receipt.outcome === 'fulfilled') return 'fulfilled';
  if (receipt.outcome === 'not_fulfilled') return 'not_fulfilled';

  if (!receipt.acknowledgedAt) {
    return 'awaiting_acknowledgement';
  }

  if (currentTime >= receipt.deadlineAt) {
    return 'expired';
  }

  return 'acknowledged';
}
