import React, { useState } from 'react';
import { X, Shield, FileText, Scale, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guidelines' | 'terms' | 'copyright' | 'privacy' | 'refunds';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'guidelines',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090a0f] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(243,186,56,0.2)] overflow-hidden border border-amber-500/35 flex flex-col max-h-[85vh] text-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-[#101217] to-black text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <LexoraSymbol size={32} glow={false} />
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                LEXORA Policies &amp; Governance
              </h3>
              <p className="text-xs text-amber-400/80 font-mono">
                Beyond the Loop! · Community Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="px-6 pt-3 flex gap-2 border-b border-white/10 overflow-x-auto text-xs font-semibold pb-3 bg-black/60 scrollbar-none">
          {[
            { id: 'guidelines', label: 'Community Guidelines' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'copyright', label: 'Originality & Copyright' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'refunds', label: 'Elite Subscriptions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold shadow-xs'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'guidelines' && (
            <div className="space-y-4">
              <div className="border-b border-amber-500/20 pb-3">
                <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                  LEXORA — Community Guidelines &amp; Policies
                </h4>
                <p className="font-serif italic text-amber-300 text-sm font-semibold pt-0.5">
                  Beyond the Loop!
                </p>
                <p className="text-xs text-slate-300 pt-2 leading-relaxed">
                  Welcome to LEXORA, a premium literary community where creativity, imagination, and expression unite. By accessing our platform, you agree to follow these guidelines to maintain a safe, respectful, and inspiring environment.
                </p>
              </div>

              {/* 1. Respect & Integrity */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  1. Respect &amp; Integrity
                </h5>
                <p className="text-slate-300">
                  Treat every writer and reader with dignity. Harassment, bullying, discrimination, hate speech, threats, and abusive behaviour are strictly prohibited.
                </p>
              </div>

              {/* 2. Originality & Copyright */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  2. Originality &amp; Copyright
                </h5>
                <p className="text-slate-300">
                  Publish original content or work you have permission to share. Plagiarism, copyright infringement, impersonation, and unauthorised reproduction are prohibited. Creators retain ownership of their original work.
                </p>
              </div>

              {/* 3. Content Standards */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  3. Content Standards
                </h5>
                <p className="text-slate-300">
                  Content promoting violence, exploitation, illegal activities, or targeted hatred is prohibited. Literary freedom is encouraged within responsible boundaries.
                </p>
              </div>

              {/* 4. Privacy & Security */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  4. Privacy &amp; Security
                </h5>
                <p className="text-slate-300">
                  Protect personal information. Never share another member’s private details without consent. Accounts must not be used for fraud, spam, or manipulation.
                </p>
              </div>

              {/* 5. Elite Membership */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  5. Elite Membership
                </h5>
                <p className="text-slate-300">
                  Premium features, including the Literary Passport, Premium Badge, and Golden Library, are available according to subscription terms. Payments, renewals, and refunds follow the policies disclosed during purchase.
                </p>
              </div>

              {/* 6. Moderation & Accountability */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  6. Moderation &amp; Accountability
                </h5>
                <p className="text-slate-300">
                  LEXORA reserves the right to review, restrict, or remove content and suspend accounts violating these guidelines.
                </p>
              </div>

              {/* 7. Agreement */}
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                  7. Agreement
                </h5>
                <p className="text-slate-300">
                  Continued platform usage signifies acceptance of these policies and future updates.
                </p>
              </div>

              {/* Signoff */}
              <div className="pt-3 border-t border-amber-500/20 text-center space-y-1">
                <p className="font-serif font-bold text-sm text-[#ffd700]">
                  LEXORA — Beyond the Loop!
                </p>
                <p className="font-serif italic text-xs text-slate-400">
                  Where words find their worth, and creativity finds its home.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Acceptance &amp; Free Reading</h4>
              <p>
                Readers are never forceful to sign in to read; they can freely explore serialized works without an account. However, creating new stories, uploading covers, bookmarking, following authors, and holding the Digital Lexora Elite Card require registered credentials.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Intellectual Property</h4>
              <p>
                Writers retain 100% intellectual property rights over their words. Every story published must include a mandatory cover page and follow originality protocols.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Privacy &amp; Data Security</h4>
              <p>
                We value your literary privacy. Your drafts, reader progress, and credentials are protected with end-to-end industry security.
              </p>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Subscription Verification &amp; Expiry</h4>
              <p>
                Elite subscriptions (₹299 Monthly or ₹2,149 Yearly) are manually verified against bank UTR records before entitlement. Active subscriptions renew according to the plan duration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
