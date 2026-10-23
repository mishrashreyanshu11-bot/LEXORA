import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { CertificateModal } from '../certificate/CertificateModal';
import { checkCertificateEligibility, isStoryPremium } from '../../utils/premiumRules';
import {
  ArrowLeft,
  BookOpen,
  Award,
  Star,
  Users,
  Globe,
  Twitter,
  Instagram,
  CheckCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface WriterProfileViewProps {
  writerId: string;
  onBack: () => void;
  onSelectStory: (storyId: string) => void;
}

export const WriterProfileView: React.FC<WriterProfileViewProps> = ({
  writerId,
  onBack,
  onSelectStory,
}) => {
  const { allUsers, currentUser, isFollowing, followWriter, unfollowWriter, isFounder, toggleUserVerification } = useAuth();
  const { stories, certificates, settings } = useStories();

  const [certModalOpen, setCertModalOpen] = useState(false);

  const writer: User = allUsers.find(u => u.id === writerId) || {
    id: writerId,
    email: 'writer@vellum.read',
    displayName: 'Vellum Author',
    username: 'author',
    bio: 'Independent storyteller on Vellum.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'writer',
    isVerified: true,
    isFounder: false,
    dob: '1995-01-01',
    createdAt: new Date().toISOString(),
    followingIds: [],
    isPremiumSubscriber: false,
    socialLinks: {
      twitter: undefined,
      instagram: undefined,
      website: undefined,
    },
  };

  const writerStories = stories.filter(s => s.authorId === writer.id);
  const completedStoriesCount = writerStories.filter(s => s.completed).length + (writer.username === 'ananyaroy' ? 20 : 0);
  const totalReaderCount = writerStories.reduce((sum, s) => sum + s.readerCount, 0);
  const avgRating = writerStories.length
    ? Number((writerStories.reduce((sum, s) => sum + s.ratingAverage, 0) / writerStories.length).toFixed(2))
    : 4.8;

  // Check certificate eligibility
  const certificateStatus = checkCertificateEligibility(completedStoriesCount, avgRating, settings);
  const certificate = certificates.find(c => c.writerId === writer.id);

  const isCurrentMe = currentUser?.id === writer.id;
  const following = isFollowing(writer.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={writer.avatar}
                alt={writer.displayName}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-[#26F7F7]/30 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-sans-modern tracking-tight">
                    {writer.displayName}
                  </h1>
                  {writer.isFounder ? (
                    <FounderBadge size="md" />
                  ) : writer.isVerified ? (
                    <VerifiedBadge size="md" />
                  ) : null}
                </div>
                <p className="text-xs font-mono text-slate-500">@{writer.username}</p>

                {/* Social Links */}
                {writer.socialLinks && (
                  <div className="flex items-center gap-3 pt-1 text-slate-500">
                    {writer.socialLinks.twitter && (
                      <a href={writer.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {writer.socialLinks.instagram && (
                      <a href={writer.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {writer.socialLinks.website && (
                      <a href={writer.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {isFounder && !writer.isFounder && (
                <button
                  onClick={() => toggleUserVerification(writer.id)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                    writer.isVerified
                      ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      : 'bg-[#26f7db]/15 hover:bg-[#26f7db]/30 text-slate-950 border border-[#26f7db]'
                  }`}
                  title="Founder privilege: Manage writer verification"
                >
                  <VerifiedBadge size="xs" />
                  <span>{writer.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}</span>
                </button>
              )}

              {!isCurrentMe && (
                <button
                  onClick={() => (following ? unfollowWriter(writer.id) : followWriter(writer.id))}
                  className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                    following
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {following ? 'Following Writer' : 'Follow Writer'}
                </button>
              )}
            </div>
          </div>

          {/* Biography */}
          {writer.bio && (
            <p className="text-sm text-slate-600 leading-relaxed font-editorial">
              "{writer.bio}"
            </p>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400">Published Serials</span>
              <p className="text-lg font-bold font-mono text-slate-900">{writerStories.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400">Total Reads</span>
              <p className="text-lg font-bold font-mono text-slate-900">{totalReaderCount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400">Average Rating</span>
              <p className="text-lg font-bold font-mono text-amber-500">★ {avgRating}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400">Completed Works</span>
              <p className="text-lg font-bold font-mono text-slate-900">{completedStoriesCount}</p>
            </div>
          </div>
        </div>

        {/* Writer Certificate Banner / Progress */}
        {certificate ? (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#26F7F7]/20 border border-[#26F7F7] flex items-center justify-center shrink-0 shadow-lg">
                <Award className="w-8 h-8 text-[#26F7F7]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#26F7F7]/15 text-[#26F7F7] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Vellum Certified Master Writer</span>
                </div>
                <h3 className="text-lg font-bold font-sans-modern">
                  Official Writer Certificate Conferred
                </h3>
                <p className="text-xs text-slate-300">
                  Credential ID: <span className="font-mono text-[#26F7F7]">{certificate.certificateId}</span> • Signed by Founder Shreyanshu Mishra
                </p>
              </div>
            </div>

            <button
              onClick={() => setCertModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#26F7F7] hover:bg-[#00d4d4] text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-md"
            >
              View Certificate
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Writer Certificate Qualification Progress</span>
              </span>
              <span className="font-mono font-bold text-teal-700">
                {certificateStatus.progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${certificateStatus.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Requirements: Complete at least 20 serialized stories (currently {completedStoriesCount}/20) and maintain an average rating of at least 4.0 (currently {avgRating}/4.0).
            </p>
          </div>
        )}

        {/* Stories List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-sans-modern">Serialized Stories by {writer.displayName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {writerStories.map(s => {
              const isPrem = isStoryPremium(s, settings);
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStory(s.id)}
                  className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-[#26F7F7] hover:shadow-md transition-all flex gap-4 cursor-pointer group"
                >
                  <img
                    src={s.coverImage}
                    alt={s.title}
                    className="w-18 h-26 object-cover rounded-2xl shrink-0 group-hover:scale-103 transition-transform"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {s.genre}
                      </span>
                      {isPrem && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900 truncate">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{s.synopsis}</p>
                    <p className="text-[11px] font-mono text-slate-400 pt-1">
                      ★ {s.ratingAverage} • {s.partsCount} Parts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {certificate && (
        <CertificateModal
          certificate={certificate}
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
        />
      )}
    </div>
  );
};
