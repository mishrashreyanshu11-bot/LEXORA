import React, { useRef } from 'react';
import { Story } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { VerifiedBadge } from '../common/FounderBadge';
import { ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';

interface FeaturedStoryCardProps {
  story: Story;
  onSelectStory: (storyId: string) => void;
  isDark: boolean;
}

const DEFAULT_COVER = '/assets/aistudio/6EFD680D-3328-45B5-BDBD-1B2D6271E557_fd4e64c3.png';

export const FeaturedStoryCard: React.FC<FeaturedStoryCardProps> = ({
  story,
  onSelectStory,
  isDark,
}) => {
  return (
    <div
      onClick={() => onSelectStory(story.id)}
      className="group flex flex-col shrink-0 w-[140px] sm:w-[170px] md:w-[190px] cursor-pointer select-none transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 2:3 Portrait Cover Box */}
      <div
        className={`relative w-full aspect-[2/3] rounded-2xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'bg-[#0b0d13] border-amber-500/25 group-hover:border-amber-400 group-hover:shadow-[0_10px_25px_rgba(243,186,56,0.25)]'
            : 'bg-[#F7FFFF] border-[#D9F5F5] group-hover:border-[#26F7F7] group-hover:shadow-[0_10px_25px_rgba(38,247,247,0.25)]'
        }`}
      >
        <img
          src={story.coverImage || DEFAULT_COVER}
          alt={story.title}
          loading="lazy"
          className={`w-full h-full ${
            story.coverFit === 'cover' ? 'object-cover' : 'object-cover'
          } ${
            story.coverPosition === 'top'
              ? 'object-top'
              : story.coverPosition === 'bottom'
              ? 'object-bottom'
              : 'object-center'
          } group-hover:scale-105 transition-transform duration-500`}
        />

        {/* Golden library badge overlay if applicable */}
        {story.isGoldenLibrary && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/60 text-amber-300 text-[9px] font-mono font-bold">
            ✦ Gold
          </div>
        )}

        {/* Rating chip if exists */}
        {story.ratingCount > 0 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#ffd700] text-[10px] font-mono flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#ffd700]" />
            <span>{(story.ratingAverage || 5).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Story Metadata */}
      <div className="pt-2.5 space-y-1 min-w-0">
        <h4
          className={`font-serif font-bold text-xs sm:text-sm line-clamp-1 transition-colors ${
            isDark ? 'text-white group-hover:text-amber-300' : 'text-[#182B32] group-hover:text-[#0891b2]'
          }`}
          title={story.title}
        >
          {story.title}
        </h4>

        <div className="flex items-center gap-1.5 text-[11px] truncate">
          <span
            className={`truncate font-sans ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}
            title={story.authorName}
          >
            {story.authorName}
          </span>
          {story.authorIsVerified && <VerifiedBadge size="xs" />}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className={`truncate px-1.5 py-0.5 rounded ${
            isDark ? 'bg-white/5 text-amber-400/80' : 'bg-[#F7FFFF] text-[#0891b2] border border-[#D9F5F5]'
          }`}>
            {story.category || story.genre || 'Story'}
          </span>
        </div>
      </div>
    </div>
  );
};

interface FeaturedStoryRowProps {
  categoryTitle: string;
  stories: Story[];
  onSelectStory: (storyId: string) => void;
  isDark: boolean;
}

export const FeaturedStoryRow: React.FC<FeaturedStoryRowProps> = ({
  categoryTitle,
  stories,
  onSelectStory,
  isDark,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!stories || stories.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Category Heading & Desktop Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-4 rounded-full ${isDark ? 'bg-amber-400' : 'bg-[#26F7F7]'}`} />
          <h3
            className={`font-serif font-bold text-base sm:text-lg tracking-tight ${
              isDark ? 'text-white' : 'text-[#182B32]'
            }`}
          >
            {categoryTitle}
          </h3>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              isDark ? 'text-amber-400/80 bg-white/5' : 'text-[#64748B] bg-[#F7FFFF] border border-[#D9F5F5]'
            }`}
          >
            {stories.length}
          </span>
        </div>

        {/* Scroll Arrows on Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
              isDark
                ? 'bg-black/60 hover:bg-white/10 text-slate-300 border-white/10'
                : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
            }`}
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
              isDark
                ? 'bg-black/60 hover:bg-white/10 text-slate-300 border-white/10'
                : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
            }`}
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Swipeable Row */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {stories.map(story => (
          <FeaturedStoryCard
            key={story.id}
            story={story}
            onSelectStory={onSelectStory}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
};

interface AuthenticFeaturedDiscoveryProps {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
  isDark: boolean;
}

/**
 * Authentic Featured Stories Discovery Section
 *
 * Rules:
 * 1. ONLY displays stories that have genuinely been written, submitted, and published by real authors on LEXORA.
 * 2. If NO eligible published featured stories exist, renders NOTHING (zero empty placeholders, zero fictional cards).
 * 3. Supports 30+ stories capacity, scaling naturally as real stories are published and featured.
 * 4. Placed seamlessly below Section 3 on the homepage without altering existing order.
 */
export const AuthenticFeaturedDiscovery: React.FC<AuthenticFeaturedDiscoveryProps> = ({
  stories,
  onSelectStory,
  isDark,
}) => {
  // Only published stories marked isFeatured (or featuredCategory assigned)
  // Exclude drafts, hidden, or unapproved
  const publishedFeaturedStories = stories.filter(
    s => s.status === 'published' && s.isFeatured
  );

  // If no authentic featured stories exist, render strictly NOTHING
  if (publishedFeaturedStories.length === 0) {
    return null;
  }

  // Group stories by category / featuredCategory
  const categoryGroups: Record<string, Story[]> = {};

  // Sort pinned stories first, then by featuredOrder or rating
  const sorted = [...publishedFeaturedStories].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.featuredOrder !== undefined && b.featuredOrder !== undefined) {
      return a.featuredOrder - b.featuredOrder;
    }
    return (b.ratingAverage || 0) - (a.ratingAverage || 0);
  });

  sorted.forEach(story => {
    const groupName = story.featuredCategory || story.category || 'Featured Stories';
    if (!categoryGroups[groupName]) {
      categoryGroups[groupName] = [];
    }
    categoryGroups[groupName].push(story);
  });

  const categories = Object.keys(categoryGroups);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-in">
      {/* Discovery Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b pb-4 border-white/10 dark:border-white/10 border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>Curated Discoveries</span>
          </div>
          <h2
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#182B32]'
            }`}
          >
            Featured Literary Works
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Authentic serialized masterpieces published by registered authors on LEXORA.
          </p>
        </div>

        <span className={`text-xs font-mono ${isDark ? 'text-amber-400/80' : 'text-[#0891b2]'}`}>
          {publishedFeaturedStories.length} Featured Works
        </span>
      </div>

      {/* Category Rows */}
      <div className="space-y-8">
        {categories.map(cat => (
          <FeaturedStoryRow
            key={cat}
            categoryTitle={cat}
            stories={categoryGroups[cat]}
            onSelectStory={onSelectStory}
            isDark={isDark}
          />
        ))}
      </div>
    </section>
  );
};
