import React, { useState } from 'react';
import { Story } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge, VerifiedBadge, CrownBadge } from '../common/FounderBadge';
import { LexoraSymbol } from '../common/LexoraSymbol';
import { useTheme } from '../../context/ThemeContext';
import { AuthenticFeaturedDiscovery } from './AuthenticFeaturedDiscovery';
import {
  Sparkles,
  Edit3,
  ArrowRight,
  BookOpen,
  Star,
  Lock,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Trophy,
  Award,
  Feather,
  Compass,
  Gift,
  Users,
  Eye,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Crown,
} from 'lucide-react';

interface HomePageProps {
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenWriterProfile?: (authorId: string) => void;
  onOpenUpgradeModal?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenCreateStory?: () => void;
  onOpenArena?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenEliteCardModal?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onEditStory?: (story: Story) => void;
  onOpenGoldenLibrary?: () => void;
  onOpenLiteraryPassport?: () => void;
  onOpenLegal?: () => void;
  onOpenHelpCenter?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectStory,
  onReadPart,
  onOpenWriterProfile,
  onOpenUpgradeModal,
  onOpenAdminDashboard,
  onOpenCreateStory,
  onOpenArena,
  onOpenCertificateModal,
  onOpenEliteCardModal,
  onOpenAuth,
  onEditStory,
  onOpenGoldenLibrary,
  onOpenLiteraryPassport,
  onOpenLegal,
  onOpenHelpCenter,
}) => {
  const { stories, certificates, getStoryParts, featuredHeroStoryId, setFeaturedHeroStory } = useStories();
  const { currentUser, isFounder, canAccessAgeRating } = useAuth();
  const { isDark } = useTheme();

  // Flagship masterpiece or Admin Featured Story
  const heroStory = (featuredHeroStoryId && stories.find(s => s.id === featuredHeroStoryId)) || stories.find(s => s.id === 'story_beyond_the_loop') || stories[0];
  const heroParts = heroStory ? getStoryParts(heroStory.id) : [];

  const handleReadClick = (storyId: string, partNumber: number = 1) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    const target = stories.find(s => s.id === storyId);
    if (target && !canAccessAgeRating(target.ageRating || '10+')) {
      onSelectStory(storyId);
      return;
    }
    onReadPart(storyId, partNumber);
  };

  const handleStartWritingClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (onOpenCreateStory) onOpenCreateStory();
  };

  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(14200);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName.toLowerCase() === 'challenges') {
      if (onOpenArena) onOpenArena();
      return;
    }
    if (heroStory) {
      onSelectStory(heroStory.id);
    }
  };

  return (
    <div
      className={`relative min-h-screen pb-28 overflow-x-hidden transition-colors ${
        isDark
          ? 'bg-[#000000] text-slate-100 selection:bg-[#D4AF37]/30 selection:text-amber-100'
          : 'bg-[#ffffff] text-[#182B32] selection:bg-[#26F7F7]/30 selection:text-[#182B32]'
      }`}
    >
      {/* ==================================================================== */}
      {/* BLENDED TOP-RIGHT CORNER WATERMARK — MAINTAINING LEXORA SYMBOL */}
      {/* ==================================================================== */}
      <div
        className={`fixed top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none z-0 overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_top_right,black_40%,transparent_75%)] ${
          isDark
            ? 'opacity-25 mix-blend-screen'
            : 'opacity-15 mix-blend-multiply'
        }`}
      >
        <img
          src="/assets/aistudio/IMG_6186_9a1064a3.jpeg"
          alt="LEXORA Symbol Top-Right Corner Watermark"
          className="w-full h-full object-cover filter contrast-150 brightness-95 saturate-150"
        />
      </div>

      {/* ==================================================================== */}
      {/* 1. HERO SECTION (BEYOND THE LOOP THEME) */}
      {/* ==================================================================== */}
      <section
        style={
          !isDark
            ? {
                background:
                  'radial-gradient(ellipse at 75% 35%, rgba(38,247,247,0.19) 0%, rgba(207,255,255,0.13) 38%, transparent 75%), #FFFFFF',
              }
            : undefined
        }
        className={`relative overflow-hidden border-b transition-colors ${
          isDark
            ? 'border-[#D4AF37]/20 bg-gradient-to-b from-[#090b10] via-[#000000] to-[#040507]'
            : 'border-[#D9F5F5]'
        }`}
      >
        {/* Subtle Ambient Starlight */}
        <div
          className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-amber-500/10' : 'bg-[#26F7F7]/15'
          }`}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 z-10 text-left">
            {/* Header Brand Subtitle */}
            <div className="space-y-1">
              <h1
                className={`font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] ${
                  isDark ? 'text-white' : 'text-[#182B32]'
                }`}
              >
                Every Voice Has a{' '}
                <span
                  className={
                    isDark
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffe494] via-[#f3ba38] to-[#d4af37] drop-shadow-[0_2px_15px_rgba(243,186,56,0.4)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-[#0e7490] via-[#0891b2] to-[#0284c7]'
                  }
                >
                  Universe.
                </span>
              </h1>
              <p
                className={`font-serif text-lg sm:text-2xl font-semibold tracking-wide pt-1 ${
                  isDark ? 'text-amber-200/90' : 'text-[#0891b2]'
                }`}
              >
                Beyond the Loop!
              </p>
            </div>

            {/* Description */}
            <p
              className={`text-xs sm:text-base leading-relaxed max-w-xl font-sans ${
                isDark ? 'text-slate-300' : 'text-[#64748B]'
              }`}
            >
              LEXORA is a sanctuary for dreamers, thinkers, and serialized storytellers. Words find their worth, and creativity finds its home beyond the ordinary loop.
            </p>

            {/* CTAs - Responsive without clipping */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-2.5 sm:gap-3.5 pt-2 w-full max-w-full">
              {heroStory && (
                <button
                  onClick={() => onSelectStory(heroStory.id)}
                  className={`w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-400 via-[#f3ba38] to-amber-500 hover:brightness-110 text-slate-950 shadow-[0_4px_18px_rgba(243,186,56,0.35)]'
                      : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">Preview "Beyond the Loop"</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                <button
                  onClick={handleStartWritingClick}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-black/60 hover:bg-black text-amber-300 hover:text-white border border-[#e5b95a]/60'
                      : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                  }`}
                >
                  <span className="truncate">Start Writing</span>
                  <Edit3 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#f3ba38]' : 'text-[#0891b2]'}`} />
                </button>

                {isFounder && onEditStory && heroStory && (
                  <button
                    onClick={() => onEditStory(heroStory)}
                    className={`flex-1 sm:flex-none px-3.5 sm:px-5 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all ${
                      isDark
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50'
                        : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                    }`}
                  >
                    <Edit3 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                    <span className="truncate">Edit</span>
                  </button>
                )}

                {onOpenEliteCardModal && (
                  <button
                    onClick={onOpenEliteCardModal}
                    className={`flex-1 sm:flex-none px-3.5 sm:px-5 py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDark
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                    }`}
                  >
                    <Crown className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                    <span className="truncate">Elite Pass</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feature Access Badges (Golden Library & Literary Passport) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {onOpenGoldenLibrary && (
                <button
                  onClick={onOpenGoldenLibrary}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-serif font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-500/20 to-black border border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
                      : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] border border-[#D9F5F5] text-[#182B32]'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                  <span>✦ Golden Library (Curated Bayesian Classics)</span>
                </button>
              )}
              {onOpenLiteraryPassport && (
                <button
                  onClick={onOpenLiteraryPassport}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-serif font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isDark
                      ? 'bg-indigo-950/40 border border-indigo-400/40 text-indigo-200 hover:bg-indigo-900/50'
                      : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] border border-[#D9F5F5] text-[#182B32]'
                  }`}
                >
                  <Gift className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-300' : 'text-[#0891b2]'}`} />
                  <span>✈ Literary Passport (Dedicate &amp; Gift)</span>
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div
              className={`pt-4 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium border-t ${
                isDark ? 'text-slate-400 border-amber-500/15' : 'text-[#64748B] border-[#D9F5F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${isDark ? 'text-[#f3ba38]' : 'text-[#0891b2]'}`} />
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>10K+</span>
                <span>Writers</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className={`w-4 h-4 ${isDark ? 'text-[#f3ba38]' : 'text-[#0891b2]'}`} />
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>50K+</span>
                <span>Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star
                  className={`w-4 h-4 ${
                    isDark ? 'text-[#f3ba38] fill-[#f3ba38]' : 'text-[#0891b2] fill-[#26F7F7]'
                  }`}
                />
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>4.9 / 5.0</span>
                <span>Elite Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Art with Full Visibility & Admin Pinning */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div
              className={`relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border-2 flex flex-col group transition-all ${
                isDark
                  ? 'border-[#e5b95a]/50 shadow-[0_16px_50px_rgba(0,0,0,0.95)] bg-gradient-to-b from-[#0c0d12] via-[#050608] to-black'
                  : 'border-[#D9F5F5] shadow-[0_16px_40px_rgba(38,247,247,0.18)] bg-white'
              }`}
            >
              {/* Cover Artwork Container — Aspect 2:3 with full image preservation */}
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-black flex items-center justify-center p-1">
                <img
                  src={heroStory?.coverImage || '/assets/aistudio/6EFD680D-3328-45B5-BDBD-1B2D6271E557_fd4e64c3.png'}
                  alt={heroStory?.title || 'Beyond the Loop Cover'}
                  className={`w-full h-full ${
                    heroStory?.coverFit === 'cover' ? 'object-cover' : 'object-contain'
                  } ${
                    heroStory?.coverPosition === 'top'
                      ? 'object-top'
                      : heroStory?.coverPosition === 'bottom'
                      ? 'object-bottom'
                      : 'object-center'
                  } rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]`}
                />

                <div
                  className={`absolute top-3 right-3 backdrop-blur-md px-3 py-1 rounded-full border shadow-sm ${
                    isDark
                      ? 'bg-black/85 border-amber-400/40 text-amber-200'
                      : 'bg-white/95 border-[#D9F5F5] text-[#182B32]'
                  }`}
                >
                  <p className="font-serif italic text-[11px]">
                    "Beyond the Loop!"
                  </p>
                </div>
              </div>

              {/* Story Details Card — Positioned Cleanly Below Artwork (Never Obstructing Poster Details) */}
              <div
                className={`p-3.5 border-t flex items-center justify-between transition-colors ${
                  isDark
                    ? 'bg-[#090b10] border-amber-500/30 text-amber-100'
                    : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <LexoraSymbol size={26} glow={false} />
                  <div className="min-w-0">
                    <p
                      className={`font-serif font-bold text-xs sm:text-sm truncate ${
                        isDark ? 'text-amber-100' : 'text-[#182B32]'
                      }`}
                    >
                      {heroStory?.title || 'Beyond the Loop'}
                    </p>
                    <p
                      className={`text-[10px] font-mono truncate ${
                        isDark ? 'text-amber-400/80' : 'text-[#64748B]'
                      }`}
                    >
                      {heroStory?.authorName || 'Shreyanshu Mishra'}
                    </p>
                  </div>
                </div>
                {heroStory && (
                  <button
                    onClick={() => onSelectStory(heroStory.id)}
                    className={`px-4 py-1.5 rounded-full font-serif font-bold text-xs transition-transform hover:scale-105 cursor-pointer shadow-md shrink-0 ${
                      isDark
                        ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-slate-950'
                        : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_2px_12px_rgba(38,247,247,0.35)]'
                    }`}
                  >
                    Read
                  </button>
                )}
              </div>
            </div>

            {/* Admin Top Featured Story Control */}
            {isFounder && (
              <div
                className={`mt-3 w-full max-w-sm sm:max-w-md flex items-center justify-between px-3.5 py-2 rounded-2xl border text-xs shadow-md ${
                  isDark
                    ? 'bg-[#0d0f15] border-amber-500/40 text-slate-200'
                    : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                }`}
              >
                <span
                  className={`text-[11px] font-serif font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-amber-300' : 'text-[#182B32]'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-[#0891b2]'}`} />
                  <span>Admin: Feature on Top</span>
                </span>
                <select
                  value={heroStory?.id}
                  onChange={(e) => setFeaturedHeroStory && setFeaturedHeroStory(e.target.value)}
                  className={`border text-xs rounded-xl px-2.5 py-1 font-mono cursor-pointer focus:outline-hidden ${
                    isDark
                      ? 'bg-black text-amber-200 border-amber-500/40 focus:border-amber-400'
                      : 'bg-white text-[#182B32] border-[#D9F5F5] focus:border-[#26F7F7]'
                  }`}
                  title="Feature this story on top of Home Page"
                >
                  {stories.map(s => (
                    <option
                      key={s.id}
                      value={s.id}
                      className={isDark ? 'bg-slate-900 text-white font-sans' : 'bg-white text-[#182B32] font-sans'}
                    >
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. FLAGSHIP MASTERPIECE SECTION (BEYOND THE LOOP) */}
      {/* ==================================================================== */}
      {heroStory && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-amber-950/40 via-[#0e1017] to-black border-amber-500/50 shadow-2xl'
                : 'bg-white border-[#D9F5F5] shadow-[0_15px_40px_rgba(38,247,247,0.12)]'
            }`}
          >
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 ${
                isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <CrownBadge size="sm" />
                <span
                  className={`font-serif font-bold text-sm uppercase tracking-wider ${
                    isDark ? 'text-[#ffd700]' : 'text-[#182B32]'
                  }`}
                >
                  Featured Masterpiece · Beyond the Loop
                </span>
              </div>
              <span
                className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
                  isDark
                    ? 'text-amber-300/80 bg-black/60 border-amber-400/30'
                    : 'text-[#182B32] bg-[#F7FFFF] border-[#D9F5F5]'
                }`}
              >
                5 Serialized Installments · 14.2K Readers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div
                onClick={() => onSelectStory(heroStory.id)}
                className={`md:col-span-4 aspect-[3/4] rounded-2xl overflow-hidden border shadow-xl cursor-pointer group transition-all ${
                  isDark ? 'border-amber-500/40' : 'border-[#D9F5F5]'
                }`}
              >
                <img
                  src={heroStory.coverImage || '/assets/aistudio/6EFD680D-3328-45B5-BDBD-1B2D6271E557_fd4e64c3.png'}
                  alt={heroStory.title || 'Beyond the Loop'}
                  className={`w-full h-full ${
                    heroStory.coverFit === 'cover' ? 'object-cover' : 'object-contain'
                  } group-hover:scale-105 transition-transform duration-500`}
                />
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${
                        isDark
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-[#F7FFFF] text-[#0891b2] border-[#D9F5F5]'
                      }`}
                    >
                      {heroStory.category || 'Serialized Literature & Philosophy'}
                    </span>
                    <span
                      className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}
                    >
                      ★ {(heroStory.ratingAverage != null ? heroStory.ratingAverage : 5.0).toFixed(1)} ({heroStory.readerCount || 0} ratings)
                    </span>
                  </div>

                  <h2
                    onClick={() => onSelectStory(heroStory.id)}
                    className={`font-serif text-2xl sm:text-3xl font-bold cursor-pointer transition-colors ${
                      isDark ? 'text-white hover:text-amber-300' : 'text-[#182B32] hover:text-[#0891b2]'
                    }`}
                  >
                    "{heroStory.title || 'Beyond the Loop'}"
                  </h2>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed font-sans ${
                      isDark ? 'text-slate-300' : 'text-[#64748B]'
                    }`}
                  >
                    {heroStory.synopsis}
                  </p>
                </div>

                {/* Author attribution with Founder 3D Crown */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-4 pt-2 border-t ${
                    isDark ? 'border-white/10' : 'border-[#D9F5F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={heroStory.authorAvatar || '/assets/aistudio/IMG_6033_dd143268.jpeg'}
                      alt={heroStory.authorName || 'Shreyanshu Mishra'}
                      className={`w-10 h-10 rounded-full object-cover ring-2 ${
                        isDark ? 'ring-[#ffd700]' : 'ring-[#26F7F7]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-serif font-bold text-sm ${
                            isDark ? 'text-white' : 'text-[#182B32]'
                          }`}
                        >
                          {heroStory.authorName || 'Shreyanshu Mishra'}
                        </span>
                        <FounderBadge size="sm" />
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          isDark ? 'text-amber-400/90' : 'text-[#64748B]'
                        }`}
                      >
                        CEO &amp; Founder · Official Account
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        hasLiked
                          ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-300'
                          : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{likesCount.toLocaleString()}</span>
                    </button>

                    <button
                      onClick={toggleBookmark}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                        bookmarked
                          ? isDark
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-[#CFFFFF] border-[#26F7F7] text-[#0891b2]'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-300'
                          : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          bookmarked
                            ? isDark
                              ? 'fill-current text-[#ffd700]'
                              : 'fill-current text-[#0891b2]'
                            : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => handleReadClick(heroStory.id, 1)}
                      className={`px-5 py-2.5 rounded-full font-serif font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-md cursor-pointer ${
                        isDark
                          ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black'
                          : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Begin Reading</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Previews */}
                <div className="pt-2">
                  <span
                    className={`text-[11px] font-mono uppercase block mb-2 font-semibold ${
                      isDark ? 'text-amber-400/80' : 'text-[#0891b2]'
                    }`}
                  >
                    Serialized Chapters:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {heroParts.slice(0, 4).map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleReadClick(heroStory.id, p.partNumber)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
                          isDark
                            ? 'bg-black/60 hover:bg-white/5 border-white/10 text-white'
                            : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p
                            className={`font-serif text-xs font-semibold truncate ${
                              isDark ? 'text-white group-hover:text-amber-300' : 'text-[#182B32] group-hover:text-[#0891b2]'
                            }`}
                          >
                            {p.title}
                          </p>
                          <p
                            className={`text-[10px] font-mono ${
                              isDark ? 'text-slate-400' : 'text-[#64748B]'
                            }`}
                          >
                            Part {p.partNumber} · Free
                          </p>
                        </div>
                        <ArrowRight
                          className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0 ${
                            isDark ? 'text-amber-400' : 'text-[#0891b2]'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 3. ATTACHMENT 1: ELITE ACTIVATION SECTION AT BOTTOM */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16">
        <div
          className={`relative rounded-3xl border-2 overflow-hidden transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#121008] via-[#090a0f] to-black border-amber-500/60 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(243,186,56,0.25)]'
              : 'bg-white border-[#D9F5F5] shadow-[0_20px_50px_rgba(38,247,247,0.12)]'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
              isDark ? 'bg-amber-500/10' : 'bg-[#26F7F7]/15'
            }`}
          />

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 5 Cols: Visual Elite Card Mockup - High Definition & Clearly Visible */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div
                className={`relative w-full max-w-md rounded-3xl overflow-hidden border-2 group transition-all ${
                  isDark
                    ? 'border-amber-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(243,186,56,0.35)] bg-black'
                    : 'border-[#D9F5F5] shadow-[0_20px_40px_rgba(38,247,247,0.15)] bg-[#F7FFFF]'
                }`}
              >
                <img
                  src="/assets/aistudio/B30148B8-E423-4669-A33E-156E8E761156_4ad88869.png"
                  alt="Digital Lexora Elite Card - Clearly Visible"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 ring-1 ring-inset rounded-3xl pointer-events-none ${
                    isDark ? 'ring-amber-400/40' : 'ring-[#26F7F7]/30'
                  }`}
                />

                {/* Active Clarity Badge */}
                <div
                  className={`absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl backdrop-blur-md border flex items-center justify-between text-[10px] font-mono ${
                    isDark
                      ? 'bg-black/80 border-amber-400/40'
                      : 'bg-white/95 border-[#D9F5F5]'
                  }`}
                >
                  <span
                    className={`font-bold ${isDark ? 'text-amber-300' : 'text-[#182B32]'}`}
                  >
                    LEXORA ELITE · ACTIVATION CARD
                  </span>
                  <span className="text-emerald-500 font-bold">40% OFF PASS</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Elite Activation Features & Plans */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                    isDark
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#0891b2]'
                  }`}
                >
                  <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                  <span>LEXORA Elite Activation · Beyond the Loop</span>
                </div>

                <h2
                  className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-[#182B32]'
                  }`}
                >
                  Unlock the Digital Lexora Elite Card
                </h2>

                <p
                  className={`text-xs sm:text-sm leading-relaxed font-sans ${
                    isDark ? 'text-slate-300' : 'text-[#64748B]'
                  }`}
                >
                  Join the highest tier of literary patronage. Your name is permanently engraved on your digital card, accompanied by exclusive verified credentials, Golden Library unlocks, and platform privileges.
                </p>
              </div>

              {/* 3 Core Best Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 font-serif font-bold ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <Award className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                    <span>Literary Passport</span>
                  </div>
                  <p
                    className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}
                  >
                    Category completion stamps &amp; official certificates.
                  </p>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 font-serif font-bold ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                    <span>Golden Library</span>
                  </div>
                  <p
                    className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}
                  >
                    Priority showcase and unlimited reading across all premium works.
                  </p>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDark ? 'bg-black/60 border-amber-500/30' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 font-serif font-bold ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                    <span>Verification Badge</span>
                  </div>
                  <p
                    className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}
                  >
                    Black and golden combo tick verifying your author status.
                  </p>
                </div>
              </div>

              {/* Activation Plans & CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (onOpenUpgradeModal) onOpenUpgradeModal();
                  }}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_20px_rgba(243,186,56,0.5)]'
                      : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_20px_rgba(38,247,247,0.4)]'
                  }`}
                >
                  <Crown className="w-4 h-4 stroke-[2.5]" />
                  <span>Activate Elite Membership (₹299/mo)</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenUpgradeModal) onOpenUpgradeModal();
                  }}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    isDark
                      ? 'bg-black/80 hover:bg-white/5 border-amber-500/40 text-amber-200'
                      : 'bg-white hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
                  }`}
                >
                  <span>Yearly Pass (₹2,149 · Save 40%)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3.5 AUTHENTIC FEATURED STORIES DISCOVERY (Conditionally Renders ONLY when authentic published featured stories exist) */}
      {/* ==================================================================== */}
      <AuthenticFeaturedDiscovery
        stories={stories}
        onSelectStory={onSelectStory}
        isDark={isDark}
      />

      {/* ==================================================================== */}
      {/* 4. FOOTER (BEYOND THE LOOP!) */}
      {/* ==================================================================== */}
      <footer
        className={`max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12 mt-16 border-t text-xs ${
          isDark ? 'border-amber-500/20 text-slate-400' : 'border-[#D9F5F5] text-[#64748B]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <LexoraSymbol size={32} glow={false} />
            <div>
              <span
                className={`font-serif font-bold text-lg tracking-widest block ${
                  isDark ? 'text-white' : 'text-[#182B32]'
                }`}
              >
                LEXORA
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-sans -mt-0.5 block ${
                  isDark ? 'text-[#e5b95a]' : 'text-[#0891b2]'
                }`}
              >
                Beyond the Loop!
              </span>
            </div>
          </div>

          {/* Middle Links including Official Channels */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs ${
              isDark ? 'text-slate-300' : 'text-[#182B32]'
            }`}
          >
            <a
              href="https://whatsapp.com/channel/0029Vb8s4JuDuMRn4H7z0n3t"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 cursor-pointer transition-colors flex items-center gap-1"
            >
              <span>WhatsApp Channel</span>
            </a>
            <a
              href="https://www.instagram.com/lexora.____?srtk=ZHkxMW1nd2NtN21h&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 cursor-pointer transition-colors flex items-center gap-1"
            >
              <span>Instagram @lexora.____</span>
            </a>
            {onOpenLegal && (
              <button
                onClick={onOpenLegal}
                className={`cursor-pointer transition-colors ${
                  isDark ? 'hover:text-amber-300' : 'hover:text-[#0891b2]'
                }`}
              >
                Terms &amp; Privacy Policy
              </button>
            )}
            {onOpenHelpCenter && (
              <button
                onClick={onOpenHelpCenter}
                className={`cursor-pointer transition-colors ${
                  isDark ? 'hover:text-amber-300' : 'hover:text-[#0891b2]'
                }`}
              >
                Help Center
              </button>
            )}
          </div>

          {/* Socials & CEO Attribution */}
          <div className="flex items-center gap-4">
            <span
              className={`font-serif text-xs font-medium ${
                isDark ? 'text-amber-200/90' : 'text-[#64748B]'
              }`}
            >
              CEO &amp; Founder — Shreyanshu Mishra
            </span>
          </div>
        </div>

        {/* Mandatory Official Copyright Notice */}
        <div
          className={`mt-8 pt-6 border-t text-center space-y-1 ${
            isDark ? 'border-amber-500/15' : 'border-[#D9F5F5]'
          }`}
        >
          <p
            className={`font-serif text-xs font-bold tracking-wider ${
              isDark ? 'text-amber-300/90' : 'text-[#182B32]'
            }`}
          >
            LEXORA - Written by Its Community. Copyright Achieved 2026
          </p>
          <p
            className={`text-[10px] font-sans ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}
          >
            All rights reserved across 15 global languages. Universal literary sanctuary.
          </p>
        </div>
      </footer>
    </div>
  );
};
