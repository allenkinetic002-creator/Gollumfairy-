import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  UserCheck,
  UserPlus,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { INITIAL_SHARED_PEOPLE, loadSharedPeople } from '../data/sharedPeople';
import { AeriMessageBubbleIcon } from './AeriMessageBubbleIcon';

export interface UserSearchItem {
  id: string;
  name: string;
  handle: string;
  city: string;
  avatarUrl?: string;
  avatarBg?: string;
  avatarInitial?: string;
  bio: string;
  integrityScore: number;
  followers: string;
  following: string;
  postsCount: number;
  isOnline?: boolean;
}

// Searchable directory of verified creators & Fairy community users
export const ALL_DIRECTORY_USERS: UserSearchItem[] = [
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    handle: '@elena_art',
    city: 'Berlin',
    bio: 'Architectural visual artist & creator. Brutalist structures, morning shadow geometries and honest pledges.',
    integrityScore: 98,
    followers: '34.8k',
    following: '412',
    postsCount: 42,
    isOnline: true,
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    handle: '@marcus_v',
    city: 'Tokyo',
    bio: 'Neon anime concepts & cyberpunk colorist. Host of weekly creator faceoffs.',
    integrityScore: 95,
    followers: '28.1k',
    following: '380',
    postsCount: 39,
    isOnline: true,
  },
  {
    id: 'user-aiko',
    name: 'Aiko Tanaka',
    handle: '@aiko_beats',
    city: 'Kyoto',
    bio: 'Lo-Fi producer & ambient sound designer. Star Stamp holder for album releases.',
    integrityScore: 99,
    followers: '19.4k',
    following: '210',
    postsCount: 27,
    isOnline: false,
  },
  {
    id: 'user-santiago',
    name: 'Santiago Cruz',
    handle: '@santi_standup',
    city: 'Mexico City',
    bio: 'Deadpan satirist & sketch director. Top 10 creator on Fairy leaderboard.',
    integrityScore: 92,
    followers: '45.2k',
    following: '520',
    postsCount: 64,
    isOnline: true,
  },
  {
    id: 'user-zara',
    name: 'Zara Chen',
    handle: '@zara_design',
    city: 'London',
    bio: 'Kinetic typography & generative 3D forms. Active Trust Receipts partner.',
    integrityScore: 97,
    followers: '22.3k',
    following: '195',
    postsCount: 31,
    isOnline: true,
  },
  {
    id: 'user-darius',
    name: 'Darius Thorne',
    handle: '@darius_synth',
    city: 'San Francisco',
    bio: 'Hardware modular synth builder & visual coder. Verified integrity pledge.',
    integrityScore: 96,
    followers: '18.7k',
    following: '240',
    postsCount: 19,
    isOnline: false,
  },
  {
    id: 'user-mia',
    name: 'Mia Solberg',
    handle: '@mia_ceramics',
    city: 'Copenhagen',
    bio: 'Tactile stoneware & Scandinavian pottery forms. 100% fulfilled star stamps.',
    integrityScore: 99,
    followers: '15.9k',
    following: '160',
    postsCount: 22,
    isOnline: true,
  },
  {
    id: 'user-kofi',
    name: 'Kofi Mensah',
    handle: '@kofi_narrative',
    city: 'Accra',
    bio: 'Independent documentary filmmaker & storyteller. Documenting West African cultural soundscapes.',
    integrityScore: 94,
    followers: '31.4k',
    following: '410',
    postsCount: 36,
    isOnline: false,
  },
  {
    id: 'user-clara',
    name: 'Clara Oswald',
    handle: '@clara_draws',
    city: 'Montreal',
    bio: 'Children book illustrator & editorial comic maker. Playful character doodles.',
    integrityScore: 93,
    followers: '24.6k',
    following: '305',
    postsCount: 48,
    isOnline: true,
  },
  {
    id: 'user-aerifairy',
    name: 'Aeri Fairy (You)',
    handle: '@aerifairy',
    city: 'Seoul',
    bio: 'Concept visual artist, creator & beatmaker. Exploring dynamic aesthetics and synth soundscapes.',
    integrityScore: 100,
    followers: '48.2k',
    following: '238',
    postsCount: 14,
    isOnline: true,
  },
];

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUserToMessage?: (user: { id: string; name: string; handle: string; avatarUrl?: string }) => void;
  onViewUserProfile?: (user: UserSearchItem) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: (action: string) => void;
}

export function UserSearchModal({
  isOpen,
  onClose,
  onSelectUserToMessage,
  onViewUserProfile,
  isLoggedIn = false,
  onRequireAuth,
}: UserSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  // Merge directory with shared people from local storage if available
  const allUsers = useMemo(() => {
    const sharedPeople = loadSharedPeople();
    const existingHandles = new Set(ALL_DIRECTORY_USERS.map((u) => u.handle.toLowerCase()));
    const extraUsers: UserSearchItem[] = [];

    sharedPeople.forEach((sp) => {
      if (!existingHandles.has(sp.handle.toLowerCase())) {
        extraUsers.push({
          id: sp.id,
          name: sp.name,
          handle: sp.handle,
          city: sp.city,
          avatarUrl: sp.avatarUrl,
          avatarBg: sp.avatarBg,
          avatarInitial: sp.avatarInitial,
          bio: `Active on Fairy. Verified match score ${sp.percent}%.`,
          integrityScore: sp.percent,
          followers: `${(sp.percent * 0.35).toFixed(1)}k`,
          following: `${Math.round(sp.percent * 2.8)}`,
          postsCount: 12,
          isOnline: sp.isOnline,
        });
      }
    });

    return [...ALL_DIRECTORY_USERS, ...extraUsers];
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return allUsers;

    return allUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.handle.toLowerCase().includes(term) ||
        user.city.toLowerCase().includes(term) ||
        user.bio.toLowerCase().includes(term)
      );
    });
  }, [allUsers, searchTerm]);

  if (!isOpen) return null;

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-label="Search users on Fairy"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  Search Users
                </h2>
                <p className="text-[11px] font-medium text-slate-400">
                  Search anyone by name or @handle
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close user search"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Search Input */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or @handle..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* User Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-100">
          {filteredUsers.length === 0 ? (
            <div className="py-14 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No users found</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Try searching for names like &ldquo;Elena&rdquo;, &ldquo;Marcus&rdquo;, &ldquo;Santiago&rdquo;, or &ldquo;Zara&rdquo;
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isFollowed = followedMap[user.id] || false;
              const initials =
                user.avatarInitial ||
                user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    if (onViewUserProfile) {
                      onViewUserProfile(user);
                    }
                  }}
                  className="pt-2 first:pt-0 flex flex-col gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar & User Details */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative shrink-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover shadow-xs border border-slate-100"
                          />
                        ) : (
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xs ${
                              user.avatarBg || 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                            }`}
                          >
                            {initials}
                          </div>
                        )}
                        {user.isOnline && (
                          <span
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                            title="Active now"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-none truncate">
                            {user.name}
                          </h3>
                          <span className="text-[11px] font-bold text-slate-400 truncate">
                            {user.handle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {user.city}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span
                            className="inline-flex items-center gap-1 text-emerald-700 font-black text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-md"
                            title="Integrity Score"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {user.integrityScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLoggedIn && onRequireAuth) {
                            onRequireAuth('follow creators');
                            return;
                          }
                          toggleFollow(user.id, e);
                        }}
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          isFollowed
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                            : 'bg-black text-white hover:bg-slate-800 shadow-xs'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>

                      {onSelectUserToMessage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLoggedIn && onRequireAuth) {
                              onRequireAuth('send direct messages');
                              return;
                            }
                            onSelectUserToMessage({
                              id: user.id,
                              name: user.name,
                              handle: user.handle,
                              avatarUrl: user.avatarUrl,
                            });
                            onClose();
                          }}
                          title={`Message ${user.name}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors cursor-pointer"
                        >
                          <AeriMessageBubbleIcon size={16} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed pl-14 pr-2">
                    {user.bio}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </span>
          <button
            onClick={onClose}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSearchModal;
