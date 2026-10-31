import React, { useState } from 'react';
import { Story, StoryPart } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { isStoryPremium, getFreePartsCount, checkPartAccess } from '../../utils/premiumRules';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { PaymentModal } from '../payment/PaymentModal';
import { GuestNoticeModal } from '../common/GuestNoticeModal';
import { useTheme } from '../../context/ThemeContext';
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
  X,
  Edit3,
  Crown,
  AlertOctagon,
} from 'lucide-react';

interface StoryDetailViewProps {
  story: Story;
  onBack: () => void;
  onReadPart: (partNumber: number) => void;
  onOpenWriterProfile?: (authorId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onEditStory?: (story: Story) => void;
}

export const StoryDetailView: React.FC<StoryDetailViewProps> = ({
  story,
  onBack,
  onReadPart,
  onOpenWriterProfile,
  onOpenAuth,
  onEditStory,
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

  const {
    currentUser,
    isFollowing,
    followWriter,
    unfollowWriter,
    isFounder,
    toggleUserVerification,
    userAge,
    canAccessAgeRating,
  } = useAuth();

  const { isDark } = useTheme();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('story_unlock');
  const [guestNoticeOpen, setGuestNoticeOpen] = useState(false);
  const [guestNoticeAction, setGuestNoticeAction] = useState('save stories to your personal library');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate or explicit content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(false);

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

  const handleBookmarkClick = () => {
    if (!currentUser) {
      setGuestNoticeAction('save stories to your personal library and sync reading progress');
      setGuestNoticeOpen(true);
      return;
    }
    toggleSaveStory(story.id);
  };

  const handleFollowClick = () => {
    if (!currentUser) {
      setGuestNoticeAction(`follow ${story.authorName} and receive chapter publication notifications`);
      setGuestNoticeOpen(true);
      return;
    }
    if (isFollowing(story.authorId)) {
      unfollowWriter(story.authorId);
    } else {
      followWriter(story.authorId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Read "${story.title}" on LEXORA`,
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

  const handleStartReading = (partNumber: number) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (!canAccessAgeRating(story.ageRating || '10+')) {
      setAgeGateOpen(true);
      return;
    }
    onReadPart(partNumber);
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-200 ${
        isDark
          ? story.isGoldenLibrary
            ? 'bg-gradient-to-b from-[#121008] via-[#08080a] to-[#050608] text-slate-100 border-t-2 border-amber-400/50'
            : 'bg-[#06070a] text-slate-100'
          : 'bg-[#FFFFFF] text-[#182B32]'
      }`}
      style={
        !isDark
          ? {
              background:
                'radial-gradient(ellipse at 75% 25%, rgba(38,247,247,0.15) 0%, rgba(207,255,255,0.10) 40%, transparent 75%), #FFFFFF',
            }
          : undefined
      }
    >
      {/* Golden Library Metallic Header Banner */}
      {story.isGoldenLibrary && (
        <div
          className={`py-2 px-4 text-center border-b transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-amber-500/20 via-[#ffd700]/30 to-amber-500/20 border-amber-400/60 text-amber-200'
              : 'bg-gradient-to-r from-[#26F7F7]/20 via-[#CFFFFF]/40 to-[#26F7F7]/20 border-[#26F7F7]/40 text-[#182B32]'
          }`}
        >
          <p className="text-xs font-serif font-bold tracking-widest flex items-center justify-center gap-2">
            <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
            <span>✦ GOLDEN LIBRARY EXCLUSIVE MASTERPIECE ✦</span>
            <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
          </p>
        </div>
      )}
      {/* Top Navigation */}
      <div
        className={`sticky top-0 z-20 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-[#0a0c10]/90 border-amber-500/20'
            : 'bg-[#FFFFFF]/90 border-[#D9F5F5]'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isDark
                ? 'hover:bg-white/5 text-amber-200/80 hover:text-white'
                : 'hover:bg-[#E9FFFF] text-[#182B32] hover:text-[#182B32]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? isDark
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_12px_rgba(243,186,56,0.3)]'
                    : 'border-[#26F7F7] bg-[#E9FFFF] text-[#182B32] shadow-[0_0_12px_rgba(38,247,247,0.3)]'
                  : isDark
                  ? 'border-white/10 hover:bg-white/5 text-slate-300'
                  : 'border-[#D9F5F5] hover:bg-[#E9FFFF] text-[#64748B]'
              }`}
              title={isSaved ? 'Saved in Library' : 'Save to Library'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/5 text-slate-300'
                  : 'border-[#D9F5F5] hover:bg-[#E9FFFF] text-[#64748B]'
              }`}
              title="Share Story"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-400'
                  : 'border-[#D9F5F5] hover:bg-rose-50 text-[#64748B] hover:text-rose-600'
              }`}
              title="Report Story"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {copiedLink && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-xs font-bold rounded-full shadow-lg ${
            isDark
              ? 'bg-black border border-amber-500/40 text-amber-300'
              : 'bg-white border border-[#26F7F7] text-[#182B32]'
          }`}
        >
          Link copied to clipboard!
        </div>
      )}

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-start">
          {/* Story Cover */}
          <div
            className={`relative mx-auto md:mx-0 w-52 sm:w-60 md:w-full aspect-[2/3] rounded-3xl overflow-hidden group transition-all ${
              isDark
                ? 'shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(243,186,56,0.2)] border border-amber-500/30'
                : 'shadow-[0_15px_30px_rgba(38,247,247,0.15),0_4px_12px_rgba(0,0,0,0.04)] border border-[#D9F5F5]'
            }`}
          >
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isPremium && (
              <div
                className={`absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-1 shadow-md ${
                  isDark
                    ? 'bg-black/85 text-amber-300 border border-amber-400/50'
                    : 'bg-white/95 text-[#182B32] border border-[#26F7F7]'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
                <span>Premium Story</span>
              </div>
            )}
          </div>

          {/* Story Meta & Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isDark
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-[#E9FFFF] text-[#182B32] border border-[#26F7F7]/40'
                }`}
              >
                {story.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark
                    ? 'bg-white/5 text-slate-300 border border-white/10'
                    : 'bg-[#F7FFFF] text-[#64748B] border border-[#D9F5F5]'
                }`}
              >
                {story.genre}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  isDark
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                    : 'bg-[#F7FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                Rated {story.ageRating || '10+'}
              </span>
              {story.isGoldenLibrary && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black border border-amber-400'
                      : 'bg-[#E9FFFF] text-[#182B32] border border-[#26F7F7]'
                  }`}
                >
                  <Crown className={`w-3 h-3 ${isDark ? 'text-black' : 'text-[#182B32]'}`} />
                  Golden Library
                </span>
              )}
              {story.completed && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>

            <h1
              className={`text-3xl md:text-4xl font-extrabold tracking-tight font-serif leading-tight ${
                isDark ? 'text-white' : 'text-[#182B32]'
              }`}
            >
              {story.title}
            </h1>

            {/* Author info & Founder Moderation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                onClick={() => onOpenWriterProfile && onOpenWriterProfile(story.authorId)}
                className={`flex items-center gap-3 p-2.5 rounded-2xl transition-colors cursor-pointer w-fit border ${
                  isDark
                    ? 'hover:bg-white/5 border-transparent hover:border-amber-500/20'
                    : 'hover:bg-[#E9FFFF] border-transparent hover:border-[#D9F5F5]'
                }`}
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className={`w-11 h-11 rounded-full object-cover ring-2 shadow-xs ${
                    isDark ? 'ring-amber-400/50' : 'ring-[#26F7F7]/60'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                      {story.authorName}
                    </span>
                    {story.authorIsFounder ? (
                      <FounderBadge size="sm" showLabel={false} />
                    ) : story.authorIsVerified ? (
                      <VerifiedBadge size="sm" />
                    ) : null}
                  </div>
                  <p className={`text-xs font-mono ${isDark ? 'text-amber-200/60' : 'text-[#64748B]'}`}>
                    @{story.authorUsername}
                  </p>
                </div>
              </div>

              {/* Follow Button */}
              {currentUser?.id !== story.authorId && (
                <button
                  onClick={handleFollowClick}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isFollowing(story.authorId)
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#E9FFFF] text-[#182B32] border border-[#26F7F7]/60'
                      : isDark
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f3ba38] hover:from-[#e5c07b] hover:to-[#f5c95d] text-black font-extrabold shadow-sm'
                      : 'bg-[#26F7F7] hover:bg-[#15e0e0] text-[#182B32] font-extrabold shadow-sm'
                  }`}
                >
                  {isFollowing(story.authorId) ? 'Following' : '+ Follow Author'}
                </button>
              )}

              {/* Founder Controls on Story Page */}
              {isFounder && (
                <div
                  className={`w-full flex items-center gap-2 p-2 rounded-2xl border text-xs ${
                    isDark
                      ? 'bg-[#0e1118] border-amber-500/30 text-white'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase font-bold px-2 ${
                      isDark ? 'text-amber-400' : 'text-[#182B32]'
                    }`}
                  >
                    Founder:
                  </span>
                  {!story.authorIsFounder && (
                    <button
                      onClick={() => toggleUserVerification(story.authorId)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 border ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-500/20'
                          : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                      }`}
                    >
                      <VerifiedBadge size="xs" />
                      <span>{story.authorIsVerified ? 'Revoke Author Badge' : 'Verify Author'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleFeatureStory(story.id)}
                    className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-colors cursor-pointer border ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 text-amber-400 border-amber-500/20'
                        : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                    }`}
                  >
                    {story.isFeatured ? '★ Featured on Home' : '☆ Feature Story'}
                  </button>
                </div>
              )}
            </div>

            {/* Rating & Stats Strip */}
            <div
              className={`flex flex-wrap items-center gap-4 py-3 border-y text-xs ${
                isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-[#182B32] fill-[#26F7F7]'}`} />
                <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  {story.ratingAverage}
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-[#64748B]'}>({story.ratingCount} ratings)</span>
              </div>
              <span className={isDark ? 'text-amber-500/40' : 'text-[#D9F5F5]'}>•</span>
              <div className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                <BookOpen className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>{story.partsCount}</span>
                <span>Parts</span>
              </div>
              <span className={isDark ? 'text-amber-500/40' : 'text-[#D9F5F5]'}>•</span>
              <div className={isDark ? 'text-slate-300' : 'text-[#64748B]'}>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  {story.readerCount.toLocaleString()}
                </span>{' '}
                Readers
              </div>
            </div>

            {/* Synopsis */}
            <p
              className={`text-sm md:text-base leading-relaxed font-serif italic ${
                isDark ? 'text-slate-300' : 'text-[#182B32]/90'
              }`}
            >
              "{story.synopsis}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {story.tags.map(t => (
                <span
                  key={t}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                    isDark
                      ? 'bg-white/5 text-amber-200/80 border-amber-500/10'
                      : 'bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleStartReading(progress?.lastPartNumber || 1)}
                className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f3ba38] to-[#d4af37] hover:brightness-110 text-black shadow-[0_0_20px_rgba(243,186,56,0.35)]'
                    : 'bg-[#26F7F7] hover:bg-[#15e0e0] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${isDark ? 'text-black' : 'text-[#182B32]'}`} />
                <span>
                  {progress ? `Continue Part ${progress.lastPartNumber}` : 'Start Reading Part 1'}
                </span>
              </button>

              {(isFounder || currentUser?.id === story.authorId) && onEditStory && (
                <button
                  onClick={() => onEditStory(story)}
                  className={`px-5 py-3.5 rounded-2xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm border ${
                    isDark
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-300'
                      : 'bg-[#E9FFFF] hover:bg-[#dbf8f8] border-[#26F7F7] text-[#182B32]'
                  }`}
                >
                  <Edit3 className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#182B32]'}`} />
                  <span>{story.id === 'story_beyond_the_loop' ? 'Edit Masterpiece' : 'Edit Story'}</span>
                </button>
              )}

              {isPremium && !isPurchased && !isFounder && (
                <button
                  onClick={() => {
                    setPaymentProductType('story_unlock');
                    setPaymentModalOpen(true);
                  }}
                  className={`px-5 py-3.5 rounded-2xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border ${
                    isDark
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/60 text-amber-200'
                      : 'bg-[#E9FFFF] hover:bg-[#dbf8f8] border-[#26F7F7] text-[#182B32]'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
                  <span>Unlock Story for ₹{settings.storyUnlockPrice || 19}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Premium Story Recognition Banner */}
        {isPremium && (
          <div
            className={`mt-10 p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-amber-500/10 via-[#0d1017] to-amber-500/10 border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                : 'bg-[#F7FFFF] border-[#D9F5F5] shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-br from-[#d4af37] to-[#f3ba38] text-black'
                    : 'bg-[#26F7F7] text-[#182B32]'
                }`}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span
                    className={`font-extrabold text-sm uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-[#182B32]'
                    }`}
                  >
                    Premium Story
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-black border-amber-500/40 text-amber-300'
                        : 'bg-white border-[#26F7F7] text-[#182B32]'
                    }`}
                  >
                    ★ {story.ratingAverage} / 5
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                  “This story has reached exceptional reader demand and recognition.”
                </p>
                <p className={`text-[11px] ${isDark ? 'text-amber-300/80' : 'text-[#182B32]/70'}`}>
                  Free content threshold: First {freeCount} of {story.partsCount} parts free ({story.partsCount < 40 ? '75% free' : `at least 20 parts free (${freeCount} chapters)`}) before the ₹19 paywall.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentProductType('story_unlock');
                setPaymentModalOpen(true);
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer shadow-sm hover:brightness-105 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3ba38] text-black'
                  : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
              }`}
            >
              {isPurchased ? 'Unlocked' : `Unlock for ₹${settings.storyUnlockPrice || 19}`}
            </button>
          </div>
        )}

        {/* Chapters Section */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold font-serif tracking-tight ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Table of Chapters
              </h2>
              <p className={`text-xs ${isDark ? 'text-amber-200/60' : 'text-[#64748B]'}`}>
                {story.partsCount} Serialized Parts {isPremium && `(${freeCount} Free Preview)`}
              </p>
            </div>
          </div>

          <div
            className={`divide-y rounded-2xl border overflow-hidden shadow-sm transition-colors ${
              isDark
                ? 'divide-white/5 border-amber-500/20 bg-[#0a0d13]'
                : 'divide-[#D9F5F5] border-[#D9F5F5] bg-white'
            }`}
          >
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
                  onClick={() => handleStartReading(part.partNumber)}
                  className={`p-4 transition-colors flex items-center justify-between gap-4 cursor-pointer group ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-[#E9FFFF]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`font-mono text-xs font-bold transition-colors w-8 ${
                        isDark
                          ? 'text-amber-400/60 group-hover:text-amber-300'
                          : 'text-[#64748B] group-hover:text-[#182B32]'
                      }`}
                    >
                      #{String(part.partNumber).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={`font-bold text-sm truncate transition-colors ${
                          isDark
                            ? 'text-slate-200 group-hover:text-amber-200'
                            : 'text-[#182B32] group-hover:text-[#008f8f]'
                        }`}
                      >
                        {part.title}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}>
                        {part.estimatedReadingTimeMinutes} min read • {part.wordCount} words
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {access.canAccess ? (
                      access.isPreviewPart && isPremium ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isDark
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-[#E9FFFF] text-[#182B32] border-[#26F7F7]/60'
                          }`}
                        >
                          Free Preview
                        </span>
                      ) : (
                        <span
                          className={`text-xs ${
                            isDark
                              ? 'text-amber-300/80 group-hover:text-white'
                              : 'text-[#64748B] group-hover:text-[#182B32]'
                          }`}
                        >
                          Read Free
                        </span>
                      )
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
                          isDark
                            ? 'bg-white/5 text-amber-400 border-amber-500/30'
                            : 'bg-[#E9FFFF] text-[#182B32] border-[#26F7F7]/60'
                        }`}
                      >
                        <Lock className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-[#182B32]'}`} />
                        <span>Premium (₹19)</span>
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-colors ${
                        isDark
                          ? 'text-slate-600 group-hover:text-amber-300'
                          : 'text-[#64748B] group-hover:text-[#182B32]'
                      }`}
                    />
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
              <h2 className={`text-xl font-bold font-serif tracking-tight ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Community Reviews
              </h2>
              <p className={`text-xs ${isDark ? 'text-amber-200/60' : 'text-[#64748B]'}`}>
                Verified reader ratings from {story.ratingCount.toLocaleString()} readers
              </p>
            </div>
          </div>

          <div
            className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xs transition-colors ${
              isDark
                ? 'bg-[#0a0d13] border-amber-500/20'
                : 'bg-white border-[#D9F5F5]'
            }`}
          >
            {/* Average Big Score */}
            <div
              className={`text-center md:border-r pr-0 md:pr-6 space-y-1 ${
                isDark ? 'border-white/10' : 'border-[#D9F5F5]'
              }`}
            >
              <span
                className={`text-5xl font-black font-serif ${
                  isDark ? 'text-amber-400' : 'text-[#182B32]'
                }`}
              >
                {story.ratingAverage}
              </span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      Math.round(story.ratingAverage) >= s
                        ? isDark
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#182B32] fill-[#26F7F7]'
                        : isDark
                        ? 'text-white/20'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Based on {story.ratingCount.toLocaleString()} ratings
              </p>
              {isPremium && (
                <span
                  className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
                      : 'text-[#182B32] bg-[#E9FFFF] border-[#26F7F7]/60'
                  }`}
                >
                  Exceeds 4.8 Threshold
                </span>
              )}
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-2 space-y-2">
              {distribution.map(d => (
                <div key={d.stars} className="flex items-center gap-3 text-xs">
                  <span className={`w-12 font-bold ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                    {d.stars} stars
                  </span>
                  <div
                    className={`flex-1 h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-white/10' : 'bg-[#D9F5F5]'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDark
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                          : 'bg-[#26F7F7]'
                      }`}
                      style={{ width: `${d.percentage || (d.stars >= 4 ? 75 : 10)}%` }}
                    />
                  </div>
                  <span className={`w-10 text-right font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    {d.percentage || (d.stars === 5 ? '82%' : '12%')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-3">
            {storyReviews.map(r => (
              <div
                key={r.id}
                className={`p-4 rounded-2xl border space-y-2 shadow-xs transition-colors ${
                  isDark
                    ? 'border-amber-500/15 bg-[#0a0d13]'
                    : 'border-[#D9F5F5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={r.userAvatar}
                      alt={r.userName}
                      className={`w-7 h-7 rounded-full object-cover ring-1 ${
                        isDark ? 'ring-amber-400/40' : 'ring-[#26F7F7]/50'
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                        {r.userName}
                      </span>
                      {r.userIsFounder && <FounderBadge size="sm" showLabel={false} />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          r.rating >= s
                            ? isDark
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-[#182B32] fill-[#26F7F7]'
                            : isDark
                            ? 'text-white/10'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {r.reviewText && (
                  <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                    {r.reviewText}
                  </p>
                )}
                <p className={`text-[10px] font-mono ${isDark ? 'text-amber-200/50' : 'text-[#64748B]'}`}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border ${
              isDark
                ? 'bg-[#0b0e14] border-amber-500/40 text-slate-100'
                : 'bg-white border-[#D9F5F5] text-[#182B32]'
            }`}
          >
            <h3 className={`font-bold text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Report Story</span>
            </h3>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>Report Submitted</h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  Our moderation team and the Founder have been notified. Thank you for protecting LEXORA’s community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>Reason</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark
                        ? 'border-white/10 bg-black/60 text-slate-200 focus:border-amber-400'
                        : 'border-[#D9F5F5] bg-[#F7FFFF] text-[#182B32] focus:border-[#26F7F7]'
                    }`}
                  >
                    <option value="Plagiarism or copyright violation">Plagiarism or copyright violation</option>
                    <option value="Inappropriate or explicit content">Inappropriate or explicit content</option>
                    <option value="Spam or promotional abuse">Spam or promotional abuse</option>
                    <option value="Hate speech or harassment">Hate speech or harassment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                    Additional Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide specific chapters or details..."
                    className={`w-full p-3 text-xs rounded-xl border focus:outline-none ${
                      isDark
                        ? 'border-white/10 bg-black/60 text-slate-200 focus:border-amber-400'
                        : 'border-[#D9F5F5] bg-[#F7FFFF] text-[#182B32] focus:border-[#26F7F7]'
                    }`}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isDark
                        ? 'border-white/10 hover:bg-white/5 text-slate-300'
                        : 'border-[#D9F5F5] hover:bg-[#E9FFFF] text-[#64748B]'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
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

      {/* Age Restriction Gate Modal */}
      {ageGateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`relative w-full max-w-md rounded-3xl border p-6 space-y-4 shadow-2xl text-center ${
              isDark
                ? 'bg-[#090b10] border-rose-500/50 text-slate-100'
                : 'bg-white border-rose-200 text-[#182B32]'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-500">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Age Certification Protected
              </h3>
              <p className="text-xs font-mono text-rose-500">
                This story is certified for readers aged {story.ageRating || '10+'}.
              </p>
            </div>

            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Under LEXORA Literary Universe guidelines, stories with mature, dark, or violent themes are age-restricted. Based on your registered date of birth ({currentUser?.dob || 'unverified'}), your current age ({userAge} years) does not meet the requirement for this publication.
            </p>

            <button
              onClick={() => setAgeGateOpen(false)}
              className={`w-full py-2.5 rounded-full font-serif font-bold text-xs cursor-pointer transition-colors ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
              }`}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Guest Reader Non-Intrusive Feature Modal */}
      <GuestNoticeModal
        isOpen={guestNoticeOpen}
        onClose={() => setGuestNoticeOpen(false)}
        onOpenAuth={onOpenAuth || (() => {})}
        actionAttempted={guestNoticeAction}
      />
    </div>
  );
};
