import React from 'react';
import { LexoraSymbol } from './LexoraSymbol';

interface LexoraLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: number;
}

export const LexoraLoader: React.FC<LexoraLoaderProps> = ({
  message = 'Radiating Ink...',
  submessage = 'LEXORA · Beyond the Loop',
  fullScreen = false,
  size = 56,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center select-none animate-fade-in">
      <div className="relative">
        {/* Shimmering pulse aura */}
        <div className="absolute inset-0 rounded-full blur-xl bg-amber-500/25 animate-ping opacity-60" />
        <LexoraSymbol size={size} glow={true} animated={true} />
      </div>

      <div className="space-y-1">
        <p className="font-serif text-sm sm:text-base font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100">
          {message}
        </p>
        {submessage && (
          <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-amber-500/70">
            {submessage}
          </p>
        )}
      </div>

      {/* Elegant gold loading bar */}
      <div className="w-36 h-0.5 rounded-full bg-amber-950/60 overflow-hidden border border-amber-500/20">
        <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500 animate-[shimmer_1.5s_infinite] w-full" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
