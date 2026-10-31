import React from 'react';
import { X, ExternalLink, MessageCircle, Instagram, Sparkles, CheckCircle, Users } from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const whatsappUrl = 'https://whatsapp.com/channel/0029Vb8s4JuDuMRn4H7z0n3t';
  const instagramUrl = 'https://www.instagram.com/lexora.____?srtk=ZHkxMW1nd2NtN21h&utm_source=qr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#080808] rounded-3xl border border-[#D4AF37]/40 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.25)] p-6 sm:p-8 space-y-6 text-[#F5F1E8] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-[#D4AF37]/20 pb-4">
          <div className="flex items-center gap-3">
            <LexoraSymbol size={38} glow={true} />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F1D58A] text-[10px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Official Literary Hub</span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide">
                Join the LEXORA Community
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans relative z-10">
          Connect directly with fellow storytellers, poets, and discerning readers worldwide. Receive exclusive story announcements, prompt releases, and author interactions across our verified official channels:
        </p>

        {/* Channels Grid */}
        <div className="space-y-4 relative z-10">
          {/* 1. WhatsApp Channel */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl bg-[#171717] hover:bg-[#1f1f1f] border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                      LEXORA WhatsApp Channel
                    </h4>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Official
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Instant story releases, quarterly arena prompts &amp; founder dispatches
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* 2. Instagram Community */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl bg-[#171717] hover:bg-[#1f1f1f] border border-rose-500/30 hover:border-rose-400/60 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)] group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-rose-300 transition-colors">
                      Instagram: @lexora.____
                    </h4>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Official
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Visual artwork, author spotlight reels, and literary quotes
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-300 group-hover:bg-rose-500 group-hover:text-black transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>LEXORA — Beyond the Loop</span>
          <span className="text-[#F1D58A] font-serif">50K+ Active Readers</span>
        </div>
      </div>
    </div>
  );
};
