import React from 'react';
import { Gift, Sparkles, Heart, Crown, X } from 'lucide-react';
import { LexoraSymbol } from './LexoraSymbol';

interface BirthdayWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const BirthdayWishModal: React.FC<BirthdayWishModalProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1c1404] via-[#090b10] to-black rounded-3xl border-2 border-amber-400/70 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(243,186,56,0.4)] p-6 sm:p-8 space-y-6 text-slate-100 text-center">
        {/* Confetti Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Celebration Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-[#f3ba38] p-0.5 shadow-[0_0_25px_rgba(243,186,56,0.5)]">
          <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
            <Gift className="w-8 h-8 text-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Founder Birthday Greeting</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Happy Birthday, {userName}!
          </h2>
          <p className="font-serif italic text-sm text-amber-200">
            "Every voice has a universe, and today we celebrate yours."
          </p>
        </div>

        {/* Personal Letter from Founder */}
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-left space-y-2.5">
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            On behalf of the entire LEXORA literary universe, I want to personally wish you a profoundly joyous, creative, and fulfilling birthday!
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            May your words carry eternal resonance, your imagination surpass ordinary boundaries, and may you continue crafting realms beyond the loop.
          </p>

          <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="font-serif font-bold text-xs text-amber-300">
                Shreyanshu Mishra
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Founder &amp; CEO, LEXORA Global
              </p>
            </div>
            <LexoraSymbol size={26} glow={false} />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(243,186,56,0.35)] cursor-pointer"
        >
          Thank You, Shreyanshu! Let's Read
        </button>
      </div>
    </div>
  );
};
