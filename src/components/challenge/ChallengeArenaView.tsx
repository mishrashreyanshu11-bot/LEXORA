import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { ChallengeSubmission, Story } from '../../types';
import { WinnerCertificateModal } from './WinnerCertificateModal';
import { AvatarWithBadge, CrownBadge, VerifiedBadge, FounderBadge } from '../common/FounderBadge';
import {
  Trophy,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  Send,
  Sliders,
  Filter,
  Eye,
  FileCheck,
  UserCheck,
} from 'lucide-react';

interface ChallengeArenaViewProps {
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenCreateStory?: () => void;
}

export const ChallengeArenaView: React.FC<ChallengeArenaViewProps> = ({
  onSelectStory,
  onReadPart,
  onOpenCreateStory,
}) => {
  const {
    challenges,
    activeChallenge,
    submissions,
    stories,
    certificates,
    submitStoryToChallenge,
    verifySubmissionByCEO,
    awardChampionWinner,
  } = useStories();

  const { currentUser, isFounder } = useAuth();

  // Modals & UI States
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedStoryToSubmit, setSelectedStoryToSubmit] = useState<string>('');
  const [submissionContentType, setSubmissionContentType] = useState<'Story' | 'Poem' | 'Article'>('Story');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // CEO Verification Portal State
  const [ceoRemarksInput, setCeoRemarksInput] = useState<{ [key: string]: string }>({
    sub_challenge_1: 'Exceptional craft and profound emotional resonance. Exemplifies the spirit of LEXORA. Crowned 1st position winner by Shreyanshu Mishra.',
  });
  const [ceoSuccessMsg, setCeoSuccessMsg] = useState<string | null>(null);

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCertSubmission, setSelectedCertSubmission] = useState<ChallengeSubmission | null>(null);

  // Filter Submissions
  const [filterTab, setFilterTab] = useState<'all' | 'top3' | 'disqualified'>('all');

  // Stories authored by the current user that can be submitted
  const userStories = stories.filter(s => s.authorId === currentUser?.id);

  // Top 3 submissions evaluated by AI Review Board (non-disqualified, sorted by overall score)
  const validSubmissions = submissions
    .filter(s => !s.aiGrading.isDisqualified)
    .sort((a, b) => b.aiGrading.overallScore - a.aiGrading.overallScore);

  const top3Submissions = validSubmissions.slice(0, 3);

  const activeWinnerSubmission = submissions.find(
    s => s.id === activeChallenge.winnerSubmissionId || s.ceoVerification?.rank === 1
  );

  const filteredSubmissions = submissions.filter(s => {
    if (filterTab === 'top3') return top3Submissions.some(t => t.id === s.id);
    if (filterTab === 'disqualified') return s.aiGrading.isDisqualified;
    return true;
  });

  const handleOpenCertificate = (sub: ChallengeSubmission) => {
    setSelectedCertSubmission(sub);
    setCertModalOpen(true);
  };

  const handleConfirmAwardWinner = (sub: ChallengeSubmission) => {
    const remarks = ceoRemarksInput[sub.id] || `Ratified and crowned 1st position winner by CEO Shreyanshu Mishra.`;
    awardChampionWinner(sub.id, remarks);
    setCeoSuccessMsg(`👑 Awarded 1st Place to ${sub.authorName}! Crown badge, 1 month free verification, 1-week home page cast, and Winner Certificate successfully conferred.`);
    setTimeout(() => setCeoSuccessMsg(null), 5000);
  };

  const handleSubmitEntry = async () => {
    if (!selectedStoryToSubmit) {
      setSubmissionMessage('Please choose a story or create one first.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      const result = await submitStoryToChallenge({
        storyId: selectedStoryToSubmit,
        contentType: submissionContentType,
        challengeId: activeChallenge.id,
      });

      if (result.aiGrading.isDisqualified) {
        setSubmissionMessage(
          `⚠️ Disqualified: AI writing rate detected at ${result.aiGrading.aiWritingRate}%, exceeding the 85% threshold. Please use "Preserve My Voice" in the editor to revise and resubmit.`
        );
      } else {
        setSubmissionMessage(
          `✓ Entry submitted! AI Editorial Score: ${result.aiGrading.overallScore}/100. AI writing rate: ${result.aiGrading.aiWritingRate}% (Passed <85% rule).`
        );
        setTimeout(() => {
          setSubmitModalOpen(false);
          setSubmissionMessage(null);
        }, 3000);
      }
    } catch (e: any) {
      setSubmissionMessage('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find certificate for active winner
  const activeCertificate = certificates.find(c =>
    activeWinnerSubmission ? c.writerId === activeWinnerSubmission.authorId : false
  ) || certificates[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-28">
      {/* ==================================================================== */}
      {/* ARENA HERO & 4X YEAR SCHEDULE HEADER */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-14 px-6 md:px-12 border-b border-amber-500/20 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cyan/Gold Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>LEXORA LITERARY ARENA — QUARTERLY CHAMPIONSHIP</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#26f7db]" />
              <span>Held Every 3 Months · 4 Times a Year</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              The Grand Crucible of Letters
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Every quarter, authors worldwide submit their finest serialized stories, poems, and essays. Graded by the AI Integrity Team and personally ratified by CEO Shreyanshu Mishra.
            </p>
          </div>

          {/* 4 Quarterly Cycles Progress Bar */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Annual Arena Calendar (4 Challenges / Year):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {challenges.map((c, i) => {
                const isActive = c.id === activeChallenge.id;
                return (
                  <div
                    key={c.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-amber-400/10 border-amber-400/60 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.quarter} · {c.year}
                      </span>
                      {isActive && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#26f7db] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#26f7db]" />
                        </span>
                      )}
                    </div>
                    <p className={`font-bold text-xs mt-2 line-clamp-1 ${isActive ? 'text-amber-200' : 'text-slate-300'}`}>
                      {c.title}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {c.seasonName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Prize Perks Strip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border border-amber-400/40 flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <CrownBadge size="sm" />
                <span>1st Position Grand Champion Rewards:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                👑 <strong>Floating Crown Badge</strong> above avatar · <strong>1 Month Free Verification</strong> · <strong>Home Page Hero Feature for 1 Week</strong> · <strong>Official Winner Certificate</strong> signed by CEO Shreyanshu Mishra.
              </p>
            </div>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-[#26f7db] text-slate-950 font-extrabold text-xs tracking-tight hover:opacity-90 transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Submit to Active Arena</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* ACTIVE QUARTER CHALLENGE PROMPT & AI INTEGRITY RULE */}
      {/* ==================================================================== */}
      <section className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
                  Active Challenge · {activeChallenge.quarter}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeChallenge.submissionsCount} Authors Entered
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 pt-1">
                "{activeChallenge.title}"
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Quarter Deadline: March 31, 2026</span>
            </div>
          </div>

          {/* Theme Prompt */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Official Theme Prompt:
            </span>
            <blockquote className="p-4 rounded-2xl bg-slate-50 border-l-4 border-slate-950 font-serif italic text-slate-800 text-sm sm:text-base leading-relaxed">
              "{activeChallenge.themePrompt}"
            </blockquote>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>

          {/* Critical AI Integrity Rule Banner */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3 text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-rose-900 uppercase tracking-wider block">
                Strict Platform Rule: 85% AI-Writing Disqualification Threshold
              </span>
              <p className="text-rose-800/90 leading-relaxed">
                LEXORA deploys an autonomous AI Editorial Team to assess all submissions. <strong>If any story or part tests at 85% or higher AI-generated rate, it receives an official warning and is immediately disqualified</strong>. AI grades the challenge stories, and the <strong>Top 3 finalists</strong> are forwarded directly to CEO Shreyanshu Mishra for final review and verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* REIGNING ARENA CHAMPION SHOWCASE */}
      {/* ==================================================================== */}
      {activeWinnerSubmission && (
        <section className="max-w-4xl mx-auto px-6 pt-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white border-2 border-amber-400/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-5 py-1.5 rounded-bl-2xl bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <CrownBadge size="xs" />
              <span>Current Arena Champion</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Cover Image */}
              <div
                onClick={() => onSelectStory(activeWinnerSubmission.storyId)}
                className="relative w-28 sm:w-36 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg shrink-0 cursor-pointer group"
              >
                <img
                  src={activeWinnerSubmission.storyCover}
                  alt={activeWinnerSubmission.storyTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                  #1 Winner
                </div>
              </div>

              {/* Champion Details */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center gap-3">
                  <AvatarWithBadge
                    avatarUrl={activeWinnerSubmission.authorAvatar}
                    name={activeWinnerSubmission.authorName}
                    size="md"
                    hasCrownBadge={true}
                    isVerified={true}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-950 text-sm">
                        {activeWinnerSubmission.authorName}
                      </span>
                      <VerifiedBadge size="sm" />
                    </div>
                    <span className="text-xs text-slate-500">
                      @{activeWinnerSubmission.authorUsername} · 1 Month Free Verification Active
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    onClick={() => onSelectStory(activeWinnerSubmission.storyId)}
                    className="font-serif text-xl sm:text-2xl font-bold text-slate-950 hover:text-teal-900 cursor-pointer"
                  >
                    "{activeWinnerSubmission.storyTitle}"
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed font-sans">
                    {activeWinnerSubmission.storySynopsis}
                  </p>
                </div>

                {/* CEO Remarks */}
                <div className="p-3 rounded-xl bg-white border border-amber-300/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <FounderBadge size="xs" showLabel={false} />
                      <span>CEO Shreyanshu Mishra's Verification:</span>
                    </span>
                    <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
                      AI Rate: {activeWinnerSubmission.aiGrading.aiWritingRate}% (Pure Human)
                    </span>
                  </div>
                  <p className="italic text-slate-700">
                    "{activeWinnerSubmission.ceoVerification?.ceoRemarks || 'Exceptional craft and profound emotional resonance.'}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleOpenCertificate(activeWinnerSubmission)}
                    className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Official Winner Certificate</span>
                  </button>

                  <button
                    onClick={() => onReadPart(activeWinnerSubmission.storyId, 1)}
                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>Read Winning Story</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* CEO VERIFICATION PORTAL (Top 3 Finalists personally checked by Shreyanshu Mishra) */}
      {/* ==================================================================== */}
      <section className="max-w-4xl mx-auto px-6 pt-12 space-y-4">
        <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl border border-teal-500/40 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-400/50 flex items-center justify-center">
                <FounderBadge size="sm" showLabel={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">
                    CEO Verification &amp; Crown Award Portal
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    Executive Access
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Top 3 AI-Rated Finalists sent to CEO Shreyanshu Mishra for official verification and crowning.
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              Status: <span className="text-[#26f7db] font-bold">CEO Ready</span>
            </div>
          </div>

          {ceoSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#26f7db] shrink-0" />
              <span>{ceoSuccessMsg}</span>
            </div>
          )}

          {/* Top 3 Finalists Cards */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Top 3 Ranked Finalists (Sent by AI Team):
            </span>

            <div className="space-y-4">
              {top3Submissions.map((sub, idx) => {
                const rank = idx + 1;
                const isRank1 = sub.ceoVerification?.rank === 1;

                return (
                  <div
                    key={sub.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isRank1
                        ? 'bg-amber-500/10 border-amber-400/80 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Rank + Author + Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : 'bg-amber-700 text-white'
                        }`}>
                          #{rank}
                        </div>

                        <AvatarWithBadge
                          avatarUrl={sub.authorAvatar}
                          name={sub.authorName}
                          size="sm"
                          hasCrownBadge={isRank1}
                          isVerified={true}
                        />

                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">
                            "{sub.storyTitle}"
                          </h4>
                          <span className="text-xs text-slate-400">
                            by {sub.authorName} · {sub.contentType}
                          </span>
                        </div>
                      </div>

                      {/* AI Evaluation Metrics Strip */}
                      <div className="flex items-center gap-2 text-xs shrink-0">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-center">
                          <span className="text-[10px] text-slate-400 block uppercase">AI Score</span>
                          <span className="font-bold text-amber-400 text-sm">
                            {sub.aiGrading.overallScore}/100
                          </span>
                        </div>

                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-center">
                          <span className="text-[10px] text-slate-400 block uppercase">AI Writing</span>
                          <span className="font-bold text-[#26f7db] text-sm">
                            {sub.aiGrading.aiWritingRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Critique snippet */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-slate-400 block mb-0.5">
                        AI Editorial Team Assessment:
                      </span>
                      "{sub.aiGrading.editorialCritique}"
                    </div>

                    {/* CEO Verification Action Strip */}
                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="CEO Shreyanshu Mishra verification remark..."
                          value={ceoRemarksInput[sub.id] || ''}
                          onChange={e => setCeoRemarksInput({ ...ceoRemarksInput, [sub.id]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#26f7db]"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isRank1 ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                              <CrownBadge size="xs" />
                              <span>Crowned 1st Position Winner</span>
                            </span>
                            <button
                              onClick={() => handleOpenCertificate(sub)}
                              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Certificate
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConfirmAwardWinner(sub)}
                            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#26f7db] hover:opacity-90 text-slate-950 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <CrownBadge size="xs" />
                            <span>👑 Ratify &amp; Crown 1st Place</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* ALL ARENA SUBMISSIONS & LEADERBOARD (Shows 85% rule disqualifications) */}
      {/* ==================================================================== */}
      <section className="max-w-4xl mx-auto px-6 pt-12 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl text-slate-950 tracking-tight font-sans-modern">
              Arena Submissions &amp; AI Integrity Board
            </h3>
            <p className="text-xs text-slate-500">
              Submissions evaluated for craft and scanned against the 85% AI writing ceiling.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilterTab('top3')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                filterTab === 'top3'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Top 3 Finalists
            </button>
            <button
              onClick={() => setFilterTab('disqualified')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                filterTab === 'disqualified'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Disqualified (≥85% AI)
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map(sub => {
            const isDisq = sub.aiGrading.isDisqualified;
            const isWinner = sub.ceoVerification?.rank === 1;

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isDisq
                    ? 'bg-rose-50/50 border-rose-200'
                    : isWinner
                    ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Author + Story */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={sub.storyCover}
                      alt={sub.storyTitle}
                      className="w-16 h-22 rounded-xl object-cover shrink-0 shadow-xs"
                    />

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isDisq ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-xs">
                            <AlertTriangle className="w-3 h-3" />
                            <span>DISQUALIFIED (≥85% AI)</span>
                          </span>
                        ) : isWinner ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase flex items-center gap-1">
                            <CrownBadge size="xs" />
                            <span>1st Place Champion</span>
                          </span>
                        ) : sub.ceoVerification?.rank ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-extrabold text-[10px] uppercase">
                            Finalist Rank #{sub.ceoVerification.rank}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold text-[10px] uppercase">
                            {sub.contentType}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectStory(sub.storyId)}
                        className={`font-bold text-base leading-snug cursor-pointer ${
                          isDisq ? 'text-rose-900' : 'text-slate-950 hover:text-teal-900'
                        }`}
                      >
                        "{sub.storyTitle}"
                      </h4>

                      <div className="flex items-center gap-2 text-xs">
                        <AvatarWithBadge
                          avatarUrl={sub.authorAvatar}
                          name={sub.authorName}
                          size="xs"
                          hasCrownBadge={isWinner}
                          isVerified={!isDisq}
                        />
                        <span className="font-semibold text-slate-800">{sub.authorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-bold text-sm">
                        <span className="text-slate-400 text-xs">AI Rate:</span>
                        <span className={isDisq ? 'text-rose-600 font-extrabold' : 'text-teal-700'}>
                          {sub.aiGrading.aiWritingRate}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Score: <strong className="text-slate-800">{sub.aiGrading.overallScore}/100</strong>
                      </div>
                    </div>

                    {isWinner && (
                      <button
                        onClick={() => handleOpenCertificate(sub)}
                        className="px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Certificate</span>
                      </button>
                    )}

                    <button
                      onClick={() => onReadPart(sub.storyId, 1)}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Read
                    </button>
                  </div>
                </div>

                {/* Disqualification Reason Note */}
                {isDisq && sub.aiGrading.disqualificationReason && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-100/70 border border-rose-300 text-xs text-rose-950 font-medium">
                    {sub.aiGrading.disqualificationReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SUBMISSION MODAL WITH REAL-TIME AI INTEGRITY SCANNER */}
      {/* ==================================================================== */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-950">
                  Submit to {activeChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Select Story or Publication to Enter:
                </label>
                {userStories.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
                    <p className="text-amber-900">
                      You haven't written a story under your active account yet.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitModalOpen(false);
                        if (onOpenCreateStory) onOpenCreateStory();
                      }}
                      className="px-4 py-2 rounded-full bg-slate-950 text-white font-bold text-xs"
                    >
                      Start Writing Now
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedStoryToSubmit}
                    onChange={e => setSelectedStoryToSubmit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:border-[#26f7db]"
                  >
                    <option value="">-- Choose from your stories --</option>
                    {userStories.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.title} ({st.category})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Content Category:
                </label>
                <div className="flex gap-2">
                  {(['Story', 'Poem', 'Article'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSubmissionContentType(type)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        submissionContentType === type
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning rule reminder */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">
                  Automatic AI Integrity Scan:
                </span>
                <p>
                  Upon submission, your piece is reviewed by the AI Editorial Board. If AI-generated writing rate meets or exceeds <strong>85%</strong>, it will trigger an automatic disqualification warning.
                </p>
              </div>

              {submissionMessage && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold ${
                  submissionMessage.includes('Disqualified') || submissionMessage.includes('failed')
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-teal-50 border border-teal-200 text-teal-900'
                }`}>
                  {submissionMessage}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting || !selectedStoryToSubmit}
                onClick={handleSubmitEntry}
                className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI Board Scanning...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit &amp; Run AI Check</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Winner Certificate Modal */}
      <WinnerCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        certificate={activeCertificate}
        storyTitle={selectedCertSubmission?.storyTitle || activeWinnerSubmission?.storyTitle}
      />
    </div>
  );
};
