import React, { useState } from 'react';
import { X, Printer, Download, Edit3, Award, Sparkles, Check } from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface LexoraAchievementCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipientName?: string;
  categoryCompleted?: string;
  storiesCount?: number;
}

export const LexoraAchievementCertificateModal: React.FC<LexoraAchievementCertificateModalProps> = ({
  isOpen,
  onClose,
  defaultRecipientName = 'Shreyanshu Mishra',
  categoryCompleted = 'Philosophy & Serialized Wisdom',
  storiesCount = 40,
}) => {
  const [recipientName, setRecipientName] = useState(defaultRecipientName);
  const [customSignature, setCustomSignature] = useState(defaultRecipientName);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#08090d] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(243,186,56,0.3)] border border-amber-500/40 overflow-hidden my-auto animate-fade-in text-slate-100">
        {/* Top Control Bar */}
        <div className="p-4 bg-[#0d0e14] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#f3ba38]" />
            <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
              LEXORA Certificate of Achievement (40 Stories / Category Mastery)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Details' : 'Edit Signature & Name'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editing drawer if open */}
        {isEditing && (
          <div className="p-4 bg-amber-950/20 border-b border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-slide-down">
            <div>
              <label className="block text-amber-300 font-semibold mb-1">
                Recipient / Pen Name:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="Enter writer full name"
              />
            </div>
            <div>
              <label className="block text-amber-300 font-semibold mb-1">
                Your Honour Signature (Cursive):
              </label>
              <input
                type="text"
                value={customSignature}
                onChange={(e) => setCustomSignature(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 font-serif italic focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="Enter your cursive sign-off"
              />
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CERTIFICATE CANVAS (EXACT MATCH OF IMAGE 3) */}
        {/* ==================================================================== */}
        <div
          id="lexora-printable-certificate"
          className="relative p-6 sm:p-12 md:p-16 bg-[#06070a] border-8 border-[#0d0e14] m-3 sm:m-6 rounded-2xl shadow-inner select-none overflow-hidden print:m-0 print:border-none"
        >
          {/* Outer Gold Filigree Border */}
          <div className="absolute inset-3 sm:inset-5 border-2 border-[#e5b95a]/80 pointer-events-none" />
          <div className="absolute inset-4.5 sm:inset-7 border border-[#e5b95a]/30 pointer-events-none" />

          {/* 4 Ornate Gold Corner Flourishes */}
          <div className="absolute top-5 left-5 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-[#ffd700] pointer-events-none">
            <span className="block w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-[#ffd700] m-1" />
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-[#ffd700] pointer-events-none">
            <span className="block w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-[#ffd700] m-1 float-right" />
          </div>
          <div className="absolute bottom-5 left-5 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-[#ffd700] pointer-events-none">
            <span className="block w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-[#ffd700] m-1" />
          </div>
          <div className="absolute bottom-5 right-5 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-[#ffd700] pointer-events-none">
            <span className="block w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-[#ffd700] m-1 float-right" />
          </div>

          {/* Top Row: Left Motto & Right Motto */}
          <div className="flex items-start justify-between text-[8px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.25em] text-[#e5b95a]/80">
            <div className="space-y-0.5 text-left">
              <p>READ</p>
              <p>WRITE</p>
              <p>BELONG</p>
              <span className="block w-4 h-0.5 bg-[#e5b95a]/60 mt-1" />
            </div>

            <div className="space-y-0.5 text-right">
              <p>BETTER</p>
              <p>WORDS</p>
              <p>A BRIGHTER</p>
              <p>TOMORROW</p>
              <span className="block w-4 h-0.5 bg-[#e5b95a]/60 mt-1 ml-auto" />
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="text-center space-y-4 sm:space-y-6 pt-4 pb-6 relative z-10 max-w-2xl mx-auto">
            {/* Top Logo: LEXORA with Quill inside 'O' + RADIATED INK */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center gap-1">
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d1] via-[#ffd700] to-[#b8860b] uppercase">
                  LEX
                </span>
                {/* Special 'O' with diagonal quill feather as in Image 3 */}
                <div className="relative inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11">
                  <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d1] via-[#ffd700] to-[#b8860b]">
                    O
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform -rotate-45">
                    <span className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-[#fff4c2] via-[#ffd700] to-[#b8860b]" />
                  </div>
                </div>
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d1] via-[#ffd700] to-[#b8860b] uppercase">
                  RA
                </span>
              </div>

              {/* Radiated Ink with Hairlines */}
              <div className="flex items-center justify-center gap-3">
                <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-[#ffd700]/70 to-transparent" />
                <span className="font-serif text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#ffd700]">
                  R A D I A T E D &nbsp; I N K
                </span>
                <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-[#ffd700]/70 to-transparent" />
              </div>
            </div>

            {/* Title: CERTIFICATE OF ACHIEVEMENT */}
            <div className="space-y-1 pt-2">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.16em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#fff4c2] via-[#f3ba38] to-[#996515] drop-shadow-[0_2px_12px_rgba(243,186,56,0.35)]">
                CERTIFICATE
              </h2>
              <p className="font-serif text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#e5b95a] uppercase">
                OF ACHIEVEMENT
              </p>
            </div>

            {/* Line: THIS CERTIFIES THAT */}
            <p className="font-serif text-[10px] sm:text-xs tracking-[0.25em] text-amber-200/70 uppercase">
              THIS CERTIFIES THAT
            </p>

            {/* Recipient Name in flowing Golden Cursive Script from Image 3 */}
            <div className="py-2 border-b border-[#e5b95a]/40 max-w-md mx-auto">
              <h3 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#fcd34d] to-[#dfb15b] tracking-wide drop-shadow-[0_2px_10px_rgba(243,186,56,0.5)]">
                {recipientName}
              </h3>
            </div>

            {/* Honors Description */}
            <div className="max-w-xl mx-auto space-y-2 text-[10px] sm:text-xs text-amber-100/90 leading-relaxed font-serif uppercase tracking-widest">
              <p>
                HAS SUCCESSFULLY CONTRIBUTED TO THE LEXORA COMMUNITY THROUGH EXCEPTIONAL WRITING, CREATIVITY AND A DEEP PASSION FOR LITERATURE.
              </p>
              <p className="pt-2 text-amber-300/80 font-sans normal-case italic text-xs sm:text-sm">
                "Your words matter. Thank you for being a part of LEXORA."
              </p>
            </div>

            {/* Bottom Row: Signatures + Gold Wax Seal */}
            <div className="pt-8 sm:pt-10 flex items-end justify-between max-w-2xl mx-auto">
              {/* Left: Your Signature */}
              <div className="text-center w-36 sm:w-48 space-y-1">
                <p className="font-serif italic text-lg sm:text-xl font-bold text-[#ffd700] tracking-wide">
                  {customSignature}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffd700]/60 to-transparent" />
                <p className="text-[9px] sm:text-[10px] font-serif uppercase tracking-[0.2em] text-[#e5b95a]/80">
                  HONOUR SIGNATURE
                </p>
              </div>

              {/* Center: 3D Embossed Gold Wax Seal Medallion with Feather & Laurel */}
              <div className="relative -mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#fff4c2] p-1 shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#8a5d09] to-[#422c03] border-2 border-[#fff3bf] flex flex-col items-center justify-center text-center p-1">
                    {/* Feather Icon in Seal */}
                    <span className="text-base sm:text-xl">🪶</span>
                    <span className="text-[6px] sm:text-[7px] font-serif font-black tracking-widest text-[#ffd700] uppercase">
                      LEXORA SEAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: CEO Signature */}
              <div className="text-center w-36 sm:w-48 space-y-1">
                <p className="font-serif italic text-lg sm:text-xl font-bold text-[#ffd700] tracking-wide">
                  Lexora
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffd700]/60 to-transparent" />
                <p className="text-[9px] sm:text-[10px] font-serif uppercase tracking-[0.2em] text-[#e5b95a]/80">
                  FOUNDER &amp; CEO LEXORA
                </p>
                <p className="text-[8px] text-amber-400/60 font-sans">
                  Shreyanshu Mishra
                </p>
              </div>
            </div>
          </div>

          {/* Right Border Full-Height Golden Feather Quill Art from Image 3 */}
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 opacity-25 sm:opacity-40 pointer-events-none">
            <svg
              viewBox="0 0 100 300"
              className="w-16 sm:w-24 h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 280 C60 220 85 140 40 20 C60 90 70 170 50 280 Z"
                fill="url(#goldFeatherGrad)"
              />
              <path
                d="M45 270 Q60 180 35 30"
                stroke="#ffd700"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="goldFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#8c6812" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
