import React from 'react';
import {
  X,
  LogIn,
  Sparkles,
  Lock,
  Heart,
  MessageCircle,
  PlusCircle,
  Zap,
} from 'lucide-react';
import { RegisteredAccount } from './SignInModal';

interface SignInRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName?: string;
  onOpenSignInModal: () => void;
  onQuickSignIn?: (account?: RegisteredAccount) => void;
}

export const SignInRequiredModal: React.FC<SignInRequiredModalProps> = ({
  isOpen,
  onClose,
  actionName,
  onOpenSignInModal,
  onQuickSignIn,
}) => {
  if (!isOpen) return null;

  const displayAction = actionName ? `to ${actionName}` : 'to interact with posts and creators';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-required-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock / Fairy Icon with Glowing Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 mb-4 flex items-center justify-center relative">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-600 stroke-[2.2]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </span>
        </div>

        {/* Title */}
        <h3
          id="sign-in-required-title"
          className="text-lg font-black text-slate-900 tracking-tight"
        >
          Sign In Required
        </h3>

        {/* Custom contextual description */}
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Please sign in <span className="font-bold text-purple-700">{displayAction}</span>. Join Fairy to unlock liking, posting, commenting, and direct messaging!
        </p>

        {/* What You Can Do List */}
        <div className="my-4 py-2.5 px-3 bg-purple-50/70 border border-purple-100/80 rounded-2xl text-left space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
            <Heart className="w-3.5 h-3.5 text-pink-500 shrink-0 fill-pink-500" />
            <span>Like posts and support creators</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
            <PlusCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Publish stories, photos, & tweets</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
            <MessageCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Join discussions & direct message</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignInModal();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>

          {onQuickSignIn && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickSignIn();
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Instant 1-Click: Sign in as @Gollumfairy</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-slate-400 hover:text-slate-600 font-semibold text-[11px] transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
