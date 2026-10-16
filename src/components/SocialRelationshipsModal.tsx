import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  UserPlus,
  HeartHandshake,
  Swords,
  Users,
  CheckCircle2,
  MapPin,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Plus,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import {
  RelationshipRecord,
  RelationshipButtonMode,
  updateRelationship,
  normalizeTargetKey,
  KNOWN_COMMUNITY_USERS,
} from '../lib/relationships';
import { SocialRelationshipButton } from './SocialRelationshipButton';
import { AeriMessageBubbleIcon } from './AeriMessageBubbleIcon';

export type RelationshipTabType = 'friends' | 'enemies' | 'following' | 'followers';

interface SocialRelationshipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: RelationshipTabType;
  profileUserName: string;
  profileUserHandle: string;
  isOwnProfile: boolean;
  currentUser?: { handle?: string; name?: string; id?: string; email?: string } | null;
  friendsList: RelationshipRecord[];
  enemiesList: RelationshipRecord[];
  followingList: RelationshipRecord[];
  followersList: RelationshipRecord[];
  onOpenMessagePerson?: (person: { id: string; name: string; handle: string; avatarUrl?: string }) => void;
  onSelectUserProfile?: (user: { name: string; handle: string; profession?: string; avatarUrl?: string }) => void;
}

export const SocialRelationshipsModal: React.FC<SocialRelationshipsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'friends',
  profileUserName,
  profileUserHandle,
  isOwnProfile,
  currentUser,
  friendsList,
  enemiesList,
  followingList,
  followersList,
  onOpenMessagePerson,
  onSelectUserProfile,
}) => {
  const [activeTab, setActiveTab] = useState<RelationshipTabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddHandle, setQuickAddHandle] = useState('');
  const [quickAddMode, setQuickAddMode] = useState<RelationshipButtonMode>('friend');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Sync initial tab when opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
      setQuickAddHandle('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const currentList =
    activeTab === 'friends'
      ? friendsList
      : activeTab === 'enemies'
      ? enemiesList
      : activeTab === 'following'
      ? followingList
      : followersList;

  const filteredList = currentList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.targetName.toLowerCase().includes(q) ||
      item.targetHandle.toLowerCase().includes(q) ||
      (item.targetProfession && item.targetProfession.toLowerCase().includes(q))
    );
  });

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddHandle.trim()) return;

    const cleanHandle = quickAddHandle.trim().startsWith('@')
      ? quickAddHandle.trim()
      : `@${quickAddHandle.trim()}`;
    const cleanName = cleanHandle.replace(/^@/, '');

    const targetStatus =
      quickAddMode === 'friend'
        ? 'friend'
        : quickAddMode === 'enemy'
        ? 'enemy'
        : 'following';

    await updateRelationship(
      cleanHandle,
      {
        status: targetStatus,
        mode: quickAddMode,
        targetName: cleanName,
        targetHandle: cleanHandle,
      },
      currentUser?.handle || undefined
    );

    const modeLabel =
      quickAddMode === 'friend'
        ? 'Added Friend'
        : quickAddMode === 'enemy'
        ? 'Added Enemy'
        : 'Followed';

    showToast(`✓ ${modeLabel} ${cleanHandle}`);
    setQuickAddHandle('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-base text-slate-900 leading-tight">
                {isOwnProfile ? 'Your Social Network' : `${profileUserName}'s Network`}
              </h2>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              {profileUserHandle} &bull; Live persistent friend, enemy & follow connections
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Interactive Relationship Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('friends')}
            className={`py-2.5 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'friends'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Friends</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'friends'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {friendsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enemies')}
            className={`py-2.5 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'enemies'
                ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-rose-600" />
            <span>Enemies</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'enemies'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {enemiesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`py-2.5 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'following'
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Following</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'following'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {followingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('followers')}
            className={`py-2.5 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'followers'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Followers</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'followers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {followersList.length}
            </span>
          </button>
        </div>

        {/* Feedback Toast */}
        {feedbackToast && (
          <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Search & Quick Add Section */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/60 space-y-2">
          {/* Filter Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${activeTab} by name or handle...`}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Add Bar for Current User */}
          {isOwnProfile && (
            <form onSubmit={handleQuickAdd} className="flex items-center gap-1.5">
              <input
                type="text"
                value={quickAddHandle}
                onChange={(e) => setQuickAddHandle(e.target.value)}
                placeholder="Add @handle (e.g. @kinetic, @karak)..."
                className="flex-1 px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium"
              />
              <select
                value={quickAddMode}
                onChange={(e) => setQuickAddMode(e.target.value as RelationshipButtonMode)}
                className="py-1 px-2 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-700 cursor-pointer"
              >
                <option value="friend">🤝 Friend</option>
                <option value="enemy">⚔️ Enemy</option>
                <option value="follow">✓ Follow</option>
              </select>
              <button
                type="submit"
                disabled={!quickAddHandle.trim()}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>
          )}

          {/* Quick suggestion chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10.5px]">
            <span className="text-slate-400 font-semibold shrink-0">Suggestions:</span>
            {KNOWN_COMMUNITY_USERS.map((usr) => {
              const cleanH = usr.handle;
              const isAdded =
                activeTab === 'friends'
                  ? friendsList.some((f) => normalizeTargetKey(f.targetHandle) === normalizeTargetKey(cleanH))
                  : activeTab === 'enemies'
                  ? enemiesList.some((f) => normalizeTargetKey(f.targetHandle) === normalizeTargetKey(cleanH))
                  : followingList.some((f) => normalizeTargetKey(f.targetHandle) === normalizeTargetKey(cleanH));

              return (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => {
                    if (isOwnProfile) {
                      setQuickAddHandle(cleanH);
                    } else if (onSelectUserProfile) {
                      onSelectUserProfile({
                        name: usr.name,
                        handle: usr.handle,
                        profession: usr.profession,
                      });
                      onClose();
                    }
                  }}
                  className={`px-2 py-0.5 rounded-full shrink-0 font-bold border cursor-pointer transition-colors ${
                    isAdded
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {usr.name} ({cleanH}) {isAdded && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {filteredList.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                {activeTab === 'friends' && <HeartHandshake className="w-6 h-6 text-emerald-500" />}
                {activeTab === 'enemies' && <Swords className="w-6 h-6 text-rose-500" />}
                {activeTab === 'following' && <UserCheck className="w-6 h-6 text-purple-500" />}
                {activeTab === 'followers' && <Users className="w-6 h-6 text-blue-500" />}
              </div>
              <h3 className="font-bold text-sm text-slate-800">
                {activeTab === 'friends' && 'No friends in this list yet'}
                {activeTab === 'enemies' && 'No enemies marked'}
                {activeTab === 'following' && 'Not following anyone in this list yet'}
                {activeTab === 'followers' && 'No followers in this list yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                {activeTab === 'friends' &&
                  'Tap Add Friend on creator cards or profiles to build your verified friendship circle.'}
                {activeTab === 'enemies' &&
                  'Declare a rival or enemy by holding the follow button and selecting Enemy.'}
                {activeTab === 'following' &&
                  'Follow creators from the feed or discover new visual artists to see them here.'}
                {activeTab === 'followers' &&
                  'When community members follow this account, they will automatically appear here.'}
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const targetKey = item.targetKey;
              const isFriend = item.status === 'friend';
              const isEnemy = item.status === 'enemy';
              const isFollowing = item.status === 'following' || isFriend;

              return (
                <div
                  key={targetKey}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 group"
                >
                  {/* User Profile Card */}
                  <div
                    onClick={() => {
                      if (onSelectUserProfile) {
                        onSelectUserProfile({
                          name: item.targetName,
                          handle: item.targetHandle,
                          profession: item.targetProfession,
                          avatarUrl: item.targetAvatar,
                        });
                        onClose();
                      }
                    }}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs ${
                        item.targetBg || 'bg-purple-600'
                      }`}
                    >
                      {item.targetAvatar ? (
                        <img
                          src={item.targetAvatar}
                          alt={item.targetName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        item.targetInitial || item.targetName.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                          {item.targetName}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-purple-600 fill-purple-100 shrink-0" />
                        {/* Dynamic Relationship Badge */}
                        {isFriend && (
                          <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                            🤝 Friend
                          </span>
                        )}
                        {isEnemy && (
                          <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800">
                            ⚔️ Enemy
                          </span>
                        )}
                        {item.status === 'following' && (
                          <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800">
                            ✓ Following
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        <span className="text-slate-600">{item.targetHandle}</span>
                        {item.targetProfession && (
                          <>
                            <span>&bull;</span>
                            <span className="truncate">{item.targetProfession}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Quick Interactive Button to change / toggle relationship */}
                    <SocialRelationshipButton
                      targetHandle={item.targetHandle}
                      targetName={item.targetName}
                      currentUser={currentUser}
                      size="sm"
                    />

                    {/* Direct Message button */}
                    {onOpenMessagePerson && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMessagePerson({
                            id: `person-${item.targetKey}`,
                            name: item.targetName,
                            handle: item.targetHandle,
                            avatarUrl: item.targetAvatar,
                          });
                          onClose();
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
                        title={`Message ${item.targetName}`}
                      >
                        <AeriMessageBubbleIcon size={12} className="w-3 h-3 text-slate-700" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info note */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Relationships sync in real time and commit to GitHub repo</span>
          </span>
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
