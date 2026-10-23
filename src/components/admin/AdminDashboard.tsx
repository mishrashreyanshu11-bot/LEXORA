import React, { useState } from 'react';
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
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  onViewStory: (storyId: string) => void;
  onViewCertificate?: (certId: string) => void;
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
    confirmAllPendingPayments,
    rejectPaymentByAdmin,
    toggleFeatureStory,
    updateStory,
    deleteStory,
    updateReportStatus,
  } = useStories();

  const { allUsers, toggleUserVerification } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'payments' | 'thresholds' | 'stories' | 'users' | 'certificates' | 'reports' | 'ai'
  >('overview');

  // Threshold controls form state
  const [thresholdInput, setThresholdInput] = useState(settings.premiumRatingThreshold.toString());
  const [ratingsCountInput, setRatingsCountInput] = useState(settings.requiredRatingsCount.toString());
  const [storyPriceInput, setStoryPriceInput] = useState(settings.storyUnlockPrice.toString());
  const [subPriceInput, setSubPriceInput] = useState(settings.monthlySubscriptionPrice.toString());
  const [upiIdInput, setUpiIdInput] = useState(settings.paymentDestinationUpi);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Payments filter
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'story_unlock' | 'monthly_subscription' | 'pending'>('all');

  // Calculate statistics
  const totalUsers = allUsers.length;
  const writersCount = allUsers.filter(u => u.role === 'writer' || u.role === 'founder').length;
  const totalStories = stories.length;
  const totalParts = parts.length;
  const totalReads = stories.reduce((sum, s) => sum + s.readerCount, 0);
  const totalRatingsCount = reviews.length;
  const platformAvgRating = (
    stories.reduce((acc, s) => acc + s.ratingAverage, 0) / Math.max(1, stories.length)
  ).toFixed(2);
  const premiumStoriesCount = stories.filter(s => isStoryPremium(s, settings)).length;
  const activeSubsCount = payments.filter(p => p.productType === 'monthly_subscription' && p.status === 'verified').length;
  const storyUnlocksCount = payments.filter(p => p.productType === 'story_unlock' && p.status === 'verified').length;
  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending_verification').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      premiumRatingThreshold: parseFloat(thresholdInput) || 4.8,
      requiredRatingsCount: parseInt(ratingsCountInput) || 400,
      storyUnlockPrice: parseInt(storyPriceInput) || 19,
      monthlySubscriptionPrice: parseInt(subPriceInput) || 299,
      paymentDestinationUpi: upiIdInput.trim() || '7852931077@fam',
    });
    setSaveSuccessMsg('Platform thresholds and business rules updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const filteredPayments = payments.filter(p => {
    if (paymentFilter === 'story_unlock') return p.productType === 'story_unlock';
    if (paymentFilter === 'monthly_subscription') return p.productType === 'monthly_subscription';
    if (paymentFilter === 'pending') return p.status === 'pending_verification';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base font-sans-modern tracking-tight">
                  Founder & Admin Console
                </h1>
                <FounderBadge size="sm" />
              </div>
              <p className="text-[11px] text-slate-400">
                Official Account: <span className="font-mono text-[#26F7F7]">mishrashreyanshu11@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#26F7F7]/20 text-[#26F7F7] border border-[#26F7F7]/40 font-semibold">
              Live Production State
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto text-xs font-semibold pb-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'payments', label: `Payments & Subscriptions (${pendingPaymentsCount})`, icon: CreditCard },
            { id: 'thresholds', label: 'Premium Threshold Controls', icon: Sliders },
            { id: 'stories', label: 'Story Moderation', icon: BookOpen },
            { id: 'users', label: 'Users & Writers', icon: Users },
            { id: 'certificates', label: 'Writer Certificates', icon: Award },
            { id: 'reports', label: `Reports (${pendingReportsCount})`, icon: AlertTriangle },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#26F7F7] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW & KPIS */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-teal-600">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">From ₹19 unlocks & ₹299 subs</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Stories</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">{premiumStoriesCount} / {totalStories}</p>
                <p className="text-[11px] text-teal-700 font-semibold">Exceeding &gt;{settings.premiumRatingThreshold} &amp; {settings.requiredRatingsCount} reviews</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Subscriptions</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">{activeSubsCount}</p>
                <p className="text-[11px] text-slate-400">₹299/mo Vellum Premium</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Story Unlocks (₹19)</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">{storyUnlocksCount}</p>
                <p className="text-[11px] text-slate-400">Single story permanent access</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Readers &amp; Reads</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">{totalReads.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">{totalUsers} registered accounts</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stories / Parts</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">{totalStories} / {totalParts}</p>
                <p className="text-[11px] text-slate-400">{writersCount} active writers</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Avg Rating</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-amber-500">★ {platformAvgRating}</p>
                <p className="text-[11px] text-slate-400">{totalRatingsCount} verified ratings</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</span>
                <p className="text-2xl md:text-3xl font-extrabold font-mono text-red-600">{pendingPaymentsCount + pendingReportsCount}</p>
                <p className="text-[11px] text-slate-400">{pendingPaymentsCount} payments, {pendingReportsCount} reports</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Premium Eligibility Live Status */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>Stories Meeting Premium Criteria (&gt;{settings.premiumRatingThreshold} &amp; &gt;={settings.requiredRatingsCount} Ratings)</span>
                </h3>
                <div className="space-y-3">
                  {stories.map(s => {
                    const isPrem = isStoryPremium(s, settings);
                    return (
                      <div
                        key={s.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-900 truncate">{s.title}</p>
                          <p className="text-slate-500">
                            ★ {s.ratingAverage} • {s.ratingCount} reviews • {s.partsCount} parts
                          </p>
                        </div>
                        {isPrem ? (
                          <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-300 shrink-0">
                            Premium (₹{settings.storyUnlockPrice})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 font-medium shrink-0">
                            Free Story
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Payment Confirmations Queue */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" />
                    <span>Pending Payment Queue</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    View All ({payments.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {payments.slice(0, 4).map(p => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">
                          {p.productType === 'monthly_subscription' ? '₹299/mo Vellum Premium' : `₹19 Unlock: ${p.storyTitle || 'Story'}`}
                        </p>
                        <p className="font-mono text-slate-500 text-[11px]">
                          Ref: {p.transactionRef} • {p.userEmail}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {p.status === 'verified' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            Verified
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => confirmPaymentByAdmin(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => rejectPaymentByAdmin(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-[11px] hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: SUBSCRIPTION & PAYMENT CONFIRMATION SECTION */}
        {/* ==================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-sans-modern">Subscription &amp; Payment Confirmation</h2>
                <p className="text-xs text-slate-500">
                  Destination UPI: <span className="font-mono font-bold text-teal-700">{settings.paymentDestinationUpi}</span>
                </p>
              </div>

              {/* Filter pills & Batch Confirm */}
              <div className="flex flex-wrap items-center gap-2">
                {pendingPaymentsCount > 0 && (
                  <button
                    onClick={() => confirmAllPendingPayments()}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#26f7db]" />
                    <span>Confirm All Pending ({pendingPaymentsCount})</span>
                  </button>
                )}

                <div className="flex rounded-xl bg-slate-200/60 p-1 gap-1 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All Payments' },
                    { id: 'pending', label: `Pending (${pendingPaymentsCount})` },
                    { id: 'monthly_subscription', label: '₹299 Subs' },
                    { id: 'story_unlock', label: '₹19 Unlocks' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setPaymentFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        paymentFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">User / Email</th>
                      <th className="p-4">Product Purchased</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">UPI Reference / UTR</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Founder Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{p.userName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{p.userEmail}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            p.productType === 'monthly_subscription'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {p.productType === 'monthly_subscription' ? 'Monthly Sub (₹299)' : `Story: ${p.storyTitle || 'Unlock'}`}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                          ₹{p.amount}
                        </td>
                        <td className="p-4 font-mono text-slate-600 font-medium">
                          {p.transactionRef}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          {p.status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Verified
                            </span>
                          ) : p.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 text-[11px]">
                              <XCircle className="w-3 h-3 text-red-600" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.status !== 'verified' && (
                              <button
                                onClick={() => confirmPaymentByAdmin(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button
                                onClick={() => rejectPaymentByAdmin(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PREMIUM THRESHOLD & PRICING CONTROLS */}
        {/* ==================================================================== */}
        {activeTab === 'thresholds' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans-modern">Premium Threshold &amp; Pricing Controls</h2>
              <p className="text-xs text-slate-500">
                Modify business parameters dynamically. The platform recalculates story eligibility across all serials without requiring any code deployment.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-[#26F7F7] text-teal-900 font-bold text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveThresholds} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Condition 1: Premium Rating Threshold
                  </label>
                  <span className="font-mono text-teal-700 font-bold">&gt; {thresholdInput} / 5</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="5"
                  value={thresholdInput}
                  onChange={e => setThresholdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Default: 4.8. A story must have an average rating strictly greater than this threshold.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Condition 2: Required Minimum Ratings Count
                  </label>
                  <span className="font-mono text-teal-700 font-bold">&gt;= {ratingsCountInput} reviews</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={ratingsCountInput}
                  onChange={e => setRatingsCountInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Default: 400. Stories with fewer ratings remain free regardless of average score.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Single Story Unlock Price</label>
                  <input
                    type="number"
                    min="1"
                    value={storyPriceInput}
                    onChange={e => setStoryPriceInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50"
                    required
                  />
                  <p className="text-[11px] text-slate-400">Default: ₹19 (one-time for all parts)</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Monthly Premium Subscription</label>
                  <input
                    type="number"
                    min="10"
                    value={subPriceInput}
                    onChange={e => setSubPriceInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50"
                    required
                  />
                  <p className="text-[11px] text-slate-400">Default: ₹299/month</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Payment Destination (UPI ID)</label>
                <input
                  type="text"
                  value={upiIdInput}
                  onChange={e => setUpiIdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm bg-slate-50"
                  required
                />
                <p className="text-[11px] text-slate-400">Provided Destination: 7852931077@fam</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Enforced Free Content Threshold:</span>
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  • <strong>Stories under 40 parts:</strong> Must offer <strong>75% free content</strong> before the ₹19 paywall is triggered.
                  <br />
                  • <strong>Stories with 40 or more parts:</strong> Must offer <strong>at least 20 parts free</strong> before the ₹19 paywall is triggered.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Save &amp; Recalculate Platform Rules
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: STORY MODERATION */}
        {/* ==================================================================== */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sans-modern">Story Moderation &amp; Featured Controls</h2>
                <p className="text-xs text-slate-500">Feature on homepage, hide, unpublish, or delete violating content.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map(s => {
                const isPrem = isStoryPremium(s, settings);
                return (
                  <div key={s.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isPrem ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isPrem ? 'Premium Story' : 'Free Story'}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-500">
                          ★ {s.ratingAverage} ({s.ratingCount})
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{s.title}</h3>
                      <p className="text-xs text-slate-500">By {s.authorName} • {s.partsCount} Parts</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => toggleFeatureStory(s.id)}
                        className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                          s.isFeatured
                            ? 'bg-amber-100 text-amber-800 font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s.isFeatured ? '★ Featured' : 'Feature'}
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => onViewStory(s.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                          title="View Story"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStory(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: USERS & WRITERS */}
        {/* ==================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold font-sans-modern">User &amp; Writer Moderation</h2>
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">DOB / Age</th>
                    <th className="p-4">Subscription</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="p-4 flex items-center gap-2">
                        <img src={u.avatar} alt={u.displayName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{u.displayName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-slate-700">{u.role}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {u.dob} (DOB Recorded)
                      </td>
                      <td className="p-4">
                        {u.isVerified || u.isFounder ? (
                          <span className="text-slate-400 text-xs">—</span>
                        ) : u.isPremiumSubscriber ? (
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            Subscriber
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="p-4">
                        {u.isFounder ? (
                          <FounderBadge size="sm" />
                        ) : u.isVerified ? (
                          <div className="inline-flex items-center" title="Verified Insider">
                            <VerifiedBadge size="sm" />
                          </div>
                        ) : (
                          <span className="text-slate-400">Unverified</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {!u.isFounder && (
                          <button
                            onClick={() => toggleUserVerification(u.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs ${
                              u.isVerified
                                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                : 'bg-[#26f7db]/15 hover:bg-[#26f7db]/25 text-slate-900 border border-[#26f7db]'
                            }`}
                          >
                            {u.isVerified ? 'Revoke Verification' : '✦ Grant Verified Badge'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: WRITER CERTIFICATES */}
        {/* ==================================================================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans-modern">Off Script / Vellum Writer Certificates</h2>
              <p className="text-xs text-slate-500">
                Writers qualify automatically after completing at least 20 serialized stories with an average rating &gt;= 4.0.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(c => (
                <div
                  key={c.id}
                  className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl border border-teal-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#26F7F7] font-bold">
                      {c.certificateId}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                      Officially Issued
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white font-sans-modern">
                      {c.writerName}
                    </h3>
                    <p className="text-xs text-teal-300">
                      Completed {c.qualifyingStoriesCount} Stories • {c.averageRating} Average Rating
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Issued: {c.issuedDate}</span>
                    <span className="font-semibold text-white">Signed: {c.signedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: REPORTS */}
        {/* ==================================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold font-sans-modern">User Moderation Reports</h2>
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {r.targetType}
                      </span>
                      <span className="font-bold text-slate-900">{r.targetTitle}</span>
                    </div>
                    <p className="text-slate-600">Reason: {r.reason}</p>
                    <p className="text-[11px] text-slate-400">Reported by {r.reportedByUserName} • {r.status}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReportStatus(r.id, 'action_taken', 'Removed content')}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                    >
                      Take Action
                    </button>
                    <button
                      onClick={() => updateReportStatus(r.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
