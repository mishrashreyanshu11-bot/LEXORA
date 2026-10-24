import React from 'react';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';

interface LexoraEliteCardProps {
  memberName?: string;
  isSubscribed?: boolean;
  memberSince?: string;
  className?: string;
  showFeaturesList?: boolean;
}

export const LexoraEliteCard: React.FC<LexoraEliteCardProps> = ({
  memberName = 'Shreyanshu Mishra',
  isSubscribed = false,
  memberSince = '2026',
  className = '',
  showFeaturesList = false,
}) => {
  return (
    <div className={`space-y-4 select-none ${className}`}>
      {/* ==================================================================== */}
      {/* THE DIGITAL LEXORA ELITE CARD (EXACT MOCKUP FROM IMAGE 2) */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[1.586/1] rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#121318] via-[#090a0d] to-[#040406] shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(243,186,56,0.18)] border border-[#e5b95a]/30 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] group">
        {/* Subtle Brushed Metal Texture Shimmer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Double Gold Bevel Inset Border from Image 2 */}
        <div className="absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl border border-[#e5b95a]/40 pointer-events-none" />
        <div className="absolute inset-3.5 sm:inset-4.5 rounded-lg sm:rounded-xl border border-[#e5b95a]/15 pointer-events-none" />

        {/* Diagonal Light Glare Effect on Hover */}
        <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-full" />

        {/* Top Section: Gold Geometric Diamond Emblem (Image 2) */}
        <div className="relative z-10 flex items-start justify-between">
          {/* Geometric Diamond Emblem */}
          <div className="relative">
            <svg
              viewBox="0 0 60 60"
              className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_2px_10px_rgba(243,186,56,0.5)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="diamondGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff4c2" />
                  <stop offset="35%" stopColor="#ffd700" />
                  <stop offset="70%" stopColor="#e5b95a" />
                  <stop offset="100%" stopColor="#966e14" />
                </linearGradient>
              </defs>
              {/* Outer Diamond */}
              <rect
                x="30"
                y="6"
                width="34"
                height="34"
                rx="3"
                transform="rotate(45 30 6)"
                stroke="url(#diamondGoldGrad)"
                strokeWidth="3.2"
                fill="none"
              />
              {/* Inner Diamond */}
              <rect
                x="30"
                y="14"
                width="22.5"
                height="22.5"
                rx="2"
                transform="rotate(45 30 14)"
                stroke="url(#diamondGoldGrad)"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Central Core Pip */}
              <rect
                x="30"
                y="22"
                width="11"
                height="11"
                rx="1"
                transform="rotate(45 30 22)"
                fill="url(#diamondGoldGrad)"
              />
            </svg>
          </div>

          {/* Card Category Branding */}
          <div className="text-right">
            <span className="font-serif tracking-[0.25em] text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#e5b95a] to-yellow-100 uppercase font-bold block">
              LEXORA
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#e5b95a]/60 font-sans">
              Elite Pass
            </span>
          </div>
        </div>

        {/* Center / Lower: Personalized Engraved Name */}
        <div className="relative z-10 pt-4 sm:pt-6">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#e5b95a]/70 font-mono block">
            {isSubscribed ? 'Active Elite Member' : 'Authorized Cardholder'}
          </span>
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#f3ba38] to-[#dfb15b] truncate drop-shadow-sm capitalize">
            {memberName || 'Your Name Here'}
          </p>
        </div>

        {/* Bottom Bar: VIP MEMBER text from Image 2 */}
        <div className="relative z-10 pt-2 sm:pt-3 flex items-end justify-between">
          <div className="text-[10px] font-mono text-amber-500/60 tracking-wider">
            NO. LX-{memberSince}-{(memberName?.length || 8) * 114}
          </div>

          <div className="text-right">
            <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#e5b95a] to-yellow-300 uppercase drop-shadow-sm">
              VIP MEMBER
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3 BEST FEATURES SHOWCASE (User Requirement) */}
      {/* ==================================================================== */}
      {showFeaturesList && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#101217] to-[#07080b] border border-amber-500/25 space-y-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f3ba38]" />
            <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200">
              Elite Subscription Privileges (₹299/mo)
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Feature 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#f3ba38]" />
              </div>
              <div>
                <p className="font-bold text-slate-100">
                  1. The Golden Library &amp; Complete Unlocks
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unlimited immediate access to all 40+ serialized chapters, exclusive poems, and curated classics without paywalls.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#f3ba38]" />
              </div>
              <div>
                <p className="font-bold text-slate-100">
                  2. AI Writing Companion &amp; InkVault
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Preserve My Voice editorial engine, rhyme &amp; meter assistants, plus encrypted manuscript storage for private drafts.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#f3ba38]" />
              </div>
              <div>
                <p className="font-bold text-slate-100">
                  3. Digital Elite Card, Crown Badge &amp; Arena Entry
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your personalized engraved VIP Card, black &amp; gold verification rosette, and entry into the quarterly LEXORA Literary Arena.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
