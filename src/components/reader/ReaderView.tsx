import React, { useState, useEffect, useRef } from 'react';
import { Story, StoryPart, SuggestionCategory } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { checkPartAccess, isStoryPremium } from '../../utils/premiumRules';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { PaymentModal } from '../payment/PaymentModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Heart,
  Share2,
  Settings2,
  Type,
  Sun,
  Moon,
  Sparkles,
  Lock,
  Star,
  MessageSquarePlus,
  Check,
  CheckCircle2,
  ShieldAlert,
  Menu,
  X,
  Headphones,
  Play,
  Pause,
  Square,
  Volume2,
  RotateCcw,
} from 'lucide-react';

interface ReaderViewProps {
  story: Story;
  initialPartNumber?: number;
  onBack: () => void;
  onOpenStoryDetail?: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  story,
  initialPartNumber = 1,
  onBack,
  onOpenStoryDetail,
}) => {
  const {
    getStoryParts,
    saveReadingProgress,
    toggleBookmark,
    isBookmarked,
    toggleSaveStory,
    isStorySaved,
    purchasedStoryIds,
    settings,
    addRatingAndReview,
    getUserRatingForStory,
    submitSuggestion,
  } = useStories();

  const { currentUser, isFollowing, followWriter, unfollowWriter } = useAuth();

  const parts = getStoryParts(story.id);
  const [currentPartNumber, setCurrentPartNumber] = useState<number>(initialPartNumber);

  // Reader Customization State
  const [fontSize, setFontSize] = useState<number>(18); // 14 to 26
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [theme, setTheme] = useState<'paper' | 'white' | 'sepia' | 'dark' | 'oled'>('paper');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showContentsDrawer, setShowContentsDrawer] = useState<boolean>(false);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('story_unlock');

  // Suggestion Modal State
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [suggestionCategory, setSuggestionCategory] = useState<SuggestionCategory>('Pacing');
  const [suggestionComment, setSuggestionComment] = useState('');
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  // Rating State
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [userRating, setUserRating] = useState<number>(getUserRatingForStory(story.id)?.rating || 0);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Audiobook & Read-Aloud Studio State (Feature 8)
  const [showAudioStudio, setShowAudioStudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentPart = parts.find(p => p.partNumber === currentPartNumber) || parts[0];

  const startAudio = (speed = audioSpeed) => {
    if (!synthRef.current || !currentPart?.content) return;
    synthRef.current.cancel();

    const textToSpeak = `${currentPart.title}. ${currentPart.content.replace(/[\n\r]+/g, ' ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed;
    utterance.pitch = 1.0;

    utterance.onboundary = (e) => {
      if (textToSpeak.length > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((e.charIndex / textToSpeak.length) * 100)));
        setAudioProgress(pct);
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    synthRef.current.speak(utterance);
    setIsPlayingAudio(true);
    setShowAudioStudio(true);
  };

  const togglePlayAudio = () => {
    if (!synthRef.current) return;
    if (isPlayingAudio) {
      synthRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlayingAudio(true);
      } else {
        startAudio();
      }
    }
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
  };

  const changeAudioSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlayingAudio) {
      startAudio(speed);
    }
  };

  // Stop audio on chapter change or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentPartNumber]);

  // Access check
  const access = checkPartAccess({
    story,
    part: currentPart,
    user: currentUser,
    purchasedStoryIds,
    settings,
  });

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(currentProgress);

        if (currentProgress > 90 && (currentPartNumber === 1 || currentPartNumber === 2)) {
          // Encourage rating after finishing part 1 or 2 if not rated yet
          if (!getUserRatingForStory(story.id) && !ratingSubmitted) {
            setShowRatingPrompt(true);
          }
        }

        // Save progress periodically
        if (currentPart) {
          saveReadingProgress(story.id, currentPart.id, currentPart.partNumber, currentProgress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPart, story.id, currentPartNumber, ratingSubmitted]);

  // Scroll to top when part changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScrollProgress(0);
    if (currentPart) {
      saveReadingProgress(story.id, currentPart.id, currentPart.partNumber, 0);
    }
  }, [currentPartNumber]);

  const handleNextPart = () => {
    if (currentPartNumber < parts.length) {
      setCurrentPartNumber(prev => prev + 1);
    }
  };

  const handlePrevPart = () => {
    if (currentPartNumber > 1) {
      setCurrentPartNumber(prev => prev - 1);
    }
  };

  const handleRatingSubmit = (stars: number) => {
    setUserRating(stars);
    addRatingAndReview(story.id, stars, reviewComment.trim() || undefined);
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingPrompt(false);
    }, 2500);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionComment.trim()) return;

    submitSuggestion({
      storyId: story.id,
      storyTitle: story.title,
      partId: currentPart?.id,
      partTitle: currentPart?.title,
      authorId: story.authorId,
      category: suggestionCategory,
      comment: suggestionComment.trim(),
    });

    setSuggestionSubmitted(true);
    setTimeout(() => {
      setSuggestionModalOpen(false);
      setSuggestionSubmitted(false);
      setSuggestionComment('');
    }, 2000);
  };

  // Theme styling classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'white':
        return 'reader-theme-white bg-white text-slate-900';
      case 'sepia':
        return 'reader-theme-sepia bg-[#f7f1e5] text-[#3e2e1e]';
      case 'dark':
        return 'reader-theme-dark bg-[#121517] text-slate-200';
      case 'oled':
        return 'reader-theme-oled bg-black text-slate-300';
      case 'paper':
      default:
        return 'reader-theme-paper bg-[#fcfbf9] text-[#242220]';
    }
  };

  const getFontClass = () => {
    switch (fontFamily) {
      case 'sans':
        return 'font-sans-modern';
      case 'mono':
        return 'font-code';
      case 'serif':
      default:
        return 'font-editorial';
    }
  };

  const isDark = theme === 'dark' || theme === 'oled';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getThemeClasses()}`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-slate-200/30">
        <div
          className="h-full bg-[#26F7F7] transition-all duration-150 shadow-[0_0_8px_#26F7F7]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Top Navigation Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
        isDark ? 'bg-slate-950/85 border-slate-800 text-slate-200' : 'bg-white/85 border-slate-200/80 text-slate-800'
      }`}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer"
              title="Return to Story Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="overflow-hidden">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-600 truncate">
                {story.title}
              </h2>
              <p className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">
                {currentPart?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setShowContentsDrawer(true)}
              className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer"
              title="Chapters List"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => currentPart && toggleBookmark(currentPart.id)}
              className={`p-2 rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer ${
                currentPart && isBookmarked(currentPart.id) ? 'text-[#26F7F7] fill-[#26F7F7]' : ''
              }`}
              title="Bookmark this chapter"
            >
              <Bookmark className={`w-5 h-5 ${currentPart && isBookmarked(currentPart.id) ? 'fill-current' : ''}`} />
            </button>

            {/* Audiobook & Read-Aloud Studio Toggle */}
            <button
              onClick={() => {
                setShowAudioStudio(!showAudioStudio);
                if (!showAudioStudio && !isPlayingAudio) {
                  startAudio();
                }
              }}
              className={`p-2 rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer ${
                showAudioStudio || isPlayingAudio ? 'text-[#26F7F7] bg-[#26F7F7]/10 ring-1 ring-[#26F7F7]/40' : ''
              }`}
              title="Audiobook & Read-Aloud Studio (TTS Narration)"
            >
              <Headphones className="w-5 h-5" />
            </button>

            {/* Reading Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer ${
                showSettings ? 'text-[#26F7F7] bg-slate-500/10' : ''
              }`}
              title="Customize Typography & Theme"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audiobook & Read-Aloud Studio Player Bar (Feature 8) */}
        {showAudioStudio && (
          <div className={`border-t px-4 py-3 max-w-3xl mx-auto shadow-md animate-fade-in ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-950 text-white border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayAudio}
                  className="w-9 h-9 rounded-full bg-[#26F7F7] text-slate-950 hover:bg-[#00d4d4] flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                  title={isPlayingAudio ? 'Pause Narration' : 'Resume Narration'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                {/* Stop / Reset */}
                <button
                  onClick={stopAudio}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer shrink-0"
                  title="Stop"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>

                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#26F7F7] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#26F7F7] uppercase tracking-wider">Audiobook Studio</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate font-medium">
                    Part {currentPart?.partNumber}: {currentPart?.title}
                  </p>
                </div>
              </div>

              {/* Playback Speed Controls & Close */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-[11px]">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeAudioSpeed(speed)}
                      className={`px-2 py-0.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                        audioSpeed === speed
                          ? 'bg-[#26F7F7] text-slate-950 shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {audioProgress}%
                  </span>
                  <button
                    onClick={() => {
                      stopAudio();
                      setShowAudioStudio(false);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Close Audiobook Studio"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Progress Line */}
            <div className="w-full bg-white/10 h-1 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-[#26F7F7] h-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Reader Settings Drawer/Panel */}
        {showSettings && (
          <div className={`border-t px-4 py-4 max-w-3xl mx-auto space-y-4 shadow-lg animate-fade-in ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Font Family */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Typeface</span>
              <div className="flex rounded-xl bg-slate-200/50 p-1 gap-1">
                <button
                  onClick={() => setFontFamily('serif')}
                  className={`px-3 py-1 rounded-lg font-serif text-sm transition-all ${
                    fontFamily === 'serif' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontFamily('sans')}
                  className={`px-3 py-1 rounded-lg font-sans text-xs transition-all ${
                    fontFamily === 'sans' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => setFontFamily('mono')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                    fontFamily === 'mono' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Mono
                </button>
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Text Size ({fontSize}px)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-200/60 hover:bg-slate-200 font-bold text-xs"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="26"
                  value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="w-28 accent-[#26F7F7]"
                />
                <button
                  onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-200/60 hover:bg-slate-200 font-bold text-sm"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Themes */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Theme</span>
              <div className="flex gap-2">
                {[
                  { id: 'paper', label: 'Paper', bg: 'bg-[#fcfbf9] border-[#e2dcd5]' },
                  { id: 'white', label: 'White', bg: 'bg-white border-slate-300' },
                  { id: 'sepia', label: 'Sepia', bg: 'bg-[#f7f1e5] border-[#dfd4c0]' },
                  { id: 'dark', label: 'Dark', bg: 'bg-[#121517] border-slate-700' },
                  { id: 'oled', label: 'OLED', bg: 'bg-black border-slate-800' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${t.bg} ${
                      theme === t.id ? 'ring-2 ring-[#26F7F7] font-bold' : ''
                    } ${t.id === 'dark' || t.id === 'oled' ? 'text-white' : 'text-slate-800'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Reading Canvas */}
      <main className="max-w-2xl mx-auto px-5 py-8 md:py-14">
        {/* Story Part Header */}
        <div className="mb-10 space-y-3 pb-8 border-b border-slate-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Part {currentPart?.partNumber} of {story.partsCount}
            </span>
            <span className="text-xs text-slate-500">
              {currentPart?.estimatedReadingTimeMinutes || 3} min read • {currentPart?.wordCount} words
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans-modern leading-tight">
            {currentPart?.title}
          </h1>

          {/* Author Card & Follow */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#26F7F7]/40"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{story.authorName}</span>
                  {story.authorIsFounder ? (
                    <FounderBadge size="sm" showLabel={false} />
                  ) : story.authorIsVerified ? (
                    <VerifiedBadge size="sm" />
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">@{story.authorUsername}</p>
              </div>
            </div>

            {currentUser?.id !== story.authorId && (
              <button
                onClick={() =>
                  isFollowing(story.authorId)
                    ? unfollowWriter(story.authorId)
                    : followWriter(story.authorId)
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isFollowing(story.authorId)
                    ? 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isFollowing(story.authorId) ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Access Verification & Content Body */}
        {access.canAccess ? (
          /* UNLOCKED: Read Content */
          <article
            ref={contentRef}
            className={`prose prose-slate max-w-none transition-all leading-relaxed ${getFontClass()}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            {currentPart?.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </article>
        ) : (
          /* LOCKED: Premium Access Paywall */
          <div className="my-10 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl border border-teal-500/30 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#26F7F7]/20 border border-[#26F7F7] flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#26F7F7]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#26F7F7]/15 text-[#26F7F7] text-xs font-semibold border border-[#26F7F7]/40">
                <Sparkles className="w-3.5 h-3.5" />
                LEXORA Premium Story
              </span>
              <h3 className="text-2xl font-bold font-sans-modern">
                This story has reached exceptional reader demand and recognition.
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                You have reached the free chapter threshold for this premium serial (
                {story.partsCount < 40 
                  ? `75% free content: parts 1–${access.freePartsCount} of ${access.totalPartsCount}` 
                  : `free preview: parts 1–${access.freePartsCount} of ${access.totalPartsCount} (at least 20 parts free)`}
                ). Unlock full access to continue reading this celebrated story.
              </p>
            </div>

            {/* Unlock Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
              {/* Option 1: Unlock Story for ₹19 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#26F7F7] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-slate-400">Single Story</span>
                  <span className="text-lg font-bold font-mono text-[#26F7F7]">₹{settings.storyUnlockPrice || 19}</span>
                </div>
                <h4 className="font-bold text-white text-sm">Permanent Story Access</h4>
                <p className="text-[11px] text-slate-400">
                  Unlocks all current {story.partsCount} chapters and all future parts published for this story.
                </p>
                <button
                  onClick={() => {
                    setPaymentProductType('story_unlock');
                    setPaymentModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#26F7F7] hover:bg-[#00d4d4] text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Unlock for ₹{settings.storyUnlockPrice || 19}
                </button>
              </div>

              {/* Option 2: LEXORA Premium for ₹299/mo */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/40 to-slate-900 border border-[#26F7F7]/40 hover:border-[#26F7F7] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-[#26F7F7]">All Access</span>
                  <span className="text-lg font-bold font-mono text-white">₹{settings.monthlySubscriptionPrice || 299}/mo</span>
                </div>
                <h4 className="font-bold text-white text-sm">LEXORA Premium</h4>
                <p className="text-[11px] text-slate-300">
                  Unlimited access to all premium stories, exclusive badge, community access & direct writer notes.
                </p>
                <button
                  onClick={() => {
                    setPaymentProductType('monthly_subscription');
                    setPaymentModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Get All-Access (₹{settings.monthlySubscriptionPrice || 299})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suggest an Edit / Constructive Feedback Button */}
        {access.canAccess && (
          <div className="my-10 p-5 rounded-2xl border border-slate-300/40 bg-slate-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-semibold text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <MessageSquarePlus className="w-4 h-4 text-teal-600" />
                <span>Suggest an Edit to {story.authorName}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Notice an issue with pacing, grammar, continuity, or character consistency? Share constructive feedback.
              </p>
            </div>
            <button
              onClick={() => setSuggestionModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              Suggest an Edit
            </button>
          </div>
        )}

        {/* Rating Prompt Modal / Inline card (Triggered after part 1 or 2) */}
        {showRatingPrompt && !ratingSubmitted && (
          <div className="my-8 p-6 rounded-3xl bg-gradient-to-br from-teal-50 to-white border-2 border-[#26F7F7] shadow-xl space-y-4 animate-fade-in text-slate-900">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2.5 py-0.5 rounded-full">
                  Reader Impressions
                </span>
                <h4 className="text-lg font-bold font-sans-modern">
                  How are you enjoying "{story.title}"?
                </h4>
                <p className="text-xs text-slate-600">
                  Your genuine feedback shapes our editorial discovery and supports independent writers.
                </p>
              </div>
              <button
                onClick={() => setShowRatingPrompt(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRatingSubmit(star)}
                  className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      userRating >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-700">
                {userRating > 0 ? `${userRating} Stars` : 'Tap to rate'}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Optional: Add a brief review sentence..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
              />
              {userRating > 0 && (
                <button
                  onClick={() => handleRatingSubmit(userRating)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
                >
                  Submit Review
                </button>
              )}
            </div>
          </div>
        )}

        {ratingSubmitted && (
          <div className="my-6 p-4 rounded-2xl bg-teal-50 border border-[#26F7F7] flex items-center gap-3 text-teal-900 text-xs">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <span>Thank you for your rating! Your review has been recorded on the story.</span>
          </div>
        )}

        {/* Bottom Chapter Navigation Bar */}
        <div className="mt-14 pt-8 border-t border-slate-300/30 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevPart}
            disabled={currentPartNumber <= 1}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-300/60 hover:bg-slate-500/10 font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {currentPartNumber} / {parts.length}
          </span>

          <button
            onClick={handleNextPart}
            disabled={currentPartNumber >= parts.length}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4 text-[#26F7F7]" />
          </button>
        </div>
      </main>

      {/* Table of Contents Drawer */}
      {showContentsDrawer && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-base">Table of Contents</h3>
                <p className="text-xs text-slate-500">{story.partsCount} Chapters</p>
              </div>
              <button
                onClick={() => setShowContentsDrawer(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {parts.map(p => {
                const isCurrent = p.partNumber === currentPartNumber;
                const partAccess = checkPartAccess({
                  story,
                  part: p,
                  user: currentUser,
                  purchasedStoryIds,
                  settings,
                });

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentPartNumber(p.partNumber);
                      setShowContentsDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-teal-50 border border-[#26F7F7] font-bold text-teal-950'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="text-[11px] font-mono text-slate-400">Part {p.partNumber}</p>
                      <p className="text-sm truncate">{p.title}</p>
                    </div>

                    {!partAccess.canAccess ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 flex items-center gap-1 border border-slate-200 shrink-0">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Locked (₹19)</span>
                      </span>
                    ) : partAccess.isPreviewPart && isStoryPremium(story, settings) ? (
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full shrink-0">
                        Preview
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowContentsDrawer(false)} />
        </div>
      )}

      {/* Suggest an Edit Modal */}
      {suggestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Suggest an Edit</h3>
                <p className="text-xs text-slate-500">For {currentPart?.title}</p>
              </div>
              <button
                onClick={() => setSuggestionModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {suggestionSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Suggestion Sent!</h4>
                <p className="text-xs text-slate-500">
                  Your constructive suggestion was sent to {story.authorName} for review. Reader suggestions never automatically edit a story.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Category of Suggestion</label>
                  <select
                    value={suggestionCategory}
                    onChange={e => setSuggestionCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
                  >
                    <option value="Plot">Plot Logic</option>
                    <option value="Characters">Character Consistency</option>
                    <option value="Pacing">Pacing & Flow</option>
                    <option value="Grammar">Grammar / Typo</option>
                    <option value="Writing style">Writing Style</option>
                    <option value="Continuity">Continuity / Lore</option>
                    <option value="Structure">Structural Note</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Your Constructive Observation</label>
                  <textarea
                    rows={4}
                    value={suggestionComment}
                    onChange={e => setSuggestionComment(e.target.value)}
                    placeholder="Describe specific improvements to help the writer polish their narrative..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Constructive and respectful critique helps writers build unforgettable serials.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Send Suggestion
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        productType={paymentProductType}
        story={story}
        onSuccess={() => {
          // Re-render access
        }}
      />
    </div>
  );
};
