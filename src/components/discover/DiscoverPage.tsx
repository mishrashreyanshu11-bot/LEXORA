import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { isStoryPremium } from '../../utils/premiumRules';
import { LISTING_CATEGORIES } from '../../types';
import { Search, Filter, Star, BookOpen, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';

interface DiscoverPageProps {
  onBack?: () => void;
  onSelectStory: (storyId: string) => void;
  onOpenWriterProfile?: (authorId: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onBack,
  onSelectStory,
  onOpenWriterProfile,
}) => {
  const { stories, settings } = useStories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<
    'all' | 'highest_rated' | 'most_read' | 'newest' | 'free' | 'premium' | 'completed' | 'ongoing'
  >('all');

  // Filtering logic
  const filteredStories = stories.filter(story => {
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchAuthor = story.authorName.toLowerCase().includes(q) || story.authorUsername.toLowerCase().includes(q);
      const matchGenre = story.genre.toLowerCase().includes(q);
      const matchCategory = story.category.toLowerCase().includes(q);
      const matchTag = story.tags.some(t => t.toLowerCase().includes(q));
      const matchLang = story.language.toLowerCase().includes(q);

      if (!matchTitle && !matchAuthor && !matchGenre && !matchCategory && !matchTag && !matchLang) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      const matchCat = story.category.toLowerCase() === catLower || story.tags.some(t => t.toLowerCase() === catLower);
      if (!matchCat) return false;
    }

    // Filter Type
    const isPrem = isStoryPremium(story, settings);
    if (filterType === 'free' && isPrem) return false;
    if (filterType === 'premium' && !isPrem) return false;
    if (filterType === 'completed' && !story.completed) return false;
    if (filterType === 'ongoing' && story.completed) return false;

    return true;
  });

  // Sorting
  const sortedStories = [...filteredStories].sort((a, b) => {
    if (filterType === 'highest_rated') {
      // Must weight by rating and volume
      return b.ratingAverage - a.ratingAverage || b.ratingCount - a.ratingCount;
    }
    if (filterType === 'most_read') {
      return b.readerCount - a.readerCount;
    }
    if (filterType === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header & Search Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold font-sans-modern tracking-tight">
              Discover Serialized Literature
            </h1>
            <p className="text-xs text-slate-500">
              Search by title, author, genre, tag, or language across independent writers.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, writer name, genre, or #tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#26F7F7] focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Categories matching IMG_6032_e62ea990.jpeg */}
          <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-medium scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap border text-xs ${
                selectedCategory === 'All'
                  ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {LISTING_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap border text-xs ${
                    isSelected
                      ? 'bg-slate-950 text-white border-slate-950 shadow-xs scale-105'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-sm select-none">{cat.emoji}</span>
                </button>
              );
            })}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-600 pt-1 scrollbar-none">
            <span className="flex items-center gap-1 text-slate-400 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Sort / Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Serials' },
              { id: 'highest_rated', label: 'Highest Rated' },
              { id: 'most_read', label: 'Most Read' },
              { id: 'newest', label: 'Newest' },
              { id: 'free', label: 'Free Only' },
              { id: 'premium', label: 'Premium Stories' },
              { id: 'completed', label: 'Completed' },
              { id: 'ongoing', label: 'Ongoing' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-[#26F7F7]/25 text-teal-950 font-bold border border-[#26F7F7]/60'
                    : 'hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs text-slate-500 font-mono">
            Showing {sortedStories.length} {sortedStories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {sortedStories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">No stories found matching your criteria</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or resetting the filter options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStories.map(story => {
              const isPrem = isStoryPremium(story, settings);
              return (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story.id)}
                  className="bg-white rounded-3xl border border-slate-200/80 hover:border-[#26F7F7] hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/75 backdrop-blur-md text-white">
                        {story.genre}
                      </span>
                      {isPrem && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#26F7F7] text-slate-950 flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-900 line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {story.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-800 truncate block">
                          By {story.authorName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {story.partsCount} Parts
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{story.ratingAverage}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({story.ratingCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
