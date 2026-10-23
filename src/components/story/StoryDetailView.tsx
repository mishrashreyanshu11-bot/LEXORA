import React, { useState } from 'react';
import { Story, StoryPart } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { isStoryPremium, getFreePartsCount, checkPartAccess } from '../../utils/premiumRules';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { PaymentModal } from '../payment/PaymentModal';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Share2,
  Star,
  Lock,
  Sparkles,
  CheckCircle,
  Clock,
  UserCheck,
  Heart,
  Flag,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface StoryDetailViewProps {
  story: Story;
  onBack: () => void;
  onReadPart: (partNumber: number) => void;
  onOpenWriterProfile?: (authorId: string) => void;
}

export const StoryDetailView: React.FC<StoryDetailViewProps> = ({
  story,
  onBack,
  onReadPart,
  onOpenWriterProfile,
}) => {
  const {
    getStoryParts,
    reviews,
    readingProgress,
    toggleSaveStory,
    isStorySaved,
    purchasedStoryIds,
    settings,
    submitReport,
    toggleFeatureStory,
  } = useStories();

  const { currentUser, isFollowing, followWriter, unfollowWriter, isFounder, toggleUserVerification } = useAuth();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('story_unlock');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate or explicit content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const parts = getStoryParts(story.id);
  const storyReviews = reviews.filter(r => r.storyId === story.id);
  const isPremium = isStoryPremium(story, settings);
  const freeCount = getFreePartsCount(story.partsCount, isPremium);
  const isPurchased = purchasedStoryIds.includes(story.id);
  const isSaved = isStorySaved(story.id);
  const progress = readingProgress[story.id];

  // Rating distribution calculation
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = storyReviews.filter(r => r.rating === stars).length;
    const percentage = storyReviews.length ? Math.round((count / storyReviews.length) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Read "${story.title}" on Vellum`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      targetType: 'story',
      targetId: story.id,
      targetTitle: story.title,
      reportedByUserId: currentUser?.id || 'anon',
      reportedByUserName: currentUser?.displayName || 'Anonymous Reader',
      reason: reportReason,
      details: reportDetails,
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveStory(story.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
              title={isSaved ? 'Saved in Library' : 'Save to Library'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Share Story"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
              title="Report Story"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-[#26F7F7] text-xs font-bold rounded-full shadow-lg">
          Link copied to clipboard!
        </div>
      )}

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-start">
          {/* Story Cover */}
          <div className="relative mx-auto md:mx-0 w-48 sm:w-56 md:w-full aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isPremium && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[#26F7F7] border border-[#26F7F7]/50 text-xs font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-[#26F7F7]" />
                <span>Premium Story</span>
              </div>
            )}
          </div>

          {/* Story Meta & Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                {story.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {story.genre}
              </span>
              {story.completed && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans-modern leading-tight">
              {story.title}
            </h1>

            {/* Author info & Founder Moderation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                onClick={() => onOpenWriterProfile && onOpenWriterProfile(story.authorId)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer w-fit"
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#26F7F7]/40 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{story.authorName}</span>
                    {story.authorIsFounder ? (
                      <FounderBadge size="sm" showLabel={false} />
                    ) : story.authorIsVerified ? (
                      <VerifiedBadge size="sm" />
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500">@{story.authorUsername}</p>
                </div>
              </div>

              {/* Founder Controls on Story Page */}
              {isFounder && (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 text-white text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-300 px-2">Founder:</span>
                  {!story.authorIsFounder && (
                    <button
                      onClick={() => toggleUserVerification(story.authorId)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#26f7db] font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <VerifiedBadge size="xs" />
                      <span>{story.authorIsVerified ? 'Revoke Author Badge' : 'Verify Author'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleFeatureStory(story.id)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {story.isFeatured ? '★ Featured' : '☆ Feature Story'}
                  </button>
                </div>
              )}
            </div>

            {/* Rating & Stats Strip */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-base font-extrabold text-slate-900">{story.ratingAverage}</span>
                <span className="text-slate-500">({story.ratingCount} ratings)</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-slate-600">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-slate-900">{story.partsCount}</span>
                <span>Parts</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="text-slate-600">
                <span className="font-bold text-slate-900">{story.readerCount.toLocaleString()}</span> Readers
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-editorial italic">
              "{story.synopsis}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {story.tags.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onReadPart(progress?.lastPartNumber || 1)}
                className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#26F7F7]" />
                <span>
                  {progress ? `Continue Part ${progress.lastPartNumber}` : 'Start Reading Part 1'}
                </span>
              </button>

              {isPremium && !isPurchased && (
                <button
                  onClick={() => {
                    setPaymentProductType('story_unlock');
                    setPaymentModalOpen(true);
                  }}
                  className="px-5 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-[#26F7F7] text-teal-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Unlock Story for ₹{settings.storyUnlockPrice || 19}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Premium Story Recognition Banner */}
        {isPremium && (
          <div className="mt-10 p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-[#26F7F7]/15 to-emerald-500/10 border-2 border-[#26F7F7]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#26F7F7] flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="font-extrabold text-sm text-slate-950 uppercase tracking-wider">Premium Story</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-[#26F7F7]">
                    ★ {story.ratingAverage} / 5
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  “This story has reached exceptional reader demand and recognition.”
                </p>
                <p className="text-[11px] text-teal-800">
                  Free content threshold: First {freeCount} of {story.partsCount} parts free ({story.partsCount < 40 ? '75% free' : `at least 20 parts free (${freeCount} chapters)`}) before the ₹19 paywall.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentProductType('story_unlock');
                setPaymentModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              {isPurchased ? 'Unlocked' : `Unlock for ₹${settings.storyUnlockPrice || 19}`}
            </button>
          </div>
        )}

        {/* Chapters Section */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-sans-modern tracking-tight">Table of Chapters</h2>
              <p className="text-xs text-slate-500">
                {story.partsCount} Serialized Parts {isPremium && `(${freeCount} Free Preview)`}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            {parts.map(part => {
              const access = checkPartAccess({
                story,
                part,
                user: currentUser,
                purchasedStoryIds,
                settings,
              });

              return (
                <div
                  key={part.id}
                  onClick={() => onReadPart(part.partNumber)}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-teal-600 transition-colors w-8">
                      #{String(part.partNumber).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900 truncate">
                        {part.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {part.estimatedReadingTimeMinutes} min read • {part.wordCount} words
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {access.canAccess ? (
                      access.isPreviewPart && isPremium ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          Free Preview
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 group-hover:text-slate-700">Read</span>
                      )
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 flex items-center gap-1 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Premium (₹19)</span>
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Breakdown & Reviews */}
        <div className="mt-14 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-sans-modern tracking-tight">Community Reviews</h2>
              <p className="text-xs text-slate-500">
                Verified reader ratings from {story.ratingCount.toLocaleString()} readers
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Average Big Score */}
            <div className="text-center md:border-r border-slate-200 pr-0 md:pr-6 space-y-1">
              <span className="text-5xl font-black text-slate-900 font-sans-modern">
                {story.ratingAverage}
              </span>
              <div className="flex justify-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      Math.round(story.ratingAverage) >= s ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Based on {story.ratingCount.toLocaleString()} ratings
              </p>
              {isPremium && (
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-full">
                  Exceeds 4.8 Threshold
                </span>
              )}
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-2 space-y-2">
              {distribution.map(d => (
                <div key={d.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-bold text-slate-600">{d.stars} stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${d.percentage || (d.stars >= 4 ? 75 : 10)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">
                    {d.percentage || (d.stars === 5 ? '82%' : '12%')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-3">
            {storyReviews.map(r => (
              <div key={r.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={r.userAvatar}
                      alt={r.userName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-slate-900">{r.userName}</span>
                      {r.userIsFounder && <FounderBadge size="sm" showLabel={false} />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${r.rating >= s ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                {r.reviewText && (
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {r.reviewText}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 font-mono">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border border-slate-100">
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Report Story</span>
            </h3>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="font-bold">Report Submitted</h4>
                <p className="text-xs text-slate-500">
                  Our moderation team and the Founder have been notified. Thank you for protecting Vellum’s community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Reason</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="Plagiarism or copyright violation">Plagiarism or copyright violation</option>
                    <option value="Inappropriate or explicit content">Inappropriate or explicit content</option>
                    <option value="Spam or promotional abuse">Spam or promotional abuse</option>
                    <option value="Hate speech or harassment">Hate speech or harassment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Additional Details</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide specific chapters or details..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        productType={paymentProductType}
        story={story}
      />
    </div>
  );
};
