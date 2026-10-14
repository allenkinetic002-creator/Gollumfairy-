import { supabase } from './supabase';
import { TrustReceipt, INITIAL_TRUST_RECEIPTS, STORAGE_TRUST_RECEIPTS_KEY } from '../data/trustReceipts';
import { StarStamp, INITIAL_STAR_STAMPS, STORAGE_STAR_STAMPS_KEY } from '../data/starStamps';

/**
 * Backend Data Layer using Supabase with automatic offline/cache fallback
 */

// --- TRUST RECEIPTS ---

export async function fetchRemoteTrustReceipts(): Promise<TrustReceipt[] | null> {
  try {
    const { data, error } = await supabase
      .from('fairy_trust_receipts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchTrustReceipts warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        receiptNumber: row.receipt_number,
        promiserId: row.promiser_id,
        promiserName: row.promiser_name,
        promiserHandle: row.promiser_handle,
        promiserAvatarInitial: row.promiser_avatar_initial || '?',
        promiserAvatarBg: row.promiser_avatar_bg || 'bg-indigo-600',
        promiserCity: row.promiser_city || 'City',
        promiserPercent: row.promiser_percent ?? 90,
        creatorId: row.creator_id,
        creatorName: row.creator_name,
        commitment: row.commitment,
        amount: row.amount || undefined,
        createdAt: Number(row.created_at),
        deadlineAt: Number(row.deadline_at),
        deadlineLabel: row.deadline_label,
        acknowledgedAt: row.acknowledged_at ? Number(row.acknowledged_at) : undefined,
        acknowledgedBy: row.acknowledged_by || undefined,
        expiredAt: row.expired_at ? Number(row.expired_at) : undefined,
        outcome: row.outcome || undefined,
        outcomeRecordedAt: row.outcome_recorded_at ? Number(row.outcome_recorded_at) : undefined,
        outcomeRecordedBy: row.outcome_recorded_by || undefined,
        outcomeNotes: row.outcome_notes || undefined,
        history: Array.isArray(row.history) ? row.history : [],
      }));
    }
    return null;
  } catch (err) {
    console.warn('[Supabase] Could not fetch remote receipts:', err);
    return null;
  }
}

export async function syncTrustReceiptToSupabase(receipt: TrustReceipt): Promise<void> {
  try {
    const payload = {
      id: receipt.id,
      receipt_number: receipt.receiptNumber,
      promiser_id: receipt.promiserId,
      promiser_name: receipt.promiserName,
      promiser_handle: receipt.promiserHandle,
      promiser_avatar_initial: receipt.promiserAvatarInitial,
      promiser_avatar_bg: receipt.promiserAvatarBg,
      promiser_city: receipt.promiserCity,
      promiser_percent: receipt.promiserPercent,
      creator_id: receipt.creatorId,
      creator_name: receipt.creatorName,
      commitment: receipt.commitment,
      amount: receipt.amount || null,
      created_at: receipt.createdAt,
      deadline_at: receipt.deadlineAt,
      deadline_label: receipt.deadlineLabel,
      acknowledged_at: receipt.acknowledgedAt || null,
      acknowledged_by: receipt.acknowledgedBy || null,
      expired_at: receipt.expiredAt || null,
      outcome: receipt.outcome || null,
      outcome_recorded_at: receipt.outcomeRecordedAt || null,
      outcome_recorded_by: receipt.outcomeRecordedBy || null,
      outcome_notes: receipt.outcomeNotes || null,
      history: receipt.history,
    };

    const { error } = await supabase
      .from('fairy_trust_receipts')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] syncTrustReceiptToSupabase error:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] syncTrustReceipt error:', err);
  }
}

// --- STAR STAMPS ---

export async function fetchRemoteStarStamps(): Promise<StarStamp[] | null> {
  try {
    const { data, error } = await supabase
      .from('fairy_star_stamps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchStarStamps warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        stampNumber: row.stamp_number,
        promiserName: row.promiser_name,
        promiserRole: row.promiser_role,
        promiserHandle: row.promiser_handle,
        promiserAvatarBg: row.promiser_avatar_bg || 'bg-amber-600',
        promiserAvatarInitial: row.promiser_avatar_initial || '?',
        category: row.category,
        verbalCommitment: row.verbal_commitment,
        contextSource: row.context_source,
        targetDate: row.target_date,
        createdAt: Number(row.created_at),
        status: row.status,
        overallRating: Number(row.overall_rating || 5.0),
        ratingsCount: Number(row.ratings_count || 1),
        communityVotes: row.community_votes || { fulfilled: 0, active: 1, broken: 0 },
        comments: Array.isArray(row.comments) ? row.comments : [],
        createdBy: row.created_by,
        createdHandle: row.created_handle,
        tags: Array.isArray(row.tags) ? row.tags : [],
      }));
    }
    return null;
  } catch (err) {
    console.warn('[Supabase] Could not fetch remote star stamps:', err);
    return null;
  }
}

export async function syncStarStampToSupabase(stamp: StarStamp): Promise<void> {
  try {
    const payload = {
      id: stamp.id,
      stamp_number: stamp.stampNumber,
      promiser_name: stamp.promiserName,
      promiser_role: stamp.promiserRole,
      promiser_handle: stamp.promiserHandle,
      promiser_avatar_bg: stamp.promiserAvatarBg,
      promiser_avatar_initial: stamp.promiserAvatarInitial,
      category: stamp.category,
      verbal_commitment: stamp.verbalCommitment,
      context_source: stamp.contextSource,
      target_date: stamp.targetDate,
      created_at: stamp.createdAt,
      status: stamp.status,
      overall_rating: stamp.overallRating,
      ratings_count: stamp.ratingsCount,
      community_votes: stamp.communityVotes,
      comments: stamp.comments,
      created_by: stamp.createdBy,
      created_handle: stamp.createdHandle,
      tags: stamp.tags,
    };

    const { error } = await supabase
      .from('fairy_star_stamps')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] syncStarStampToSupabase error:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] syncStarStamp error:', err);
  }
}

// --- MESSAGES ---

export interface FairyChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  is_fairy?: boolean;
  audio_url?: string;
  created_at?: string;
}

export async function fetchRemoteMessages(receiverId: string): Promise<FairyChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('fairy_messages')
      .select('*')
      .or(`receiver_id.eq.${receiverId},sender_id.eq.${receiverId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] fetchMessages error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('[Supabase] fetchMessages error:', err);
    return [];
  }
}

export async function sendRemoteMessage(message: FairyChatMessage): Promise<boolean> {
  try {
    const { error } = await supabase.from('fairy_messages').insert([message]);
    if (error) {
      console.warn('[Supabase] sendRemoteMessage error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] sendRemoteMessage error:', err);
    return false;
  }
}

// --- POSTS & TWEETS ---

export interface FairyRemotePost {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  is_verified?: boolean;
  time_ago?: string;
  location?: string;
  media_type?: string;
  is_tweet?: boolean;
  tweet_content?: string;
  media_url?: string;
  caption?: string;
  tags?: string[];
  audio_title?: string;
  like_count?: number;
  retweet_count?: number;
  reply_count?: number;
  view_count?: string;
}

export async function fetchRemotePosts(): Promise<FairyRemotePost[]> {
  try {
    const { data, error } = await supabase
      .from('fairy_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchPosts warning:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('[Supabase] fetchPosts error:', err);
    return [];
  }
}

export async function syncPostToSupabase(post: {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isVerified?: boolean;
  timeAgo?: string;
  location?: string;
  mediaType: string;
  isTweet?: boolean;
  tweetContent?: string;
  mediaUrl?: string;
  caption?: string;
  tags?: string[];
  audioTitle?: string;
  likeCount?: number;
  retweetCount?: number;
  replyCount?: number;
  viewCount?: string;
}): Promise<void> {
  try {
    const payload = {
      id: post.id,
      author_name: post.authorName,
      author_handle: post.authorHandle,
      author_avatar: post.authorAvatar || null,
      is_verified: !!post.isVerified,
      time_ago: post.timeAgo || 'Just now',
      location: post.location || null,
      media_type: post.mediaType,
      is_tweet: !!post.isTweet,
      tweet_content: post.tweetContent || null,
      media_url: post.mediaUrl || null,
      caption: post.caption || null,
      tags: post.tags || [],
      audio_title: post.audioTitle || null,
      like_count: post.likeCount ?? 0,
      retweet_count: post.retweetCount ?? 0,
      reply_count: post.replyCount ?? 0,
      view_count: post.viewCount || '1',
    };

    const { error } = await supabase
      .from('fairy_posts')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] syncPostToSupabase error:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] syncPostToSupabase error:', err);
  }
}

