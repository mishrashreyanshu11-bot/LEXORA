import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
import { LexoraSymbol } from '../common/LexoraSymbol';
import {
  MessageSquare,
  Heart,
  Share2,
  Flag,
  Sparkles,
  Plus,
  Lock,
  Send,
  X,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Instagram,
  Users,
  ArrowLeft,
} from 'lucide-react';

interface CommunityViewProps {
  onBack?: () => void;
  onSelectStory?: (storyId: string) => void;
  onOpenUpgradeModal?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onBack,
  onSelectStory,
  onOpenUpgradeModal,
}) => {
  const { threads, createThread, toggleLikeThread, submitReport } = useStories();
  const { currentUser, isFounder, isPremiumSubscriber } = useAuth();

  const [activeCategory, setActiveCategory] = useState<
    'All' | 'Story Discussion' | 'Writer Recommendation' | 'Constructive Feedback' | 'General'
  >('All');

  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadCategory, setThreadCategory] = useState<any>('Story Discussion');
  const [reportModalThreadId, setReportModalThreadId] = useState<string | null>(null);

  const whatsappUrl = 'https://whatsapp.com/channel/0029Vb8s4JuDuMRn4H7z0n3t';
  const instagramUrl = 'https://www.instagram.com/lexora.____?srtk=ZHkxMW1nd2NtN21h&utm_source=qr';

  const canPost = Boolean(isPremiumSubscriber || isFounder || currentUser?.role === 'writer');

  const filteredThreads = threads.filter(t => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle.trim() || !threadContent.trim()) return;

    createThread(threadTitle, threadContent, threadCategory);
    setThreadTitle('');
    setThreadContent('');
    setNewThreadModalOpen(false);
  };

  const handleReportThread = (threadId: string, title: string) => {
    submitReport({
      targetType: 'message',
      targetId: threadId,
      targetTitle: title,
      reportedByUserId: currentUser?.id || 'anon',
      reportedByUserName: currentUser?.displayName || 'Reader',
      reason: 'Spam or inappropriate community conduct',
    });
    alert('Report submitted to moderation.');
    setReportModalThreadId(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1E8] pb-28 selection:bg-[#D4AF37]/30 selection:text-amber-100">
      {/* ==================================================================== */}
      {/* 1. COMMUNITY HEADER & OFFICIAL CHANNELS (WHATSAPP & INSTAGRAM) */}
      {/* ==================================================================== */}
      <section className="border-b border-[#D4AF37]/25 bg-gradient-to-b from-[#121318] via-[#0d0e13] to-[#080808] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black border border-amber-500/35 text-amber-200 text-xs font-semibold cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F1D58A] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>LEXORA Global Literary Circles</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                Community, Discussions &amp; Exchange
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans leading-relaxed">
                Where readers and authors unite. Connect across our official WhatsApp and Instagram channels, critique craft, and share thoughts beyond the loop.
              </p>
            </div>

            {canPost ? (
              <button
                onClick={() => setNewThreadModalOpen(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(243,186,56,0.35)] hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Start Discussion</span>
              </button>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className="px-5 py-2.5 rounded-full bg-black/60 border border-[#D4AF37]/60 text-[#F1D58A] font-serif font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0 hover:bg-[#D4AF37]/10 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Elite Discussion Access</span>
              </button>
            )}
          </div>

          {/* Official Community Action Cards: WhatsApp & Instagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* WhatsApp Community Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-3xl bg-[#171717] hover:bg-[#1c1c1c] border border-emerald-500/35 hover:border-emerald-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 truncate">
                      LEXORA WhatsApp Community
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      Channel
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Join for real-time chapter alerts, author dispatches, and quarterly arena news.
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            {/* Instagram Community Card */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-3xl bg-[#171717] hover:bg-[#1c1c1c] border border-rose-500/35 hover:border-rose-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.3)] group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-rose-300 truncate">
                      Instagram: @lexora.____
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                      Official
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Explore visual worldbuilding, featured author reels, and daily literary quotes.
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-300 group-hover:bg-rose-500 group-hover:text-black transition-all shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. DISCUSSION BOARD & CIRCLES */}
      {/* ==================================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto text-xs font-serif font-bold pb-2 scrollbar-none">
          {['All', 'Story Discussion', 'Writer Recommendation', 'Constructive Feedback', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_12px_rgba(243,186,56,0.3)]'
                  : 'bg-[#171717] text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {filteredThreads.map(thread => (
            <div
              key={thread.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#171717] border border-[#D4AF37]/20 shadow-[0_10px_25px_rgba(0,0,0,0.7)] space-y-3.5 hover:border-[#D4AF37]/45 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={thread.authorAvatar || '/assets/aistudio/IMG_6033_dd143268.jpeg'}
                    alt={thread.authorName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4AF37]/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm text-white">
                        {thread.authorName}
                      </span>
                      {thread.authorRole === 'founder' && <FounderBadge size="xs" />}
                      {thread.isPremiumAuthor && <VerifiedBadge size="xs" />}
                    </div>
                    <span className="text-[10px] text-[#F1D58A]/80 font-mono">
                      {new Date(thread.createdAt).toLocaleDateString()} · {thread.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReportThread(thread.id, thread.title)}
                  className="text-slate-500 hover:text-slate-300 text-xs p-1"
                  title="Report Post"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-white">{thread.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {thread.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikeThread(thread.id)}
                    className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{thread.likesCount}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.repliesCount} replies</span>
                  </div>
                </div>

                {thread.storyId && onSelectStory && (
                  <button
                    onClick={() => onSelectStory(thread.storyId!)}
                    className="text-[11px] text-[#F1D58A] hover:underline cursor-pointer"
                  >
                    View Referenced Story →
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredThreads.length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-[#171717] border border-white/10 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-serif font-bold text-white text-sm">No discussions in this circle yet</p>
              <p className="text-xs text-slate-400">Be the first to share an insight or question!</p>
            </div>
          )}
        </div>
      </main>

      {/* New Discussion Modal */}
      {newThreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#080808] rounded-3xl border border-[#D4AF37]/40 p-6 space-y-5 text-[#F5F1E8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <h3 className="font-serif font-bold text-base text-white">Start New Discussion</h3>
              <button onClick={() => setNewThreadModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThreadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Circle Category</label>
                <select
                  value={threadCategory}
                  onChange={e => setThreadCategory(e.target.value)}
                  className="w-full bg-[#171717] border border-white/20 p-2.5 rounded-xl text-xs text-white"
                >
                  <option value="Story Discussion">Story Discussion</option>
                  <option value="Writer Recommendation">Writer Recommendation</option>
                  <option value="Constructive Feedback">Constructive Feedback</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={threadTitle}
                  onChange={e => setThreadTitle(e.target.value)}
                  placeholder="What is on your literary mind?"
                  className="w-full bg-[#171717] border border-white/20 p-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-serif font-bold text-slate-300 block mb-1">Thoughts &amp; Context</label>
                <textarea
                  value={threadContent}
                  onChange={e => setThreadContent(e.target.value)}
                  placeholder="Share your perspectives, craft analysis, or chapter theories..."
                  className="w-full bg-[#171717] border border-white/20 p-3 rounded-xl text-xs text-white h-28 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewThreadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-md"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
