import React from 'react';
import { WriterCertificate } from '../../types';
import { X, Award, Download, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { CrownBadge } from '../common/FounderBadge';

interface WinnerCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: WriterCertificate | null;
  storyTitle?: string;
}

export const WinnerCertificateModal: React.FC<WinnerCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  storyTitle,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-300/60 overflow-hidden my-auto animate-fade-in">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-amber-200">
              Official LEXORA Literary Arena Champion Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Parchment Body */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-[#fffef7] via-[#fffbf0] to-[#fffdf7] text-slate-900 relative border-8 border-double border-amber-400/50 m-3 rounded-2xl shadow-inner print:m-0 print:border-4">
          {/* Ornate Gold Corner Filigrees */}
          <div className="absolute top-3 left-3 text-amber-400/60 select-none text-2xl font-serif">❧</div>
          <div className="absolute top-3 right-3 text-amber-400/60 select-none text-2xl font-serif">☙</div>
          <div className="absolute bottom-3 left-3 text-amber-400/60 select-none text-2xl font-serif">❧</div>
          <div className="absolute bottom-3 right-3 text-amber-400/60 select-none text-2xl font-serif">☙</div>

          <div className="text-center space-y-6">
            {/* Header / Crown Emblem */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-400 flex items-center justify-center shadow-md p-1">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <CrownBadge size="lg" />
                </div>
              </div>

              <div className="pt-2">
                <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-800">
                  LEXORA — Beyond the Loop
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight pt-1">
                  Quarterly Literary Arena Champion
                </h1>
                <p className="text-xs text-slate-500 font-sans italic pt-0.5">
                  Radiated Ink · Every Voice Has a Universe
                </p>
              </div>
            </div>

            {/* Presentation Statement */}
            <div className="space-y-3">
              <p className="font-serif text-sm text-slate-600 italic">
                This honor is solemnly conferred upon
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 underline decoration-amber-400/70 underline-offset-8">
                {certificate.writerName}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                @{certificate.writerUsername}
              </p>
            </div>

            {/* Citation */}
            <div className="max-w-md mx-auto pt-2">
              <p className="font-serif text-sm leading-relaxed text-slate-700">
                In recognition of winning <span className="font-bold text-amber-900">1st Position</span> in the quarterly literary challenge for the masterpiece
                {storyTitle ? <span className="font-bold text-slate-950 italic block pt-1 text-base">"{storyTitle}"</span> : ''}.
                Certified by the AI Editorial Integrity Board and ratified by Executive Founder Decree.
              </p>
            </div>

            {/* Grand Prize Perks Strip */}
            <div className="pt-4 pb-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-amber-900">
              <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300">
                👑 Permanent Champion Crown
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300">
                ✓ 1 Month Free Verification
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300">
                🌟 Home Page Hero 1-Week
              </span>
            </div>

            {/* Signature & Seal Strip */}
            <div className="pt-6 border-t border-amber-300/50 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                  Date of Conferral
                </span>
                <span className="text-xs font-mono font-medium text-slate-800">
                  {new Date(certificate.issuedDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Ref: {certificate.verificationCode}
                </span>
              </div>

              {/* Founder Signature in literature font */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-lg sm:text-xl text-slate-950 tracking-wide">
                  <span className="font-light text-slate-800 not-italic">CEO &amp; Founder </span>
                  <span style={{ color: '#0bb39c' }} className="font-bold not-italic">
                    Shreyanshu Mishra
                  </span>
                </div>
                <div className="w-48 h-0.5 bg-slate-300 ml-auto" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                  Executive Seal of LEXORA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
