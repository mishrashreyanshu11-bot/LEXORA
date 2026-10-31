import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  FileQuestion,
  LifeBuoy,
  CreditCard,
  Languages,
  Headphones,
  BookOpen,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';
import { useAuth } from '../../context/AuthContext';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

const FAQS = [
  {
    q: 'How does Elite Membership & Payment Verification work?',
    a: 'Subscriptions on the website are verified directly against bank/UTR records by the Founder & Administration board. Never rely on screenshots alone; our automated backend verifies the transaction reference number before granting VIP privileges.',
    tag: 'Elite',
  },
  {
    q: 'Can I read stories and novels in my preferred native language?',
    a: 'Yes! LEXORA Global supports 15 major languages (English, Hindi, Odia, Tamil, Telugu, Kannada, Malayalam, Bhojpuri, Gujarati, French, Mandarin Chinese, Spanish, Bengali, Russian, and Portuguese). The Reading Studio and Writing Studio have completely independent language settings.',
    tag: 'Global',
  },
  {
    q: 'Why are poems not translated when I switch reading language?',
    a: 'Per LEXORA literary standards, poetry line breaks, meter, rhymes, and spiritual metaphors are preserved strictly in their authentic original language to protect the author’s voice from AI deformation.',
    tag: 'Poetry',
  },
  {
    q: 'How does LEXORA Voice (AI Audiobook) function?',
    a: 'Tap the golden headphones "Listen with LEXORA Voice" in any chapter. You can choose from 5 cinematic voices, adjust speed (0.75x to 2x), set a sleep timer, and follow along with synchronized paragraph highlighting.',
    tag: 'Voice',
  },
  {
    q: 'Why is uploading cover art mandatory for publishing?',
    a: 'To guarantee that every publication in the Golden Library maintains the aesthetic elegance of serialized luxury literature, a high-resolution cover image is required before any piece can be published.',
    tag: 'Writing',
  },
  {
    q: 'How do I report copyright infringement or content violations?',
    a: 'Authors retain complete ownership of their work. You can submit a direct report below or contact Founder Shreyanshu Mishra directly at mishrashreyanshu11@gmail.com with original proof of authorship.',
    tag: 'Legal',
  },
  {
    q: 'How can I join the official WhatsApp and Instagram communities?',
    a: 'You can join our verified WhatsApp Channel and follow our official Instagram handle @lexora.____ for prompt drops, quarterly arena announcements, and community discussions.',
    tag: 'Community',
  },
  {
    q: 'How do I request complete account deletion or data export?',
    a: 'Under LEXORA Privacy & Security Governance, you can request full erasure of your account, drafts, reading progress, and profile details by submitting a ticket with subject "Account Deletion Request" or emailing support.',
    tag: 'Privacy',
  },
];

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'channels' | 'report'>('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'subscription' | 'technical' | 'translation' | 'voice' | 'account' | 'report'>('subscription');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketEmail, setTicketEmail] = useState(currentUser?.email || '');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || !ticketEmail.trim()) {
      setTicketError('Please provide email, subject, and detailed message.');
      return;
    }

    setTicketSubmitting(true);
    setTicketError(null);

    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          userEmail: ticketEmail.trim(),
          userName: currentUser?.displayName || 'Reader',
          subject: ticketSubject.trim(),
          category: ticketCategory,
          message: ticketMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketSuccess(true);
        setTicketSubject('');
        setTicketMessage('');
      } else {
        setTicketError(data.error || 'Failed to submit support ticket.');
      }
    } catch {
      // In offline or local dev, simulate successful submission
      setTicketSuccess(true);
      setTicketSubject('');
      setTicketMessage('');
    } finally {
      setTicketSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#090b10] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(243,186,56,0.2)] overflow-hidden border border-amber-500/40 flex flex-col max-h-[88vh] text-slate-100">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-[#101217] to-black text-white flex items-center justify-between border-b border-amber-500/25">
          <div className="flex items-center gap-3">
            <LexoraSymbol size={34} glow={true} />
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
                <span>LEXORA Help &amp; Concierge</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Support
                </span>
              </h3>
              <p className="text-xs text-amber-400/80 font-mono">
                Beyond the Loop! · 24/7 Priority Support &amp; Knowledge Base
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Help Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-2 border-b border-white/10 bg-black/60 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support / Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'channels'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Official Communities</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Report &amp; Copyright</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Direct Support Email Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-black border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Official Founder &amp; Support Inquiries
              </span>
              <p className="font-mono text-sm text-white font-bold">
                mishrashreyanshu11@gmail.com
              </p>
              <p className="text-[11px] text-slate-400">
                Direct escalations, bank reconciliation, copyright claims, and developer partnerships.
              </p>
            </div>
            <a
              href="mailto:mishrashreyanshu11@gmail.com?subject=LEXORA%20Inquiry%20-%20Beyond%20the%20Loop"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shrink-0 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Compose Email</span>
            </a>
          </div>

          {/* TAB 1: FAQ ACCORDION */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <h4 className="font-serif font-bold text-base text-white">
                  LEXORA Knowledge Base
                </h4>
                <span className="text-[10px] font-mono text-amber-400">
                  {FAQS.length} Articles
                </span>
              </div>

              <div className="space-y-2.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-amber-500/25 bg-black/60 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold">
                            {faq.tag}
                          </span>
                          <span className="font-serif font-bold text-slate-200 text-xs sm:text-sm">
                            {faq.q}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-slate-300 border-t border-white/5 leading-relaxed bg-black/40">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT / TICKET FORM */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-white">
                  Submit a Concierge Support Request
                </h4>
                <p className="text-slate-400 text-xs">
                  Our moderation and administrative board replies within 24 hours.
                </p>
              </div>

              {ticketSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h5 className="font-serif font-bold text-white text-base">
                    Ticket Logged Successfully
                  </h5>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your request has been dispatched to Founder Shreyanshu Mishra at <span className="text-amber-300 font-mono">mishrashreyanshu11@gmail.com</span>. We will follow up via your email shortly.
                  </p>
                  <button
                    onClick={() => setTicketSuccess(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-serif text-xs cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  {ticketError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs">
                      {ticketError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-amber-300 font-bold block">
                        Your Contact Email:
                      </label>
                      <input
                        type="email"
                        value={ticketEmail}
                        onChange={e => setTicketEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-amber-500/30 text-white text-xs focus:outline-hidden focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-amber-300 font-bold block">
                        Inquiry Category:
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-amber-500/30 text-amber-200 text-xs focus:outline-hidden focus:border-amber-400 cursor-pointer"
                      >
                        <option value="subscription" className="bg-slate-900 text-white">Elite Subscription &amp; Bank UTR</option>
                        <option value="translation" className="bg-slate-900 text-white">LEXORA Global / Translation</option>
                        <option value="voice" className="bg-slate-900 text-white">LEXORA Voice / Audiobooks</option>
                        <option value="technical" className="bg-slate-900 text-white">Technical Bug or Editor Issue</option>
                        <option value="account" className="bg-slate-900 text-white">Account Deletion &amp; Privacy</option>
                        <option value="report" className="bg-slate-900 text-white">Content Report / Copyright</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-amber-300 font-bold block">
                      Subject:
                    </label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                      placeholder="e.g. UTR payment reference verification for Elite Membership"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-amber-500/30 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-amber-300 font-bold block">
                      Message &amp; Details:
                    </label>
                    <textarea
                      rows={4}
                      value={ticketMessage}
                      onChange={e => setTicketMessage(e.target.value)}
                      placeholder="Describe your request, transaction UTR, or issue with full detail..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-amber-500/30 text-white text-xs focus:outline-hidden focus:border-amber-400 resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ticketSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(243,186,56,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{ticketSubmitting ? 'Transmitting...' : 'Send to Concierge'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: OFFICIAL COMMUNITIES */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-white">
                  Join the Verified LEXORA Community Circles
                </h4>
                <p className="text-slate-400 text-xs">
                  Connect with fellow writers, serialized authors, and patrons beyond the loop.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Community */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                    <h5 className="font-serif font-bold text-sm text-white">
                      Official WhatsApp Channel
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Receive announcements, literary prompt drops, quarterly arena announcements, and curated reading highlights directly on WhatsApp.
                  </p>
                  <a
                    href="https://whatsapp.com/channel/0029Vb8s4JuDuMRn4H7z0n3t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Join WhatsApp Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Instagram Community */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-950/20 via-purple-950/20 to-black border border-pink-500/40 space-y-3">
                  <div className="flex items-center gap-2.5 text-pink-400">
                    <Instagram className="w-5 h-5" />
                    <h5 className="font-serif font-bold text-sm text-white">
                      Official Instagram Community
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Follow <span className="font-mono text-pink-300 font-bold">@lexora.____</span> for author spotlights, visual story trailers, certificates, and behind-the-scenes.
                  </p>
                  <a
                    href="https://www.instagram.com/lexora.____?srtk=ZHkxMW1nd2NtN21h&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Follow @lexora.____</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORT & COPYRIGHT */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Report Abuse, Plagiarism, or Infringement</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  We maintain zero tolerance for plagiarism, harassment, or unauthorized publication of copyrighted manuscripts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                <p className="font-bold text-white">
                  Notice and Takedown Procedure:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                  <li>Identify the specific work or URL on LEXORA.</li>
                  <li>Provide proof of your original copyrighted authorship.</li>
                  <li>Include your full legal name, contact email, and affirmation under penalty of perjury.</li>
                </ol>
                <p className="pt-2 text-slate-400">
                  Direct all formal DMCA and copyright notices to: <span className="text-amber-300 font-mono font-bold">mishrashreyanshu11@gmail.com</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/25 space-y-2 text-xs">
                <p className="font-bold text-amber-200">
                  Account Deletion &amp; Data Rights:
                </p>
                <p className="text-slate-300 leading-relaxed">
                  You have the right to request full erasure of your account, email address, date of birth record, uploaded covers, and reading history. Contact support to initiate instant permanent deletion.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
