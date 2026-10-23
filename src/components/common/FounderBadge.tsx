import React from 'react';

interface BadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Premium Verified Badge:
 * Exact Instagram-style 8-scallop rosette with #26f7db inside fill and crisp white tick!
 */
export const VerifiedBadge: React.FC<BadgeProps> = ({ size = 'sm', className = '' }) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dim = sizeMap[size] || sizeMap.sm;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle ${className}`}
      title="Vellum Verified Account"
    >
      <svg
        viewBox="0 0 24 24"
        className={`${dim} drop-shadow-xs transition-transform hover:scale-110`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Instagram Scallop Silhouette in #26f7db */}
        <path
          d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.143 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.214 2 10.534 2 12s.802 2.786 2.035 3.479C4.012 15.653 4 15.827 4 16c0 2.379 2.143 4.288 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.288 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.786 22 13.466 22 12s-.802-2.786-2.035-3.479z"
          fill="#26f7db"
        />
        {/* Crisp Pure White Tick */}
        <polyline
          points="7.5 12 10.5 15 16.5 9"
          stroke="#ffffff"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
};

/**
 * Founder Badge:
 * Deep black inside design with a rich radiant Golden Tick!
 */
export const FounderBadge: React.FC<BadgeProps> = ({
  size = 'sm',
  showLabel = true,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dim = sizeMap[size] || sizeMap.sm;

  return (
    <div
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
      title="Official Founder of Vellum (Shreyanshu Mishra)"
    >
      {/* Black rosette with Golden Tick */}
      <span className="inline-flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 24 24"
          className={`${dim} drop-shadow-sm transition-transform hover:scale-110`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep Black Rosette Base */}
          <path
            d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.143 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.214 2 10.534 2 12s.802 2.786 2.035 3.479C4.012 15.653 4 15.827 4 16c0 2.379 2.143 4.288 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.288 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.786 22 13.466 22 12s-.802-2.786-2.035-3.479z"
            fill="#05080f"
            stroke="#fbbf24"
            strokeWidth="0.8"
          />
          {/* Radiant Golden Tick */}
          <polyline
            points="7.5 12 10.5 15 16.5 9"
            stroke="#fbbf24"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>

      {showLabel && (
        <span
          className={`inline-flex items-center font-bold tracking-tight rounded-full bg-slate-950 text-amber-300 border border-amber-400/40 shadow-xs ${
            size === 'xs'
              ? 'px-1.5 py-0.2 text-[10px]'
              : size === 'sm'
              ? 'px-2 py-0.5 text-[11px]'
              : size === 'md'
              ? 'px-2.5 py-0.5 text-xs'
              : 'px-3 py-1 text-sm'
          }`}
        >
          Founder
        </span>
      )}
    </div>
  );
};
