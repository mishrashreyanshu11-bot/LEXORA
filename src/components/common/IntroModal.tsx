import React, { useEffect, useState } from 'react';
import { LexoraSymbol } from './LexoraSymbol';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [fadeStage, setFadeStage] = useState<'entering' | 'visible' | 'exiting'>('entering');

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setFadeStage('entering');
      const enterTimer = setTimeout(() => setFadeStage('visible'), 50);

      // Auto-advance after 2 seconds per user instruction
      const autoTimer = setTimeout(() => {
        setFadeStage('exiting');
        const closeTimer = setTimeout(() => {
          onClose();
        }, 400);
        return () => clearTimeout(closeTimer);
      }, 2000);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(autoTimer);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      const exitTimer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(exitTimer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="LEXORA Intro"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 cursor-pointer select-none ${
        fadeStage === 'visible' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Deep Obsidian Background with Subtle Radial Golden Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-[#07080c] to-black" />

      {/* Ambient Gold Starlight Particles / Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-gradient-to-tr from-amber-500/15 via-[#f3ba38]/20 to-yellow-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Full-screen Centered Presentation */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center space-y-6 max-w-xl mx-auto transform transition-transform duration-700 ease-out">
        {/* The Golden Emblem (Image 1 Fountain Pen & Star Crest) */}
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <LexoraSymbol size={110} glow={true} animated={true} />
        </div>

        {/* Majestic Golden Title: LEXORA */}
        <div className="space-y-2">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d1] via-[#e5b95a] to-[#9e7616] drop-shadow-[0_4px_30px_rgba(243,186,56,0.6)] uppercase">
            LEXORA
          </h1>

          {/* Subtitle: RADIATED INK with Gold Hairline Rules */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#e5b95a]/80 to-transparent" />
            <span className="font-serif text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#e5b95a] drop-shadow-sm">
              Radiated Ink
            </span>
            <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#e5b95a]/80 to-transparent" />
          </div>

          <p className="font-serif italic text-sm sm:text-base text-amber-100/80 pt-1 tracking-wide">
            Beyond the Loop.
          </p>
        </div>

        {/* Literature Font Attribution: CEO and Founder Shreyanshu Mishra */}
        <div className="pt-4 border-t border-amber-500/20 max-w-xs mx-auto">
          <p className="font-serif text-xs sm:text-sm tracking-wide text-amber-200/90">
            <span className="font-light text-slate-300">CEO &amp; Founder </span>
            <span className="font-bold text-[#f3ba38] drop-shadow-[0_0_12px_rgba(243,186,56,0.7)]">
              Shreyanshu Mishra
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
