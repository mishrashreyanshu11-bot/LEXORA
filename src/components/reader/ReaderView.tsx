import React, { useState, useEffect, useRef } from 'react';
import { Story, StoryPart, SuggestionCategory } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../../data/languages';
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
  Globe,
  FastForward,
  Rewind,
  Clock,
  Sliders,
  Sparkle,
} from 'lucide-react';
import { GuestNoticeModal } from '../common/GuestNoticeModal';

interface ReaderViewProps {
  story: Story;
  initialPartNumber?: number;
  onBack: () => void;
  onOpenStoryDetail?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  story,
  initialPartNumber = 1,
  onBack,
  onOpenStoryDetail,
  onOpenAuth,
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

  const {
    currentUser,
    isFollowing,
    followWriter,
    unfollowWriter,
    recordAudiobookProgress,
    userAge,
    canAccessAgeRating,
    isFounder,
  } = useAuth();
  const { readingLanguage, setReadingLanguage, languages } = useLanguage();

  const parts = getStoryParts(story.id);
  const [currentPartNumber, setCurrentPartNumber] = useState<number>(initialPartNumber);

  // Reader Customization State - Theme & Typography
  // Golden theme is strictly restricted to Elite Pass members reading Golden Library stories
  const isGoldenLibraryStory = Boolean(story.isGoldenLibrary);
  const hasEliteAccess = Boolean(currentUser?.isPremiumSubscriber || isFounder);
  const canUseGoldenTheme = isGoldenLibraryStory && hasEliteAccess;

  const [readingTheme, setReadingTheme] = useState<'golden' | 'dark' | 'light'>(() => {
    if (canUseGoldenTheme && currentUser?.readingThemePreference === 'golden') return 'golden';
    if (currentUser?.readingThemePreference === 'light') return 'light';
    return 'dark';
  });
  const [themeNotice, setThemeNotice] = useState<string | null>(null);

  // If story or credentials change, enforce Golden access rule
  useEffect(() => {
    if (readingTheme === 'golden' && !canUseGoldenTheme) {
      setReadingTheme('dark');
    }
  }, [canUseGoldenTheme, readingTheme]);

  const isDarkMode = readingTheme !== 'light';
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono' | 'literary' | 'editorial'>('serif');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showContentsDrawer, setShowContentsDrawer] = useState<boolean>(false);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('story_unlock');

  // Guest Notice State
  const [guestNoticeOpen, setGuestNoticeOpen] = useState(false);
  const [guestNoticeAction, setGuestNoticeAction] = useState('bookmark chapters');

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

  // =========================================================================
  // MULTILINGUAL TRANSLATION STATE (15 Languages)
  // =========================================================================
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [showOriginalOverride, setShowOriginalOverride] = useState(false);

  // Poetry Detection: If poem, NEVER translate (Mandatory Requirement)
  const isPoemStory = Boolean(
    story.isPoem ||
    story.category?.toLowerCase().includes('poet') ||
    story.genre?.toLowerCase().includes('poet')
  );

  // =========================================================================
  // LEXORA VOICE AI AUDIOBOOK STATE
  // =========================================================================
  const [showAudioStudio, setShowAudioStudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<string>(story.audiobookVoice || 'Kore');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [poetryMode, setPoetryMode] = useState<boolean>(isPoemStory);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerTimeoutRef = useRef<any>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  const currentPart = parts.find(p => p.partNumber === currentPartNumber) || parts[0];

  // Access check
  const access = checkPartAccess({
    story,
    part: currentPart,
    user: currentUser,
    purchasedStoryIds,
    settings,
  });

  // Effective content to read or synthesize
  const originalStoryLang = story.originalLanguage || story.language || 'en';
  const shouldTranslate = !isPoemStory && !showOriginalOverride && readingLanguage !== originalStoryLang;

  const displayTitle = (shouldTranslate && translatedTitle) ? translatedTitle : currentPart?.title;
  const displayContent = (shouldTranslate && translatedContent) ? translatedContent : currentPart?.content;

  // Split content into paragraphs for reading and synchronized audio highlighting
  const paragraphs = (displayContent || '').split(/\n\s*\n/).filter(p => p.trim().length > 0);

  // =========================================================================
  // TRANSLATION EFFECT
  // =========================================================================
  useEffect(() => {
    if (isPoemStory || showOriginalOverride) {
      setTranslatedTitle(null);
      setTranslatedContent(null);
      setIsTranslating(false);
      return;
    }

    if (readingLanguage === originalStoryLang) {
      setTranslatedTitle(null);
      setTranslatedContent(null);
      setIsTranslating(false);
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicationId: story.id,
        contentVersion: 1,
        title: currentPart.title,
        content: currentPart.content,
        targetLanguage: readingLanguage,
        isPoem: isPoemStory,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && data.translation) {
          setTranslatedTitle(data.translation.title);
          setTranslatedContent(data.translation.content);
        } else {
          setTranslatedTitle(null);
          setTranslatedContent(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedTitle(null);
          setTranslatedContent(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [story.id, currentPartNumber, readingLanguage, originalStoryLang, isPoemStory, showOriginalOverride]);

  // =========================================================================
  // LEXORA VOICE TTS SYNTHESIS & PLAYBACK
  // =========================================================================
  const startAudio = (speed = audioSpeed, gender = voiceGender) => {
    if (!currentPart?.content) return;
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    const textToSpeak = `${displayTitle}. ${displayContent.replace(/[\n\r]+/g, ' ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed * (poetryMode ? 0.85 : 0.95);

    // Warm, friendly pitch and voice matching
    const availableVoices = synthRef.current?.getVoices() || [];
    if (gender === 'female') {
      utterance.pitch = 1.12; // Friendly expressive feminine pitch
      const femaleVoice = availableVoices.find(v => /female|woman|zira|samantha|karen|victoria|moira/i.test(v.name));
      if (femaleVoice) utterance.voice = femaleVoice;
    } else {
      utterance.pitch = 0.93; // Friendly warm masculine baritone
      const maleVoice = availableVoices.find(v => /male|man|david|daniel|george|alex|fred/i.test(v.name));
      if (maleVoice) utterance.voice = maleVoice;
    }

    // Approximate paragraph highlighting based on character boundary
    const approxParagraphLength = Math.max(1, Math.round(textToSpeak.length / Math.max(1, paragraphs.length)));

    utterance.onboundary = (e) => {
      if (textToSpeak.length > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((e.charIndex / textToSpeak.length) * 100)));
        setAudioProgress(pct);

        const activeParaIdx = Math.min(paragraphs.length - 1, Math.floor(e.charIndex / approxParagraphLength));
        setCurrentParagraphIndex(activeParaIdx);

        // Record progress in user profile
        recordAudiobookProgress({
          storyId: story.id,
          storyTitle: story.title,
          coverImage: story.coverImage,
          authorName: story.authorName,
          partNumber: currentPart.partNumber,
          partTitle: displayTitle,
          progress: pct,
          speed,
          voice: selectedVoice,
          language: readingLanguage,
        });
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    if (synthRef.current) {
      synthRef.current.speak(utterance);
    }

    setIsPlayingAudio(true);
    setShowAudioStudio(true);

    // Sleep timer setup
    if (sleepTimerMinutes && sleepTimerMinutes > 0) {
      if (sleepTimerTimeoutRef.current) clearTimeout(sleepTimerTimeoutRef.current);
      sleepTimerTimeoutRef.current = setTimeout(() => {
        stopAudio();
      }, sleepTimerMinutes * 60 * 1000);
    }
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (synthRef.current) synthRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (synthRef.current && synthRef.current.paused) {
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
    setCurrentParagraphIndex(0);
  };

  const skipSeconds = (seconds: number) => {
    const currentProgressStep = 10;
    const newProgress = Math.min(100, Math.max(0, audioProgress + (seconds > 0 ? currentProgressStep : -currentProgressStep)));
    setAudioProgress(newProgress);
    const newParaIdx = Math.min(paragraphs.length - 1, Math.floor((newProgress / 100) * paragraphs.length));
    setCurrentParagraphIndex(newParaIdx);
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
      if (sleepTimerTimeoutRef.current) clearTimeout(sleepTimerTimeoutRef.current);
    };
  }, [currentPartNumber]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(currentProgress);

        if (currentProgress > 90 && (currentPartNumber === 1 || currentPartNumber === 2)) {
          if (!getUserRatingForStory(story.id) && !ratingSubmitted) {
            setShowRatingPrompt(true);
          }
        }

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

  // Compulsory Login Gate: Reading chapters requires authenticated member account
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#06070a] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/90 rounded-3xl border border-amber-500/40 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/15 border border-amber-400 flex items-center justify-center text-amber-300">
            <Lock className="w-8 h-8 text-[#ffd700]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Reader Sign-In Compulsory
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              To read serialized works on LEXORA, an email login is compulsory. Multiple devices may access through your email with your preexisting password combination.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              Sign In with Preexisting Password
            </button>
            <button
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 text-xs font-serif cursor-pointer"
            >
              Create Free Account
            </button>
            <button
              onClick={onBack}
              className="w-full text-slate-400 hover:text-white text-xs pt-2 cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Age Certification Gate
  if (!canAccessAgeRating(story.ageRating || '10+')) {
    return (
      <div className="min-h-screen bg-[#06070a] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/90 rounded-3xl border border-rose-500/40 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Age Restricted Publication ({story.ageRating})
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            This work is certified for readers aged {story.ageRating}. Based on your registered date of birth ({currentUser.dob}), you are currently {userAge} years old and cannot access this work.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-serif font-bold text-xs cursor-pointer"
          >
            ← Return to Story Catalog
          </button>
        </div>
      </div>
    );
  }

  // Theme styling based on readingTheme & Golden Library restrictions
  // Golden theme is strictly active ONLY for Golden Library stories read by Elite Pass holders
  const bgClass =
    readingTheme === 'golden' && canUseGoldenTheme
      ? 'bg-gradient-to-b from-[#141208] via-[#0b0a06] to-[#040406] text-[#faedd0]'
      : readingTheme === 'light'
      ? 'bg-white text-[#182B32]'
      : 'bg-[#06070a] text-slate-100';

  const headerBgClass =
    readingTheme === 'golden' && canUseGoldenTheme
      ? 'bg-[#0c0b07]/95 border-amber-500/40 text-amber-100'
      : readingTheme === 'light'
      ? 'bg-white/95 border-[#D9F5F5] text-[#182B32]'
      : 'bg-[#06070a]/95 border-amber-500/25 text-slate-100';

  const cardBgClass =
    readingTheme === 'golden' && canUseGoldenTheme
      ? 'bg-[#15130b] border-amber-400/50'
      : readingTheme === 'light'
      ? 'bg-white border-[#D9F5F5] text-[#182B32] shadow-sm'
      : 'bg-[#0b0c10] border-amber-500/30';

  const handleCycleTheme = () => {
    if (canUseGoldenTheme) {
      if (readingTheme === 'dark') {
        setReadingTheme('golden');
        setThemeNotice('Golden Luxury Theme Active');
      } else if (readingTheme === 'golden') {
        setReadingTheme('light');
        setThemeNotice('LEXORA Light Theme Active');
      } else {
        setReadingTheme('dark');
        setThemeNotice('Midnight Dark Theme Active');
      }
    } else {
      const next = readingTheme === 'dark' ? 'light' : 'dark';
      setReadingTheme(next);
      setThemeNotice(next === 'light' ? 'LEXORA Light Theme Active' : 'Midnight Dark Theme Active');
    }
    setTimeout(() => setThemeNotice(null), 2500);
  };

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 pb-28 selection:bg-[#e5b95a]/30 selection:text-amber-100`}>
      {/* Toast Notification for Theme Switching */}
      {themeNotice && (
        <div className="fixed top-20 right-4 z-50 bg-black/90 border border-amber-400/60 px-4 py-2 rounded-2xl shadow-2xl text-xs font-serif font-bold text-amber-200 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>{themeNotice}</span>
        </div>
      )}

      {/* Golden Library Shimmer Ribbon */}
      {story.isGoldenLibrary && (
        <div className="bg-gradient-to-r from-amber-500/25 via-[#ffd700]/30 to-amber-500/25 border-b border-amber-400/50 py-1.5 px-4 text-center">
          <p className="text-[11px] font-serif font-bold text-amber-300 tracking-widest flex items-center justify-center gap-1.5">
            <span>✦ GOLDEN LIBRARY EXCLUSIVE MASTERPIECE ✦</span>
          </p>
        </div>
      )}
      {/* Scroll Progress Bar at top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-[#ffd700] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* READING STUDIO HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${headerBgClass} px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4 transition-colors`}>
        {/* Left: Back & Chapter Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              readingTheme === 'light'
                ? 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
            title="Back to Story"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className={`font-serif font-bold text-sm sm:text-base truncate max-w-[170px] sm:max-w-xs ${
              readingTheme === 'light' ? 'text-[#182B32]' : 'text-white'
            }`}>
              {story.title}
            </h1>
            <p className={`text-[10px] font-mono ${
              readingTheme === 'light' ? 'text-[#64748B]' : 'text-amber-400'
            }`}>
              Part {currentPart?.partNumber} of {parts.length} · {story.authorName}
            </p>
          </div>
        </div>

        {/* Center: Multilingual Reading Selector (15 Languages) */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs ${
            readingTheme === 'light'
              ? 'bg-white border-[#D9F5F5]'
              : 'bg-black/80 border-amber-500/40'
          }`}>
            <Globe className={`w-3.5 h-3.5 shrink-0 ${
              readingTheme === 'light' ? 'text-[#182B32]' : 'text-amber-400'
            }`} />
            <select
              value={readingLanguage}
              onChange={e => {
                setShowOriginalOverride(false);
                setReadingLanguage(e.target.value as SupportedLanguageCode);
              }}
              className={`bg-transparent text-xs font-serif font-bold focus:outline-hidden cursor-pointer ${
                readingTheme === 'light' ? 'text-[#182B32]' : 'text-amber-200'
              }`}
              title="Reading Studio Language (Independent)"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-sans">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Golden Headphone (LEXORA Voice), Dark/Light/Golden Toggle, Settings */}
        <div className="flex items-center gap-2">
          {/* Golden Headphones Button — LEXORA Voice */}
          <button
            onClick={() => {
              setShowAudioStudio(!showAudioStudio);
              if (!isPlayingAudio && !showAudioStudio) {
                startAudio();
              }
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-serif font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              readingTheme === 'light'
                ? 'bg-[#26F7F7] hover:bg-[#1de9e9] text-[#182B32] shadow-[0_0_15px_rgba(38,247,247,0.35)]'
                : 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_15px_rgba(243,186,56,0.5)] hover:scale-105 active:scale-95'
            }`}
            title="Listen with LEXORA Voice"
          >
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">LEXORA Voice</span>
          </button>

          {/* Reading Theme Toggle: Light/Dark for standard, Golden for Golden Library + Elite Pass */}
          <button
            onClick={handleCycleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              readingTheme === 'golden'
                ? 'bg-amber-400/20 text-[#ffd700] border-amber-400 shadow-[0_0_10px_rgba(243,186,56,0.4)]'
                : readingTheme === 'light'
                ? 'bg-[#F7FFFF] text-[#182B32] border-[#D9F5F5] hover:bg-[#E9FFFF]'
                : 'bg-black/70 hover:bg-white/10 text-amber-300 border-amber-500/30'
            }`}
            title={
              canUseGoldenTheme
                ? `Current: ${readingTheme.toUpperCase()} (Click to cycle Golden/Light/Dark)`
                : `Current: ${readingTheme.toUpperCase()} (Click to toggle Light/Dark)`
            }
          >
            {readingTheme === 'golden' ? (
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
            ) : readingTheme === 'light' ? (
              <Moon className="w-4 h-4 text-[#182B32]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Reader Typography Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              readingTheme === 'light'
                ? 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                : 'bg-black/70 hover:bg-white/10 text-amber-300 border-amber-500/30'
            }`}
            title="Reading Settings (Font, Size & Themes)"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* LEXORA VOICE AUDIOBOOK CONTROL CONSOLE (POETRY MODE, 5 VOICES, SPEEDS) */}
      {/* ===================================================================== */}
      {showAudioStudio && (
        <div className="sticky top-16 sm:top-20 z-30 bg-[#090b10] border-b border-amber-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.9)] p-4 sm:p-5 text-slate-100 animate-fade-in">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Play / Pause / Skip / Titles */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={togglePlayAudio}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(243,186,56,0.5)] shrink-0 hover:scale-105"
                  title={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                {/* Rewind 10s */}
                <button
                  onClick={() => skipSeconds(-10)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                {/* Fast Forward 10s */}
                <button
                  onClick={() => skipSeconds(10)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                {/* Stop */}
                <button
                  onClick={stopAudio}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Stop Narration"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold">
                      LEXORA Voice
                    </span>
                    {poetryMode && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Poetry Cadence
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-serif font-bold text-white truncate max-w-xs">
                    {displayTitle}
                  </p>
                </div>
              </div>

              {/* Friendly Voice Gender Selector */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-amber-500/30 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceGender('female');
                    if (isPlayingAudio) startAudio(audioSpeed, 'female');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    voiceGender === 'female'
                      ? 'bg-gradient-to-r from-pink-500/80 to-amber-400 text-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Warm, expressive female friendly tone"
                >
                  ♀ Female Voice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceGender('male');
                    if (isPlayingAudio) startAudio(audioSpeed, 'male');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    voiceGender === 'male'
                      ? 'bg-gradient-to-r from-sky-400 to-amber-300 text-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Warm, friendly male baritone"
                >
                  ♂ Male Voice
                </button>
              </div>

              {/* Voice & Speed & Sleep Timer Controls */}
              <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto text-xs">
                {/* Voice Selector (5 Styles) */}
                <select
                  value={selectedVoice}
                  onChange={e => {
                    setSelectedVoice(e.target.value);
                    if (isPlayingAudio) startAudio();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-black border border-amber-500/30 text-amber-200 text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="Kore" className="bg-slate-900 text-white">Kore (Calm Narrator)</option>
                  <option value="Puck" className="bg-slate-900 text-white">Puck (Storyteller)</option>
                  <option value="Fenrir" className="bg-slate-900 text-white">Fenrir (Deep Cinematic)</option>
                  <option value="Zephyr" className="bg-slate-900 text-white">Zephyr (Gentle Poetry)</option>
                  <option value="Charon" className="bg-slate-900 text-white">Charon (Classical Gravitas)</option>
                </select>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[11px]">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map(spd => (
                    <button
                      key={spd}
                      onClick={() => changeAudioSpeed(spd)}
                      className={`px-2 py-0.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                        audioSpeed === spd
                          ? 'bg-gradient-to-r from-amber-400 to-[#ffd700] text-black shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Close Studio Bar */}
                <button
                  onClick={() => setShowAudioStudio(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                  title="Minimize Player Bar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-[#ffd700] to-yellow-200 h-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TYPOGRAPHY SETTINGS DRAWER */}
      {showSettings && (
        <div className={`p-4 sm:p-5 border-b ${headerBgClass} max-w-3xl mx-auto space-y-4 animate-fade-in`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-serif font-bold text-amber-300">Typeface Style</span>
            <div className="flex flex-wrap gap-1.5">
              {(['serif', 'sans', 'mono', 'literary', 'editorial'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFontFamily(f)}
                  className={`px-3 py-1 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-all ${
                    fontFamily === f ? 'bg-gradient-to-r from-amber-400 to-[#ffd700] text-black shadow-xs' : 'bg-black/50 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {f === 'serif' ? 'Classic Serif' : f === 'sans' ? 'Modern Sans' : f === 'mono' ? 'Typewriter' : f === 'literary' ? 'Literary Roman' : 'Editorial'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-amber-300">Font Size ({fontSize}px)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-200 font-bold hover:bg-amber-500/20 cursor-pointer"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-200 font-bold hover:bg-amber-500/20 cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>

          {/* Reading Atmosphere Theme Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-3 border-t border-amber-500/20">
            <div>
              <span className="font-serif font-bold text-amber-300 block">Reading Atmosphere Theme</span>
              <span className="text-[10px] text-slate-400">Golden theme requires Golden Library story &amp; Elite Pass</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setReadingTheme('dark');
                  setThemeNotice('Midnight Dark Theme Active');
                  setTimeout(() => setThemeNotice(null), 2000);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1.5 ${
                  readingTheme === 'dark'
                    ? 'bg-gradient-to-r from-amber-400 to-[#ffd700] text-black shadow-xs'
                    : 'bg-black/60 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Midnight Dark</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReadingTheme('light');
                  setThemeNotice('Ivory Light Theme Active');
                  setTimeout(() => setThemeNotice(null), 2000);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1.5 ${
                  readingTheme === 'light'
                    ? 'bg-gradient-to-r from-amber-400 to-[#ffd700] text-black shadow-xs'
                    : 'bg-black/60 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Ivory Light</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (canUseGoldenTheme) {
                    setReadingTheme('golden');
                    setThemeNotice('Golden Luxury Theme Active');
                    setTimeout(() => setThemeNotice(null), 2000);
                  } else if (!isGoldenLibraryStory) {
                    setThemeNotice('Golden theme is only accessible for stories in the Golden Library.');
                    setTimeout(() => setThemeNotice(null), 3500);
                  } else {
                    setPaymentProductType('monthly_subscription');
                    setPaymentModalOpen(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1.5 ${
                  readingTheme === 'golden'
                    ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_12px_rgba(243,186,56,0.4)]'
                    : canUseGoldenTheme
                    ? 'bg-black/60 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
                    : 'bg-black/40 text-amber-500/50 border border-amber-500/20'
                }`}
                title={
                  canUseGoldenTheme
                    ? 'Golden Luxury Theme (Exclusive)'
                    : isGoldenLibraryStory
                    ? 'Unlock with Elite Pass'
                    : 'Exclusive to Golden Library stories'
                }
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Golden Luxury</span>
                {!canUseGoldenTheme && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN READING CANVAS */}
      {/* ===================================================================== */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-8">
        {/* POETRY PRESERVATION NOTICE (CRITICAL USER MANDATE) */}
        {isPoemStory && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0" />
              <div>
                <p className="font-serif font-bold text-white text-sm">
                  Poetry Original Preservation
                </p>
                <p className="text-[11px] text-amber-300/90 font-sans">
                  In accordance with LEXORA literary standards, poetry line breaks and meter are read strictly in the author's authentic original voice ({originalStoryLang.toUpperCase()}).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI TRANSLATION BANNER & CONTROLS (IF PROSE TRANSLATION ACTIVE) */}
        {!isPoemStory && readingLanguage !== originalStoryLang && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black to-black border border-amber-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    {showOriginalOverride ? 'Original Text' : 'AI Translated'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Original: {originalStoryLang.toUpperCase()} → {readingLanguage.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] pt-0.5">
                  Context-aware literary translation preserving emotional cadence.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOriginalOverride(!showOriginalOverride)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 font-serif font-bold text-xs cursor-pointer transition-colors"
            >
              {showOriginalOverride ? 'Show AI Translation' : 'View Original Manuscript'}
            </button>
          </div>
        )}

        {/* Chapter Title & Meta Header */}
        <div className={`space-y-3 pb-6 text-center border-b ${
          readingTheme === 'light' ? 'border-[#D9F5F5]' : 'border-amber-500/20'
        }`}>
          <span className={`text-[10px] uppercase font-mono tracking-[0.25em] font-semibold ${
            readingTheme === 'light' ? 'text-[#182B32]' : 'text-amber-400'
          }`}>
            {story.category} · {story.genre}
          </span>
          <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug ${
            readingTheme === 'light' ? 'text-[#182B32]' : 'text-white'
          }`}>
            {displayTitle}
          </h2>
          <div className={`flex items-center justify-center gap-3 text-xs font-sans ${
            readingTheme === 'light' ? 'text-[#64748B]' : 'text-slate-400'
          }`}>
            <span>By {story.authorName}</span>
            <span>·</span>
            <span>~{currentPart?.estimatedReadingTimeMinutes || 4} min read</span>
          </div>
        </div>

        {/* ACCESS CHECK GATES (VIP / ELITE PASS / SINGLE UNLOCK) */}
        {!access.canAccess ? (
          <div className="p-8 rounded-3xl bg-black/90 border border-amber-500/40 text-center space-y-6 shadow-2xl">
            <Lock className="w-12 h-12 text-[#ffd700] mx-auto" />
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-white">
                Chapter Locked · Beyond the Loop Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {access.reason || 'Unlock this chapter with LEXORA VIP Elite or individual unlock.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setPaymentProductType('monthly_subscription');
                  setPaymentModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-lg cursor-pointer hover:scale-105 transition-all"
              >
                Join VIP Elite (₹299/mo)
              </button>

              <button
                onClick={() => {
                  setPaymentProductType('story_unlock');
                  setPaymentModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 font-serif text-xs cursor-pointer"
              >
                Unlock Part (₹19)
              </button>
            </div>
          </div>
        ) : (
          /* MANUSCRIPT TEXT CANVAS WITH SYNCHRONIZED PARAGRAPH HIGHLIGHTING */
          <div
            className={`space-y-6 leading-relaxed ${
              fontFamily === 'serif'
                ? 'font-serif'
                : fontFamily === 'sans'
                ? 'font-sans'
                : fontFamily === 'mono'
                ? 'font-mono'
                : fontFamily === 'literary'
                ? 'font-serif tracking-wide leading-loose text-amber-50/95'
                : 'font-serif italic tracking-wide text-amber-50/95'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {isTranslating ? (
              <div className="p-12 text-center space-y-3">
                <Globe className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-amber-300 font-serif text-sm">
                  Translating manuscript into {readingLanguage.toUpperCase()}...
                </p>
                <p className="text-xs text-slate-400">
                  Preserving literary rhythm, emotional subtext, and authentic phrasing.
                </p>
              </div>
            ) : (
              paragraphs.map((para, idx) => {
                const isCurrentAudioParagraph = isPlayingAudio && currentParagraphIndex === idx;
                return (
                  <p
                    key={idx}
                    className={`transition-all duration-300 rounded-xl p-2 -mx-2 ${
                      isCurrentAudioParagraph
                        ? 'bg-amber-500/15 border-l-4 border-amber-400 shadow-[0_0_20px_rgba(243,186,56,0.15)] text-amber-100 font-medium'
                        : readingTheme === 'golden' && canUseGoldenTheme
                        ? 'text-[#faedd0]'
                        : readingTheme === 'light'
                        ? 'text-[#182B32]'
                        : 'text-slate-200'
                    }`}
                  >
                    {para}
                  </p>
                );
              })
            )}
          </div>
        )}

        {/* BOTTOM PAGINATION: PREVIOUS / NEXT CHAPTER */}
        <div className={`pt-8 border-t flex items-center justify-between gap-4 ${
          readingTheme === 'light' ? 'border-[#D9F5F5]' : 'border-amber-500/20'
        }`}>
          <button
            onClick={handlePrevPart}
            disabled={currentPartNumber <= 1}
            className={`px-5 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-xs font-serif font-bold flex items-center gap-2 cursor-pointer transition-colors ${
              readingTheme === 'light'
                ? 'bg-[#F7FFFF] hover:bg-[#E9FFFF] border border-[#D9F5F5] text-[#182B32]'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span className={`text-xs font-mono font-bold ${
            readingTheme === 'light' ? 'text-[#182B32]' : 'text-amber-400'
          }`}>
            {currentPartNumber} / {parts.length}
          </span>

          <button
            onClick={handleNextPart}
            disabled={currentPartNumber >= parts.length}
            className={`px-5 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-xs font-serif font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all ${
              readingTheme === 'light'
                ? 'bg-[#26F7F7] hover:bg-[#1de9e9] text-[#182B32]'
                : 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
            }`}
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        productType={paymentProductType}
        story={story}
      />

      {/* GUEST NOTICE MODAL */}
      <GuestNoticeModal
        isOpen={guestNoticeOpen}
        onClose={() => setGuestNoticeOpen(false)}
        actionAttempted={guestNoticeAction}
        onOpenAuth={(mode) => {
          setGuestNoticeOpen(false);
          if (onOpenAuth) onOpenAuth(mode);
        }}
      />
    </div>
  );
};
