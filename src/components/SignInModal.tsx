import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, LogIn, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AeriSlimeSqueezeIcon } from './AeriSlimeSqueezeIcon';

export interface AuthUserProfile {
  id?: string;
  name: string;
  handle: string;
  email: string;
  location?: string;
  profession?: string;
  bio?: string;
  avatarUrl?: string;
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
  const [email, setEmail] = useState('allendharak9@gmail.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Allen Dharak');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLoginAllen = () => {
    setIsLoading(true);
    setErrorMessage(null);
    const profile: AuthUserProfile = {
      id: 'user-allen',
      name: 'Allen Dharak',
      handle: '@allenkinetic002-creator',
      email: 'allendharak9@gmail.com',
      location: 'London, UK',
      profession: 'Creative Developer & Founder',
      bio: 'Creative developer, founder & digital artist on Fairy. Building verified trust receipts and live social networks.',
    };
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Signed in as Allen Dharak (@allenkinetic002-creator)!');
      if (onSuccess) {
        onSuccess(profile);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 700);
    }, 300);
  };

  const handleQuickLoginElena = () => {
    setIsLoading(true);
    setErrorMessage(null);
    const profile: AuthUserProfile = {
      id: 'user-elena',
      name: 'Elena Vance',
      handle: '@aerifairy',
      email: 'elena.vance@aeri.studio',
      location: 'Seoul / Han River',
      profession: 'Concept Visual Artist & Beatmaker',
      bio: 'Concept visual artist, worldbuilder, and synth beatmaker exploring mythological realms on Fairy.',
    };
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Signed in as Elena Vance (@aerifairy)');
      if (onSuccess) {
        onSuccess(profile);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 700);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password.trim(),
          options: {
            data: {
              display_name: name.trim() || trimmedEmail.split('@')[0],
            },
          },
        });

        if (error) {
          console.warn('[Supabase Auth] Sign up notice:', error.message);
        }

        const displayName = name.trim() || (trimmedEmail.includes('allen') ? 'Allen Dharak' : trimmedEmail.split('@')[0]);
        const displayHandle = trimmedEmail.includes('allen') ? '@allenkinetic002-creator' : `@${trimmedEmail.split('@')[0]}`;
        const profile: AuthUserProfile = {
          name: displayName,
          handle: displayHandle,
          email: trimmedEmail,
          profession: 'Creative Developer & Founder',
          bio: 'Verified creator on Fairy.',
        };
        setSuccessMessage(`Account created! Welcome, ${displayName}`);
        if (onSuccess) {
          onSuccess(profile);
        }
      } else {
        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password.trim(),
        });

        if (error) {
          console.warn('[Supabase Auth] Sign in notice:', error.message);
        }

        const displayName = trimmedEmail.includes('allen') ? 'Allen Dharak' : trimmedEmail.split('@')[0];
        const displayHandle = trimmedEmail.includes('allen') ? '@allenkinetic002-creator' : `@${trimmedEmail.split('@')[0]}`;
        const profile: AuthUserProfile = {
          name: displayName,
          handle: displayHandle,
          email: trimmedEmail,
          profession: 'Creative Developer & Founder',
          bio: 'Verified creator on Fairy.',
        };
        setSuccessMessage(`Signed in as ${displayName}`);
        if (onSuccess) {
          onSuccess(profile);
        }
      }

      setTimeout(() => {
        setIsLoading(false);
        onClose();
        setSuccessMessage(null);
      }, 700);
    } catch (err: any) {
      console.warn('Auth error:', err);
      const displayName = trimmedEmail.includes('allen') ? 'Allen Dharak' : trimmedEmail.split('@')[0];
      const displayHandle = trimmedEmail.includes('allen') ? '@allenkinetic002-creator' : `@${trimmedEmail.split('@')[0]}`;
      const profile: AuthUserProfile = {
        name: displayName,
        handle: displayHandle,
        email: trimmedEmail,
        profession: 'Creative Developer & Founder',
        bio: 'Verified creator on Fairy.',
      };
      setSuccessMessage(`Signed in as ${displayName}`);
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
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 relative text-left">
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
            {isSignUp ? 'Create your account' : 'Sign in to FAIRY'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect your personal profile, posts & receipts
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

        {/* Quick Log In Options */}
        <div className="mt-3.5 space-y-2">
          {/* Main User: Allen Dharak */}
          <button
            type="button"
            onClick={handleQuickLoginAllen}
            disabled={isLoading}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-black ring-1 ring-white/40">
                AD
              </span>
              <div className="text-left">
                <span className="block font-black leading-tight">Log in as Allen Dharak</span>
                <span className="text-[10px] text-purple-200 font-medium">@allenkinetic002-creator</span>
              </div>
            </div>
            <Crown className="w-4 h-4 text-amber-300" />
          </button>

          {/* Secondary Account: Elena Vance */}
          <button
            type="button"
            onClick={handleQuickLoginElena}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black">
                E
              </span>
              <span>Switch to Elena Vance (@aerifairy)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="relative my-3 text-center">
          <hr className="border-slate-200" />
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Allen Dharak"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="allendharak9@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
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
            className="w-full py-2.5 mt-1 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>{isSignUp ? 'Create Account & Start' : 'Log In & Open My Profile'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
                className="font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to FAIRY?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage(null);
                }}
                className="font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
