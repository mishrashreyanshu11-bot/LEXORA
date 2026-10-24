import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { DEFAULT_AVATAR } from '../../types';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
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
} from 'lucide-react';

interface UserProfileViewProps {
  onOpenAdmin: () => void;
  onOpenUpgradeModal: () => void;
  onOpenLegal: () => void;
  onSelectStory: (storyId: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onOpenAdmin,
  onOpenUpgradeModal,
  onOpenLegal,
  onSelectStory,
}) => {
  const { currentUser, isFounder, isPremiumSubscriber, logout, updateProfile } = useAuth();
  const { stories, purchasedStoryIds, readingProgress } = useStories();

  const [editBioOpen, setEditBioOpen] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [displayNameInput, setDisplayNameInput] = useState(currentUser?.displayName || '');
  const [twitterInput, setTwitterInput] = useState(currentUser?.socialLinks?.twitter || '');
  const [avatarInput, setAvatarInput] = useState(currentUser?.avatar || DEFAULT_AVATAR);
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const [avatarUrlText, setAvatarUrlText] = useState('');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const purchasedStories = stories.filter(s => purchasedStoryIds.includes(s.id));

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
    updateProfile({
      displayName: displayNameInput.trim() || currentUser.displayName,
      bio: bioInput.trim(),
      avatar: avatarInput.trim() || DEFAULT_AVATAR,
      socialLinks: {
        ...currentUser.socialLinks,
        twitter: twitterInput.trim() || undefined,
      },
    });
    setEditBioOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Hidden file input for fast avatar change */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Profile Card */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={currentUser.avatar || DEFAULT_AVATAR}
                  alt={currentUser.displayName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[#26F7F7]/40 shadow-md bg-slate-950"
                />
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  title="Change profile picture"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:scale-110 transition-all cursor-pointer border border-white"
                >
                  <Camera className="w-3.5 h-3.5 text-[#26f7db]" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 font-sans-modern tracking-tight">
                    {currentUser.displayName}
                  </h1>
                  {currentUser.isFounder ? (
                    <FounderBadge size="md" />
                  ) : currentUser.isVerified ? (
                    <VerifiedBadge size="md" />
                  ) : null}
                </div>
                <p className="text-xs font-mono text-slate-500">@{currentUser.username}</p>
                {/* Do not write Premium member for those who are verified; only show the white tick with #26f7db */}
                {!currentUser.isVerified && !currentUser.isFounder && (
                  <div className="pt-0.5">
                    {currentUser.isPremiumSubscriber ? (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Subscriber
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                        Standard Reader
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditBioOpen(true)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {currentUser.bio && (
            <p className="text-sm text-slate-600 italic font-editorial leading-relaxed max-w-2xl">
              "{currentUser.bio}"
            </p>
          )}

          {/* Account Details Badges (DOB compliance) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email</span>
                <span className="font-mono text-slate-800 font-bold truncate block">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">DOB (Mandatory Record)</span>
                <span className="font-mono text-slate-800 font-bold">{currentUser.dob}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Age Verification</span>
                <span className="font-semibold text-emerald-700">Verified Legal Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Founder Admin Console Banner */}
        {isFounder && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#26F7F7]/20 border border-[#26F7F7] flex items-center justify-center shrink-0">
                <Sliders className="w-6 h-6 text-[#26F7F7]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-base font-sans-modern">Founder &amp; Administrator Dashboard</h3>
                <p className="text-xs text-slate-300">
                  Manage story thresholds, confirm UPI subscription payments, moderate community, and issue Writer Certificates.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAdmin}
              className="px-5 py-2.5 rounded-xl bg-[#26F7F7] hover:bg-[#00d4d4] text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md transition-colors"
            >
              Open Console
            </button>
          </div>
        )}

        {/* Subscription Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">LEXORA Premium Subscription</h3>
              <p className="text-xs text-slate-500">
                {currentUser.isPremiumSubscriber
                  ? 'Unlimited reading access across all premium serialized titles.'
                  : 'Upgrade to read all premium stories without individual story fees.'}
              </p>
            </div>
            {currentUser.isPremiumSubscriber && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                Active Tier
              </span>
            )}
          </div>

          {!currentUser.isPremiumSubscriber ? (
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-[#26F7F7]/50 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-bold text-sm text-teal-950">LEXORA Premium — ₹299/month</p>
                <p className="text-xs text-slate-600">
                  Includes full access to every premium serial, author suggestions, and verified member badge.
                </p>
              </div>
              <button
                onClick={onOpenUpgradeModal}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Current Plan: Monthly Member (₹299/mo)</p>
                <p className="text-slate-500 font-mono">
                  Destination: 7852931077@fam • Status: Verified Active
                </p>
              </div>
              <span className="text-emerald-700 font-bold">Auto-Renews</span>
            </div>
          )}
        </div>

        {/* Unlocked / Purchased Stories (₹19 Unlocks) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Purchased Stories ({purchasedStories.length})
          </h3>
          {purchasedStories.length === 0 ? (
            <p className="text-xs text-slate-400">
              You haven't unlocked any standalone stories yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purchasedStories.map(s => (
                <div
                  key={s.id}
                  onClick={() => onSelectStory(s.id)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img src={s.coverImage} alt={s.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      ₹19 Unlocked
                    </span>
                    <p className="font-bold text-xs text-slate-900 truncate mt-0.5">{s.title}</p>
                    <p className="text-[11px] text-slate-400">All {s.partsCount} parts unlocked</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal & Policy Center */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-base text-slate-900">Platform Policies &amp; Compliance</h3>
              <p className="text-xs text-slate-500">
                Terms of service, community guidelines, copyright rules, and privacy information.
              </p>
            </div>
            <button
              onClick={onOpenLegal}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              View Legal Center
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editBioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border border-slate-100">
            <h3 className="font-bold text-base">Edit Profile Information</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Profile Picture Setting */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900">Profile Picture</label>
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {avatarInput === DEFAULT_AVATAR ? 'Default Chalk Avatar' : 'Custom Photo'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={avatarInput || DEFAULT_AVATAR}
                    alt="Preview avatar"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#26f7db] shadow-xs shrink-0 bg-slate-950"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-teal-600" />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                        <span>Link</span>
                      </button>

                      {avatarInput !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarInput(DEFAULT_AVATAR);
                            setAvatarUrlText('');
                          }}
                          className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reset to default avatar"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Default</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      Upload from your device, paste an image link, or reset to the official default silhouette.
                    </p>
                  </div>
                </div>

                {showAvatarUrlInput && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={avatarUrlText}
                      onChange={e => setAvatarUrlText(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (avatarUrlText.trim()) {
                          setAvatarInput(avatarUrlText.trim());
                          setShowAvatarUrlInput(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={e => setDisplayNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Biography</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  placeholder="Share a short bio with your readers..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Twitter Handle / URL</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/..."
                  value={twitterInput}
                  onChange={e => setTwitterInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBioOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
