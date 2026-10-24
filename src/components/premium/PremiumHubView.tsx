import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { VerifiedBadge, FounderBadge, CrownBadge } from '../common/FounderBadge';
import { InkVaultModal } from '../inkvault/InkVaultModal';
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
} from 'lucide-react';

interface PremiumHubViewProps {
  onOpenUpgradeModal: () => void;
  onOpenEditor: () => void;
  onOpenArena: () => void;
  onOpenInkVault: () => void;
  onSelectStory: (storyId: string) => void;
}

export const PremiumHubView: React.FC<PremiumHubViewProps> = ({
  onOpenUpgradeModal,
  onOpenEditor,
  onOpenArena,
  onOpenInkVault,
  onSelectStory,
}) => {
  const { settings, writersCircles, stories } = useStories();
  const { currentUser, isFounder, isPremiumSubscriber } = useAuth();

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
    <div className="min-h-screen bg-white text-slate-900 pb-28">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-16 px-6 md:px-12 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-md">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>LEXORA PREMIUM · RADIATED INK</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Unlock Your Literary Universe 👑
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Beyond the Loop. Sixteen elite authoring, curating, and reading capabilities engineered for serious storytellers and devoted readers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenUpgradeModal}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-[#26f7db] hover:opacity-95 text-slate-950 font-extrabold text-sm tracking-tight shadow-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <Crown className="w-4 h-4" />
              <span>Unlock Everything for ₹{settings.monthlySubscriptionPrice || 299}/month</span>
            </button>

            <button
              onClick={onOpenArena}
              className="px-6 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Explore Arena</span>
            </button>
          </div>
        </div>
      </section>

      {/* 16 Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-14 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#05c4c4]">
            Comprehensive Suite
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950">
            The 16 Pillars of LEXORA Premium
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Click any feature below to interact with its live capabilities, demos, and dedicated studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES_LIST.map(feat => (
            <div
              key={feat.num}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {feat.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Pillar #{feat.num}
                      </span>
                      <h3 className="font-bold text-base text-slate-950 group-hover:text-amber-900 leading-snug">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {feat.badge}
                  </span>
                </div>

                <p className="text-xs font-semibold text-amber-900/80">
                  {feat.tagline}
                </p>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {feat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={feat.onClick}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{feat.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#26f7db]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 1 Interactive Modal: Preserve My Voice */}
      {activeInteractiveFeature === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-950">AI Writing Companion: Preserve My Voice</h3>
              </div>
              <button onClick={() => setActiveInteractiveFeature(null)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              Unlike generic AI rewriters that produce sterile corporate prose, "Preserve My Voice" infuses visceral sensory detail and protects authorial idiosyncrasy.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">Synthetic Draft:</label>
              <textarea
                rows={2}
                value={voiceDemoOriginal}
                onChange={e => setVoiceDemoOriginal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-serif"
              />
            </div>

            <button
              onClick={handleTestPreserveVoice}
              className="w-full py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#26f7db]" />
              <span>Apply Preserve My Voice Restoration</span>
            </button>

            {voiceDemoPreserved && (
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                <span className="font-bold text-teal-900 block">Restored Organic Cadence:</span>
                <p className="font-serif italic leading-relaxed">"{voiceDemoPreserved}"</p>
                <span className="text-[10px] text-teal-700 block pt-1">
                  ✓ AI Writing Rate reduced from 92% to 4% (Passes 85% rule)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature 11 Interactive Modal: Writer's Circles */}
      {activeInteractiveFeature === 11 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-950">Writer’s Circle Pro</h3>
              </div>
              <button onClick={() => setActiveInteractiveFeature(null)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              Private critique groups where authors share unpublished drafts before serialized release:
            </p>

            <div className="space-y-3">
              {writersCircles.map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                      {c.membersCount} Members
                    </span>
                  </div>
                  <p className="text-slate-600">{c.description}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gradient-to-b from-[#fffef5] to-[#fffbf0] rounded-3xl p-8 shadow-2xl border-4 border-double border-amber-400/60 space-y-5 text-center relative animate-fade-in">
            <button
              onClick={() => setSignatureCardOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            {/* Digital Wax Seal */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 mx-auto flex items-center justify-center text-slate-950 font-serif font-extrabold text-xl shadow-md border-2 border-amber-200">
              ⚜
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-800">
                Official Digital Author Signature
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-950">
                {currentUser?.displayName || 'Shreyanshu Mishra'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                @{currentUser?.username || 'shreyanshu'}
              </p>
            </div>

            <blockquote className="p-3 bg-white/80 rounded-xl border border-amber-300/50 font-serif italic text-xs text-slate-700">
              "Words are compass needles in infinite dark. Beyond the Loop."
            </blockquote>

            <div className="text-[11px] text-slate-600 space-y-1">
              <p><strong>Primary Genre:</strong> Philosophical Speculative &amp; Behavioral</p>
              <p><strong>Featured Masterpiece:</strong> "The Chronosphere of Florence"</p>
            </div>

            <div className="pt-2 border-t border-amber-300/40 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>LEXORA Seal: #LX-{Math.floor(10000 + Math.random() * 90000)}</span>
              <span className="text-teal-700 font-bold">✓ Blockchain Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Our Promise Footer */}
      <section className="max-w-3xl mx-auto px-6 pt-10 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#05c4c4]">
            Our Solemn Promise
          </span>
          <p className="font-serif text-lg sm:text-xl italic text-slate-800 leading-relaxed max-w-xl mx-auto">
            "LEXORA Premium empowers writers to create, improve, publish, and grow while giving readers a richer, more personalised literary experience."
          </p>
          <div className="pt-2 space-y-0.5">
            <p className="font-sans font-bold text-sm text-slate-900">
              LEXORA — Beyond the Loop
            </p>
            <p className="text-xs text-slate-500">
              Radiated Ink · Every Voice Has a Universe
            </p>
            <p className="font-serif italic text-sm pt-1">
              <span className="font-light text-slate-700">CEO &amp; Founder </span>
              <span style={{ color: '#0bb39c' }} className="font-bold">Shreyanshu Mishra</span>
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
