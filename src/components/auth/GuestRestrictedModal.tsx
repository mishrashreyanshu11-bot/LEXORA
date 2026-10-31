import React from 'react';
import { LexoraSymbol } from '../common/LexoraSymbol';
import { Sparkles, ArrowRight, Lock, BookOpen, Edit3, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface GuestRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  attemptedActionTitle?: string;
}

export const GuestRestrictedModal: React.FC<GuestRestrictedModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
  attemptedActionTitle,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#121008] via-[#08090d] to-black border-2 border-amber-400/70 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.35)] text-slate-100'
            : 'bg-white border-2 border-[#26F7F7] shadow-[0_20px_60px_rgba(38,247,247,0.25)] text-slate-900'
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute top-0 right-1/4 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
            isDark ? 'bg-amber-400/15' : 'bg-[#26F7F7]/20'
          }`}
        />

        {/* Brand Icon */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <LexoraSymbol size={52} glow={true} animated={false} />
          {attemptedActionTitle && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                isDark
                  ? 'bg-amber-400/15 border border-amber-400/35 text-amber-300'
                  : 'bg-cyan-50 border border-[#26F7F7] text-cyan-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{attemptedActionTitle}</span>
            </div>
          )}
        </div>

        {/* Heading & Exact Requested Copy */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Unlock the World of LEXORA
          </h2>
          <p
            className={`text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-sans ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Create your free account or sign in to start reading, writing, and exploring everything LEXORA has to offer.
          </p>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-2 gap-2 text-left text-xs">
          <div
            className={`p-2.5 rounded-2xl border space-y-1 ${
              isDark
                ? 'bg-black/60 border-amber-500/20 text-slate-300'
                : 'bg-slate-50 border-cyan-500/20 text-slate-700'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-serif font-bold text-[11px] ${
                isDark ? 'text-amber-300' : 'text-cyan-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Reading</span>
            </div>
            <p className="text-[10px] opacity-75">Serialized novels, chapters &amp; audiobooks.</p>
          </div>

          <div
            className={`p-2.5 rounded-2xl border space-y-1 ${
              isDark
                ? 'bg-black/60 border-amber-500/20 text-slate-300'
                : 'bg-slate-50 border-cyan-500/20 text-slate-700'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-serif font-bold text-[11px] ${
                isDark ? 'text-amber-300' : 'text-cyan-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Publishing Studio</span>
            </div>
            <p className="text-[10px] opacity-75">15 languages, auto-save &amp; AI verify.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className={`w-full py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_20px_rgba(243,186,56,0.35)]'
                : 'bg-gradient-to-r from-[#26F7F7] to-[#06b6d4] text-slate-950 shadow-[0_0_20px_rgba(38,247,247,0.35)]'
            }`}
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className={`w-full py-2.5 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer border ${
              isDark
                ? 'bg-black/60 hover:bg-white/5 border-amber-500/40 text-amber-200'
                : 'bg-white hover:bg-slate-100 border-[#26F7F7] text-slate-800'
            }`}
          >
            Log In
          </button>

          <button
            onClick={onClose}
            className={`text-[11px] underline pt-1 cursor-pointer transition-colors block mx-auto ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Continue Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
