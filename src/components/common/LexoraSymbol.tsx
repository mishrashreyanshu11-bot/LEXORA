import React from 'react';

interface LexoraSymbolProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  animated?: boolean;
}

export const LexoraSymbol: React.FC<LexoraSymbolProps> = ({
  className = '',
  size = 40,
  glow = true,
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${animated ? 'animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-gradient-to-tr from-amber-500 via-[#f3ba38] to-yellow-200 pointer-events-none"
          style={{ transform: 'scale(0.85)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_2px_8px_rgba(243,186,56,0.45)]"
      >
        <defs>
          <linearGradient id="lexoraGoldGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fff3bf" />
            <stop offset="25%" stopColor="#ffd700" />
            <stop offset="55%" stopColor="#e5b95a" />
            <stop offset="85%" stopColor="#c59b27" />
            <stop offset="100%" stopColor="#8c6812" />
          </linearGradient>
          <linearGradient id="lexoraGoldShine" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#c59b27" />
            <stop offset="50%" stopColor="#fff6cc" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
          <radialGradient id="lexoraStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#d4af37" />
          </radialGradient>
        </defs>

        {/* 4-Pointed Crown Star on top of nib */}
        <path
          d="M 50 12 Q 50 20 44 22 Q 50 24 50 32 Q 50 24 56 22 Q 50 20 50 12 Z"
          fill="url(#lexoraStarGlow)"
        />

        {/* Fountain Pen Nib Body */}
        {/* Left facet */}
        <path
          d="M 50 34 L 43 45 L 43 50 L 50 63 L 50 48.5 A 2 2 0 0 1 50 45.5 L 50 34 Z"
          fill="url(#lexoraGoldGrad)"
        />
        {/* Right facet */}
        <path
          d="M 50 34 L 57 45 L 57 50 L 50 63 L 50 48.5 A 2 2 0 0 0 50 45.5 L 50 34 Z"
          fill="url(#lexoraGoldShine)"
        />

        {/* Central Breather Hole & Slit */}
        <circle cx="50" cy="47" r="1.8" fill="#090a0f" />
        <line x1="50" y1="34" x2="50" y2="45.2" stroke="#090a0f" strokeWidth="0.8" />
        <line x1="50" y1="48.8" x2="50" y2="63" stroke="#090a0f" strokeWidth="0.8" />

        {/* Spreading Lower Wings / Open Book Flourishes */}
        {/* Left Wing Flourish */}
        <path
          d="M 23 54 C 32 52 42 59 50 69 C 43 65 34 65 23 54 Z"
          fill="url(#lexoraGoldGrad)"
        />
        <path
          d="M 50 69 C 45 66 38 68 25 54 C 36 60 44 65 59 70 C 56 70 52 70 50 69 Z"
          fill="url(#lexoraGoldShine)"
          opacity="0.9"
        />

        {/* Right Wing Flourish */}
        <path
          d="M 77 54 C 68 52 58 59 50 69 C 57 65 66 65 77 54 Z"
          fill="url(#lexoraGoldShine)"
        />
        <path
          d="M 50 69 C 55 66 62 68 75 54 C 64 60 56 65 41 70 C 44 70 48 70 50 69 Z"
          fill="url(#lexoraGoldGrad)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
