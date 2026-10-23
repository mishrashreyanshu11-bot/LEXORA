import React, { useState } from 'react';
import { Story } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { X, CheckCircle, ShieldCheck, QrCode, Copy, ArrowRight, Sparkles, Lock, CreditCard } from 'lucide-react';

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
  const { currentUser } = useAuth();

  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const amount = productType === 'monthly_subscription' 
    ? (settings.monthlySubscriptionPrice || 299)
    : (settings.storyUnlockPrice || 19);

  const destinationUpi = settings.paymentDestinationUpi || '7852931077@fam';
  const upiLink = `upi://pay?pa=${destinationUpi}&pn=Vellum%20Platform&am=${amount}&cu=INR&tn=${encodeURIComponent(
    productType === 'monthly_subscription' ? 'Vellum Premium Monthly' : `Vellum Story: ${story?.title || 'Unlock'}`
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
      setError('Please enter the 12-digit UPI transaction reference or UTR number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const record = await submitPayment({
        productType,
        storyId: story?.id,
        storyTitle: story?.title,
        amount,
        transactionRef: transactionRef.trim(),
      });

      setPaymentSuccess(record);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Payment submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#26F7F7]/20 border border-[#26F7F7]/40 text-[#26F7F7] text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              {productType === 'monthly_subscription' ? 'Vellum Premium Access' : 'Permanent Story Unlock'}
            </div>
            <h3 className="text-xl font-bold font-sans-modern tracking-tight">
              {productType === 'monthly_subscription'
                ? `Vellum Premium — ₹${amount}/month`
                : `Unlock "${story?.title}" — ₹${amount}`}
            </h3>
            <p className="text-xs text-slate-300">
              Direct verification via UPI ID: <span className="font-mono text-[#26F7F7] font-semibold">{destinationUpi}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {paymentSuccess ? (
            /* Success Receipt View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 border-2 border-[#26F7F7] flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-teal-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Payment Verified & Access Granted!</h4>
                <p className="text-slate-600 text-xs">
                  {productType === 'monthly_subscription'
                    ? 'You now have unlimited reading access to all premium serialized stories on Vellum.'
                    : `You have permanently unlocked all current and future chapters of "${story?.title}".`}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-bold text-slate-900">{paymentSuccess.transactionRef}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-teal-600">₹{amount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Recipient UPI:</span>
                  <span className="text-slate-900">{destinationUpi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-700">{new Date(paymentSuccess.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Start Reading Now
              </button>
            </div>
          ) : (
            /* Purchase Details & Payment Form */
            <>
              {/* Product Info Card */}
              {productType === 'story_unlock' && story && (
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 items-center">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-16 h-22 object-cover rounded-xl shadow-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                      {story.genre}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base leading-tight">{story.title}</h4>
                    <p className="text-xs text-slate-500">By {story.authorName} • {story.partsCount} Parts</p>
                    <p className="text-[11px] text-slate-600">
                      ★ <span className="font-semibold text-slate-900">{story.ratingAverage}</span> ({story.ratingCount} ratings)
                    </p>
                  </div>
                </div>
              )}

              {/* What this unlocks */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-[#26F7F7]/50 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-teal-950 text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>What your ₹{amount} payment unlocks:</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {productType === 'monthly_subscription' ? (
                    <>
                      <li>Full, unlimited access to <strong>all Premium Stories</strong> on Vellum.</li>
                      <li>No need to pay ₹19 per individual story.</li>
                      <li>Verified insider access and community discussion circle privileges.</li>
                      <li>Ability to submit constructive editorial suggestions to writers.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Instant access to all parts</strong> of "{story?.title}".</li>
                      <li><strong>All future chapters</strong> published for this story remain 100% free for you.</li>
                      <li>One-time payment of ₹19 — no recurring charge for this story.</li>
                      <li>Ad-free, distraction-free reading experience.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Step 1: Scan / UPI Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 1: Transfer ₹{amount} via UPI</h4>
                  <span className="text-xs font-mono font-bold text-teal-700">₹{amount}.00</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Payment Destination (UPI ID)</p>
                      <p className="text-base font-mono font-bold text-[#26F7F7]">{destinationUpi}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Copied!' : 'Copy UPI'}
                    </button>
                  </div>

                  {/* QR preview & App link */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={upiLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#26F7F7] text-slate-950 font-bold text-xs hover:bg-[#00d4d4] transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Open UPI App (GPay / PhonePe / Paytm / Fam)
                    </a>
                    <span className="text-[11px] text-slate-400">Merchant: Vellum</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Verification Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Step 2: Enter UPI Ref / UTR Number
                    </label>
                    <button
                      type="button"
                      onClick={handleFillDemoRef}
                      className="text-[11px] text-teal-600 hover:text-teal-700 underline font-medium cursor-pointer"
                    >
                      Fill Demo Ref
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 992148102941 or UPI-REF-..."
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7] focus:border-teal-500 font-mono text-sm bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500">
                    Enter the 12-digit transaction ID or reference number shown in your UPI app receipt.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    'Verifying Reference...'
                  ) : (
                    <>
                      <span>Submit & Unlock Access</span>
                      <ArrowRight className="w-4 h-4 text-[#26F7F7]" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
