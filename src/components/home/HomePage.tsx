import React, { useState } from 'react';
import { Story } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { isStoryPremium, getFreePartsCount } from '../../utils/premiumRules';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import {
  Sparkles,
  Edit3,
  ArrowRight,
  BookOpen,
  Star,
  Lock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface HomePageProps {
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenWriterProfile?: (authorId: string) => void;
  onOpenUpgradeModal?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenCreateStory?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectStory,
  onReadPart,
  onOpenWriterProfile,
  onOpenUpgradeModal,
  onOpenAdminDashboard,
  onOpenCreateStory,
}) => {
  const { stories, settings } = useStories();
  const { currentUser } = useAuth();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Productivity' | 'Finance' | 'Strategy' | 'Philosophy'>('All');

  const filteredFamousWritings = stories.filter(story => {
    if (activeCategoryFilter === 'All') return true;
    return story.category === activeCategoryFilter;
  });

  const handleScrollToWritings = () => {
    const el = document.getElementById('famous-writings-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-28">
      {/* ==================================================================== */}
      {/* HERO SECTION MATCHING SCREENSHOT EXACTLY */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e3ffff]/80 via-[#f2ffff]/50 to-white pt-10 pb-6 px-6 md:px-12">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Cyan Sparkle + Eyebrow Header */}
          <div className="flex items-center gap-2 text-[#05c4c4] font-bold text-[11px] sm:text-xs tracking-widest uppercase">
            <Sparkles className="w-4 h-4 fill-[#26F7F7] text-[#05c4c4]" />
            <span>EVERYONE HAS SOMETHING WORTH SAYING</span>
          </div>

          {/* Majestic Hero Brand Display */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-950 uppercase select-none">
            VELLUM
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed">
            Your thoughts. Your words. Your story.
          </p>

          {/* Founder Credit */}
          <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider pt-1">
            FOUNDED BY SHREYANSHU MISHRA
          </p>

          {/* CTA Buttons Row */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            {/* Start Writing Pill */}
            <button
              onClick={onOpenCreateStory}
              className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm tracking-tight flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-white" />
              <span>Start Writing</span>
            </button>

            {/* Explore Articles Pill */}
            <button
              onClick={handleScrollToWritings}
              className="px-6 py-3.5 rounded-full bg-white border border-slate-200/90 hover:border-slate-300 text-slate-900 font-semibold text-sm tracking-tight flex items-center gap-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Explore Articles</span>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Subtle Horizontal Divider */}
          <div className="border-t border-slate-100/90 pt-6 mt-8" />

          {/* Value Propositions / Features Section from Screenshot */}
          <div className="space-y-6 pt-2">
            {/* Feature 1: Write freely */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-950 tracking-tight">
                Write freely
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A distraction-free editor with room for up to 10,000 words.
              </p>
            </div>

            {/* Feature 2: Publish worldwide */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-950 tracking-tight">
                Publish worldwide
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every published piece gets a shareable public link.
              </p>
            </div>

            {/* Feature 3: Build an identity */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-950 tracking-tight">
                Build an identity
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A premium author page that grows with your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FAMOUS WRITINGS SECTION */}
      {/* ==================================================================== */}
      <section id="famous-writings-section" className="max-w-4xl mx-auto px-6 pt-12 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#26F7F7]/20 border border-[#26F7F7]/50 text-teal-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Masterworks &amp; Classic Essays</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans-modern text-slate-950 tracking-tight">
            Famous Writings on Vellum
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Essential serialized wisdom from James Clear, Morgan Housel, Robert Greene, and Robert Kiyosaki.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {(['All', 'Productivity', 'Finance', 'Strategy', 'Philosophy'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeCategoryFilter === cat
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Famous Writings Cards Grid */}
        <div className="space-y-6 pt-2">
          {filteredFamousWritings.map(story => {
            const isPrem = isStoryPremium(story, settings);
            const freeCount = getFreePartsCount(story.partsCount, isPrem);

            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story.id)}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#26F7F7] hover:shadow-xl transition-all flex flex-col sm:flex-row gap-5 cursor-pointer group"
              >
                {/* Book Cover */}
                <div className="relative w-full sm:w-32 aspect-[3/4] sm:aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isPrem && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[#26F7F7] text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Premium</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                        {story.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {story.genre}
                      </span>
                      {isPrem && (
                        <span className="text-[10px] font-bold text-teal-700">
                          {story.partsCount < 40 ? '75% Free Preview' : `First ${freeCount} Parts Free`}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-slate-950 group-hover:text-teal-900 leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2">
                      {story.synopsis}
                    </p>
                  </div>

                  {/* Author & Stats Strip */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.authorAvatar}
                        alt={story.authorName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-800">{story.authorName}</span>
                      {story.authorIsFounder ? (
                        <FounderBadge size="sm" showLabel={false} />
                      ) : (
                        <VerifiedBadge size="sm" />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{story.ratingAverage}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({story.ratingCount.toLocaleString()})
                        </span>
                      </div>

                      <span className="text-slate-300">•</span>

                      <span className="text-slate-500 font-mono text-[11px]">
                        {story.partsCount} Parts
                      </span>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onReadPart(story.id, 1);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3 text-[#26F7F7]" />
                        <span>Read Part 1</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All-Access Banner */}
        <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#26F7F7]">
              Vellum Premium All-Access
            </span>
            <h4 className="text-lg font-bold font-sans-modern">
              Read all famous writings without limits for ₹{settings.monthlySubscriptionPrice || 299}/mo
            </h4>
            <p className="text-xs text-slate-300">
              Direct access to all 40 chapters of Atomic Habits, 48 Laws of Power, and Psychology of Money.
            </p>
          </div>

          <button
            onClick={onOpenUpgradeModal}
            className="px-6 py-3 rounded-full bg-[#26F7F7] hover:bg-[#00d4d4] text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-md"
          >
            Join for ₹{settings.monthlySubscriptionPrice || 299}
          </button>
        </div>
      </section>
    </div>
  );
};
