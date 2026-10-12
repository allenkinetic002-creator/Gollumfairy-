import React, { useState } from 'react';
import {
  Search,
  Check,
  Plus,
  Trash2,
  Rocket,
  Sparkles,
  SlidersHorizontal,
  Shield,
  ArrowRight,
  Filter,
  Flame,
  Star,
  Users,
  Tag,
  CheckCircle2,
  X,
  RefreshCw,
  Bell,
  Eye,
  Activity,
} from 'lucide-react';

interface FairyControlProps {
  onBackToFeed: () => void;
  onSwitchToDMs?: () => void;
}

// Shared Category & Genre List for both SUPPORT and GENRE systems
export interface FairyCategoryItem {
  id: string;
  label: string;
  desc: string;
  userCount: number;
}

export const FAIRY_SHARED_CATEGORIES: FairyCategoryItem[] = [
  { id: 'rising', label: 'Rising Creators (<1,000 followers)', desc: 'Talented voices building their early following', userCount: 7840 },
  { id: 'debut', label: 'First-Week Debut Posts', desc: 'Fresh accounts publishing their inaugural work', userCount: 4120 },
  { id: 'indie-art', label: 'Indie Illustrators & Designers', desc: 'Original concept art, graphics, and visual worldbuilders', userCount: 5620 },
  { id: 'lore', label: 'Underdog Writers & Lore Keepers', desc: 'Narrative fiction, essays, and worldbuilding lore', userCount: 3110 },
  { id: 'audio', label: 'Emerging Audio & Beatmakers', desc: 'Independent sound designers and electronic producers', userCount: 2890 },
  { id: 'community', label: 'Community Discussion Sparks', desc: 'Thoughtful conversation starters and feedback seekers', userCount: 1940 },
  { id: 'wip', label: 'Work-In-Progress Creators', desc: 'Transparent process shares, studies, and breakdowns', userCount: 2430 },
];

export const SUPPORT_CATEGORIES = FAIRY_SHARED_CATEGORIES;
export const GENRE_CATEGORIES = FAIRY_SHARED_CATEGORIES;

export interface CommunityMemberActivation {
  id: string;
  name: string;
  handle: string;
  avatarBg: string;
  avatarInitial: string;
  bio: string;
  activatedFeatures: {
    support: boolean;
    favorite: boolean;
    trending: boolean;
    loyalty: boolean;
    genre: boolean;
  };
  metrics: {
    supporters: number;
    favorites: number;
    trendScore: number;
    loyaltyMembers: number;
    genrePosts: number;
  };
  defaultMetrics?: {
    supporters: number;
    favorites: number;
    trendScore: number;
    loyaltyMembers: number;
    genrePosts: number;
  };
}

export const COMMUNITY_ACTIVATORS: CommunityMemberActivation[] = [
  {
    id: 'act-1',
    name: 'Elena Rostova',
    handle: '@elena_rostova',
    avatarBg: 'bg-rose-500',
    avatarInitial: 'E',
    bio: 'Fashion worldbuilder & visual designer',
    activatedFeatures: { support: true, favorite: true, trending: true, loyalty: true, genre: true },
    metrics: { supporters: 1840, favorites: 4810, trendScore: 48200, loyaltyMembers: 1240, genrePosts: 24 },
    defaultMetrics: { supporters: 1840, favorites: 4810, trendScore: 48200, loyaltyMembers: 1240, genrePosts: 24 },
  },
  {
    id: 'act-2',
    name: 'Marcus Chen',
    handle: '@marcus_visuals',
    avatarBg: 'bg-indigo-600',
    avatarInitial: 'M',
    bio: '3D concept art & real-time lighting',
    activatedFeatures: { support: true, favorite: true, trending: false, loyalty: true, genre: true },
    metrics: { supporters: 920, favorites: 2350, trendScore: 0, loyaltyMembers: 610, genrePosts: 19 },
    defaultMetrics: { supporters: 920, favorites: 2350, trendScore: 31500, loyaltyMembers: 610, genrePosts: 19 },
  },
  {
    id: 'act-3',
    name: 'Clara Vance',
    handle: '@clara_design',
    avatarBg: 'bg-emerald-600',
    avatarInitial: 'C',
    bio: 'Kinetic typography & generative visuals',
    activatedFeatures: { support: true, favorite: true, trending: true, loyalty: true, genre: false },
    metrics: { supporters: 1150, favorites: 1890, trendScore: 21900, loyaltyMembers: 860, genrePosts: 0 },
    defaultMetrics: { supporters: 1150, favorites: 1890, trendScore: 21900, loyaltyMembers: 860, genrePosts: 16 },
  },
  {
    id: 'act-4',
    name: 'Zack Thorne',
    handle: '@zack_beats',
    avatarBg: 'bg-amber-600',
    avatarInitial: 'Z',
    bio: 'Modular synthesis & dark ambient sound',
    activatedFeatures: { support: false, favorite: true, trending: true, loyalty: false, genre: true },
    metrics: { supporters: 0, favorites: 1430, trendScore: 32600, loyaltyMembers: 0, genrePosts: 32 },
    defaultMetrics: { supporters: 760, favorites: 1430, trendScore: 32600, loyaltyMembers: 480, genrePosts: 32 },
  },
  {
    id: 'act-5',
    name: 'Maya Lin',
    handle: '@maya_crafts',
    avatarBg: 'bg-pink-600',
    avatarInitial: 'M',
    bio: 'Ceramic studies & tactile material design',
    activatedFeatures: { support: true, favorite: false, trending: false, loyalty: false, genre: true },
    metrics: { supporters: 340, favorites: 0, trendScore: 0, loyaltyMembers: 0, genrePosts: 5 },
    defaultMetrics: { supporters: 340, favorites: 890, trendScore: 12400, loyaltyMembers: 220, genrePosts: 5 },
  },
  {
    id: 'act-6',
    name: 'Leo Sterling',
    handle: '@leo_words',
    avatarBg: 'bg-blue-600',
    avatarInitial: 'L',
    bio: 'Speculative fiction & lore architecture',
    activatedFeatures: { support: true, favorite: false, trending: true, loyalty: true, genre: true },
    metrics: { supporters: 780, favorites: 0, trendScore: 14500, loyaltyMembers: 310, genrePosts: 14 },
    defaultMetrics: { supporters: 780, favorites: 960, trendScore: 14500, loyaltyMembers: 310, genrePosts: 14 },
  },
  {
    id: 'act-7',
    name: 'Nova Sparks',
    handle: '@nova_sparks',
    avatarBg: 'bg-purple-600',
    avatarInitial: 'N',
    bio: 'Procedural graphics & visual coding',
    activatedFeatures: { support: true, favorite: true, trending: false, loyalty: true, genre: true },
    metrics: { supporters: 890, favorites: 1220, trendScore: 0, loyaltyMembers: 420, genrePosts: 17 },
    defaultMetrics: { supporters: 890, favorites: 1220, trendScore: 28400, loyaltyMembers: 420, genrePosts: 17 },
  },
  {
    id: 'act-8',
    name: 'Liam Patel',
    handle: '@liam_3d',
    avatarBg: 'bg-teal-600',
    avatarInitial: 'L',
    bio: 'Real-time procedural 3D environments',
    activatedFeatures: { support: false, favorite: true, trending: false, loyalty: true, genre: true },
    metrics: { supporters: 0, favorites: 1650, trendScore: 0, loyaltyMembers: 540, genrePosts: 12 },
    defaultMetrics: { supporters: 620, favorites: 1650, trendScore: 17800, loyaltyMembers: 540, genrePosts: 12 },
  },
  {
    id: 'act-9',
    name: 'Amara Sol',
    handle: '@amara_sol',
    avatarBg: 'bg-yellow-600',
    avatarInitial: 'A',
    bio: 'Documentary photography & natural light studies',
    activatedFeatures: { support: true, favorite: false, trending: true, loyalty: false, genre: true },
    metrics: { supporters: 1420, favorites: 0, trendScore: 19800, loyaltyMembers: 0, genrePosts: 29 },
    defaultMetrics: { supporters: 1420, favorites: 1100, trendScore: 19800, loyaltyMembers: 390, genrePosts: 29 },
  },
  {
    id: 'act-10',
    name: 'Finnick O’Reilly',
    handle: '@finnick_lore',
    avatarBg: 'bg-slate-700',
    avatarInitial: 'F',
    bio: 'Speculative sci-fi worldbuilder',
    activatedFeatures: { support: false, favorite: false, trending: false, loyalty: false, genre: false },
    metrics: { supporters: 0, favorites: 0, trendScore: 0, loyaltyMembers: 0, genrePosts: 0 },
    defaultMetrics: { supporters: 510, favorites: 720, trendScore: 11200, loyaltyMembers: 190, genrePosts: 8 },
  },
];

const INITIAL_GROWING_CREATORS = [
  { id: 'grow-1', name: 'Maya Lin', handle: '@maya_crafts', followers: '340', tag: 'Debut Week', boosted: false },
  { id: 'grow-2', name: 'Leo Sterling', handle: '@leo_words', followers: '780', tag: 'Indie Writer', boosted: false },
  { id: 'grow-3', name: 'Kora Sound', handle: '@kora_beats', followers: '920', tag: 'Emerging Audio', boosted: false },
];

// Favorite Initial List
const INITIAL_FAVORITES = [
  { id: 'fav-1', name: 'Elena Rostova', handle: '@elena_rostova', role: 'Fashion & Visuals', notify: true },
  { id: 'fav-2', name: 'Marcus Chen', handle: '@marcus_visuals', role: '3D Concept Art', notify: true },
  { id: 'fav-3', name: 'Clara Vance', handle: '@clara_design', role: 'UI & Motion', notify: false },
];

// Trending Initial Topics
const INITIAL_TRENDS = [
  { id: 'tr-1', tag: '#FairyAesthetics', velocity: 48200, rank: 1, boosted: false },
  { id: 'tr-2', tag: '#IndieMotion2026', velocity: 32600, rank: 2, boosted: false },
  { id: 'tr-3', tag: '#SpringEditorial', velocity: 21900, rank: 3, boosted: false },
  { id: 'tr-4', tag: '#MinimalSoundscapes', velocity: 14500, rank: 4, boosted: false },
];

// Loyalty People Directory
const INITIAL_LOYALTY_ROSTER = [
  { id: 'loy-1', name: 'Elena Rostova', handle: '@elena_rostova', tier: 'Gold Tier', streak: 42 },
  { id: 'loy-2', name: 'Clara Vance', handle: '@clara_design', tier: 'Silver Tier', streak: 19 },
];

const SEARCHABLE_CREATORS = [
  { id: 's-1', name: 'Zack Thorne', handle: '@zack_beats', bio: 'Electronic music producer & sound designer' },
  { id: 's-2', name: 'Nova Sparks', handle: '@nova_sparks', bio: 'Generative art & typographic explorations' },
  { id: 's-3', name: 'Liam Patel', handle: '@liam_3d', bio: 'Real-time procedural 3D environments' },
  { id: 's-4', name: 'Amara Sol', handle: '@amara_sol', bio: 'Documentary photography & natural light studies' },
  { id: 's-5', name: 'Finnick O’Reilly', handle: '@finnick_lore', bio: 'Speculative sci-fi worldbuilder' },
];

export function FairyControl({ onBackToFeed, onSwitchToDMs }: FairyControlProps) {
  // =========================================================================
  // 5 COMPLETELY INDEPENDENT SWITCH STATES
  // =========================================================================
  const [supportEnabled, setSupportEnabled] = useState(false);
  const [favoriteEnabled, setFavoriteEnabled] = useState(false);
  const [trendingEnabled, setTrendingEnabled] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [genreEnabled, setGenreEnabled] = useState(false);

  // Active count for top status chip
  const activeSystemsCount = [
    supportEnabled,
    favoriteEnabled,
    trendingEnabled,
    loyaltyEnabled,
    genreEnabled,
  ].filter(Boolean).length;

  // Community Activators State & Inline Card Drawers
  const [activators, setActivators] = useState<CommunityMemberActivation[]>(COMMUNITY_ACTIVATORS);
  const [isCommunityActivatorsOpen, setIsCommunityActivatorsOpen] = useState(false);
  const [activatorFilter, setActivatorFilter] = useState<
    'all' | 'support' | 'favorite' | 'trending' | 'loyalty' | 'genre'
  >('all');
  const [activatorStatusFilter, setActivatorStatusFilter] = useState<
    'all' | 'activated' | 'not_activated'
  >('all');
  const [activatorSearch, setActivatorSearch] = useState('');

  // Inline drawer state for each of the 5 cards
  const [expandedCardDrawer, setExpandedCardDrawer] = useState<
    'support' | 'favorite' | 'trending' | 'loyalty' | 'genre' | null
  >(null);
  const [cardDrawerFilter, setCardDrawerFilter] = useState<
    'all' | 'activated' | 'not_activated'
  >('all');
  const [drawerSearch, setDrawerSearch] = useState('');

  // Baseline community numbers
  const TOTAL_COMMUNITY_MEMBERS = 30000;
  const TOTAL_TRENDING_MEMBERS = 45000;

  const sampleSupportActive = activators.filter((p) => p.activatedFeatures.support).length;
  const sampleFavoriteActive = activators.filter((p) => p.activatedFeatures.favorite).length;
  const sampleTrendingActive = activators.filter((p) => p.activatedFeatures.trending).length;
  const sampleLoyaltyActive = activators.filter((p) => p.activatedFeatures.loyalty).length;
  const sampleGenreActive = activators.filter((p) => p.activatedFeatures.genre).length;

  const supportUsersCount = 18420 + (supportEnabled ? 1 : 0) + (sampleSupportActive - 6) * 45;
  const favoriteUsersCount = 24190 + (favoriteEnabled ? 1 : 0) + (sampleFavoriteActive - 5) * 60;
  const trendingUsersCount = 31850 + (trendingEnabled ? 1 : 0) + (sampleTrendingActive - 4) * 80;
  const loyaltyUsersCount = 12740 + (loyaltyEnabled ? 1 : 0) + (sampleLoyaltyActive - 4) * 35;
  const genreUsersCount = 16930 + (genreEnabled ? 1 : 0) + (sampleGenreActive - 6) * 50;

  const supportInactiveCount = Math.max(0, TOTAL_COMMUNITY_MEMBERS - supportUsersCount);
  const favoriteInactiveCount = Math.max(0, TOTAL_COMMUNITY_MEMBERS - favoriteUsersCount);
  const trendingInactiveCount = Math.max(0, TOTAL_TRENDING_MEMBERS - trendingUsersCount);
  const loyaltyInactiveCount = Math.max(0, TOTAL_COMMUNITY_MEMBERS - loyaltyUsersCount);
  const genreInactiveCount = Math.max(0, TOTAL_COMMUNITY_MEMBERS - genreUsersCount);

  // Toggle person feature activation interactively
  const togglePersonFeature = (
    personId: string,
    feature: 'support' | 'favorite' | 'trending' | 'loyalty' | 'genre'
  ) => {
    setActivators((prev) =>
      prev.map((person) => {
        if (person.id !== personId) return person;
        const willBeActive = !person.activatedFeatures[feature];
        const defaults = person.defaultMetrics || person.metrics;
        const updatedMetrics = { ...person.metrics };

        if (feature === 'support') {
          updatedMetrics.supporters = willBeActive ? (defaults.supporters || 850) : 0;
        } else if (feature === 'favorite') {
          updatedMetrics.favorites = willBeActive ? (defaults.favorites || 1200) : 0;
        } else if (feature === 'trending') {
          updatedMetrics.trendScore = willBeActive ? (defaults.trendScore || 18000) : 0;
        } else if (feature === 'loyalty') {
          updatedMetrics.loyaltyMembers = willBeActive ? (defaults.loyaltyMembers || 350) : 0;
        } else if (feature === 'genre') {
          updatedMetrics.genrePosts = willBeActive ? (defaults.genrePosts || 12) : 0;
        }

        return {
          ...person,
          activatedFeatures: {
            ...person.activatedFeatures,
            [feature]: willBeActive,
          },
          metrics: updatedMetrics,
        };
      })
    );
  };

  const filteredActivators = activators.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(activatorSearch.toLowerCase()) ||
      person.handle.toLowerCase().includes(activatorSearch.toLowerCase()) ||
      person.bio.toLowerCase().includes(activatorSearch.toLowerCase());

    if (!matchesSearch) return false;

    // Feature filter
    let matchesFeature = true;
    if (activatorFilter === 'support') matchesFeature = person.activatedFeatures.support;
    else if (activatorFilter === 'favorite') matchesFeature = person.activatedFeatures.favorite;
    else if (activatorFilter === 'trending') matchesFeature = person.activatedFeatures.trending;
    else if (activatorFilter === 'loyalty') matchesFeature = person.activatedFeatures.loyalty;
    else if (activatorFilter === 'genre') matchesFeature = person.activatedFeatures.genre;

    // Status filter: All | Activated | Not Activated
    let matchesStatus = true;
    if (activatorStatusFilter === 'activated') {
      if (activatorFilter === 'all') {
        matchesStatus = Object.values(person.activatedFeatures).some(Boolean);
      } else {
        matchesStatus = person.activatedFeatures[activatorFilter];
      }
    } else if (activatorStatusFilter === 'not_activated') {
      if (activatorFilter === 'all') {
        matchesStatus = Object.values(person.activatedFeatures).some((v) => !v);
      } else {
        matchesStatus = !person.activatedFeatures[activatorFilter];
      }
    }

    return matchesFeature && matchesStatus;
  });

  // Reusable helper to render activation status, user numbers, and people drawer inside each card
  const renderCardActivationDrawer = (
    systemKey: 'support' | 'favorite' | 'trending' | 'loyalty' | 'genre',
    systemName: string,
    circleColor: string,
    activeCount: number,
    inactiveCount: number,
    totalBase: number,
    metricColor: string
  ) => {
    const isExpanded = expandedCardDrawer === systemKey;
    const activePeopleCount = activators.filter((p) => p.activatedFeatures[systemKey]).length;
    const inactivePeopleCount = activators.filter((p) => !p.activatedFeatures[systemKey]).length;

    const drawerPeople = activators.filter((p) => {
      if (cardDrawerFilter === 'activated' && !p.activatedFeatures[systemKey]) return false;
      if (cardDrawerFilter === 'not_activated' && p.activatedFeatures[systemKey]) return false;
      if (drawerSearch.trim()) {
        const q = drawerSearch.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    const activePercent = Math.min(100, Math.max(0, (activeCount / totalBase) * 100)).toFixed(1);
    const inactivePercent = Math.min(100, Math.max(0, (inactiveCount / totalBase) * 100)).toFixed(1);

    return (
      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
        {/* Header row with activation status and toggle */}
        <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Users className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-extrabold text-slate-800">
              User Numbers &amp; Activation:
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700">{activeCount.toLocaleString()}</strong> Activated ·{' '}
              <strong className="text-slate-500">{inactiveCount.toLocaleString()}</strong> Not Activated
            </span>
          </div>

          <button
            onClick={() => {
              setExpandedCardDrawer(isExpanded ? null : systemKey);
              setCardDrawerFilter('all');
            }}
            className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs ${
              isExpanded
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Inspect users who activated or did not activate this feature"
          >
            <Eye className="w-3 h-3" />
            {isExpanded
              ? 'Hide Users'
              : `See Users (${activePeopleCount} Activated · ${inactivePeopleCount} Inactive)`}
          </button>
        </div>

        {/* Proportional activation ratio bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
            <div
              className={`${circleColor} h-full transition-all duration-300`}
              style={{ width: `${activePercent}%` }}
            />
            <div
              className="bg-slate-300 h-full transition-all duration-300"
              style={{ width: `${inactivePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <span className={`w-1.5 h-1.5 rounded-full ${circleColor}`} />
              {activePercent}% Activated ({activeCount.toLocaleString()})
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {inactivePercent}% Not Activated ({inactiveCount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Expanded inline people list */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-200 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-1 text-[10px] font-extrabold">
                <button
                  onClick={() => setCardDrawerFilter('all')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    cardDrawerFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All ({activators.length})
                </button>
                <button
                  onClick={() => setCardDrawerFilter('activated')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                    cardDrawerFilter === 'activated'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Activated ({activePeopleCount}) · With User Numbers
                </button>
                <button
                  onClick={() => setCardDrawerFilter('not_activated')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                    cardDrawerFilter === 'not_activated'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Not Activated ({inactivePeopleCount})
                </button>
              </div>

              <span className="text-[9.5px] text-slate-500 font-medium">
                Toggle to test live numbers
              </span>
            </div>

            {/* Live Search inside drawer */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder={`Search users on ${systemName} by name, @handle, or craft...`}
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-600 shadow-2xs"
              />
              {drawerSearch && (
                <button
                  onClick={() => setDrawerSearch('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
              {drawerPeople.map((person) => {
                const isFeatureActive = person.activatedFeatures[systemKey];
                let userNumberText = '';
                if (systemKey === 'support') {
                  userNumberText = isFeatureActive
                    ? `${person.metrics.supporters.toLocaleString()} supporters`
                    : '0 supporters';
                } else if (systemKey === 'favorite') {
                  userNumberText = isFeatureActive
                    ? `${person.metrics.favorites.toLocaleString()} favorites`
                    : '0 favorites';
                } else if (systemKey === 'trending') {
                  userNumberText = isFeatureActive
                    ? `${(person.metrics.trendScore / 1000).toFixed(1)}k trend velocity`
                    : '0 velocity';
                } else if (systemKey === 'loyalty') {
                  userNumberText = isFeatureActive
                    ? `${person.metrics.loyaltyMembers.toLocaleString()} loyalty members`
                    : '0 loyalty members';
                } else if (systemKey === 'genre') {
                  userNumberText = isFeatureActive
                    ? `${person.metrics.genrePosts} classified genre posts`
                    : '0 posts';
                }

                return (
                  <div
                    key={person.id}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      isFeatureActive
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/60 border-slate-200/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full ${person.avatarBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {person.avatarInitial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-slate-900 truncate">
                            {person.name}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">
                            {person.handle}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {isFeatureActive ? (
                            <span className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md ${metricColor} flex items-center gap-1 shadow-2xs`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              Activated · 👥 {userNumberText}
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Not Activated · {userNumberText}
                            </span>
                          )}
                          <span className="text-[9.5px] text-slate-400 truncate">
                            {person.bio}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePersonFeature(person.id, systemKey)}
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        isFeatureActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                      title={`Toggle ${systemName} for ${person.name}`}
                    >
                      {isFeatureActive ? 'Activated ✓' : '+ Activate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // 1. SUPPORT System Internal State (Red)
  // -------------------------------------------------------------------------
  const [selectedSupportCategories, setSelectedSupportCategories] = useState<string[]>([
    'rising',
    'debut',
    'indie-art',
  ]);
  const [growingCreators, setGrowingCreators] = useState(INITIAL_GROWING_CREATORS);
  const [supportBoostsLeft, setSupportBoostsLeft] = useState(5);
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [supportSearchCategory, setSupportSearchCategory] = useState<string>('all');
  const [supportedUserIds, setSupportedUserIds] = useState<string[]>(['act-1', 'act-5']);

  const toggleSupportCategory = (categoryId: string) => {
    setSelectedSupportCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToggleSupportUser = (personId: string, personName: string) => {
    const isCurrentlySupported = supportedUserIds.includes(personId);
    if (isCurrentlySupported) {
      setSupportedUserIds((prev) => prev.filter((id) => id !== personId));
      setSupportFeedback(`Stopped supporting ${personName}.`);
    } else {
      setSupportedUserIds((prev) => [...prev, personId]);
      // Increment supporter count for that person in activators
      setActivators((prev) =>
        prev.map((p) =>
          p.id === personId
            ? {
                ...p,
                metrics: {
                  ...p.metrics,
                  supporters: p.metrics.supporters + 1,
                },
                defaultMetrics: {
                  ...(p.defaultMetrics || p.metrics),
                  supporters: (p.defaultMetrics?.supporters || p.metrics.supporters) + 1,
                },
              }
            : p
        )
      );
      setSupportFeedback(`🎉 Now supporting ${personName}! Added to your support network.`);
    }
    setTimeout(() => setSupportFeedback(null), 3000);
  };

  const handleBoostCreator = (id: string, name: string) => {
    if (supportBoostsLeft <= 0) {
      setSupportFeedback('No daily boosts left today. Refreshes at midnight!');
      setTimeout(() => setSupportFeedback(null), 3000);
      return;
    }
    setGrowingCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, boosted: true } : c))
    );
    // Also bump activators supporter count
    setActivators((prev) =>
      prev.map((p) =>
        p.id === id || p.name.toLowerCase() === name.toLowerCase()
          ? {
              ...p,
              metrics: { ...p.metrics, supporters: p.metrics.supporters + 1 },
            }
          : p
      )
    );
    setSupportBoostsLeft((prev) => Math.max(0, prev - 1));
    setSupportFeedback(`Sent +1 Support Boost to ${name}!`);
    setTimeout(() => setSupportFeedback(null), 3000);
  };

  const filteredSupportUsers = activators.filter((person) => {
    const q = supportSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      person.name.toLowerCase().includes(q) ||
      person.handle.toLowerCase().includes(q) ||
      person.bio.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (supportSearchCategory === 'all') return true;
    if (supportSearchCategory === 'supported') return supportedUserIds.includes(person.id);
    if (supportSearchCategory === 'active') return person.activatedFeatures.support;
    if (supportSearchCategory === 'emerging') return person.metrics.supporters < 1000;
    return true;
  });

  // -------------------------------------------------------------------------
  // 2. FAVORITE System Internal State (Pink)
  // -------------------------------------------------------------------------
  const [favoritesList, setFavoritesList] = useState(INITIAL_FAVORITES);
  const [newFavHandle, setNewFavHandle] = useState('');
  const [favNotificationPriority, setFavNotificationPriority] = useState(true);
  const [favStarBadge, setFavStarBadge] = useState(true);
  const [favoriteFeedback, setFavoriteFeedback] = useState<string | null>(null);

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFavHandle.trim()) return;
    const cleanHandle = newFavHandle.startsWith('@')
      ? newFavHandle.trim()
      : `@${newFavHandle.trim()}`;
    const cleanName = cleanHandle.replace('@', '').replace(/_/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    if (favoritesList.some((f) => f.handle.toLowerCase() === cleanHandle.toLowerCase())) {
      setFavoriteFeedback(`${cleanHandle} is already in your Favorites.`);
      setTimeout(() => setFavoriteFeedback(null), 3000);
      return;
    }

    const newFav = {
      id: `fav-${Date.now()}`,
      name: formattedName,
      handle: cleanHandle,
      role: 'Favorite Creator',
      notify: true,
    };
    setFavoritesList([newFav, ...favoritesList]);
    setNewFavHandle('');
    setFavoriteFeedback(`Added ${cleanHandle} to your Favorites!`);
    setTimeout(() => setFavoriteFeedback(null), 3000);
  };

  const handleRemoveFavorite = (id: string, name: string) => {
    setFavoritesList((prev) => prev.filter((f) => f.id !== id));
    setFavoriteFeedback(`Removed ${name} from Favorites.`);
    setTimeout(() => setFavoriteFeedback(null), 2500);
  };

  // -------------------------------------------------------------------------
  // 3. TRENDING System Internal State (Orange)
  // -------------------------------------------------------------------------
  const [trends, setTrends] = useState(INITIAL_TRENDS);
  const [selectedTrendTarget, setSelectedTrendTarget] = useState('Current Spring Collection Post');
  const [customTrendInput, setCustomTrendInput] = useState('');
  const [trendFeedback, setTrendFeedback] = useState<string | null>(null);
  const [trendVelocityBoosted, setTrendVelocityBoosted] = useState(false);

  const handleMakeTrending = () => {
    const target = customTrendInput.trim() || selectedTrendTarget;
    setTrendVelocityBoosted(true);
    setTrendFeedback(`Pushed "${target}" into Trend radar (+500 Trend Velocity)!`);

    // Add or bump trend
    const existing = trends.find((t) => t.tag.toLowerCase() === target.toLowerCase());
    if (existing) {
      setTrends((prev) =>
        prev.map((t) =>
          t.id === existing.id
            ? { ...t, velocity: t.velocity + 1500, boosted: true }
            : t
        )
      );
    } else {
      const formattedTag = target.startsWith('#') ? target : `#${target.replace(/\s+/g, '')}`;
      const newTrend = {
        id: `tr-${Date.now()}`,
        tag: formattedTag,
        velocity: 18500,
        rank: trends.length + 1,
        boosted: true,
      };
      setTrends([newTrend, ...trends]);
    }

    setTimeout(() => setTrendFeedback(null), 3500);
  };

  const handleBoostTrendTag = (id: string, tag: string) => {
    setTrends((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, velocity: t.velocity + 850, boosted: true } : t
      )
    );
    setTrendFeedback(`Boosted velocity for ${tag}!`);
    setTimeout(() => setTrendFeedback(null), 2500);
  };

  // -------------------------------------------------------------------------
  // 4. LOYALTY System Internal State (Gold)
  // -------------------------------------------------------------------------
  const [loyaltySearch, setLoyaltySearch] = useState('');
  const [loyaltyRoster, setLoyaltyRoster] = useState(INITIAL_LOYALTY_ROSTER);
  const [loyaltyFeedback, setLoyaltyFeedback] = useState<string | null>(null);

  const filteredSearchPeople = SEARCHABLE_CREATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(loyaltySearch.toLowerCase()) ||
      c.handle.toLowerCase().includes(loyaltySearch.toLowerCase()) ||
      c.bio.toLowerCase().includes(loyaltySearch.toLowerCase())
  );

  const handleAddToLoyalty = (person: (typeof SEARCHABLE_CREATORS)[0]) => {
    if (loyaltyRoster.some((l) => l.handle.toLowerCase() === person.handle.toLowerCase())) {
      setLoyaltyFeedback(`${person.name} is already in your Loyalty roster.`);
      setTimeout(() => setLoyaltyFeedback(null), 3000);
      return;
    }
    const newLoyaltyMember = {
      id: `loy-${Date.now()}`,
      name: person.name,
      handle: person.handle,
      tier: 'Bronze Member',
      streak: 1,
    };
    setLoyaltyRoster([...loyaltyRoster, newLoyaltyMember]);
    setLoyaltyFeedback(`Added ${person.name} to Loyalty!`);
    setTimeout(() => setLoyaltyFeedback(null), 3000);
  };

  const handleRemoveLoyalty = (id: string, name: string) => {
    setLoyaltyRoster((prev) => prev.filter((l) => l.id !== id));
    setLoyaltyFeedback(`Removed ${name} from Loyalty roster.`);
    setTimeout(() => setLoyaltyFeedback(null), 2500);
  };

  const handleSendLoyaltySpark = (name: string) => {
    setLoyaltyFeedback(`Sent Daily Loyalty Spark to ${name}! Streak maintained.`);
    setTimeout(() => setLoyaltyFeedback(null), 3000);
  };

  // -------------------------------------------------------------------------
  // 5. GENRE System Internal State (Purple)
  // -------------------------------------------------------------------------
  const [draftTitle, setDraftTitle] = useState('Cybernetic Botanical Garden');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    'Indie Illustrators & Designers'
  );
  const [subGenreTag, setSubGenreTag] = useState('#environment-concept');
  const [strictGenreGate, setStrictGenreGate] = useState(true);
  const [publishedGenrePost, setPublishedGenrePost] = useState<{
    title: string;
    genre: string;
    subGenre: string;
    timestamp: string;
  } | null>(null);
  const [genreFeedback, setGenreFeedback] = useState<string | null>(null);

  const handlePublishWithGenre = () => {
    if (!selectedGenre) {
      setGenreFeedback('Error: "What is your genre?" must be answered before publishing.');
      setTimeout(() => setGenreFeedback(null), 3500);
      return;
    }
    const published = {
      title: draftTitle.trim() || 'Untitled Creation',
      genre: selectedGenre,
      subGenre: subGenreTag.trim(),
      timestamp: 'Just now',
    };
    setPublishedGenrePost(published);
    setGenreFeedback(
      `Verified! Published "${published.title}" under [${selectedGenre}].`
    );
    setTimeout(() => setGenreFeedback(null), 4000);
  };

  return (
    <div className="flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* ===================================================================== */}
      {/* HEADER: FAIRY CONTROL (with sub-nav tab switcher to DM Control)       */}
      {/* ===================================================================== */}
      <header className="px-4 pt-3 pb-2.5 bg-white border-b border-slate-100 shrink-0 shadow-2xs">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
              <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-[17px] font-black tracking-tight leading-tight flex items-center gap-1.5 text-slate-900">
                FAIRY CONTROL
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {activeSystemsCount} / 5 Active
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Independent Discovery & Privacy Control Systems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCommunityActivatorsOpen(true)}
              className="text-[11px] font-bold text-slate-700 hover:text-black px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Inspect users who activated each feature"
            >
              <Users className="w-3 h-3 text-slate-600" />
              People
            </button>
            <button
              onClick={onBackToFeed}
              className="text-[11px] font-bold text-slate-600 hover:text-black px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Back to Feed
            </button>
          </div>
        </div>

        {/* Third Icon Header Sub-Switcher: FAIRY CONTROL vs DM CONTROL */}
        <div className="flex items-center gap-1.5 mt-2.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            className="flex-1 py-1.5 text-[11px] font-extrabold rounded-lg bg-white text-slate-900 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-default"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-800" />
            FAIRY CONTROL (5 Systems)
          </button>

          {onSwitchToDMs && (
            <button
              onClick={onSwitchToDMs}
              className="flex-1 py-1.5 text-[11px] font-extrabold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open DM Privacy & Direct Messages"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              DM Control & Chats
            </button>
          )}
        </div>

        {/* Color Key Bar representing the 5 colors */}
        <div className="flex items-center justify-between gap-1.5 mt-2 px-1 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Support
          </span>
          <span className="flex items-center gap-1 text-pink-600">
            <span className="w-2 h-2 rounded-full bg-pink-500" /> Favorite
          </span>
          <span className="flex items-center gap-1 text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> Trending
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Loyalty
          </span>
          <span className="flex items-center gap-1 text-purple-700">
            <span className="w-2 h-2 rounded-full bg-purple-600" /> Genre
          </span>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 5 INDEPENDENT SWITCH-BASED CONTROLS IN STRICT SCREEN ORDER            */}
      {/* ===================================================================== */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto p-3 space-y-3.5 scrollbar-thin overscroll-contain pb-16">

        {/* ----------------------------------------------------------------- */}
        {/* 1. SUPPORT — RED                                                  */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={`p-3.5 bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
            supportEnabled
              ? 'border-red-200 ring-2 ring-red-500/10'
              : 'border-slate-200/90'
          }`}
        >
          {/* Header Row: [ SYSTEM NAME ]   [ ON/OFF SWITCH ] */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color Identifier: Solid RED Circle */}
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-xs ring-4 ring-red-50 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-tight text-slate-900">
                    SUPPORT
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    RED
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      supportEnabled
                        ? 'bg-red-100 text-red-800 border border-red-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {supportUsersCount.toLocaleString()} users active {supportEnabled && '· You'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {supportEnabled
                    ? 'Active · 18,421 supporters backing new & growing people'
                    : 'Inactive for you · 18,420 other users currently active'}
                </p>
              </div>
            </div>

            {/* Independent Switch matching DM Control style (RED) */}
            <div
              onClick={() => setSupportEnabled((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Support System On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 transition-colors ${
                  supportEnabled ? 'text-red-600' : 'text-slate-400'
                }`}
              >
                {supportEnabled ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  supportEnabled ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    supportEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Activation Numbers & People Breakdown (Visible whether activated or not) */}
          {renderCardActivationDrawer(
            'support',
            'Support',
            'bg-red-600',
            supportUsersCount,
            supportInactiveCount,
            TOTAL_COMMUNITY_MEMBERS,
            'bg-red-50 text-red-900 border border-red-200'
          )}

          {/* Sub-options: Hidden when OFF, Active when ON */}
          {supportEnabled && (
            <div className="mt-3.5 pt-3 border-t border-red-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-red-800 tracking-wider">
                  Support Categories ({selectedSupportCategories.length} Selected)
                </span>
                <span className="text-[10.5px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  {supportBoostsLeft} Daily Boosts Left
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Select the types of people and content you are willing to support. Support is dedicated to boosting new and growing people.
              </p>

              {/* Search Other Users on Support Feature */}
              <div className="bg-red-50/70 p-3 rounded-2xl border border-red-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs font-black text-red-950 uppercase tracking-wide">
                      Search Users on Support
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-red-700 bg-white px-2 py-0.5 rounded-full border border-red-200 shadow-2xs">
                    {supportedUserIds.length} Supported by You
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Search other users to discover and support their work. View their supporter numbers, check activation status, and send support or boosts.
                </p>

                {/* Search Input Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search users by name, @handle, or craft to support..."
                    value={supportSearchQuery}
                    onChange={(e) => setSupportSearchQuery(e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 shadow-2xs"
                  />
                  {supportSearchQuery && (
                    <button
                      onClick={() => setSupportSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs for Search */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-extrabold">
                  <button
                    onClick={() => setSupportSearchCategory('all')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                      supportSearchCategory === 'all'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    All Users ({activators.length})
                  </button>
                  <button
                    onClick={() => setSupportSearchCategory('active')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
                      supportSearchCategory === 'active'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    Support Active ({activators.filter((c) => c.activatedFeatures.support).length})
                  </button>
                  <button
                    onClick={() => setSupportSearchCategory('supported')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
                      supportSearchCategory === 'supported'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    Supported by You ({supportedUserIds.length})
                  </button>
                  <button
                    onClick={() => setSupportSearchCategory('emerging')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                      supportSearchCategory === 'emerging'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    Under 1k Supporters
                  </button>
                </div>

                {/* Search Results List */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                  {filteredSupportUsers.length > 0 ? (
                    filteredSupportUsers.map((person) => {
                      const isSupported = supportedUserIds.includes(person.id);
                      const isSupportActiveOnPerson = person.activatedFeatures.support;

                      return (
                        <div
                          key={person.id}
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-red-100 shadow-2xs gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full ${person.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                            >
                              {person.avatarInitial}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-xs text-slate-900 truncate">
                                  {person.name}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate">
                                  {person.handle}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                                <span className="truncate">{person.bio}</span>
                                <span>&middot;</span>
                                <span className="font-extrabold text-red-700 flex items-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                  👥 {person.metrics.supporters.toLocaleString()} supporters
                                </span>
                                {isSupportActiveOnPerson ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-50 text-red-700 font-black border border-red-200">
                                    Support Active
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-500 font-bold">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleToggleSupportUser(person.id, person.name)}
                              className={`text-[10.5px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                isSupported
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              {isSupported ? 'Supported ✓' : '+ Support'}
                            </button>
                            <button
                              onClick={() => handleBoostCreator(person.id, person.name)}
                              className="text-[10.5px] font-extrabold px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer active:scale-95"
                              title="Send Daily Boost"
                            >
                              Boost
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 bg-white rounded-xl border border-red-100">
                      No users found matching "{supportSearchQuery}". Try another name or @handle.
                    </div>
                  )}
                </div>
              </div>

              {/* Category Chips Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {SUPPORT_CATEGORIES.map((cat) => {
                  const isSelected = selectedSupportCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleSupportCategory(cat.id)}
                      className={`text-left p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2 ${
                        isSelected
                          ? 'bg-red-50/80 border-red-300 text-red-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="leading-tight text-[11.5px]">{cat.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5 flex items-center justify-between">
                          <span className="truncate">{cat.desc}</span>
                          <span className="text-[9.5px] font-bold text-red-700 shrink-0 ml-1">
                            👥 {cat.userCount.toLocaleString()} active
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Spotlight: People matching your selected support categories */}
              <div className="bg-red-50/60 p-2.5 rounded-xl border border-red-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-red-900">
                  <span>Emerging Creators You Can Boost Now</span>
                  <span className="text-[10px] text-red-700 font-medium">New voices</span>
                </div>

                <div className="space-y-1.5">
                  {growingCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-red-100 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {creator.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-slate-900 truncate">
                            {creator.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span>{creator.handle}</span>
                            <span>&middot;</span>
                            <span className="text-red-700 font-semibold">{creator.tag}</span>
                            <span>&middot;</span>
                            <span className="font-extrabold text-slate-800">👥 {creator.followers} supporters</span>
                            <span className="px-1 py-0.2 rounded text-[9px] bg-red-100 text-red-800 font-black">Support Active</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBoostCreator(creator.id, creator.name)}
                        disabled={creator.boosted}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                          creator.boosted
                            ? 'bg-red-100 text-red-700 cursor-default'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-2xs active:scale-95'
                        }`}
                      >
                        {creator.boosted ? 'Boosted ✓' : '+1 Boost'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {supportFeedback && (
                <div className="p-2 rounded-lg bg-red-100 text-red-900 text-xs font-bold animate-fadeIn">
                  {supportFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 2. FAVORITE — PINK                                                */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={`p-3.5 bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
            favoriteEnabled
              ? 'border-pink-200 ring-2 ring-pink-500/10'
              : 'border-slate-200/90'
          }`}
        >
          {/* Header Row: [ SYSTEM NAME ]   [ ON/OFF SWITCH ] */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color Identifier: Solid PINK Circle */}
              <div className="w-6 h-6 rounded-full bg-pink-500 shadow-xs ring-4 ring-pink-50 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-tight text-slate-900">
                    FAVORITE
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    PINK
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      favoriteEnabled
                        ? 'bg-pink-100 text-pink-800 border border-pink-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {favoriteUsersCount.toLocaleString()} users active {favoriteEnabled && '· You'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {favoriteEnabled
                    ? 'Active · 24,191 users pinning favorite creator feeds'
                    : 'Inactive for you · 24,190 other users currently active'}
                </p>
              </div>
            </div>

            {/* Independent Switch matching DM Control style (PINK) */}
            <div
              onClick={() => setFavoriteEnabled((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Favorite System On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 transition-colors ${
                  favoriteEnabled ? 'text-pink-600' : 'text-slate-400'
                }`}
              >
                {favoriteEnabled ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  favoriteEnabled ? 'bg-pink-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    favoriteEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Activation Numbers & People Breakdown (Visible whether activated or not) */}
          {renderCardActivationDrawer(
            'favorite',
            'Favorite',
            'bg-pink-500',
            favoriteUsersCount,
            favoriteInactiveCount,
            TOTAL_COMMUNITY_MEMBERS,
            'bg-pink-50 text-pink-900 border border-pink-200'
          )}

          {/* Sub-options: Hidden when OFF, Active when ON */}
          {favoriteEnabled && (
            <div className="mt-3.5 pt-3 border-t border-pink-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-pink-800 tracking-wider">
                  Favorite Creators ({favoritesList.length})
                </span>
                <span className="text-[10.5px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                  Independent System
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Favorite remains completely independent. Track your most cherished creators, get notified on new releases, and isolate their feeds.
              </p>

              {/* Quick Add by handle */}
              <form onSubmit={handleAddFavorite} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add creator handle (e.g. @artist_name)..."
                  value={newFavHandle}
                  onChange={(e) => setNewFavHandle(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  Add Favorite
                </button>
              </form>

              {/* Favorites List */}
              <div className="space-y-1.5">
                {favoritesList.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-pink-50/50 border border-pink-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {fav.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1">
                          {fav.name}
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 flex-wrap">
                          <span>{fav.handle} &middot; {fav.role}</span>
                          <span>&middot;</span>
                          <span className="text-pink-700 font-extrabold">👥 4.8k favorited</span>
                          <span className="px-1 py-0.2 rounded text-[9px] bg-pink-50 text-pink-700 font-black border border-pink-200">Favorite Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRemoveFavorite(fav.id, fav.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from Favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Favorite Preferences */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    Priority push alerts on new releases
                  </span>
                  <input
                    type="checkbox"
                    checked={favNotificationPriority}
                    onChange={(e) => setFavNotificationPriority(e.target.checked)}
                    className="accent-pink-500 w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    Display Pink Star badge next to favorite creators
                  </span>
                  <input
                    type="checkbox"
                    checked={favStarBadge}
                    onChange={(e) => setFavStarBadge(e.target.checked)}
                    className="accent-pink-500 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {favoriteFeedback && (
                <div className="p-2 rounded-lg bg-pink-100 text-pink-900 text-xs font-bold animate-fadeIn">
                  {favoriteFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3. TRENDING — BLUE                                                */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={`p-3.5 bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
            trendingEnabled
              ? 'border-blue-200 ring-2 ring-blue-500/10'
              : 'border-slate-200/90'
          }`}
        >
          {/* Header Row: [ SYSTEM NAME ]   [ ON/OFF SWITCH ] */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color Identifier: Solid BLUE Circle */}
              <div className="w-6 h-6 rounded-full bg-blue-600 shadow-xs ring-4 ring-blue-50 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-tight text-slate-900">
                    TRENDING
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    BLUE
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      trendingEnabled
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {trendingUsersCount.toLocaleString()} users active {trendingEnabled && '· You'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {trendingEnabled
                    ? 'Active · 31,851 users curating and boosting viral trends'
                    : 'Inactive for you · 31,850 other users currently active'}
                </p>
              </div>
            </div>

            {/* Independent Switch matching DM Control style (BLUE) */}
            <div
              onClick={() => setTrendingEnabled((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Trending System On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 transition-colors ${
                  trendingEnabled ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                {trendingEnabled ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  trendingEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    trendingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Activation Numbers & People Breakdown (Visible whether activated or not) */}
          {renderCardActivationDrawer(
            'trending',
            'Trending',
            'bg-blue-600',
            trendingUsersCount,
            trendingInactiveCount,
            TOTAL_TRENDING_MEMBERS,
            'bg-blue-50 text-blue-900 border border-blue-200'
          )}

          {/* Sub-options: Hidden when OFF, Active when ON */}
          {trendingEnabled && (
            <div className="mt-3.5 pt-3 border-t border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-blue-800 tracking-wider">
                  Trend / Make Trending Action Station
                </span>
                <span className="text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Independent System
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Trending remains completely independent. Use the Trend / Make Trending action to propel creative work into algorithmic momentum.
              </p>

              {/* Action Box: Make Trending */}
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/90 space-y-2.5">
                <label className="block text-xs font-bold text-blue-950">
                  Select item to Make Trending:
                </label>
                <select
                  value={selectedTrendTarget}
                  onChange={(e) => setSelectedTrendTarget(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Current Spring Collection Post">Current Post: Spring Lookbook Collection #4</option>
                  <option value="Elena Rostova: Fairy Concept Editorial">Elena Rostova: Fairy Concept Editorial</option>
                  <option value="#IndieMotion2026">Topic Tag: #IndieMotion2026</option>
                  <option value="#FairyAesthetics">Topic Tag: #FairyAesthetics</option>
                </select>

                <div className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    placeholder="Or enter custom hashtag/post title..."
                    value={customTrendInput}
                    onChange={(e) => setCustomTrendInput(e.target.value)}
                    className="flex-1 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleMakeTrending}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  MAKE TRENDING (+500 Velocity Points)
                </button>
              </div>

              {/* Current Trending Radar List */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Live Trend Radar (Rank &amp; Velocity)
                </span>
                {trends.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-black text-[10px] flex items-center justify-center">
                        #{t.rank}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {t.tag}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                          <span>{(t.velocity / 1000).toFixed(1)}k velocity</span>
                          <span>&middot;</span>
                          <span className="text-blue-700 font-extrabold">👥 {Math.floor(t.velocity / 10).toLocaleString()} users boosting</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBoostTrendTag(t.id, t.tag)}
                      className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      + Boost Trend
                    </button>
                  </div>
                ))}
              </div>

              {trendFeedback && (
                <div className="p-2 rounded-lg bg-blue-100 text-blue-950 text-xs font-bold animate-fadeIn">
                  {trendFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 4. LOYALTY — GOLD                                                 */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={`p-3.5 bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
            loyaltyEnabled
              ? 'border-amber-300 ring-2 ring-amber-400/20'
              : 'border-slate-200/90'
          }`}
        >
          {/* Header Row: [ SYSTEM NAME ]   [ ON/OFF SWITCH ] */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color Identifier: Solid GOLD Circle */}
              <div className="w-6 h-6 rounded-full bg-amber-400 shadow-xs ring-4 ring-amber-50 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-tight text-slate-900">
                    LOYALTY
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                    GOLD
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      loyaltyEnabled
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {loyaltyUsersCount.toLocaleString()} users active {loyaltyEnabled && '· You'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {loyaltyEnabled
                    ? 'Active · 12,741 members building loyalty streaks'
                    : 'Inactive for you · 12,740 other users currently active'}
                </p>
              </div>
            </div>

            {/* Independent Switch matching DM Control style (GOLD) */}
            <div
              onClick={() => setLoyaltyEnabled((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Loyalty System On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 transition-colors ${
                  loyaltyEnabled ? 'text-amber-600' : 'text-slate-400'
                }`}
              >
                {loyaltyEnabled ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  loyaltyEnabled ? 'bg-amber-400' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    loyaltyEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Activation Numbers & People Breakdown (Visible whether activated or not) */}
          {renderCardActivationDrawer(
            'loyalty',
            'Loyalty',
            'bg-amber-400',
            loyaltyUsersCount,
            loyaltyInactiveCount,
            TOTAL_COMMUNITY_MEMBERS,
            'bg-amber-50 text-amber-950 border border-amber-300'
          )}

          {/* Sub-options: Hidden when OFF, Active when ON */}
          {loyaltyEnabled && (
            <div className="mt-3.5 pt-3 border-t border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider">
                  Search &amp; Add People to Loyalty
                </span>
                <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Independent System
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Loyalty remains completely independent. Search for people and add them to Loyalty to build continuous streaks and unlock community perks.
              </p>

              {/* Search People Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search people by name or @handle..."
                  value={loyaltySearch}
                  onChange={(e) => setLoyaltySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Search Results list */}
              {loyaltySearch.trim() && (
                <div className="bg-amber-50/50 p-2 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Search Results ({filteredSearchPeople.length})
                  </span>
                  {filteredSearchPeople.length > 0 ? (
                    filteredSearchPeople.map((person) => {
                      const inLoyalty = loyaltyRoster.some(
                        (l) => l.handle.toLowerCase() === person.handle.toLowerCase()
                      );
                      return (
                        <div
                          key={person.id}
                          className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {person.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {person.handle} &middot; {person.bio}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddToLoyalty(person)}
                            disabled={inLoyalty}
                            className={`text-[10.5px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                              inLoyalty
                                ? 'bg-amber-100 text-amber-800 cursor-default'
                                : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-2xs'
                            }`}
                          >
                            {inLoyalty ? 'In Loyalty ✓' : '+ Add to Loyalty'}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-2 text-[11px] text-slate-500">
                      No creators found matching "{loyaltySearch}"
                    </div>
                  )}
                </div>
              )}

              {/* Your Active Loyalty Roster */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-extrabold uppercase text-slate-500 tracking-wider">
                    Your Loyalty Members ({loyaltyRoster.length})
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold">
                    Active Streaks
                  </span>
                </div>

                {loyaltyRoster.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-amber-50/40 border border-amber-200/70"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                          {item.name}
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                            {item.tier}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 flex-wrap">
                          <span>{item.handle} &middot; 🔥 {item.streak}d streak</span>
                          <span>&middot;</span>
                          <span className="text-amber-800 font-extrabold">👥 {(item.streak * 28 + 120).toLocaleString()} in loyalty</span>
                          <span className="px-1 py-0.2 rounded text-[9px] bg-amber-100 text-amber-900 font-black">Loyalty Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSendLoyaltySpark(item.name)}
                        className="text-[10.5px] font-extrabold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Send Daily Spark"
                      >
                        Spark
                      </button>
                      <button
                        onClick={() => handleRemoveLoyalty(item.id, item.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from Loyalty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {loyaltyFeedback && (
                <div className="p-2 rounded-lg bg-amber-100 text-amber-950 text-xs font-bold animate-fadeIn">
                  {loyaltyFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 5. GENRE — PURPLE                                                 */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={`p-3.5 bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
            genreEnabled
              ? 'border-purple-200 ring-2 ring-purple-500/10'
              : 'border-slate-200/90'
          }`}
        >
          {/* Header Row: [ SYSTEM NAME ]   [ ON/OFF SWITCH ] */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color Identifier: Solid PURPLE Circle */}
              <div className="w-6 h-6 rounded-full bg-purple-600 shadow-xs ring-4 ring-purple-50 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-tight text-slate-900">
                    GENRE
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    PURPLE
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      genreEnabled
                        ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-2.5 h-2.5" />
                    {genreUsersCount.toLocaleString()} users active {genreEnabled && '· You'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {genreEnabled
                    ? 'Active · 16,931 creators classifying posts before publishing'
                    : 'Inactive for you · 16,930 other users currently active'}
                </p>
              </div>
            </div>

            {/* Independent Switch matching DM Control style (PURPLE) */}
            <div
              onClick={() => setGenreEnabled((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200/80 transition-colors"
              title="Toggle Genre System On / Off"
            >
              <span
                className={`text-[10px] font-black tracking-wider uppercase pl-1 transition-colors ${
                  genreEnabled ? 'text-purple-600' : 'text-slate-400'
                }`}
              >
                {genreEnabled ? 'ON' : 'OFF'}
              </span>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  genreEnabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    genreEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Activation Numbers & People Breakdown (Visible whether activated or not) */}
          {renderCardActivationDrawer(
            'genre',
            'Genre',
            'bg-purple-600',
            genreUsersCount,
            genreInactiveCount,
            TOTAL_COMMUNITY_MEMBERS,
            'bg-purple-50 text-purple-950 border border-purple-200'
          )}

          {/* Sub-options: Hidden when OFF, Active when ON */}
          {genreEnabled && (
            <div className="mt-3.5 pt-3 border-t border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-purple-800 tracking-wider">
                  Post Creation Classification Gate
                </span>
                <span className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Independent System
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Genre remains completely independent. When active, it triggers genre classification when creating a post. Before publishing, the system asks:
              </p>

              {/* Pre-publishing Gate Question Card */}
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                      Before publishing: "What is your genre?"
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                    Mandatory Gate
                  </span>
                </div>

                {/* Simulated Post Draft Input */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                    Post Draft Title:
                  </label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Genre Selector Buttons (Same category list as Support) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10.5px] font-bold text-slate-700">
                      Choose Your Primary Genre:
                    </label>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                      Same categories as Support
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {GENRE_CATEGORIES.map((genre) => {
                      const isSelected = selectedGenre === genre.label;
                      return (
                        <button
                          key={genre.id}
                          onClick={() => setSelectedGenre(genre.label)}
                          className={`p-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-start justify-between border ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                              : 'bg-white border-purple-100 text-slate-700 hover:bg-purple-50'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <span className="truncate block leading-tight">{genre.label}</span>
                            <div className="flex items-center justify-between mt-0.5">
                              <span
                                className={`text-[9.5px] font-normal block truncate ${
                                  isSelected ? 'text-purple-100' : 'text-slate-400'
                                }`}
                              >
                                {genre.desc}
                              </span>
                              <span
                                className={`text-[9.5px] font-extrabold ml-1 shrink-0 ${
                                  isSelected ? 'text-white' : 'text-purple-700'
                                }`}
                              >
                                👥 {genre.userCount.toLocaleString()} posts
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-genre Tag Input */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                    Sub-genre Tags (optional):
                  </label>
                  <input
                    type="text"
                    value={subGenreTag}
                    onChange={(e) => setSubGenreTag(e.target.value)}
                    placeholder="e.g. #procedural, #cyberpunk"
                    className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Publish Action Button */}
                <button
                  onClick={handlePublishWithGenre}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Publish with Genre Verification
                </button>
              </div>

              {/* Published Result Preview */}
              {publishedGenrePost && (
                <div className="p-2.5 rounded-xl bg-purple-100/80 border border-purple-300 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-950">
                      Published &amp; Categorized
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold">
                      {publishedGenrePost.timestamp}
                    </span>
                  </div>
                  <div className="text-slate-900 font-bold">
                    {publishedGenrePost.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-purple-800">
                    <span className="px-1.5 py-0.2 rounded-md bg-purple-200">
                      {publishedGenrePost.genre}
                    </span>
                    {publishedGenrePost.subGenre && (
                      <span className="text-purple-600">
                        {publishedGenrePost.subGenre}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Genre Preference Switch */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    Strict Mode: Always ask "What is your genre?" on new posts
                  </span>
                  <input
                    type="checkbox"
                    checked={strictGenreGate}
                    onChange={(e) => setStrictGenreGate(e.target.checked)}
                    className="accent-purple-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {genreFeedback && (
                <div className="p-2 rounded-lg bg-purple-100 text-purple-950 text-xs font-bold animate-fadeIn">
                  {genreFeedback}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ===================================================================== */}
      {/* MODAL: PEOPLE WHO ACTIVATED THESE FEATURES                            */}
      {/* ===================================================================== */}
      {isCommunityActivatorsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                    Community Activation Numbers
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      Live
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-300">
                    See people who activated each feature and their user numbers
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCommunityActivatorsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar across the 5 systems */}
            <div className="grid grid-cols-5 gap-1 p-2 bg-slate-100 border-b border-slate-200 text-center">
              <div className="bg-white p-1.5 rounded-lg border border-red-100">
                <span className="text-[9px] font-black text-red-600 block uppercase">Support</span>
                <span className="text-xs font-black text-slate-900">{supportUsersCount.toLocaleString()}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-pink-100">
                <span className="text-[9px] font-black text-pink-600 block uppercase">Favorite</span>
                <span className="text-xs font-black text-slate-900">{favoriteUsersCount.toLocaleString()}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-blue-100">
                <span className="text-[9px] font-black text-blue-600 block uppercase">Trending</span>
                <span className="text-xs font-black text-slate-900">{trendingUsersCount.toLocaleString()}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-amber-100">
                <span className="text-[9px] font-black text-amber-700 block uppercase">Loyalty</span>
                <span className="text-xs font-black text-slate-900">{loyaltyUsersCount.toLocaleString()}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                <span className="text-[9px] font-black text-purple-700 block uppercase">Genre</span>
                <span className="text-xs font-black text-slate-900">{genreUsersCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search people by name or @handle..."
                  value={activatorSearch}
                  onChange={(e) => setActivatorSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10.5px] font-extrabold">
                <button
                  onClick={() => setActivatorFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activatorFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Features ({activators.length})
                </button>
                <button
                  onClick={() => setActivatorFilter('support')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activatorFilter === 'support'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Support ({activators.filter((c) => c.activatedFeatures.support).length})
                </button>
                <button
                  onClick={() => setActivatorFilter('favorite')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activatorFilter === 'favorite'
                      ? 'bg-pink-500 text-white shadow-2xs'
                      : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  Favorite ({activators.filter((c) => c.activatedFeatures.favorite).length})
                </button>
                <button
                  onClick={() => setActivatorFilter('trending')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activatorFilter === 'trending'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Trending ({activators.filter((c) => c.activatedFeatures.trending).length})
                </button>
                <button
                  onClick={() => setActivatorFilter('loyalty')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activatorFilter === 'loyalty'
                      ? 'bg-amber-500 text-amber-950 shadow-2xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Loyalty ({activators.filter((c) => c.activatedFeatures.loyalty).length})
                </button>
                <button
                  onClick={() => setActivatorFilter('genre')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activatorFilter === 'genre'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  Genre ({activators.filter((c) => c.activatedFeatures.genre).length})
                </button>
              </div>

              {/* Status Filter Tabs: All | Activated Only (with User Numbers) | Not Activated Only */}
              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-[10px] font-extrabold flex-wrap">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-slate-400 font-semibold mr-0.5">Status Filter:</span>
                  <button
                    onClick={() => setActivatorStatusFilter('all')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      activatorStatusFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({activators.length})
                  </button>
                  <button
                    onClick={() => setActivatorStatusFilter('activated')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                      activatorStatusFilter === 'activated'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Activated · With Numbers
                  </button>
                  <button
                    onClick={() => setActivatorStatusFilter('not_activated')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                      activatorStatusFilter === 'not_activated'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Not Activated Only
                  </button>
                </div>

                <span className="text-[9.5px] text-slate-500 font-medium">
                  Click any feature below to toggle activation
                </span>
              </div>
            </div>

            {/* People List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
              {filteredActivators.map((person) => {
                const totalActivated = Object.values(person.activatedFeatures).filter(Boolean).length;
                return (
                  <div
                    key={person.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-all"
                  >
                    {/* Top Row: Avatar, Name, Handle, Active Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full ${person.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {person.avatarInitial}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-xs text-slate-900 truncate">
                            {person.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {person.handle} &middot; {person.bio}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[10px] shrink-0">
                        {totalActivated} / 5 Activated
                      </span>
                    </div>

                    {/* Features Activation Badges & User Numbers (Interactive Toggles) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                      {/* Support Status */}
                      <button
                        onClick={() => togglePersonFeature(person.id, 'support')}
                        className={`p-1.5 rounded-lg border flex items-center justify-between text-left cursor-pointer transition-all active:scale-95 ${
                          person.activatedFeatures.support
                            ? 'bg-red-50/70 border-red-200 text-red-950 font-bold hover:bg-red-100'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={`Click to ${person.activatedFeatures.support ? 'deactivate' : 'activate'} Support for ${person.name}`}
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              person.activatedFeatures.support ? 'bg-red-600 shadow-2xs' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">Support</span>
                        </span>
                        <span className="shrink-0 ml-1">
                          {person.activatedFeatures.support
                            ? `👥 ${person.metrics.supporters.toLocaleString()}`
                            : 'Off (0)'}
                        </span>
                      </button>

                      {/* Favorite Status */}
                      <button
                        onClick={() => togglePersonFeature(person.id, 'favorite')}
                        className={`p-1.5 rounded-lg border flex items-center justify-between text-left cursor-pointer transition-all active:scale-95 ${
                          person.activatedFeatures.favorite
                            ? 'bg-pink-50/70 border-pink-200 text-pink-950 font-bold hover:bg-pink-100'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={`Click to ${person.activatedFeatures.favorite ? 'deactivate' : 'activate'} Favorite for ${person.name}`}
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              person.activatedFeatures.favorite ? 'bg-pink-500 shadow-2xs' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">Favorite</span>
                        </span>
                        <span className="shrink-0 ml-1">
                          {person.activatedFeatures.favorite
                            ? `👥 ${person.metrics.favorites.toLocaleString()}`
                            : 'Off (0)'}
                        </span>
                      </button>

                      {/* Trending Status */}
                      <button
                        onClick={() => togglePersonFeature(person.id, 'trending')}
                        className={`p-1.5 rounded-lg border flex items-center justify-between text-left cursor-pointer transition-all active:scale-95 ${
                          person.activatedFeatures.trending
                            ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-bold hover:bg-blue-100'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={`Click to ${person.activatedFeatures.trending ? 'deactivate' : 'activate'} Trending for ${person.name}`}
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              person.activatedFeatures.trending ? 'bg-blue-600 shadow-2xs' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">Trending</span>
                        </span>
                        <span className="shrink-0 ml-1">
                          {person.activatedFeatures.trending
                            ? `🚀 ${(person.metrics.trendScore / 1000).toFixed(1)}k`
                            : 'Off (0)'}
                        </span>
                      </button>

                      {/* Loyalty Status */}
                      <button
                        onClick={() => togglePersonFeature(person.id, 'loyalty')}
                        className={`p-1.5 rounded-lg border flex items-center justify-between text-left cursor-pointer transition-all active:scale-95 ${
                          person.activatedFeatures.loyalty
                            ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-bold hover:bg-amber-100'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={`Click to ${person.activatedFeatures.loyalty ? 'deactivate' : 'activate'} Loyalty for ${person.name}`}
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              person.activatedFeatures.loyalty ? 'bg-amber-400 shadow-2xs' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">Loyalty</span>
                        </span>
                        <span className="shrink-0 ml-1">
                          {person.activatedFeatures.loyalty
                            ? `👥 ${person.metrics.loyaltyMembers.toLocaleString()}`
                            : 'Off (0)'}
                        </span>
                      </button>

                      {/* Genre Status */}
                      <button
                        onClick={() => togglePersonFeature(person.id, 'genre')}
                        className={`p-1.5 rounded-lg border flex items-center justify-between text-left col-span-2 sm:col-span-1 cursor-pointer transition-all active:scale-95 ${
                          person.activatedFeatures.genre
                            ? 'bg-purple-50/70 border-purple-200 text-purple-950 font-bold hover:bg-purple-100'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={`Click to ${person.activatedFeatures.genre ? 'deactivate' : 'activate'} Genre for ${person.name}`}
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              person.activatedFeatures.genre ? 'bg-purple-600 shadow-2xs' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">Genre</span>
                        </span>
                        <span className="shrink-0 ml-1">
                          {person.activatedFeatures.genre
                            ? `🏷️ ${person.metrics.genrePosts} posts`
                            : 'Off (0)'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-bold">
                Showing {filteredActivators.length} creators with activation numbers
              </span>
              <button
                onClick={() => setIsCommunityActivatorsOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
