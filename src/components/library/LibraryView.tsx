import React, { useState } from 'react';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { isStoryPremium } from '../../utils/premiumRules';
import { BookOpen, Bookmark, CheckCircle, Sparkles, Clock, Lock, ArrowLeft } from 'lucide-react';

interface LibraryViewProps {
  onBack?: () => void;
  onSelectStory: (storyId: string) => void;
  onReadPart: (storyId: string, partNumber: number) => void;
  onOpenUpgradeModal?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onBack,
  onSelectStory,
  onReadPart,
  onOpenUpgradeModal,
}) => {
  const { stories, savedStoryIds, readingProgress, purchasedStoryIds, settings } = useStories();
  const { isPremiumSubscriber, isFounder } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'saved' | 'reading' | 'completed' | 'purchased' | 'premium'
  >('reading');

  // Filtered stories for each tab
  const savedStories = stories.filter(s => savedStoryIds.includes(s.id));
  const readingStories = stories.filter(s => readingProgress[s.id]);
  const completedStories = stories.filter(s => s.completed);
  const purchasedStories = stories.filter(s => purchasedStoryIds.includes(s.id));
  const premiumStories = stories.filter(s => isStoryPremium(s, settings));

  const getStoriesForTab = () => {
    switch (activeTab) {
      case 'saved':
        return savedStories;
      case 'completed':
        return completedStories;
      case 'purchased':
        return purchasedStories;
      case 'premium':
        return premiumStories;
      case 'reading':
      default:
        return readingStories;
    }
  };

  const currentList = getStoriesForTab();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-sans-modern tracking-tight">
              My Library
            </h1>
            <p className="text-xs text-slate-500">
              Your personal archive of serialized journeys, saved chapters, and purchased access.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {[
              { id: 'reading', label: `Reading (${readingStories.length})` },
              { id: 'saved', label: `Saved (${savedStories.length})` },
              { id: 'completed', label: `Completed (${completedStories.length})` },
              { id: 'purchased', label: `Purchased (${purchasedStories.length})` },
              { id: 'premium', label: `Premium Access (${premiumStories.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">No stories in this section yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore Discover and Start Reading any serial to automatically build your bookshelf.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentList.map(s => {
              const isPrem = isStoryPremium(s, settings);
              const progress = readingProgress[s.id];
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStory(s.id)}
                  className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-[#26F7F7] hover:shadow-md transition-all flex gap-4 cursor-pointer group"
                >
                  <img
                    src={s.coverImage}
                    alt={s.title}
                    className="w-20 h-28 object-cover rounded-2xl shrink-0 group-hover:scale-102 transition-transform shadow-xs"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1 flex flex-col justify-between">
                    <div>
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
                      <p className="text-xs text-slate-500 truncate">By {s.authorName}</p>
                    </div>

                    {/* Reading Progress Indicator if active */}
                    {progress ? (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>Chapter {progress.lastPartNumber} of {s.partsCount}</span>
                          <span>{progress.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${progress.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] font-mono text-slate-400">
                        {s.partsCount} Parts • ★ {s.ratingAverage}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
