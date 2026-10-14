import React, { useState, useEffect } from 'react';
import {
  Grid,
  FileText,
  Video,
  Bookmark,
  Tag,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Edit3,
  Calendar,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  X,
  ChevronRight,
  Flame,
  Music,
  Layers,
  Eye,
  BookOpen,
  Info,
  List,
  Hash,
  Send,
  User,
  UserPlus,
  UserCheck,
  Clock,
  Compass,
  Settings,
} from 'lucide-react';

import { SettingsScreen } from './SettingsScreen';

import { AeriFlameIcon } from './AeriFlameIcon';
import { AeriCommentIcon } from './AeriCommentIcon';
import { FairyPotIcon } from './FairyPotIcon';
import { AeriHandPhoneIcon } from './AeriHandPhoneIcon';
import { AeriMaskedEyesIcon } from './AeriMaskedEyesIcon';
import { AeriHydrantIcon } from './AeriHydrantIcon';
import { AeriRaygunIcon } from './AeriRaygunIcon';
import { AeriMessageBubbleIcon } from './AeriMessageBubbleIcon';
import { BrokenPencilIcon } from './BrokenPencilIcon';
import { PhoneReactionPopup } from './PhoneReactionPopup';
import { FaceoffBattleModal } from './FaceoffBattleModal';
import { InfluenceRatingModal } from './InfluenceRatingModal';
import { RaygunActionModal } from './RaygunActionModal';
import { TweetPostCard, TweetPostItem } from './TweetPostCard';

import postImage from '../assets/images/fairy_post_image_1791012530319.jpg';
import elenaAvatar from '../assets/images/creator_portrait_elena_1791014499312.jpg';
import topPostPhoto from '../assets/images/creator_top_post_1791014513929.jpg';
import charDesignPhoto from '../assets/images/char_design_concept_1791018302239.jpg';

export interface ProfileComment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  text: string;
  time: string;
}

export interface ProfileGridPost {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  caption: string;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
  commentsCount: number;
  audioTitle?: string;
  videoDuration?: string;
  carouselCount?: string;
  isPinned?: boolean;
  timeAgo: string;
  views?: string;
  comments: ProfileComment[];
}

export interface UserWikiBioData {
  name: string;
  handle: string;
  profession: string;
  birthdate: string;
  age: number;
  birthSign: string;
  birthplace: string;
  nationality: string;
  almaMater: string;
  yearsActive: string;
  fairyRankText: string;
  trustScore: number;
  starStampCount: number;
  bioOverview: string;
  beforeFame: string;
  triviaList: string[];
  associatedWith: Array<{ name: string; handle: string; role: string }>;
  website: string;
}

export function buildProfileWikiData(user: {
  name: string;
  handle: string;
  profession?: string;
  bio?: string;
  location?: string;
}): UserWikiBioData {
  const isAllen =
    user.handle.toLowerCase().includes('allen') ||
    user.name.toLowerCase().includes('allen');

  if (isAllen) {
    return {
      name: user.name,
      handle: user.handle,
      profession: user.profession || 'Creative Developer & Founder',
      birthdate: 'March 14, 1999',
      age: 27,
      birthSign: 'Pisces ♓',
      birthplace: user.location || 'London, United Kingdom',
      nationality: 'British',
      almaMater: 'Imperial College London',
      yearsActive: '2021–present',
      fairyRankText: '#1 Verified Creator & Lead Architect',
      trustScore: 99,
      starStampCount: 3120,
      bioOverview:
        user.bio ||
        `${user.name} (${user.handle}) is a creator, full-stack engineer, and ecosystem pioneer on the Fairy network. Leading social feeds, real-time trust receipts, and next-generation creative tooling.`,
      beforeFame: `${user.name} founded digital interactive experiences and creative open-source tooling, pioneering digital identity verification and real-time distributed feeds before leading the modern Fairy ecosystem.`,
      triviaList: [
        'Creator and architect of the Fairy Social Feed and Trust Receipt protocol.',
        'Maintains a 99% Verified Integrity Trust Score across all community interactions.',
        'Pioneered instant peer-to-peer verbal commitment receipts (Star Stamps).',
        'Directly connected with international developers and artists worldwide.',
        'Over 3,120 verified Star Stamps logged and acknowledged on the network.',
      ],
      associatedWith: [
        { name: 'Elena Vance', handle: '@aerifairy', role: 'Concept Visual Artist & Beatmaker' },
        { name: 'Alex Chen', handle: '@alexchen', role: 'Frontend & UI Specialist' },
        { name: 'Tunde Ojo', handle: '@tunde_dev', role: 'Senior Database Engineer' },
      ],
      website: `fairy.app/${user.handle}`,
    };
  }

  const isElena =
    user.handle.toLowerCase().includes('elena') ||
    user.name.toLowerCase().includes('elena') ||
    user.handle.toLowerCase().includes('aeri');

  if (isElena) {
    return {
      name: 'Elena Vance',
      handle: '@aerifairy',
      profession: 'Concept Visual Artist & Beatmaker',
      birthdate: 'July 13, 2000',
      age: 24,
      birthSign: 'Cancer ♋',
      birthplace: 'Seoul, South Korea',
      nationality: 'South Korean / German',
      almaMater: 'Seoul Institute of the Arts',
      yearsActive: '2020–present',
      fairyRankText: '#1 in Visual Art · #12 Global Fairy',
      trustScore: 98,
      starStampCount: 1420,
      bioOverview:
        'Elena Vance, widely known by her creator moniker Aeri Fairy, is an acclaimed concept visual artist, worldbuilder, and synth beatmaker. A leading voice of the neo-folklore and cyber-ambient aesthetic on the Fairy ecosystem, her immersive visual narratives explore mythological realms, luminous forest flora, and futuristic analog synthesis.',
      beforeFame:
        'Before establishing herself as a leading creator on Fairy, Vance began sketching fantasy scenes and architectural dioramas in digital painting communities in 2019 while studying at the Seoul Institute of the Arts.',
      triviaList: [
        'Youngest visual artist to reach #1 Top Ranked Creator on the Fairy platform.',
        'All ambient soundscapes in her posts are produced and mixed personally on vintage Roland Juno-106 and Moog Matriarch hardware.',
        'Collaborated with over 24 global musicians and architects on cross-medium digital pavilions.',
        'Her signature purple aesthetic palette was inspired by neon dusk reflections over the Han River in Seoul.',
        'Has achieved a 98% Integrity Trust Score and over 1,420 Star Stamps awarded by peers.',
      ],
      associatedWith: [
        { name: 'Elena Rostova', handle: '@elena_art', role: 'Brutalist Architecture & Visuals' },
        { name: 'Marcus Thorne', handle: '@marcus_design', role: 'Industrial 3D Sculptor' },
        { name: 'Maya Lin', handle: '@mayalin', role: 'Ceramic & Spatial Installations' },
      ],
      website: 'fairy.app/@aerifairy',
    };
  }

  return {
    name: user.name,
    handle: user.handle,
    profession: user.profession || 'Digital Creator',
    birthdate: 'January 1, 2000',
    age: 26,
    birthSign: 'Capricorn ♑',
    birthplace: user.location || 'Creative Hub',
    nationality: 'Verified Creator',
    almaMater: 'Academy of Digital Arts',
    yearsActive: '2022–present',
    fairyRankText: 'Verified Fairy Creator',
    trustScore: 96,
    starStampCount: 840,
    bioOverview:
      user.bio ||
      `${user.name} (${user.handle}) is an active creator and participant in the Fairy community.`,
    beforeFame: `${user.name} joined the platform to share creative projects and establish verified trust receipts with peers.`,
    triviaList: [
      'Active contributor to the Fairy feed and challenge ecosystem.',
      'Regular recipient of community Star Stamps.',
      'Verified profile on Fairy network.',
    ],
    associatedWith: [
      { name: 'Allen Dharak', handle: '@allenkinetic002-creator', role: 'Platform Architect' },
      { name: 'Elena Vance', handle: '@aerifairy', role: 'Creator & Artist' },
    ],
    website: `fairy.app/${user.handle}`,
  };
}

export interface UserProfileScreenProps {

  onBackToFeed: () => void;
  onOpenSendPersonMessage: (person: { id: string; name: string; handle: string; avatarUrl?: string }) => void;
  onOpenStarStamps?: () => void;
  onOpenChallengeModal?: () => void;
  onOpenPastChallengesModal?: () => void;
  setRaygunTarget?: (target: { name: string; avatar: string; handle: string }) => void;
  viewUser?: {
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string;
    city?: string;
    bio?: string;
    integrityScore?: number;
    category?: string;
  } | null;
  currentUser?: {
    id?: string;
    name: string;
    handle: string;
    email?: string;
    location?: string;
    profession?: string;
    bio?: string;
    avatarUrl?: string;
  };
  onClearViewUser?: () => void;
  onOpenSettings?: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onBackToFeed,
  onOpenSendPersonMessage,
  onOpenStarStamps,
  onOpenChallengeModal,
  onOpenPastChallengesModal,
  setRaygunTarget,
  viewUser,
  currentUser,
  onClearViewUser,
  onOpenSettings,
}) => {
  // Active user resolution
  const activeUser = viewUser || currentUser || {
    name: 'Allen Dharak',
    handle: '@allenkinetic002-creator',
    email: 'allendharak9@gmail.com',
    location: 'London, UK',
    profession: 'Creative Developer & Founder',
    bio: 'Creative developer, founder & digital artist on Fairy.',
  };

  // Settings modal fallback state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Tabs: 'wiki' (Fairypedia article & facts), 'grid' (Instagram 3x3 posts), 'reels' (Video format), 'honeyjar' (Sitch/Twitter posts)
  const [activeTab, setActiveTab] = useState<'wiki' | 'grid' | 'reels' | 'honeyjar'>('wiki');

  // Follow state
  const [isFollowing, setIsFollowing] = useState(true);

  // Floating Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected post for Home Screen Post View Modal
  const [selectedPost, setSelectedPost] = useState<ProfileGridPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Interactive Reactions State on Open Modal / Post
  const [activePhoneReaction, setActivePhoneReaction] = useState(false);
  const [activeInfluenceRating, setActiveInfluenceRating] = useState(false);
  const [activeRaygunAction, setActiveRaygunAction] = useState(false);
  const [isFaceoffOpen, setIsFaceoffOpen] = useState(false);

  // Sitch (Twitter-like posts) on Honey Jar Tab
  const [sitchPosts, setSitchPosts] = useState<TweetPostItem[]>([
    {
      id: 'sitch-1',
      authorName: 'Elena Vance',
      authorHandle: '@aerifairy',
      authorAvatar: elenaAvatar,
      isVerified: true,
      timeAgo: '45m ago',
      location: 'Kyoto, Japan',
      mediaType: 'tweet',
      isTweet: true,
      tweetContent:
        'Just completed the new ambient synth pack in Kyoto 🎧🌿 Testing the soundwaves against analog Roland filters. Full audio drop happening this Friday on Fairy! What harmonic frequency should we wander into next? 🧚✨',
      tags: ['#ambient', '#synthwave', '#kyoto', '#aerifairy'],
      likeCount: 1420,
      isLiked: false,
      retweetCount: 184,
      replyCount: 52,
      viewCount: '18.4K',
      isTrending: true,
      faceoffConfig: {
        battleQuestion: 'Who has the superior synth acoustic aesthetic between Aeri Fairy or Slimy sticky',
        redParticipant: {
          name: 'Elena Vance (@aerifairy)',
          avatar: elenaAvatar,
        },
        blueParticipant: {
          name: 'Slimy sticky (@slimy_sticky)',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        },
      },
    },
    {
      id: 'sitch-2',
      authorName: 'Elena Vance',
      authorHandle: '@aerifairy',
      authorAvatar: elenaAvatar,
      isVerified: true,
      timeAgo: '3h ago',
      location: 'Seoul / Han River',
      mediaType: 'tweet',
      isTweet: true,
      tweetContent:
        'Unpopular opinion in digital arts: brutalist concrete architecture and organic enchanted fairy folklore belong in the exact same design syllabus. Change my mind in the replies 👇🏛️🍄',
      tags: ['#folklore', '#brutalism', '#worldbuilding', '#design'],
      likeCount: 2890,
      isLiked: true,
      retweetCount: 340,
      replyCount: 112,
      viewCount: '34.1K',
    },
    {
      id: 'sitch-3',
      authorName: 'Elena Vance',
      authorHandle: '@aerifairy',
      authorAvatar: elenaAvatar,
      isVerified: true,
      timeAgo: '1d ago',
      location: 'Global Fairy Hub',
      mediaType: 'tweet',
      isTweet: true,
      tweetContent:
        'Late night sketch session in the misty rain... We just hit 1,420 Star Stamps and 98% Integrity score today. Thank you to everyone who dropped honey jars and trusted receipts! 🍯💜',
      tags: ['#starstamps', '#trustreceipts', '#community', '#fairy'],
      likeCount: 4120,
      isLiked: false,
      retweetCount: 490,
      replyCount: 88,
      viewCount: '52.9K',
    },
  ]);

  const [newSitchContent, setNewSitchContent] = useState('');
  const [activeRaygunSitchId, setActiveRaygunSitchId] = useState<string | null>(null);
  const [activePhoneReactionSitchId, setActivePhoneReactionSitchId] = useState<string | null>(null);
  const [activeInfluenceRatingSitchId, setActiveInfluenceRatingSitchId] = useState<string | null>(null);
  const [openFaceoffSitchPosts, setOpenFaceoffSitchPosts] = useState<Record<string, boolean>>({});
  const [morphedSitchPosts, setMorphedSitchPosts] = useState<Record<string, boolean>>({});

  // Edit Fairypedia Info Modal
  const [isEditWikiModalOpen, setIsEditWikiModalOpen] = useState(false);

  // Editable User Wiki & Biographical Data
  const [wikiData, setWikiData] = useState<UserWikiBioData>(() =>
    buildProfileWikiData(activeUser)
  );

  // Edit Form Temp State
  const [editFormData, setEditFormData] = useState<UserWikiBioData>(() =>
    buildProfileWikiData(activeUser)
  );
  const [newTriviaInput, setNewTriviaInput] = useState('');

  // Automatically sync wiki data whenever active user changes
  useEffect(() => {
    const updated = buildProfileWikiData(activeUser);
    setWikiData(updated);
    setEditFormData(updated);
  }, [activeUser.name, activeUser.handle]);


  // 12 Rich Posts for the Instagram Grid
  const [posts, setPosts] = useState<ProfileGridPost[]>([
    {
      id: 'post-1',
      mediaUrl: postImage,
      mediaType: 'image',
      caption: 'Golden hour in the enchanted woods 🧚✨ Caught between autumn mist and warm amber light. Where should we wander next?',
      tags: ['#fairy', '#autumnlight', '#aeri', '#dreamscape'],
      likeCount: 2450,
      isLiked: false,
      commentsCount: 84,
      isPinned: true,
      audioTitle: 'Aeri Fairy - Golden Hour Mist',
      timeAgo: '2h ago',
      comments: [
        { id: 'c1', author: 'Elena Rostova', handle: '@elena_art', avatar: elenaAvatar, text: 'The amber light gradation is breathtaking Elena! ✨', time: '1h ago' },
        { id: 'c2', author: 'Marcus Thorne', handle: '@marcus_design', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', text: 'Top 10 energy as always. That color balance!', time: '45m ago' },
      ],
    },
    {
      id: 'post-2',
      mediaUrl: topPostPhoto,
      mediaType: 'video',
      videoDuration: '0:42',
      caption: 'Late night analog synth textures. Patching generative sequences through the tape echo machine 🎹🎶',
      tags: ['#synth', '#beatmaking', '#sounddesign', '#juno106'],
      likeCount: 3120,
      isLiked: true,
      commentsCount: 112,
      audioTitle: 'Elena Vance - Echo Chamber 04',
      timeAgo: '1d ago',
      views: '18.4K',
      comments: [
        { id: 'c3', author: 'Maya Lin', handle: '@mayalin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', text: 'Need this sound pack on loop immediately!', time: '18h ago' },
      ],
    },
    {
      id: 'post-3',
      mediaUrl: charDesignPhoto,
      mediaType: 'carousel',
      carouselCount: '1/5',
      caption: 'Character design sheet: The Forest Guardian of the North. Outfit layering and artifact concepts 🌿🗡️',
      tags: ['#conceptart', '#characterdesign', '#illustration'],
      likeCount: 1980,
      isLiked: false,
      commentsCount: 65,
      audioTitle: 'Original Audio',
      timeAgo: '3d ago',
      comments: [],
    },
    {
      id: 'post-4',
      mediaUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Neon alley reflections during rainy dusk in Seoul. Real-life color palettes that inspired my latest environment drop.',
      tags: ['#neon', '#streetphotography', '#colorpalette'],
      likeCount: 1820,
      isLiked: false,
      commentsCount: 42,
      audioTitle: 'Seoul Dusk Lo-Fi',
      timeAgo: '5d ago',
      comments: [],
    },
    {
      id: 'post-5',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Flow state procedural gradients. Experimenting with mathematical organic curvatures.',
      tags: ['#generative', '#abstractart', '#digitalsculpture'],
      likeCount: 2240,
      isLiked: false,
      commentsCount: 78,
      audioTitle: 'Ambient Wave 09',
      timeAgo: '1w ago',
      comments: [],
    },
    {
      id: 'post-6',
      mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoDuration: '1:15',
      caption: '3D spatial flora bloom test. Real-time rendering inside Unreal Engine 5 🌸🖥️',
      tags: ['#3dart', '#animation', '#ue5', '#cgi'],
      likeCount: 4510,
      isLiked: true,
      commentsCount: 154,
      audioTitle: 'Elena Vance - Floral Synthesis',
      timeAgo: '1w ago',
      views: '32.1K',
      comments: [],
    },
    {
      id: 'post-7',
      mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Gallery exhibition print preview: "Ethereal Echoes". Metallic foil test on heavy linen cardstock.',
      tags: ['#printmaking', '#exhibition', '#fineart'],
      likeCount: 1640,
      isLiked: false,
      commentsCount: 39,
      audioTitle: 'Original Audio',
      timeAgo: '2w ago',
      comments: [],
    },
    {
      id: 'post-8',
      mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
      mediaType: 'carousel',
      carouselCount: '1/3',
      caption: 'Kyoto stone gardens under morning fog. Capturing texture and natural light for environment assets.',
      tags: ['#kyoto', '#japan', '#texturestudies'],
      likeCount: 2890,
      isLiked: false,
      commentsCount: 91,
      audioTitle: 'Bamboo Wind Chimes',
      timeAgo: '2w ago',
      comments: [],
    },
    {
      id: 'post-9',
      mediaUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Minimalist typographic drop: "TIME & RESONANCE". Limited run art poster release.',
      tags: ['#typography', '#graphicdesign', '#poster'],
      likeCount: 1420,
      isLiked: false,
      commentsCount: 31,
      audioTitle: 'Original Audio',
      timeAgo: '3w ago',
      comments: [],
    },
    {
      id: 'post-10',
      mediaUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoDuration: '0:30',
      caption: 'Behind the scenes: Sketch to final render workflow timelapse in Procreate and Blender ✍️',
      tags: ['#timelapse', '#process', '#arttutorial'],
      likeCount: 3890,
      isLiked: false,
      commentsCount: 128,
      audioTitle: 'Lo-Fi Chill Beats',
      timeAgo: '3w ago',
      views: '24.9K',
      comments: [],
    },
    {
      id: 'post-11',
      mediaUrl: 'https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Cyberpunk shrine at midnight. Lighting study exploring volumetric purple smog and lantern glows 🏮',
      tags: ['#cyberpunk', '#worldbuilding', '#lighting'],
      likeCount: 2740,
      isLiked: true,
      commentsCount: 88,
      audioTitle: 'Neo Tokyo Ambient',
      timeAgo: '1mo ago',
      comments: [],
    },
    {
      id: 'post-12',
      mediaUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: 'Honored to receive the Fairy Gold Star Stamp! Huge thank you to all fellow creators and collaborators ✨🥂',
      tags: ['#fairy', '#starstamp', '#creatorcommunity', '#milestone'],
      likeCount: 5120,
      isLiked: true,
      commentsCount: 245,
      audioTitle: 'Celebration Synth Anthem',
      timeAgo: '1mo ago',
      comments: [],
    },
  ]);

  // Handle Like Toggle on Selected or Grid Post
  const handleTogglePostLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          const newCount = newLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1);
          return { ...p, isLiked: newLiked, likeCount: newCount };
        }
        return p;
      })
    );
    if (selectedPost && selectedPost.id === postId) {
      const newLiked = !selectedPost.isLiked;
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: newLiked,
              likeCount: newLiked ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1),
            }
          : null
      );
    }
  };

  // Add Comment to Selected Post
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost) return;

    const newComment: ProfileComment = {
      id: 'c-' + Date.now(),
      author: 'Elena Vance',
      handle: '@aerifairy',
      avatar: elenaAvatar,
      text: newCommentText.trim(),
      time: 'Just now',
    };

    const updatedComments = [newComment, ...selectedPost.comments];

    setSelectedPost({
      ...selectedPost,
      comments: updatedComments,
      commentsCount: selectedPost.commentsCount + 1,
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPost.id
          ? { ...p, comments: updatedComments, commentsCount: p.commentsCount + 1 }
          : p
      )
    );

    setNewCommentText('');
  };

  // Toggle Like on Sitch Post
  const handleToggleSitchLike = (id: string) => {
    setSitchPosts((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextLiked = !s.isLiked;
          return {
            ...s,
            isLiked: nextLiked,
            likeCount: nextLiked ? s.likeCount + 1 : Math.max(0, s.likeCount - 1),
          };
        }
        return s;
      })
    );
  };

  // Publish New Sitch Post to Honey Jar
  const handleCreateSitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSitchContent.trim()) return;
    const newSitch: TweetPostItem = {
      id: `sitch-${Date.now()}`,
      authorName: wikiData.name,
      authorHandle: wikiData.handle,
      authorAvatar: elenaAvatar,
      isVerified: true,
      timeAgo: 'Just now',
      location: 'Kyoto, Japan',
      mediaType: 'tweet',
      isTweet: true,
      tweetContent: newSitchContent.trim(),
      tags: ['#aeri', '#sitch', '#fairy'],
      likeCount: 1,
      isLiked: true,
      retweetCount: 0,
      replyCount: 0,
      viewCount: '1',
    };
    setSitchPosts([newSitch, ...sitchPosts]);
    setNewSitchContent('');
    setToastMessage('🍯 Your sitch has been dropped in Honey Jar!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Save Fairypedia & Biographical Data Changes
  const handleSaveWikiData = (e: React.FormEvent) => {
    e.preventDefault();
    setWikiData(editFormData);
    setIsEditWikiModalOpen(false);
    setToastMessage('✨ Your Fairypedia information has been updated!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Trivia Item
  const handleAddTriviaItem = () => {
    if (!newTriviaInput.trim()) return;
    setEditFormData({
      ...editFormData,
      triviaList: [...editFormData.triviaList, newTriviaInput.trim()],
    });
    setNewTriviaInput('');
  };

  // Remove Trivia Item
  const handleRemoveTriviaItem = (index: number) => {
    setEditFormData({
      ...editFormData,
      triviaList: editFormData.triviaList.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-[#FAFBFD] scrollbar-thin">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md animate-fadeIn border border-slate-700/60">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Profile Bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToFeed}
            className="p-1 -ml-1 text-slate-600 hover:text-black rounded-lg transition-colors cursor-pointer"
            title="Back to Feed"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-slate-900 tracking-tight">{wikiData.handle}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setIsSettingsOpen(true);
            }}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer border border-slate-200 shadow-2xs flex items-center justify-center"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Quick Fairypedia Edit Button */}
          <button
            onClick={() => {
              setEditFormData(wikiData);
              setIsEditWikiModalOpen(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer border border-purple-200/80"
            title="Edit Fairypedia profile"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Fairypedia</span>
          </button>

          <button
            onClick={onBackToFeed}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-full cursor-pointer transition-colors"
          >
            Feed
          </button>
        </div>
      </div>

      {/* Main Profile Header Section (Instagram Layout + Fairypedia Info) */}
      <div className="bg-white border-b border-slate-200/80 px-4 pt-4 pb-3 shadow-2xs">
        {/* Avatar & Instagram Follower Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6 mb-3">
          {/* Avatar and Fairy Flame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full p-0.5 bg-slate-100 ring-2 ring-slate-200 overflow-hidden flex items-center justify-center">
              {activeUser.avatarUrl ? (
                <img
                  src={activeUser.avatarUrl}
                  alt={wikiData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : activeUser.name.toLowerCase().includes('elena') && !activeUser.name.toLowerCase().includes('allen') ? (
                <img
                  src={elenaAvatar}
                  alt={wikiData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                /* Empty state profile icon for new user */
                <div className="w-full h-full rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center select-none shadow-inner" title="New user profile icon">
                  <User className="w-10 h-10 text-slate-400 stroke-[1.6]" />
                </div>
              )}
            </div>

            {/* Trending Flame on Profile Avatar */}
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center ring-2 ring-white shadow-xs"
              title="Top Trending Creator"
            >
              <AeriFlameIcon filled className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Instagram Stats Counters */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-center px-1">
              <div>
                <span className="block font-black text-base text-slate-900 leading-tight">
                  {posts.length}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">Posts</span>
              </div>
              <div>
                <span className="block font-black text-base text-slate-900 leading-tight">
                  48.2K
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">Followers</span>
              </div>
              <div>
                <span className="block font-black text-base text-slate-900 leading-tight">
                  238
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">Following</span>
              </div>
            </div>

            {/* Quick Action Buttons (Follow, Message, Share) */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 py-1.5 px-3 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                  isFollowing
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isFollowing ? (
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

              <button
                onClick={() =>
                  onOpenSendPersonMessage({
                    id: 'p-elena',
                    name: wikiData.name,
                    handle: wikiData.handle,
                    avatarUrl: elenaAvatar,
                  })
                }
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Send Message"
              >
                <AeriMessageBubbleIcon size={14} className="w-3.5 h-3.5 text-slate-700" />
                <span>Message</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    setToastMessage('📋 Profile link copied to clipboard!');
                    setTimeout(() => setToastMessage(null), 2500);
                  }
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (onOpenSettings) onOpenSettings();
                  else setIsSettingsOpen(true);
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* User Identity Details & Category */}
        <div className="mb-1">
          <div className="flex items-center gap-1.5">
            <h1 className="font-black text-lg text-slate-900 leading-tight">
              {wikiData.name}
            </h1>
            <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 shrink-0" />
          </div>
          <p className="text-xs font-bold text-purple-700 mt-0.5">
            {wikiData.profession}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-2">
            <span>{wikiData.handle}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {wikiData.birthplace}
            </span>
          </p>
          {/* Bio Overview Snippet */}
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">
            {wikiData.bioOverview}
          </p>
          {/* Integrity & Stamps Metrics Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {wikiData.trustScore}% Integrity
            </span>
            <span>&middot;</span>
            <span className="inline-flex items-center gap-1 text-purple-700 font-bold">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              {wikiData.starStampCount.toLocaleString()} Star Stamps
            </span>
            <span>&middot;</span>
            <a
              href={`https://${wikiData.website}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-purple-600 font-bold hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {wikiData.website}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Fairypedia First, Posts Picture Grid Second, Reels, Feed Stream) */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-10 flex items-center justify-around shadow-2xs">
        <button
          onClick={() => setActiveTab('wiki')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-black transition-colors cursor-pointer border-b-2 ${
            activeTab === 'wiki'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          title="Fairypedia Biography & Facts"
        >
          <BookOpen className="w-4 h-4" />
          <span>Fairypedia</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-black transition-colors cursor-pointer border-b-2 ${
            activeTab === 'grid'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          title="Grid of Multiple Posts"
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">Posts</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-black transition-colors cursor-pointer border-b-2 ${
            activeTab === 'reels'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          title="Video Reels"
        >
          <Video className="w-4 h-4" />
          <span className="hidden sm:inline">Reels</span>
        </button>

        <button
          onClick={() => setActiveTab('honeyjar')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-black transition-colors cursor-pointer border-b-2 ${
            activeTab === 'honeyjar'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          title="Honey Jar · Sitch & Twitter-like Posts"
        >
          <FairyPotIcon className="w-4 h-4 text-current" />
          <span className="hidden sm:inline">Sitch</span>
        </button>
      </div>

      {/* TAB 1: FAIRYPEDIA BIOGRAPHICAL ENCYCLOPEDIA */}
      {activeTab === 'wiki' && (
        <div className="p-3 sm:p-5 max-w-3xl mx-auto w-full space-y-5">
          {/* Fairypedia Infobox (Community Encyclopedia Quick Facts Card) */}
          <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Infobox Header */}
            <div className="bg-[#EBF2F8] border-b border-slate-300 px-4 py-2.5 flex items-center justify-between">
              <div>
                <h2 className="font-serif font-black text-base text-slate-900 tracking-tight">
                  {wikiData.name}
                </h2>
                <p className="font-serif text-[11px] text-slate-600 italic">
                  Fairypedia &middot; Verified Article
                </p>
              </div>
              <button
                onClick={() => {
                  setEditFormData(wikiData);
                  setIsEditWikiModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-purple-600" />
                <span>Edit Fairypedia</span>
              </button>
            </div>

            {/* Fairypedia Circular Post Image */}
            <div className="p-4 bg-gradient-to-b from-slate-50 to-purple-50/20 flex flex-col items-center justify-center border-b border-slate-200">
              <div className="relative">
                {activeUser.avatarUrl ? (
                  <img
                    src={activeUser.avatarUrl}
                    alt={wikiData.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-purple-300"
                  />
                ) : activeUser.name.toLowerCase().includes('elena') && !activeUser.name.toLowerCase().includes('allen') ? (
                  <img
                    src={elenaAvatar}
                    alt={wikiData.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-purple-300"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-slate-100 border-4 border-white shadow-md ring-2 ring-slate-200 flex items-center justify-center text-slate-400" title="New user profile">
                    <User className="w-20 h-20 text-slate-400 stroke-[1.4]" />
                  </div>
                )}
                <div
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center ring-2 ring-white shadow-xs"
                  title="Fairypedia Verified Article"
                >
                  <AeriFlameIcon filled className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2.5 text-center font-serif italic font-medium">
                {wikiData.name} ({wikiData.handle}) &middot; Community member
              </span>
            </div>

            {/* Infobox Data Table */}
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 w-1/3 bg-slate-50/50">Born</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.birthdate} (age {wikiData.age})
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Birth Sign</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.birthSign}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Birthplace</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.birthplace}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Nationality</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.nationality}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Alma mater</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.almaMater}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Occupation</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.profession}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Years active</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    {wikiData.yearsActive}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Fairy Standing</th>
                  <td className="py-2 px-3.5 text-purple-700 font-black">
                    {wikiData.fairyRankText}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Integrity Score</th>
                  <td className="py-2 px-3.5 text-emerald-700 font-bold">
                    {wikiData.trustScore}% Verified
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Star Stamps</th>
                  <td className="py-2 px-3.5 text-slate-900 font-medium">
                    Gold Master Tier ({wikiData.starStampCount.toLocaleString()} stamps)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <th className="py-2 px-3.5 font-bold text-slate-700 bg-slate-50/50">Website</th>
                  <td className="py-2 px-3.5 text-purple-600 font-medium">
                    <a href={`https://${wikiData.website}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      {wikiData.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 1: About / Overview (Fairypedia Prose) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                <span>1. About & Philosophy</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">[Fairypedia Article]</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {wikiData.bioOverview}
            </p>
          </div>

          {/* Section 2: Early Life & Career */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                <span>2. Early Life & Career</span>
              </h3>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                Fairypedia Dossier
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {wikiData.beforeFame}
            </p>
          </div>

          {/* Section 3: Trivia & Fast Facts (Bulleted Fairypedia Style) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                <span>3. Trivia & Fast Facts</span>
              </h3>
              <button
                onClick={() => {
                  setEditFormData(wikiData);
                  setIsEditWikiModalOpen(true);
                }}
                className="text-xs text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
              >
                + Add Fact
              </button>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-serif">
              {wikiData.triviaList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-purple-600 font-bold font-mono text-xs mt-0.5 shrink-0">
                    [{idx + 1}]
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Associated With & Collaborators */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                <span>4. Associated With</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Collaborators & Peers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {wikiData.associatedWith.map((peer, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    onOpenSendPersonMessage({
                      id: `peer-${idx}`,
                      name: peer.name,
                      handle: peer.handle,
                    })
                  }
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer group"
                >
                  <p className="font-black text-xs text-slate-900 group-hover:text-purple-700">
                    {peer.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{peer.handle}</p>
                  <p className="text-[10px] text-purple-600 mt-1 font-semibold">{peer.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTAGRAM MULTIPLE POSTS 3x3 PICTURE GRID */}
      {activeTab === 'grid' && (
        <div className="p-1 sm:p-2">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="relative aspect-square bg-slate-900 group cursor-pointer overflow-hidden rounded-xs sm:rounded-md"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Media Type Icon Badge in Top Right */}
                <div className="absolute top-1.5 right-1.5 text-white drop-shadow-md pointer-events-none">
                  {post.isPinned && (
                    <div className="w-5 h-5 rounded-full bg-[#FF5722] flex items-center justify-center shadow-xs">
                      <Flame className="w-3 h-3 fill-white text-white" />
                    </div>
                  )}
                  {post.mediaType === 'video' && !post.isPinned && (
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Video className="w-3 h-3" />
                      {post.videoDuration && <span>{post.videoDuration}</span>}
                    </div>
                  )}
                  {post.mediaType === 'carousel' && !post.isPinned && (
                    <Layers className="w-4 h-4" />
                  )}
                </div>

                {/* Instagram Hover / Active Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4 text-white font-black text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REELS / VERTICAL VIDEO VIEW */}
      {activeTab === 'reels' && (
        <div className="p-1 sm:p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {posts
              .filter((p) => p.mediaType === 'video' || p.views)
              .concat(posts.slice(0, 4))
              .map((post, idx) => (
                <div
                  key={`reel-${idx}`}
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden group cursor-pointer shadow-xs"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.views || '14.2K'}</span>
                    </div>
                    <p className="text-[11px] font-semibold line-clamp-2 text-white/90">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-white/70 mt-1">
                      <Music className="w-2.5 h-2.5" />
                      <span className="truncate">{post.audioTitle || 'Original Audio'}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: HONEYJAR - SITCH & TWITTER-LIKE POSTS WITH ATTACHED ICONS */}
      {activeTab === 'honeyjar' && (
        <div className="p-3.5 space-y-4 max-w-xl mx-auto w-full">
          {/* Sitch Quick-Composer Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <FairyPotIcon size={18} className="w-[18px] h-[18px] text-purple-600" />
              <span className="font-black text-xs text-slate-900">Drop a Sitch in Honey Jar</span>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full ml-auto">
                Twitter Format
              </span>
            </div>
            <form onSubmit={handleCreateSitch} className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                {activeUser.avatarUrl ? (
                  <img
                    src={activeUser.avatarUrl}
                    alt={wikiData.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : activeUser.name.toLowerCase().includes('elena') && !activeUser.name.toLowerCase().includes('allen') ? (
                  <img
                    src={elenaAvatar}
                    alt={wikiData.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-400 stroke-[1.6]" />
                  </div>
                )}
                <textarea
                  value={newSitchContent}
                  onChange={(e) => setNewSitchContent(e.target.value)}
                  placeholder="What's your current sitch? Drop thoughts, updates, or teasers... 🍯"
                  rows={2}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none font-sans"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  {newSitchContent.length}/280 characters
                </span>
                <button
                  type="submit"
                  disabled={!newSitchContent.trim()}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-black text-xs rounded-full shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FairyPotIcon size={14} className="w-3.5 h-3.5 text-white" />
                  <span>Post Sitch</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sitch Stream using TweetPostCard with full icon attachment */}
          <div className="space-y-3.5">
            {sitchPosts.map((sitch) => (
              <TweetPostCard
                key={sitch.id}
                post={sitch}
                onToggleLike={handleToggleSitchLike}
                onOpenComments={() => setToastMessage('💬 Opening discussion for this sitch...')}
                onOpenSendMessage={onOpenSendPersonMessage}
                onTogglePhoneReaction={(id) =>
                  setActivePhoneReactionSitchId((prev) => (prev === id ? null : id))
                }
                onToggleInfluenceRating={(id) =>
                  setActiveInfluenceRatingSitchId((prev) => (prev === id ? null : id))
                }
                onToggleRaygun={(id, name, avatar, handle) => {
                  setActiveRaygunSitchId((prev) => (prev === id ? null : id));
                  if (setRaygunTarget) {
                    setRaygunTarget({ name, avatar: avatar || elenaAvatar, handle: handle || wikiData.handle });
                  }
                }}
                isRaygunActive={activeRaygunSitchId === sitch.id}
                onCloseRaygun={() => setActiveRaygunSitchId(null)}
                onSelectVerb={() => {
                  setActiveRaygunSitchId(null);
                  onOpenPastChallengesModal && onOpenPastChallengesModal();
                }}
                onSelectAdverb={() => {
                  setActiveRaygunSitchId(null);
                  onOpenChallengeModal && onOpenChallengeModal();
                }}
                isPhoneReactionActive={activePhoneReactionSitchId === sitch.id}
                isInfluenceRatingActive={activeInfluenceRatingSitchId === sitch.id}
                onCloseInfluenceRating={() => setActiveInfluenceRatingSitchId(null)}
                isFaceoffOpen={Boolean(openFaceoffSitchPosts[sitch.id])}
                isMorphed={Boolean(morphedSitchPosts[sitch.id])}
                onToggleFaceoff={(id) =>
                  setOpenFaceoffSitchPosts((prev) => ({ ...prev, [id]: !prev[id] }))
                }
                onCloseFaceoff={(id) =>
                  setOpenFaceoffSitchPosts((prev) => ({ ...prev, [id]: false }))
                }
                onMorphPencil={(id) => {
                  setMorphedSitchPosts((prev) => ({ ...prev, [id]: true }));
                  setOpenFaceoffSitchPosts((prev) => ({ ...prev, [id]: true }));
                }}
                onNoAdverb={() => {}}
                onOpenStarStamps={() => {
                  setActiveInfluenceRatingSitchId(null);
                  onOpenStarStamps && onOpenStarStamps();
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* POST VIEWER (MATCHES HOME SCREEN POST LOOK WITH ALL ICONS ATTACHED) */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => {
            setSelectedPost(null);
            setActivePhoneReaction(false);
            setActiveInfluenceRating(false);
            setActiveRaygunAction(false);
            setIsFaceoffOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-3.5 sm:p-4 shadow-2xl space-y-2 border border-slate-100 max-h-[92vh] overflow-y-auto scrollbar-thin animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reaction Widget moved to the very top of post if triggered */}
            {activePhoneReaction && (
              <div className="w-full flex justify-center pt-0 pb-1 -mt-0.5">
                <PhoneReactionPopup />
              </div>
            )}

            {/* Broken Pencil Faceoff Battle Card */}
            {isFaceoffOpen && (
              <div className="w-full flex justify-center pt-0 pb-1.5 -mt-0.5">
                <FaceoffBattleModal
                  onClose={() => setIsFaceoffOpen(false)}
                  battleQuestion="Who looks Hotter between me Elena Vance or this loser Slimy sticky"
                  redParticipant={{
                    name: wikiData.name,
                    avatar: elenaAvatar,
                  }}
                  blueParticipant={{
                    name: 'Slimy sticky',
                    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                  }}
                />
              </div>
            )}

            {/* Influence Rating Modal if triggered */}
            {activeInfluenceRating && (
              <div className="w-full flex justify-center py-1">
                <InfluenceRatingModal
                  isOpen={true}
                  isInline={true}
                  onClose={() => setActiveInfluenceRating(false)}
                  onOpenStarStamps={() => {
                    setActiveInfluenceRating(false);
                    setSelectedPost(null);
                    onOpenStarStamps && onOpenStarStamps();
                  }}
                />
              </div>
            )}

            {/* Raygun Action Modal if triggered */}
            {activeRaygunAction && (
              <div className="w-full flex justify-center py-1">
                <RaygunActionModal
                  isOpen={true}
                  isInline={true}
                  targetPersonName={wikiData.name}
                  targetPersonAvatar={elenaAvatar}
                  onClose={() => setActiveRaygunAction(false)}
                  onSelectVerb={() => {
                    setActiveRaygunAction(false);
                    setSelectedPost(null);
                    setRaygunTarget && setRaygunTarget({ name: wikiData.name, avatar: elenaAvatar, handle: wikiData.handle });
                    onOpenPastChallengesModal && onOpenPastChallengesModal();
                  }}
                  onSelectAdverb={() => {
                    setActiveRaygunAction(false);
                    setSelectedPost(null);
                    setRaygunTarget && setRaygunTarget({ name: wikiData.name, avatar: elenaAvatar, handle: wikiData.handle });
                    onOpenChallengeModal && onOpenChallengeModal();
                  }}
                />
              </div>
            )}

            {/* 1. Trending Tag with Flame placed directly on top of the person profile pic */}
            {selectedPost.isPinned && (
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
                  {activeUser.avatarUrl ? (
                    <img
                      src={activeUser.avatarUrl}
                      alt={wikiData.name}
                      onClick={() => setActivePhoneReaction(!activePhoneReaction)}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
                    />
                  ) : activeUser.name.toLowerCase().includes('elena') && !activeUser.name.toLowerCase().includes('allen') ? (
                    <img
                      src={elenaAvatar}
                      alt={wikiData.name}
                      onClick={() => setActivePhoneReaction(!activePhoneReaction)}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-600/30 p-0.5 shadow-xs cursor-pointer hover:ring-purple-600/60 transition-all"
                    />
                  ) : (
                    <div
                      onClick={() => setActivePhoneReaction(!activePhoneReaction)}
                      className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center p-0.5 shadow-xs cursor-pointer hover:border-slate-400 transition-all"
                    >
                      <User className="w-5 h-5 text-slate-400 stroke-[1.6]" />
                    </div>
                  )}
                  {/* Flame Badge directly on top of the profile pic */}
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center ring-1.5 ring-white shadow-2xs"
                    title="Trending Creator"
                  >
                    <AeriFlameIcon filled className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[13px] font-black text-slate-900 tracking-tight">
                      {wikiData.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                  </div>
                  <span className="text-[10.5px] font-medium text-slate-500 mt-0.5">
                    {wikiData.handle} &middot; {selectedPost.timeAgo} &middot; Kyoto, Japan
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Follow button morphs into pure broken pencil icon */}
                {isFaceoffOpen ? (
                  <div
                    onClick={() => setIsFaceoffOpen(!isFaceoffOpen)}
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
                    onClick={() => setIsFaceoffOpen(true)}
                    className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3 text-purple-600" />
                    <span>Follow</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  aria-label="Close"
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* 3. Post Card: Image or Video */}
            <div className="relative w-full h-[36vh] min-h-[200px] max-h-[300px] rounded-[18px] overflow-hidden bg-black shadow-xs shrink-0 group">
              {selectedPost.mediaType === 'video' ? (
                <video
                  src={selectedPost.mediaUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={selectedPost.mediaUrl}
                  alt={selectedPost.caption}
                  className="w-full h-full object-cover object-center"
                />
              )}

              <div className="absolute right-3 bottom-3 bg-white/75 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/40 pointer-events-none">
                <Music className="w-3 h-3 text-slate-800" />
                <span className="text-[9.5px] font-semibold text-slate-900 tracking-tight">
                  {selectedPost.audioTitle || 'Original Audio'}
                </span>
              </div>
            </div>

            {/* 4. Action Row (Exact icons from home screen) */}
            <div className="flex items-end justify-between pt-1.5 shrink-0 text-black w-full max-w-full overflow-hidden">
              {/* All icons grouped closely together on the left */}
              <div className="flex items-end gap-1.5 sm:gap-2 min-w-0">
                {/* Left 3 icons: Flame, Comment, Honeyjar (standard untouched spacing) */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 pb-0.5 shrink-0">
                  <button
                    onClick={() => handleTogglePostLike(selectedPost.id)}
                    className="cursor-pointer transition-transform active:scale-90"
                    aria-label="Like post"
                  >
                    <AeriFlameIcon
                      filled={selectedPost.isLiked}
                      className={`w-5.5 h-5.5 transition-colors ${
                        selectedPost.isLiked
                          ? 'text-[#FF6D00]'
                          : 'text-[#FF6D00] stroke-[1.8]'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      const commInput = document.getElementById('selected-post-comment-input');
                      commInput?.focus();
                    }}
                    className="cursor-pointer transition-transform active:scale-90 hover:opacity-75"
                    aria-label="Comments"
                  >
                    <AeriCommentIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                  </button>

                  {/* 3rd icon: Honey jar icon (Fairy Pot) */}
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      setActiveTab('honeyjar');
                    }}
                    className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                    aria-label="Honey Jar / Fairy Pot"
                    title="View My Sitch & Tweets"
                  >
                    <FairyPotIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                  </button>
                </div>

                {/* Pill & Two Icons column */}
                <div className="flex flex-col items-start gap-1 min-w-0">
                  {/* Long gray pill like icon with "Send me message" */}
                  <button
                    onClick={() =>
                      onOpenSendPersonMessage({
                        id: 'p-elena',
                        name: wikiData.name,
                        handle: wikiData.handle,
                        avatarUrl: elenaAvatar,
                      })
                    }
                    className="cursor-pointer px-2.5 sm:px-3 py-1 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-black hover:text-black rounded-full text-[10px] sm:text-[10.5px] font-semibold flex items-center justify-center gap-1 border border-slate-300 shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                    title={`Send ${wikiData.name} message`}
                    aria-label="Send me message"
                  >
                    <AeriMessageBubbleIcon className="w-3.5 h-3.5 text-black shrink-0" color="#000000" />
                    <span className="text-black font-semibold">Send me message</span>
                  </button>

                  {/* Only those two icons moved slightly more to the right */}
                  <div className="flex items-center gap-2 ml-1 sm:ml-1.5">
                    {/* 4th icon: Hand holding smartphone */}
                    <button
                      onClick={() => setActivePhoneReaction(!activePhoneReaction)}
                      className="cursor-pointer transition-transform active:scale-90 hover:opacity-75 flex items-center justify-center p-0.5"
                      title="Smartphone / Social Reach"
                      aria-label="Smartphone"
                    >
                      <AeriHandPhoneIcon className="w-5.5 h-5.5 text-black stroke-[1.8]" />
                    </button>

                    {/* 5th icon: Masked 2 eyes */}
                    <button
                      onClick={() => setActiveInfluenceRating(!activeInfluenceRating)}
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
                  {selectedPost.likeCount.toLocaleString()} likes
                </span>
              </div>
            </div>

            {/* 5. Post Writing & Caption */}
            <div className="pt-0.5 pb-1 px-0.5 shrink-0">
              <div className="flex items-start gap-2">
                <img
                  src={elenaAvatar}
                  alt={wikiData.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-purple-500/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-snug text-slate-800">
                    <span className="font-black text-slate-900 mr-1.5">{wikiData.handle}</span>
                    {selectedPost.caption}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-bold text-[#8B2FC9]">
                    {selectedPost.tags.map((t, idx) => (
                      <span key={idx} className="hover:underline cursor-pointer">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                    {selectedPost.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Comments Section & Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="max-h-36 overflow-y-auto space-y-2 text-xs scrollbar-thin pr-1">
                {selectedPost.comments.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">
                    No comments yet. Be the first to drop thoughts!
                  </p>
                ) : (
                  selectedPost.comments.map((comm) => (
                    <div key={comm.id} className="flex items-start gap-2">
                      <img
                        src={comm.avatar}
                        alt={comm.author}
                        className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-800 leading-snug">
                          <span className="font-bold text-slate-900 mr-1">{comm.handle}</span>
                          {comm.text}
                        </p>
                        <span className="text-[9px] text-slate-400">{comm.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <input
                  id="selected-post-comment-input"
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Drop a comment..."
                  className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Reply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FAIRYPEDIA INFO MODAL */}
      {isEditWikiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsEditWikiModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#EBF2F8] border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-purple-600" />
                  <span>Fairypedia</span>
                </h3>
                <p className="text-[11px] text-slate-600 font-serif">
                  Contribute your personal Fairypedia encyclopedia facts, trivia, and bio
                </p>
              </div>
              <button
                onClick={() => setIsEditWikiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-black rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveWikiData} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs scrollbar-thin">
              {/* Basic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Creator Handle</label>
                  <input
                    type="text"
                    value={editFormData.handle}
                    onChange={(e) => setEditFormData({ ...editFormData, handle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Profession / Headline */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Profession / Role</label>
                <input
                  type="text"
                  value={editFormData.profession}
                  onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Birthdate, Age, Sign, Birthplace */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Birthday</label>
                  <input
                    type="text"
                    value={editFormData.birthdate}
                    onChange={(e) => setEditFormData({ ...editFormData, birthdate: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={editFormData.age}
                    onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Birth Sign</label>
                  <input
                    type="text"
                    value={editFormData.birthSign}
                    onChange={(e) => setEditFormData({ ...editFormData, birthSign: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Birthplace</label>
                  <input
                    type="text"
                    value={editFormData.birthplace}
                    onChange={(e) => setEditFormData({ ...editFormData, birthplace: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Fairypedia Bio Overview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">1. Fairypedia About & Bio Narrative</label>
                <textarea
                  rows={3}
                  value={editFormData.bioOverview}
                  onChange={(e) => setEditFormData({ ...editFormData, bioOverview: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Fairypedia Early Life */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">2. Early Life & Career Breakthrough</label>
                <textarea
                  rows={3}
                  value={editFormData.beforeFame}
                  onChange={(e) => setEditFormData({ ...editFormData, beforeFame: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Trivia Bullet Points */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">3. Trivia & Fast Facts</label>
                <div className="space-y-1.5 mb-2">
                  {editFormData.triviaList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-purple-600 font-mono">[{idx + 1}]</span>
                      <span className="flex-1 text-[11px] text-slate-700">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTriviaItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTriviaInput}
                    onChange={(e) => setNewTriviaInput(e.target.value)}
                    placeholder="Add a new fun fact or milestone..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTriviaItem}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditWikiModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Fairypedia Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Settings Modal fallback */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
          <SettingsScreen
            onBack={() => setIsSettingsOpen(false)}
            onOpenDMControl={() => {
              setIsSettingsOpen(false);
              onBackToFeed();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfileScreen;
