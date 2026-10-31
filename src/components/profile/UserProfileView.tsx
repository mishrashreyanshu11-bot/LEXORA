import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_AVATAR, Story } from '../../types';
import { FounderBadge, VerifiedBadge, CrownBadge } from '../common/FounderBadge';
import { useTheme } from '../../context/ThemeContext';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Sparkles,
  Sliders,
  ShieldCheck,
  FileText,
  LogOut,
  Edit3,
  Bookmark,
  CheckCircle,
  ExternalLink,
  Camera,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Instagram,
  Crown,
  Headphones,
  Play,
  Globe,
  Award,
  Layers,
  LifeBuoy,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface UserProfileViewProps {
  onBack?: () => void;
  onOpenAdmin: () => void;
  onOpenUpgradeModal: () => void;
  onOpenLegal: () => void;
  onSelectStory: (storyId: string) => void;
  onReadPart?: (storyId: string, partNumber: number) => void;
  onOpenHelpCenter?: () => void;
  onOpenCommunity?: () => void;
  onOpenCreateStory?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBack,
  onOpenAdmin,
  onOpenUpgradeModal,
  onOpenLegal,
  onSelectStory,
  onReadPart,
  onOpenHelpCenter,
  onOpenCommunity,
  onOpenCreateStory,
  onOpenAuth,
}) => {
  const {
    currentUser,
    isFounder,
    isPremiumSubscriber,
    logout,
    updateProfile,
  } = useAuth();

  const { isDark } = useTheme();

  const { stories, purchasedStoryIds, requestStoryFeature, updateStory } = useStories();
  const [featureModalStory, setFeatureModalStory] = useState<Story | null>(null);
  const [featureCategoryChoice, setFeatureCategoryChoice] = useState('Featured Stories');
  const [featureNotice, setFeatureNotice] = useState<string | null>(null);
  const { uiLanguage, readingLanguage, writingLanguage, setUiLanguage, languages } = useLanguage();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editDobOpen, setEditDobOpen] = useState(false);
  const [dobInput, setDobInput] = useState(currentUser?.dob || '2000-10-26');
  const [dobError, setDobError] = useState<string | null>(null);
  const [dobSuccess, setDobSuccess] = useState<string | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState(currentUser?.displayName || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [instagramInput, setInstagramInput] = useState(currentUser?.instagramHandle || '');
  const [twitterInput, setTwitterInput] = useState(currentUser?.socialLinks?.twitter || '');
  const [avatarInput, setAvatarInput] = useState(currentUser?.avatar || DEFAULT_AVATAR);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const { updateDob, userAge } = useAuth();

  // If not authenticated, render the dedicated Guest Visitor profile screen
  if (!currentUser) {
    return (
      <div
        className={`min-h-screen pb-28 px-4 sm:px-6 py-8 transition-colors ${
          isDark ? 'bg-[#06070a] text-slate-100' : 'bg-white text-[#182B32]'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {onBack && (
            <button
              onClick={onBack}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold cursor-pointer transition-all hover:scale-105 shadow-sm border ${
                isDark
                  ? 'bg-black/70 hover:bg-black border-amber-500/40 text-amber-200'
                  : 'bg-white hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#182B32]'}`} />
              <span>Back</span>
            </button>
          )}

          <div
            className={`p-6 sm:p-8 rounded-3xl border text-center space-y-5 shadow-xl ${
              isDark
                ? 'bg-gradient-to-b from-[#12131b] via-[#090b10] to-[#06070a] border-amber-500/30'
                : 'bg-[#F7FFFF] border-[#26F7F7]'
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/40 border-2 border-dashed border-amber-400/40 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-slate-400" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                Guest Visitor Session
              </span>
              <h2 className="text-2xl font-serif font-bold text-white">
                Guest Visitor
              </h2>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                You are currently exploring LEXORA in anonymous preview mode. To publish original stories, unlock complete chapter serials, save audiobooks, or access the Golden Library, sign in or register your permanent account.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Sign In to Account
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full border text-xs font-serif font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-black/60 hover:bg-white/5 border-amber-500/40 text-amber-200'
                    : 'bg-white hover:bg-slate-50 border-[#26F7F7] text-cyan-800'
                }`}
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const purchasedStories = stories.filter(s => purchasedStoryIds.includes(s.id));
  const audioHistory = currentUser.audiobookHistory || [];

  // My Written Stories & Manuscripts
  const myWrittenStories = stories.filter(s =>
    s.authorId === currentUser.id ||
    s.authorUsername?.toLowerCase() === currentUser.username?.toLowerCase() ||
    (isFounder && (s.id === 'story_beyond_the_loop' || s.authorId === 'usr_founder_shreyanshu'))
  );

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAvatar = event.target.result as string;
          setAvatarInput(newAvatar);
          updateProfile({ avatar: newAvatar });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInsta = instagramInput.trim().replace(/^@+/, '');
    updateProfile({
      displayName: displayNameInput.trim() || currentUser.displayName,
      bio: bioInput.trim(),
      instagramHandle: cleanInsta ? `@${cleanInsta}` : undefined,
      avatar: avatarInput.trim() || DEFAULT_AVATAR,
      socialLinks: {
        ...currentUser.socialLinks,
        twitter: twitterInput.trim() || undefined,
        instagram: cleanInsta ? `https://instagram.com/${cleanInsta}` : undefined,
      },
    });
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setEditProfileOpen(false);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen pb-28 transition-colors duration-200 ${
        isDark ? 'bg-[#06070a] text-slate-100 selection:bg-[#e5b95a]/30 selection:text-amber-100' : 'bg-white text-[#182B32] selection:bg-[#CFFFFF] selection:text-[#182B32]'
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
      {/* Hidden file input for fast avatar change */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Profile Hero Card */}
      <div
        className={`relative py-6 sm:py-10 px-4 sm:px-6 overflow-hidden border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#12131b] via-[#090b10] to-[#06070a] border-amber-500/25'
            : 'bg-[#F7FFFF] border-[#D9F5F5]'
        }`}
      >
        <div
          className={`absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-amber-500/10' : 'bg-[#26F7F7]/15'
          }`}
        />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          {onBack && (
            <button
              onClick={onBack}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold cursor-pointer transition-all hover:scale-105 shadow-sm border ${
                isDark
                  ? 'bg-black/70 hover:bg-black border-amber-500/40 text-amber-200'
                  : 'bg-white hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#182B32]'}`} />
              <span>Back</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-1">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={currentUser.avatar || DEFAULT_AVATAR}
                  alt={currentUser.displayName}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-3 transition-all ${
                    isDark
                      ? 'ring-amber-400/80 shadow-[0_0_20px_rgba(243,186,56,0.35)] bg-black'
                      : 'ring-[#26F7F7] shadow-[0_0_20px_rgba(38,247,247,0.25)] bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  title="Change profile picture"
                  className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md hover:scale-110 transition-all cursor-pointer border ${
                    isDark
                      ? 'bg-black text-amber-300 hover:bg-amber-950/60 border-amber-400/60'
                      : 'bg-white text-[#182B32] hover:bg-[#E9FFFF] border-[#26F7F7]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1
                    className={`text-2xl sm:text-3xl font-extrabold font-serif tracking-tight ${
                      isDark ? 'text-white' : 'text-[#182B32]'
                    }`}
                  >
                    {currentUser.displayName}
                  </h1>
                  {currentUser.isVerified || currentUser.isFounder ? (
                    <VerifiedBadge size="md" />
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span
                    className={`font-mono font-semibold ${
                      isDark ? 'text-amber-400/80' : 'text-[#64748B]'
                    }`}
                  >
                    @{currentUser.username}
                  </span>

                  {currentUser.instagramHandle && (
                    <a
                      href={`https://instagram.com/${currentUser.instagramHandle.replace(/^@+/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-300 font-mono text-[11px] hover:bg-pink-500/20 transition-colors"
                      title="Verified Instagram Handle"
                    >
                      <Instagram className="w-3 h-3 text-pink-500" />
                      <span>{currentUser.instagramHandle}</span>
                    </a>
                  )}

                  {isPremiumSubscriber && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isDark
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                          : 'bg-[#E9FFFF] border-[#26F7F7]/60 text-[#182B32]'
                      }`}
                    >
                      <Crown className={`w-3 h-3 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
                      <span>Elite Passholder</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditProfileOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-[#E9FFFF] hover:bg-[#d6f8f8] border-[#26F7F7] text-[#182B32]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile &amp; Bio</span>
              </button>

              <button
                onClick={logout}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400'
                    : 'border-[#D9F5F5] hover:bg-rose-50 hover:text-rose-600 text-[#64748B]'
                }`}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Bio */}
          {currentUser.bio ? (
            <p
              className={`text-xs sm:text-sm italic font-serif leading-relaxed max-w-2xl p-3 rounded-2xl border ${
                isDark
                  ? 'text-slate-300 bg-black/40 border-amber-500/20'
                  : 'text-[#182B32] bg-white border-[#D9F5F5]'
              }`}
            >
              "{currentUser.bio}"
            </p>
          ) : (
            <div className={`text-xs flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              <span>No bio added yet.</span>
              <button
                onClick={() => setEditProfileOpen(true)}
                className={`hover:underline cursor-pointer font-semibold ${
                  isDark ? 'text-amber-300' : 'text-[#182B32]'
                }`}
              >
                + Add your bio &amp; Instagram handle
              </button>
            </div>
          )}

          {/* Account Details Badges (DOB & Verification) */}
          <div
            className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs transition-colors ${
              isDark
                ? 'bg-black/70 border-amber-500/25'
                : 'bg-white border-[#D9F5F5] shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400/70' : 'text-[#26F7F7]'}`} />
              <div className="truncate">
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  Email Address
                </span>
                <span className={`font-mono font-bold truncate block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <Calendar className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
                <div>
                  <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    DOB &amp; Age ({userAge} yrs)
                  </span>
                  <span className={`font-mono font-bold ${isDark ? 'text-amber-200' : 'text-[#182B32]'}`}>
                    {currentUser.dob}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDobInput(currentUser.dob);
                  setDobError(null);
                  setDobSuccess(null);
                  setEditDobOpen(true);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                  isDark
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                    : 'bg-[#E9FFFF] hover:bg-[#d5f7f7] border-[#26F7F7] text-[#182B32]'
                }`}
              >
                Edit DOB
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  Age Certification
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                  {userAge >= 18 ? 'Certified 18+ (All Works)' : userAge >= 16 ? 'Certified 16+' : 'Certified 10+'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* ==================================================================== */}
        {/* SUBSCRIBER PHOTO / ELITE PASS (HIGH DEFINITION & CLEARLY VISIBLE) */}
        {/* Requirement: "Also make this Photo clearly Visible for Subscribers make it well defined and clearly visible" */}
        {/* ==================================================================== */}
        <div
          className={`p-6 sm:p-8 rounded-3xl space-y-5 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#121008] via-[#08090d] to-black border-2 border-amber-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(243,186,56,0.25)]'
              : 'bg-white border border-[#D9F5F5] shadow-[0_10px_30px_rgba(38,247,247,0.12),0_2px_8px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b ${
              isDark ? 'border-amber-500/25' : 'border-[#D9F5F5]'
            }`}
          >
            <div className="space-y-1">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isDark
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-[#E9FFFF] border-[#26F7F7]/60 text-[#182B32]'
                }`}
              >
                <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
                <span>LEXORA VIP Elite Passholder Card</span>
              </div>
              <h3
                className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-[#182B32]'
                }`}
              >
                Your Digital Lexora Elite Card
              </h3>
              <p className={`text-xs font-sans ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                Permanent engraved identity with 40% OFF activation, Golden Library unlocks, and Literary Passport certificates.
              </p>
            </div>

            {isPremiumSubscriber ? (
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  isDark
                    ? 'text-black bg-gradient-to-r from-[#ffd700] to-[#f3ba38] shadow-[0_0_12px_rgba(243,186,56,0.4)]'
                    : 'text-[#182B32] bg-[#26F7F7] shadow-xs'
                }`}
              >
                Active Tier · Verified
              </span>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className={`px-4 py-2 rounded-xl text-xs font-serif font-bold cursor-pointer hover:scale-105 transition-all shadow-md ${
                  isDark
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
                    : 'bg-[#26F7F7] hover:bg-[#15e0e0] text-[#182B32]'
                }`}
              >
                Activate VIP Pass (₹299/mo)
              </button>
            )}
          </div>

          {/* Crisply Defined, Full-Width Visible Elite Card Photo */}
          <div className="relative flex justify-center py-2">
            <div
              className={`relative w-full max-w-lg rounded-3xl overflow-hidden border-2 transition-all group ${
                isDark
                  ? 'border-amber-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(243,186,56,0.3)] bg-black'
                  : 'border-[#D9F5F5] shadow-[0_15px_35px_rgba(38,247,247,0.15)] bg-white'
              }`}
            >
              <img
                src="/assets/aistudio/B30148B8-E423-4669-A33E-156E8E761156_4ad88869.png"
                alt="Personalized Digital Lexora Elite Card - Clearly Visible"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div
                className={`absolute inset-0 ring-1 ring-inset rounded-3xl pointer-events-none ${
                  isDark ? 'ring-amber-400/40' : 'ring-[#26F7F7]/40'
                }`}
              />

              {/* Personalization Overlay badge on top of photo */}
              <div
                className={`absolute bottom-4 left-4 right-4 p-3 rounded-2xl backdrop-blur-md border flex items-center justify-between ${
                  isDark
                    ? 'bg-black/80 border-amber-400/50'
                    : 'bg-white/90 border-[#26F7F7]'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-mono block ${
                      isDark ? 'text-amber-400' : 'text-[#64748B]'
                    }`}
                  >
                    Cardholder Name
                  </span>
                  <p
                    className={`font-serif font-bold text-sm sm:text-base tracking-wide truncate ${
                      isDark ? 'text-white' : 'text-[#182B32]'
                    }`}
                  >
                    {currentUser.displayName}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[9px] uppercase tracking-widest font-mono block ${
                      isDark ? 'text-amber-400/80' : 'text-[#64748B]'
                    }`}
                  >
                    Status
                  </span>
                  <span
                    className={`text-xs font-serif font-bold ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  >
                    {isPremiumSubscriber ? 'VIP ELITE ACTIVE' : 'PREVIEW READY'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MY LISTENING LIBRARY (LEXORA VOICE AUDIOBOOK SYSTEM) */}
        {/* ==================================================================== */}
        <div
          className={`p-6 rounded-3xl border space-y-4 shadow-sm transition-colors ${
            isDark ? 'bg-black/70 border-amber-500/30' : 'bg-white border-[#D9F5F5]'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className={`w-5 h-5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
              <div>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  My Listening Library · LEXORA Voice
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-amber-400/80' : 'text-[#64748B]'}`}>
                  Where Words Find Their Voice · Synchronized Narrations
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              {audioHistory.length} Titles
            </span>
          </div>

          {audioHistory.length === 0 ? (
            <div
              className={`p-6 text-center space-y-2 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/5' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <Headphones className={`w-8 h-8 mx-auto ${isDark ? 'text-amber-400/60' : 'text-[#26F7F7]'}`} />
              <p className={`text-xs font-serif ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                You haven't listened to any audiobooks yet.
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Open any chapter and tap the headphones to listen with LEXORA Voice.
              </p>
              <button
                onClick={() => onSelectStory('story_beyond_the_loop')}
                className={`mt-2 px-4 py-2 rounded-full text-xs font-serif font-semibold cursor-pointer border ${
                  isDark
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-200'
                    : 'bg-[#E9FFFF] hover:bg-[#d6f8f8] border-[#26F7F7] text-[#182B32]'
                }`}
              >
                Listen to "Beyond the Loop" Audiobook
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {audioHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:border-amber-500/40'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] hover:border-[#26F7F7]'
                  }`}
                >
                  <img
                    src={item.coverImage}
                    alt={item.storyTitle}
                    className={`w-12 h-16 object-cover rounded-xl shrink-0 border ${
                      isDark ? 'border-amber-500/30' : 'border-[#D9F5F5]'
                    }`}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`font-serif font-bold text-xs truncate ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                      {item.storyTitle}
                    </p>
                    <p className={`text-[11px] font-mono truncate ${isDark ? 'text-amber-400' : 'text-[#64748B]'}`}>
                      {item.partTitle} · {item.speed}x · {item.voice}
                    </p>
                    {/* Progress Bar */}
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-[#D9F5F5]'}`}>
                      <div
                        className={`h-full rounded-full ${
                          isDark ? 'bg-gradient-to-r from-amber-400 to-[#ffd700]' : 'bg-[#26F7F7]'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onReadPart) {
                        onReadPart(item.storyId, item.partNumber);
                      } else {
                        onSelectStory(item.storyId);
                      }
                    }}
                    className={`p-2 rounded-full shrink-0 cursor-pointer ${
                      isDark
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                        : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
                    }`}
                    title="Resume Audiobook"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* MY WRITTEN WORKS & PUBLISHED MANUSCRIPTS */}
        {/* ==================================================================== */}
        <div
          className={`p-6 rounded-3xl border space-y-4 shadow-sm transition-colors ${
            isDark ? 'bg-black/70 border-amber-500/30' : 'bg-white border-[#D9F5F5]'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className={`w-5 h-5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
              <div>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  My Written Works &amp; Published Manuscripts
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-amber-400/80' : 'text-[#64748B]'}`}>
                  Permanent Archive of Your Serialized Stories on LEXORA
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                  : 'text-[#182B32] bg-[#E9FFFF] border-[#26F7F7]'
              }`}
            >
              {myWrittenStories.length} Published
            </span>
          </div>

          {myWrittenStories.length === 0 ? (
            <div
              className={`p-6 text-center space-y-2 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/5' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <BookOpen className={`w-8 h-8 mx-auto ${isDark ? 'text-amber-400/60' : 'text-[#26F7F7]'}`} />
              <p className={`text-xs font-serif ${isDark ? 'text-slate-300' : 'text-[#182B32]'}`}>
                You haven't published any stories or poems yet.
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Create and publish your first piece in the Writing Studio to share your voice beyond the loop.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {myWrittenStories.map(story => (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex gap-3.5 cursor-pointer group ${
                    isDark
                      ? 'bg-white/5 border-amber-500/25 hover:border-amber-400/60'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] hover:border-[#26F7F7]'
                  }`}
                >
                  <div
                    className={`w-16 h-24 rounded-xl overflow-hidden shrink-0 border relative ${
                      isDark ? 'bg-black border-amber-500/30' : 'bg-white border-[#D9F5F5]'
                    }`}
                  >
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className={`w-full h-full ${
                        story.coverFit === 'cover' ? 'object-cover' : 'object-contain'
                      } ${
                        story.coverPosition === 'top'
                          ? 'object-top'
                          : story.coverPosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-center'
                      } group-hover:scale-105 transition-transform`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-serif font-bold text-sm truncate ${
                          isDark ? 'text-white' : 'text-[#182B32]'
                        }`}
                      >
                        {story.title}
                      </span>
                      {story.isGoldenLibrary && (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                            isDark ? 'text-amber-400 bg-amber-400/15' : 'text-[#182B32] bg-[#E9FFFF]'
                          }`}
                        >
                          ✦ Gold
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      {story.synopsis}
                    </p>
                    <div
                      className={`flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono pt-1.5 ${
                        isDark ? 'text-amber-400/90' : 'text-[#64748B]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{story.partsCount} Chapters</span>
                        <span>·</span>
                        <span className={`font-bold uppercase ${story.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {story.status}
                        </span>
                      </div>

                      {/* Action buttons: Publish, Request Feature, Edit */}
                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        {story.status === 'draft' ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateStory(story.id, { status: 'published' });
                              setFeatureNotice(`"${story.title}" has been published to LEXORA!`);
                              setTimeout(() => setFeatureNotice(null), 3000);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-serif font-bold text-[10px] cursor-pointer shadow-xs transition-all ${
                              isDark
                                ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black hover:scale-105'
                                : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32]'
                            }`}
                          >
                            Publish Now
                          </button>
                        ) : story.isFeatured ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                              ★ Featured
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateStory(story.id, { isFeatured: false });
                                setFeatureNotice(`Removed "${story.title}" from homepage featured.`);
                                setTimeout(() => setFeatureNotice(null), 3000);
                              }}
                              className="text-[9px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                              title="Withdraw from featuring"
                            >
                              Withdraw
                            </button>
                          </div>
                        ) : story.featureRequest?.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                              Feature In Review
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateStory(story.id, { featureRequest: undefined });
                                setFeatureNotice(`Withdrew featuring request for "${story.title}".`);
                                setTimeout(() => setFeatureNotice(null), 3000);
                              }}
                              className="text-[9px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                              title="Cancel Request"
                            >
                              Withdraw
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setFeatureModalStory(story);
                              setFeatureCategoryChoice(story.category || 'Featured Stories');
                            }}
                            className={`px-2 py-1 rounded-lg border text-[10px] font-serif font-semibold cursor-pointer transition-colors ${
                              isDark
                                ? 'bg-white/5 hover:bg-amber-500/20 border-amber-500/30 text-amber-200'
                                : 'bg-white hover:bg-[#E9FFFF] border-[#D9F5F5] text-[#182B32]'
                            }`}
                          >
                            Request Feature
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* INDEPENDENT LANGUAGE PREFERENCES (LEXORA GLOBAL) */}
        {/* ==================================================================== */}
        <div
          className={`p-6 rounded-3xl border space-y-4 shadow-sm transition-colors ${
            isDark ? 'bg-black/70 border-amber-500/30' : 'bg-white border-[#D9F5F5]'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className={`w-5 h-5 ${isDark ? 'text-[#ffd700]' : 'text-[#26F7F7]'}`} />
              <div>
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  LEXORA Global · 15 Languages
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-amber-400/80' : 'text-[#64748B]'}`}>
                  Completely Independent Settings for UI, Reading &amp; Writing
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div
              className={`p-3.5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <span
                className={`text-[10px] uppercase font-mono font-bold block ${
                  isDark ? 'text-amber-400' : 'text-[#182B32]'
                }`}
              >
                Home / UI Language:
              </span>
              <p className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                {languages.find(l => l.code === uiLanguage)?.nativeName} ({uiLanguage})
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Controls menus, buttons, and navigation text.
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <span
                className={`text-[10px] uppercase font-mono font-bold block ${
                  isDark ? 'text-amber-400' : 'text-[#182B32]'
                }`}
              >
                Reading Studio Language:
              </span>
              <p className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                {languages.find(l => l.code === readingLanguage)?.nativeName} ({readingLanguage})
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Translates prose; poems preserved as original.
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <span
                className={`text-[10px] uppercase font-mono font-bold block ${
                  isDark ? 'text-amber-400' : 'text-[#182B32]'
                }`}
              >
                Writing Studio Language:
              </span>
              <p className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                {languages.find(l => l.code === writingLanguage)?.nativeName} ({writingLanguage})
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Authors write in their chosen native script.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Admin Console Banner */}
        {isFounder && (
          <div
            className={`p-6 rounded-3xl border-2 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark
                ? 'bg-gradient-to-r from-amber-950/60 via-black to-black border-amber-500/50'
                : 'bg-[#F7FFFF] border-[#D9F5F5]'
            }`}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-amber-500/20 border-amber-400' : 'bg-[#26F7F7] border-[#26F7F7]'
                }`}
              >
                <Sliders className={`w-6 h-6 ${isDark ? 'text-[#ffd700]' : 'text-[#182B32]'}`} />
              </div>
              <div className="space-y-0.5">
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  Founder &amp; Administrator Dashboard
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                  Manage bank UTR verification, approve/reject subscriptions, and moderate global stories.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAdmin}
              className={`px-5 py-2.5 rounded-xl font-serif font-bold text-xs shrink-0 cursor-pointer shadow-md hover:scale-105 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black'
                  : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
              }`}
            >
              Open Console
            </button>
          </div>
        )}

        {/* Quick Links: Legal, Help, Community */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {onOpenHelpCenter && (
            <button
              onClick={onOpenHelpCenter}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                isDark
                  ? 'bg-black/60 border-amber-500/25 hover:border-amber-400/60'
                  : 'bg-white border-[#D9F5F5] hover:border-[#26F7F7] shadow-xs'
              }`}
            >
              <LifeBuoy className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
              <div>
                <span className={`font-serif font-bold text-xs block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  Help Center
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  FAQ, tickets, mishrashreyanshu11@gmail.com
                </span>
              </div>
            </button>
          )}

          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                isDark
                  ? 'bg-black/60 border-amber-500/25 hover:border-amber-400/60'
                  : 'bg-white border-[#D9F5F5] hover:border-[#26F7F7] shadow-xs'
              }`}
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <div>
                <span className={`font-serif font-bold text-xs block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  Official Channels
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  WhatsApp &amp; Instagram @lexora.____
                </span>
              </div>
            </button>
          )}

          <button
            onClick={onOpenLegal}
            className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
              isDark
                ? 'bg-black/60 border-amber-500/25 hover:border-amber-400/60'
                : 'bg-white border-[#D9F5F5] hover:border-[#26F7F7] shadow-xs'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <span className={`font-serif font-bold text-xs block ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Policies &amp; Guidelines
              </span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Beyond the Loop Standards
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'bg-[#090b10] border-amber-500/40 text-slate-100'
                : 'bg-white border-[#D9F5F5] text-[#182B32]'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
              }`}
            >
              <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                Edit Writer &amp; Reader Profile
              </h3>
              <button
                onClick={() => setEditProfileOpen(false)}
                className={isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#182B32]'}
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className={`font-serif font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={e => setDisplayNameInput(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                    isDark
                      ? 'bg-black border-amber-500/30 text-white focus:border-amber-400'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                  }`}
                  required
                />
              </div>

              {/* Instagram Handle Editing */}
              <div className="space-y-1">
                <label className={`font-serif font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram Handle</span>
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2 font-mono ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}>@</span>
                  <input
                    type="text"
                    placeholder="yourhandle or lexora.____"
                    value={instagramInput}
                    onChange={e => setInstagramInput(e.target.value)}
                    className={`w-full pl-8 pr-3 py-2.5 rounded-xl border font-mono text-xs focus:outline-hidden ${
                      isDark
                        ? 'bg-black border-amber-500/30 text-white focus:border-amber-400'
                        : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                    }`}
                  />
                </div>
              </div>

              {/* Bio Editing */}
              <div className="space-y-1">
                <label className={`font-serif font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                  Author &amp; Reader Bio
                </label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  placeholder="Share your literary journey, themes, or philosophical perspective..."
                  className={`w-full p-3 rounded-xl border text-xs focus:outline-hidden resize-none ${
                    isDark
                      ? 'bg-black border-amber-500/30 text-white focus:border-amber-400'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-transparent'
                      : 'border-[#D9F5F5] hover:bg-[#E9FFFF] text-[#64748B]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-serif font-bold cursor-pointer transition-all shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black hover:scale-105'
                      : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
                  }`}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DATE OF BIRTH MODAL (ONCE A MONTH RULE) */}
      {editDobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-4 ${
              isDark
                ? 'bg-[#090b10] border-amber-500/40 text-slate-100'
                : 'bg-white border-[#D9F5F5] text-[#182B32]'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-amber-500/20' : 'border-[#D9F5F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-[#26F7F7]'}`} />
                <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-white' : 'text-[#182B32]'}`}>
                  Edit Date of Birth
                </h3>
              </div>
              <button
                onClick={() => setEditDobOpen(false)}
                className={isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#182B32]'}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
              To prevent age manipulation, Date of Birth can be corrected if entered erroneously, but <strong>only once every 30 days</strong>.
            </p>

            {dobSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{dobSuccess}</span>
              </div>
            )}

            {dobError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-200 text-xs">
                {dobError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDobError(null);
                setDobSuccess(null);
                const res = updateDob(dobInput);
                if (res.success) {
                  setDobSuccess('Date of Birth updated successfully!');
                  setTimeout(() => setEditDobOpen(false), 1500);
                } else {
                  setDobError(res.error || 'Failed to update Date of Birth.');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className={`font-serif font-bold ${isDark ? 'text-slate-200' : 'text-[#182B32]'}`}>
                  Confirmed Date of Birth (YYYY-MM-DD):
                </label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-hidden ${
                    isDark
                      ? 'bg-black border-amber-500/30 text-white focus:border-amber-400'
                      : 'bg-[#F7FFFF] border-[#D9F5F5] text-[#182B32] focus:border-[#26F7F7]'
                  }`}
                  required
                />
              </div>

              {currentUser.dobLastEditedAt && (
                <p className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  Last updated: {new Date(currentUser.dobLastEditedAt).toLocaleDateString()}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDobOpen(false)}
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-transparent'
                      : 'border-[#D9F5F5] hover:bg-[#E9FFFF] text-[#64748B]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-serif font-bold cursor-pointer transition-all shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black hover:scale-105'
                      : 'bg-[#26F7F7] hover:bg-[#18e6e6] text-[#182B32]'
                  }`}
                >
                  Save Date of Birth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
