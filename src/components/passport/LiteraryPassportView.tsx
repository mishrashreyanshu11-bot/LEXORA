import React, { useState } from 'react';
import { Story, StoryVisibilityMode, DedicationTemplateType } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { STANDARDIZED_LOCATIONS, getStatesForCountry, getCitiesForState } from '../../data/locations';
import { useTheme } from '../../context/ThemeContext';
import {
  Compass,
  Gift,
  Heart,
  Lock,
  Globe,
  MapPin,
  Sparkles,
  UserCheck,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Crown,
  Share2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  PackageOpen,
  MessageSquare,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface LiteraryPassportViewProps {
  onBack?: () => void;
  onSelectStory: (storyId: string) => void;
  onReadPart?: (storyId: string, partNumber: number) => void;
  onOpenUpgradeModal: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const LiteraryPassportView: React.FC<LiteraryPassportViewProps> = ({
  onBack,
  onSelectStory,
  onReadPart,
  onOpenUpgradeModal,
  onOpenAuth,
}) => {
  const { stories, createStory } = useStories();
  const { currentUser, isFounder, isPremiumSubscriber, allUsers } = useAuth();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'create' | 'received'>('create');
  const [publishingMode, setPublishingMode] = useState<StoryVisibilityMode>('private_recipient');

  // Mode A states (Private Recipient / For My Favourite One)
  const [recipientUsername, setRecipientUsername] = useState('');
  const [personalizedTitle, setPersonalizedTitle] = useState('');
  const [templateType, setTemplateType] = useState<DedicationTemplateType>('romantic');
  const [personalMessage, setPersonalMessage] = useState('');
  const [digitalLetter, setDigitalLetter] = useState('');
  const [customEndingMessage, setCustomEndingMessage] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);

  // Mode B states (Region-Specific)
  const [regionType, setRegionType] = useState<'world' | 'country' | 'state' | 'city'>('state');
  const [targetCountry, setTargetCountry] = useState('India');
  const [targetState, setTargetState] = useState('Odisha');
  const [targetCity, setTargetCity] = useState('Bhubaneswar');

  // Mode C states (Story Gifting)
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftUsername, setGiftUsername] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [giftTemplate, setGiftTemplate] = useState('birthday');
  const [scheduledDate, setScheduledDate] = useState('');

  // Story base fields
  const [storyTitle, setStoryTitle] = useState('');
  const [storySynopsis, setStorySynopsis] = useState('');
  const [storyCategory, setStoryCategory] = useState('Personal Stories');
  const [storyContent, setStoryContent] = useState('');

  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);
  const [giftModalStory, setGiftModalStory] = useState<Story | null>(null);
  const [unwrappingAnimation, setUnwrappingAnimation] = useState(false);

  // Template suggestions
  const templatePresets: Record<DedicationTemplateType, { title: string; defaultMsg: string }> = {
    romantic: {
      title: 'To My Eternal Muse',
      defaultMsg: 'Some stories belong to the entire cosmos, but this one was written exclusively for your heartbeat. Read slowly, knowing every word is yours.',
    },
    friendship: {
      title: 'To My Truest Companion',
      defaultMsg: 'In this vast spinning loop of life, few souls make the journey truly magical. Dedicated with gratitude for your unyielding camaraderie.',
    },
    birthday: {
      title: 'A Birthday Universe for You',
      defaultMsg: 'May this personalized tale mark the dawn of your most magnificent year yet. Happy Birthday from the depths of my imagination.',
    },
    anniversary: {
      title: 'To Years Beyond the Loop',
      defaultMsg: 'Celebrating another milestone of our shared chapters. Every milestone pales in comparison to the adventure of knowing you.',
    },
    family: {
      title: 'To the Roots of My World',
      defaultMsg: 'For the warmth, unconditional guidance, and sanctuary that only you have ever provided.',
    },
    appreciation: {
      title: 'In Deepest Gratitude',
      defaultMsg: 'A token of sincere esteem for the light and inspiration you have brought to my life and work.',
    },
    custom: {
      title: 'A Private Dedication',
      defaultMsg: '',
    },
  };

  const handleTemplateChange = (t: DedicationTemplateType) => {
    setTemplateType(t);
    setPersonalizedTitle(templatePresets[t].title);
    if (!personalMessage || personalMessage === templatePresets[templateType].defaultMsg) {
      setPersonalMessage(templatePresets[t].defaultMsg);
    }
  };

  const handleIssuePassportStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (!isPremiumSubscriber && !isFounder) {
      onOpenUpgradeModal();
      return;
    }

    if (!storyTitle.trim()) {
      alert('Please enter a story title.');
      return;
    }

    const created = createStory({
      title: storyTitle.trim(),
      synopsis: storySynopsis.trim() || 'A Literary Passport exclusive manuscript.',
      category: storyCategory,
      visibilityMode: publishingMode,
      privateRecipients: publishingMode === 'private_recipient'
        ? [{ username: recipientUsername.trim().replace(/^@+/, ''), accepted: false }]
        : undefined,
      privateDedication: publishingMode === 'private_recipient'
        ? {
            recipientName: recipientUsername.trim(),
            personalizedTitle,
            templateType,
            personalMessage,
            digitalLetter,
            customEndingMessage,
            allowComments,
            allowReactions,
          }
        : undefined,
      regionalTarget: publishingMode === 'regional'
        ? {
            type: regionType,
            country: targetCountry,
            state: targetState,
            city: targetCity,
          }
        : undefined,
      giftDetails: publishingMode === 'private_recipient' && giftRecipientName
        ? {
            recipientName: giftRecipientName,
            recipientUsername: giftUsername.trim().replace(/^@+/, ''),
            customDedication: personalMessage,
            greetingCard: giftCardMessage,
            templateType: giftTemplate,
            scheduledDeliveryAt: scheduledDate,
          }
        : undefined,
    });

    setIssueSuccess(`Literary Passport "${created.title}" issued successfully!`);
    setTimeout(() => setIssueSuccess(null), 4000);
    // Reset form
    setStoryTitle('');
    setStorySynopsis('');
    setStoryContent('');
  };

  // Find stories user has received or is recipient of
  const receivedStories = stories.filter(s => {
    if (!currentUser) return false;
    if (s.visibilityMode === 'private_recipient' && s.privateRecipients?.some(r => r.username.toLowerCase() === currentUser.username.toLowerCase())) {
      return true;
    }
    if (s.giftDetails && s.giftDetails.recipientUsername?.toLowerCase() === currentUser.username.toLowerCase()) {
      return true;
    }
    // Regional access check
    if (s.visibilityMode === 'regional' && s.regionalTarget) {
      const rt = s.regionalTarget;
      if (rt.type === 'world') return true;
      if (rt.type === 'country' && currentUser.country === rt.country) return true;
      if (rt.type === 'state' && currentUser.country === rt.country && currentUser.state === rt.state) return true;
      if (rt.type === 'city' && currentUser.country === rt.country && currentUser.city === rt.city) return true;
    }
    return false;
  });

  const handleOpenGift = (story: Story) => {
    setGiftModalStory(story);
    setUnwrappingAnimation(true);
    setTimeout(() => {
      setUnwrappingAnimation(false);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen pb-28 transition-colors ${
        isDark
          ? 'bg-[#06070a] text-slate-100 selection:bg-[#e5b95a]/30 selection:text-amber-100'
          : 'bg-[#ffffff] text-[#182B32] selection:bg-[#26F7F7]/30 selection:text-[#182B32]'
      }`}
    >
      {/* Header Banner */}
      <section
        style={
          !isDark
            ? {
                background:
                  'radial-gradient(ellipse at 75% 35%, rgba(38,247,247,0.19) 0%, rgba(207,255,255,0.13) 38%, transparent 75%), #FFFFFF',
              }
            : undefined
        }
        className={`relative overflow-hidden border-b pt-6 sm:pt-10 pb-10 transition-colors ${
          isDark
            ? 'border-amber-500/30 bg-gradient-to-b from-[#181208] via-[#090b10] to-[#06070a]'
            : 'border-[#D9F5F5]'
        }`}
      >
        <div
          className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-amber-500/10' : 'bg-[#26F7F7]/15'
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
                <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Literary Passport · Elite Publishing System</span>
              </div>
              <h1
                className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                  isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#fff4cc] via-[#ffd700] to-[#d4af37]'
                    : 'text-[#182B32]'
                }`}
              >
                LEXORA Literary Passport
              </h1>
              <p
                className={`text-xs sm:text-sm max-w-xl font-sans leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-[#64748B]'
                }`}
              >
                Publish beyond ordinary public walls. Privately dedicate manuscripts to your favourite one, deliver personalized story gifts with unwrap animations, or target audiences by country, state, and city.
              </p>
            </div>

            {/* Elite Badge Status */}
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
                <span
                  className={`font-serif font-bold text-xs block ${
                    isDark ? 'text-amber-200' : 'text-[#182B32]'
                  }`}
                >
                  {isFounder ? 'Founder Sovereign Passport' : isPremiumSubscriber ? 'Elite Passport Active' : 'Elite Feature'}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isDark ? 'text-slate-400' : 'text-[#64748B]'
                  }`}
                >
                  {isPremiumSubscriber || isFounder ? '3 Modes Unlocked' : 'Activate Elite to Issue'}
                </span>
              </div>
              {!isPremiumSubscriber && !isFounder && (
                <button
                  onClick={onOpenUpgradeModal}
                  className={`px-3.5 py-1.5 rounded-full font-serif font-bold text-xs shadow-md hover:scale-105 cursor-pointer ml-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
                      : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32]'
                  }`}
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`flex items-center gap-3 pt-2 border-t ${
              isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
            }`}
          >
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'create'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#26F7F7] text-[#182B32] shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-[#64748B] hover:text-[#182B32]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Issue New Passport Story</span>
            </button>

            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'received'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#26F7F7] text-[#182B32] shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-[#64748B] hover:text-[#182B32]'
              }`}
            >
              <PackageOpen className="w-3.5 h-3.5" />
              <span>Received Dedicated Stories ({receivedStories.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {issueSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{issueSuccess}</span>
          </div>
        )}

        {activeTab === 'create' ? (
          <div
            className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#101217] via-[#090b10] to-black border-amber-500/40'
                : 'bg-white border-[#D9F5F5] shadow-[0_10px_35px_rgba(38,247,247,0.1)]'
            }`}
          >
            {/* Mode Selector */}
            <div className="space-y-2">
              <label
                className={`font-serif font-bold text-sm block ${
                  isDark ? 'text-white' : 'text-[#182B32]'
                }`}
              >
                Select Literary Passport Publishing Mode:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPublishingMode('private_recipient')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                    publishingMode === 'private_recipient'
                      ? isDark
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-[#CFFFFF] border-[#26F7F7] text-[#182B32] shadow-md ring-1 ring-[#26F7F7]'
                      : isDark
                      ? 'bg-black/60 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#64748B] hover:text-[#182B32] hover:bg-[#E9FFFF]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-serif font-bold text-xs ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Mode A: Favourite One</span>
                  </div>
                  <p
                    className={`text-[11px] leading-snug ${
                      isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}
                  >
                    Private dedication exclusively for one person or group with personal letter.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishingMode('regional')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                    publishingMode === 'regional'
                      ? isDark
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-[#CFFFFF] border-[#26F7F7] text-[#182B32] shadow-md ring-1 ring-[#26F7F7]'
                      : isDark
                      ? 'bg-black/60 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#64748B] hover:text-[#182B32] hover:bg-[#E9FFFF]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-serif font-bold text-xs ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#0891b2]'}`} />
                    <span>Mode B: Regional Audience</span>
                  </div>
                  <p
                    className={`text-[11px] leading-snug ${
                      isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}
                  >
                    Target specific country, state/province, or city (e.g. Odisha or Bhubaneswar).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishingMode('public')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                    publishingMode === 'public'
                      ? isDark
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-[#CFFFFF] border-[#26F7F7] text-[#182B32] shadow-md ring-1 ring-[#26F7F7]'
                      : isDark
                      ? 'bg-black/60 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#64748B] hover:text-[#182B32] hover:bg-[#E9FFFF]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-serif font-bold text-xs ${
                      isDark ? 'text-amber-300' : 'text-[#182B32]'
                    }`}
                  >
                    <Gift className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#0891b2]'}`} />
                    <span>Mode C: Story Gifting</span>
                  </div>
                  <p
                    className={`text-[11px] leading-snug ${
                      isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}
                  >
                    Gift wrap manuscript with greeting card and unwrap animation.
                  </p>
                </button>
              </div>
            </div>

            <form onSubmit={handleIssuePassportStory} className="space-y-6 pt-2">
              {/* Story General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    className={`text-xs font-serif font-bold block ${
                      isDark ? 'text-slate-200' : 'text-[#182B32]'
                    }`}
                  >
                    Manuscript Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whispers in the Rain at Puri"
                    value={storyTitle}
                    onChange={e => setStoryTitle(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                        : 'bg-[#F7FFFF] border border-[#D9F5F5] text-[#182B32] placeholder-[#64748B] focus:border-[#26F7F7]'
                    }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className={`text-xs font-serif font-bold block ${
                      isDark ? 'text-slate-200' : 'text-[#182B32]'
                    }`}
                  >
                    Category
                  </label>
                  <select
                    value={storyCategory}
                    onChange={e => setStoryCategory(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs cursor-pointer focus:outline-hidden ${
                      isDark
                        ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                        : 'bg-[#F7FFFF] border border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                    }`}
                  >
                    <option value="Personal Stories" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>Personal Stories</option>
                    <option value="Romance" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>Romance</option>
                    <option value="Poetry" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>Poetry</option>
                    <option value="Serialized Literature & Philosophy" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>Philosophy</option>
                    <option value="Culture" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-[#182B32]'}>Culture</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className={`text-xs font-serif font-bold block ${
                    isDark ? 'text-slate-200' : 'text-[#182B32]'
                  }`}
                >
                  Manuscript Synopsis
                </label>
                <textarea
                  rows={2}
                  placeholder="A poetic summary of this personalized work..."
                  value={storySynopsis}
                  onChange={e => setStorySynopsis(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs resize-none focus:outline-hidden ${
                    isDark
                      ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                      : 'bg-[#F7FFFF] border border-[#D9F5F5] text-[#182B32] placeholder-[#64748B] focus:border-[#26F7F7]'
                  }`}
                />
              </div>

              {/* Mode A Specific Fields: For My Favourite One */}
              {publishingMode === 'private_recipient' && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-400/40'
                      : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 border-b pb-2 ${
                      isDark ? 'border-amber-400/20' : 'border-[#D9F5F5]'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <h4
                      className={`font-serif font-bold text-sm ${
                        isDark ? 'text-amber-200' : 'text-[#182B32]'
                      }`}
                    >
                      "For My Favourite One" Dedicated Settings
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        className={`text-xs font-serif font-bold block ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Recipient Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. shreyanshu or username"
                        value={recipientUsername}
                        onChange={e => setRecipientUsername(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                        }`}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`text-xs font-serif font-bold block ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Dedication Template
                      </label>
                      <select
                        value={templateType}
                        onChange={e => handleTemplateChange(e.target.value as any)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs cursor-pointer font-serif focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                        }`}
                      >
                        <option value="romantic">Romantic (Eternal Muse)</option>
                        <option value="friendship">Friendship (Truest Companion)</option>
                        <option value="birthday">Birthday Greeting</option>
                        <option value="anniversary">Anniversary Celebration</option>
                        <option value="family">Family &amp; Ancestral</option>
                        <option value="appreciation">Deepest Appreciation</option>
                        <option value="custom">Custom Dedication</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-xs font-serif font-bold block ${
                        isDark ? 'text-slate-200' : 'text-[#182B32]'
                      }`}
                    >
                      Personalized Dedication Title
                    </label>
                    <input
                      type="text"
                      value={personalizedTitle}
                      onChange={e => setPersonalizedTitle(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-serif focus:outline-hidden ${
                        isDark
                          ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                          : 'bg-white border border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-xs font-serif font-bold block ${
                        isDark ? 'text-slate-200' : 'text-[#182B32]'
                      }`}
                    >
                      Private Digital Letter
                    </label>
                    <textarea
                      rows={3}
                      value={personalMessage}
                      onChange={e => setPersonalMessage(e.target.value)}
                      placeholder="Write your private message or letter to your recipient..."
                      className={`w-full p-3 rounded-xl text-xs resize-none font-sans focus:outline-hidden ${
                        isDark
                          ? 'bg-black border border-amber-500/30 text-white focus:border-amber-400'
                          : 'bg-white border border-[#D9F5F5] text-[#182B32] placeholder-[#64748B] focus:border-[#26F7F7]'
                      }`}
                    />
                  </div>

                  <div
                    className={`flex items-center gap-6 text-xs ${
                      isDark ? 'text-slate-300' : 'text-[#64748B]'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowComments}
                        onChange={e => setAllowComments(e.target.checked)}
                        className={`rounded ${isDark ? 'accent-amber-400' : 'accent-[#26F7F7]'}`}
                      />
                      <span>Allow Private Recipient Comments</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowReactions}
                        onChange={e => setAllowReactions(e.target.checked)}
                        className={`rounded ${isDark ? 'accent-amber-400' : 'accent-[#26F7F7]'}`}
                      />
                      <span>Allow Heart &amp; Gold Reactions</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Mode B Specific Fields: Regional Targeting */}
              {publishingMode === 'regional' && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-400/40'
                      : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 border-b pb-2 ${
                      isDark ? 'border-amber-400/20' : 'border-[#D9F5F5]'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#0891b2]'}`} />
                    <h4
                      className={`font-serif font-bold text-sm ${
                        isDark ? 'text-amber-200' : 'text-[#182B32]'
                      }`}
                    >
                      Geographic Audience &amp; Regional Visibility
                    </h4>
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-[#64748B]'
                    }`}
                  >
                    Readers outside this chosen region will see a dignified regional passport lock instead of protected story content.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label
                        className={`text-[11px] font-bold block mb-1 ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Target Scope
                      </label>
                      <select
                        value={regionType}
                        onChange={e => setRegionType(e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-xl text-xs cursor-pointer focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                        }`}
                      >
                        <option value="city">Specific City</option>
                        <option value="state">Specific State / Province</option>
                        <option value="country">Specific Country</option>
                        <option value="world">Entire World</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`text-[11px] font-bold block mb-1 ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Country
                      </label>
                      <select
                        value={targetCountry}
                        onChange={e => {
                          const c = e.target.value;
                          setTargetCountry(c);
                          const states = getStatesForCountry(c);
                          const firstState = states[0]?.name || '';
                          setTargetState(firstState);
                          const cities = getCitiesForState(c, firstState);
                          setTargetCity(cities[0] || '');
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs cursor-pointer focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                        }`}
                      >
                        {STANDARDIZED_LOCATIONS.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {(regionType === 'state' || regionType === 'city') && (
                      <div>
                        <label
                          className={`text-[11px] font-bold block mb-1 ${
                            isDark ? 'text-slate-200' : 'text-[#182B32]'
                          }`}
                        >
                          State / Province
                        </label>
                        <select
                          value={targetState}
                          onChange={e => {
                            const s = e.target.value;
                            setTargetState(s);
                            const cities = getCitiesForState(targetCountry, s);
                            setTargetCity(cities[0] || '');
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs cursor-pointer focus:outline-hidden ${
                            isDark
                              ? 'bg-black border border-amber-500/30 text-white'
                              : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                          }`}
                        >
                          {getStatesForCountry(targetCountry).map(s => (
                            <option key={s.code} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {regionType === 'city' && (
                      <div>
                        <label
                          className={`text-[11px] font-bold block mb-1 ${
                            isDark ? 'text-slate-200' : 'text-[#182B32]'
                          }`}
                        >
                          City
                        </label>
                        <select
                          value={targetCity}
                          onChange={e => setTargetCity(e.target.value)}
                          className={`w-full px-3 py-2 rounded-xl text-xs cursor-pointer focus:outline-hidden ${
                            isDark
                              ? 'bg-black border border-amber-500/30 text-white'
                              : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                          }`}
                        >
                          {getCitiesForState(targetCountry, targetState).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode C Specific Fields: Story Gifting */}
              {publishingMode === 'public' && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-400/40'
                      : 'bg-[#F7FFFF] border-[#D9F5F5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 border-b pb-2 ${
                      isDark ? 'border-amber-400/20' : 'border-[#D9F5F5]'
                    }`}
                  >
                    <Gift className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#0891b2]'}`} />
                    <h4
                      className={`font-serif font-bold text-sm ${
                        isDark ? 'text-amber-200' : 'text-[#182B32]'
                      }`}
                    >
                      Personalized Story Gift Packaging
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        className={`text-xs font-serif font-bold block ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={giftRecipientName}
                        onChange={e => setGiftRecipientName(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`text-xs font-serif font-bold block ${
                          isDark ? 'text-slate-200' : 'text-[#182B32]'
                        }`}
                      >
                        Recipient Username (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. priya_reads"
                        value={giftUsername}
                        onChange={e => setGiftUsername(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-hidden ${
                          isDark
                            ? 'bg-black border border-amber-500/30 text-white'
                            : 'bg-white border border-[#D9F5F5] text-[#182B32]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-xs font-serif font-bold block ${
                        isDark ? 'text-slate-200' : 'text-[#182B32]'
                      }`}
                    >
                      Greeting Card Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Happy birthday/anniversary! A special story crafted just for you..."
                      value={giftCardMessage}
                      onChange={e => setGiftCardMessage(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs resize-none focus:outline-hidden ${
                        isDark
                          ? 'bg-black border border-amber-500/30 text-white'
                          : 'bg-white border border-[#D9F5F5] text-[#182B32] placeholder-[#64748B]'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_20px_rgba(243,186,56,0.35)]'
                    : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                }`}
              >
                <Compass className="w-4 h-4 stroke-[2.2]" />
                <span>Issue &amp; Seal Literary Passport</span>
              </button>
            </form>
          </div>
        ) : (
          /* Received Tab */
          <div className="space-y-4">
            <h3
              className={`font-serif font-bold text-lg flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-[#182B32]'
              }`}
            >
              <PackageOpen className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-[#0891b2]'}`} />
              <span>Stories Dedicated or Gifted to You</span>
            </h3>

            {receivedStories.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border space-y-3 ${
                  isDark ? 'bg-black/40 border-amber-500/20' : 'bg-[#F7FFFF] border-[#D9F5F5]'
                }`}
              >
                <Gift className={`w-10 h-10 mx-auto ${isDark ? 'text-amber-400/50' : 'text-[#0891b2]/60'}`} />
                <p className={`font-serif text-base ${isDark ? 'text-amber-300' : 'text-[#182B32]'}`}>
                  No dedicated passports or gifts received yet
                </p>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  When an author dedicates a story to you or targets your city ({currentUser?.city || 'Bhubaneswar'}), it will appear in your private passport vault.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {receivedStories.map(story => (
                  <div
                    key={story.id}
                    className={`p-5 rounded-3xl border-2 shadow-xl space-y-4 text-left transition-all ${
                      isDark
                        ? 'bg-gradient-to-br from-[#141008] to-black border-amber-500/40'
                        : 'bg-white border-[#D9F5F5] shadow-[0_4px_20px_rgba(38,247,247,0.08)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                            isDark
                              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                              : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#0891b2]'
                          }`}
                        >
                          {story.visibilityMode === 'private_recipient' ? (
                            <Heart className="w-4 h-4 text-rose-500" />
                          ) : (
                            <Gift className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#0891b2]'}`} />
                          )}
                        </div>
                        <div>
                          <span
                            className={`text-[10px] font-mono uppercase font-bold block ${
                              isDark ? 'text-amber-400' : 'text-[#0891b2]'
                            }`}
                          >
                            {story.privateDedication?.templateType || 'Exclusive Passport'}
                          </span>
                          <h4
                            className={`font-serif font-bold text-sm ${
                              isDark ? 'text-white' : 'text-[#182B32]'
                            }`}
                          >
                            {story.title}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenGift(story)}
                        className={`px-3 py-1.5 rounded-full font-serif font-bold text-[11px] shadow-sm hover:scale-105 cursor-pointer ${
                          isDark
                            ? 'bg-gradient-to-r from-amber-400 to-[#f3ba38] text-black'
                            : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32]'
                        }`}
                      >
                        Open Gift
                      </button>
                    </div>

                    {story.privateDedication?.personalMessage && (
                      <div
                        className={`p-3 rounded-xl border text-xs italic font-serif ${
                          isDark
                            ? 'bg-black/60 border-amber-500/20 text-amber-200/90'
                            : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32]'
                        }`}
                      >
                        "{story.privateDedication.personalMessage}"
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 font-mono text-[11px]">
                      <span>By {story.authorName}</span>
                      <button
                        onClick={() => {
                          if (onReadPart) {
                            onReadPart(story.id, 1);
                          } else {
                            onSelectStory(story.id);
                          }
                        }}
                        className="text-amber-300 hover:text-white font-serif font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Begin Reading</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gift Opening Animation Modal */}
      {giftModalStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1c1404] via-[#090b10] to-black rounded-3xl border-2 border-amber-400/80 p-8 text-center space-y-6 shadow-2xl">
            {unwrappingAnimation ? (
              <div className="py-12 space-y-4 animate-pulse">
                <Gift className="w-16 h-16 text-amber-300 mx-auto animate-bounce" />
                <p className="font-serif font-bold text-lg text-amber-200">
                  Unwrapping your digital literary gift...
                </p>
              </div>
            ) : (
              <>
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(243,186,56,0.5)]">
                  <Heart className="w-8 h-8 text-rose-400" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Official Passport Gift Presentation
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {giftModalStory.title}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-serif italic">
                    {giftModalStory.privateDedication?.personalizedTitle || 'Dedicated with Highest Esteem'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 text-left space-y-2 text-xs font-sans text-slate-200 leading-relaxed">
                  <p>{giftModalStory.privateDedication?.personalMessage || giftModalStory.synopsis}</p>
                  <p className="text-[10px] text-amber-400 font-mono text-right pt-1">
                    — From {giftModalStory.authorName}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const id = giftModalStory.id;
                      setGiftModalStory(null);
                      if (onReadPart) {
                        onReadPart(id, 1);
                      } else {
                        onSelectStory(id);
                      }
                    }}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-md"
                  >
                    Read Dedicated Story
                  </button>

                  <button
                    onClick={() => setGiftModalStory(null)}
                    className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-serif cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
