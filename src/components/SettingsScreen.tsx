import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Key,
  Sliders,
  CreditCard,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Search,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  AlertTriangle,
  Mail,
  MessageSquare,
  AtSign,
  Heart,
  Flame,
  Volume2,
  Trash2,
  UserX,
  ShieldAlert,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { AeriSlimeSqueezeIcon } from './AeriSlimeSqueezeIcon';
import elenaAvatar from '../assets/images/creator_portrait_elena_1791014499312.jpg';

export interface SettingsScreenProps {
  onBack: () => void;
  onOpenDMControl?: () => void;
  onLogout?: () => void;
}

export type SettingsSubScreen =
  | 'main'
  | 'account_edit'
  | 'account_username'
  | 'account_email'
  | 'account_password'
  | 'account_switch'
  | 'account_connected'
  | 'privacy_account'
  | 'privacy_blocked'
  | 'privacy_restricted'
  | 'privacy_activity'
  | 'privacy_mentions'
  | 'privacy_tags'
  | 'privacy_comments'
  | 'privacy_filters'
  | 'notifications'
  | 'appearance'
  | 'security_2fa'
  | 'security_sessions'
  | 'security_history'
  | 'preferences'
  | 'payments'
  | 'help_center'
  | 'contact_support'
  | 'report_problem'
  | 'report_bug'
  | 'faqs'
  | 'about_app'
  | 'community_guidelines'
  | 'terms_of_service'
  | 'privacy_policy'
  | 'deactivate_account'
  | 'delete_account';

interface NotificationSettings {
  push: boolean;
  dms: boolean;
  followers: boolean;
  likes: boolean;
  comments: boolean;
  mentions: boolean;
  trending: boolean;
  email: boolean;
}

interface PreferencesSettings {
  autoplayVideos: boolean;
  dataSaver: boolean;
  personalizedRecommendations: boolean;
  sensitiveContent: 'standard' | 'less' | 'strict';
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenDMControl,
  onLogout,
}) => {
  const [currentScreen, setCurrentScreen] = useState<SettingsSubScreen>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateConfirmModal, setShowDeactivateConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  // User Profile Data
  const [name, setName] = useState('Elena Vance');
  const [username, setUsername] = useState('aerifairy');
  const [email, setEmail] = useState('elena.vance@aeri.studio');
  const [bio, setBio] = useState('Neo-folklore concept visual artist & ambient synth producer 🧚✨');
  const [website, setWebsite] = useState('fairy.app/@aerifairy');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Privacy State
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [whoCanMention, setWhoCanMention] = useState<'everyone' | 'following' | 'noone'>('everyone');
  const [whoCanTag, setWhoCanTag] = useState<'everyone' | 'following' | 'noone'>('everyone');
  const [commentPermission, setCommentPermission] = useState<'everyone' | 'following' | 'none'>('everyone');
  const [hiddenWords, setHiddenWords] = useState<string[]>(['spam', 'crypto bot', 'dm me promo']);
  const [newWordInput, setNewWordInput] = useState('');

  // Blocked / Restricted Accounts
  const [blockedAccounts, setBlockedAccounts] = useState([
    { id: 'b1', name: 'CryptoSpam Bot 42', handle: '@cryptogains_99' },
    { id: 'b2', name: 'Scam Drops VIP', handle: '@nft_drop_alert' },
  ]);
  const [restrictedAccounts, setRestrictedAccounts] = useState([
    { id: 'r1', name: 'Anonymous Critic', handle: '@anon_sound_critic' },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('fairy_notification_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      push: true,
      dms: true,
      followers: true,
      likes: true,
      comments: true,
      mentions: true,
      trending: false,
      email: true,
    };
  });

  // Appearance State
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('fairy_appearance_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      theme: 'light',
      language: 'en',
      reduceMotion: false,
      highContrast: false,
      largeText: false,
    };
  });

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState<PreferencesSettings>(() => {
    const saved = localStorage.getItem('fairy_preferences_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      autoplayVideos: true,
      dataSaver: false,
      personalizedRecommendations: true,
      sensitiveContent: 'standard',
    };
  });

  // Bug & problem report forms
  const [bugCategory, setBugCategory] = useState('UI / Display Glitch');
  const [bugDescription, setBugDescription] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fairy_notification_settings', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fairy_appearance_settings', JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('fairy_preferences_settings', JSON.stringify(preferences));
  }, [preferences]);

  // Search filter items
  const menuSearchableItems = [
    { title: 'Edit Profile', section: 'Account', screen: 'account_edit' as SettingsSubScreen },
    { title: 'Change Username', section: 'Account', screen: 'account_username' as SettingsSubScreen },
    { title: 'Email Address', section: 'Account', screen: 'account_email' as SettingsSubScreen },
    { title: 'Change Password', section: 'Security', screen: 'account_password' as SettingsSubScreen },
    { title: 'Switch Account', section: 'Account', screen: 'account_switch' as SettingsSubScreen },
    { title: 'Manage Connected Accounts', section: 'Account', screen: 'account_connected' as SettingsSubScreen },
    { title: 'DM Control', section: 'Privacy & Safety', action: 'dm_control' },
    { title: 'Private / Public Account', section: 'Privacy & Safety', screen: 'privacy_account' as SettingsSubScreen },
    { title: 'Blocked Accounts', section: 'Privacy & Safety', screen: 'privacy_blocked' as SettingsSubScreen },
    { title: 'Restricted Accounts', section: 'Privacy & Safety', screen: 'privacy_restricted' as SettingsSubScreen },
    { title: 'Activity Status', section: 'Privacy & Safety', screen: 'privacy_activity' as SettingsSubScreen },
    { title: 'Who Can Mention Me', section: 'Privacy & Safety', screen: 'privacy_mentions' as SettingsSubScreen },
    { title: 'Who Can Tag Me', section: 'Privacy & Safety', screen: 'privacy_tags' as SettingsSubScreen },
    { title: 'Comment Permissions', section: 'Privacy & Safety', screen: 'privacy_comments' as SettingsSubScreen },
    { title: 'Hidden Words & Filters', section: 'Privacy & Safety', screen: 'privacy_filters' as SettingsSubScreen },
    { title: 'Notifications (Push, DMs, Followers)', section: 'Notifications', screen: 'notifications' as SettingsSubScreen },
    { title: 'Appearance & Themes', section: 'Appearance', screen: 'appearance' as SettingsSubScreen },
    { title: 'Two-Factor Authentication', section: 'Security', screen: 'security_2fa' as SettingsSubScreen },
    { title: 'Active Sessions', section: 'Security', screen: 'security_sessions' as SettingsSubScreen },
    { title: 'Login History', section: 'Security', screen: 'security_history' as SettingsSubScreen },
    { title: 'Content Preferences', section: 'Preferences', screen: 'preferences' as SettingsSubScreen },
    { title: 'Payment Methods & Subscriptions', section: 'Payments', screen: 'payments' as SettingsSubScreen },
    { title: 'Help Center & FAQs', section: 'Help & Support', screen: 'help_center' as SettingsSubScreen },
    { title: 'Contact Support', section: 'Help & Support', screen: 'contact_support' as SettingsSubScreen },
    { title: 'Report a Problem', section: 'Help & Support', screen: 'report_problem' as SettingsSubScreen },
    { title: 'Report a Bug', section: 'Help & Support', screen: 'report_bug' as SettingsSubScreen },
    { title: 'About FAIRY & App Version', section: 'About', screen: 'about_app' as SettingsSubScreen },
    { title: 'Community Guidelines', section: 'About', screen: 'community_guidelines' as SettingsSubScreen },
    { title: 'Terms of Service', section: 'About', screen: 'terms_of_service' as SettingsSubScreen },
    { title: 'Privacy Policy', section: 'About', screen: 'privacy_policy' as SettingsSubScreen },
    { title: 'Deactivate Account', section: 'Account Actions', screen: 'deactivate_account' as SettingsSubScreen },
    { title: 'Delete Account', section: 'Account Actions', screen: 'delete_account' as SettingsSubScreen },
  ];

  const filteredItems = searchQuery.trim()
    ? menuSearchableItems.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.section.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Toggle switch helper
  const ToggleSwitch = ({
    checked,
    onChange,
    id,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    id?: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
        checked ? 'bg-purple-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  // Reusable sub-screen header
  const SubHeader = ({ title, parent = 'main' }: { title: string; parent?: SettingsSubScreen }) => (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentScreen(parent)}
          className="p-1 -ml-1 text-slate-600 hover:text-black rounded-lg transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-black text-base text-slate-900 tracking-tight">{title}</h2>
      </div>
      <button
        onClick={onBack}
        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
        title="Close Settings"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  // Setting Row Component
  const SettingRow = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
    trailing,
    badge,
    danger = false,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    trailing?: React.ReactNode;
    badge?: string;
    danger?: boolean;
  }) => (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={`w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors ${
        onClick
          ? danger
            ? 'hover:bg-red-50/60 active:bg-red-100/50 cursor-pointer'
            : 'hover:bg-slate-50 active:bg-slate-100/70 cursor-pointer'
          : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            danger
              ? 'bg-red-50 text-red-600'
              : 'bg-purple-50 text-purple-700 border border-purple-100/60'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold truncate ${
                danger ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {trailing ? (
          trailing
        ) : onClick ? (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        ) : null}
      </div>
    </div>
  );

  // Section Heading Component
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="px-4 pt-6 pb-2">
      <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">{title}</h3>
    </div>
  );

  // SUB-SCREEN RENDERING
  // 1. Account: Edit Profile
  if (currentScreen === 'account_edit') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Edit Profile" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={elenaAvatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-600/30"
              />
              <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <button
              onClick={() => showToast('Avatar upload simulated. Current avatar retained.')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
            >
              Change Profile Photo
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-purple-600 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-3 py-2 focus-within:ring-2 focus-within:ring-purple-600">
                <span className="text-slate-400 text-sm font-medium mr-1">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full text-sm bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-purple-600 bg-slate-50 resize-none"
              />
              <span className="text-[10px] text-slate-400 block text-right">
                {bio.length} / 150
              </span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-purple-600 bg-slate-50"
              />
            </div>
          </div>

          <button
            onClick={() => {
              showToast('Profile information successfully saved!');
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // 2. Account: Change Username
  if (currentScreen === 'account_username') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Change Username" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Changing your username also updates your profile URL: <br />
              <span className="font-mono text-purple-700 text-[11px] font-bold">fairy.app/@{username || 'yourname'}</span>
            </p>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Username</label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="text-slate-400 font-bold mr-1">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="new_username"
                  className="w-full text-sm bg-transparent outline-none font-bold text-slate-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Username @{username} is available</span>
            </div>
          </div>
          <button
            onClick={() => {
              showToast(`Username updated to @${username}`);
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Update Username
          </button>
        </div>
      </div>
    );
  }

  // 3. Account: Email Address
  if (currentScreen === 'account_email') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Email Address" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>This email address is verified for security and recovery.</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              We send critical login alerts, password recovery codes, and community notifications to this address.
            </p>
          </div>
          <button
            onClick={() => {
              showToast(`Verification link sent to ${email}`);
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Save Email & Send Verification
          </button>
        </div>
      </div>
    );
  }

  // 4. Account / Security: Change Password
  if (currentScreen === 'account_password') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Change Password" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 pr-10 outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (!currentPassword) {
                showToast('Please enter your current password');
                return;
              }
              if (newPassword.length < 8) {
                showToast('New password must be at least 8 characters');
                return;
              }
              if (newPassword !== confirmPassword) {
                showToast('New passwords do not match');
                return;
              }
              showToast('Password successfully updated!');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </div>
    );
  }

  // 5. Account: Switch Account
  if (currentScreen === 'account_switch') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Switch Account" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={elenaAvatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600"
                />
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{name}</span>
                  <span className="text-xs text-purple-700 font-semibold">@{username} (Active)</span>
                </div>
              </div>
              <Check className="w-5 h-5 text-purple-600" />
            </div>
            <div
              onClick={() => showToast('Switched to Studio Account (@aeri_collective)')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                  AC
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">Aeri Collective Studio</span>
                  <span className="text-xs text-slate-500">@aeri_collective</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            onClick={() => showToast('Add account modal triggered')}
            className="w-full py-3 bg-white border border-dashed border-slate-300 hover:border-purple-600 text-purple-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add or Log in to Another Account</span>
          </button>
        </div>
      </div>
    );
  }

  // 6. Account: Connected Accounts
  if (currentScreen === 'account_connected') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Connected Accounts" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm">
                  G
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Google</span>
                  <span className="text-xs text-slate-500">elena.vance@gmail.com</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Connected
              </span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">
                  
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Apple ID</span>
                  <span className="text-xs text-slate-500">elena.vance@icloud.com</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Connected
              </span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                  𝕏
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">X / Twitter</span>
                  <span className="text-xs text-slate-500">Not connected</span>
                </div>
              </div>
              <button
                onClick={() => showToast('Connecting to X...')}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Privacy: Private/Public Account
  if (currentScreen === 'privacy_account') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Account Privacy" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Private Account</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {isPrivateAccount
                    ? 'Only approved followers can see your posts and Fairypedia trivia.'
                    : 'Anyone on FAIRY can view your posts and send follow requests.'}
                </span>
              </div>
              <ToggleSwitch
                checked={isPrivateAccount}
                onChange={val => {
                  setIsPrivateAccount(val);
                  showToast(val ? 'Account set to Private' : 'Account set to Public');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. Privacy: Blocked Accounts
  if (currentScreen === 'privacy_blocked') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Blocked Accounts" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          {blockedAccounts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
              <Shield className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No Blocked Accounts</p>
              <p className="text-xs text-slate-400 mt-1">
                Accounts you block will not be able to find your profile or message you.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              {blockedAccounts.map(acc => (
                <div key={acc.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">{acc.name}</span>
                    <span className="text-xs text-slate-500">{acc.handle}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBlockedAccounts(prev => prev.filter(x => x.id !== acc.id));
                      showToast(`Unblocked ${acc.handle}`);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 9. Privacy: Restricted Accounts
  if (currentScreen === 'privacy_restricted') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Restricted Accounts" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <p className="text-xs text-slate-500 px-1">
            Restricted accounts can still comment on your posts, but only they can see their comments unless you approve them.
          </p>
          {restrictedAccounts.map(acc => (
            <div key={acc.id} className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{acc.name}</span>
                <span className="text-xs text-slate-500">{acc.handle}</span>
              </div>
              <button
                onClick={() => {
                  setRestrictedAccounts(prev => prev.filter(x => x.id !== acc.id));
                  showToast(`Unrestricted ${acc.handle}`);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Unrestrict
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. Privacy: Activity Status
  if (currentScreen === 'privacy_activity') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Activity Status" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Show Activity Status</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Allow accounts you follow and anyone you message to see when you were last active or currently online on FAIRY.
                </span>
              </div>
              <ToggleSwitch
                checked={showActivityStatus}
                onChange={val => {
                  setShowActivityStatus(val);
                  showToast(val ? 'Activity status visible' : 'Activity status hidden');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 11. Privacy: Mentions & Tags
  if (currentScreen === 'privacy_mentions' || currentScreen === 'privacy_tags') {
    const isMentions = currentScreen === 'privacy_mentions';
    const stateVal = isMentions ? whoCanMention : whoCanTag;
    const setStateVal = isMentions ? setWhoCanMention : setWhoCanTag;

    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title={isMentions ? 'Who Can Mention You' : 'Who Can Tag You'} />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { id: 'everyone', label: 'Everyone', desc: 'Anyone on FAIRY can mention/tag you' },
              { id: 'following', label: 'People You Follow', desc: 'Only creators and users you follow back' },
              { id: 'noone', label: 'No One', desc: 'Nobody can mention or tag you' },
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  setStateVal(opt.id as any);
                  showToast(`Setting updated to ${opt.label}`);
                }}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 block">{opt.label}</span>
                  <span className="text-xs text-slate-500">{opt.desc}</span>
                </div>
                {stateVal === opt.id && <Check className="w-5 h-5 text-purple-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 12. Privacy: Comment Permissions
  if (currentScreen === 'privacy_comments') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Comment Permissions" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { id: 'everyone', label: 'Everyone', desc: 'Allow comments from all Fairy members' },
              { id: 'following', label: 'People You Follow', desc: 'Only your mutuals and followed creators' },
              { id: 'none', label: 'Off', desc: 'Turn off comments on all your posts' },
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  setCommentPermission(opt.id as any);
                  showToast(`Comment permission updated to ${opt.label}`);
                }}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 block">{opt.label}</span>
                  <span className="text-xs text-slate-500">{opt.desc}</span>
                </div>
                {commentPermission === opt.id && <Check className="w-5 h-5 text-purple-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 13. Privacy: Hidden Words & Filters
  if (currentScreen === 'privacy_filters') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Hidden Words & Filters" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Comments, replies, and direct messages containing these phrases will be automatically filtered out.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newWordInput}
                onChange={e => setNewWordInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newWordInput.trim()) {
                    setHiddenWords([...hiddenWords, newWordInput.trim()]);
                    setNewWordInput('');
                  }
                }}
                placeholder="Add word or phrase..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={() => {
                  if (newWordInput.trim()) {
                    setHiddenWords([...hiddenWords, newWordInput.trim()]);
                    setNewWordInput('');
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-purple-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {hiddenWords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => setHiddenWords(hiddenWords.filter((_, i) => i !== idx))}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 14. Notifications Screen
  if (currentScreen === 'notifications') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Notifications" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Push Notifications</span>
                <span className="text-xs text-slate-500">Master toggle for lockscreen device notifications</span>
              </div>
              <ToggleSwitch
                checked={notifications.push}
                onChange={val => {
                  setNotifications({ ...notifications, push: val });
                  showToast(val ? 'Push notifications enabled' : 'Push notifications disabled');
                }}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Direct Messages</span>
                <span className="text-xs text-slate-500">Alerts for new chat requests and private messages</span>
              </div>
              <ToggleSwitch
                checked={notifications.dms}
                onChange={val => setNotifications({ ...notifications, dms: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">New Followers</span>
                <span className="text-xs text-slate-500">When someone follows your Fairy profile</span>
              </div>
              <ToggleSwitch
                checked={notifications.followers}
                onChange={val => setNotifications({ ...notifications, followers: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Likes & Reactions</span>
                <span className="text-xs text-slate-500">Flames, phone taps, and Star Stamp receipts</span>
              </div>
              <ToggleSwitch
                checked={notifications.likes}
                onChange={val => setNotifications({ ...notifications, likes: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Comments & Replies</span>
                <span className="text-xs text-slate-500">When someone comments on your posts or Fairypedia</span>
              </div>
              <ToggleSwitch
                checked={notifications.comments}
                onChange={val => setNotifications({ ...notifications, comments: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Mentions & Tags</span>
                <span className="text-xs text-slate-500">When someone references @{username} in a post or sitch</span>
              </div>
              <ToggleSwitch
                checked={notifications.mentions}
                onChange={val => setNotifications({ ...notifications, mentions: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Trending Content</span>
                <span className="text-xs text-slate-500">Weekly creator highlights and viral drops</span>
              </div>
              <ToggleSwitch
                checked={notifications.trending}
                onChange={val => setNotifications({ ...notifications, trending: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Email Notifications</span>
                <span className="text-xs text-slate-500">Weekly digests and critical security updates</span>
              </div>
              <ToggleSwitch
                checked={notifications.email}
                onChange={val => setNotifications({ ...notifications, email: val })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 15. Appearance Screen
  if (currentScreen === 'appearance') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Appearance & Themes" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Color Mode
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Laptop },
              ].map(t => {
                const Icon = t.icon;
                const isSel = appearance.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setAppearance({ ...appearance, theme: t.id as any });
                      showToast(`Theme switched to ${t.label}`);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Language
            </span>
            <select
              value={appearance.language}
              onChange={e => {
                setAppearance({ ...appearance, language: e.target.value });
                showToast('Language updated');
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="en">English (US)</option>
              <option value="ko">한국어 (Korean)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Reduce Motion</span>
                <span className="text-xs text-slate-500">Minimize animations across feed cards</span>
              </div>
              <ToggleSwitch
                checked={appearance.reduceMotion}
                onChange={val => setAppearance({ ...appearance, reduceMotion: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">High Contrast</span>
                <span className="text-xs text-slate-500">Increase outline visibility of UI elements</span>
              </div>
              <ToggleSwitch
                checked={appearance.highContrast}
                onChange={val => setAppearance({ ...appearance, highContrast: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Larger Typography</span>
                <span className="text-xs text-slate-500">Scale readable font size up by 15%</span>
              </div>
              <ToggleSwitch
                checked={appearance.largeText}
                onChange={val => setAppearance({ ...appearance, largeText: val })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 16. Security: 2FA
  if (currentScreen === 'security_2fa') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Two-Factor Authentication" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Authenticator App (TOTP)</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Use Google Authenticator, 1Password, or Authy for 6-digit codes.
                </span>
              </div>
              <ToggleSwitch
                checked={twoFactorEnabled}
                onChange={val => {
                  setTwoFactorEnabled(val);
                  showToast(val ? '2FA Enabled with TOTP' : '2FA Disabled');
                }}
              />
            </div>
            {twoFactorEnabled && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Two-Factor Authentication is currently securing your account.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 17. Security: Active Sessions
  if (currentScreen === 'security_sessions') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Active Sessions" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between bg-emerald-50/40">
              <div className="flex items-center gap-3">
                <Laptop className="w-6 h-6 text-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Chrome on macOS</span>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      This Device
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Seoul, South Korea · Active now</span>
                </div>
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-slate-700" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Fairy iOS App</span>
                  <span className="text-xs text-slate-500">iPhone 15 Pro · 3 hours ago</span>
                </div>
              </div>
              <button
                onClick={() => showToast('Logged out of iPhone 15 Pro')}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>

          <button
            onClick={() => showToast('All other sessions successfully revoked!')}
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-red-200"
          >
            Log Out of All Other Devices
          </button>
        </div>
      </div>
    );
  }

  // 18. Security: Login History
  if (currentScreen === 'security_history') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Login History" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { device: 'Chrome / macOS', loc: 'Seoul, KR', time: 'Today at 09:12 AM', ip: '118.235.**.**' },
              { device: 'Fairy iOS', loc: 'Seoul, KR', time: 'Yesterday at 11:45 PM', ip: '118.235.**.**' },
              { device: 'Safari / iPad', loc: 'Incheon, KR', time: 'Oct 8, 2026 at 4:20 PM', ip: '211.176.**.**' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{item.device}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.time}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {item.loc} · IP: {item.ip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 19. Preferences Screen
  if (currentScreen === 'preferences') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Preferences" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Autoplay Videos</span>
                <span className="text-xs text-slate-500">Automatically play video posts while scrolling</span>
              </div>
              <ToggleSwitch
                checked={preferences.autoplayVideos}
                onChange={val => setPreferences({ ...preferences, autoplayVideos: val })}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Data Saver Mode</span>
                <span className="text-xs text-slate-500">Load smaller preview images and pause video buffer</span>
              </div>
              <ToggleSwitch
                checked={preferences.dataSaver}
                onChange={val => {
                  setPreferences({ ...preferences, dataSaver: val });
                  showToast(val ? 'Data Saver enabled' : 'Data Saver disabled');
                }}
              />
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Personalized Recommendations</span>
                <span className="text-xs text-slate-500">Tune feed according to your Flame and Honey Jar tips</span>
              </div>
              <ToggleSwitch
                checked={preferences.personalizedRecommendations}
                onChange={val => setPreferences({ ...preferences, personalizedRecommendations: val })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 20. Payments & Subscriptions
  if (currentScreen === 'payments') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Payments & Subscriptions" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Payment Methods
            </span>
            <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Visa ending in 4242</span>
                  <span className="text-xs text-slate-500">Expires 08/29</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Default
              </span>
            </div>
            <button
              onClick={() => showToast('Secure card entry modal opened')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              + Add Payment Method
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Purchases & Subscriptions
            </span>
            <div className="p-3 border border-purple-200 bg-purple-50/50 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">FAIRY Creator Pro</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-xs text-slate-500">$9.99/month · Renews Nov 11, 2026</span>
              </div>
              <span className="text-xs font-black text-purple-700">Active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Transaction History
            </span>
            <p className="text-xs text-slate-500 py-4 text-center">
              No recent payments or purchases made this month.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 21. Help & Support
  if (currentScreen === 'help_center' || currentScreen === 'faqs') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Help Center & FAQs" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              {
                q: 'What is FAIRY and how do creator ranks work?',
                a: 'FAIRY is a neo-creator social network combining visual media, community Fairypedia biographies, and peer-to-peer Star Stamps for trust curation.',
              },
              {
                q: 'How does DM Control protect my inbox?',
                a: 'DM Control lets you set access tier badges, paywalls, or application forms for incoming requests so you never receive unsolicited spam.',
              },
              {
                q: 'What are Star Stamps and Honey Jars?',
                a: 'Star Stamps are verifiable reputation badges awarded for authentic collaboration. Honey Jars let supporters tip creators with micro-contributions.',
              },
              {
                q: 'How do I edit my Fairypedia encyclopedic bio?',
                a: 'Navigate to your Profile screen and click the "Fairypedia" button at the top right to submit bio, trivia, and career updates.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="p-3.5 group cursor-pointer">
                <summary className="font-bold text-sm text-slate-900 list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 22. Contact Support
  if (currentScreen === 'contact_support') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Contact Support" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <p className="text-xs text-slate-600">
              Our support team usually responds within 2-4 hours.
            </p>
            <textarea
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              placeholder="How can we assist you today?"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />
          </div>
          <button
            onClick={() => {
              if (!supportMessage.trim()) {
                showToast('Please type your inquiry first');
                return;
              }
              showToast('Support ticket #FAIRY-8942 submitted!');
              setSupportMessage('');
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Submit Message
          </button>
        </div>
      </div>
    );
  }

  // 23. Report a Problem / Bug
  if (currentScreen === 'report_problem' || currentScreen === 'report_bug') {
    const isBug = currentScreen === 'report_bug';
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title={isBug ? 'Report a Bug' : 'Report a Problem'} />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            {isBug && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issue Category</label>
                <select
                  value={bugCategory}
                  onChange={e => setBugCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="UI / Display Glitch">UI / Display Glitch</option>
                  <option value="Post or Feed Loading">Post or Feed Loading</option>
                  <option value="DM Control Settings">DM Control Settings</option>
                  <option value="Audio / Video Playback">Audio / Video Playback</option>
                  <option value="Performance & Lag">Performance & Lag</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                value={isBug ? bugDescription : problemDescription}
                onChange={e => (isBug ? setBugDescription(e.target.value) : setProblemDescription(e.target.value))}
                placeholder={isBug ? 'What happened? Describe steps to reproduce...' : 'Tell us what problem you encountered...'}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              showToast(isBug ? 'Bug report sent to engineering team. Thank you!' : 'Problem reported.');
              setBugDescription('');
              setProblemDescription('');
              setCurrentScreen('main');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Send Report
          </button>
        </div>
      </div>
    );
  }

  // 24. About FAIRY & Legal Documents
  if (
    currentScreen === 'about_app' ||
    currentScreen === 'community_guidelines' ||
    currentScreen === 'terms_of_service' ||
    currentScreen === 'privacy_policy'
  ) {
    const titles: Record<string, string> = {
      about_app: 'About FAIRY',
      community_guidelines: 'Community Guidelines',
      terms_of_service: 'Terms of Service',
      privacy_policy: 'Privacy Policy',
    };
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title={titles[currentScreen]} />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3 leading-relaxed text-xs text-slate-700">
            {currentScreen === 'about_app' && (
              <>
                <div className="flex flex-col items-center py-3">
                  <AeriSlimeSqueezeIcon size={56} />
                  <h3 className="font-black text-lg text-slate-900 mt-2">FAIRY</h3>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-1">
                    Version 2.4.0 (Build 2026.10.11)
                  </span>
                </div>
                <p>
                  FAIRY is a creator-first social platform designed for visual artists, indie worldbuilders, and electronic beatmakers. We believe in high-trust social curation, decentralized peer-to-peer verification through Star Stamps, and giving creators total control over their inboxes.
                </p>
                <p className="text-slate-400 text-[10px] text-center pt-2">
                  © 2026 FAIRY Labs Inc. All rights reserved.
                </p>
              </>
            )}

            {currentScreen === 'community_guidelines' && (
              <>
                <h4 className="font-bold text-sm text-slate-900">FAIRY Community Standards</h4>
                <p>1. <strong>Respect Creators:</strong> No harassment, hate speech, or targeted defamation.</p>
                <p>2. <strong>Authentic Artistry:</strong> Always credit original source material and collaborative producers.</p>
                <p>3. <strong>Inbox Integrity:</strong> Do not bypass creator DM Control rules or attempt commercial spam.</p>
              </>
            )}

            {currentScreen === 'terms_of_service' && (
              <>
                <h4 className="font-bold text-sm text-slate-900">Terms of Service</h4>
                <p>
                  By accessing or using FAIRY, you agree to comply with our platform policies, honor intellectual property rights, and conduct authentic social interactions.
                </p>
                <p>
                  Full legal documentation is available at <code>https://fairy.app/legal/terms</code>.
                </p>
              </>
            )}

            {currentScreen === 'privacy_policy' && (
              <>
                <h4 className="font-bold text-sm text-slate-900">Privacy Policy</h4>
                <p>
                  We prioritize your data security. Your private messages remain encrypted, your location data is never sold to third-party ad brokers, and your account settings give you granular control over who can contact you.
                </p>
                <p>
                  Full privacy documentation is available at <code>https://fairy.app/legal/privacy</code>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 25. Deactivate Account
  if (currentScreen === 'deactivate_account') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Deactivate Account" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-center text-slate-900 text-base">
              Deactivate your FAIRY account?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-center">
              Deactivating is temporary. Your profile, photos, comments, and likes will be hidden until you reactivate by logging back in.
            </p>
          </div>
          <button
            onClick={() => setShowDeactivateConfirmModal(true)}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Continue to Deactivate
          </button>
        </div>
      </div>
    );
  }

  // 26. Delete Account
  if (currentScreen === 'delete_account') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <SubHeader title="Delete Account" />
        <div className="p-4 max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-center text-red-600 text-base">
              Permanent Account Deletion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-center">
              This action is permanent and irreversible. Your posts, Star Stamps, Fairypedia biography, and follower connections will be permanently wiped.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirmModal(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS VIEW
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto scrollbar-thin">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fadeIn border border-slate-700/60">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-slate-600 hover:text-black rounded-lg transition-colors cursor-pointer"
            title="Back to Profile"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-600" />
            <h1 className="font-black text-base text-slate-900 tracking-tight">Settings</h1>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full pb-12">
        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search settings, privacy, security..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white shadow-2xs focus:outline-purple-600 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* If searching, render filtered results */}
        {searchQuery.trim() ? (
          <div className="p-4 pt-1 space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 mb-1 block">
              Search Results ({filteredItems.length})
            </span>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">No settings found matching &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.action === 'dm_control') {
                        if (onOpenDMControl) onOpenDMControl();
                        else showToast('Opening DM Control');
                      } else if (item.screen) {
                        setCurrentScreen(item.screen);
                      }
                      setSearchQuery('');
                    }}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">{item.title}</span>
                      <span className="text-[11px] text-purple-700 font-semibold">{item.section}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User Profile Mini Banner */}
            <div className="px-4 py-2">
              <div
                onClick={() => setCurrentScreen('account_edit')}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={elenaAvatar}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-600/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-slate-900">{name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">@{username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-purple-700">
                  <span>Edit</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 1. Account Section */}
            <SectionHeading title="Account" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={User}
                  title="Edit Profile"
                  subtitle="Name, bio, website, avatar"
                  onClick={() => setCurrentScreen('account_edit')}
                />
                <SettingRow
                  icon={AtSign}
                  title="Change Username"
                  subtitle={`@${username}`}
                  onClick={() => setCurrentScreen('account_username')}
                />
                <SettingRow
                  icon={Mail}
                  title="Email Address"
                  subtitle={email}
                  onClick={() => setCurrentScreen('account_email')}
                />
                <SettingRow
                  icon={Key}
                  title="Change Password"
                  subtitle="Last updated 3 months ago"
                  onClick={() => setCurrentScreen('account_password')}
                />
                <SettingRow
                  icon={RefreshCw}
                  title="Switch Account"
                  subtitle="2 accounts logged in"
                  onClick={() => setCurrentScreen('account_switch')}
                />
                <SettingRow
                  icon={Globe}
                  title="Manage Connected Accounts"
                  subtitle="Google, Apple ID"
                  onClick={() => setCurrentScreen('account_connected')}
                />
              </div>
            </div>

            {/* 2. Privacy & Safety */}
            <SectionHeading title="Privacy & Safety" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={MessageSquare}
                  title="DM Control"
                  subtitle="Preserve inbox tiers, paywalls & badges"
                  badge="Integrated"
                  onClick={() => {
                    if (onOpenDMControl) {
                      onOpenDMControl();
                    } else {
                      showToast('Opening DM Control system');
                    }
                  }}
                />
                <SettingRow
                  icon={Lock}
                  title="Private / Public Account"
                  subtitle={isPrivateAccount ? 'Private Account' : 'Public Account'}
                  onClick={() => setCurrentScreen('privacy_account')}
                />
                <SettingRow
                  icon={ShieldAlert}
                  title="Blocked Accounts"
                  subtitle={`${blockedAccounts.length} blocked`}
                  onClick={() => setCurrentScreen('privacy_blocked')}
                />
                <SettingRow
                  icon={UserX}
                  title="Restricted Accounts"
                  subtitle={`${restrictedAccounts.length} restricted`}
                  onClick={() => setCurrentScreen('privacy_restricted')}
                />
                <SettingRow
                  icon={Eye}
                  title="Activity Status"
                  subtitle={showActivityStatus ? 'Active' : 'Hidden'}
                  onClick={() => setCurrentScreen('privacy_activity')}
                />
                <SettingRow
                  icon={AtSign}
                  title="Who Can Mention Me"
                  subtitle={whoCanMention === 'everyone' ? 'Everyone' : whoCanMention === 'following' ? 'People you follow' : 'No one'}
                  onClick={() => setCurrentScreen('privacy_mentions')}
                />
                <SettingRow
                  icon={Smartphone}
                  title="Who Can Tag Me"
                  subtitle={whoCanTag === 'everyone' ? 'Everyone' : whoCanTag === 'following' ? 'People you follow' : 'No one'}
                  onClick={() => setCurrentScreen('privacy_tags')}
                />
                <SettingRow
                  icon={MessageSquare}
                  title="Comment Permissions"
                  subtitle={commentPermission === 'everyone' ? 'Everyone' : commentPermission === 'following' ? 'People you follow' : 'Off'}
                  onClick={() => setCurrentScreen('privacy_comments')}
                />
                <SettingRow
                  icon={Sliders}
                  title="Hidden Words & Content Filters"
                  subtitle={`${hiddenWords.length} custom phrases`}
                  onClick={() => setCurrentScreen('privacy_filters')}
                />
              </div>
            </div>

            {/* 3. Notifications */}
            <SectionHeading title="Notifications" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={Bell}
                  title="Notification Preferences"
                  subtitle="Push, DMs, Followers, Likes, Mentions"
                  onClick={() => setCurrentScreen('notifications')}
                />
              </div>
            </div>

            {/* 4. Appearance */}
            <SectionHeading title="Appearance" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={Palette}
                  title="Themes & Display"
                  subtitle={`Mode: ${appearance.theme} · Language: ${appearance.language.toUpperCase()}`}
                  onClick={() => setCurrentScreen('appearance')}
                />
              </div>
            </div>

            {/* 5. Security */}
            <SectionHeading title="Security" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={Shield}
                  title="Two-Factor Authentication"
                  subtitle={twoFactorEnabled ? 'Enabled (TOTP)' : 'Disabled'}
                  onClick={() => setCurrentScreen('security_2fa')}
                />
                <SettingRow
                  icon={Laptop}
                  title="Active Sessions"
                  subtitle="Chrome on macOS · Active now"
                  onClick={() => setCurrentScreen('security_sessions')}
                />
                <SettingRow
                  icon={Key}
                  title="Login History"
                  subtitle="Review recent logins"
                  onClick={() => setCurrentScreen('security_history')}
                />
              </div>
            </div>

            {/* 6. Preferences */}
            <SectionHeading title="Preferences" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={Sliders}
                  title="Content & Media Preferences"
                  subtitle="Autoplay, Data Saver, Recommendations"
                  onClick={() => setCurrentScreen('preferences')}
                />
              </div>
            </div>

            {/* 7. Payments & Subscriptions */}
            <SectionHeading title="Payments & Subscriptions" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={CreditCard}
                  title="Payment Methods & Creator Pro"
                  subtitle="Visa · FAIRY Creator Pro ($9.99/mo)"
                  onClick={() => setCurrentScreen('payments')}
                />
              </div>
            </div>

            {/* 8. Help & Support */}
            <SectionHeading title="Help & Support" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={HelpCircle}
                  title="Help Center & FAQs"
                  subtitle="Guides, Star Stamp docs & tips"
                  onClick={() => setCurrentScreen('help_center')}
                />
                <SettingRow
                  icon={Mail}
                  title="Contact Support"
                  subtitle="Direct message to FAIRY team"
                  onClick={() => setCurrentScreen('contact_support')}
                />
                <SettingRow
                  icon={AlertTriangle}
                  title="Report a Problem"
                  subtitle="Share feedback with product team"
                  onClick={() => setCurrentScreen('report_problem')}
                />
                <SettingRow
                  icon={AlertTriangle}
                  title="Report a Bug"
                  subtitle="Submit reproducible engineering bugs"
                  onClick={() => setCurrentScreen('report_bug')}
                />
              </div>
            </div>

            {/* 9. About FAIRY */}
            <SectionHeading title="About FAIRY" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={Info}
                  title="About the App"
                  subtitle="FAIRY v2.4.0 (Build 2026.10.11)"
                  onClick={() => setCurrentScreen('about_app')}
                />
                <SettingRow
                  icon={Shield}
                  title="Community Guidelines"
                  onClick={() => setCurrentScreen('community_guidelines')}
                />
                <SettingRow
                  icon={ExternalLink}
                  title="Terms of Service"
                  onClick={() => setCurrentScreen('terms_of_service')}
                />
                <SettingRow
                  icon={Lock}
                  title="Privacy Policy"
                  onClick={() => setCurrentScreen('privacy_policy')}
                />
              </div>
            </div>

            {/* 10. Account Actions */}
            <SectionHeading title="Account Actions" />
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                <SettingRow
                  icon={AlertTriangle}
                  title="Deactivate Account"
                  subtitle="Temporarily hide your profile"
                  onClick={() => setCurrentScreen('deactivate_account')}
                />
                <SettingRow
                  icon={Trash2}
                  title="Delete Account"
                  subtitle="Permanently erase data and connections"
                  danger
                  onClick={() => setCurrentScreen('delete_account')}
                />
                <SettingRow
                  icon={LogOut}
                  title="Log Out"
                  subtitle="Log out of @aerifairy"
                  danger
                  onClick={() => setShowLogoutModal(true)}
                />
              </div>
            </div>

            {/* Footer brand stamp */}
            <div className="mt-8 mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-slate-400">
                <AeriSlimeSqueezeIcon size={20} />
                <span className="text-xs font-black tracking-widest uppercase">FAIRY</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Version 2.4.0 (Build 2026.10.11)</p>
            </div>
          </>
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">Log out of FAIRY?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    showToast('Logged out of FAIRY');
                    onBack();
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATE CONFIRMATION MODAL */}
      {showDeactivateConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">Deactivate Account?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Your profile will be hidden from everyone on FAIRY until you sign back in. Are you sure?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowDeactivateConfirmModal(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateConfirmModal(false);
                  showToast('Account temporarily deactivated.');
                  if (onLogout) onLogout();
                  else onBack();
                }}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg text-red-600 tracking-tight">Permanently Delete?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Please type <span className="font-mono font-bold text-slate-800">DELETE</span> to confirm permanent deletion.
              </p>
            </div>
            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={e => setDeleteConfirmationInput(e.target.value)}
              placeholder="Type DELETE"
              className="w-full text-center px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-red-600 outline-none"
            />
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteConfirmationInput('');
                }}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationInput !== 'DELETE'}
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteConfirmationInput('');
                  showToast('Account permanently deleted.');
                  if (onLogout) onLogout();
                  else onBack();
                }}
                className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-colors ${
                  deleteConfirmationInput === 'DELETE'
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
