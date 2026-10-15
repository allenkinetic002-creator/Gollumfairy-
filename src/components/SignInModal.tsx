import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Crown,
  AtSign,
  UserCheck,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AeriSlimeSqueezeIcon } from './AeriSlimeSqueezeIcon';

export interface AuthUserProfile {
  id?: string;
  username?: string;
  name: string;
  handle: string;
  email: string;
  location?: string;
  profession?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface RegisteredAccount {
  id: string;
  username: string;
  handle: string;
  name: string;
  email: string;
  location?: string;
  profession?: string;
  bio?: string;
  avatarUrl?: string;
  isOfficial?: boolean;
}

const DEFAULT_REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-allen',
    username: 'allenkinetic002-creator',
    handle: '@allenkinetic002-creator',
    name: 'Allen Dharak',
    email: 'allenkinetic002@gmail.com',
    location: 'London, UK',
    profession: 'Creative Developer & Founder',
    bio: 'Creative developer, founder & digital artist on Fairy. Building verified trust receipts and live social networks.',
    isOfficial: true,
  },
  {
    id: 'user-gollumfairy',
    username: 'Gollumfairy',
    handle: '@Gollumfairy',
    name: 'Gollumfairy',
    email: 'gollumfairy@fairy.app',
    location: 'Fairy Realm',
    profession: 'Verified Fairy Creator',
    bio: 'Official creator of Gollumfairy on Fairy network. Verified trust receipts & live community feeds.',
    isOfficial: true,
  },
  {
    id: 'user-kinetic',
    username: 'kinetic',
    handle: '@kinetic',
    name: 'Kinetic',
    email: 'kinetic@fairy.app',
    location: 'Kyoto, Japan',
    profession: 'Photographer & Digital Artist',
    bio: 'Photographer exploring tea houses, autumn light, and visual stillness in Kyoto.',
    isOfficial: false,
  },
  {
    id: 'user-karak',
    username: 'karak',
    handle: '@karak',
    name: 'Karak',
    email: 'karak@fairy.app',
    location: 'Kyoto, Japan',
    profession: 'Visual Storyteller',
    bio: 'Capturing street moments, moods, and experimental aesthetic vignettes.',
    isOfficial: false,
  },
];

export function getStoredRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem('fairy_registered_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure defaults are present and remove any legacy mock/fake users
        const map = new Map<string, RegisteredAccount>();
        DEFAULT_REGISTERED_ACCOUNTS.forEach((a) => map.set(a.username.toLowerCase(), a));
        parsed.forEach((a) => {
          if (
            a &&
            a.username &&
            !['aerifairy', 'user-elena', 'elena vance'].includes(a.username.toLowerCase()) &&
            !a.name?.toLowerCase().includes('elena')
          ) {
            map.set(a.username.toLowerCase(), a);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Failed reading fairy_registered_users:', e);
  }
  return DEFAULT_REGISTERED_ACCOUNTS;
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  try {
    const existing = getStoredRegisteredAccounts();
    const map = new Map<string, RegisteredAccount>();
    existing.forEach((a) => map.set(a.username.toLowerCase(), a));
    map.set(account.username.toLowerCase(), account);
    const updated = Array.from(map.values());
    localStorage.setItem('fairy_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed saving fairy_registered_users:', e);
  }
}

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUserProfile) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>([]);
  
  // Login / Register input states
  const [loginIdentifier, setLoginIdentifier] = useState('Gollumfairy');
  const [password, setPassword] = useState('password123');
  
  // Register fields
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const accounts = getStoredRegisteredAccounts();
      setRegisteredAccounts(accounts);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // One-click quick login as any registered account
  const handleQuickLogin = (account: RegisteredAccount) => {
    setIsLoading(true);
    setErrorMessage(null);
    const profile: AuthUserProfile = {
      id: account.id,
      username: account.username,
      name: account.name || account.username,
      handle: account.handle || `@${account.username}`,
      email: account.email || `${account.username}@fairy.app`,
      location: account.location || 'Fairy Realm',
      profession: account.profession || 'Verified Creator',
      bio: account.bio || `${account.name} (${account.handle}) on Fairy.`,
      avatarUrl: account.avatarUrl,
    };

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Logged in with username: ${profile.handle}`);
      if (onSuccess) {
        onSuccess(profile);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 700);
    }, 250);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isSignUp) {
      // Sign Up with Username
      const cleanUsername = registerUsername.trim().replace(/^@+/, '');
      if (!cleanUsername) {
        setErrorMessage('Please enter a username for your account.');
        return;
      }
      if (cleanUsername.length < 2) {
        setErrorMessage('Username must be at least 2 characters.');
        return;
      }
      const trimmedEmail = registerEmail.trim() || `${cleanUsername.toLowerCase()}@fairy.app`;
      const trimmedName = registerName.trim() || cleanUsername;

      setIsLoading(true);

      // Attempt Supabase sign up in background (doesn't block client)
      try {
        await supabase.auth.signUp({
          email: trimmedEmail,
          password: password.trim() || 'password123',
          options: {
            data: {
              username: cleanUsername,
              display_name: trimmedName,
            },
          },
        });
      } catch (err) {
        console.warn('[Supabase Auth] notice:', err);
      }

      const newAccount: RegisteredAccount = {
        id: `user-${cleanUsername.toLowerCase()}`,
        username: cleanUsername,
        handle: `@${cleanUsername}`,
        name: trimmedName,
        email: trimmedEmail,
        location: 'Global / Remote',
        profession: 'Verified Fairy Creator',
        bio: `${trimmedName} (@${cleanUsername}) on Fairy network.`,
      };

      saveRegisteredAccount(newAccount);
      setRegisteredAccounts(getStoredRegisteredAccounts());

      const profile: AuthUserProfile = {
        ...newAccount,
      };

      setSuccessMessage(`Registered & logged in as ${profile.handle}!`);
      if (onSuccess) {
        onSuccess(profile);
      }

      setTimeout(() => {
        setIsLoading(false);
        onClose();
        setSuccessMessage(null);
      }, 700);
    } else {
      // Sign in as Registered User with Username
      const rawIdentifier = loginIdentifier.trim();
      if (!rawIdentifier) {
        setErrorMessage('Please enter your registered username or email.');
        return;
      }

      setIsLoading(true);

      const cleanIdentifier = rawIdentifier.replace(/^@+/, '');
      const accounts = getStoredRegisteredAccounts();

      // Look up existing registered user by username, handle, or email
      const matched = accounts.find(
        (a) =>
          a.username.toLowerCase() === cleanIdentifier.toLowerCase() ||
          a.handle.toLowerCase() === `@${cleanIdentifier.toLowerCase()}` ||
          a.email.toLowerCase() === rawIdentifier.toLowerCase()
      );

      let profile: AuthUserProfile;

      if (matched) {
        // Use the exact registered user profile with their username!
        profile = {
          id: matched.id,
          username: matched.username,
          name: matched.name || matched.username,
          handle: matched.handle || `@${matched.username}`,
          email: matched.email,
          location: matched.location,
          profession: matched.profession,
          bio: matched.bio,
          avatarUrl: matched.avatarUrl,
        };
      } else {
        // User entered a new registered username directly
        const cleanUser = cleanIdentifier.includes('@') && cleanIdentifier.includes('.')
          ? cleanIdentifier.split('@')[0]
          : cleanIdentifier;
        const newAccount: RegisteredAccount = {
          id: `user-${cleanUser.toLowerCase()}`,
          username: cleanUser,
          handle: `@${cleanUser}`,
          name: cleanUser,
          email: rawIdentifier.includes('@') ? rawIdentifier : `${cleanUser}@fairy.app`,
          location: 'Global / Remote',
          profession: 'Verified Fairy Creator',
          bio: `${cleanUser} (@${cleanUser}) on Fairy network.`,
        };
        saveRegisteredAccount(newAccount);
        setRegisteredAccounts(getStoredRegisteredAccounts());

        profile = {
          ...newAccount,
        };
      }

      // Try Supabase auth in background
      try {
        await supabase.auth.signInWithPassword({
          email: profile.email,
          password: password.trim() || 'password123',
        });
      } catch (err) {
        console.warn('[Supabase Auth] notice:', err);
      }

      setSuccessMessage(`Logged in with registered username: ${profile.handle}`);
      if (onSuccess) {
        onSuccess(profile);
      }

      setTimeout(() => {
        setIsLoading(false);
        onClose();
        setSuccessMessage(null);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 relative text-left max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center pt-1 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-md">
            <AeriSlimeSqueezeIcon size={34} />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2.5">
            {isSignUp ? 'Register with Username' : 'Log in as Registered User'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Use your registered username across posts, tweets & receipts
          </p>
        </div>

        {/* Success or Error Banners */}
        {successMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Quick Log In As Registered Accounts */}
        {!isSignUp && registeredAccounts.length > 0 && (
          <div className="mt-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Select Registered Account
              </span>
              <span className="text-[10px] text-slate-400">1-click login</span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
              {registeredAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-black shrink-0">
                      {acc.username.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="truncate">
                      <span className="block font-bold text-slate-900 group-hover:text-indigo-950 truncate">
                        {acc.name || acc.username}
                      </span>
                      <span className="text-[10.5px] font-mono text-indigo-600 group-hover:text-indigo-700 block truncate">
                        {acc.handle || `@${acc.username}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {acc.isOfficial && (
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                      Use
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative my-3 text-center">
              <hr className="border-slate-200" />
              <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                or sign in with username
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-2.5 mt-2">
          {isSignUp ? (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Your Username <span className="text-purple-600">*</span>
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gollumfairy"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-bold text-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Your handle will be @{registerUsername.trim().replace(/^@+/, '') || 'username'}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name / Display Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Gollum Fairy"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="you@fairy.app"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your Registered Username or Email <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Gollumfairy or @Gollumfairy"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-bold text-slate-900"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Will sign in as @{loginIdentifier.trim().replace(/^@+/, '') || 'username'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>
                  {isSignUp
                    ? 'Register & Use My Username'
                    : `Log In with Username (@${(loginIdentifier.trim().replace(/^@+/, '') || 'username')})`}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
                className="font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Log In with Username
              </button>
            </p>
          ) : (
            <p>
              Need to register a new username?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage(null);
                }}
                className="font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
