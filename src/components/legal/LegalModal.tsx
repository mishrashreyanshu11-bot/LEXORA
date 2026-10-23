import React, { useState } from 'react';
import { X, Shield, FileText, Scale, Lock, AlertCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'guidelines' | 'copyright' | 'privacy' | 'refunds';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-lg font-sans-modern">Legal &amp; User Safety Center</h3>
            <p className="text-xs text-slate-400">Platform standards, compliance, and policies for Vellum.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-200 overflow-x-auto text-xs font-semibold pb-3 bg-slate-50 scrollbar-none">
          {[
            { id: 'terms', label: 'Terms of Service' },
            { id: 'guidelines', label: 'Community Guidelines' },
            { id: 'copyright', label: 'Copyright & Originality' },
            { id: 'privacy', label: 'Privacy & DOB Policy' },
            { id: 'refunds', label: 'Payments & Refunds' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h4>
              <p>
                By accessing or registering with Vellum, you agree to abide by all platform rules and terms. Vellum is dedicated to high-standard serialized reading and ethical independent publishing.
              </p>
              <h4 className="text-sm font-bold text-slate-900">2. Free-to-Premium Story Model</h4>
              <p>
                Every story begins 100% free. Stories only become eligible for the ₹19 Premium Story tier upon crossing BOTH conditions: average reader rating strictly greater than 4.8/5 and at least 400 genuine reader ratings. For premium eligible stories, stories under 40 parts offer 75% free, and stories with 40 or more parts offer at least 20 parts free before the ₹19 paywall is triggered. Unlocking a story grants permanent access to all existing and future parts.
              </p>
              <h4 className="text-sm font-bold text-slate-900">3. Vellum Premium Subscription</h4>
              <p>
                The ₹299/month Vellum Premium subscription grants unlimited reading access across all premium stories while active, overriding individual story purchases.
              </p>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Community &amp; Critique Standards</h4>
              <p>
                Vellum champions constructive, thoughtful dialogue. Through our "Suggest an Edit" feature and Community Circles, critique must remain respectful, specific, and focused on craft (plot, pacing, character development, and grammar).
              </p>
              <p>
                Hate speech, spam, harassment, and targeted defamation are strictly prohibited and will lead to account suspension or removal.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Intellectual Property &amp; Originality</h4>
              <p>
                Writers retain 100% ownership of their literary works published on Vellum. You represent and warrant that your submissions are original works and do not infringe on third-party copyrights.
              </p>
              <p>
                Our automated AI Content Assessment flags potential duplicate phrasing, high-risk text, and plagiarism signals for review by Founder and platform moderators.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Privacy &amp; Mandatory Date of Birth (DOB)</h4>
              <p>
                Date of Birth (DOB) is mandatory during registration solely to ensure child safety, compliance with digital age-consent laws, and appropriate content distribution. Full birth dates are strictly private and never displayed publicly.
              </p>
              <p>
                We do not use sensitive personal data for automated ad targeting or sell user information to data brokers.
              </p>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Payment &amp; Refund Policy</h4>
              <p>
                Payments are processed via authorized UPI merchant channels (designated ID: <strong className="font-mono text-teal-700">7852931077@fam</strong>). Story unlocks (₹19) provide immediate permanent digital access and are generally non-refundable once content has been accessed.
              </p>
              <p>
                Monthly subscriptions (₹299/month) may be cancelled at any time through Account Settings to avoid automatic renewal. If a payment dispute or transaction reference discrepancy arises, contact <strong className="font-mono text-teal-700">mishrashreyanshu11@gmail.com</strong> for Founder review.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
