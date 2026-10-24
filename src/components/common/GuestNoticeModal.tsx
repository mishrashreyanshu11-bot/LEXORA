import React from 'react';
import { X, Sparkles, BookOpen, Bookmark, UserCheck, MessageSquare } from 'lucide-react';
import { LexoraSymbol } from './LexoraSymbol';

interface GuestNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  actionAttempted?: string;
}

export const GuestNoticeModal: React.FC<GuestNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  actionAttempted = 'interactive features',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a0c10] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(243,186,56,0.25)] text-center space-y-5 text-slate-100 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Golden Emblem */}
        <div className="flex justify-center pt-2">
          <LexoraSymbol size={50} glow={true} animated={false} />
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Unlock Full Literary Features
          </h3>
          <p className="text-xs text-amber-200/80 font-serif italic">
            You're currently reading as a Guest.
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto font-sans">
          You can always read stories freely without signing in. However, to {actionAttempted}, create a free LEXORA account.
        </p>

        {/* Feature comparison pills */}
        <div className="grid grid-cols-2 gap-2 text-left text-[11px] pt-1">
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
            <span className="font-bold text-slate-400 block">Guest Readers:</span>
            <ul className="text-slate-400 space-y-0.5 list-disc list-inside">
              <li>Read all free chapters</li>
              <li>Explore all categories</li>
              <li>Listen to Audiobook</li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <span className="font-bold text-[#f3ba38] block">Members:</span>
            <ul className="text-amber-200/90 space-y-0.5 list-disc list-inside">
              <li>Save &amp; Bookmark</li>
              <li>Follow favourite writers</li>
              <li>Community reviews</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenAuth('register');
            }}
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] hover:opacity-95 text-slate-950 font-serif font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
          >
            Create Free Account / Sign In
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Continue Reading as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
