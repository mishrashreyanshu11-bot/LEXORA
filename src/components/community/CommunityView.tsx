import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { FounderBadge, VerifiedBadge } from '../common/FounderBadge';
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
} from 'lucide-react';

interface CommunityViewProps {
  onSelectStory?: (storyId: string) => void;
  onOpenUpgradeModal?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Community Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#26F7F7]/15 text-teal-950 text-xs font-bold uppercase tracking-wider border border-[#26F7F7]/40">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Vellum Literary Circle</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-sans-modern tracking-tight">
                Discussions &amp; Writer Circles
              </h1>
              <p className="text-xs text-slate-500">
                Thoughtful literary discussions, chapter theories, writer recommendations, and craft exchange.
              </p>
            </div>

            {canPost ? (
              <button
                onClick={() => setNewThreadModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-4 h-4 text-[#26F7F7]" />
                <span>Start Discussion</span>
              </button>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className="px-4 py-2.5 rounded-2xl bg-teal-50 border border-[#26F7F7] text-teal-950 font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>Unlock Premium Circle</span>
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {['All', 'Story Discussion', 'Writer Recommendation', 'Constructive Feedback', 'General'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threads List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {filteredThreads.map(thread => {
          const isLiked = currentUser && thread.likedByUserIds.includes(currentUser.id);
          return (
            <div
              key={thread.id}
              className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#26F7F7] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={thread.authorAvatar}
                    alt={thread.authorName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">{thread.authorName}</span>
                      {thread.authorRole === 'founder' ? (
                        <FounderBadge size="sm" showLabel={false} />
                      ) : thread.isPremiumAuthor ? (
                        <VerifiedBadge size="sm" />
                      ) : null}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {thread.category}
                  </span>
                  <button
                    onClick={() => handleReportThread(thread.id, thread.title)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600"
                    title="Report discussion"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Content */}
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 leading-snug">{thread.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{thread.content}</p>
              </div>

              {/* Story Tag if associated */}
              {thread.storyTitle && (
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 inline-flex items-center gap-1.5 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase text-teal-700">Story:</span>
                  <span className="font-semibold">{thread.storyTitle}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikeThread(thread.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      isLiked ? 'text-red-500' : 'hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{thread.likesCount}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.repliesCount} replies</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Thread Modal */}
      {newThreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">New Circle Discussion</h3>
              <button
                onClick={() => setNewThreadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThreadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Category</label>
                <select
                  value={threadCategory}
                  onChange={e => setThreadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="Story Discussion">Story Discussion</option>
                  <option value="Writer Recommendation">Writer Recommendation</option>
                  <option value="Constructive Feedback">Constructive Feedback</option>
                  <option value="General">General Literary Exchange</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Discussion Title</label>
                <input
                  type="text"
                  placeholder="e.g. Symbolism and pacing in Chapter 4..."
                  value={threadTitle}
                  onChange={e => setThreadTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Body</label>
                <textarea
                  rows={5}
                  placeholder="Share thoughtful arguments, questions, or perspectives..."
                  value={threadContent}
                  onChange={e => setThreadContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Post Discussion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
