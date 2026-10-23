import React from 'react';
import { WriterCertificate } from '../../types';
import { Award, CheckCircle, ShieldCheck, Download, Share2, X, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  certificate: WriterCertificate;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Vellum Writer Certificate - ${certificate.writerName}`,
        text: `Officially recognized as a Vellum Certified Serialized Author with ${certificate.qualifyingStoriesCount} completed stories and ${certificate.averageRating} average rating.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate verification link copied!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Parchment Document */}
        <div className="p-8 md:p-12 bg-[#fcfbf9] text-slate-900 border-8 border-double border-[#26F7F7]/60 relative selection:bg-[#26F7F7]/20">
          {/* Subtle watermark background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-[120px] font-black font-serif">VELLUM</span>
          </div>

          <div className="relative text-center space-y-6">
            {/* Header / Brand */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26F7F7]/15 border border-[#26F7F7]/60 text-teal-950 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Official Digital Credential</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-slate-950 pt-2">
                Off Script / Vellum Writer Certificate
              </h2>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-sans-modern">
                Excellence in Serialized Literature &amp; Reader Acclaim
              </p>
            </div>

            {/* Presentation Line */}
            <div className="space-y-2 py-4">
              <p className="text-xs text-slate-500 italic font-editorial">This is proudly conferred upon</p>
              <h3 className="text-3xl md:text-4xl font-bold font-sans-modern text-slate-950 border-b-2 border-slate-200 pb-2 inline-block px-8">
                {certificate.writerName}
              </h3>
              <p className="text-xs font-mono text-slate-400">@{certificate.writerUsername}</p>
            </div>

            {/* Criteria Statement */}
            <p className="text-xs md:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed font-editorial">
              Having successfully completed <strong className="text-slate-950">{certificate.qualifyingStoriesCount} serialized works</strong> on
              Vellum while maintaining a stellar community rating average of <strong className="text-teal-700">★ {certificate.averageRating} / 5.0</strong>.
              Conferred with full honors as a Master Storyteller.
            </p>

            {/* Signatures & Seal */}
            <div className="pt-8 grid grid-cols-2 gap-6 items-end border-t border-slate-200/80">
              {/* Founder Signature */}
              <div className="text-left space-y-1">
                <div className="font-serif italic text-lg font-bold text-slate-900 border-b border-slate-400 pb-1 w-44">
                  Shreyanshu Mishra
                </div>
                <p className="text-[11px] font-bold text-slate-800">Shreyanshu Mishra</p>
                <p className="text-[10px] text-teal-700 uppercase tracking-wider font-semibold">
                  Founder, Vellum
                </p>
              </div>

              {/* Seal & Verification */}
              <div className="text-right space-y-1">
                <div className="inline-flex p-3 rounded-full bg-slate-950 text-[#26F7F7] shadow-lg border border-[#26F7F7]">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-700">{certificate.certificateId}</p>
                <p className="text-[10px] text-slate-400 font-mono">Issued: {certificate.issuedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-100 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-500">
            Verification: {certificate.verificationCode}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#26F7F7]" />
              <span>Share Credential</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
