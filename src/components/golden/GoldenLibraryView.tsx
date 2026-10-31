import React, { useState, useMemo } from 'react';
import { Story } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge } from '../common/FounderBadge';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Crown,
  Search,
  Filter,
  Star,
  BookOpen,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Heart,
  SlidersHorizontal,
  Flame,
  Compass,
} from 'lucide-react';

interface GoldenLibraryViewProps {
  onBack?: () => void;
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenUpgradeModal: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const GoldenLibraryView: React.FC<GoldenLibraryViewProps> = ({
  onBack,
  onSelectStory,
  onReadPart,
  onOpenUpgradeModal,
  onOpenAuth,
}) => {
  const { stories, savedStoryIds, toggleSaveStory } = useStories();
  const { currentUser, isFounder, isPremiumSubscriber } = useAuth();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'confidence' | 'readers' | 'rating'>('confidence');
  const [activeTab, setActiveTab] = useState<'curated' | 'bookshelf'>('curated');

  // Confidence-adjusted rating algorithm: Bayesian m-estimate (prior=4.5, weight=10)
  const calculateConfidenceScore = (rating: number, count: number) => {
    const prior = 4.5;
    const weight = 10;
    return (rating * count + prior * weight) / (count + weight);
  };

  // Only stories eligible for Golden Library
  const goldenStories = useMemo(() => {
    return stories
      .filter(s => s.isGoldenLibrary || s.ratingAverage >= 4.75)
      .map(s => ({
        ...s,
        confidenceScore: calculateConfidenceScore(s.ratingAverage || 5.0, s.ratingCount || 100),
      }));
  }, [stories]);

  const genres = ['All', 'Serialized Literature & Philosophy', 'Poetry', 'Historical Realism', 'Thriller & Psychological Fiction'];

  // Filter & Sort
  const filteredStories = useMemo(() => {
    let list = activeTab === 'bookshelf'
      ? goldenStories.filter(s => savedStoryIds.includes(s.id))
      : goldenStories;

    if (selectedGenre !== 'All') {
      list = list.filter(s => s.category === selectedGenre || s.genre === selectedGenre);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.synopsis.toLowerCase().includes(q) ||
          s.authorName.toLowerCase().includes(q) ||
          s.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => {
      if (selectedSort === 'confidence') return b.confidenceScore - a.confidenceScore;
      if (selectedSort === 'readers') return b.readerCount - a.readerCount;
      return b.ratingAverage - a.ratingAverage;
    });
  }, [goldenStories, activeTab, savedStoryIds, selectedGenre, searchQuery, selectedSort]);

  // Featured flagship story
  const flagship = goldenStories.find(s => s.id === 'story_beyond_the_loop') || goldenStories[0];

  const handleReadClick = (story: Story) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (!isPremiumSubscriber && !isFounder) {
      onOpenUpgradeModal();
      return;
    }
    onReadPart(story.id, 1);
  };

  return (
    <div
      className={`min-h-screen pb-28 transition-colors ${
        isDark
          ? 'bg-[#06070a] text-slate-100 selection:bg-[#e5b95a]/30 selection:text-amber-100'
          : 'bg-[#ffffff] text-[#182B32] selection:bg-[#26F7F7]/30 selection:text-[#182B32]'
      }`}
    >
      {/* Golden Library Header Banner */}
      <section
        style={
          !isDark
            ? {
                background:
                  'radial-gradient(ellipse at 75% 35%, rgba(38,247,247,0.19) 0%, rgba(207,255,255,0.13) 38%, transparent 75%), #FFFFFF',
              }
            : undefined
        }
        className={`relative overflow-hidden border-b pt-6 sm:pt-10 pb-10 sm:pb-14 transition-colors ${
          isDark
            ? 'border-amber-500/30 bg-gradient-to-b from-[#161208] via-[#090b10] to-[#06070a]'
            : 'border-[#D9F5F5]'
        }`}
      >
        {/* Ambient Nebula */}
        <div
          className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-amber-500/15' : 'bg-[#26F7F7]/15'
          }`}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
          {onBack && (
            <button
              onClick={onBack}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-serif font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-black/60 border-amber-500/40 text-amber-200 hover:bg-black'
                  : 'bg-white border-[#D9F5F5] text-[#182B32] hover:bg-[#E9FFFF]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                  isDark
                    ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                    : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#0891b2]'
                }`}
              >
                <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>The Sovereign Collection · Elite Only</span>
              </div>
              <h1
                className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                  isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#fff4cc] via-[#ffd700] to-[#d4af37]'
                    : 'text-[#182B32]'
                }`}
              >
                LEXORA Golden Library
              </h1>
              <p
                className={`text-xs sm:text-sm max-w-xl font-sans leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-[#64748B]'
                }`}
              >
                A prestigious sanctuary reserved for the highest-caliber literature. Curated through verified Bayesian reader ratings, chapter completion metrics, and human editorial rigor.
              </p>
            </div>

            {/* Elite Badge Status Indicator */}
            <div
              className={`p-4 rounded-2xl border-2 shadow-xl flex items-center gap-3 shrink-0 self-start sm:self-auto ${
                isDark
                  ? 'bg-black/70 border-amber-500/50'
                  : 'bg-white border-[#D9F5F5] shadow-[0_10px_30px_rgba(38,247,247,0.12)]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isDark
                    ? 'bg-gradient-to-br from-amber-400 to-[#f3ba38] text-black'
                    : 'bg-[#26F7F7] text-[#182B32]'
                }`}
              >
                <Crown className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-serif font-bold text-xs ${
                      isDark ? 'text-amber-200' : 'text-[#182B32]'
                    }`}
                  >
                    {isFounder ? 'CEO & Founder Sovereign Pass' : isPremiumSubscriber ? 'Elite Pass Active' : 'Public Visitor Preview'}
                  </span>
                </div>
                <p
                  className={`text-[10px] font-mono ${
                    isDark ? 'text-slate-400' : 'text-[#64748B]'
                  }`}
                >
                  {isPremiumSubscriber || isFounder ? 'Unlimited Full Reading' : 'Upgrade to Read Protected Chapters'}
                </p>
              </div>
              {!isPremiumSubscriber && !isFounder && (
                <button
                  onClick={onOpenUpgradeModal}
                  className={`px-3 py-1.5 rounded-full font-serif font-bold text-[11px] shadow-sm hover:scale-105 cursor-pointer transition-all ml-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
                      : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32]'
                  }`}
                >
                  Unlock
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation: Curated vs Personal Bookshelf */}
          <div
            className={`flex items-center gap-3 pt-2 border-t ${
              isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
            }`}
          >
            <button
              onClick={() => setActiveTab('curated')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'curated'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#26F7F7] text-[#182B32] shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-[#64748B] hover:text-[#182B32]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Masterpieces ({goldenStories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'bookshelf'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#26F7F7] text-[#182B32] shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-[#64748B] hover:text-[#182B32]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Golden Bookshelf ({goldenStories.filter(s => savedStoryIds.includes(s.id)).length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* Flagship Showcase (Beyond the Loop) */}
        {flagship && activeTab === 'curated' && !searchQuery && selectedGenre === 'All' && (
          <div
            className={`relative rounded-3xl overflow-hidden border-2 shadow-2xl p-6 sm:p-8 transition-all ${
              isDark
                ? 'border-amber-400/60 bg-gradient-to-r from-amber-950/40 via-[#0d0f17] to-black'
                : 'border-[#D9F5F5] bg-white shadow-[0_15px_40px_rgba(38,247,247,0.12)]'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div
                onClick={() => onSelectStory(flagship.id)}
                className={`md:col-span-4 aspect-[3/4] rounded-2xl overflow-hidden border shadow-xl cursor-pointer group ${
                  isDark ? 'border-amber-400/50' : 'border-[#D9F5F5]'
                }`}
              >
                <img
                  src={flagship.coverImage}
                  alt={flagship.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="md:col-span-8 space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-xs font-serif font-bold ${
                      isDark
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#0891b2]'
                    }`}
                  >
                    Editor's Crown Jewel
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      isDark ? 'text-amber-300' : 'text-[#0891b2] font-semibold'
                    }`}
                  >
                    ★ {flagship.ratingAverage.toFixed(1)} Confidence Quality Score
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}
                  >
                    · {flagship.readerCount.toLocaleString()} Readers
                  </span>
                </div>

                <h2
                  onClick={() => onSelectStory(flagship.id)}
                  className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer transition-colors ${
                    isDark ? 'text-white hover:text-amber-300' : 'text-[#182B32] hover:text-[#0891b2]'
                  }`}
                >
                  "{flagship.title}"
                </h2>

                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-[#64748B]'
                  }`}
                >
                  {flagship.synopsis}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={flagship.authorAvatar}
                    alt={flagship.authorName}
                    className={`w-9 h-9 rounded-full object-cover ring-2 ${
                      isDark ? 'ring-amber-400' : 'ring-[#26F7F7]'
                    }`}
                  />
                  <div>
                    <span
                      className={`font-serif font-bold text-xs block ${
                        isDark ? 'text-white' : 'text-[#182B32]'
                      }`}
                    >
                      {flagship.authorName}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isDark ? 'text-amber-400' : 'text-[#64748B]'
                      }`}
                    >
                      LEXORA Founder &amp; CEO
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => handleReadClick(flagship)}
                    className={`px-6 py-2.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider hover:scale-105 shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                      isDark
                        ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black'
                        : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isPremiumSubscriber || isFounder ? 'Read Masterpiece' : 'Preview Chapters'}</span>
                  </button>

                  <button
                    onClick={() => onSelectStory(flagship.id)}
                    className={`px-5 py-2.5 rounded-full border text-xs font-serif font-semibold transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-amber-200'
                        : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
                    }`}
                  >
                    View Details &amp; Reviews
                  </button>

                  <button
                    onClick={() => toggleSaveStory(flagship.id)}
                    className={`p-2.5 rounded-full border cursor-pointer transition-all ${
                      savedStoryIds.includes(flagship.id)
                        ? isDark
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-[#CFFFFF] border-[#26F7F7] text-[#0891b2]'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] hover:bg-[#E9FFFF]'
                    }`}
                    title="Save to Golden Bookshelf"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Filter & Search Bar */}
        <div
          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors ${
            isDark
              ? 'bg-black/60 border-amber-500/30'
              : 'bg-[#F7FFFF] border-[#D9F5F5]'
          }`}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${
                isDark ? 'text-amber-400/60' : 'text-[#0891b2]'
              }`}
            />
            <input
              type="text"
              placeholder="Search Golden Library by title, author, or philosophy..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs transition-colors focus:outline-hidden ${
                isDark
                  ? 'bg-[#0a0c12] border border-amber-500/30 focus:border-amber-400 text-white placeholder-slate-500'
                  : 'bg-white border border-[#D9F5F5] focus:border-[#26F7F7] text-[#182B32] placeholder-[#64748B]'
              }`}
            />
          </div>

          {/* Genre selector */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs focus:outline-hidden cursor-pointer font-serif ${
                isDark
                  ? 'bg-[#0a0c12] border-amber-500/30 text-amber-200 focus:border-amber-400'
                  : 'bg-white border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
              }`}
            >
              {genres.map(g => (
                <option
                  key={g}
                  value={g}
                  className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}
                >
                  {g}
                </option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value as any)}
              className={`px-3 py-2 rounded-xl border text-xs focus:outline-hidden cursor-pointer font-serif ${
                isDark
                  ? 'bg-[#0a0c12] border-amber-500/30 text-amber-200 focus:border-amber-400'
                  : 'bg-white border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
              }`}
            >
              <option value="confidence" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>
                Confidence Quality Ranking
              </option>
              <option value="rating" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>
                Highest Star Rating
              </option>
              <option value="readers" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>
                Most Loved &amp; Read
              </option>
            </select>
          </div>
        </div>

        {/* Story Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className={`font-serif font-bold text-lg flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-[#182B32]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#0891b2]'}`} />
              <span>{activeTab === 'bookshelf' ? 'Personal Golden Bookshelf' : 'Curated Premium Catalog'}</span>
              <span
                className={`text-xs font-mono font-normal ${
                  isDark ? 'text-amber-400/80' : 'text-[#0891b2]'
                }`}
              >
                ({filteredStories.length} titles)
              </span>
            </h3>
          </div>

          {filteredStories.length === 0 ? (
            <div
              className={`p-12 text-center rounded-3xl border space-y-3 ${
                isDark ? 'bg-black/40 border-amber-500/20' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <p className={`font-serif text-base ${isDark ? 'text-amber-300' : 'text-[#182B32]'}`}>
                No titles matched your criteria
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Try adjusting your search query or genre filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map(story => (
                <div
                  key={story.id}
                  className={`rounded-3xl border shadow-lg transition-all flex flex-col overflow-hidden group ${
                    isDark
                      ? 'bg-gradient-to-b from-[#101217] to-black border-amber-500/35 hover:border-amber-400/70 hover:shadow-[0_10px_30px_rgba(243,186,56,0.15)]'
                      : 'bg-white border-[#D9F5F5] hover:border-[#26F7F7] shadow-[0_4px_20px_rgba(38,247,247,0.08)] hover:shadow-[0_10px_30px_rgba(38,247,247,0.18)]'
                  }`}
                >
                  <div
                    onClick={() => onSelectStory(story.id)}
                    className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isDark
                          ? 'bg-gradient-to-t from-[#101217] via-transparent to-transparent'
                          : 'bg-gradient-to-t from-white/90 via-transparent to-transparent'
                      }`}
                    />

                    <div
                      className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold ${
                        isDark
                          ? 'bg-black/80 border-amber-400/40 text-amber-300'
                          : 'bg-white/95 border-[#D9F5F5] text-[#182B32] shadow-xs'
                      }`}
                    >
                      <Crown className={`w-3 h-3 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                      <span>Golden Library</span>
                    </div>

                    <div
                      className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono ${
                        isDark
                          ? 'bg-black/80 border-amber-400/30 text-amber-300'
                          : 'bg-white/95 border-[#D9F5F5] text-[#182B32] shadow-xs'
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          isDark ? 'text-amber-400 fill-amber-400' : 'text-[#0891b2] fill-[#26F7F7]'
                        }`}
                      />
                      <span>{story.ratingAverage.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                    <div className="space-y-1.5">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider block ${
                          isDark ? 'text-amber-400/80' : 'text-[#0891b2]'
                        }`}
                      >
                        {story.category}
                      </span>
                      <h4
                        onClick={() => onSelectStory(story.id)}
                        className={`font-serif font-bold text-base transition-colors cursor-pointer line-clamp-1 ${
                          isDark
                            ? 'text-white group-hover:text-amber-300'
                            : 'text-[#182B32] group-hover:text-[#0891b2]'
                        }`}
                      >
                        {story.title}
                      </h4>
                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-[#64748B]'
                        }`}
                      >
                        {story.synopsis}
                      </p>
                    </div>

                    <div
                      className={`pt-3 border-t flex items-center justify-between ${
                        isDark ? 'border-white/10' : 'border-[#D9F5F5]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={story.authorAvatar}
                          alt={story.authorName}
                          className={`w-6 h-6 rounded-full object-cover ring-1 ${
                            isDark ? 'ring-amber-400' : 'ring-[#26F7F7]'
                          }`}
                        />
                        <span
                          className={`font-serif text-xs truncate max-w-[100px] ${
                            isDark ? 'text-slate-200' : 'text-[#182B32]'
                          }`}
                        >
                          {story.authorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSaveStory(story.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            savedStoryIds.includes(story.id)
                              ? isDark
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'bg-[#CFFFFF] border-[#26F7F7] text-[#0891b2]'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] hover:bg-[#E9FFFF]'
                          }`}
                          title="Save to bookshelf"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => handleReadClick(story)}
                          className={`px-3.5 py-1.5 rounded-full font-serif font-bold text-[11px] shadow-sm hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
                              : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_2px_12px_rgba(38,247,247,0.35)]'
                          }`}
                        >
                          {isPremiumSubscriber || isFounder ? (
                            <>
                              <BookOpen className="w-3 h-3" />
                              <span>Read</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Unlock</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
