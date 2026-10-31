import React, { useState, useEffect } from 'react';
import { Story, ElitePlanType } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LexoraEliteCard } from '../card/LexoraEliteCard';
import { LexoraSymbol } from '../common/LexoraSymbol';
import {
  X,
  CheckCircle,
  ShieldCheck,
  Copy,
  ArrowRight,
  Sparkles,
  Lock,
  CreditCard,
  Crown,
  Check,
  Smartphone,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: 'story_unlock' | 'monthly_subscription';
  story?: Story;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  productType,
  story,
  onSuccess,
}) => {
  const { settings, submitPayment } = useStories();
  const { currentUser, togglePremiumSubscription } = useAuth();
  const { isDark } = useTheme();

  // Selected Elite Plan: Monthly (₹299) vs Yearly (₹2,149)
  const [selectedPlan, setSelectedPlan] = useState<ElitePlanType>('monthly_299');
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Google Play Consumption-Only State
  const [isGooglePlay, setIsGooglePlay] = useState(false);

  useEffect(() => {
    // Check client platform config from server
    fetch('/api/config/client')
      .then(res => res.json())
      .then(data => {
        if (data.isGooglePlay) {
          setIsGooglePlay(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const isElite = productType === 'monthly_subscription';
  const amount = isElite
    ? selectedPlan === 'yearly_2149'
      ? 2149
      : (settings.monthlySubscriptionPrice || 299)
    : (settings.storyUnlockPrice || 19);

  const destinationUpi = settings.paymentDestinationUpi || '7852931077@fam';
  const upiLink = `upi://pay?pa=${destinationUpi}&pn=LEXORA%20Beyond%20The%20Loop&am=${amount}&cu=INR&tn=${encodeURIComponent(
    isElite
      ? `LEXORA Elite Pass (${selectedPlan === 'yearly_2149' ? 'Yearly ₹2149' : 'Monthly ₹299'})`
      : `LEXORA Story Unlock: ${story?.title || 'Story'}`
  )}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(destinationUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFillDemoRef = () => {
    const randomUtr = `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setTransactionRef(randomUtr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setError('Please enter the 12-digit UPI transaction reference / UTR number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Submit through backend verification system
      const res = await fetch('/api/elite/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'usr_guest',
          userName: currentUser?.name || 'Reader',
          userEmail: currentUser?.email || 'reader@lexora.app',
          plan: selectedPlan,
          utr: transactionRef.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Payment submission failed.');
      }

      // 2. Local context record
      const record = await submitPayment({
        productType,
        storyId: story?.id,
        storyTitle: story?.title,
        amount,
        transactionRef: transactionRef.trim(),
      });

      // Entitle member
      if (isElite) {
        togglePremiumSubscription(true);
      }

      setPaymentSuccess(record);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Payment submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md animate-fade-in overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-[#182B32]/40'
    }`}>
      <div className={`relative w-full max-w-xl rounded-3xl overflow-hidden border max-h-[92vh] flex flex-col my-auto transition-colors ${
        isDark
          ? 'bg-[#090a0f] border-amber-500/35 text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(243,186,56,0.3)]'
          : 'bg-white border-[#D9F5F5] text-[#182B32] shadow-[0_25px_70px_rgba(24,43,50,0.15),0_0_35px_rgba(38,247,247,0.2)]'
      }`}>
        {/* Header */}
        <div className={`relative p-5 sm:p-6 border-b flex items-start justify-between ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/60 via-[#101217] to-black border-amber-500/25'
            : 'bg-gradient-to-r from-[#F7FFFF] via-white to-[#F7FFFF] border-[#D9F5F5]'
        }`}>
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${
              isDark
                ? 'bg-amber-500/15 border border-amber-500/40 text-[#ffd700]'
                : 'bg-[#26F7F7]/15 border border-[#26F7F7]/40 text-[#182B32]'
            }`}>
              <Crown className="w-3.5 h-3.5" />
              <span>{isElite ? 'Digital Lexora Elite Card' : 'Story Unlock'}</span>
            </div>
            <h3 className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#182B32]'
            }`}>
              {isElite
                ? `LEXORA Elite Pass — ₹${amount}${selectedPlan === 'yearly_2149' ? '/year' : '/month'}`
                : `Unlock "${story?.title}" — ₹${amount}`}
            </h3>
            <p className={`text-xs ${isDark ? 'text-amber-200/70' : 'text-[#64748B]'}`}>
              Beyond the Loop · Official Membership Activation
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                : 'hover:bg-[#E9FFFF] text-[#64748B] hover:text-[#182B32]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className={`p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm ${
          isDark ? 'text-slate-300' : 'text-[#182B32]'
        }`}>
          {/* ==================================================================== */}
          {/* GOOGLE PLAY CONSUMPTION-ONLY NOTICE */}
          {/* ==================================================================== */}
          {isGooglePlay ? (
            <div className={`p-5 rounded-2xl border space-y-3 text-center ${
              isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
            }`}>
              <Smartphone className={`w-8 h-8 mx-auto ${isDark ? 'text-[#ffd700]' : 'text-[#182B32]'}`} />
              <h4 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Google Play Store Notice
              </h4>
              <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                This release of LEXORA is consumption-only in compliance with Google Play Store Payments Policy.
                In-app digital purchases and UPI submissions are disabled in this build.
              </p>
              <div className={`p-3 rounded-xl border text-xs text-left space-y-1 font-sans ${
                isDark ? 'bg-black/60 border-white/10 text-amber-200' : 'bg-white border-[#D9F5F5] text-[#182B32]'
              }`}>
                <p>• Existing Elite members: Sign in to access your digital card, passport, and unlimited library.</p>
                <p>• To initiate a new membership, visit our official web portal at <strong>lexora.app</strong>.</p>
              </div>
              <button
                onClick={onClose}
                className={`w-full py-2.5 rounded-full font-serif font-bold text-xs cursor-pointer transition-colors ${
                  isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-[#26F7F7] hover:bg-[#1de9e9] text-[#182B32]'
                }`}
              >
                Close
              </button>
            </div>
          ) : paymentSuccess ? (
            /* ==================================================================== */
            /* SUCCESS CONFIRMATION & CARD DISPLAY */
            /* ==================================================================== */
            <div className="text-center space-y-6 animate-fade-in py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  Payment Submitted Successfully!
                </h4>
                <p className={`text-xs font-mono ${isDark ? 'text-amber-200/90' : 'text-[#64748B]'}`}>
                  Reference: <span className={`font-bold ${isDark ? 'text-[#ffd700]' : 'text-[#182B32]'}`}>{transactionRef}</span>
                </p>
                <p className={`text-xs max-w-md mx-auto pt-1 font-sans ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                  Your Elite credentials have been dispatched to the Founder Verification Board. Your name is now permanently engraved on your Digital Lexora Elite Card!
                </p>
              </div>

              {/* Show the Engraved Card */}
              {isElite && (
                <div className="pt-2">
                  <LexoraEliteCard memberName={currentUser?.name || 'Patron of Letters'} />
                </div>
              )}

              <button
                onClick={onClose}
                className={`w-full py-3.5 rounded-full font-serif font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-400 via-[#f3ba38] to-amber-500 text-slate-950'
                    : 'bg-[#26F7F7] hover:bg-[#1de9e9] text-[#182B32]'
                }`}
              >
                Enter LEXORA Beyond the Loop
              </button>
            </div>
          ) : (
            /* ==================================================================== */
            /* STANDARD CHECKOUT FLOW (WEBSITE) */
            /* ==================================================================== */
            <>
              {/* Plan Switcher for Elite */}
              {isElite && (
                <div className="space-y-2">
                  <label className={`font-serif font-bold text-xs block ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                    Choose Membership Duration:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('monthly_299')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPlan === 'monthly_299'
                          ? isDark
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(243,186,56,0.25)]'
                            : 'bg-[#E9FFFF] border-[#26F7F7] text-[#182B32] shadow-[0_0_15px_rgba(38,247,247,0.25)]'
                          : isDark
                          ? 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                          : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#64748B] hover:text-[#182B32] hover:bg-[#E9FFFF]'
                      }`}
                    >
                      <span className={`font-serif font-bold text-sm block ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>
                        Monthly Plan
                      </span>
                      <span className={`font-mono text-base font-bold block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                        ₹299 / month
                      </span>
                      <span className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        Full Elite Card access
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPlan('yearly_2149')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        selectedPlan === 'yearly_2149'
                          ? isDark
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(243,186,56,0.25)]'
                            : 'bg-[#E9FFFF] border-[#26F7F7] text-[#182B32] shadow-[0_0_15px_rgba(38,247,247,0.25)]'
                          : isDark
                          ? 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                          : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#64748B] hover:text-[#182B32] hover:bg-[#E9FFFF]'
                      }`}
                    >
                      <span className={`absolute -top-2 right-2 px-2 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase ${
                        isDark ? 'bg-gradient-to-r from-amber-400 to-[#f3ba38] text-black' : 'bg-[#26F7F7] text-[#182B32]'
                      }`}>
                        Save 40%
                      </span>
                      <span className={`font-serif font-bold text-sm block ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>
                        Yearly Pass
                      </span>
                      <span className={`font-mono text-base font-bold block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                        ₹2,149 / year
                      </span>
                      <span className={`text-[10px] font-sans ${isDark ? 'text-amber-300' : 'text-[#182B32] font-semibold'}`}>
                        Founder Preferred
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Digital Lexora Elite Card Preview */}
              {isElite && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-serif font-bold ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>
                      Your Engraved Card Preview:
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400/80' : 'text-[#64748B]'}`}>
                      Engraved: {currentUser?.name || 'Your Name Here'}
                    </span>
                  </div>
                  <LexoraEliteCard memberName={currentUser?.name || 'Your Name'} />
                </div>
              )}

              {/* 3 Best Features Callout */}
              {isElite && (
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}>
                    <span className={`font-serif font-bold block text-[11px] ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>1. Passport</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>Category Stamps</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}>
                    <span className={`font-serif font-bold block text-[11px] ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>2. Hall of Fame</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>Golden Library</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}>
                    <span className={`font-serif font-bold block text-[11px] ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>3. Verification</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>Black &amp; Gold Tick</span>
                  </div>
                </div>
              )}

              {/* UPI Payment Box */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-black/70 border-amber-500/35' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-serif font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                    Pay via UPI (GPay, PhonePe, Paytm, BHIM):
                  </span>
                  <span className={`text-base font-mono font-bold ${isDark ? 'text-[#ffd700]' : 'text-[#182B32]'}`}>
                    ₹{amount}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-xl border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#D9F5F5]'
                }`}>
                  <div className="space-y-0.5">
                    <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>Official VPA</span>
                    <p className={`font-mono text-xs sm:text-sm font-bold ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>
                      {destinationUpi}
                    </p>
                  </div>
                  <button
                    onClick={copyUpiId}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                        : 'bg-[#26F7F7]/20 hover:bg-[#26F7F7]/30 text-[#182B32]'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* UTR Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`font-serif font-bold text-xs ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                      Enter 12-Digit Bank UTR / Reference Number:
                    </label>
                    <button
                      type="button"
                      onClick={handleFillDemoRef}
                      className={`text-[10px] font-mono underline cursor-pointer ${
                        isDark ? 'text-amber-400/80 hover:text-amber-300' : 'text-[#182B32]/70 hover:text-[#182B32]'
                      }`}
                    >
                      Fill Demo UTR
                    </button>
                  </div>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    placeholder="e.g. 428192039481"
                    maxLength={24}
                    className={`w-full p-3 rounded-xl font-mono text-sm focus:outline-hidden ${
                      isDark
                        ? 'bg-black border border-amber-500/40 text-amber-200 focus:border-amber-400'
                        : 'bg-white border border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                    }`}
                  />
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    Verified directly against official bank statements by Founder Shreyanshu Mishra.
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_20px_rgba(243,186,56,0.4)] hover:scale-102'
                      : 'bg-[#26F7F7] hover:bg-[#1de9e9] text-[#182B32] shadow-[0_0_20px_rgba(38,247,247,0.3)] hover:scale-102'
                  }`}
                >
                  <Crown className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {submitting ? 'Submitting to Founder Board...' : `Submit Verification for ₹${amount}`}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
