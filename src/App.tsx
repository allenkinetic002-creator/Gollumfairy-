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
import { FaceoffBattleModal } from './components/FaceoffBattleModal';
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
import { SignInModal } from './components/SignInModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { syncActivityToRepo, subscribeToSyncStatus, SyncStatus } from './lib/repoSync';


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
  tieBreakerScore?: number;
  tieBreakerLikes?: number;
  tieBreakerDislikes?: number;
  isUpvoted: boolean;
  isFollowing: boolean;
  category: 'new_artists' | 'comedians' | 'photographers' | 'character_designers' | 'us_top' | 'innovators';
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
    id: '1',
    username: 'maya_sky',
    avatarBg: 'bg-amber-500',
    avatarText: 'M',
    text: 'Where is that yellow coat from?! The lighting is immaculate 💛',
    time: '2h',
    likes: 42,
    isLiked: false,
  },
  {
    id: '2',
    username: 'alexander_v',
    avatarBg: 'bg-indigo-500',
    avatarText: 'A',
    text: "Fairy's feed algorithm is getting so good honestly 🔥",
    time: '4h',
    likes: 19,
    isLiked: true,
  },
  {
    id: '3',
    username: 'jordan.create',
    avatarBg: 'bg-emerald-500',
    avatarText: 'J',
    text: 'The bokeh depth in this shot is absolute perfection 🤌✨',
    time: '5h',
    likes: 8,
    isLiked: false,
  },
  {
    id: '4',
    username: 'charlie_lens',
    avatarBg: 'bg-rose-500',
    avatarText: 'C',
    text: 'Need this camera setting and color grading preset ASAP!',
    time: '6h',
    likes: 5,
    isLiked: false,
  },
];

// Rich datasets for all 6 categories requested by user
const ALL_TOP_CREATORS: Record<string, Creator[]> = {
  new_artists: [
    {
      rank: 1,
      name: 'Elena Rostova',
      handle: '@elena_art',
      avatarUrl: elenaAvatar,
      avatarBg: 'bg-amber-500',
      avatarInitial: 'E',
      role: 'Debut Oil & Mixed Media',
      location: 'Berlin / NYC',
      upvotes: 100,
      rating: 9.0,
      tieBreakerScore: 0,
      isUpvoted: false,
      isFollowing: true,
      category: 'new_artists',
      topPost: {
        title: 'Twilight Pavilion — Light & brutalist geometry',
        imageUrl: topPostPhoto,
        gradientBg: 'from-amber-600 to-indigo-900',
        likes: '100',
        comments: '640',
        hasAudio: true,
        audioTitle: 'Solitude Ambient No. 4',
        tag: 'Exhibition',
      },
    },
    {
      rank: 2,
      name: 'Milo Sterling',
      handle: '@milo_sculpt',
      avatarBg: 'bg-purple-600',
      avatarInitial: 'M',
      role: 'Kinetic Glass & Resin',
      upvotes: 100,
      rating: 9.0,
      tieBreakerScore: 0,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Refracting Sunset Through 40 Hand-blown Spheres',
        gradientBg: 'from-purple-700 via-pink-600 to-amber-500',
        likes: '9.8k',
        comments: '430',
        tag: 'Sculpture',
      },
    },
    {
      rank: 3,
      name: 'Sora Takahashi',
      handle: '@sora_canvas',
      avatarBg: 'bg-sky-600',
      avatarInitial: 'S',
      role: 'Neo-Tokyo Acrylic Murals',
      upvotes: 38100,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: '60ft Wall in Shibuya: Dragon of the Data Stream',
        gradientBg: 'from-blue-600 to-cyan-400',
        likes: '8.4k',
        comments: '390',
        tag: 'Mural',
      },
    },
    {
      rank: 4,
      name: 'Camille Laurent',
      handle: '@camille_gouache',
      avatarBg: 'bg-rose-500',
      avatarInitial: 'C',
      role: 'Botanical Gouache Studies',
      upvotes: 33400,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Midnight Orchids in Provence Gardens',
        gradientBg: 'from-emerald-700 to-rose-900',
        likes: '7.1k',
        comments: '280',
        tag: 'Gouache',
      },
    },
    {
      rank: 5,
      name: 'Arlo Vance',
      handle: '@arlo_ink',
      avatarBg: 'bg-stone-800',
      avatarInitial: 'A',
      role: 'Linocut & Hand-Press Prints',
      upvotes: 29800,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Sea of Thieves — 5-Layer Color Relief Print',
        gradientBg: 'from-stone-900 to-amber-800',
        likes: '6.5k',
        comments: '240',
      },
    },
    {
      rank: 6,
      name: 'Freja Lindholm',
      handle: '@freja_nordic',
      avatarBg: 'bg-teal-600',
      avatarInitial: 'F',
      role: 'Fjord Atmospheric Watercolors',
      upvotes: 26500,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Morning Fog Over Lofoten Peaks',
        gradientBg: 'from-teal-800 to-slate-900',
        likes: '5.9k',
        comments: '210',
      },
    },
    {
      rank: 7,
      name: 'Dante Ruiz',
      handle: '@dante_oil',
      avatarBg: 'bg-red-700',
      avatarInitial: 'D',
      role: 'Chiaroscuro Modern Portraiture',
      upvotes: 24100,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'The Alchemist in Modern Denim',
        gradientBg: 'from-red-900 via-amber-900 to-black',
        likes: '5.2k',
        comments: '195',
      },
    },
    {
      rank: 8,
      name: 'Tara Bell',
      handle: '@tara_ceramics',
      avatarBg: 'bg-amber-700',
      avatarInitial: 'T',
      role: 'Raku-Fired Organic Ceramics',
      upvotes: 21900,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Smoked Copper Lustre Vessels Series',
        gradientBg: 'from-amber-800 to-stone-950',
        likes: '4.7k',
        comments: '172',
      },
    },
    {
      rank: 9,
      name: 'Zephyr Cole',
      handle: '@zephyr_mixed',
      avatarBg: 'bg-indigo-700',
      avatarInitial: 'Z',
      role: 'Textured Resin & Gold Leaf',
      upvotes: 19400,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Celestial Tides: 24k Gold on Raw Linen',
        gradientBg: 'from-indigo-950 to-blue-800',
        likes: '4.1k',
        comments: '150',
      },
    },
    {
      rank: 10,
      name: 'Nina Kostova',
      handle: '@nina_expression',
      avatarBg: 'bg-violet-600',
      avatarInitial: 'N',
      role: 'Large Scale Colorfield Panels',
      upvotes: 17200,
      isUpvoted: false,
      isFollowing: false,
      category: 'new_artists',
      topPost: {
        title: 'Magenta Overcast at 6 AM',
        gradientBg: 'from-fuchsia-800 to-purple-950',
        likes: '3.6k',
        comments: '135',
      },
    },
  ],

  comedians: [
    {
      rank: 1,
      name: "Dave 'Dice' Miller",
      handle: '@dicemiller',
      avatarBg: 'bg-yellow-500',
      avatarInitial: 'D',
      role: 'Stand-up & Crowd Work Virtuoso',
      location: 'New York, NY',
      upvotes: 56400,
      isUpvoted: false,
      isFollowing: true,
      category: 'comedians',
      topPost: {
        title: "Why adults literally cannot make new friends after 25 😂",
        gradientBg: 'from-yellow-600 to-red-800',
        likes: '28.4k',
        comments: '1.4k',
        hasAudio: true,
        audioTitle: 'Comedy Cellar Live Tape',
        tag: 'Standup',
      },
    },
    {
      rank: 2,
      name: 'Samira Watts',
      handle: '@samiracomedy',
      avatarBg: 'bg-pink-600',
      avatarInitial: 'S',
      role: 'Observational Satire & Podcasts',
      upvotes: 49100,
      isUpvoted: true,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "My therapist said stop doomscrolling so now I doom-shop instead",
        gradientBg: 'from-pink-600 to-purple-900',
        likes: '22.1k',
        comments: '980',
        tag: 'Sketch',
      },
    },
    {
      rank: 3,
      name: 'Tyler Cruz',
      handle: '@tyler_punchlines',
      avatarBg: 'bg-emerald-600',
      avatarInitial: 'T',
      role: 'Everyday Absurdity & Roasts',
      location: 'Philadelphia, PA',
      upvotes: 43200,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "Airport TSA when you accidentally leave a half-full Poland Spring",
        gradientBg: 'from-emerald-700 to-cyan-900',
        likes: '19.8k',
        comments: '820',
        tag: 'Viral Clip',
      },
    },
    {
      rank: 4,
      name: 'Priya Patel',
      handle: '@priyastandup',
      avatarBg: 'bg-orange-600',
      avatarInitial: 'P',
      role: 'First-Gen Immigrant Stories',
      upvotes: 38500,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "Telling my parents I want to do stand-up instead of med school",
        gradientBg: 'from-orange-600 to-amber-900',
        likes: '17.3k',
        comments: '710',
      },
    },
    {
      rank: 5,
      name: 'Liam Brody',
      handle: '@brody_improv',
      avatarBg: 'bg-blue-600',
      avatarInitial: 'L',
      role: 'Crowd Work & Unscripted Chaos',
      location: 'Boston, MA',
      upvotes: 34100,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "Interviewing the couple in front row who met on Duolingo Klingon",
        gradientBg: 'from-blue-700 to-indigo-950',
        likes: '15.6k',
        comments: '640',
      },
    },
    {
      rank: 6,
      name: 'Chloe Sparks',
      handle: '@chloesparks',
      avatarBg: 'bg-purple-600',
      avatarInitial: 'C',
      role: 'Dating in 2026 Horror Parodies',
      location: 'Chicago, IL',
      upvotes: 30900,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "He said 'I don't believe in labels' so I put a label maker on his forehead",
        gradientBg: 'from-purple-600 to-fuchsia-900',
        likes: '14.2k',
        comments: '580',
      },
    },
    {
      rank: 7,
      name: 'Marcus Chen',
      handle: '@marcusjoke',
      avatarBg: 'bg-cyan-600',
      avatarInitial: 'M',
      role: 'Tech Worker Existential Dread',
      upvotes: 27800,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "Explaining to my grandmother what 'Cloud Solutions Architect' means",
        gradientBg: 'from-cyan-700 to-blue-900',
        likes: '12.9k',
        comments: '510',
      },
    },
    {
      rank: 8,
      name: "Sarah 'Sass' O'Neill",
      handle: '@sassoneill',
      avatarBg: 'bg-rose-600',
      avatarInitial: 'S',
      role: 'Dry Wit & Irish Irony',
      upvotes: 24500,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "My dog has better wellness perks than my corporate health insurance",
        gradientBg: 'from-rose-700 to-stone-900',
        likes: '11.4k',
        comments: '460',
      },
    },
    {
      rank: 9,
      name: 'Benny Blanco-style',
      handle: '@bennylaughs',
      avatarBg: 'bg-amber-600',
      avatarInitial: 'B',
      role: 'Musical Comedy & Song Parodies',
      upvotes: 22100,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "If Taylor Swift wrote songs about forgetting laundry in the washer",
        gradientBg: 'from-amber-600 to-orange-950',
        likes: '10.3k',
        comments: '410',
      },
    },
    {
      rank: 10,
      name: 'Zack & Zoe Duo',
      handle: '@zackandzoe',
      avatarBg: 'bg-teal-600',
      avatarInitial: 'Z',
      role: 'Rapid-fire Married Couple Skits',
      upvotes: 19800,
      isUpvoted: false,
      isFollowing: false,
      category: 'comedians',
      topPost: {
        title: "Deciding what to eat for dinner: A 5-act Shakespearean tragedy",
        gradientBg: 'from-teal-700 to-slate-900',
        likes: '9.1k',
        comments: '370',
      },
    },
  ],

  photographers: [
    {
      rank: 1,
      name: 'Marcus Vance',
      handle: '@marcus_vision',
      avatarBg: 'bg-indigo-600',
      avatarInitial: 'M',
      role: '35mm Film & Golden Hour Master',
      location: 'Austin, TX',
      upvotes: 52100,
      isUpvoted: true,
      isFollowing: true,
      category: 'photographers',
      topPost: {
        title: 'Golden Hour Drift in Desert Sand (Kodak Portra 400)',
        imageUrl: postImage,
        gradientBg: 'from-amber-500 to-teal-800',
        likes: '24.8k',
        comments: '812',
        hasAudio: true,
        audioTitle: 'Desert Wind Ambient',
        tag: 'Analog Film',
      },
    },
    {
      rank: 2,
      name: 'Alex Morgan',
      handle: '@amorgan_lens',
      avatarBg: 'bg-blue-600',
      avatarInitial: 'A',
      role: 'Cyberpunk Cyber-Street & Neon',
      location: 'Tokyo / SF',
      upvotes: 46800,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Rain-soaked Neon Crosswalk in Shinjuku at 3 AM',
        imageUrl: topPostPhoto,
        gradientBg: 'from-cyan-600 to-indigo-900',
        likes: '21.5k',
        comments: '740',
        tag: 'Night City',
      },
    },
    {
      rank: 3,
      name: 'Liam O’Connor',
      handle: '@liam_wander',
      avatarBg: 'bg-cyan-700',
      avatarInitial: 'L',
      role: 'Nordic Explorer & Glacial Drone',
      location: 'Reykjavik',
      upvotes: 41900,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Sub-Zero Fjord Ice Reflections under Aurora Borealis',
        gradientBg: 'from-cyan-600 to-blue-950',
        likes: '18.9k',
        comments: '630',
        tag: 'Landscape',
      },
    },
    {
      rank: 4,
      name: 'Noor Al-Mansoor',
      handle: '@noor_stories',
      avatarBg: 'bg-emerald-600',
      avatarInitial: 'N',
      role: 'Middle Eastern Cultural Documentary',
      location: 'Dubai / Cairo',
      upvotes: 37400,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Historic Quarters at Twilight: Shadows and Frankincense',
        gradientBg: 'from-emerald-700 to-teal-950',
        likes: '16.4k',
        comments: '520',
      },
    },
    {
      rank: 5,
      name: 'Maya Chen',
      handle: '@mayachen_photo',
      avatarBg: 'bg-stone-700',
      avatarInitial: 'M',
      role: 'Monochrome Architectural Geometry',
      location: 'Chicago, IL',
      upvotes: 33800,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Brutalist Curves in Black & White: Concrete Sonata',
        gradientBg: 'from-stone-800 to-black',
        likes: '14.8k',
        comments: '460',
      },
    },
    {
      rank: 6,
      name: 'Julian Rossi',
      handle: '@rossi_street',
      avatarBg: 'bg-amber-600',
      avatarInitial: 'J',
      role: 'Italian Neorealist Street Life',
      location: 'Naples, Italy',
      upvotes: 30200,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Vespa Mechanics Arguing in Alleyway Golden Mist',
        gradientBg: 'from-amber-700 to-orange-950',
        likes: '13.1k',
        comments: '410',
      },
    },
    {
      rank: 7,
      name: 'Hannah Berg',
      handle: '@hannah_wild',
      avatarBg: 'bg-emerald-800',
      avatarInitial: 'H',
      role: 'Endangered Wildlife Conservation',
      location: 'Kenya / Norway',
      upvotes: 27100,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Snow Leopard Mother and Cub in Himalayan Blizzard',
        gradientBg: 'from-emerald-900 to-slate-950',
        likes: '11.8k',
        comments: '380',
      },
    },
    {
      rank: 8,
      name: 'Diego Alvarez',
      handle: '@diego_film',
      avatarBg: 'bg-red-600',
      avatarInitial: 'D',
      role: 'Medium Format Cuban Portraits',
      location: 'Havana',
      upvotes: 24300,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Hasselblad 500C: The Rooftop Cigar Craftsman',
        gradientBg: 'from-red-800 to-amber-950',
        likes: '10.5k',
        comments: '340',
      },
    },
    {
      rank: 9,
      name: 'Zoe Analog',
      handle: '@zoe_analog',
      avatarBg: 'bg-fuchsia-600',
      avatarInitial: 'Z',
      role: 'Harsh Flash & Rave Culture',
      location: 'London',
      upvotes: 21900,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Basslines in the Basement: 28mm Direct Flash',
        gradientBg: 'from-fuchsia-900 to-black',
        likes: '9.4k',
        comments: '310',
      },
    },
    {
      rank: 10,
      name: 'Finn Taylor',
      handle: '@finn_aerial',
      avatarBg: 'bg-blue-800',
      avatarInitial: 'F',
      role: 'High-Altitude Volcanic Survey',
      location: 'New Zealand',
      upvotes: 19500,
      isUpvoted: false,
      isFollowing: false,
      category: 'photographers',
      topPost: {
        title: 'Active Crater Ridge at Sunrise: Sulfur & Clouds',
        gradientBg: 'from-blue-900 to-orange-950',
        likes: '8.7k',
        comments: '290',
      },
    },
  ],

  character_designers: [
    {
      rank: 1,
      name: 'Jin Kazama-art',
      handle: '@jin_concept',
      avatarBg: 'bg-red-600',
      avatarInitial: 'J',
      role: 'Cyberpunk & Mecha Character Lead',
      upvotes: 54800,
      isUpvoted: false,
      isFollowing: true,
      category: 'character_designers',
      topPost: {
        title: 'Cyberpunk Ronin & Exo-Katana Full Character Sheet',
        imageUrl: charDesignPhoto,
        gradientBg: 'from-red-600 to-indigo-900',
        likes: '25.6k',
        comments: '1.1k',
        tag: 'Model Sheet',
      },
    },
    {
      rank: 2,
      name: 'Aria Creature',
      handle: '@aria_creature',
      avatarBg: 'bg-purple-600',
      avatarInitial: 'A',
      role: 'Mythical Chimera & Studio Ghibli Style',
      upvotes: 48900,
      isUpvoted: true,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Forest Spirit of the Lost Constellations (Turnaround)',
        gradientBg: 'from-purple-600 via-pink-700 to-amber-400',
        likes: '22.4k',
        comments: '890',
        tag: 'Creature Design',
      },
    },
    {
      rank: 3,
      name: 'Devontae Cole',
      handle: '@dcole_motion',
      avatarBg: 'bg-blue-600',
      avatarInitial: 'D',
      role: 'Sci-Fi Combat Suit & Hard Surface',
      upvotes: 43700,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Deep Void Salvage Specialist Armor Design',
        gradientBg: 'from-blue-700 to-cyan-900',
        likes: '19.2k',
        comments: '760',
      },
    },
    {
      rank: 4,
      name: 'Lyra Sterling',
      handle: '@lyra_anime',
      avatarBg: 'bg-pink-500',
      avatarInitial: 'L',
      role: 'Fantasy RPG Hero Party Lineup',
      upvotes: 39100,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'The Alchemist Princess & Her Clockwork Familiar',
        gradientBg: 'from-pink-600 to-rose-900',
        likes: '17.1k',
        comments: '640',
      },
    },
    {
      rank: 5,
      name: 'Rex Holloway',
      handle: '@rexholloway',
      avatarBg: 'bg-amber-700',
      avatarInitial: 'R',
      role: 'Post-Apocalyptic Scavenger Costumes',
      upvotes: 35200,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Scrap-Armor Nomad Clan: Weapon & Gear Breakdown',
        gradientBg: 'from-amber-700 to-stone-900',
        likes: '15.3k',
        comments: '580',
      },
    },
    {
      rank: 6,
      name: 'Yuki Matsuoka',
      handle: '@yuki_mech',
      avatarBg: 'bg-teal-600',
      avatarInitial: 'Y',
      role: 'Modular Android Police Unit Design',
      upvotes: 31600,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Autonomous Enforcer Unit 09: Facial Expressions',
        gradientBg: 'from-teal-700 to-blue-950',
        likes: '13.8k',
        comments: '510',
      },
    },
    {
      rank: 7,
      name: 'Tanya Petrova',
      handle: '@tanya_fantasy',
      avatarBg: 'bg-emerald-700',
      avatarInitial: 'T',
      role: 'Dark Slavic Folklore Creatures',
      upvotes: 28400,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Baba Yaga in 2099: Cyber-Hut on Hydraulic Legs',
        gradientBg: 'from-emerald-800 to-stone-950',
        likes: '12.1k',
        comments: '460',
      },
    },
    {
      rank: 8,
      name: 'Caleb Shaw',
      handle: '@cshaw_pixel',
      avatarBg: 'bg-indigo-600',
      avatarInitial: 'C',
      role: '16-bit RPG Pixel Bosses & Animations',
      upvotes: 25300,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Pixel Dragon of Iron Mountain: 12-Frame Sprite Sheet',
        gradientBg: 'from-indigo-700 to-purple-950',
        likes: '10.9k',
        comments: '410',
      },
    },
    {
      rank: 9,
      name: 'Mira Vance',
      handle: '@mira_creatures',
      avatarBg: 'bg-cyan-600',
      avatarInitial: 'M',
      role: 'Deep Abyss Bioluminescent Humanoids',
      upvotes: 22800,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Abyssal Trench Siren: Phosphorescent Skin Texture',
        gradientBg: 'from-cyan-700 to-slate-950',
        likes: '9.8k',
        comments: '360',
      },
    },
    {
      rank: 10,
      name: 'Boris Wolfe',
      handle: '@boris_villains',
      avatarBg: 'bg-slate-700',
      avatarInitial: 'B',
      role: 'Dieselpunk Villain & Airship Commanders',
      upvotes: 20100,
      isUpvoted: false,
      isFollowing: false,
      category: 'character_designers',
      topPost: {
        title: 'Grand Admiral Vane: Heavy Trenchcoat & Bionic Monocle',
        gradientBg: 'from-slate-800 to-black',
        likes: '8.9k',
        comments: '320',
      },
    },
  ],

  us_top: [
    {
      rank: 1,
      name: 'Elena Rostova',
      handle: '@elena_art',
      avatarUrl: elenaAvatar,
      avatarBg: 'bg-amber-500',
      avatarInitial: 'E',
      role: 'Creative Director',
      location: 'Los Angeles, CA',
      upvotes: 48290,
      isUpvoted: false,
      isFollowing: true,
      category: 'us_top',
      topPost: {
        title: 'Twilight Pavilion in Joshua Tree',
        imageUrl: topPostPhoto,
        gradientBg: 'from-amber-600 to-indigo-900',
        likes: '12.4k',
        comments: '640',
        tag: 'LA Arts',
      },
    },
    {
      rank: 2,
      name: 'Marcus Vance',
      handle: '@marcus_vision',
      avatarBg: 'bg-indigo-600',
      avatarInitial: 'M',
      role: 'Cinematographer & 35mm',
      location: 'Austin, TX',
      upvotes: 39710,
      isUpvoted: true,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Golden Hour Drift in Desert Sand',
        imageUrl: postImage,
        gradientBg: 'from-amber-500 to-teal-800',
        likes: '10.8k',
        comments: '812',
        tag: 'Austin Film',
      },
    },
    {
      rank: 3,
      name: "Dave 'Dice' Miller",
      handle: '@dicemiller',
      avatarBg: 'bg-yellow-500',
      avatarInitial: 'D',
      role: 'Comedy Cellar Resident',
      location: 'New York, NY',
      upvotes: 37400,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Late Night Sets in Greenwich Village',
        gradientBg: 'from-yellow-600 to-red-800',
        likes: '9.6k',
        comments: '710',
        tag: 'NYC Comedy',
      },
    },
    {
      rank: 4,
      name: 'Sofia Morales',
      handle: '@sofia_vibes',
      avatarBg: 'bg-rose-500',
      avatarInitial: 'S',
      role: 'Streetwear & Art Director',
      location: 'Miami, FL',
      upvotes: 34200,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Art Basel Runway: Ochre & Terracotta Drop',
        gradientBg: 'from-orange-500 to-rose-700',
        likes: '8.8k',
        comments: '580',
        tag: 'Miami Fashion',
      },
    },
    {
      rank: 5,
      name: 'Devontae Cole',
      handle: '@dcole_motion',
      avatarBg: 'bg-blue-600',
      avatarInitial: 'D',
      role: 'Generative 3D Artist',
      location: 'Atlanta, GA',
      upvotes: 31500,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Atlanta Creative Tech: Gravity Disconnect',
        gradientBg: 'from-blue-600 to-cyan-900',
        likes: '7.9k',
        comments: '490',
        tag: 'ATL Tech',
      },
    },
    {
      rank: 6,
      name: 'Kai Takahashi',
      handle: '@kai_minimal',
      avatarBg: 'bg-slate-800',
      avatarInitial: 'K',
      role: 'Typographer & UI Architect',
      location: 'San Francisco, CA',
      upvotes: 28900,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'SF Modernism: Fog & Raw Concrete',
        gradientBg: 'from-slate-700 to-slate-950',
        likes: '7.2k',
        comments: '410',
      },
    },
    {
      rank: 7,
      name: 'Chloe Sparks',
      handle: '@chloesparks',
      avatarBg: 'bg-purple-600',
      avatarInitial: 'C',
      role: 'The Second City Comedian',
      location: 'Chicago, IL',
      upvotes: 26100,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Winter Survival Guide for Midwesterners',
        gradientBg: 'from-purple-600 to-fuchsia-900',
        likes: '6.5k',
        comments: '370',
      },
    },
    {
      rank: 8,
      name: 'Zephyr Cole',
      handle: '@zephyr_mixed',
      avatarBg: 'bg-emerald-700',
      avatarInitial: 'Z',
      role: 'Timber & Gold Artisan',
      location: 'Seattle, WA',
      upvotes: 23400,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Pacific Rain Cedar Carvings Volume 4',
        gradientBg: 'from-emerald-800 to-teal-950',
        likes: '5.8k',
        comments: '320',
      },
    },
    {
      rank: 9,
      name: 'Tyler Cruz',
      handle: '@tyler_punchlines',
      avatarBg: 'bg-orange-600',
      avatarInitial: 'T',
      role: 'Comedy Podcaster',
      location: 'Philadelphia, PA',
      upvotes: 21200,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Rittenhouse Square Crowd Roast Special',
        gradientBg: 'from-orange-600 to-amber-900',
        likes: '5.1k',
        comments: '290',
      },
    },
    {
      rank: 10,
      name: 'Liam Brody',
      handle: '@brody_improv',
      avatarBg: 'bg-blue-700',
      avatarInitial: 'L',
      role: 'Improv Coach & Creator',
      location: 'Boston, MA',
      upvotes: 18900,
      isUpvoted: false,
      isFollowing: false,
      category: 'us_top',
      topPost: {
        title: 'Boston Theater District Pop-up Show',
        gradientBg: 'from-blue-700 to-slate-900',
        likes: '4.6k',
        comments: '260',
      },
    },
  ],

  innovators: [
    {
      rank: 1,
      name: 'Dr. Aris Thorne',
      handle: '@aris_neuro',
      avatarBg: 'bg-violet-700',
      avatarInitial: 'A',
      role: 'Brain-Computer Sound Synthesis',
      location: 'MIT Media Lab',
      upvotes: 100,
      rating: 9.0,
      tieBreakerScore: 0,
      isUpvoted: false,
      isFollowing: true,
      category: 'innovators',
      topPost: {
        title: 'Generating Ambient Harmonies from Real-Time Alpha Waves',
        imageUrl: topPostPhoto,
        gradientBg: 'from-violet-800 to-indigo-950',
        likes: '100',
        comments: '1.2k',
        hasAudio: true,
        audioTitle: 'Neural Frequency No. 7',
        tag: 'Neurotech',
      },
    },
    {
      rank: 2,
      name: 'Sarah Lin',
      handle: '@slin_quantum',
      avatarBg: 'bg-cyan-600',
      avatarInitial: 'S',
      role: 'WebGPU Quantum Visualizer',
      location: 'CERN / Stanford',
      upvotes: 100,
      rating: 9.0,
      tieBreakerScore: 0,
      isUpvoted: true,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Visualizing 64-Qubit Entanglement in 120 FPS WebAssembly',
        gradientBg: 'from-cyan-600 to-blue-900',
        likes: '100',
        comments: '890',
        tag: 'Quantum Tech',
      },
    },
    {
      rank: 3,
      name: 'Victor Sterling',
      handle: '@victor_haptics',
      avatarBg: 'bg-emerald-600',
      avatarInitial: 'V',
      role: 'Micro-Fluidic Haptic Textiles',
      location: 'Tokyo Tech',
      upvotes: 46200,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Gloves that Let You Feel Digital Textures Like Silk and Sandstone',
        gradientBg: 'from-emerald-700 to-teal-950',
        likes: '20.8k',
        comments: '780',
        tag: 'Haptics',
      },
    },
    {
      rank: 4,
      name: 'Amara Okafor',
      handle: '@amara_solar',
      avatarBg: 'bg-amber-600',
      avatarInitial: 'A',
      role: 'Transparent Perovskite Glass',
      location: 'Cambridge',
      upvotes: 42100,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Skyscraper Windows that Generate 15% Power without Tint',
        gradientBg: 'from-amber-600 to-yellow-900',
        likes: '18.4k',
        comments: '670',
        tag: 'CleanTech',
      },
    },
    {
      rank: 5,
      name: 'Devontae Cole',
      handle: '@dcole_motion',
      avatarBg: 'bg-blue-600',
      avatarInitial: 'D',
      role: 'Neural Physics Engines',
      location: 'Atlanta',
      upvotes: 38600,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Zero-Compute Cloth Simulation Running on Mobile Web Browsers',
        gradientBg: 'from-blue-600 to-indigo-900',
        likes: '16.2k',
        comments: '580',
      },
    },
    {
      rank: 6,
      name: 'Dr. Kenji Sato',
      handle: '@kenji_biomimic',
      avatarBg: 'bg-stone-700',
      avatarInitial: 'K',
      role: 'Mycelium Self-Healing Bio-Concrete',
      location: 'Kyoto',
      upvotes: 34900,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Cracked Road Repairs Itself After 48h Rain Using Spore Network',
        gradientBg: 'from-stone-800 to-slate-950',
        likes: '14.5k',
        comments: '510',
      },
    },
    {
      rank: 7,
      name: 'Rachel Green-tech',
      handle: '@rachel_algae',
      avatarBg: 'bg-teal-600',
      avatarInitial: 'R',
      role: 'Bioluminescent Urban Light Columns',
      location: 'Amsterdam',
      upvotes: 31200,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Zero-Electricity Park Illumination via Genetically Tuned Algae',
        gradientBg: 'from-teal-700 to-emerald-950',
        likes: '13.1k',
        comments: '460',
      },
    },
    {
      rank: 8,
      name: 'Theo Kinetic',
      handle: '@theo_kinetic',
      avatarBg: 'bg-orange-700',
      avatarInitial: 'T',
      role: 'Wind-Propelled Mechanical Automata',
      location: 'The Hague',
      upvotes: 27800,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Giant 40-Legged Beach Walker Built Entirely of Recycled PVC',
        gradientBg: 'from-orange-700 to-amber-950',
        likes: '11.8k',
        comments: '410',
      },
    },
    {
      rank: 9,
      name: 'Mira Vance',
      handle: '@mira_audio_dsp',
      avatarBg: 'bg-purple-600',
      avatarInitial: 'M',
      role: 'Spatial Audio Raytracing on Edge Chips',
      location: 'London',
      upvotes: 24700,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Full Acoustic Room Reverberation with 0.8ms Latency',
        gradientBg: 'from-purple-700 to-violet-950',
        likes: '10.3k',
        comments: '360',
      },
    },
    {
      rank: 10,
      name: 'Jax Cooper',
      handle: '@jax_exo',
      avatarBg: 'bg-slate-800',
      avatarInitial: 'J',
      role: 'Titanium SLS Pediatric Exoskeletons',
      location: 'Denver, CO',
      upvotes: 21900,
      isUpvoted: false,
      isFollowing: false,
      category: 'innovators',
      topPost: {
        title: 'Ultralight 2.2 lb Walking Assist for Children with Cerebral Palsy',
        gradientBg: 'from-slate-800 to-black',
        likes: '9.4k',
        comments: '330',
      },
    },
  ],
};

const CATEGORY_TABS = [
  { id: 'new_artists', label: 'New Artists', icon: Mic, emoji: '🎤' },
  { id: 'comedians', label: 'Comedians', icon: Laugh, emoji: '🎭' },
  { id: 'photographers', label: 'Photographers', icon: Camera, emoji: '📸' },
  { id: 'character_designers', label: 'Character Designers', icon: Gamepad2, emoji: '👾' },
  { id: 'us_top', label: 'Top 10 U.S.', icon: MapPin, emoji: '🇺🇸' },
  { id: 'innovators', label: 'Innovators', icon: Lightbulb, emoji: '💡' },
];

const CATEGORY_POST_IMAGES: Record<string, string[]> = {
  new_artists: [
    topPostPhoto,
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1572945758420-798858348ee1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
  ],
  comedians: [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
  ],
  photographers: [
    postImage,
    topPostPhoto,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
  ],
  character_designers: [
    charDesignPhoto,
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=1000&q=80',
  ],
  us_top: [
    topPostPhoto,
    postImage,
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  ],
  innovators: [
    topPostPhoto,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80',
  ],
};

function getCreatorPostImage(creator: Creator): string {
  if (creator.topPost.imageUrl) return creator.topPost.imageUrl;
  const list = CATEGORY_POST_IMAGES[creator.category];
  if (list && list[creator.rank - 1]) return list[creator.rank - 1];
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
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {}
    return {
      id: 'user-allen',
      name: 'Allen Dharak',
      handle: '@allenkinetic002-creator',
      email: 'allendharak9@gmail.com',
      location: 'London, UK',
      profession: 'Creative Developer & Founder',
      bio: 'Creative developer, founder & digital artist on Fairy. Building verified trust receipts and live social networks.',
    };
  });
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
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'tweet-initial-elena',
      authorName: 'Elena Vance',
      authorHandle: '@elena_aeri',
      authorAvatar: elenaAvatar,
      isVerified: false,
      timeAgo: '15m ago',
      isTweet: true,
      tweetContent: 'Working on new designs today. Excited to share what we have been building! What is everyone creating this weekend?',
      mediaType: 'tweet',
      caption: 'Working on new designs today.',
      tags: ['#design', '#creators', '#build'],
      audioTitle: 'Original Audio',
      likeCount: 342,
      isLiked: false,
      isTrending: true,
      retweetCount: 48,
      replyCount: 23,
      viewCount: '4.2K',
    },
    {
      id: 'post-default-elena',
      authorName: 'Elena Vance',
      authorHandle: '@elena_aeri',
      authorAvatar: elenaAvatar,
      isVerified: true,
      timeAgo: '2h ago',
      location: 'Kyoto, Japan',
      mediaType: 'image',
      mediaUrl: postImage,
      caption: 'Golden hour in the enchanted woods 🧚✨ Caught between autumn mist and warm amber light. Where should we wander next?',
      tags: ['#fairy', '#autumnlight', '#aeri', '#dreamscape'],
      audioTitle: 'Original Audio',
      likeCount: 2450,
      isLiked: false,
      isTrending: true,
    },
  ]);

  // Initialize Supabase backend sync and real-time listeners on mount
  useEffect(() => {
    initializeTrustReceiptsSync();
    initializeStarStampsSync();

    // Fetch any community posts from Supabase
    fetchRemotePosts().then((remotePosts) => {
      if (remotePosts && remotePosts.length > 0) {
        setFeedPosts((prev) => {
          const map = new Map<string, FeedPost>();
          // Put remote first
          remotePosts.forEach((r) => {
            map.set(r.id, {
              id: r.id,
              authorName: r.author_name,
              authorHandle: r.author_handle,
              authorAvatar: r.author_avatar || elenaAvatar,
              isVerified: !!r.is_verified,
              timeAgo: r.time_ago || 'Recent',
              location: r.location || undefined,
              mediaType: (r.media_type as any) || (r.is_tweet ? 'tweet' : 'image'),
              isTweet: r.is_tweet,
              tweetContent: r.tweet_content || undefined,
              mediaUrl: r.media_url || undefined,
              caption: r.caption || r.tweet_content || '',
              tags: r.tags || [],
              audioTitle: r.audio_title || 'Original Audio',
              likeCount: r.like_count ?? 0,
              isLiked: false,
              isTrending: true,
              retweetCount: r.retweet_count ?? 0,
              replyCount: r.reply_count ?? 0,
              viewCount: r.view_count || '1',
            });
          });
          // Add default local posts if not already present
          prev.forEach((p) => {
            if (!map.has(p.id)) {
              map.set(p.id, p);
            }
          });
          return Array.from(map.values());
        });
      }
    });
  }, []);

  const handlePublishTweet = (payload: NewTweetPayload) => {
    const newTweet: FeedPost = {
      id: 'tweet-' + Date.now(),
      authorName: currentUser?.name || 'Anonymous User',
      authorHandle: currentUser?.handle || '@user',
      authorAvatar: currentUser?.avatarUrl || elenaAvatar,
      isVerified: true,
      timeAgo: 'Just now',
      isTweet: true,
      tweetContent: payload.text,
      mediaType: payload.mediaUrl ? 'image' : 'tweet',
      mediaUrl: payload.mediaUrl,
      caption: payload.text,
      tags: payload.tags && payload.tags.length > 0 ? payload.tags : ['#creators', '#design'],
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
    const newPost: FeedPost = {
      id: 'post-' + Date.now(),
      authorName: currentUser?.name || 'Anonymous User',
      authorHandle: currentUser?.handle || '@user',
      authorAvatar: currentUser?.avatarUrl || elenaAvatar,
      isVerified: true,
      timeAgo: 'Just now',
      location: payload.location,
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl,
      caption: payload.caption,
      tags: payload.tags,
      audioTitle: payload.audioTitle,
      likeCount: 1,
      isLiked: true,
      isTrending: true,
      faceoffConfig: payload.faceoffConfig,
    };
    setFeedPosts((prev) => [newPost, ...prev]);

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
  };


  const handleTogglePostLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          syncActivityToRepo('like_post', `${nextLiked ? 'Liked' : 'Unliked'} post ${p.authorHandle}`);
          return {
            ...p,
            isLiked: nextLiked,
            likeCount: nextLiked ? p.likeCount + 1 : p.likeCount - 1,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('new_artists');
  const [selectedRank, setSelectedRank] = useState<number | 'all'>(1);
  const [creatorsData, setCreatorsData] = useState<Record<string, Creator[]>>(ALL_TOP_CREATORS);
  const [previewCreator, setPreviewCreator] = useState<Creator | null>(null);
  const [likedCreatorPosts, setLikedCreatorPosts] = useState<Record<number, boolean>>({});
  const [honeyJarCounts, setHoneyJarCounts] = useState<Record<number, number>>({});
  // Floating Honey Jar FAB state (triggered by clicking Nacho Cheese icon, pops up at bottom left like Twitter's feather icon)
  const [showFloatingHoneyJar, setShowFloatingHoneyJar] = useState(false);
  const [tieBreakerToast, setTieBreakerToast] = useState<string | null>(null);

  const toggleLikedCreatorPost = (rank: number) => {
    setLikedCreatorPosts((prev) => ({
      ...prev,
      [rank]: !prev[rank],
    }));
  };

  const handleHoneyJarClick = (rank: number) => {
    setHoneyJarCounts((prev) => ({
      ...prev,
      [rank]: (prev[rank] || 0) + 1,
    }));
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
    setActiveInfluenceRatingId((prev) => (prev === id ? null : id));
  };

  const handleCloseInfluenceRating = () => {
    setActiveInfluenceRatingId(null);
  };

  // Per-post broken pencil states to ensure each post is 100% independent (even from the same author)
  const [openFaceoffPosts, setOpenFaceoffPosts] = useState<Record<string, boolean>>({
    'post-default-elena': false,
  });
  const [morphedPosts, setMorphedPosts] = useState<Record<string, boolean>>({
    'post-default-elena': false,
  });

  const handleToggleFaceoff = (id: string) => {
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
    if (activeRaygunPostId === id) {
      setActiveRaygunPostId(null);
    } else {
      setActiveRaygunPostId(id);
      setRaygunTarget({
        name,
        avatar: avatar || elenaAvatar,
        handle: handle || '@creator',
      });
    }
  };

  const handlePublishChallenge = (payload: ChallengePostPayload) => {
    const isFromTweet = Boolean(challengeOriginTweetId);
    const newPostId = 'post-challenge-' + Date.now();
    const newPost: FeedPost = {
      id: newPostId,
      authorName: payload.challengerName,
      authorHandle: '@elena_aeri',
      authorAvatar: payload.challengerAvatar,
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
  };

  const handleTogglePhoneReaction = (id: string) => {
    setActivePhoneReactionId((prev) => (prev === id ? null : id));
  };

  const handleOpenSendPersonMessage = (person: TargetMessagePerson) => {
    setTargetMessagePerson(person);
    setShowNormalMessagesScreen(true);
    setShowMatchesScreen(false);
  };

  const currentCreators = creatorsData[selectedCategory] || creatorsData.new_artists;

  const handleToggleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isLiked;
          return {
            ...c,
            isLiked: next,
            likes: next ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleToggleUpvoteCreator = (categoryKey: string, rank: number) => {
    setCreatorsData((prev) => {
      const list = prev[categoryKey] || [];
      const updatedList = list.map((c) => {
        if (c.rank === rank) {
          const nextUpvoted = !c.isUpvoted;
          return {
            ...c,
            isUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? c.upvotes + 1 : c.upvotes - 1,
          };
        }
        return c;
      });
      return { ...prev, [categoryKey]: updatedList };
    });
  };

  const handleToggleFollow = (categoryKey: string, rank: number) => {
    setCreatorsData((prev) => {
      const list = prev[categoryKey] || [];
      const updatedList = list.map((c) => {
        if (c.rank === rank) {
          return {
            ...c,
            isFollowing: !c.isFollowing,
          };
        }
        return c;
      });
      return { ...prev, [categoryKey]: updatedList };
    });
  };

  // Handphone Tie-Breaker: Red button moves UP (+1), Blue button moves DOWN (-1)
  const handleHandphoneTieBreakerVote = (
    categoryKey: string,
    personName: string,
    voteType: 'like' | 'dislike',
    newVote: 'like' | 'dislike' | null
  ) => {
    setCreatorsData((prev) => {
      const list = (prev[categoryKey] || []).map((c) => ({ ...c }));
      const targetIndex = list.findIndex((c) => c.name === personName);
      if (targetIndex === -1) return prev;

      const target = list[targetIndex];
      const prevScore = target.tieBreakerScore || 0;
      let newScore = prevScore;

      if (voteType === 'like') {
        if (newVote === 'like') {
          // Upvote (+1 like)
          target.upvotes = (target.upvotes || 0) + 1;
          newScore += 1;
          target.tieBreakerLikes = (target.tieBreakerLikes || 0) + 1;
        } else {
          // Unvoted like (-1 like)
          target.upvotes = Math.max(0, (target.upvotes || 0) - 1);
          newScore -= 1;
          target.tieBreakerLikes = Math.max(0, (target.tieBreakerLikes || 0) - 1);
        }
      } else if (voteType === 'dislike') {
        if (newVote === 'dislike') {
          // Downvote: subtract a like (-1 like)
          target.upvotes = Math.max(0, (target.upvotes || 0) - 1);
          newScore -= 1;
          target.tieBreakerDislikes = (target.tieBreakerDislikes || 0) + 1;
        } else {
          // Unvoted dislike (+1 like)
          target.upvotes = (target.upvotes || 0) + 1;
          newScore += 1;
          target.tieBreakerDislikes = Math.max(0, (target.tieBreakerDislikes || 0) - 1);
        }
      }

      target.tieBreakerScore = newScore;
      list[targetIndex] = target;

      const oldRank = target.rank;

      // Re-sort creators by:
      // 1. upvotes DESC (so red button +1 moves UP, blue button -1 moves DOWN)
      // 2. rating DESC (e.g. 9.5 vs 9.0)
      // 3. tieBreakerScore DESC
      list.sort((a, b) => {
        const upDiff = (b.upvotes || 0) - (a.upvotes || 0);
        if (upDiff !== 0) return upDiff;

        const ratingDiff = (b.rating ?? 9.0) - (a.rating ?? 9.0);
        if (ratingDiff !== 0) return ratingDiff;

        return (b.tieBreakerScore || 0) - (a.tieBreakerScore || 0);
      });

      // Re-assign ranks 1..N
      const rankedList = list.map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));

      const newRank = rankedList.find((c) => c.name === personName)?.rank || oldRank;

      if (newRank < oldRank) {
        setTieBreakerToast(`▲ Tie-Breaker: ${personName} moved UP to Rank #${newRank}! (+1 flame like)`);
      } else if (newRank > oldRank) {
        setTieBreakerToast(`▼ Tie-Breaker: ${personName} moved DOWN to Rank #${newRank}! (-1 flame like subtracted)`);
      } else {
        if (voteType === 'like') {
          setTieBreakerToast(`▲ Handphone upvote recorded for ${personName} (+1 like)`);
        } else {
          setTieBreakerToast(`▼ Handphone downvote recorded for ${personName} (-1 like subtracted)`);
        }
      }
      setTimeout(() => {
        setTieBreakerToast(null);
      }, 3500);

      return {
        ...prev,
        [categoryKey]: rankedList,
      };
    });
  };

  const handleFeedPostTieBreakerVote = (
    postId: string,
    authorName: string,
    voteType: 'like' | 'dislike',
    newVote: 'like' | 'dislike' | null
  ) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const currentLikes = p.likeCount || 100;
          let delta = 0;
          if (voteType === 'like') {
            delta = newVote === 'like' ? 1 : -1;
          } else {
            delta = newVote === 'dislike' ? -1 : 1;
          }
          const nextLikes = Math.max(0, currentLikes + delta);
          return {
            ...p,
            likeCount: nextLikes,
          };
        }
        return p;
      })
    );

    if (voteType === 'like' && newVote === 'like') {
      setTieBreakerToast(`▲ ${authorName} flame like +1 (Tie-Breaker UP)`);
    } else if (voteType === 'dislike' && newVote === 'dislike') {
      setTieBreakerToast(`▼ ${authorName} flame like -1 (Tie-Breaker DOWN)`);
    }
    setTimeout(() => {
      setTieBreakerToast(null);
    }, 3000);
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
          />
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* SCREEN 1: POST SCREEN (TAB 0 - HOME) */}
          {/* ========================================================================= */}
          {activeNavIndex === 0 && (
            <>
              {/* Top Utility Bar with Sign In Button positioned above the 5 upper header icons */}
          <div className="w-full px-4 pt-2 pb-1.5 flex items-center justify-between shrink-0 bg-slate-50/90 border-b border-slate-100 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
                Fairy Live
              </span>
              {currentUser && !isLoggedOut && (
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  · {currentUser.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Once logged in, Sign In button disappears! Only displays when logged out */}
              {(!currentUser || isLoggedOut) ? (
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[12px] font-bold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer animate-fadeIn"
                  title="Sign in to your account"
                >
                  <User className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Sign In</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedProfileUser(null);
                      setActiveNavIndex(4);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11.5px] font-semibold rounded-full shadow-2xs active:scale-95 transition-all cursor-pointer"
                    title="View your profile (@allenkinetic002-creator)"
                  >
                    {/* Empty state profile icon for new user */}
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 stroke-[1.8] text-slate-400" />
                    </div>
                    <span className="max-w-[110px] truncate text-slate-800 font-bold">
                      {currentUser.handle || currentUser.name}
                    </span>
                  </button>

                  {/* Quick Log out button */}
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setIsLoggedOut(true);
                      try {
                        localStorage.removeItem('fairy_current_user');
                      } catch (e) {}
                    }}
                    className="px-2 py-0.5 text-[11px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Log out"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <header className="w-full px-4 pt-2.5 pb-1 flex items-center justify-between shrink-0 bg-white z-10 border-b border-slate-50">

            <div className="flex items-center gap-2">
              <div className="hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer flex items-center justify-center shrink-0">
                <AeriSlimeSqueezeIcon size={30} className="w-[30px] h-[33.7px] shrink-0 drop-shadow-xs" />
              </div>
              <h1 className="text-[21px] font-black tracking-tight text-black leading-none font-sans">
                Fairy
              </h1>
            </div>

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
                onClick={() => setShowCreatePostModal(true)}
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
                    const next = !prev['post-default-elena'];
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

              <button
                onClick={() => {
                  setShowUserSearchModal(true);
                }}
                aria-label="Search Creators & Users"
                title="Search Creators & Users"
                className="hover:opacity-75 transition-opacity cursor-pointer p-1 translate-y-1"
              >
                <AeriSearchIcon className="w-[23px] h-[23px] text-black" />
              </button>

              {/* Message icon (where user messages normal users) */}
              <button
                onClick={() => {
                  setTargetMessagePerson(null);
                  setShowNormalMessagesScreen(true);
                }}
                aria-label="Messages"
                title="Messages · Direct messages with normal users"
                className="hover:opacity-75 transition-all active:scale-90 cursor-pointer p-1 relative text-black flex items-center justify-center -translate-x-1.5 mr-1 translate-y-1"
              >
                <AeriMessageBubbleIcon size={23} className="w-[23px] h-[23px] text-black" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </button>
            </div>
          </header>

          {/* Comment Mode Switcher */}
          <div className="w-full px-4 py-1.5 flex items-center justify-end shrink-0 bg-white z-10 border-b border-slate-100">
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
                              battleQuestion: 'Who looks Hotter between me Freda pepper or this loser Slimy sticky',
                              redParticipant: {
                                name: 'Freda Da. pepper',
                                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                              },
                              blueParticipant: {
                                name: post.authorName,
                                avatar: post.authorAvatar,
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
                />
              ) : (
              <div key={post.id} className="space-y-1.5 shrink-0">
                {/* Reaction Widget moved upper to the very top of post */}
                {activePhoneReactionId === post.id && (
                  <div className="w-full flex justify-center pt-0 pb-1 -mt-0.5">
                    <PhoneReactionPopup
                      personName={post.authorName}
                      postAuthor={post.authorName}
                      initialLikes={post.likeCount || 342}
                      onVote={(type, newVote) => {
                        handleFeedPostTieBreakerVote(post.id, post.authorName, type, newVote);
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
                      redParticipant={post.faceoffConfig?.redParticipant}
                      blueParticipant={post.faceoffConfig?.blueParticipant}
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
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        onClick={() => handleTogglePhoneReaction(post.id)}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
                      />
                      {/* Flame Badge directly on top of the profile pic */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center ring-1.5 ring-white shadow-2xs" title="Trending Creator">
                        <AeriFlameIcon filled className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-[13px] font-black text-slate-900 tracking-tight">
                          {post.authorName}
                        </span>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
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

                {/* 3. Post Card: Image or Video */}
                <div className="relative w-full h-[36vh] min-h-[190px] max-h-[290px] rounded-[18px] overflow-hidden bg-black shadow-xs shrink-0 group">
                  {post.mediaType === 'video' ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  )}

                  <div className="absolute right-3 bottom-3 bg-white/75 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/40 pointer-events-none">
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
                            id: 'p-elena',
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
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-purple-500/20"
                    />
                    <div className="flex-1 min-w-0">
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
                      onClose={handleCloseInfluenceRating}
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
                          onChange={(e) => setInputComment(e.target.value)}
                          placeholder="Add a comment..."
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
                        onClick={() => setIsDrawerOpen(true)}
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
                    onClick={() => handleToggleRaygun('feed-elena', feedPosts[0]?.authorName || 'Elena Vance', feedPosts[0]?.authorAvatar, feedPosts[0]?.authorHandle)}
                    className="flex items-center justify-center text-slate-800 hover:text-black transition-transform active:scale-90 hover:opacity-80 hover:scale-105 cursor-pointer"
                    title="Raygun Arena (Verb / Adverb)"
                    aria-label="Raygun Arena Actions"
                  >
                    <AeriRaygunIcon className="w-8.5 h-8.5 text-slate-800 stroke-[1.3]" />
                  </button>
                </div>

                {/* Verb & Adverb Card placed down on post instead of modal */}
                {activeRaygunPostId === 'feed-elena' && (
                  <div className="w-full pt-1 pb-2 flex justify-start">
                    <RaygunActionModal
                      isOpen={true}
                      isInline={true}
                      targetPersonName={raygunTarget?.name || feedPosts[0]?.authorName || 'Elena Vance'}
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

              <button
                onClick={() => setActiveNavIndex(0)}
                className="text-[11px] font-bold text-slate-600 hover:text-black px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Back to Feed
              </button>
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
              Updated Live &middot; 10 Featured
            </span>
          </div>

          {/* RANK SWITCHER BAR (1, 2, 3... 10 and All 10 Feed toggle) */}
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

          {/* CONTINUOUS SCROLLABLE CREATORS FEED (Posts Fully Displayed) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4 scrollbar-thin">
            {currentCreators.map((person) => {
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
                          initialLikes={person.upvotes}
                          onVote={(type, newVote) => {
                            handleHandphoneTieBreakerVote(selectedCategory, person.name, type, newVote);
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

                    {/* Tie-Breaker Status if votes applied */}
                    {person.tieBreakerScore !== undefined && person.tieBreakerScore !== 0 && (
                      <div className="mx-3.5 my-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <span className={`font-bold flex items-center gap-1 text-[11px] ${person.tieBreakerScore > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {person.tieBreakerScore > 0 ? '▲ Moved UP in Top 10' : '▼ Moved DOWN in Top 10'}
                          <span className="font-normal text-slate-500">
                            (Handphone Net: {person.tieBreakerScore > 0 ? `+${person.tieBreakerScore}` : person.tieBreakerScore})
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Rank #{person.rank}
                        </span>
                      </div>
                    )}

                    {/* Broken Pencil Faceoff Battle Card attached on top of profile pic */}
                    {Boolean(openFaceoffPosts[`person-${person.name}`]) && (
                      <div className="w-full flex justify-center py-2 px-3 bg-white border-b border-slate-100">
                        <FaceoffBattleModal onClose={() => handleCloseFaceoff(`person-${person.name}`)} />
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
                        {isLiked ? `${person.topPost.likes} + 1` : `${person.topPost.likes}`} likes
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
                          setRaygunTarget({ name: person.name, avatar: person.avatarUrl || elenaAvatar, handle: person.handle });
                          setShowPastChallengesModal(true);
                        }}
                        onSelectAdverb={() => {
                          setActiveRaygunPostId(null);
                          setRaygunTarget({ name: person.name, avatar: person.avatarUrl || elenaAvatar, handle: person.handle });
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
                        onClose={handleCloseInfluenceRating}
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
          })}
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
                  <span className="font-extrabold text-slate-900">Elena Rostova</span> flamed your post: <span className="text-slate-500">"Brutalist light study #4"</span>
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
                  <span className="font-extrabold text-slate-900">Marcus Vance</span> sent you a 91% compatibility connection request in <span className="font-bold text-purple-600">Fairy Control</span>.
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
                  <span className="font-extrabold text-slate-900">Aiko Tanaka</span> sent you a direct message.
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
                  <span className="font-extrabold text-slate-900">Santiago Cruz</span> dropped a honey jar tip in your jar!
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
          onClearViewUser={() => setSelectedProfileUser(null)}
          onOpenSettings={() => setShowSettingsScreen(true)}
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
        authorAvatar={currentUser && !isLoggedOut ? (currentUser.avatarUrl || '') : elenaAvatar}
        authorName={currentUser && !isLoggedOut ? currentUser.name : "Elena Vance"}
        authorHandle={currentUser && !isLoggedOut ? currentUser.handle : "@elena_aeri"}
      />

      {/* Create Post Modal (Allows posting video, pic, and writing) */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPublish={handlePublishPost}
        authorAvatar={elenaAvatar}
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
              name: 'Elena Vance',
              handle: '@elena_aeri',
              avatar: elenaAvatar,
            }}
            onPublishChallenge={handlePublishChallenge}
          />
        </>
      )}

      {/* User Search Modal (Search any user from top header search icon) */}
      <UserSearchModal
        isOpen={showUserSearchModal}
        onClose={() => setShowUserSearchModal(false)}
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
          setTweetSuccessToast(`Welcome back, ${user.name}!`);
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
            currentUser={currentUser || undefined}
          />
        </div>
      )}

    </div>
  );
}
