import React, { useState, useEffect } from 'react';
import { initializeTrustReceiptsSync } from './data/trustReceipts';
import { initializeStarStampsSync } from './data/starStamps';
import { fetchRemotePosts, syncPostToSupabase } from './lib/fairyBackend';

import {
  Home,
  TrendingUp,
  User,
  Search,
  X,
  Music,
  Heart,
  CornerDownRight,
  Smile,
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Mic,
  Camera,
  Gamepad2,
  Lightbulb,
  Laugh,
  MapPin,
  FlameKindling,
  SlidersHorizontal,
  Clock,
  Plus,
  Video,
  Star,
  UserPlus,
  UserCheck,
  UploadCloud,
  GitBranch,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import postImage from './assets/images/fairy_post_image_1791012530319.jpg';
import elenaAvatar from './assets/images/creator_portrait_elena_1791014499312.jpg';
import topPostPhoto from './assets/images/creator_top_post_1791014513929.jpg';
import charDesignPhoto from './assets/images/char_design_concept_1791018302239.jpg';
import { DMControl } from './components/DMControl';
import { FairyControl } from './components/FairyControl';
import { MatchesScreen } from './components/MatchesScreen';
import { NormalMessagesScreen, TargetMessagePerson } from './components/NormalMessagesScreen';
import { StarStampsScreen } from './components/StarStampsScreen';
import { InfluenceRatingModal } from './components/InfluenceRatingModal';
import { PhoneReactionPopup } from './components/PhoneReactionPopup';
import { FaceoffBattleModal, BattleParticipant } from './components/FaceoffBattleModal';
import { FairyPotIcon } from './components/FairyPotIcon';
import { AeriFrogIcon } from './components/AeriFrogIcon';
import { AeriFlameIcon } from './components/AeriFlameIcon';
import { AeriHydrantIcon } from './components/AeriHydrantIcon';
import { AeriCommentIcon } from './components/AeriCommentIcon';
import { AeriPhoneIcon } from './components/AeriPhoneIcon';
import { AeriHandPhoneIcon } from './components/AeriHandPhoneIcon';
import { AeriMessageBubbleIcon } from './components/AeriMessageBubbleIcon';
import { AeriDiggingDogIcon } from './components/AeriDiggingDogIcon';
import { AeriGuacamoleBowlIcon } from './components/AeriGuacamoleBowlIcon';
import { AeriMaskedEyesIcon } from './components/AeriMaskedEyesIcon';
import { AeriOneEyeHatGuyIcon } from './components/AeriOneEyeHatGuyIcon';
import { BrokenPencilIcon } from './components/BrokenPencilIcon';
import { AeriOneEyeGhostIcon } from './components/AeriOneEyeGhostIcon';
import { AeriRaygunIcon } from './components/AeriRaygunIcon';
import { AeriSearchIcon } from './components/AeriSearchIcon';
import { AeriConcentricCircleIcon } from './components/AeriConcentricCircleIcon';
import { AeriHappyFlameIcon } from './components/AeriHappyFlameIcon';
import { AeriSlimeSqueezeIcon } from './components/AeriSlimeSqueezeIcon';
import { AeriStackedChairsIcon } from './components/AeriStackedChairsIcon';
import { AeriThumbsUpIcon } from './components/AeriThumbsUpIcon';
import { AeriMonoblocChairIcon } from './components/AeriMonoblocChairIcon';
import { AeriArrowKeysIcon } from './components/AeriArrowKeysIcon';
import { AeriMindProfileIcon } from './components/AeriMindProfileIcon';
import { AeriProfileUserIcon } from './components/AeriProfileUserIcon';
import { AeriBellIcon } from './components/AeriBellIcon';
import { AeriHorseIcon } from './components/AeriHorseIcon';
import { CreatePostModal, NewPostPayload } from './components/CreatePostModal';
import { CreateTweetModal, NewTweetPayload } from './components/CreateTweetModal';
import { TweetPostCard } from './components/TweetPostCard';
import { RaygunActionModal } from './components/RaygunActionModal';
import { PastChallengesModal } from './components/PastChallengesModal';
import { ChallengePostModal, ChallengePostPayload } from './components/ChallengePostModal';
import { UserSearchModal, UserSearchItem } from './components/UserSearchModal';
import { UserProfileScreen } from './components/UserProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SignInModal, DEFAULT_REGISTERED_ACCOUNTS, getStoredRegisteredAccounts, RegisteredAccount } from './components/SignInModal';
import { SignInRequiredModal } from './components/SignInRequiredModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { syncActivityToRepo, subscribeToSyncStatus, SyncStatus } from './lib/repoSync';
import { subscribeToRealtime, togglePostLikeOnBackend, addCommentToBackend, submitVoteToBackend, fetchRemoteVotes } from './lib/realtimeSync';
import { getSafeMediaUrl, DEFAULT_FALLBACK_IMAGE, TEA_AND_TEA_IMAGE } from './lib/imageUpload';
import { getGenreInfo } from './lib/genres';
import {
  getStoredFairySwitchesForUser,
  subscribeToFairySwitches,
  FairySystemSwitches,
  DEFAULT_FAIRY_SWITCHES,
} from './lib/fairySwitches';

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified: boolean;
  timeAgo: string;
  location?: string;
  mediaType: 'image' | 'video' | 'tweet';
  isTweet?: boolean;
  tweetContent?: string;
  mediaUrl?: string;
  caption: string;
  tags: string[];
  genre?: string;
  audioTitle?: string;
  likeCount: number;
  isLiked: boolean;
  isTrending?: boolean;
  retweetCount?: number;
  isRetweeted?: boolean;
  replyCount?: number;
  viewCount?: string;
  isBookmarked?: boolean;
  faceoffConfig?: {
    battleQuestion?: string;
    totalParticipants?: number;
    participants?: BattleParticipant[];
    redParticipant?: {
      name: string;
      avatar: string;
      title?: string;
    };
    blueParticipant?: {
      name: string;
      avatar: string;
      title?: string;
    };
  };
}

interface CommentItem {
  id: string;
  username: string;
  avatarBg: string;
  avatarText: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface Creator {
  rank: number;
  name: string;
  handle: string;
  avatarUrl?: string;
  avatarBg: string;
  avatarInitial: string;
  role: string;
  location?: string;
  upvotes: number;
  rating?: number;
  phoneHandLikes?: number;
  phoneHandDislikes?: number;
  tieBreakerScore?: number;
  tieBreakerLikes?: number;
  tieBreakerDislikes?: number;
  isUpvoted: boolean;
  isFollowing: boolean;
  category: 'new_artists' | 'comedians' | 'photographers' | 'character_designers' | 'us_top' | 'innovators' | 'artists' | 'creators' | string;
  topPost: {
    title: string;
    imageUrl?: string;
    gradientBg: string;
    likes: string;
    comments: string;
    hasAudio?: boolean;
    audioTitle?: string;
    tag?: string;
  };
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: "1",
    username: "Gollumfairy",
    avatarBg: "bg-purple-600",
    avatarText: "GF",
    text: "Welcome to Fairy! Verified trust receipts and real creator interactions live 🧚✨",
    time: "2h",
    likes: 24,
    isLiked: false,
  },
  {
    id: "2",
    username: "allenkinetic002-creator",
    avatarBg: "bg-indigo-600",
    avatarText: "AD",
    text: "Live GitHub repo sync and verified real users active 🔥",
    time: "3h",
    likes: 18,
    isLiked: true,
  },
  {
    id: "3",
    username: "kinetic",
    avatarBg: "bg-emerald-600",
    avatarText: "K",
    text: "The Kyoto autumn lighting and visual stillness look serene 🤌✨",
    time: "5h",
    likes: 12,
    isLiked: false,
  },
  {
    id: "4",
    username: "karak",
    avatarBg: "bg-amber-600",
    avatarText: "KK",
    text: "Great seeing real creators and verified trust receipts on the feed!",
    time: "6h",
    likes: 9,
    isLiked: false,
  },
];

// Real registered creators on Fairy network
export const REAL_REGISTERED_CREATORS: Creator[] = [
  {
    rank: 1,
    name: "Karak",
    handle: "@karak",
    avatarBg: "bg-amber-600",
    avatarInitial: "KK",
    role: "Visual Storyteller",
    location: "Kyoto, Japan",
    upvotes: 1,
    rating: 9.2,
    phoneHandLikes: 5,
    phoneHandDislikes: 0,
    tieBreakerScore: 5,
    isUpvoted: true,
    isFollowing: false,
    category: "photographers",
    topPost: {
      title: "am a bad kid",
      imageUrl: "/uploads/1792066274363-post_1792066273908_xh7e4u.jpg",
      gradientBg: "from-amber-600 to-rose-900",
      likes: "1",
      comments: "0",
      hasAudio: true,
      audioTitle: "Original Audio",
      tag: "Street Vignettes",
    },
  },
  {
    rank: 2,
    name: "Allen Dharak",
    handle: "@allenkinetic002-creator",
    avatarBg: "bg-indigo-600",
    avatarInitial: "AD",
    role: "Founder & Creative Developer",
    location: "London, UK",
    upvotes: 142,
    rating: 9.8,
    phoneHandLikes: 0,
    phoneHandDislikes: 0,
    tieBreakerScore: 0,
    isUpvoted: false,
    isFollowing: false,
    category: "innovators",
    topPost: {
      title: "Building Fairy Social Feed & Live Sync",
      imageUrl: topPostPhoto,
      gradientBg: "from-indigo-600 to-purple-900",
      likes: "142",
      comments: "24",
      hasAudio: true,
      audioTitle: "Fairy Radio",
      tag: "Founder Showcase",
    },
  },
  {
    rank: 3,
    name: "Gollumfairy",
    handle: "@Gollumfairy",
    avatarBg: "bg-purple-600",
    avatarInitial: "GF",
    role: "Official Fairy Creator & Curator",
    location: "Fairy Realm",
    upvotes: 128,
    rating: 9.6,
    phoneHandLikes: 0,
    phoneHandDislikes: 0,
    tieBreakerScore: 0,
    isUpvoted: false,
    isFollowing: false,
    category: "new_artists",
    topPost: {
      title: "Gollumfairy Verified Trust Network",
      imageUrl: charDesignPhoto,
      gradientBg: "from-purple-600 to-pink-900",
      likes: "128",
      comments: "18",
      hasAudio: true,
      audioTitle: "Curator Ambient",
      tag: "Curator Spotlight",
    },
  },
  {
    rank: 4,
    name: "Kinetic",
    handle: "@kinetic",
    avatarBg: "bg-emerald-600",
    avatarInitial: "K",
    role: "Photographer & Digital Artist",
    location: "Kyoto, Japan",
    upvotes: 96,
    rating: 9.4,
    phoneHandLikes: 0,
    phoneHandDislikes: 0,
    tieBreakerScore: 0,
    isUpvoted: false,
    isFollowing: false,
    category: "photographers",
    topPost: {
      title: "tea and tea",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1000&auto=format&fit=crop&q=80",
      gradientBg: "from-emerald-600 to-teal-900",
      likes: "96",
      comments: "12",
      hasAudio: true,
      audioTitle: "Original Audio",
      tag: "Autumn Stillness",
    },
  },
];

/**
 * Re-ranks creators strictly according to Phone Hand Likes:
 * - Highest likes on that phone hand moves to top 10 / number 1!
 * - e.g. 5 likes is 1st, 2 likes is 2nd, 1 like is 3rd!
 * - Ties broken by rating, then general upvotes
 */
export function sortCreatorsByPhoneLikes(creators: Creator[]): Creator[] {
  const copy = [...creators];
  copy.sort((a, b) => {
    const phoneDiff = (b.phoneHandLikes || 0) - (a.phoneHandLikes || 0);
    if (phoneDiff !== 0) return phoneDiff;

    const ratingDiff = (b.rating ?? 9.0) - (a.rating ?? 9.0);
    if (ratingDiff !== 0) return ratingDiff;

    return (b.upvotes || 0) - (a.upvotes || 0);
  });
  return copy.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

export function buildCreatorsRecord(creators: Creator[]): Record<string, Creator[]> {
  const sorted = sortCreatorsByPhoneLikes(creators);
  const map: Record<string, Creator[]> = {
    all: sorted,
    new_artists: sortCreatorsByPhoneLikes(
      creators.filter(
        (c) =>
          c.category === 'new_artists' ||
          c.category === 'artists' ||
          c.role.toLowerCase().includes('art') ||
          c.role.toLowerCase().includes('curator') ||
          c.rank <= 2
      )
    ),
    photographers: sortCreatorsByPhoneLikes(
      creators.filter(
        (c) =>
          c.category === 'photographers' ||
          c.role.toLowerCase().includes('photo') ||
          c.role.toLowerCase().includes('storyteller') ||
          c.role.toLowerCase().includes('visual')
      )
    ),
    innovators: sortCreatorsByPhoneLikes(
      creators.filter(
        (c) =>
          c.category === 'innovators' ||
          c.category === 'creators' ||
          c.role.toLowerCase().includes('dev') ||
          c.role.toLowerCase().includes('founder') ||
          c.role.toLowerCase().includes('creator')
      )
    ),
    us_top: sorted,
    comedians: sorted,
    character_designers: sorted,
  };
  return map;
}

export function convertRegisteredUsersToCreators(
  rawUsers: any[],
  posts: any[],
  votesMap: Record<string, any> = {},
  ratingsMap: Record<string, any> = {}
): Creator[] {
  const baseMap = new Map<string, Creator>();

  // Seed default registered creators
  REAL_REGISTERED_CREATORS.forEach((c) => {
    baseMap.set(c.name.toLowerCase().trim(), { ...c });
    baseMap.set(c.handle.replace('@', '').toLowerCase().trim(), { ...c });
  });

  // Merge any registered users from server or localStorage
  if (Array.isArray(rawUsers)) {
    rawUsers.forEach((u) => {
      if (!u || (!u.name && !u.username)) return;
      const keyName = (u.name || u.username).toLowerCase().trim();
      const keyHandle = (u.handle || u.username || '').replace('@', '').toLowerCase().trim();

      const existing = baseMap.get(keyName) || baseMap.get(keyHandle);
      const cat =
        u.category === 'creators' ||
        u.role?.toLowerCase().includes('dev') ||
        u.role?.toLowerCase().includes('founder')
          ? 'innovators'
          : u.category === 'artists' ||
            u.role?.toLowerCase().includes('photo') ||
            u.role?.toLowerCase().includes('storyteller')
          ? 'photographers'
          : existing?.category || 'new_artists';

      // Match actual post published by user if available
      const userPost = (posts || []).find((p) => {
        const pAuthor = (p.authorName || '').toLowerCase().trim();
        const pHandle = (p.authorHandle || '').replace('@', '').toLowerCase().trim();
        return (
          pAuthor === keyName ||
          pHandle === keyHandle ||
          pAuthor === keyHandle ||
          pHandle === keyName
        );
      });

      const topPost = userPost
        ? {
            title: userPost.caption || userPost.tweetContent || 'Latest Post',
            imageUrl: userPost.mediaUrl || existing?.topPost?.imageUrl || topPostPhoto,
            gradientBg: existing?.topPost?.gradientBg || 'from-purple-600 to-indigo-900',
            likes: String(userPost.likeCount || existing?.upvotes || 1),
            comments: String(userPost.replyCount || 0),
            hasAudio: true,
            audioTitle: userPost.audioTitle || 'Original Audio',
            tag: userPost.tags?.[0] || 'Real Post',
          }
        : existing?.topPost || {
            title: `${u.name || u.username} on Fairy`,
            imageUrl: u.avatarUrl || topPostPhoto,
            gradientBg: 'from-purple-600 to-indigo-900',
            likes: String(u.upvotes || 10),
            comments: '0',
            hasAudio: false,
            audioTitle: 'Original Audio',
            tag: 'Verified Profile',
          };

      const creatorItem: Creator = {
        rank: existing?.rank || baseMap.size + 1,
        name: u.name || u.username,
        handle: u.handle || `@${u.username}`,
        avatarBg: u.avatarBg || existing?.avatarBg || 'bg-purple-600',
        avatarInitial: u.avatarInitial || (u.name ? u.name.slice(0, 2).toUpperCase() : 'U'),
        avatarUrl: u.avatarUrl || existing?.avatarUrl,
        role: u.role || u.profession || existing?.role || 'Verified Fairy Creator',
        location: u.location || existing?.location || 'Fairy Network',
        upvotes: u.upvotes || existing?.upvotes || 10,
        rating:
          ratingsMap[u.name]?.rating ||
          ratingsMap[u.username]?.rating ||
          u.rating ||
          existing?.rating ||
          9.2,
        phoneHandLikes: 0,
        phoneHandDislikes: 0,
        tieBreakerScore: 0,
        isUpvoted: existing?.isUpvoted || false,
        isFollowing: existing?.isFollowing || false,
        category: cat,
        topPost,
      };

      baseMap.set(keyName, creatorItem);
      baseMap.set(keyHandle, creatorItem);
    });
  }

  // Deduplicate creators by unique name/handle
  const uniqueCreators: Creator[] = [];
  const seen = new Set<string>();
  baseMap.forEach((c) => {
    const id = c.name.toLowerCase().trim();
    if (!seen.has(id)) {
      seen.add(id);
      // Apply votes
      const n1 = c.name;
      const n2 = c.name.toLowerCase().trim();
      const n3 = c.handle.replace('@', '').toLowerCase().trim();
      const rec = votesMap[n1] || votesMap[n2] || votesMap[n3];
      const pLikes = typeof rec?.likes === 'number' ? rec.likes : (c.phoneHandLikes || 0);
      const pDislikes = typeof rec?.dislikes === 'number' ? rec.dislikes : (c.phoneHandDislikes || 0);

      // Apply ratings
      const ratRec = ratingsMap[n1] || ratingsMap[n2] || ratingsMap[n3];
      const finalRating = typeof ratRec?.rating === 'number' ? ratRec.rating : (c.rating ?? 9.2);

      uniqueCreators.push({
        ...c,
        rating: finalRating,
        phoneHandLikes: pLikes,
        phoneHandDislikes: pDislikes,
        tieBreakerLikes: pLikes,
        tieBreakerDislikes: pDislikes,
        tieBreakerScore: pLikes - pDislikes,
      });
    }
  });

  return sortCreatorsByPhoneLikes(uniqueCreators);
}

const ALL_TOP_CREATORS: Record<string, Creator[]> = buildCreatorsRecord(REAL_REGISTERED_CREATORS);

const CATEGORY_TABS = [
  { id: "all", label: "All Real Creators", icon: Trophy, emoji: "🏆" },
  { id: "new_artists", label: "Artists & Curators", icon: Mic, emoji: "🎨" },
  { id: "photographers", label: "Photographers", icon: Camera, emoji: "📸" },
  { id: "innovators", label: "Developers & Founders", icon: Lightbulb, emoji: "⚡" },
  { id: "us_top", label: "Top Leaderboard", icon: MapPin, emoji: "✨" },
];

function getCreatorPostImage(creator: Creator): string {
  if (creator.topPost?.imageUrl) return creator.topPost.imageUrl;
  return topPostPhoto;
}

function getRankBadgeStyle(rank: number) {
  if (rank === 1) {
    // Gold: Bright shining metallic gold fused with gold line
    return {
      line: 'bg-[#F59E0B]',
      circle: 'bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-slate-950 shadow-xs',
      badge: 'bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-slate-950 shadow-2xs',
      label: 'Gold #1 Ranked Post',
    };
  }
  if (rank === 2) {
    // Silver: Polished light metallic silver fused with silver line
    return {
      line: 'bg-[#94A3B8]',
      circle: 'bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#94A3B8] text-slate-950 shadow-xs',
      badge: 'bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#94A3B8] text-slate-950 shadow-2xs',
      label: 'Silver #2 Ranked Post',
    };
  }
  if (rank === 3) {
    // Bronze: Radiant light metallic bronze fused with bronze line
    return {
      line: 'bg-[#CD7F32]',
      circle: 'bg-gradient-to-r from-[#CD7F32] via-[#E28B47] to-[#CD7F32] text-white shadow-xs',
      badge: 'bg-gradient-to-r from-[#CD7F32] via-[#E28B47] to-[#CD7F32] text-white shadow-2xs',
      label: 'Bronze #3 Ranked Post',
    };
  }
  // 4 through 10: Signature Red fused seamlessly into line (no white borders or rings)
  return {
    line: 'bg-[#FF0000]',
    circle: 'bg-[#FF0000] text-white shadow-xs',
    badge: 'bg-[#FF0000] text-white shadow-2xs',
    label: `Rank #${rank}`,
  };
}

export default function App() {
  // Nav index: 0 = Home (Post Screen), 1 = Thumbs Up (Top 10 People Leaderboard), 2 = Comments, 3 = Trending, 4 = Profile
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name: string;
    handle: string;
    email: string;
    location?: string;
    profession?: string;
    bio?: string;
    avatarUrl?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('fairy_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.handle || parsed.username)) return parsed;
      }
    } catch (e) {}
    return null;
  });
  const isLoggedIn = Boolean(currentUser) && !isLoggedOut;
  const [showSignInRequiredModal, setShowSignInRequiredModal] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState<string>('interact with posts');

  const requireAuth = (actionName = 'interact with posts'): boolean => {
    if (isLoggedIn) return true;
    setAuthPromptAction(actionName);
    setShowSignInRequiredModal(true);
    return false;
  };

  const handleQuickSignInGollumfairy = () => {
    const gollumfairyUser = {
      id: 'user-gollumfairy',
      username: 'Gollumfairy',
      name: 'Gollumfairy',
      handle: '@Gollumfairy',
      email: 'gollumfairy@fairy.app',
      location: 'Fairy Realm',
      profession: 'Head Creator & Curator',
      bio: 'Official Gollumfairy account. Welcome to Fairy!',
    };
    setCurrentUser(gollumfairyUser);
    setIsLoggedOut(false);
    try {
      localStorage.setItem('fairy_current_user', JSON.stringify(gollumfairyUser));
    } catch (e) {}
    setShowSignInRequiredModal(false);
    setShowSignInModal(false);
    setTweetSuccessToast('Logged in as @Gollumfairy! You can now like, post, comment, and message.');
    setTimeout(() => {
      setTweetSuccessToast(null);
    }, 3500);
  };

  const [fairySwitches, setFairySwitches] = useState<FairySystemSwitches>(() =>
    getStoredFairySwitchesForUser(currentUser)
  );

  useEffect(() => {
    setFairySwitches(getStoredFairySwitchesForUser(isLoggedIn ? currentUser : null));
  }, [isLoggedIn, currentUser?.id, currentUser?.handle]);

  useEffect(() => {
    return subscribeToFairySwitches((switches) => {
      setFairySwitches(switches);
    });
  }, []);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showGitHubSyncModal, setShowGitHubSyncModal] = useState(false);
  const [repoSyncStatus, setRepoSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    return subscribeToSyncStatus((status) => {
      setRepoSyncStatus(status);
    });
  }, []);


  const [showCreateTweetModal, setShowCreateTweetModal] = useState(false);
  const [tweetSuccessToast, setTweetSuccessToast] = useState<string | null>(null);
  const [fullscreenMediaUrl, setFullscreenMediaUrl] = useState<string | null>(null);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: "post-welcome-gollumfairy",
      authorName: "Gollumfairy",
      authorHandle: "@Gollumfairy",
      authorAvatar: "",
      isVerified: true,
      timeAgo: "Just now",
      location: "Fairy Realm",
      mediaType: "image",
      mediaUrl: postImage,
      caption: "Welcome to Fairy Social Feed! Verified trust receipts, real community creators, and live GitHub sync are active 🧚✨",
      tags: ["#fairy", "#creators", "#trustreceipts"],
      genre: "Artist",
      audioTitle: "Original Audio",
      likeCount: 42,
      isLiked: false,
      isTrending: true,
    },
    {
      id: "tweet-allen-welcome",
      authorName: "Allen Dharak",
      authorHandle: "@allenkinetic002-creator",
      authorAvatar: "",
      isVerified: true,
      timeAgo: "10m ago",
      isTweet: true,
      tweetContent: "Fairy ecosystem is live with verified real accounts, persistent ratings, and live GitHub repository auto-sync.",
      mediaType: "tweet",
      caption: "Fairy ecosystem is live.",
      tags: ["#design", "#creators", "#build"],
      genre: "Tech & Code",
      audioTitle: "Original Audio",
      likeCount: 38,
      isLiked: false,
      isTrending: true,
      retweetCount: 8,
      replyCount: 5,
      viewCount: "1.2K",
    },
  ]);

  // Initialize Supabase backend sync and real-time listeners on mount
  useEffect(() => {
    initializeTrustReceiptsSync();
    initializeStarStampsSync();

    // Helper to normalize and ensure persistent, valid media URLs
    const normalizePost = (p: any): FeedPost => {
      const caption = p.caption || p.tweetContent || p.tweet_content || '';
      let defaultFallback = DEFAULT_FALLBACK_IMAGE;
      if (caption.toLowerCase().includes('tea')) {
        defaultFallback = TEA_AND_TEA_IMAGE;
      }
      const rawMedia = p.mediaUrl || p.media_url;
      const safeMedia = rawMedia ? getSafeMediaUrl(rawMedia, defaultFallback) : (p.isTweet ? undefined : defaultFallback);

      return {
        id: p.id,
        authorName: p.authorName || p.author_name || 'Anonymous User',
        authorHandle: p.authorHandle || p.author_handle || '@user',
        authorAvatar: p.authorAvatar || p.author_avatar || '',
        isVerified: !!(p.isVerified || p.is_verified),
        timeAgo: p.timeAgo || p.time_ago || 'Recent',
        location: p.location || undefined,
        mediaType: (p.mediaType || p.media_type) as any || (p.isTweet || p.is_tweet ? 'tweet' : 'image'),
        isTweet: !!(p.isTweet || p.is_tweet),
        tweetContent: p.tweetContent || p.tweet_content || undefined,
        mediaUrl: safeMedia,
        caption: p.caption || p.tweet_content || '',
        tags: p.tags || [],
        genre: p.genre || undefined,
        audioTitle: p.audioTitle || p.audio_title || 'Original Audio',
        likeCount: p.likeCount ?? p.like_count ?? 1,
        isLiked: false,
        isTrending: true,
        retweetCount: p.retweetCount ?? p.retweet_count ?? 0,
        replyCount: p.replyCount ?? p.reply_count ?? 0,
        viewCount: p.viewCount || p.view_count || '1',
        faceoffConfig: p.faceoffConfig || p.faceoff_config,
      };
    };

    // Refresh real registered creators from /api/users, local storage, votes, and posts
    const refreshRealCreators = async () => {
      try {
        const [userData, remoteVotes, ratingsData, postsRes] = await Promise.all([
          fetch("/api/users").then((r) => r.json()).catch(() => ({ success: false })),
          fetchRemoteVotes().catch(() => ({})),
          fetch("/api/ratings").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/posts").then((r) => r.json()).catch(() => ({ posts: [] })),
        ]);

        const votesMap = (remoteVotes || {}) as Record<string, any>;
        const ratingsMap = (ratingsData?.ratings || {}) as Record<string, any>;
        const rawUsers =
          userData && userData.success && Array.isArray(userData.users) && userData.users.length > 0
            ? userData.users
            : getStoredRegisteredAccounts();
        const postsList = Array.isArray(postsRes?.posts) ? postsRes.posts : [];

        const creators = convertRegisteredUsersToCreators(rawUsers, postsList, votesMap, ratingsMap);
        setCreatorsData(buildCreatorsRecord(creators));
      } catch (e) {
        console.warn('Failed refreshing real creators:', e);
      }
    };

    refreshRealCreators();

    // Realtime listener for votes, ratings, new posts, and registered users
    const unsubscribeRealtimeEvents = subscribeToRealtime((event, _data) => {
      if (
        event === 'vote_submitted' ||
        event === 'vote_reset' ||
        event === 'user_registered' ||
        event === 'rating_submitted' ||
        event === 'rating_reset' ||
        event === 'new_post'
      ) {
        refreshRealCreators();
      }
    });

    const handleLocalUserRegistered = () => {
      refreshRealCreators();
    };
    window.addEventListener('fairy_user_registered', handleLocalUserRegistered);

    // Load from local server storage, Supabase, and localStorage
    Promise.all([
      fetch('/api/posts')
        .then((r) => (r.ok ? r.json() : { posts: [] }))
        .catch(() => ({ posts: [] })),
      fetchRemotePosts().catch(() => []),
    ]).then(([localRes, remotePosts]) => {
      const combined: any[] = [];
      if (Array.isArray(localRes?.posts)) {
        combined.push(...localRes.posts);
      }
      if (Array.isArray(remotePosts)) {
        combined.push(...remotePosts);
      }

      // Also read cached localStorage posts
      try {
        const stored = localStorage.getItem('fairy_user_posts');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) combined.push(...parsed);
        }
      } catch {}

      if (combined.length > 0) {
        setFeedPosts((prev) => {
          const map = new Map<string, FeedPost>();
          combined.forEach((p) => {
            if (p && p.id && !map.has(p.id)) {
              map.set(p.id, normalizePost(p));
            }
          });
          // Retain welcome posts only if no server posts yet
          if (combined.length === 0) {
            prev.forEach((p) => {
              if (!map.has(p.id)) {
                map.set(p.id, p);
              }
            });
          }
          return Array.from(map.values());
        });
      }
    });
  }, []);

  const handlePublishTweet = (payload: NewTweetPayload) => {
    if (!requireAuth('publish a tweet')) return;
    const newTweet: FeedPost = {
      id: 'tweet-' + Date.now(),
      authorName: currentUser?.name || 'Anonymous User',
      authorHandle: currentUser?.handle || '@user',
      authorAvatar: currentUser?.avatarUrl || '',
      isVerified: true,
      timeAgo: 'Just now',
      isTweet: true,
      tweetContent: payload.text,
      mediaType: payload.mediaUrl ? 'image' : 'tweet',
      mediaUrl: payload.mediaUrl,
      caption: payload.text,
      tags: payload.tags && payload.tags.length > 0 ? payload.tags : ['#creators', '#design'],
      genre: payload.genre,
      audioTitle: 'Original Audio',
      likeCount: 1,
      isLiked: true,
      isTrending: true,
      retweetCount: 0,
      isRetweeted: false,
      replyCount: 0,
      viewCount: '1',
    };
    setFeedPosts((prev) => [newTweet, ...prev]);
    setActiveNavIndex(0);
    setShowMatchesScreen(false);
    setShowNormalMessagesScreen(false);
    setTargetMessagePerson(null);

    // Sync to local server storage
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTweet),
    }).catch(() => {});

    // Cache in browser localStorage
    try {
      const stored = localStorage.getItem('fairy_user_posts');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('fairy_user_posts', JSON.stringify([newTweet, ...list].slice(0, 50)));
    } catch {}

    // Sync to Supabase in the background
    syncPostToSupabase(newTweet).catch((err) =>
      console.warn('[Supabase] Failed to sync new tweet:', err)
    );

    // Auto-update GitHub repository on use
    syncActivityToRepo(
      'publish_tweet',
      `Tweet published: "${payload.text.slice(0, 45)}"`,
      { id: newTweet.id, author: newTweet.authorName },
      true
    );

    setTweetSuccessToast('Your post was published!');
    setTimeout(() => {
      setTweetSuccessToast(null);
    }, 3500);
  };

  const handlePublishPost = (payload: NewPostPayload) => {
    if (!requireAuth('create and share a post')) return;
    const newPost: FeedPost = {
      id: 'post-' + Date.now(),
      authorName: currentUser?.name || 'Anonymous User',
      authorHandle: currentUser?.handle || '@user',
      authorAvatar: currentUser?.avatarUrl || '',
      isVerified: true,
      timeAgo: 'Just now',
      location: payload.location,
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl,
      caption: payload.caption,
      tags: payload.tags,
      genre: payload.genre,
      audioTitle: payload.audioTitle,
      likeCount: 1,
      isLiked: true,
      isTrending: true,
      faceoffConfig: payload.faceoffConfig,
    };
    setFeedPosts((prev) => [newPost, ...prev]);

    // Sync to local server storage
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    }).catch(() => {});

    // Cache in browser localStorage
    try {
      const stored = localStorage.getItem('fairy_user_posts');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('fairy_user_posts', JSON.stringify([newPost, ...list].slice(0, 50)));
    } catch {}

    // Sync to Supabase in the background
    syncPostToSupabase(newPost).catch((err) =>
      console.warn('[Supabase] Failed to sync new post:', err)
    );

    // Auto-update GitHub repository on use
    syncActivityToRepo(
      'publish_post',
      `Post published: "${payload.caption ? payload.caption.slice(0, 45) : 'New media post'}"`,
      { id: newPost.id, mediaType: newPost.mediaType },
      true
    );

    if (payload.faceoffConfig) {
      setOpenFaceoffPosts((prev) => ({
        ...prev,
        [newPost.id]: true,
      }));
      setMorphedPosts((prev) => ({
        ...prev,
        [newPost.id]: true,
      }));
    }

    // When starting fresh, newly published posts appear on the creator screen
    const newCreatorPost: Creator = {
      rank: 1,
      name: newPost.authorName,
      handle: newPost.authorHandle,
      avatarBg: "bg-indigo-600",
      avatarInitial: newPost.authorName ? newPost.authorName[0].toUpperCase() : "U",
      avatarUrl: newPost.authorAvatar,
      role: "Creator",
      location: newPost.location || "Fairy Realm",
      upvotes: 1,
      rating: 9.5,
      phoneHandLikes: 0,
      phoneHandDislikes: 0,
      tieBreakerScore: 0,
      isUpvoted: false,
      isFollowing: false,
      category: "new_artists",
      topPost: {
        title: newPost.caption || "Fresh Creation",
        imageUrl: newPost.mediaUrl || topPostPhoto,
        gradientBg: "from-indigo-600 to-purple-900",
        likes: "1",
        comments: "0",
        hasAudio: Boolean(newPost.audioTitle),
        audioTitle: newPost.audioTitle || "Original Audio",
        tag: newPost.tags?.[0] || "Fresh Post",
      },
    };
    setCreatorsData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((cat) => {
        updated[cat] = [newCreatorPost, ...(updated[cat] || [])];
      });
      return updated;
    });
  };


  const handleTogglePostLike = (postId: string) => {
    if (!requireAuth('like this post')) return;
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          const nextCount = nextLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1);
          togglePostLikeOnBackend(postId, nextLiked, nextCount);
          syncActivityToRepo('like_post', `${nextLiked ? 'Liked' : 'Unliked'} post ${p.authorHandle}`, { postId, isLiked: nextLiked });
          return {
            ...p,
            isLiked: nextLiked,
            likeCount: nextCount,
          };
        }
        return p;
      })
    );
  };

  // Comments state
  const [commentType, setCommentType] = useState<'off' | 'inline-feed' | 'discussion-card' | 'floating-drawer'>('inline-feed');
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [inputComment, setInputComment] = useState('');
  const [totalComments, setTotalComments] = useState(812);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Top 10 Creators Categories
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<number | 'all'>(1);
  const [creatorsData, setCreatorsData] = useState<Record<string, Creator[]>>(ALL_TOP_CREATORS);
  const [previewCreator, setPreviewCreator] = useState<Creator | null>(null);
  const [likedCreatorPosts, setLikedCreatorPosts] = useState<Record<number, boolean>>({ 1: true });
  const [honeyJarCounts, setHoneyJarCounts] = useState<Record<number, number>>({});
  // Floating Honey Jar FAB state (triggered by clicking Nacho Cheese icon, pops up at bottom left like Twitter's feather icon)
  const [showFloatingHoneyJar, setShowFloatingHoneyJar] = useState(false);
  const [tieBreakerToast, setTieBreakerToast] = useState<string | null>(null);

  const toggleLikedCreatorPost = (rank: number) => {
    if (!requireAuth('like this creator post')) return;
    setLikedCreatorPosts((prev) => ({
      ...prev,
      [rank]: !prev[rank],
    }));
  };

  const handleHoneyJarClick = (rank: number) => {
    if (!requireAuth('support with Honey Jar')) return;
    setHoneyJarCounts((prev) => ({
      ...prev,
      [rank]: (prev[rank] || 0) + 1,
    }));
    syncActivityToRepo('support_honey_jar', `Gave Honey Jar pot support to creator Rank #${rank}`, { rank }, true);
  };

  // 3rd Icon: Control Screen Sub-tab ('fairy-control' by default or 'dm-control' or 'matches')
  const [controlSubTab, setControlSubTab] = useState<'fairy-control' | 'dm-control' | 'matches'>('fairy-control');
  const [showMatchesScreen, setShowMatchesScreen] = useState(false);
  const [showNormalMessagesScreen, setShowNormalMessagesScreen] = useState(false);
  const [showStarStampsScreen, setShowStarStampsScreen] = useState(false);
  const [starStampsSearchQuery, setStarStampsSearchQuery] = useState('');
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserSearchItem | null>(null);
  const [targetMessagePerson, setTargetMessagePerson] = useState<TargetMessagePerson | null>(null);
  const [activeInfluenceRatingId, setActiveInfluenceRatingId] = useState<string | null>(null);
  const [activePhoneReactionId, setActivePhoneReactionId] = useState<string | null>(null);

  const handleToggleInfluenceRating = (id: string) => {
    if (!requireAuth('rate creator influence')) return;
    setActiveInfluenceRatingId((prev) => (prev === id ? null : id));
  };

  const handleCloseInfluenceRating = () => {
    setActiveInfluenceRatingId(null);
  };

  const handleRatingSubmitted = (targetName: string, val: number) => {
    if (!requireAuth('submit influence rating')) return;
    setCreatorsData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((cat) => {
        updated[cat] = updated[cat].map((c) =>
          c.name.toLowerCase() === targetName.toLowerCase() ? { ...c, rating: val } : c
        );
      });
      return updated;
    });
    setTweetSuccessToast(`✓ Rating Finalized: ${val.toFixed(1)} ★ for ${targetName}`);
    setTimeout(() => setTweetSuccessToast(null), 3000);
  };

  const handleRatingReset = (targetName: string) => {
    if (!requireAuth('reset influence rating')) return;
    setTweetSuccessToast(`✓ Rating reset for ${targetName}. You can now choose or type a new score!`);
    setTimeout(() => setTweetSuccessToast(null), 3000);
  };

  // Real-time backend updates listener for ratings, votes, likes and comments
  useEffect(() => {
    const unsubscribe = subscribeToRealtime((event, data) => {
      if (event === 'rating_submitted' && data?.targetName) {
        setCreatorsData((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((cat) => {
            updated[cat] = updated[cat].map((c) =>
              c.name.toLowerCase() === data.targetName.toLowerCase() ? { ...c, rating: data.rating } : c
            );
          });
          return updated;
        });
      } else if (event === 'vote_submitted' && data?.personName) {
        setFeedPosts((prev) =>
          prev.map((p) =>
            p.authorName.toLowerCase() === data.personName.toLowerCase()
              ? { ...p, likeCount: typeof data.likes === 'number' ? data.likes : p.likeCount }
              : p
          )
        );
      } else if (event === 'post_action') {
        if (data?.postId && data?.action === 'like') {
          setFeedPosts((prev) =>
            prev.map((p) =>
              p.id === data.postId
                ? { ...p, isLiked: data.isLiked, likeCount: data.likeCount }
                : p
            )
          );
        }
      } else if (event === 'comment_added' && data?.comment) {
        setComments((prev) => {
          if (prev.some((c) => c.id === data.comment.id)) return prev;
          return [data.comment, ...prev];
        });
        setTotalComments((cnt) => cnt + 1);
      } else if (event === 'repo_updated') {
        setTweetSuccessToast(`↻ Synced latest update from GitHub: ${data?.lastCommit || 'origin/main'}`);
        setTimeout(() => setTweetSuccessToast(null), 4500);
      }
    });

    return () => unsubscribe();
  }, []);

  // Per-post broken pencil states to ensure each post is 100% independent (even from the same author)
  const [openFaceoffPosts, setOpenFaceoffPosts] = useState<Record<string, boolean>>({});
  const [morphedPosts, setMorphedPosts] = useState<Record<string, boolean>>({});

  const handleToggleFaceoff = (id: string) => {
    if (!requireAuth('vote in faceoff battle')) return;
    setOpenFaceoffPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseFaceoff = (id: string) => {
    setOpenFaceoffPosts((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleMorphPencil = (id: string) => {
    if (!requireAuth('follow creators')) return;
    setMorphedPosts((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Raygun Modal states (Verb: Past Challenges / Adverb: Challenge Person)
  const [raygunTarget, setRaygunTarget] = useState<{
    name: string;
    avatar: string;
    handle: string;
  } | null>(null);
  const [activeRaygunPostId, setActiveRaygunPostId] = useState<string | null>(null);
  const [showPastChallengesModal, setShowPastChallengesModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeOriginTweetId, setChallengeOriginTweetId] = useState<string | null>(null);

  const handleToggleRaygun = (id: string, name: string, avatar?: string, handle?: string) => {
    if (!requireAuth('use Raygun arena')) return;
    if (activeRaygunPostId === id) {
      setActiveRaygunPostId(null);
    } else {
      setActiveRaygunPostId(id);
      setRaygunTarget({
        name,
        avatar: avatar || '',
        handle: handle || '@creator',
      });
    }
  };

  const handlePublishChallenge = (payload: ChallengePostPayload) => {
    const isFromTweet = Boolean(challengeOriginTweetId);
    const newPostId = 'post-challenge-' + Date.now();
    const newPost: FeedPost = {
      id: newPostId,
      authorName: payload.challengerName || currentUser?.name || 'Anonymous User',
      authorHandle: currentUser?.handle || '@user',
      authorAvatar: payload.challengerAvatar || currentUser?.avatarUrl || '',
      isVerified: true,
      timeAgo: 'Just now',
      location: 'Battle Arena',
      mediaType: isFromTweet ? 'tweet' : 'image',
      isTweet: isFromTweet,
      tweetContent: payload.caption || `⚔️ Challenge: ${payload.battleQuestion} #faceoff #battle`,
      mediaUrl: payload.mediaUrl,
      caption: payload.caption,
      tags: payload.tags,
      audioTitle: '⚔️ Arena Battle Beat',
      likeCount: 1,
      isLiked: true,
      isTrending: true,
      retweetCount: 48,
      isRetweeted: false,
      faceoffConfig: {
        battleQuestion: payload.battleQuestion,
        totalParticipants: payload.totalParticipants,
        participants: payload.participants,
        redParticipant: {
          name: payload.challengerName,
          avatar: payload.challengerAvatar,
        },
        blueParticipant: {
          name: payload.opponentName,
          avatar: payload.opponentAvatar,
        },
      },
    };

    if (challengeOriginTweetId) {
      // Exclusively update that specific Twitter box with the challenge on it
      setFeedPosts((prev) =>
        prev.map((p) => {
          if (p.id === challengeOriginTweetId) {
            return {
              ...p,
              tweetContent: payload.caption || p.tweetContent,
              faceoffConfig: {
                battleQuestion: payload.battleQuestion,
                totalParticipants: payload.totalParticipants,
                participants: payload.participants,
                redParticipant: {
                  name: payload.challengerName,
                  avatar: payload.challengerAvatar,
                },
                blueParticipant: {
                  name: payload.opponentName,
                  avatar: payload.opponentAvatar,
                },
              },
            };
          }
          return p;
        })
      );
      setOpenFaceoffPosts((prev) => ({
        ...prev,
        [challengeOriginTweetId]: true,
      }));
      setMorphedPosts((prev) => ({
        ...prev,
        [challengeOriginTweetId]: true,
      }));
      setChallengeOriginTweetId(null);
    } else {
      setFeedPosts((prev) => [newPost, ...prev]);
      setOpenFaceoffPosts((prev) => ({
        ...prev,
        [newPostId]: true,
      }));
      setMorphedPosts((prev) => ({
        ...prev,
        [newPostId]: true,
      }));
    }

    // Persist published challenge to Supabase & auto-push to GitHub repo
    syncPostToSupabase(newPost).catch((err) =>
      console.warn('[Supabase] Failed to sync challenge post:', err)
    );
    syncActivityToRepo(
      'publish_challenge',
      `Arena Challenge published: "${payload.challengerName} vs ${payload.opponentName}" (${payload.totalParticipants} fighters)`,
      { challenger: payload.challengerName, opponent: payload.opponentName, participants: payload.totalParticipants },
      true
    );
  };

  const handleTogglePhoneReaction = (id: string) => {
    if (!requireAuth('react and vote')) return;
    setActivePhoneReactionId((prev) => (prev === id ? null : id));
  };

  const handleOpenSendPersonMessage = (person: TargetMessagePerson) => {
    if (!requireAuth(`message ${person.name || person.handle || 'creators'}`)) return;
    setTargetMessagePerson(person);
    setShowNormalMessagesScreen(true);
    setShowMatchesScreen(false);
  };

  const currentCreators = creatorsData[selectedCategory] || creatorsData.all || creatorsData.new_artists || [];

  const handleToggleCommentLike = (id: string) => {
    if (!requireAuth('like comments')) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isLiked;
          const nextCount = next ? c.likes + 1 : Math.max(0, c.likes - 1);
          syncActivityToRepo('like_comment', `${next ? 'Liked' : 'Unliked'} comment by ${c.username}`, { commentId: id, liked: next });
          return {
            ...c,
            isLiked: next,
            likes: nextCount,
          };
        }
        return c;
      })
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth('post a comment')) return;
    if (!inputComment.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      username: 'you',
      avatarBg: 'bg-purple-600',
      avatarText: 'Y',
      text: inputComment.trim(),
      time: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setInputComment('');
    setTotalComments((prev) => prev + 1);
    addCommentToBackend('global-feed', newComment);
    syncActivityToRepo('add_comment', `Added comment: "${newComment.text.slice(0, 30)}"`, { text: newComment.text }, true);
  };

  const handleToggleUpvoteCreator = (categoryKey: string, rank: number) => {
    if (!requireAuth('upvote creators')) return;
    setCreatorsData((prev) => {
      const list = prev[categoryKey] || [];
      const updatedList = list.map((c) => {
        if (c.rank === rank) {
          const nextUpvoted = !c.isUpvoted;
          const nextCount = nextUpvoted ? c.upvotes + 1 : c.upvotes - 1;
          submitVoteToBackend(c.name, nextUpvoted ? 'like' : 'dislike', nextCount);
          syncActivityToRepo('upvote_creator', `${nextUpvoted ? 'Upvoted' : 'Removed upvote on'} creator ${c.name} (#${rank})`, { creator: c.name, rank }, true);
          return {
            ...c,
            isUpvoted: nextUpvoted,
            upvotes: nextCount,
          };
        }
        return c;
      });
      return { ...prev, [categoryKey]: updatedList };
    });
  };

  const handleToggleFollow = (categoryKey: string, rank: number) => {
    if (!requireAuth('follow creators')) return;
    setCreatorsData((prev) => {
      const list = prev[categoryKey] || [];
      const updatedList = list.map((c) => {
        if (c.rank === rank) {
          const nextFollowing = !c.isFollowing;
          syncActivityToRepo('toggle_follow', `${nextFollowing ? 'Followed' : 'Unfollowed'} creator ${c.name} (#${rank})`, { creator: c.name, rank }, true);
          return {
            ...c,
            isFollowing: nextFollowing,
          };
        }
        return c;
      });
      return { ...prev, [categoryKey]: updatedList };
    });
  };

  // Helper to find a creator's phone hand likes
  const getCreatorPhoneLikes = (nameOrHandle: string): number => {
    const target = (nameOrHandle || '').toLowerCase().trim();
    for (const cat of Object.keys(creatorsData)) {
      const found = creatorsData[cat]?.find(
        (c) =>
          c.name.toLowerCase().trim() === target ||
          c.handle.replace('@', '').toLowerCase().trim() === target
      );
      if (found && typeof found.phoneHandLikes === 'number') {
        return found.phoneHandLikes;
      }
    }
    return 0;
  };

  // Helper to find a creator's current rank
  const getCreatorRank = (nameOrHandle: string): number | undefined => {
    const target = (nameOrHandle || '').toLowerCase().trim();
    const allList = creatorsData.all || creatorsData.new_artists || [];
    const found = allList.find(
      (c) =>
        c.name.toLowerCase().trim() === target ||
        c.handle.replace('@', '').toLowerCase().trim() === target
    );
    return found?.rank;
  };

  // Handphone Tie-Breaker: Red button adds likes, highest likes moves to #1 / Top 10
  // e.g. 3 likes is 1st, 2 likes is 2nd, 1 like is 3rd!
  const handleHandphoneTieBreakerVote = (
    categoryKey: string,
    personName: string,
    voteType: 'like' | 'dislike' | 'unvote' | 'reset',
    newLikes: number,
    newDislikes: number
  ) => {
    if (!requireAuth('vote on creators')) return;
    const targetKey = (personName || 'default').toLowerCase().trim();

    setCreatorsData((prev) => {
      const nextMap: Record<string, Creator[]> = {};
      let updatedRank = 1;

      Object.keys(prev).forEach((cat) => {
        let list = (prev[cat] || []).map((c) => {
          const match =
            c.name.toLowerCase().trim() === targetKey ||
            c.handle.replace('@', '').toLowerCase().trim() === targetKey;
          if (match) {
            return {
              ...c,
              phoneHandLikes: newLikes,
              phoneHandDislikes: newDislikes,
              tieBreakerLikes: newLikes,
              tieBreakerDislikes: newDislikes,
              tieBreakerScore: newLikes - newDislikes,
            };
          }
          return { ...c };
        });

        // If person not found in this category but exists elsewhere, add them if viewing all or top
        const alreadyInList = list.some(
          (c) =>
            c.name.toLowerCase().trim() === targetKey ||
            c.handle.replace('@', '').toLowerCase().trim() === targetKey
        );
        if (!alreadyInList && (cat === 'all' || cat === 'us_top')) {
          list.push({
            rank: list.length + 1,
            name: personName,
            handle: '@' + targetKey.replace(/\s+/g, ''),
            avatarBg: 'bg-purple-600',
            avatarInitial: personName[0]?.toUpperCase() || 'U',
            role: 'Verified Creator',
            location: 'Fairy Network',
            upvotes: 60,
            rating: 9.3,
            phoneHandLikes: newLikes,
            phoneHandDislikes: newDislikes,
            tieBreakerScore: newLikes - newDislikes,
            isUpvoted: false,
            isFollowing: false,
            category: 'new_artists',
            topPost: {
              title: `${personName} on Fairy`,
              imageUrl: topPostPhoto,
              gradientBg: 'from-purple-600 to-indigo-900',
              likes: String(newLikes),
              comments: '8',
              tag: 'Creator',
            },
          });
        }

        // Re-sort: highest likes on that phone hand moves to top 10 or number 1!
        const sorted = sortCreatorsByPhoneLikes(list);
        nextMap[cat] = sorted;

        const found = sorted.find(
          (c) =>
            c.name.toLowerCase().trim() === targetKey ||
            c.handle.replace('@', '').toLowerCase().trim() === targetKey
        );
        if (found) {
          updatedRank = found.rank;
        }
      });

      if (voteType === 'reset') {
        setTieBreakerToast(`🔄 Phone hand likes reset to 0 for ${personName}`);
      } else if (voteType === 'unvote') {
        setTieBreakerToast(`↩ Unclicked like on ${personName} (${newLikes.toLocaleString()} likes)`);
      } else if (updatedRank === 1) {
        setTieBreakerToast(`🏆 NUMBER ONE! ${personName} moves to #1 on Leaderboard with ${newLikes.toLocaleString()} Phone Hand ${newLikes === 1 ? 'like' : 'likes'}!`);
      } else {
        setTieBreakerToast(`▲ ${personName} moves to Rank #${updatedRank} with ${newLikes.toLocaleString()} Phone Hand ${newLikes === 1 ? 'like' : 'likes'}!`);
      }

      setTimeout(() => {
        setTieBreakerToast(null);
      }, 3000);

      return nextMap;
    });

    submitVoteToBackend(personName, voteType === 'dislike' ? 'dislike' : voteType === 'unvote' ? 'like' : 'like', newLikes, newDislikes);
    syncActivityToRepo(
      'phone_hand_vote',
      `Phone Hand Vote: ${personName} ${voteType === 'unvote' ? 'unclicked' : voteType} (now ${newLikes} likes)`,
      { personName, voteType, likes: newLikes, dislikes: newDislikes },
      true
    );
  };

  const handleFeedPostTieBreakerVote = (
    postId: string,
    authorName: string,
    voteType: 'like' | 'dislike' | 'unvote' | 'reset',
    newLikes: number,
    newDislikes: number
  ) => {
    if (!requireAuth('vote on creators')) return;
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likeCount: Math.max(1, (p.likeCount || 10) + (voteType === 'like' ? 1 : -1)),
          };
        }
        return p;
      })
    );

    handleHandphoneTieBreakerVote(selectedCategory, authorName, voteType, newLikes, newDislikes);
  };

  return (
    <div className="w-full max-w-full h-screen max-h-screen overflow-x-hidden overflow-y-hidden bg-white flex flex-col justify-between text-slate-900 font-sans antialiased select-none relative">
      {/* Tie-Breaker Toast Notification */}
      {tieBreakerToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] flex justify-center animate-fadeIn pointer-events-none">
          <div className="bg-slate-900/95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-xs flex items-center gap-2 border border-amber-400/60">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>{tieBreakerToast}</span>
          </div>
        </div>
      )}
      {showStarStampsScreen ? (
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <StarStampsScreen
            onBackToFeed={() => setShowStarStampsScreen(false)}
            initialSearchQuery={starStampsSearchQuery}
            isLoggedIn={isLoggedIn}
            onRequireAuth={requireAuth}
          />
        </div>
      ) : showMatchesScreen ? (
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <MatchesScreen onBackToFeed={() => setShowMatchesScreen(false)} />
        </div>
      ) : showNormalMessagesScreen ? (
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <NormalMessagesScreen
            onBackToFeed={() => {
              setShowNormalMessagesScreen(false);
              setTargetMessagePerson(null);
            }}
            onOpenExclusiveMatches={() => {
              setShowNormalMessagesScreen(false);
              setShowMatchesScreen(true);
              setTargetMessagePerson(null);
            }}
            targetPerson={targetMessagePerson}
            onClearTargetPerson={() => setTargetMessagePerson(null)}
            isLoggedIn={isLoggedIn}
            onRequireAuth={requireAuth}
          />
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* SCREEN 1: POST SCREEN (TAB 0 - HOME) */}
          {/* ========================================================================= */}
          {activeNavIndex === 0 && (
            <>
          {/* Header */}
          <header className="w-full px-4 pt-1.5 pb-1 flex flex-col shrink-0 bg-white z-10 border-b border-slate-50 relative">
            {/* Top row: Sign in button (disappears when signed in, nothing else added) */}
            {!isLoggedIn && (
              <div className="w-full flex items-center justify-end pr-0.5 pb-1">
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-extrabold rounded-full shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  title="Sign In to Fairy"
                  aria-label="Sign In"
                >
                  <User className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Main Header Row: Logo on left, all 5 icons in a single row on right */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer flex items-center justify-center shrink-0">
                  <AeriSlimeSqueezeIcon size={30} className="w-[30px] h-[33.7px] shrink-0 drop-shadow-xs" />
                </div>
                <h1 className="text-[21px] font-black tracking-tight text-black leading-none font-sans">
                  Fairy
                </h1>
              </div>

              {/* All 5 Header Icons in a clean single row */}
              <div className="flex items-center gap-3">
                {/* 1st header icon: Guacamole Bowl / Nacho Cheese icon (toggles far-right floating honeyjar icon) */}
                <button
                  onClick={() => setShowFloatingHoneyJar((prev) => !prev)}
                  aria-label="Guacamole & Nachos"
                  title="Guacamole & Nachos"
                  className="hover:opacity-75 transition-opacity active:scale-90 cursor-pointer p-0.5 flex items-center justify-center shrink-0"
                >
                  <AeriGuacamoleBowlIcon size={30} className="w-[30px] h-[30px]" />
                </button>

                {/* 2nd header icon: Concentric Circle icon linked to Create Post Modal (Photo, Video & Writing) */}
                <button
                  onClick={() => {
                    if (!requireAuth('create and upload a post')) return;
                    setShowCreatePostModal(true);
                  }}
                  aria-label="Create Post · Concentric Circle"
                  title="Create Post · Upload video, photo & writing"
                  className="hover:opacity-75 transition-transform active:scale-90 cursor-pointer p-0.5 flex items-center justify-center shrink-0"
                >
                  <AeriConcentricCircleIcon className="w-[27px] h-[27px] text-black" />
                </button>

                {/* 3rd header icon: One-Eye Hat Guy icon beside Search */}
                <button
                  onClick={() => {
                    setMorphedPosts((prev) => {
                      const firstId = feedPosts[0]?.id || 'post-1';
                      const next = !prev[firstId];
                      const updated = { ...prev };
                      feedPosts.forEach((p) => {
                        updated[p.id] = next;
                      });
                      return updated;
                    });
                  }}
                  aria-label="One-Eye Hat Guy"
                  title="One-Eye Hat Guy"
                  className="hover:opacity-75 transition-opacity cursor-pointer p-0.5 flex items-center justify-center"
                >
                  <AeriOneEyeHatGuyIcon className="w-[33px] h-[33px] text-black" />
                </button>

                {/* 4th header icon: Search icon */}
                <button
                  onClick={() => {
                    setShowUserSearchModal(true);
                  }}
                  aria-label="Search Creators & Users"
                  title="Search Creators & Users"
                  className="hover:opacity-75 transition-opacity cursor-pointer p-0.5 flex items-center justify-center"
                >
                  <AeriSearchIcon className="w-[22px] h-[22px] text-black" />
                </button>

                {/* 5th header icon: Message icon */}
                <button
                  onClick={() => {
                    if (!requireAuth('send and view direct messages')) return;
                    setTargetMessagePerson(null);
                    setShowNormalMessagesScreen(true);
                  }}
                  aria-label="Messages"
                  title="Messages · Direct messages with normal users"
                  className="hover:opacity-75 transition-all active:scale-90 cursor-pointer p-0.5 relative text-black flex items-center justify-center"
                >
                  <AeriMessageBubbleIcon size={22} className="w-[22px] h-[22px] text-black" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                </button>
              </div>
            </div>
          </header>

          {/* Comment Mode Switcher & Live Repo Sync */}
          <div className="w-full px-4 py-1.5 flex items-center justify-between shrink-0 bg-white z-10 border-b border-slate-100">
            <button
              onClick={() => setShowGitHubSyncModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              title="Open GitHub Live Repo Sync (allenkinetic002-creator/Gollumfairy-)"
            >
              <GitBranch className="w-3 h-3 text-indigo-600" />
              <span>Repo Sync</span>
              {repoSyncStatus?.status === 'syncing' && (
                <RefreshCw className="w-2.5 h-2.5 text-indigo-600 animate-spin" />
              )}
            </button>
            <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setCommentType('off')}
                className={`px-3 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  commentType === 'off'
                    ? 'bg-rose-500 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Turn comments off so they disappear"
              >
                Off
              </button>
              <button
                onClick={() => setCommentType((prev) => (prev === 'inline-feed' ? 'off' : 'inline-feed'))}
                className={`px-3 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  commentType === 'inline-feed'
                    ? 'bg-purple-600 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Display inline feed comments"
              >
                Feed
              </button>
              <button
                onClick={() => setCommentType((prev) => (prev === 'discussion-card' ? 'off' : 'discussion-card'))}
                className={`px-3 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  commentType === 'discussion-card'
                    ? 'bg-purple-600 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Display discussion thread card"
              >
                Discussion
              </button>
              <button
                onClick={() => {
                  setCommentType('floating-drawer');
                  setIsDrawerOpen(true);
                }}
                className={`px-3 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  commentType === 'floating-drawer'
                    ? 'bg-purple-600 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Display sliding sheet drawer"
              >
                Sheet
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 w-full max-w-full px-3.5 sm:px-4 py-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin space-y-3 relative">
            {/* Success toast if tweet published */}
            {tweetSuccessToast && (
              <div className="sticky top-1 z-30 w-full flex justify-center animate-fadeIn pointer-events-none">
                <div className="bg-slate-900/95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 border border-slate-700">
                  <AeriFlameIcon filled className="w-3.5 h-3.5 text-[#FF6D00]" />
                  <span>{tweetSuccessToast}</span>
                </div>
              </div>
            )}

            {feedPosts.map((post) =>
              post.isTweet ? (
                <TweetPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleTogglePostLike}
                  onOpenComments={() => setIsDrawerOpen(true)}
                  onOpenSendMessage={handleOpenSendPersonMessage}
                  onTogglePhoneReaction={handleTogglePhoneReaction}
                  onToggleInfluenceRating={handleToggleInfluenceRating}
                  onToggleRaygun={handleToggleRaygun}
                  isRaygunActive={activeRaygunPostId === post.id}
                  onCloseRaygun={() => setActiveRaygunPostId(null)}
                  onSelectVerb={() => {
                    setActiveRaygunPostId(null);
                    setShowPastChallengesModal(true);
                  }}
                  onSelectAdverb={() => {
                    setActiveRaygunPostId(null);
                    setChallengeOriginTweetId(post.id);
                    setFeedPosts((prev) =>
                      prev.map((p) => {
                        if (p.id === post.id) {
                          return {
                            ...p,
                            faceoffConfig: p.faceoffConfig || {
                              battleQuestion: `Who has the superior creative direction between ${post.authorName} and Gollumfairy?`,
                              redParticipant: {
                                name: post.authorName,
                                avatar: post.authorAvatar,
                              },
                              blueParticipant: {
                                name: 'Gollumfairy',
                                avatar: '',
                              },
                            },
                          };
                        }
                        return p;
                      })
                    );
                    setOpenFaceoffPosts((prev) => ({
                      ...prev,
                      [post.id]: true,
                    }));
                    setMorphedPosts((prev) => ({
                      ...prev,
                      [post.id]: true,
                    }));
                    setRaygunTarget({
                      name: post.authorName,
                      avatar: post.authorAvatar,
                      handle: post.authorHandle,
                    });
                    setShowChallengeModal(true);
                  }}
                  isPhoneReactionActive={activePhoneReactionId === post.id}
                  isInfluenceRatingActive={activeInfluenceRatingId === post.id}
                  onCloseInfluenceRating={handleCloseInfluenceRating}
                  isFaceoffOpen={Boolean(openFaceoffPosts[post.id])}
                  isMorphed={Boolean(morphedPosts[post.id])}
                  onToggleFaceoff={handleToggleFaceoff}
                  onCloseFaceoff={handleCloseFaceoff}
                  onMorphPencil={handleMorphPencil}
                  onNoAdverb={() => {}}
                  onOpenStarStamps={() => {
                    setActiveInfluenceRatingId(null);
                    setStarStampsSearchQuery(post.authorName);
                    setShowStarStampsScreen(true);
                  }}
                  onRatingSubmit={(val) => {
                    handleRatingSubmitted(post.authorName, val);
                  }}
                  onRatingReset={() => {
                    handleRatingReset(post.authorName);
                  }}
                  authorPhoneLikes={getCreatorPhoneLikes(post.authorName)}
                  authorRank={getCreatorRank(post.authorName)}
                  onPhoneVote={(postId, authorName, type, newLikes, newDislikes) => {
                    handleFeedPostTieBreakerVote(postId, authorName, type, newLikes, newDislikes);
                  }}
                  userGenreEnabled={Boolean(fairySwitches.genre)}
                />
              ) : (
              <div key={post.id} className="space-y-1.5 shrink-0">
                {/* Reaction Widget moved upper to the very top of post */}
                {activePhoneReactionId === post.id && (
                  <div className="w-full flex justify-center pt-0 pb-1 -mt-0.5">
                    <PhoneReactionPopup
                      personName={post.authorName}
                      postAuthor={post.authorName}
                      currentRank={getCreatorRank(post.authorName)}
                      initialLikes={getCreatorPhoneLikes(post.authorName)}
                      onVote={(type, newLikes, newDislikes) => {
                        handleFeedPostTieBreakerVote(post.id, post.authorName, type, newLikes, newDislikes);
                      }}
                    />
                  </div>
                )}

                {/* Broken Pencil Faceoff Battle Card attached to post on top of profile pic (strictly independent per post) */}
                {Boolean(openFaceoffPosts[post.id]) && (
                  <div className="w-full flex justify-center pt-0 pb-1.5 -mt-0.5">
                    <FaceoffBattleModal
                      onClose={() => handleCloseFaceoff(post.id)}
                      battleQuestion={post.faceoffConfig?.battleQuestion}
                      totalParticipants={post.faceoffConfig?.totalParticipants}
                      participants={post.faceoffConfig?.participants}
                      redParticipant={post.faceoffConfig?.redParticipant}
                      blueParticipant={post.faceoffConfig?.blueParticipant}
                      isLoggedIn={isLoggedIn}
                      onRequireAuth={requireAuth}
                    />
                  </div>
                )}
                {/* 1. Trending Tag with Flame placed directly on top of the person profile pic */}
                {post.isTrending && (
                  <div className="flex items-center justify-between pt-1 pb-0.5 px-0.5 shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFF0F5] border border-pink-100/80 rounded-full shadow-2xs">
                      <AeriFlameIcon filled className="w-3.5 h-3.5 text-[#FF5722]" />
                      <span className="text-[11px] font-black text-[#8B2FC9] tracking-tight">
                        Trending #1 Post
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Featured in Fairy Feed
                    </span>
                  </div>
                )}


                {/* 2. Post Author Header with Profile Picture */}
                <div className="flex items-center justify-between py-1 px-0.5 shrink-0 bg-white">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      {post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          onClick={() => handleTogglePhoneReaction(post.id)}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
                        />
                      ) : null}
                      <div
                        onClick={() => handleTogglePhoneReaction(post.id)}
                        style={{ display: post.authorAvatar ? 'none' : 'flex' }}
                        className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-400 items-center justify-center p-0.5 shadow-xs cursor-pointer hover:border-slate-300 transition-all ring-2 ring-purple-600/20"
                        title="Profile icon"
                      >
                        <User className="w-5 h-5 text-slate-400 stroke-[1.6]" />
                      </div>
                      {/* Flame Badge directly on top of the profile pic */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center ring-1.5 ring-white shadow-2xs pointer-events-none" title="Trending Creator">
                        <AeriFlameIcon filled className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 leading-none flex-wrap">
                        <span className="text-[13px] font-black text-slate-900 tracking-tight">
                          {post.authorName}
                        </span>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                        )}
                        {/* Genre badge appears ONLY when viewing user has Genre ON */}
                        {fairySwitches.genre && post.genre && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border border-purple-200/90 shadow-2xs">
                            <span>{getGenreInfo(post.genre)?.icon || '🎨'}</span>
                            <span>{post.genre}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] font-medium text-slate-500 mt-0.5">
                        {post.authorHandle} &middot; {post.timeAgo} {post.location ? `· ${post.location}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Follow button morphs into pure broken pencil icon (isolated per post, does not affect other posts) */}
                    {(Boolean(post.faceoffConfig) || Boolean(morphedPosts[post.id])) ? (
                      <div
                        onClick={() => handleToggleFaceoff(post.id)}
                        title="Click to toggle faceoff battle"
                        role="button"
                        tabIndex={0}
                        aria-label="Broken pencil faceoff battle"
                        className="cursor-pointer -translate-y-1 hover:opacity-80 transition-transform active:scale-95 flex items-center justify-center p-0"
                      >
                        <BrokenPencilIcon className="w-[56px] sm:w-[62px] h-auto" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMorphPencil(post.id)}
                        className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3 text-purple-600" />
                        <span>Follow</span>
                      </button>
                    )}
                    <button
                      aria-label="Post options"
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <span className="text-base font-bold leading-none">&middot;&middot;&middot;</span>
                    </button>
                  </div>
                </div>

                {/* 3. Post Card: Image or Video (Full picture display without cropping) */}
                <div className="relative w-full min-h-[220px] max-h-[620px] rounded-[18px] overflow-hidden bg-slate-950 flex items-center justify-center shadow-xs shrink-0 group">
                  {/* Subtle blur backdrop to fill aspect ratio letterbox cleanly */}
                  {post.mediaType !== 'video' && post.mediaUrl && (
                    <div
                      className="absolute inset-0 bg-center bg-cover blur-xl opacity-20 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${getSafeMediaUrl(post.mediaUrl)})` }}
                    />
                  )}

                  {post.mediaType === 'video' ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="relative z-10 w-full max-h-[620px] object-contain mx-auto"
                    />
                  ) : (
                    <img
                      src={getSafeMediaUrl(post.mediaUrl)}
                      alt={post.caption}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="relative z-10 w-full max-h-[620px] object-contain mx-auto cursor-pointer"
                      onClick={() => setFullscreenMediaUrl(getSafeMediaUrl(post.mediaUrl))}
                    />
                  )}

                  {/* Expand to full screen icon */}
                  {post.mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setFullscreenMediaUrl(post.mediaUrl || null)}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      title="View full picture"
                      aria-label="View full picture"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="absolute right-3 bottom-3 z-20 bg-white/75 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/40 pointer-events-none">
                    <Music className="w-3 h-3 text-slate-800" />
                    <span className="text-[9.5px] font-semibold text-slate-900 tracking-tight">
                      {post.audioTitle || 'Original Audio'}
                    </span>
                  </div>
                </div>

                {/* 4. Action Row */}
                <div className="flex items-end justify-between pt-1.5 shrink-0 text-black w-full max-w-full overflow-hidden">
                  {/* All icons grouped closely together on the left */}
                  <div className="flex items-end gap-1.5 sm:gap-2 min-w-0">
                    {/* Left 3 icons: Flame, Comment, Honeyjar (standard untouched spacing) */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 pb-0.5 shrink-0">
                      <button
                        onClick={() => handleTogglePostLike(post.id)}
                        className="cursor-pointer transition-transform active:scale-90"
                        aria-label="Like post"
                      >
                        <AeriFlameIcon
                          filled={post.isLiked}
                          className={`w-5.5 h-5.5 transition-colors ${
                            post.isLiked
                              ? 'text-[#FF6D00]'
                              : 'text-[#FF6D00] stroke-[1.8]'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="cursor-pointer transition-transform active:scale-90 hover:opacity-75"
                        aria-label="Comments"
                      >
                        <AeriCommentIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                      </button>

                      {/* 3rd icon: Honey jar icon (Fairy Pot) */}
                      <button
                        onClick={() => {
                          setActiveNavIndex(2);
                          setShowMatchesScreen(false);
                        }}
                        className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                        aria-label="Honey Jar / Fairy Pot"
                        title="Honey Jar"
                      >
                        <FairyPotIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                      </button>
                    </div>

                    {/* Pill & Two Icons column */}
                    <div className="flex flex-col items-start gap-1 min-w-0">
                      {/* Long gray pill like icon with "Send me message" */}
                      <button
                        onClick={() =>
                          handleOpenSendPersonMessage({
                            id: (post.id || 'user-' + post.authorHandle),
                            name: post.authorName,
                            handle: post.authorHandle,
                            avatarUrl: post.authorAvatar,
                          })
                        }
                        className="cursor-pointer px-2.5 sm:px-3 py-1 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-black hover:text-black rounded-full text-[10px] sm:text-[10.5px] font-semibold flex items-center justify-center gap-1 border border-slate-300 shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                        title={`Send ${post.authorName} message`}
                        aria-label="Send me message"
                      >
                        <AeriMessageBubbleIcon className="w-3.5 h-3.5 text-black shrink-0" color="#000000" />
                        <span className="text-black font-semibold">Send me message</span>
                      </button>

                      {/* Only those two icons moved slightly more to the right */}
                      <div className="flex items-center gap-2 ml-1 sm:ml-1.5">
                        {/* 4th icon: Hand holding smartphone */}
                        <button
                          onClick={() => handleTogglePhoneReaction(post.id)}
                          className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                          title="Smartphone / Social Reach"
                          aria-label="Smartphone"
                        >
                          <AeriHandPhoneIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                        </button>

                        {/* 5th icon: Masked 2 eyes */}
                        <button
                          onClick={() => handleToggleInfluenceRating(post.id)}
                          className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                          aria-label="View Fairy ratings and social reach"
                          title="Overall ratings & Social reach"
                        >
                          <AeriMaskedEyesIcon className="w-[30px] h-[21px] text-black shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Likes count alone on the right */}
                  <div className="pb-1 shrink-0 ml-1">
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums whitespace-nowrap">
                      {post.likeCount.toLocaleString()} likes
                    </span>
                  </div>
                </div>

                {/* 5. Post Writing & Caption */}
                <div className="pt-0.5 pb-1 px-0.5 shrink-0">
                  <div className="flex items-start gap-2">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-purple-500/20"
                      />
                    ) : null}
                    <div
                      style={{ display: post.authorAvatar ? 'none' : 'flex' }}
                      className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 items-center justify-center shrink-0 mt-0.5"
                    >
                      <User className="w-3 h-3 text-slate-400 stroke-[1.8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {fairySwitches.genre && post.genre && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Genre</span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border border-purple-200/90 shadow-2xs">
                            <span>{getGenreInfo(post.genre)?.icon || '🎨'}</span>
                            <span>{post.genre}</span>
                          </span>
                        </div>
                      )}
                      <p className="text-[12px] leading-snug text-slate-800">
                        <span className="font-extrabold text-slate-900 mr-1.5">
                          {post.authorHandle}
                        </span>
                        {post.caption}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-[10.5px] font-bold text-purple-600 hover:underline cursor-pointer">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Influence Rating Card placed down on post instead of modal */}
                {activeInfluenceRatingId === post.id && (
                  <div className="w-full pt-1 pb-2 px-0.5">
                    <InfluenceRatingModal
                      isOpen={true}
                      isInline={true}
                      targetName={post.authorName}
                      onClose={handleCloseInfluenceRating}
                      onRatingSubmit={(val) => {
                        handleRatingSubmitted(post.authorName, val);
                      }}
                      onRatingReset={() => {
                        handleRatingReset(post.authorName);
                      }}
                      onOpenStarStamps={() => {
                        setActiveInfluenceRatingId(null);
                        setStarStampsSearchQuery(post.authorName);
                        setShowStarStampsScreen(true);
                      }}
                    />
                  </div>
                )}
              </div>
              )
            )}

                {/* Comments Section (Displays when Feed, Discussion, or Sheet is active; disappears when Off) */}
                {commentType !== 'off' && (
                  <div className="flex-1 min-h-0 w-full my-1 flex flex-col justify-between overflow-hidden animate-fadeIn">
                    {commentType === 'inline-feed' ? (
                    <div className="flex-1 min-h-0 bg-slate-50/70 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/60 shrink-0">
                        <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                          <AeriCommentIcon className="w-3.5 h-3.5 text-purple-600" />
                          Comments ({totalComments})
                        </span>
                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          className="text-[10px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                        >
                          Expand all &rarr;
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-1 scrollbar-thin">
                        {comments.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-start gap-2 text-xs">
                            <div
                              className={`w-5 h-5 rounded-full ${item.avatarBg} text-white font-bold text-[8.5px] flex items-center justify-center shrink-0 shadow-2xs`}
                            >
                              {item.avatarText}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] leading-tight text-slate-800">
                                <span className="font-extrabold text-slate-900 mr-1.5">
                                  @{item.username}
                                </span>
                                {item.text}
                              </p>
                              <span className="text-[9.5px] text-slate-400 mt-0.5 inline-block">
                                {item.time} &middot; Reply
                              </span>
                            </div>
                            <button
                              onClick={() => handleToggleCommentLike(item.id)}
                              className="flex items-center gap-0.5 text-slate-400 hover:text-red-500 pt-0.5 cursor-pointer shrink-0"
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  item.isLiked ? 'text-red-500 fill-red-500' : 'stroke-[1.8]'
                                }`}
                              />
                              <span className="text-[9px] tabular-nums font-semibold">
                                {item.likes}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={handlePostComment}
                        className="flex items-center gap-1.5 pt-1.5 mt-1 border-t border-slate-200/60 shrink-0"
                      >
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          Y
                        </div>
                        <input
                          type="text"
                          value={inputComment}
                          onFocus={(e) => {
                            if (!isLoggedIn) {
                              e.target.blur();
                              requireAuth('post a comment');
                            }
                          }}
                          onChange={(e) => {
                            if (!isLoggedIn) {
                              requireAuth('post a comment');
                              return;
                            }
                            setInputComment(e.target.value);
                          }}
                          placeholder={isLoggedIn ? "Add a comment..." : "Sign in to add a comment..."}
                          className="flex-1 bg-white border border-slate-200 rounded-full px-2.5 py-1 text-[11px] focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="submit"
                          disabled={!inputComment.trim()}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                        >
                          Post
                        </button>
                      </form>
                    </div>
                  ) : commentType === 'discussion-card' ? (
                    <div className="flex-1 min-h-0 bg-purple-50/40 rounded-xl p-2.5 border border-purple-100/80 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between shrink-0 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-extrabold text-slate-900">
                            Top Community Thread
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          {totalComments} active
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-2 shadow-2xs border border-purple-100/60 my-auto">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[8px] font-bold flex items-center justify-center">
                              M
                            </div>
                            <span className="text-[10.5px] font-extrabold text-slate-900">
                              @maya_sky
                            </span>
                            <span className="text-[9px] text-slate-400">Featured</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            42
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug">
                          &ldquo;Where is that yellow coat from?! The lighting is immaculate 💛&rdquo;
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (!requireAuth('join community discussion')) return;
                          setIsDrawerOpen(true);
                        }}
                        className="w-full mt-1.5 py-1.5 px-3 bg-white border border-purple-200 hover:border-purple-400 rounded-full text-slate-500 text-[10.5px] flex items-center justify-between transition-colors shadow-2xs cursor-pointer shrink-0"
                      >
                        <span>Join the discussion...</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          Reply &rarr;
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col justify-center items-start">
                      <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-4 py-2 bg-[#9810FA] hover:bg-[#8B0EE5] active:scale-98 transition-all rounded-full text-white text-xs font-black tracking-tight shadow-xs cursor-pointer flex items-center gap-2"
                      >
                        <AeriCommentIcon className="w-3.5 h-3.5 fill-white/20" />
                        <span>{totalComments} comments &middot; View Thread</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

                {/* Secondary Row: Fire Hydrant & Raygun */}
                <div className="flex items-center gap-4 pt-1 pb-1 shrink-0">
                  <button
                    className="flex items-center justify-center transition-transform active:scale-90 hover:scale-105 cursor-pointer"
                    title="Fire Hydrant"
                    aria-label="Fire Hydrant"
                  >
                    <AeriHydrantIcon size={26} className="w-[26px] h-[35px] drop-shadow-2xs" />
                  </button>

                  <button
                    onClick={() => handleToggleRaygun(feedPosts[0]?.id || 'feed-post-1', feedPosts[0]?.authorName || 'Allen Dharak', feedPosts[0]?.authorAvatar, feedPosts[0]?.authorHandle)}
                    className="flex items-center justify-center text-slate-800 hover:text-black transition-transform active:scale-90 hover:opacity-80 hover:scale-105 cursor-pointer"
                    title="Raygun Arena (Verb / Adverb)"
                    aria-label="Raygun Arena Actions"
                  >
                    <AeriRaygunIcon className="w-8.5 h-8.5 text-slate-800 stroke-[1.3]" />
                  </button>
                </div>

                {/* Verb & Adverb Card placed down on post instead of modal */}
                {activeRaygunPostId === (feedPosts[0]?.id || 'feed-post-1') && (
                  <div className="w-full pt-1 pb-2 flex justify-start">
                    <RaygunActionModal
                      isOpen={true}
                      isInline={true}
                      targetPersonName={raygunTarget?.name || feedPosts[0]?.authorName || 'Allen Dharak'}
                      targetPersonAvatar={raygunTarget?.avatar || feedPosts[0]?.authorAvatar}
                      onClose={() => setActiveRaygunPostId(null)}
                      onSelectVerb={() => {
                        setActiveRaygunPostId(null);
                        setShowPastChallengesModal(true);
                      }}
                      onSelectAdverb={() => {
                        setActiveRaygunPostId(null);
                        setShowChallengeModal(true);
                      }}
                    />
                  </div>
                )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: TOP 10 CREATORS BY CATEGORY (TAB 1 - THUMBS UP) */}
      {/* ========================================================================= */}
      {activeNavIndex === 1 && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/60">
          {/* Top 10 Header */}
          <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100 shrink-0 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Trophy className="w-4.5 h-4.5 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-[16px] font-black text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
                    Fairy Top 10
                    <span className="text-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      Leaderboard
                    </span>
                  </h2>
                  <p className="text-[10.5px] text-slate-500">
                    Highest upvoted profiles &amp; featured creations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isLoggedIn && (
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-extrabold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                    title="Sign In to Fairy"
                  >
                    <User className="w-3 h-3 stroke-[2.4]" />
                    <span>Sign In</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveNavIndex(0)}
                  className="text-[11px] font-bold text-slate-600 hover:text-black px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Back to Feed
                </button>
              </div>
            </div>

            {/* CATEGORY SELECTOR CAROUSEL (All 6 requested categories) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {CATEGORY_TABS.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Category Banner Info */}
          <div className="px-4 py-1.5 bg-purple-50/60 border-b border-purple-100/60 flex items-center justify-between shrink-0 text-xs">
            <span className="font-extrabold text-purple-900 text-[11px] flex items-center gap-1">
              <span>{CATEGORY_TABS.find((t) => t.id === selectedCategory)?.emoji}</span>
              Top 10 {CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label}
            </span>
            <span className="text-[10px] font-semibold text-purple-600">
              {currentCreators.length === 0 ? 'Starting Fresh · 0 Posts' : `Updated Live · ${currentCreators.length} Featured`}
            </span>
          </div>

          {/* RANK SWITCHER BAR (1, 2, 3... 10 and All 10 Feed toggle) - Shown when posts exist */}
          {currentCreators.length > 0 && (
            <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 shadow-2xs sticky top-0 z-10">
            {/* All 10 Feed button */}
            <button
              onClick={() => {
                setSelectedRank('all');
                document.getElementById('creator-rank-card-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                selectedRank === 'all'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="View All 10 Posts"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>All 10 Feed</span>
            </button>

            {/* Buttons 1, 2, 3 ... 10 where the buttons ARE them */}
            {currentCreators.map((creator) => {
              const isSelected = selectedRank === creator.rank;
              return (
                <button
                  key={creator.rank}
                  onClick={() => {
                    setSelectedRank(creator.rank);
                    const el = document.getElementById(`creator-rank-card-${creator.rank}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? creator.rank === 1
                        ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/50 shadow-xs'
                        : creator.rank === 2
                        ? 'bg-slate-100 border-slate-400 text-slate-900 ring-2 ring-slate-300 shadow-xs'
                        : creator.rank === 3
                        ? 'bg-amber-50/70 border-amber-600 text-amber-900 ring-2 ring-amber-600/40 shadow-xs'
                        : 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-400/40 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  title={`Jump to #${creator.rank}: ${creator.name}`}
                >
                  {/* Rank Number Badge */}
                  <span
                    className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${getRankBadgeStyle(creator.rank).badge}`}
                  >
                    {creator.rank}
                  </span>

                  {/* Creator Mini Profile Pic */}
                  <div className="relative shrink-0">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full ${creator.avatarBg} text-white font-black text-[9.5px] flex items-center justify-center shadow-2xs`}
                      >
                        {creator.avatarInitial}
                      </div>
                    )}
                    {creator.rank === 1 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none">👑</span>
                    )}
                    {creator.rank === 2 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none">🥈</span>
                    )}
                    {creator.rank === 3 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none">🥉</span>
                    )}
                  </div>

                  {/* Creator Name */}
                  <span className="text-xs font-extrabold max-w-[80px] truncate leading-tight">
                    {creator.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          )}

          {/* CONTINUOUS SCROLLABLE CREATORS FEED (Posts Fully Displayed) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4 scrollbar-thin">
            {currentCreators.length === 0 ? (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs my-auto">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center mb-4 shadow-2xs ring-8 ring-purple-50/70">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-[17px] font-black text-slate-900 mb-1 tracking-tight">
                  Start Fresh
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                  All previous posts have been removed from this screen. You are ready to start fresh! Share your first creation to kick off the new feed.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    onClick={() => {
                      if (!requireAuth('create a post')) return;
                      setShowCreatePostModal(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black rounded-full shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Post</span>
                  </button>
                  <button
                    onClick={() => setActiveNavIndex(0)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  >
                    Back to Feed
                  </button>
                </div>
              </div>
            ) : (
              currentCreators.map((person) => {
              const isSelected = selectedRank === person.rank;
              const postImg = getCreatorPostImage(person);
              const isLiked = !!likedCreatorPosts[person.rank];
              const honeyCount = honeyJarCounts[person.rank] || 0;
              const rankStyle = getRankBadgeStyle(person.rank);
              const tiedOpponent = currentCreators.find(
                (other) =>
                  other.name !== person.name &&
                  other.upvotes === person.upvotes &&
                  (other.rating ?? 9.0) === (person.rating ?? 9.0)
              );

              return (
                <div
                  key={person.name}
                  id={`creator-rank-card-${person.rank}`}
                  className="scroll-mt-3"
                >
                  {/* Rank Header Divider (In between posts: line with centered circle badge - Gold #1, Silver #2, Bronze #3, Red #4-10) */}
                  <div className="relative w-full flex items-center justify-center my-3.5 px-1">
                    {/* Horizontal Line (Thicker line) */}
                    <div className={`absolute inset-x-0 h-1 top-1/2 -translate-y-1/2 pointer-events-none rounded-full ${rankStyle.line}`} />

                    {/* Centered Circle with Bold Rank Number - fused directly into the horizontal lines with no white border */}
                    <div className={`relative z-10 w-8 h-8 rounded-full font-black flex items-center justify-center text-[15px] select-none shrink-0 ${rankStyle.circle}`}>
                      <span className="leading-none select-none">{person.rank}</span>
                    </div>
                  </div>

                  {/* Post Card */}
                  <div
                    className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                      isSelected
                        ? 'border-purple-400 ring-2 ring-purple-400/50 shadow-md'
                        : person.rank === 1
                        ? 'border-amber-300 ring-1 ring-amber-300/40 bg-gradient-to-b from-amber-50/15 via-white to-white'
                        : person.rank === 2
                        ? 'border-slate-300 ring-1 ring-slate-200'
                        : person.rank === 3
                        ? 'border-amber-700/30 ring-1 ring-amber-700/20'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Reaction Widget placed directly on top of the profile pic */}
                    {activePhoneReactionId === `person-${person.name}` && (
                      <div className="w-full flex justify-center py-2 bg-slate-50/70 border-b border-slate-100">
                        <PhoneReactionPopup
                          personName={person.name}
                          isTied={Boolean(tiedOpponent)}
                          tiedWith={tiedOpponent ? `${tiedOpponent.name} (${tiedOpponent.upvotes.toLocaleString()} likes · ${tiedOpponent.rating ?? 9.0}/10)` : undefined}
                          currentRank={person.rank}
                          initialLikes={person.phoneHandLikes || 0}
                          initialDislikes={person.phoneHandDislikes || 0}
                          onVote={(type, newLikes, newDislikes) => {
                            handleHandphoneTieBreakerVote(selectedCategory, person.name, type, newLikes, newDislikes);
                          }}
                        />
                      </div>
                    )}

                    {/* Tie-Breaker Active Banner if tied */}
                    {tiedOpponent && (
                      <div className="mx-3.5 my-2 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs flex items-center justify-between shadow-2xs animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                          <span className="truncate">
                            ⚡ Tied with <span className="underline decoration-amber-400 font-extrabold">{tiedOpponent.name}</span> ({person.upvotes.toLocaleString()} likes · {person.rating ?? 9.0}/10)
                          </span>
                        </div>
                        <button
                          onClick={() => handleTogglePhoneReaction(`person-${person.name}`)}
                          className="shrink-0 ml-2 px-2.5 py-0.5 text-[10.5px] font-black text-amber-900 bg-amber-200 hover:bg-amber-300 border border-amber-400 rounded-lg transition-colors cursor-pointer"
                        >
                          Break Tie
                        </button>
                      </div>
                    )}

                    {/* Phone Hand Likes / Leaderboard Rank Badge */}
                    {person.phoneHandLikes !== undefined && person.phoneHandLikes > 0 && (
                      <div className="mx-3.5 my-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border border-red-200 text-xs flex items-center justify-between shadow-2xs">
                        <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-red-700">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span>Phone Hand Likes: {person.phoneHandLikes} {person.phoneHandLikes === 1 ? 'like' : 'likes'}</span>
                        </span>
                        <span
                          className={`font-black text-xs px-2.5 py-0.5 rounded-md shadow-2xs ${
                            person.rank === 1
                              ? 'bg-amber-400 text-amber-950 font-black border border-amber-500'
                              : person.rank === 2
                              ? 'bg-slate-300 text-slate-900 border border-slate-400'
                              : person.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          Rank #{person.rank}
                        </span>
                      </div>
                    )}

                    {/* Broken Pencil Faceoff Battle Card attached on top of profile pic */}
                    {Boolean(openFaceoffPosts[`person-${person.name}`]) && (
                      <div className="w-full flex justify-center py-2 px-3 bg-white border-b border-slate-100">
                        <FaceoffBattleModal
                          onClose={() => handleCloseFaceoff(`person-${person.name}`)}
                          isLoggedIn={isLoggedIn}
                          onRequireAuth={requireAuth}
                        />
                      </div>
                    )}

                    {/* Post Author Header with Profile Picture */}
                    <div className="flex items-center justify-between p-3.5 pb-2.5 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {person.avatarUrl ? (
                          <img
                            src={person.avatarUrl}
                            alt={person.name}
                            onClick={() => handleTogglePhoneReaction(`person-${person.name}`)}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
                          />
                        ) : (
                          <div
                            onClick={() => handleTogglePhoneReaction(`person-${person.name}`)}
                            className={`w-10 h-10 rounded-full ${person.avatarBg} text-white font-black flex items-center justify-center text-sm shadow-xs ring-1 ring-purple-600/20 cursor-pointer hover:ring-purple-600/60 transition-all`}
                          >
                            {person.avatarInitial}
                          </div>
                        )}
                        {/* Rank badge directly on top of profile pic: Gold for 1, Silver for 2, Bronze for 3, Red for 4-10 */}
                        <div
                          className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] ${rankStyle.badge}`}
                          title={rankStyle.label}
                        >
                          {person.rank}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-xs text-slate-900 leading-tight truncate">
                            {person.name}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-tight truncate mt-0.5">
                          {person.handle} &middot; {person.role} {person.location ? `· ${person.location}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/90 px-2 py-0.5 rounded-full flex items-center gap-0.5" title="Community Rating">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 inline" />
                        {person.rating ?? 9.0}/10
                      </span>
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-100/80 px-2 py-0.5 rounded-full" title="Flame Likes">
                        {person.upvotes.toLocaleString()} likes
                      </span>
                      {Boolean(morphedPosts[`person-${person.name}`]) ? (
                        <div
                          onClick={() => handleToggleFaceoff(`person-${person.name}`)}
                          title="Click to toggle faceoff battle"
                          role="button"
                          tabIndex={0}
                          aria-label="Broken pencil faceoff battle"
                          className="cursor-pointer -translate-y-1 hover:opacity-80 transition-transform active:scale-95 flex items-center justify-center p-0"
                        >
                          <BrokenPencilIcon className="w-[56px] sm:w-[62px] h-auto" />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleFollow(selectedCategory, person.rank)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            person.isFollowing
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                          }`}
                        >
                          {person.isFollowing ? (
                            <>
                              <UserCheck className="w-3 h-3 text-purple-600" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 text-purple-200" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        aria-label="Options"
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <span className="text-base font-bold leading-none">&middot;&middot;&middot;</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Full Post Media Display */}
                  <div
                    onClick={() => setPreviewCreator(person)}
                    className="relative w-full min-h-[300px] max-h-[480px] bg-slate-950 overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={postImg}
                      alt={person.topPost.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full min-h-[300px] max-h-[480px] object-cover object-center group-hover:scale-101 transition-transform duration-300"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-black tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                        {person.topPost.tag || 'Top Post'}
                      </span>
                    </div>

                    {/* Audio pill */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white border border-white/20 shadow-xs">
                      <Music className="w-3 h-3 text-purple-300" />
                      <span className="text-[10px] font-bold">
                        {person.topPost.audioTitle || 'Original Audio'}
                      </span>
                    </div>
                  </div>

                  {/* 4. Action Button Row: Flame, Comment, Honeyjar, Phone Hand, Masked 2 Eyes, Long Gray Pill */}
                  <div className="flex items-end justify-between pt-2.5 pb-1 px-3.5 text-black border-t border-slate-100 bg-white">
                    {/* All icons grouped closely together on the left */}
                    <div className="flex items-end gap-1.5 sm:gap-2 min-w-0">
                      {/* Left 3 icons: Flame, Comment, Honeyjar (standard untouched spacing) */}
                      <div className="flex items-center gap-2.5 sm:gap-3.5 pb-0.5 shrink-0">
                        {/* 1. Flame Icon */}
                        <button
                          onClick={() => toggleLikedCreatorPost(person.rank)}
                          className="cursor-pointer transition-transform active:scale-90"
                          aria-label="Like post"
                          title="Flame Like"
                        >
                          <AeriFlameIcon
                            filled={isLiked}
                            className={`w-5.5 h-5.5 transition-colors ${
                              isLiked
                                ? 'text-[#FF6D00]'
                                : 'text-[#FF6D00] stroke-[1.8]'
                            }`}
                          />
                        </button>

                        {/* 2. Comment Icon */}
                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          className="cursor-pointer transition-transform active:scale-90 hover:opacity-75"
                          aria-label="Comments"
                          title="Comments"
                        >
                          <AeriCommentIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                        </button>

                        {/* 3. Honeyjar Icon (Fairy Pot) */}
                        <button
                          onClick={() => handleHoneyJarClick(person.rank)}
                          className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5 relative"
                          aria-label="Honey Jar / Fairy Pot"
                          title="Honey Jar"
                        >
                          <FairyPotIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                          {honeyCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-amber-400 text-amber-950 text-[9px] font-black px-1 rounded-full leading-none py-0.5 shadow-2xs">
                              +{honeyCount}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Pill & Two Icons column */}
                      <div className="flex flex-col items-start gap-1 min-w-0">
                        {/* Long gray pill like icon with "Send me message" */}
                        <button
                          onClick={() =>
                            handleOpenSendPersonMessage({
                              name: person.name,
                              handle: person.handle,
                              avatarUrl: person.avatarUrl,
                              avatarBg: person.avatarBg,
                              avatarInitial: person.avatarInitial,
                              city: person.location,
                            })
                          }
                          className="cursor-pointer px-2.5 sm:px-3 py-1 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-black hover:text-black rounded-full text-[10px] sm:text-[10.5px] font-semibold flex items-center justify-center gap-1 border border-slate-300 shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                          title={`Send ${person.name} message`}
                          aria-label="Send me message"
                        >
                          <AeriMessageBubbleIcon className="w-3.5 h-3.5 text-black shrink-0" color="#000000" />
                          <span className="text-black font-semibold">Send me message</span>
                        </button>

                        {/* Only those two icons moved slightly more to the right */}
                        <div className="flex items-center gap-2 ml-1 sm:ml-1.5">
                          {/* 4. Phone Hand Icon */}
                          <button
                            onClick={() => handleTogglePhoneReaction(`person-${person.name}`)}
                            className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                            title="Phone Hand"
                            aria-label="Smartphone"
                          >
                            <AeriHandPhoneIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                          </button>

                          {/* 5. Masked 2 Eyes Icon */}
                          <button
                            onClick={() => handleToggleInfluenceRating(`person-${person.name}`)}
                            className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                            aria-label="Masked 2 Eyes"
                            title="Masked 2 Eyes"
                          >
                            <AeriMaskedEyesIcon className="w-[30px] h-[21px] text-black shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Likes count on the right */}
                    <div className="pb-1 shrink-0 ml-1">
                      <span className="text-[11px] font-bold text-slate-500 tabular-nums shrink-0 whitespace-nowrap">
                        {(() => {
                          const base = parseInt(person.topPost.likes || '1', 10) || 1;
                          const total = isLiked ? Math.max(base, 1) : base;
                          return `${total} ${total === 1 ? 'like' : 'likes'}`;
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* 5. Full Post Writing & Caption */}
                  <div className="p-3.5 pt-1.5 pb-2 bg-white">
                    <div className="flex items-start gap-2">
                      {person.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.name}
                          className="w-5.5 h-5.5 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-purple-500/20"
                        />
                      ) : (
                        <div
                          className={`w-5.5 h-5.5 rounded-full ${person.avatarBg} text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          {person.avatarInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] leading-relaxed text-slate-800">
                          <span className="font-extrabold text-slate-900 mr-1.5">
                            {person.handle}
                          </span>
                          <span className="font-bold text-slate-900">{person.topPost.title}</span> — Created by <span className="font-extrabold text-slate-900">{person.name}</span> for Fairy {CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label} ranking (Rank #{person.rank}).
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[11px] font-bold text-purple-600">#{selectedCategory.replace('_', '')}</span>
                          <span className="text-[11px] font-bold text-purple-600">#top10</span>
                          <span className="text-[11px] font-bold text-purple-600">#rank{person.rank}</span>
                          <span className="text-[11px] font-bold text-purple-600">#fairysocial</span>
                        </div>

                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 mt-2 block cursor-pointer transition-colors"
                        >
                          View all {person.topPost.comments} comments &middot; Leave feedback
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Row: Fire Hydrant & Raygun (Where it was before) */}
                  <div className="flex items-center gap-4 px-3.5 pb-3 pt-1 border-t border-slate-100/80 shrink-0 bg-white">
                    <button
                      className="flex items-center justify-center transition-transform active:scale-90 hover:scale-105 cursor-pointer"
                      title="Fire Hydrant"
                      aria-label="Fire Hydrant"
                    >
                      <AeriHydrantIcon size={26} className="w-[26px] h-[35px] drop-shadow-2xs" />
                    </button>

                    <button
                      onClick={() => handleToggleRaygun(`person-${person.name}`, person.name, person.avatarUrl, person.handle)}
                      className="flex items-center justify-center text-slate-800 hover:text-black transition-transform active:scale-90 hover:opacity-80 hover:scale-105 cursor-pointer"
                      title="Raygun Arena (Verb / Adverb)"
                      aria-label="Raygun Arena Actions"
                    >
                      <AeriRaygunIcon className="w-8.5 h-8.5 text-slate-800 stroke-[1.3]" />
                    </button>
                  </div>

                  {/* Verb & Adverb Card placed down on post instead of modal */}
                  {activeRaygunPostId === `person-${person.name}` && (
                    <div className="w-full pt-1 pb-3 px-3.5 bg-white border-t border-slate-100 flex justify-start">
                      <RaygunActionModal
                        isOpen={true}
                        isInline={true}
                        targetPersonName={person.name}
                        targetPersonAvatar={person.avatarUrl}
                        onClose={() => setActiveRaygunPostId(null)}
                        onSelectVerb={() => {
                          setActiveRaygunPostId(null);
                          setRaygunTarget({ name: person.name, avatar: person.avatarUrl || '', handle: person.handle });
                          setShowPastChallengesModal(true);
                        }}
                        onSelectAdverb={() => {
                          setActiveRaygunPostId(null);
                          setRaygunTarget({ name: person.name, avatar: person.avatarUrl || '', handle: person.handle });
                          setShowChallengeModal(true);
                        }}
                      />
                    </div>
                  )}

                  {/* Influence Rating Card placed down on post instead of modal */}
                  {activeInfluenceRatingId === `person-${person.name}` && (
                    <div className="w-full pt-1 pb-3 px-3.5 bg-white border-t border-slate-100">
                      <InfluenceRatingModal
                        isOpen={true}
                        isInline={true}
                        targetName={person.name}
                        initialRating={person.rating || 8.9}
                        onClose={handleCloseInfluenceRating}
                        onRatingSubmit={(val) => {
                          handleRatingSubmitted(person.name, val);
                        }}
                        onRatingReset={() => {
                          handleRatingReset(person.name);
                        }}
                        onOpenStarStamps={() => {
                          setActiveInfluenceRatingId(null);
                          setStarStampsSearchQuery(person.name);
                          setShowStarStampsScreen(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
          </div>

          {/* Modal to Preview Creator's Post when tapped */}
          {previewCreator && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
              onClick={() => setPreviewCreator(null)}
            >
              <div
                className="w-full max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-2xl animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-[4/3] bg-slate-900">
                  <img
                    src={getCreatorPostImage(previewCreator)}
                    alt={previewCreator.topPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setPreviewCreator(null)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    Rank #{previewCreator.rank} &middot; {CATEGORY_TABS.find((t) => t.id === previewCreator.category)?.label}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-full ${previewCreator.avatarBg} text-white font-bold text-xs flex items-center justify-center overflow-hidden`}
                    >
                      {previewCreator.avatarUrl ? (
                        <img
                          src={previewCreator.avatarUrl}
                          alt={previewCreator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        previewCreator.avatarInitial
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        {previewCreator.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {previewCreator.handle} {previewCreator.location ? `· ${previewCreator.location}` : ''}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">
                    {previewCreator.topPost.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    {Boolean(morphedPosts['creator-preview']) ? (
                      <div
                        onClick={() => handleToggleFaceoff('creator-preview')}
                        title="Click to toggle faceoff battle"
                        role="button"
                        tabIndex={0}
                        aria-label="Broken pencil faceoff battle"
                        className="cursor-pointer -translate-y-1 hover:opacity-80 transition-transform active:scale-95 flex items-center justify-center p-0"
                      >
                        <BrokenPencilIcon className="w-[58px] sm:w-[64px] h-auto" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleToggleFollow(selectedCategory, previewCreator.rank)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                          previewCreator.isFollowing
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                        }`}
                      >
                        {previewCreator.isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-purple-200" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setPreviewCreator(null);
                        setActiveNavIndex(0);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-full cursor-pointer"
                    >
                      View on Feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: FAIRY CONTROL (5 INDEPENDENT SYSTEMS), DM PRIVACY & MATCHES */}
      {/* ========================================================================= */}
      {activeNavIndex === 2 && (
        <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
          {/* Sub-bar to switch between Fairy Control, DM Privacy, and Matches with horizontal scroll and fade */}
          <div className="relative w-full bg-white border-b border-slate-100 px-2 sm:px-3 py-1 flex items-center justify-between gap-1 shrink-0 overflow-hidden">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pr-6 min-w-0 flex-1">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => setControlSubTab('fairy-control')}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    controlSubTab === 'fairy-control'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fairy Control
                </button>
                <button
                  onClick={() => setControlSubTab('dm-control')}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    controlSubTab === 'dm-control'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  DM Privacy
                </button>
                <button
                  onClick={() => setControlSubTab('matches')}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                    controlSubTab === 'matches'
                      ? 'bg-black text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Integrity Score</span>
                </button>
              </div>
            </div>
            {/* Subtle right-edge fade indicator */}
            <div className="pointer-events-none absolute right-14 top-0 bottom-0 w-5 bg-gradient-to-l from-white to-transparent" />
            <button
              onClick={() => setActiveNavIndex(0)}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-900 px-1.5 py-0.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              Feed &rarr;
            </button>
          </div>

          <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden">
            {controlSubTab === 'fairy-control' ? (
              <FairyControl
                onBackToFeed={() => setActiveNavIndex(0)}
                onSwitchToDMs={() => setControlSubTab('dm-control')}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onRequireAuth={requireAuth}
                onOpenSignInModal={() => setShowSignInModal(true)}
              />
            ) : controlSubTab === 'dm-control' ? (
              <DMControl
                onBackToFeed={() => setActiveNavIndex(0)}
                onSwitchToFairyControl={() => setControlSubTab('fairy-control')}
              />
            ) : (
              <MatchesScreen
                onBackToFeed={() => {
                  setActiveNavIndex(0);
                  setControlSubTab('fairy-control');
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS SCREEN (FLAME ICON BESIDE GHOST ICON) */}
      {activeNavIndex === 3 && (
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 scrollbar-thin">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] to-amber-400 text-white flex items-center justify-center shadow-xs">
                <AeriFlameIcon filled className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-black text-sm text-slate-900 leading-tight">
                  Notifications
                </h2>
                <p className="text-[10px] font-semibold text-slate-400">
                  Activity, challenges, reactions & matches
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveNavIndex(0)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-full cursor-pointer transition-colors"
            >
              Feed
            </button>
          </div>

          {/* Notifications List */}
          <div className="p-3 sm:p-4 space-y-2.5 max-w-lg mx-auto w-full">
            {/* Notification Item 1 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs flex items-start gap-3 hover:border-slate-200 transition-colors">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF5722] flex items-center justify-center shrink-0 mt-0.5">
                <AeriFlameIcon filled className="w-4 h-4 text-[#FF5722]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 leading-snug">
                  <span className="font-extrabold text-slate-900">Allen Dharak</span> flamed your post with real-time feedback.
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">5 minutes ago</span>
              </div>
            </div>

            {/* Notification Item 2 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs flex items-start gap-3 hover:border-slate-200 transition-colors">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <AeriOneEyeGhostIcon className="w-4 h-4 text-purple-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 leading-snug">
                  <span className="font-extrabold text-slate-900">Gollumfairy</span> sent you a 98% compatibility connection request in <span className="font-bold text-purple-600">Fairy Control</span>.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      setShowMatchesScreen(true);
                      setActiveNavIndex(2);
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    View Match
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">22 minutes ago</span>
              </div>
            </div>

            {/* Notification Item 3 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs flex items-start gap-3 hover:border-slate-200 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <AeriMessageBubbleIcon size={16} className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 leading-snug">
                  <span className="font-extrabold text-slate-900">Kinetic</span> sent you a direct message from Kyoto.
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">1 hour ago</span>
              </div>
            </div>

            {/* Notification Item 4 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs flex items-start gap-3 hover:border-slate-200 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <FairyPotIcon size={16} className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 leading-snug">
                  <span className="font-extrabold text-slate-900">Karak</span> dropped a honey jar tip in your jar!
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE SCREEN (FAIRYPEDIA BIOGRAPHICAL ENCYCLOPEDIA + INSTAGRAM MULTI-POST GRID) */}
      {activeNavIndex === 4 && (
        <UserProfileScreen
          onBackToFeed={() => {
            setSelectedProfileUser(null);
            setActiveNavIndex(0);
          }}
          onOpenSendPersonMessage={handleOpenSendPersonMessage}
          onOpenStarStamps={() => setShowStarStampsScreen(true)}
          onOpenChallengeModal={() => setShowChallengeModal(true)}
          onOpenPastChallengesModal={() => setShowPastChallengesModal(true)}
          setRaygunTarget={setRaygunTarget}
          viewUser={selectedProfileUser}
          currentUser={currentUser || undefined}
          isLoggedIn={isLoggedIn}
          onRequireAuth={requireAuth}
          onClearViewUser={() => setSelectedProfileUser(null)}
          onOpenSettings={() => setShowSettingsScreen(true)}
          onLogout={() => {
            setCurrentUser(null);
            setIsLoggedOut(true);
            try {
              localStorage.removeItem('fairy_current_user');
            } catch (e) {}
            setActiveNavIndex(0);
            setTweetSuccessToast('Logged out. Support, Favorite, Trending, Loyalty, & Genre switches remain preserved.');
            setTimeout(() => setTweetSuccessToast(null), 3500);
          }}
        />

      )}
        </>
      )}

      {/* Bottom navigation bar (Pinned & ALWAYS visible at the bottom) */}
      <nav className="w-full border-t border-[#F1F5F9] bg-white px-4 py-2 shrink-0 flex items-center justify-around z-20">
        <button
          onClick={() => {
            setShowMatchesScreen(false);
            setShowNormalMessagesScreen(false);
            setShowStarStampsScreen(false);
            setTargetMessagePerson(null);
            setActiveNavIndex(0);
          }}
          aria-label="Home"
          className={`p-1.5 transition-colors cursor-pointer flex flex-col items-center ${
            !showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 0
              ? 'text-black'
              : 'text-[#94A3B8] hover:text-black'
          }`}
        >
          <Home className="w-[21px] h-[21px] stroke-[1.8]" />
        </button>

        <button
          onClick={() => {
            setShowMatchesScreen(false);
            setShowNormalMessagesScreen(false);
            setShowStarStampsScreen(false);
            setTargetMessagePerson(null);
            setActiveNavIndex(1);
          }}
          aria-label="Top 10 Creators"
          className={`p-1.5 transition-colors cursor-pointer relative flex flex-col items-center ${
            !showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 1
              ? 'text-black'
              : 'text-[#94A3B8] hover:text-black'
          }`}
          title="Top 10 People Leaderboard"
        >
          <AeriHorseIcon
            size={26}
            className="w-[26px] h-[26px] transition-transform active:scale-95"
            strokeWidth={!showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 1 ? 2.6 : 2.1}
          />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </button>

        {/* Tab 2: 3rd icon (FAIRY CONTROL & DM PRIVACY & MATCHES) */}
        <button
          onClick={() => {
            setShowMatchesScreen(false);
            setShowNormalMessagesScreen(false);
            setShowStarStampsScreen(false);
            setTargetMessagePerson(null);
            setActiveNavIndex(2);
            setIsDrawerOpen(false);
          }}
          aria-label="Fairy Control & Integrity Score"
          className={`p-1.5 transition-colors cursor-pointer relative flex flex-col items-center ${
            !showStarStampsScreen && (showMatchesScreen || (!showNormalMessagesScreen && activeNavIndex === 2))
              ? 'text-slate-900'
              : 'text-[#94A3B8] hover:text-slate-900'
          }`}
          title="FAIRY CONTROL, DM Privacy & Integrity Score"
        >
          <AeriOneEyeGhostIcon
            className={`w-[22px] h-[22px] transition-transform active:scale-95 ${
              !showStarStampsScreen && (showMatchesScreen || (!showNormalMessagesScreen && activeNavIndex === 2))
                ? 'stroke-[2.2] text-slate-900'
                : 'stroke-[1.8]'
            }`}
          />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        </button>

        <button
          onClick={() => {
            setShowMatchesScreen(false);
            setShowNormalMessagesScreen(false);
            setShowStarStampsScreen(false);
            setTargetMessagePerson(null);
            setActiveNavIndex(3);
          }}
          aria-label="Notifications"
          title="Notifications"
          className={`p-1.5 transition-all cursor-pointer flex flex-col items-center ${
            !showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 3
              ? 'scale-105 opacity-100 text-orange-500'
              : 'opacity-75 hover:opacity-100 text-[#94A3B8]'
          }`}
        >
          <AeriBellIcon
            size={25}
            className="w-[25px] h-[26px] transition-transform active:scale-95"
          />
        </button>

        <button
          onClick={() => {
            setShowMatchesScreen(false);
            setShowNormalMessagesScreen(false);
            setShowStarStampsScreen(false);
            setTargetMessagePerson(null);
            setSelectedProfileUser(null);
            setActiveNavIndex(4);
          }}
          aria-label="User profile"
          title="Profile"
          className={`p-1.5 transition-colors cursor-pointer flex flex-col items-center ${
            !showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 4
              ? 'text-black'
              : 'text-[#94A3B8] hover:text-black'
          }`}
        >
          <AeriProfileUserIcon
            size={24}
            className="w-[23px] h-[23px] transition-transform active:scale-95"
            strokeWidth={!showStarStampsScreen && !showMatchesScreen && !showNormalMessagesScreen && activeNavIndex === 4 ? 2.6 : 2.1}
          />
        </button>
      </nav>

      {/* Floating Honey Jar Icon (Pops up at far right like Twitter's feather/tweet icon when Nacho Cheese icon is clicked) */}
      {showFloatingHoneyJar && (
        <aside
          aria-label="Floating Honey Jar Action"
          className="fixed bottom-20 right-4 sm:right-6 z-40 animate-fabPop select-none"
        >
          {/* Main Floating Action Button (FAB) - Purple circle with white Honey Jar */}
          <button
            onClick={() => {
              if (!requireAuth('write and share a tweet')) return;
              setShowCreateTweetModal(true);
            }}
            aria-label="Honey Jar · Write and post"
            title="Honey Jar · Write and post"
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <FairyPotIcon size={20} className="w-5 h-5 text-white stroke-white stroke-[2.1]" />
          </button>
        </aside>
      )}

      {/* Create Tweet Modal (Allows writing and posting a Tweet that looks like Twitter) */}
      <CreateTweetModal
        isOpen={showCreateTweetModal}
        onClose={() => setShowCreateTweetModal(false)}
        onPublishTweet={handlePublishTweet}
        authorAvatar={currentUser && !isLoggedOut ? (currentUser.avatarUrl || '') : ''}
        authorName={currentUser && !isLoggedOut ? currentUser.name : (isLoggedIn ? "You" : "Anonymous User")}
        authorHandle={currentUser && !isLoggedOut ? currentUser.handle : (isLoggedIn ? "@user" : "@user")}
        genreEnabled={Boolean(fairySwitches.genre)}
      />

      {/* Create Post Modal (Allows posting video, pic, and writing) */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPublish={handlePublishPost}
        authorAvatar={currentUser && !isLoggedOut ? (currentUser.avatarUrl || '') : ''}
        authorName={currentUser && !isLoggedOut ? currentUser.name : (isLoggedIn ? "You" : "Anonymous User")}
        authorHandle={currentUser && !isLoggedOut ? currentUser.handle : (isLoggedIn ? "@user" : "@user")}
        genreEnabled={Boolean(fairySwitches.genre)}
      />

      {/* Raygun Action Modals (Verb: Past Challenges / Adverb: Challenge Person to Online Fight) */}
      {raygunTarget && (
        <>
          <PastChallengesModal
            isOpen={showPastChallengesModal}
            onClose={() => setShowPastChallengesModal(false)}
            personName={raygunTarget.name}
            personAvatar={raygunTarget.avatar}
          />

          <ChallengePostModal
            isOpen={showChallengeModal}
            onClose={() => setShowChallengeModal(false)}
            opponentName={raygunTarget.name}
            opponentHandle={raygunTarget.handle}
            opponentAvatar={raygunTarget.avatar}
            currentUser={{
              name: currentUser && !isLoggedOut ? currentUser.name : 'You',
              handle: currentUser && !isLoggedOut ? currentUser.handle : '@user',
              avatar: currentUser && !isLoggedOut ? (currentUser.avatarUrl || '') : '',
            }}
            onPublishChallenge={handlePublishChallenge}
          />
        </>
      )}

      {/* User Search Modal (Search any user from top header search icon) */}
      <UserSearchModal
        isOpen={showUserSearchModal}
        onClose={() => setShowUserSearchModal(false)}
        isLoggedIn={isLoggedIn}
        onRequireAuth={requireAuth}
        onSelectUserToMessage={(user) => {
          setTargetMessagePerson({
            id: user.id,
            name: user.name,
            handle: user.handle,
            avatarUrl: user.avatarUrl,
          });
          setShowNormalMessagesScreen(true);
        }}
        onViewUserProfile={(user) => {
          setSelectedProfileUser(user);
          setShowUserSearchModal(false);
          setActiveNavIndex(4);
        }}
      />

      {/* Sign In Required Pop Up (Alerts unauthenticated visitors to sign in first) */}
      <SignInRequiredModal
        isOpen={showSignInRequiredModal}
        onClose={() => setShowSignInRequiredModal(false)}
        actionName={authPromptAction}
        onOpenSignInModal={() => setShowSignInModal(true)}
        onQuickSignIn={handleQuickSignInGollumfairy}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('fairy_current_user', JSON.stringify(user));
          } catch (e) {}
          setIsLoggedOut(false);
          setSelectedProfileUser(null);
          setTweetSuccessToast(`Logged in as registered user: ${user.handle}`);
          setTimeout(() => {
            setTweetSuccessToast(null);
          }, 3000);
        }}
      />

      {/* GitHub & Supabase Sync Modal */}
      <GitHubSyncModal
        isOpen={showGitHubSyncModal}
        onClose={() => setShowGitHubSyncModal(false)}
      />


      {/* FAIRY Settings Screen */}
      {showSettingsScreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
          <SettingsScreen
            onBack={() => setShowSettingsScreen(false)}
            onOpenDMControl={() => {
              setShowSettingsScreen(false);
              setActiveNavIndex(2);
              setControlSubTab('dm-control');
            }}
            onLogout={() => {
              setShowSettingsScreen(false);
              setCurrentUser(null);
              setIsLoggedOut(true);
              try {
                localStorage.removeItem('fairy_current_user');
              } catch (e) {}
              setActiveNavIndex(0);
            }}
            onOpenGitHubSync={() => {
              setShowGitHubSyncModal(true);
            }}
            onUpdateUser={(updated) => {
              setCurrentUser((prev) =>
                prev ? { ...prev, ...updated } : { ...updated, location: 'Global' }
              );
              setSelectedProfileUser(null);
            }}
            currentUser={currentUser || undefined}
          />
        </div>
      )}

      {/* Full Picture Lightbox Modal */}
      {fullscreenMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 animate-fadeIn"
          onClick={() => setFullscreenMediaUrl(null)}
        >
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setFullscreenMediaUrl(null)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Close full picture"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={getSafeMediaUrl(fullscreenMediaUrl)}
              alt="Full picture view"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
              }}
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
