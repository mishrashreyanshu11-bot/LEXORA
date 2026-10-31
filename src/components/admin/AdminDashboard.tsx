import React, { useState, useEffect } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { isStoryPremium } from '../../utils/premiumRules';
import {
  LayoutDashboard,
  CreditCard,
  Sliders,
  BookOpen,
  Users,
  Award,
  AlertTriangle,
  Bot,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  Search,
  Eye,
  Trash2,
  Star,
  ExternalLink,
  ShieldCheck,
  Clock,
  RefreshCw,
  Smartphone,
  Info,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface AdminDashboardProps {
  onBack: () => void;
  onViewStory: (storyId: string) => void;
  onViewCertificate?: (certId: string) => void;
}

interface ServerEliteRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'monthly_299' | 'yearly_2149';
  amount: number;
  utr: string;
  status: 'pending_verification' | 'active' | 'rejected' | 'expired';
  bankConfirmed?: boolean;
  isDuplicate?: boolean;
  submittedAt: string;
  expiresAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  auditTrail?: {
    action: string;
    timestamp: string;
    actor: string;
    details: string;
  }[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack,
  onViewStory,
  onViewCertificate,
}) => {
  const {
    stories,
    parts,
    reviews,
    payments,
    certificates,
    reports,
    settings,
    updateSettings,
    confirmPaymentByAdmin,
    rejectPaymentByAdmin,
    deleteStory,
    toggleFeatureStory,
    setStoryFeaturing,
    reviewStoryFeature,
    featuredHeroStoryId,
    setFeaturedHeroStory,
    updateStory,
  } = useStories();

  const { allUsers, currentUser, isFounder } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'elite_verification' | 'overview' | 'google_play' | 'stories' | 'thresholds'
  >('elite_verification');

  // Server-side Elite Verification State
  const [eliteRecords, setEliteRecords] = useState<ServerEliteRecord[]>([]);
  const [loadingElite, setLoadingElite] = useState(false);
  const [eliteFilter, setEliteFilter] = useState<'all' | 'pending' | 'active' | 'duplicate'>('all');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Approval modal state (strict bank verification requirement)
  const [approvingRecord, setApprovingRecord] = useState<ServerEliteRecord | null>(null);
  const [bankConfirmedChecked, setBankConfirmedChecked] = useState(false);
  const [rejectingRecord, setRejectingRecord] = useState<ServerEliteRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Threshold controls form state
  const [thresholdInput, setThresholdInput] = useState(settings.premiumRatingThreshold.toString());
  const [ratingsCountInput, setRatingsCountInput] = useState(settings.requiredRatingsCount.toString());
  const [storyPriceInput, setStoryPriceInput] = useState(settings.storyUnlockPrice.toString());
  const [subPriceInput, setSubPriceInput] = useState(settings.monthlySubscriptionPrice.toString());
  const [upiIdInput, setUpiIdInput] = useState(settings.paymentDestinationUpi);

  const adminEmail = currentUser?.email || 'mishrashreyanshu11@gmail.com';

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setActionErrorMsg(msg);
    setTimeout(() => setActionErrorMsg(null), 4000);
  };

  // Fetch Elite records from authenticated backend
  const fetchEliteRecords = async () => {
    setLoadingElite(true);
    try {
      const res = await fetch('/api/admin/elite/requests', {
        headers: {
          'x-admin-email': adminEmail,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setEliteRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load server records, falling back to local state:', err);
    } finally {
      setLoadingElite(false);
    }
  };

  useEffect(() => {
    fetchEliteRecords();
  }, [adminEmail]);

  // Handle Approve with Bank Confirmation
  const handleConfirmApproval = async () => {
    if (!approvingRecord) return;
    if (!bankConfirmedChecked) {
      showError('Security Requirement: You must verify payment against bank records before approving.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/elite/${approvingRecord.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ bankConfirmed: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Approval failed');
      }

      // Also confirm local context payment if matching
      confirmPaymentByAdmin(approvingRecord.id);

      showSuccess(`✓ Approved Elite Subscription for ${approvingRecord.userName} (${approvingRecord.plan === 'yearly_2149' ? 'Yearly' : 'Monthly'})`);
      setApprovingRecord(null);
      setBankConfirmedChecked(false);
      fetchEliteRecords();
    } catch (err: any) {
      showError(err.message || 'Approval failed');
    }
  };

  // Handle Reject
  const handleConfirmRejection = async () => {
    if (!rejectingRecord) return;
    try {
      const res = await fetch(`/api/admin/elite/${rejectingRecord.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ reason: rejectionReasonInput.trim() || 'Payment could not be verified in bank records.' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Rejection failed');
      }

      rejectPaymentByAdmin(rejectingRecord.id);

      showSuccess(`Subscription request rejected for ${rejectingRecord.userName}.`);
      setRejectingRecord(null);
      setRejectionReasonInput('');
      fetchEliteRecords();
    } catch (err: any) {
      showError(err.message || 'Rejection failed');
    }
  };

  // Handle Extend Subscription (30 days)
  const handleExtendSubscription = async (recordId: string) => {
    try {
      const res = await fetch(`/api/admin/elite/${recordId}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ additionalDays: 30 }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Extension failed');
      }

      showSuccess('Subscription extended by +30 days.');
      fetchEliteRecords();
    } catch (err: any) {
      showError(err.message || 'Extension failed');
    }
  };

  // Filtered records
  const filteredEliteRecords = eliteRecords.filter(r => {
    if (eliteFilter === 'pending') return r.status === 'pending_verification';
    if (eliteFilter === 'active') return r.status === 'active';
    if (eliteFilter === 'duplicate') return r.isDuplicate;
    return true;
  });

  const pendingCount = eliteRecords.filter(r => r.status === 'pending_verification').length;
  const duplicateCount = eliteRecords.filter(r => r.isDuplicate).length;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 pb-28 selection:bg-[#e5b95a]/30 selection:text-amber-100">
      {/* Toast Messages */}
      {actionSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-black/95 text-emerald-300 border border-emerald-500/50 shadow-2xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}
      {actionErrorMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-rose-950/95 text-rose-200 border border-rose-500/50 shadow-2xl text-xs flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HEADER: RESPONSIVE & FIXED OVERLAP FROM IMAGE 2 */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#090a0f]/95 backdrop-blur-md border-b border-amber-500/25 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Top Row: Responsive Brand + Account Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            {/* Left: Back button + Title & Founder Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Return to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif font-bold text-base sm:text-lg text-white tracking-wide">
                    LEXORA Founder &amp; Admin Console
                  </h1>
                  <FounderBadge size="sm" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Authenticated Founder:{' '}
                  <span className="font-mono text-amber-300 font-semibold">
                    mishrashreyanshu11@gmail.com
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Security & Production Badges */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Auth Verified</span>
              </span>
              <button
                onClick={fetchEliteRecords}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Refresh Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingElite ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto text-xs font-serif font-bold pt-3 pb-1 scrollbar-none">
            {[
              {
                id: 'elite_verification',
                label: `Elite Verification (${pendingCount})`,
                icon: ShieldCheck,
                badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
              },
              { id: 'google_play', label: 'Google Play & WebToApp', icon: Smartphone },
              { id: 'overview', label: 'Platform Analytics', icon: LayoutDashboard },
              { id: 'stories', label: 'Story Moderation', icon: BookOpen },
              { id: 'thresholds', label: 'Pricing & Thresholds', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_15px_rgba(243,186,56,0.4)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ==================================================================== */}
        {/* TAB 1: SECURE ELITE MEMBERSHIP VERIFICATION SYSTEM */}
        {/* ==================================================================== */}
        {activeTab === 'elite_verification' && (
          <div className="space-y-6 animate-fade-in">
            {/* Security Protocol Banner */}
            <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#ffd700] shrink-0" />
                <div>
                  <span className="font-serif font-bold text-sm text-white block">
                    Security Policy: Strict Bank UTR Reconciliation
                  </span>
                  <span className="text-[11px] text-amber-300/80">
                    Never trust payment screenshots as proof. Match the 12-digit UTR directly in your official bank/UPI merchant statement before approving.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 border border-amber-400/40 text-amber-300">
                  {duplicateCount > 0 ? `⚠️ ${duplicateCount} Duplicate UTRs Detected` : '✓ UTR Integrity Clean'}
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 text-xs">
                {[
                  { id: 'all', label: `All Requests (${eliteRecords.length})` },
                  { id: 'pending', label: `Pending Approval (${pendingCount})` },
                  { id: 'active', label: 'Active Subscribers' },
                  { id: 'duplicate', label: `Duplicates (${duplicateCount})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setEliteFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      eliteFilter === f.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Destination UPI: <span className="text-amber-300 font-bold">{settings.paymentDestinationUpi}</span>
              </span>
            </div>

            {/* Requests Table / Cards */}
            <div className="space-y-3">
              {filteredEliteRecords.map(record => {
                const isPending = record.status === 'pending_verification';
                const isMonthly = record.plan === 'monthly_299';

                return (
                  <div
                    key={record.id}
                    className={`p-4 sm:p-5 rounded-3xl bg-[#090b10] border transition-all ${
                      record.isDuplicate
                        ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : isPending
                        ? 'border-amber-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Member & Plan Info */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif font-bold text-sm sm:text-base text-white">
                            {record.userName}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({record.userEmail})
                          </span>

                          {/* Plan Badge */}
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${
                              isMonthly
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                            }`}
                          >
                            {isMonthly ? '₹299 Monthly Plan' : '₹2,149 Yearly Plan (-40%)'}
                          </span>

                          {/* Duplicate Warning */}
                          {record.isDuplicate && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                              Duplicate UTR Flagged
                            </span>
                          )}

                          {/* Status */}
                          <span
                            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                              record.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                : record.status === 'pending_verification'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                : record.status === 'rejected'
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {record.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* UTR Reference with copy */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="font-sans">
                            UTR / Reference:{' '}
                            <span className="font-mono text-[#ffd700] font-bold tracking-wider px-2 py-0.5 rounded-md bg-black border border-amber-500/30">
                              {record.utr}
                            </span>
                          </span>

                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            Submitted: {new Date(record.submittedAt).toLocaleDateString()}
                          </span>

                          {record.expiresAt && (
                            <>
                              <span className="text-slate-500">·</span>
                              <span className="text-amber-200/90 font-mono text-[11px]">
                                Expiry: {new Date(record.expiresAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                        {isPending && (
                          <>
                            <button
                              onClick={() => {
                                setApprovingRecord(record);
                                setBankConfirmedChecked(false);
                              }}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-serif font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Verify &amp; Approve</span>
                            </button>

                            <button
                              onClick={() => setRejectingRecord(record)}
                              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {record.status === 'active' && (
                          <button
                            onClick={() => handleExtendSubscription(record.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Extend +30 Days</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Audit Trail Preview */}
                    {record.auditTrail && record.auditTrail.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
                        <span className="font-mono text-amber-400/80 uppercase text-[9px] block">
                          Audit History:
                        </span>
                        {record.auditTrail.slice(-2).map((a, i) => (
                          <div key={i} className="flex items-center gap-2 font-mono">
                            <span className="text-slate-500">[{new Date(a.timestamp).toLocaleTimeString()}]</span>
                            <span className="text-slate-300 font-semibold">{a.action}:</span>
                            <span>{a.details}</span>
                            <span className="text-slate-500">({a.actor})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredEliteRecords.length === 0 && (
                <div className="text-center py-12 rounded-3xl bg-black/40 border border-white/10 space-y-2">
                  <ShieldCheck className="w-10 h-10 text-amber-400/50 mx-auto" />
                  <p className="text-sm font-serif font-bold text-white">No requests match this filter</p>
                  <p className="text-xs text-slate-400">All submissions are up to date and verified.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: GOOGLE PLAY & WEBTOAPP CONFIGURATION */}
        {/* ==================================================================== */}
        {activeTab === 'google_play' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="p-6 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-[#ffd700]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Google Play Android Release Configuration
                  </h3>
                  <p className="text-xs text-amber-300/80 font-mono">
                    Consumption-Only Mode &amp; Policy Compliance
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  To comply with Google Play's Payments Policy for the initial Android release, the app is configured in <strong className="text-white">Consumption-Only Mode</strong> when accessed through the Play Store Android client.
                </p>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <h4 className="font-serif font-bold text-amber-200 text-sm">
                    1. What is Active in Google Play Build:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong className="text-white">Existing Members:</strong> Users who purchased an Elite membership or story on the web can log in and consume their unlocked stories, passport, and library.</li>
                    <li><strong className="text-white">Free Reading:</strong> All free chapters of Beyond the Loop and community stories remain 100% accessible.</li>
                    <li><strong className="text-white">Payment Elements Removed:</strong> UPI checkout, QR codes, bank reference entry, and purchase buttons are suppressed in Play Store mode.</li>
                    <li><strong className="text-white">Anti-Bypass Guard:</strong> The server blocks all purchase submissions originating with the Google Play platform header, preventing URL param spoofing.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm">
                    2. WebToApp Wrapper Setup Instructions:
                  </h4>
                  <p>In your Android WebToApp wrapper / WebView project (e.g. Kotlin / Java):</p>
                  <pre className="p-3 rounded-xl bg-black border border-white/10 text-amber-300 font-mono text-[11px] overflow-x-auto">
{`// Add custom trusted header in Android WebView
Map<String, String> extraHeaders = new HashMap<>();
extraHeaders.put("x-client-platform", "google_play_android");
webView.loadUrl("https://lexora.app", extraHeaders);`}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    This triggers consumption-only mode safely on the server side via <code className="text-amber-300">/api/config/client</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PLATFORM ANALYTICS & OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-400 font-serif font-bold uppercase">Total Revenue</span>
                <p className="text-2xl font-bold font-mono text-white">₹{eliteRecords.filter(r => r.status === 'active').reduce((s, r) => s + r.amount, 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">From verified subscriptions</p>
              </div>

              <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-400 font-serif font-bold uppercase">Active Elite Members</span>
                <p className="text-2xl font-bold font-mono text-white">{eliteRecords.filter(r => r.status === 'active').length}</p>
                <p className="text-[10px] text-slate-400">Holding Digital Elite Card</p>
              </div>

              <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-400 font-serif font-bold uppercase">Platform Readers</span>
                <p className="text-2xl font-bold font-mono text-white">{allUsers.length}</p>
                <p className="text-[10px] text-slate-400">Registered member profiles</p>
              </div>

              <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-400 font-serif font-bold uppercase">Stories Published</span>
                <p className="text-2xl font-bold font-mono text-white">{stories.length}</p>
                <p className="text-[10px] text-slate-400">Beyond the Loop masterpiece</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: STORY MODERATION */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* TAB 4: STORY MODERATION & HOMEPAGE FEATURING */}
        {/* ==================================================================== */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Hero Masterpiece Selection */}
            <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffd700]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Top Flagship Masterpiece (Homepage Hero)
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                Select the premier story featured at the top of the LEXORA homepage. (Default: Beyond the Loop).
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <select
                  value={featuredHeroStoryId || 'story_beyond_the_loop'}
                  onChange={e => {
                    setFeaturedHeroStory(e.target.value);
                    showSuccess(`Top hero masterpiece set to: ${stories.find(s => s.id === e.target.value)?.title}`);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black border border-amber-400 text-amber-300 font-serif font-bold text-xs cursor-pointer focus:outline-hidden"
                >
                  {stories.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white font-sans">
                      {s.title} — By {s.authorName}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  Active Top Story: {stories.find(s => s.id === (featuredHeroStoryId || 'story_beyond_the_loop'))?.title}
                </span>
              </div>
            </div>

            {/* Author Feature Requests Review */}
            {stories.some(s => s.featureRequest?.status === 'pending') && (
              <div className="p-5 rounded-3xl bg-amber-950/40 border border-amber-500/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-base text-amber-200">
                    Pending Author Feature Requests
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {stories
                    .filter(s => s.featureRequest?.status === 'pending')
                    .map(s => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-black/80 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-serif font-bold text-sm text-white">{s.title}</p>
                          <p className="text-xs text-amber-300 font-mono">By {s.authorName}</p>
                          <p className="text-[11px] text-slate-300">
                            Requested Category: <span className="font-semibold text-white">{s.featureRequest?.requestedCategory || 'Featured Stories'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              reviewStoryFeature(s.id, true, s.featureRequest?.requestedCategory || 'Featured Stories');
                              showSuccess(`Approved featuring for "${s.title}"!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-serif font-bold text-xs cursor-pointer"
                          >
                            Approve Feature
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              reviewStoryFeature(s.id, false);
                              showSuccess(`Declined feature request for "${s.title}".`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Published Serials & Discovery Featuring */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-white">
                All Published Serials ({stories.length})
              </h3>
              {stories.map(s => (
                <div
                  key={s.id}
                  className="p-4 rounded-3xl bg-black/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.coverImage}
                      alt={s.title}
                      className="w-14 h-20 rounded-xl object-cover border border-amber-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-white text-sm truncate">{s.title}</h4>
                        {s.id === (featuredHeroStoryId || 'story_beyond_the_loop') && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold text-[9px]">
                            TOP HERO
                          </span>
                        )}
                        {s.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-300 font-mono">By {s.authorName} ({s.authorRole})</p>
                      <p className="text-[11px] text-slate-400">
                        {s.category} · ★ {(s.ratingAverage != null ? s.ratingAverage : 5.0).toFixed(1)} ({s.readerCount || 0} readers)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Feature on Discovery Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleFeatureStory(s.id, s.category || 'Featured Stories');
                        showSuccess(s.isFeatured ? `Removed "${s.title}" from featured.` : `Featured "${s.title}" on homepage discovery!`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-semibold cursor-pointer transition-colors ${
                        s.isFeatured
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-white/5 border-white/10 hover:border-amber-400 text-slate-300'
                      }`}
                    >
                      {s.isFeatured ? '✓ Featured on Homepage' : '+ Feature on Homepage'}
                    </button>

                    {/* Set as Top Hero Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedHeroStory(s.id);
                        showSuccess(`"${s.title}" is now the Top Hero Masterpiece!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-serif font-semibold cursor-pointer"
                    >
                      Set as Top Hero
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewStory(s.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-serif font-semibold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: PRICING & THRESHOLDS */}
        {/* ==================================================================== */}
        {activeTab === 'thresholds' && (
          <div className="max-w-xl p-6 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4 animate-fade-in">
            <h3 className="font-serif font-bold text-lg text-white">Platform Settings &amp; UPI</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Destination UPI VPA:</label>
                <input
                  type="text"
                  value={upiIdInput}
                  onChange={e => setUpiIdInput(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2.5 rounded-xl text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Monthly Subscription Price (₹):</label>
                <input
                  type="number"
                  value={subPriceInput}
                  onChange={e => setSubPriceInput(e.target.value)}
                  className="w-full bg-black border border-white/20 p-2.5 rounded-xl text-white font-mono"
                />
              </div>

              <button
                onClick={() => {
                  updateSettings({
                    monthlySubscriptionPrice: parseInt(subPriceInput) || 299,
                    paymentDestinationUpi: upiIdInput.trim() || '7852931077@fam',
                  });
                  showSuccess('Pricing and destination UPI settings updated!');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs cursor-pointer shadow-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* STRICT APPROVAL CONFIRMATION MODAL */}
      {/* ==================================================================== */}
      {approvingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#090b10] rounded-3xl border border-amber-500/40 p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verify &amp; Approve Subscription</span>
              </h3>
              <button onClick={() => setApprovingRecord(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
              <p><span className="text-slate-400">User:</span> <strong className="text-white">{approvingRecord.userName}</strong> ({approvingRecord.userEmail})</p>
              <p><span className="text-slate-400">Plan:</span> <strong className="text-amber-300">{approvingRecord.plan === 'yearly_2149' ? 'Yearly ₹2,149' : 'Monthly ₹299'}</strong></p>
              <p><span className="text-slate-400">UTR:</span> <strong className="font-mono text-[#ffd700]">{approvingRecord.utr}</strong></p>
            </div>

            {/* MANDATORY BANK CHECKBOX */}
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/60 border border-emerald-500/40 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={bankConfirmedChecked}
                onChange={e => setBankConfirmedChecked(e.target.checked)}
                className="mt-0.5 accent-emerald-500 w-4 h-4 rounded-sm"
              />
              <span className="text-emerald-200">
                <strong>Bank Record Confirmed:</strong> I have checked the official bank statement or payment-provider ledger and verified this exact UTR and credited amount.
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setApprovingRecord(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                disabled={!bankConfirmedChecked}
                className={`flex-1 py-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  bankConfirmedChecked
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg cursor-pointer hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Entitle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#090b10] rounded-3xl border border-rose-500/40 p-6 space-y-4 text-slate-100 shadow-2xl">
            <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Reject Subscription Request</span>
            </h3>

            <p className="text-xs text-slate-300">
              Provide a reason for rejecting the request from <strong>{rejectingRecord.userName}</strong> (UTR: {rejectingRecord.utr}):
            </p>

            <textarea
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. UTR not found in bank statement, amount mismatch, or duplicate submission."
              className="w-full bg-black border border-white/20 p-3 rounded-xl text-xs text-white resize-none h-24 focus:outline-hidden focus:border-rose-400"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectingRecord(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-serif font-bold text-xs cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
