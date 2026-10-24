import React, { useState } from 'react';
import { Story } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge, VerifiedBadge, CrownBadge } from '../common/FounderBadge';
import { LexoraSymbol } from '../common/LexoraSymbol';
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
}) => {
  const { stories, certificates } = useStories();
  const { currentUser } = useAuth();

  const [bookmarkedStories, setBookmarkedStories] = useState<{ [id: string]: boolean }>({});
  const [likedStories, setLikedStories] = useState<{ [id: string]: number }>({
    story_unspoken_sky: 2400,
    story_the_last_letter: 12500,
    story_beyond_the_noise: 8300,
    story_monsoon_again: 6200,
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedStories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedStories(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Find reigning Champion story casted on home page for 1 week
  const castedChampionStory =
    stories.find(s => s.isCastedOnHomeUntil && new Date(s.isCastedOnHomeUntil) > new Date()) ||
    stories.find(s => s.id === 'story_chronosphere_florence');

  // Category navigation handlers
  const handleCategoryClick = (categoryName: string) => {
    if (categoryName.toLowerCase() === 'challenges') {
      if (onOpenArena) onOpenArena();
      return;
    }
    const matchingStory = stories.find(
      s => s.category.toLowerCase().includes(categoryName.toLowerCase()) ||
           s.tags.some(t => t.toLowerCase().includes(categoryName.toLowerCase()))
    );
    if (matchingStory) {
      onSelectStory(matchingStory.id);
    } else {
      const el = document.getElementById('literary-worlds-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 selection:bg-[#e5b95a]/30 selection:text-amber-100 pb-28">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION: EXACT REPLICA OF IMAGE 4 */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden border-b border-[#e5b95a]/20 bg-gradient-to-b from-[#090b10] via-[#06070a] to-[#040507]">
        {/* Subtle Ambient Gold Starlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 z-10 text-left">
            {/* Header Brand Subtitle from Image 4 */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Every Voice Has a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe494] via-[#f3ba38] to-[#d4af37] drop-shadow-[0_2px_15px_rgba(243,186,56,0.4)]">
                  Universe.
                </span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-amber-200/90 pt-1">
                Read. Write. Connect.
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              LEXORA is a home for dreamers, thinkers, poets and storytellers. Discover powerful words, share your own, and be part of a community that celebrates creativity.
            </p>

            {/* CTAs matching Image 4 */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('literary-worlds-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-[#f3ba38] to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm tracking-tight flex items-center gap-2 shadow-[0_4px_18px_rgba(243,186,56,0.35)] transition-all cursor-pointer"
              >
                <span>Explore the Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCreateStory}
                className="px-6 py-3.5 rounded-full bg-black/60 hover:bg-black text-amber-300 hover:text-white border border-[#e5b95a]/60 font-semibold text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Start Writing</span>
                <Edit3 className="w-4 h-4 text-[#f3ba38]" />
              </button>

              {onOpenArena && (
                <button
                  onClick={onOpenArena}
                  className="px-5 py-3.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm tracking-tight flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#f3ba38]" />
                  <span>Quarterly Arena</span>
                </button>
              )}
            </div>

            {/* Stats Row from Image 4 */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-slate-400 border-t border-amber-500/15">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#f3ba38]" />
                <span className="font-bold text-slate-200">10K+</span>
                <span>Writers</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#f3ba38]" />
                <span className="font-bold text-slate-200">50K+</span>
                <span>Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#f3ba38]" />
                <span className="font-bold text-slate-200">100+</span>
                <span>Stories</span>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Artwork with Fantasy Citadel & Reader */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#e5b95a]/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)] group">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                alt="LEXORA Literary Universe"
                className="w-full h-80 sm:h-96 object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              {/* Warm Golden Sunset Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-amber-950/20 to-transparent" />

              {/* Inscribed Motto on art from Image 4 */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30">
                <p className="font-serif italic text-xs text-amber-200 drop-shadow-sm">
                  "Not just words... worlds."
                </p>
              </div>

              {/* Bottom Badge Over Art */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#e5b95a]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <LexoraSymbol size={28} glow={false} />
                  <div>
                    <p className="font-serif font-bold text-xs text-amber-100">
                      LEXORA Radiated Ink
                    </p>
                    <p className="text-[10px] text-amber-400/80 font-mono">
                      Every Voice Has a Universe
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStory('story_chronosphere_florence')}
                  className="px-3 py-1 rounded-full bg-[#f3ba38] hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. CASTED CHAMPION PINNED HERO (1-Week Home Page Honour) */}
      {/* ==================================================================== */}
      {castedChampionStory && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8">
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#101217] to-amber-950/20 border-2 border-[#e5b95a]/70 shadow-2xl relative overflow-hidden group">
            {/* Ambient Gold Ray */}
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-black text-[#ffd700] font-serif font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 border-l border-b border-[#e5b95a]/50">
              <CrownBadge size="xs" />
              <span>Casted on Home Page for 1 Week · Arena 1st Place Champion</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-4 sm:pt-0">
              <div
                onClick={() => onSelectStory(castedChampionStory.id)}
                className="relative w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg shrink-0 cursor-pointer border border-amber-400/40"
              >
                <img
                  src={castedChampionStory.coverImage}
                  alt={castedChampionStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-[#f3ba38] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    1st Position Winner
                  </span>
                  <span className="text-xs text-amber-300/80 font-mono">
                    Quarterly Challenge Q1 Grand Champion
                  </span>
                </div>

                <h3
                  onClick={() => onSelectStory(castedChampionStory.id)}
                  className="font-serif text-xl sm:text-2xl font-bold text-white hover:text-[#f3ba38] transition-colors cursor-pointer"
                >
                  "{castedChampionStory.title}"
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {castedChampionStory.synopsis}
                </p>

                {/* Author with floating crown directly above PFP */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative inline-flex flex-col items-center">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <CrownBadge size="sm" />
                      </div>
                      <img
                        src={castedChampionStory.authorAvatar}
                        alt={castedChampionStory.authorName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#f3ba38]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">
                          {castedChampionStory.authorName}
                        </span>
                        <VerifiedBadge size="sm" />
                      </div>
                      <span className="text-[10px] text-amber-400/80">
                        1 Month Free Verification Conferred by CEO Shreyanshu Mishra
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenCertificateModal && (
                      <button
                        onClick={onOpenCertificateModal}
                        className="px-3.5 py-2 rounded-full border border-amber-500/60 bg-black/60 hover:bg-amber-500/20 text-[#f3ba38] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate (Image 3)</span>
                      </button>
                    )}
                    {onOpenEliteCardModal && (
                      <button
                        onClick={onOpenEliteCardModal}
                        className="px-3.5 py-2 rounded-full border border-amber-500/60 bg-black/60 hover:bg-amber-500/20 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>VIP Elite Card (Image 2)</span>
                      </button>
                    )}
                    <button
                      onClick={() => onReadPart(castedChampionStory.id, 1)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                      <span>Read Champion Story</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 3. EXPLORE OUR LITERARY WORLDS: 6 CARDS (IMAGE 4) */}
      {/* ==================================================================== */}
      <section id="literary-worlds-section" className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 space-y-6">
        <div className="flex items-end justify-between border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Explore Our Literary Worlds
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Find your kind of story. Dive into what inspires you.
            </p>
          </div>

          <button
            onClick={() => handleCategoryClick('Poetry')}
            className="text-xs font-semibold text-[#f3ba38] hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Category Cards Grid from Image 4 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {[
            {
              id: 'cat_poetry',
              name: 'Poetry',
              tagline: 'Feel. Express. Be real.',
              icon: '🪶',
              img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'cat_stories',
              name: 'Stories',
              tagline: 'Fiction. Fantasy. Thrillers.',
              icon: '📖',
              img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'cat_essays',
              name: 'Essays',
              tagline: 'Ideas. Opinions. Change.',
              icon: '💡',
              img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'cat_journal',
              name: 'Journal',
              tagline: 'Your thoughts. Your space.',
              icon: '📓',
              img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'cat_challenges',
              name: 'Challenges',
              tagline: 'Write. Compete. Shine.',
              icon: '🏆',
              img: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=400&q=80',
            },
            {
              id: 'cat_discovery',
              name: 'Discovery',
              tagline: 'New voices. Hidden gems.',
              icon: '🧭',
              img: 'https://images.unsplash.com/photo-1507842229450-7907e5c5c637?auto=format&fit=crop&w=400&q=80',
            },
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#111319] to-[#07080c] border border-amber-500/25 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between aspect-[3/4] overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-1"
            >
              {/* Background Ambient Art */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/70 to-transparent pointer-events-none" />

              {/* Top: Icon */}
              <div className="relative z-10 text-2xl sm:text-3xl">
                {cat.icon}
              </div>

              {/* Bottom: Title, Tagline & Circular Arrow */}
              <div className="relative z-10 space-y-1.5 pt-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#f3ba38] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-sans leading-tight">
                  {cat.tagline}
                </p>
                <div className="pt-2 flex justify-end">
                  <div className="w-7 h-7 rounded-full bg-black/60 border border-amber-500/40 group-hover:border-amber-300 group-hover:bg-[#f3ba38] text-amber-300 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. TWO-COLUMN SHOWCASE: FEATURED MASTERPIECE & TOP RATED (IMAGE 4) */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60%): 👑 FEATURED MASTERPIECE */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#ffd700] text-sm">👑</span>
              <h2 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#ffd700]">
                Featured Masterpiece
              </h2>
            </div>

            {/* Masterpiece Card from Image 4: The Unspoken Sky */}
            <div
              onClick={() => onSelectStory('story_unspoken_sky')}
              className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#111319] via-[#0a0b0f] to-[#050608] border border-amber-500/35 hover:border-amber-400/70 transition-all duration-300 shadow-xl group cursor-pointer"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Artwork (Anime skyline window boy) */}
                <div className="sm:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square border border-amber-500/25 relative">
                  <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80"
                    alt="The Unspoken Sky"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Details */}
                <div className="sm:col-span-7 space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#f3ba38] border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                      Poem
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#f3ba38] transition-colors">
                    The Unspoken Sky
                  </h3>

                  <p className="font-serif italic text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                    "Some feelings don’t need words, they just need a sky to be heard."
                  </p>

                  {/* Author Line */}
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                      alt="Aayushi Verma"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/60"
                    />
                    <span className="text-xs font-semibold text-slate-300">
                      By Aayushi Verma
                    </span>
                    <VerifiedBadge size="xs" />
                  </div>

                  {/* Interactive Stats matching Image 4 */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-amber-500/15">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => toggleLike('story_unspoken_sky', e)}
                        className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span>{likedStories.story_unspoken_sky || 2400}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>312</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark('story_unspoken_sky', e)}
                      className="p-1 rounded-lg hover:text-amber-300 transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedStories.story_unspoken_sky
                            ? 'fill-[#f3ba38] text-[#f3ba38]'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (40%): ⭐ Top Rated */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                <h2 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#ffd700]">
                  Top Rated
                </h2>
              </div>
              <button
                onClick={() => onSelectStory('story_the_last_letter')}
                className="text-xs font-semibold text-[#f3ba38] hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Top Rated Stories from Image 4 */}
            <div className="space-y-3">
              {[
                {
                  id: 'story_the_last_letter',
                  title: 'The Last Letter',
                  category: 'Short Story',
                  author: 'Raghav Sharma',
                  rating: 4.9,
                  likes: '12.5K',
                  img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
                },
                {
                  id: 'story_beyond_the_noise',
                  title: 'Beyond the Noise',
                  category: 'Essay',
                  author: 'Meera Iyer',
                  rating: 4.8,
                  likes: '8.3K',
                  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                },
                {
                  id: 'story_monsoon_again',
                  title: 'Monsoon Again',
                  category: 'Poem',
                  author: 'Arjun Singh',
                  rating: 4.7,
                  likes: '6.2K',
                  img: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectStory(item.id)}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#0c0d12] hover:bg-[#12141c] border border-amber-500/20 hover:border-amber-400/50 transition-all flex items-center gap-3.5 cursor-pointer group shadow-sm"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-[#f3ba38] truncate transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.category} • By {item.author}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-amber-300">
                      <span className="flex items-center gap-1 font-bold">
                        <Star className="w-3 h-3 fill-[#ffd700] text-[#ffd700]" />
                        {item.rating}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Heart className="w-3 h-3 text-red-400" />
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. MORE THAN JUST A PLATFORM (IMAGE 4) */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#12131a] via-[#090a0d] to-[#050608] border border-[#e5b95a]/40 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Books & Mug Overlay on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 sm:opacity-30 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
              alt="Good Stories Better People"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              More Than Just a Platform
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join a community of passionate writers and curious readers. Follow your favourite authors, get inspired, and build your own literary journey.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenCreateStory}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] hover:opacity-90 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Join the Community</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Avatar Cluster from Image 4 */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Community Member"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-black"
                    />
                  ))}
                </div>
                <span>Join 50K+ readers &amp; writers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. 5-PILLAR FEATURES STRIP (EXACT MATCH OF IMAGE 4) */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 pt-8 border-t border-amber-500/20 text-center">
          {/* Pillar 1 */}
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3ba38]">
              <Edit3 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-white">Write Freely</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Powerful editor with distraction-free mode.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3ba38]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-white">Get Noticed</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Showcase your work and grow your audience.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3ba38]">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-white">Earn Recognition</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Writer ranks, badges and achievements.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3ba38]">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-white">Join Challenges</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Weekly prompts, contests and more.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3ba38]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-white">Be Your Best</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              AI tools to help you write, improve and grow.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. FOOTER (EXACT REPLICA OF IMAGE 4) */}
      {/* ==================================================================== */}
      <footer className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12 mt-16 border-t border-amber-500/20 text-xs text-slate-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <LexoraSymbol size={32} glow={false} />
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-widest block">
                LEXORA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#e5b95a] font-sans -mt-0.5 block">
                Radiated Ink
              </span>
            </div>
          </div>

          {/* Middle Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="hover:text-amber-300 cursor-pointer transition-colors">About</span>
            <span className="hover:text-amber-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-amber-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-amber-300 cursor-pointer transition-colors">Contact</span>
            <span className="hover:text-amber-300 cursor-pointer transition-colors">Help</span>
          </div>

          {/* Socials & CEO Attribution from Image 4 */}
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-serif text-xs text-amber-200/90 font-medium">
              CEO - Shreyanshu Mishra
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
