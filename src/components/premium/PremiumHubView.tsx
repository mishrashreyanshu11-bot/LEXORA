import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { VerifiedBadge, FounderBadge, CrownBadge } from '../common/FounderBadge';
import { InkVaultModal } from '../inkvault/InkVaultModal';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Crown,
  Brain,
  Feather,
  Lock,
  Gem,
  BarChart3,
  BookOpen,
  Moon,
  Headphones,
  Compass,
  Trophy,
  Users2,
  Star,
  PenTool,
  Rocket,
  MessageSquare,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Volume2,
  ArrowLeft,
} from 'lucide-react';

interface PremiumHubViewProps {
  onBack?: () => void;
  onOpenUpgradeModal: () => void;
  onOpenEditor: () => void;
  onOpenArena: () => void;
  onOpenInkVault: () => void;
  onSelectStory: (storyId: string) => void;
}

export const PremiumHubView: React.FC<PremiumHubViewProps> = ({
  onBack,
  onOpenUpgradeModal,
  onOpenEditor,
  onOpenArena,
  onOpenInkVault,
  onSelectStory,
}) => {
  const { settings, writersCircles, stories } = useStories();
  const { currentUser, isFounder, isPremiumSubscriber } = useAuth();
  const { isDark } = useTheme();

  const [activeInteractiveFeature, setActiveInteractiveFeature] = useState<number | null>(null);
  const [inkVaultOpen, setInkVaultOpen] = useState(false);

  // Audio Read-Aloud Demo State
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  // Author Signature Card Demo State
  const [signatureCardOpen, setSignatureCardOpen] = useState(false);

  // Preserve My Voice Demo State
  const [voiceDemoOriginal, setVoiceDemoOriginal] = useState('Furthermore, it is crucial to delve into the reality that the world is changing very fast.');
  const [voiceDemoPreserved, setVoiceDemoPreserved] = useState('');

  const handleTestPreserveVoice = () => {
    setVoiceDemoPreserved(
      'The ground beneath us shifted without warning, smelling of damp copper and unvoiced dread.'
    );
  };

  const handleToggleAudioDemo = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingDemo) {
        window.speechSynthesis.cancel();
        setIsPlayingDemo(false);
      } else {
        const text = 'Welcome to the LEXORA Audiobook and Read-Aloud Studio. Radiated Ink. Beyond the Loop.';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingDemo(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingDemo(true);
      }
    }
  };

  const FEATURES_LIST = [
    {
      num: 1,
      title: 'AI Writing Companion',
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      tagline: 'Poetry Enhancer, Rhyme Finder & Preserve My Voice',
      description: 'Enhance your manuscript without losing your unique voice. Our AI preserves rhythmic cadence, finds complex slant rhymes, and purges formulaic robotic output.',
      badge: 'Integrated into Studio',
      actionLabel: 'Try Preserve My Voice Demo',
      onClick: () => setActiveInteractiveFeature(1),
    },
    {
      num: 2,
      title: 'Advanced Writing Studio',
      icon: <Feather className="w-5 h-5 text-teal-600" />,
      tagline: 'Distraction-Free, Autosave & PDF/EPUB Exports',
      description: 'Unlimited drafts, revision history, chapter reorganization, literature typography, custom themes, and export directly to pristine PDF or EPUB formats.',
      badge: 'Distraction-Free',
      actionLabel: 'Launch Writing Studio',
      onClick: onOpenEditor,
    },
    {
      num: 3,
      title: 'InkVault 🔐',
      icon: <Lock className="w-5 h-5 text-amber-600" />,
      tagline: 'Encrypted Storage for Manuscripts & Journals',
      description: 'Zero-knowledge encrypted cloud vault for unpublished manuscripts, private journals, unfinished poems, story concepts, and immutable backups.',
      badge: 'AES-256 Cloud Vault',
      actionLabel: 'Open My InkVault',
      onClick: () => setInkVaultOpen(true),
    },
    {
      num: 4,
      title: 'Premium Author Portfolio',
      icon: <Gem className="w-5 h-5 text-cyan-600" />,
      tagline: 'Custom Themes, Banners & Shareable Portfolios',
      description: 'Exclusive aesthetic themes, bespoke author banners, featured masterworks, curated biographies, and prominent insider verified badges.',
      badge: 'Custom Identity',
      actionLabel: 'Customize Portfolio',
      onClick: () => setActiveInteractiveFeature(4),
    },
    {
      num: 5,
      title: 'Advanced Writer Analytics',
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      tagline: 'Unique Readers, Velocity & Engagement Trends',
      description: 'Real-time telemetry on chapter drop-off rates, reader dwell time, bookmark velocity, subscriber conversions, and reader retention curves.',
      badge: 'Real-Time Insights',
      actionLabel: 'View Analytics Dashboard',
      onClick: () => setActiveInteractiveFeature(5),
    },
    {
      num: 6,
      title: 'The Golden Library',
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      tagline: 'Curated Masterpieces, Serials & Author Interviews',
      description: 'Unlimited access to the classic serializations of James Clear, Morgan Housel, Robert Greene, and Robert Kiyosaki, plus exclusive author salons.',
      badge: 'All-Access Pass',
      actionLabel: 'Browse Golden Library',
      onClick: () => onSelectStory('story_atomic_habits'),
    },
    {
      num: 7,
      title: 'Advanced Reading Experience',
      icon: <Moon className="w-5 h-5 text-blue-600" />,
      tagline: 'Literature Fonts, Sepia/Dark Modes & Highlights',
      description: 'Immersive reading environment featuring adjustable typography, serif spacing, ambient sepia/night modes, synchronized highlights, and offline access.',
      badge: 'Pure Focus',
      actionLabel: 'Test Reading Settings',
      onClick: () => setActiveInteractiveFeature(7),
    },
    {
      num: 8,
      title: 'Audiobook & Read-Aloud Studio',
      icon: <Headphones className="w-5 h-5 text-emerald-600" />,
      tagline: 'High-Fidelity Text-to-Speech & Playback Speed',
      description: 'Naturalistic narration for all stories and serialized parts, 0.75x–1.5x speed control, background audio playback, and saved listening progress.',
      badge: 'Live Narration',
      actionLabel: isPlayingDemo ? 'Pause Audio Narration' : 'Listen to Live TTS Demo',
      onClick: handleToggleAudioDemo,
    },
    {
      num: 9,
      title: 'Personal Literary Curator',
      icon: <Compass className="w-5 h-5 text-rose-500" />,
      tagline: 'Mood-Based & Aesthetic Recommendations',
      description: 'Tailored recommendations grounded in your reading velocity, favorite literary aesthetics, philosophical themes, and serialized narrative depth.',
      badge: 'Smart Discovery',
      actionLabel: 'View Curated Feed',
      onClick: () => setActiveInteractiveFeature(9),
    },
    {
      num: 10,
      title: 'LEXORA Literary Arena',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      tagline: 'Quarterly Challenges Held Every 3 Months (4x/Year)',
      description: 'Compete for the 👑 Crown Badge, 1 Month Free Verification, 1-Week Home Page Hero Feature, and Official Winner Certificate ratified by CEO Shreyanshu Mishra.',
      badge: '4x Per Year',
      actionLabel: 'Enter Literary Arena',
      onClick: onOpenArena,
    },
    {
      num: 11,
      title: 'Writer’s Circle Pro',
      icon: <Users2 className="w-5 h-5 text-teal-600" />,
      tagline: 'Private Critique Salons & Peer Feedback',
      description: 'Join invitation-only writer circles, share private drafts for sentence-level annotation, receive constructive feedback, and collaborate.',
      badge: 'Private Salons',
      actionLabel: 'Explore Active Circles',
      onClick: () => setActiveInteractiveFeature(11),
    },
    {
      num: 12,
      title: 'Radiant Recognition',
      icon: <Star className="w-5 h-5 text-amber-400" />,
      tagline: 'Rising Writer of the Week & Editor’s Choice',
      description: 'Pure merit-based spotlights: Editor’s Choice curation, Rising Writer of the Week, and Community Favorite badges awarded on prose excellence.',
      badge: 'Merit Spotlights',
      actionLabel: 'View Spotlight Wall',
      onClick: () => setActiveInteractiveFeature(12),
    },
    {
      num: 13,
      title: 'Author’s Signature Card',
      icon: <PenTool className="w-5 h-5 text-purple-600" />,
      tagline: 'Digital Collectible Author Card with Wax Seal',
      description: 'Create and showcase your personalized author card complete with your pen name, literary motto, favorite genre, and featured masterpiece.',
      badge: 'Digital Wax Seal',
      actionLabel: 'Generate Author Card',
      onClick: () => setSignatureCardOpen(true),
    },
    {
      num: 14,
      title: 'Early Access',
      icon: <Rocket className="w-5 h-5 text-blue-500" />,
      tagline: 'Test Experimental Tools & Vote on Features',
      description: 'Direct influence on the platform roadmap. Test upcoming editor integrations, try beta typography engines, and vote on upcoming challenges.',
      badge: 'Roadmap Voting',
      actionLabel: 'Vote on Upcoming Tools',
      onClick: () => setActiveInteractiveFeature(14),
    },
    {
      num: 15,
      title: 'Priority Support',
      icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
      tagline: 'Direct VIP Queue with Founder & Engineering Team',
      description: 'Direct response channel to CEO Shreyanshu Mishra and the editorial engineering team for account guidance, inquiries, and publishing support.',
      badge: 'VIP Queue',
      actionLabel: 'Open Founder Channel',
      onClick: () => setActiveInteractiveFeature(15),
    },
    {
      num: 16,
      title: 'Premium Membership Benefits',
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      tagline: 'Unlimited AI Allowances, Themes & Full Backups',
      description: 'The complete key to LEXORA: Higher AI quotas, extended version history, bespoke serif theme packs, and full unthrottled authoring freedom.',
      badge: 'Complete Key',
      actionLabel: 'Join for ₹' + (settings.monthlySubscriptionPrice || 299) + '/mo',
      onClick: onOpenUpgradeModal,
    },
  ];

  return (
    <div
      className={`min-h-screen pb-28 transition-colors duration-200 ${
        isDark ? 'bg-[#06070a] text-slate-100' : 'bg-white text-[#182B32]'
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
      {/* Hero Banner */}
      <section
        className={`relative overflow-hidden pt-14 pb-16 px-6 md:px-12 border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-amber-500/20'
            : 'bg-[#F7FFFF] text-[#182B32] border-[#D9F5F5]'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          {onBack && (
            <div className="flex justify-start">
              <button
                onClick={onBack}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-200 border-amber-500/30'
                    : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          )}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs border ${
              isDark
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                : 'bg-[#E9FFFF] border-[#26F7F7]/60 text-[#182B32]'
            }`}
          >
            <Crown className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
            <span>LEXORA PREMIUM · RADIATED INK</span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight ${
              isDark ? 'text-white' : 'text-[#182B32]'
            }`}
          >
            Unlock Your Literary Universe 👑
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
            Beyond the Loop. Sixteen elite authoring, curating, and reading capabilities engineered for serious storytellers and devoted readers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenUpgradeModal}
              className={`px-8 py-4 rounded-full font-extrabold text-sm tracking-tight shadow-xl flex items-center gap-2 cursor-pointer transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-[#26f7db] hover:opacity-95 text-slate-950'
                  : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Unlock Everything for ₹{settings.monthlySubscriptionPrice || 299}/month</span>
            </button>

            <button
              onClick={onOpenArena}
              className={`px-6 py-4 rounded-full font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all border ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
                  : 'bg-white hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
              }`}
            >
              <Trophy className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
              <span>Explore Arena</span>
            </button>
          </div>
        </div>
      </section>

      {/* 16 Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-14 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00a8a8]">
            Comprehensive Suite
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
            The 16 Pillars of LEXORA Premium
          </h2>
          <p className={`text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Click any feature below to interact with its live capabilities, demos, and dedicated studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES_LIST.map(feat => (
            <div
              key={feat.num}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 group ${
                isDark
                  ? 'bg-[#0b0c10] border-slate-800 hover:border-amber-400 hover:shadow-xl'
                  : 'bg-white border-[#D9F5F5] hover:border-[#26F7F7] hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                      }`}
                    >
                      {feat.icon}
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        Pillar #{feat.num}
                      </span>
                      <h3 className={`font-bold text-base leading-snug ${isDark ? 'text-white group-hover:text-amber-300' : 'text-[#182B32] group-hover:text-[#008f8f]'}`}>
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isDark ? 'bg-slate-900 text-slate-300' : 'bg-[#E9FFFF] text-[#182B32]'
                    }`}
                  >
                    {feat.badge}
                  </span>
                </div>

                <p className={`text-xs font-semibold ${isDark ? 'text-amber-300/80' : 'text-[#182B32]/90'}`}>
                  {feat.tagline}
                </p>

                <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  {feat.description}
                </p>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-[#D9F5F5]'}`}>
                <button
                  onClick={feat.onClick}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                      : 'bg-[#E9FFFF] hover:bg-[#d6f8f8] text-[#182B32] border-[#26F7F7]/60'
                  }`}
                >
                  <span>{feat.actionLabel}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#26f7db]' : 'text-[#182B32]'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 1 Interactive Modal: Preserve My Voice */}
      {activeInteractiveFeature === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-4 ${
              isDark ? 'bg-[#0b0c10] border-slate-800 text-slate-100' : 'bg-white border-[#D9F5F5] text-[#182B32]'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-[#D9F5F5]'}`}>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  AI Writing Companion: Preserve My Voice
                </h3>
              </div>
              <button
                onClick={() => setActiveInteractiveFeature(null)}
                className={`text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#182B32]'}`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Unlike generic AI rewriters that produce sterile corporate prose, "Preserve My Voice" infuses visceral sensory detail and protects authorial idiosyncrasy.
            </p>

            <div className="space-y-2">
              <label className={`text-[11px] font-bold block ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                Synthetic Draft:
              </label>
              <textarea
                rows={2}
                value={voiceDemoOriginal}
                onChange={e => setVoiceDemoOriginal(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-serif ${
                  isDark
                    ? 'border-slate-800 bg-black text-slate-200'
                    : 'border-[#D9F5F5] bg-[#F7FFFF] text-[#182B32]'
                }`}
              />
            </div>

            <button
              onClick={handleTestPreserveVoice}
              className={`w-full py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                isDark ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#26f7db]' : 'text-[#182B32]'}`} />
              <span>Apply Preserve My Voice Restoration</span>
            </button>

            {voiceDemoPreserved && (
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  isDark ? 'bg-teal-950/40 border-teal-800 text-teal-200' : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                }`}
              >
                <span className="font-bold text-[#008f8f] block">Restored Organic Cadence:</span>
                <p className="font-serif italic leading-relaxed">"{voiceDemoPreserved}"</p>
                <span className="text-[10px] text-emerald-600 block pt-1 font-semibold">
                  ✓ AI Writing Rate reduced from 92% to 4% (Passes 85% rule)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature 11 Interactive Modal: Writer's Circles */}
      {activeInteractiveFeature === 11 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-4 ${
              isDark ? 'bg-[#0b0c10] border-slate-800 text-slate-100' : 'bg-white border-[#D9F5F5] text-[#182B32]'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-[#D9F5F5]'}`}>
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-teal-600" />
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>Writer’s Circle Pro</h3>
              </div>
              <button
                onClick={() => setActiveInteractiveFeature(null)}
                className={`text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#182B32]'}`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Private critique groups where authors share unpublished drafts before serialized release:
            </p>

            <div className="space-y-3">
              {writersCircles.map(c => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>{c.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isDark ? 'bg-teal-950 text-teal-300' : 'bg-[#E9FFFF] text-[#182B32] border border-[#26F7F7]/60'
                      }`}
                    >
                      {c.membersCount} Members
                    </span>
                  </div>
                  <p className={isDark ? 'text-slate-400' : 'text-[#64748B]'}>{c.description}</p>
                  <span className={`text-[10px] block pt-1 ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}>
                    Salon Leader: {c.leaderName} · {c.recentActivity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature 13: Author Signature Card Modal */}
      {signatureCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border-2 space-y-5 text-center relative ${
              isDark
                ? 'bg-gradient-to-b from-[#121008] to-[#050608] border-amber-400 text-amber-200'
                : 'bg-white border-[#26F7F7] text-[#182B32]'
            }`}
          >
            <button
              onClick={() => setSignatureCardOpen(false)}
              className={`absolute top-3.5 right-3.5 cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#182B32]'
              }`}
            >
              ✕
            </button>

            {/* Digital Wax Seal */}
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-serif font-extrabold text-xl shadow-md border-2 ${
                isDark
                  ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 text-slate-950 border-amber-200'
                  : 'bg-[#26F7F7] text-[#182B32] border-[#D9F5F5]'
              }`}
            >
              ⚜
            </div>

            <div className="space-y-1">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                  isDark ? 'text-amber-400' : 'text-[#008f8f]'
                }`}
              >
                Official Digital Author Signature
              </span>
              <h3 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                {currentUser?.displayName || 'Shreyanshu Mishra'}
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                @{currentUser?.username || 'shreyanshu'}
              </p>
            </div>

            <blockquote
              className={`p-3 rounded-xl border font-serif italic text-xs ${
                isDark ? 'bg-black/60 border-amber-400/30 text-slate-300' : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
              }`}
            >
              "Words are compass needles in infinite dark. Beyond the Loop."
            </blockquote>

            <div className={`text-[11px] space-y-1 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              <p><strong>Primary Genre:</strong> Philosophical Speculative &amp; Behavioral</p>
              <p><strong>Featured Masterpiece:</strong> "The Chronosphere of Florence"</p>
            </div>

            <div
              className={`pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                isDark ? 'border-amber-400/20 text-slate-400' : 'border-[#D9F5F5] text-[#64748B]'
              }`}
            >
              <span>LEXORA Seal: #LX-{Math.floor(10000 + Math.random() * 90000)}</span>
              <span className="text-emerald-600 font-bold">✓ Blockchain Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Our Promise Footer */}
      <section className="max-w-3xl mx-auto px-6 pt-10 text-center space-y-4">
        <div
          className={`p-8 rounded-3xl border space-y-4 transition-colors ${
            isDark ? 'bg-[#0b0c10] border-slate-800' : 'bg-[#F7FFFF] border-[#D9F5F5]'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#00a8a8]">
            Our Solemn Promise
          </span>
          <p
            className={`font-serif text-lg sm:text-xl italic leading-relaxed max-w-xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-[#182B32]'
            }`}
          >
            "LEXORA Premium empowers writers to create, improve, publish, and grow while giving readers a richer, more personalised literary experience."
          </p>
          <div className="pt-2 space-y-0.5">
            <p className={`font-sans font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
              LEXORA — Beyond the Loop
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}>
              Radiated Ink · Every Voice Has a Universe
            </p>
            <p className="font-serif italic text-sm pt-1">
              <span className={isDark ? 'font-light text-slate-400' : 'font-light text-[#64748B]'}>
                CEO &amp; Founder{' '}
              </span>
              <span className="font-bold text-[#008f8f]">Shreyanshu Mishra</span>
            </p>
          </div>
        </div>
      </section>

      {/* InkVault Modal */}
      <InkVaultModal
        isOpen={inkVaultOpen}
        onClose={() => setInkVaultOpen(false)}
        onOpenCreateStory={onOpenEditor}
      />
    </div>
  );
};
