import React from 'react';
import { LexoraSymbol } from '../common/LexoraSymbol';
import { Sparkles, BookOpen, Edit3, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface WelcomeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const WelcomeGateModal: React.FC<WelcomeGateModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
}) => {
  if (!isOpen) return null;

  const handleContinueAsGuest = () => {
    localStorage.setItem('lexora_welcome_onboarding_shown', 'true');
    onClose();
  };

  const handleLoginClick = () => {
    localStorage.setItem('lexora_welcome_onboarding_shown', 'true');
    onClose();
    onOpenLogin();
  };

  const handleRegisterClick = () => {
    localStorage.setItem('lexora_welcome_onboarding_shown', 'true');
    onClose();
    onOpenRegister();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#121008] via-[#090b10] to-black rounded-3xl border-2 border-amber-400/70 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(243,186,56,0.35)] p-6 sm:p-8 space-y-6 text-slate-100 text-center">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Icon */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <LexoraSymbol size={58} glow={true} animated={false} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Beyond the Loop · Official Sanctuary</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome to LEXORA
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-amber-200">
            "Every Voice Has a Universe."
          </p>
          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
            Explore and preview visionary literature. To read serialized installments, write and publish manuscripts, or experience the exclusive Golden Library, sign in to your permanent account.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2.5 text-left text-xs pt-1">
          <div className="p-2.5 rounded-2xl bg-black/60 border border-amber-500/25 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-[11px]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Reading</span>
            </div>
            <p className="text-[10px] text-slate-400">Unlock complete serialized chapters &amp; audiobooks.</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/60 border border-amber-500/25 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-[11px]">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Author Suite</span>
            </div>
            <p className="text-[10px] text-slate-400">Publish in 15 languages with AI grammar assistance.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleRegisterClick}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(243,186,56,0.35)] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLoginClick}
            className="w-full py-2.5 rounded-full bg-black/60 hover:bg-white/5 border border-amber-500/40 text-amber-200 text-xs font-serif font-semibold transition-all cursor-pointer"
          >
            Sign In with Password
          </button>

          <button
            onClick={handleContinueAsGuest}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline pt-1 cursor-pointer transition-colors block mx-auto"
          >
            Explore Catalog as Guest Preview
          </button>
        </div>
      </div>
    </div>
  );
};
