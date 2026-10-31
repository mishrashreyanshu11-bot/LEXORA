import React from 'react';

interface BadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Premium Verified Badge:
 * User requirement: "the verification badge should be Black inside and golden tick combo."
 * Pure obsidian black inside fill with a radiant metallic Golden Tick and fine gold rim!
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
      title="LEXORA Verified Account"
    >
      <svg
        viewBox="0 0 24 24"
        className={`${dim} drop-shadow-[0_1px_4px_rgba(243,186,56,0.4)] transition-transform hover:scale-110`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lexoraTickGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3bf" />
            <stop offset="50%" stopColor="#f3ba38" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
          <linearGradient id="lexoraBorderGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#8c6812" />
          </linearGradient>
        </defs>

        {/* Black inside rosette with gold border */}
        <path
          d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.143 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.214 2 10.534 2 12s.802 2.786 2.035 3.479C4.012 15.653 4 15.827 4 16c0 2.379 2.143 4.288 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.288 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.786 22 13.466 22 12s-.802-2.786-2.035-3.479z"
          fill="#06070a"
          stroke="url(#lexoraBorderGold)"
          strokeWidth="1.2"
        />

        {/* Radiant Metallic Golden Tick */}
        <polyline
          points="7.5 12 10.5 15 16.5 9"
          stroke="url(#lexoraTickGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
};

/**
/**
 * FounderBadge:
 * User requirement: "remove the founder badge but keep the verified black and golden badge"
 * Seamlessly renders the sleek VerifiedBadge (obsidian black inside with radiant golden tick).
 */
export const FounderBadge: React.FC<BadgeProps> = ({
  size = 'sm',
  className = '',
}) => {
  return <VerifiedBadge size={size} className={className} />;
};

/**
 * Crown Badge:
 * Displayed floating directly above the avatar/PFP of 1st position Challenge Winners!
 */
export const CrownBadge: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'sm',
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
    <span
      className={`inline-flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.9)] select-none ${className}`}
      title="LEXORA Literary Arena Champion (1st Place Winner)"
    >
      <svg
        viewBox="0 0 24 24"
        className={`${dim} animate-bounce`}
        style={{ animationDuration: '2.5s' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 17h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2zm-1-3l2.5-9 5 4.5L12 2l2.5 7.5 5-4.5L22 14H2z"
          fill="url(#arenaCrownGold)"
          stroke="#78350f"
          strokeWidth="0.8"
        />
        <circle cx="12" cy="2" r="1.3" fill="#fff" />
        <circle cx="4.5" cy="5" r="1.1" fill="#fff" />
        <circle cx="19.5" cy="5" r="1.1" fill="#fff" />
        <defs>
          <linearGradient id="arenaCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fcd34d" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

interface AvatarWithBadgeProps {
  avatarUrl: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasCrownBadge?: boolean;
  isFounder?: boolean;
  isVerified?: boolean;
  className?: string;
}

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  avatarUrl,
  name,
  size = 'md',
  hasCrownBadge = false,
  isFounder = false,
  isVerified = false,
  className = '',
}) => {
  const avatarSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const crownSizes: Record<string, 'xs' | 'sm' | 'md' | 'lg'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg',
  };

  const badgeSizes: Record<string, 'xs' | 'sm' | 'md'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'md',
  };

  const dim = avatarSizes[size] || avatarSizes.md;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Floating Crown Badge DIRECTLY above avatar/PFP */}
      {hasCrownBadge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-transform hover:scale-125">
          <CrownBadge size={crownSizes[size]} />
        </div>
      )}

      {/* Avatar Container */}
      <div
        className={`relative ${dim} rounded-full overflow-hidden bg-slate-900 ring-2 ${
          hasCrownBadge
            ? 'ring-amber-400 shadow-md shadow-amber-500/40'
            : isFounder
            ? 'ring-[#f3ba38] shadow-md shadow-amber-500/30'
            : isVerified
            ? 'ring-amber-500/50'
            : 'ring-zinc-800'
        }`}
      >
        <img
          src={avatarUrl || '/assets/aistudio/IMG_6033_dd143268.jpeg'}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/IMG_6033_dd143268.jpeg';
          }}
        />
      </div>

      {/* 3D Crown Founder Badge or Black & Gold Verified Badge on bottom right corner */}
      {(isFounder || isVerified) && (
        <div className="absolute -bottom-1 -right-1 z-10 bg-black rounded-full p-0.5 shadow-sm border border-amber-500/30">
          {isFounder ? (
            <FounderBadge size={badgeSizes[size]} showLabel={false} />
          ) : (
            <VerifiedBadge size={badgeSizes[size]} />
          )}
        </div>
      )}
    </div>
  );
};
