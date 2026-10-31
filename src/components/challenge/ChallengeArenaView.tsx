import React from 'react';
import { Trophy, Sparkles, ArrowLeft, Clock, Bell, BookOpen } from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface ChallengeArenaViewProps {
  onBack?: () => void;
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenCreateStory?: () => void;
  onBackToHome?: () => void;
}

export const ChallengeArenaView: React.FC<ChallengeArenaViewProps> = ({
  onBack,
  onSelectStory,
  onReadPart,
  onOpenCreateStory,
  onBackToHome,
}) => {
  const handleBack = onBack || onBackToHome;

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 pb-28 pt-10 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-amber-500/10 via-[#f3ba38]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-black/80 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(243,186,56,0.15)]">
        {handleBack && (
          <div className="flex justify-start">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-500/30 text-xs font-serif font-semibold cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        )}
        {/* Crest */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <LexoraSymbol size={72} glow={true} animated={true} />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-black border border-amber-400 text-amber-300">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400/90 font-semibold">
            LEXORA Literary Arena · Beyond the Loop!
          </span>
        </div>

        {/* Core Message as requested */}
        <div className="space-y-3">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe494] via-[#f3ba38] to-[#d4af37] tracking-tight">
            No Recent Challenges! Stay Tuned
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            The LEXORA Grand Arena convenes on a curated quarterly schedule. The previous season has concluded, and our Founder Review Board is curating the upcoming prompt cycle.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 text-left pt-2">
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-serif font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Arena</span>
            </div>
            <p className="text-[11px] text-slate-400">Announced via platform notification &amp; home banner.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-serif font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Prizes &amp; Honors</span>
            </div>
            <p className="text-[11px] text-slate-400">Crown badge, 1-month verification &amp; 1-week home feature.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              if (onBackToHome) {
                onBackToHome();
              } else {
                window.location.hash = '#home';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(243,186,56,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Beyond the Loop</span>
          </button>

          {onOpenCreateStory && (
            <button
              onClick={onOpenCreateStory}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all cursor-pointer"
            >
              Draft in Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
