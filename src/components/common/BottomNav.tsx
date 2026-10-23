import React, { useState } from 'react';
import {
  Home,
  Compass,
  PlusCircle,
  Bookmark,
  User,
  Plus,
  FileText,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'discover' | 'community' | 'library' | 'profile';
  onChangeTab: (tab: 'home' | 'discover' | 'community' | 'library' | 'profile') => void;
  onOpenCreateStory: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenCreateStory,
}) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  return (
    <>
      {/* Create Floating Action Popup */}
      {createMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3 text-slate-900 animate-slide-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm">Vellum Studio</h3>
                <p className="text-[11px] text-slate-500">Publish serialized works to readers</p>
              </div>
              <button
                onClick={() => setCreateMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setCreateMenuOpen(false);
                  onOpenCreateStory();
                }}
                className="w-full p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-[#26F7F7]/60 flex items-center gap-3 text-teal-950 font-bold transition-all cursor-pointer text-left"
              >
                <div className="p-2 rounded-xl bg-slate-900 text-[#26F7F7]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">Create New Story</p>
                  <p className="text-[10px] text-teal-800 font-normal">Start a new serialized title with cover & tags</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateMenuOpen(false);
                  onOpenCreateStory();
                }}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-800 font-semibold transition-all cursor-pointer text-left"
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">Add New Chapter / Part</p>
                  <p className="text-[10px] text-slate-400 font-normal">Append installments to your existing stories</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateMenuOpen(false);
                  onOpenCreateStory();
                }}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-800 font-semibold transition-all cursor-pointer text-left"
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">Drafts &amp; Manage Serials</p>
                  <p className="text-[10px] text-slate-400 font-normal">Reorder parts, preview, or run AI assessment</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setCreateMenuOpen(false)} />
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          {/* Home */}
          <button
            onClick={() => onChangeTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentTab === 'home' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-sans">Home</span>
            {currentTab === 'home' && (
              <span className="w-4 h-1 rounded-full bg-[#26F7F7] -mb-1 shadow-[0_0_6px_#26F7F7]" />
            )}
          </button>

          {/* Discover */}
          <button
            onClick={() => onChangeTab('discover')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentTab === 'discover' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-sans">Discover</span>
            {currentTab === 'discover' && (
              <span className="w-4 h-1 rounded-full bg-[#26F7F7] -mb-1 shadow-[0_0_6px_#26F7F7]" />
            )}
          </button>

          {/* Create Button (Center Accent) */}
          <button
            onClick={() => setCreateMenuOpen(true)}
            className="flex flex-col items-center -mt-5 group cursor-pointer"
            title="Create Serialized Story"
          >
            <div className="w-12 h-12 rounded-full bg-slate-950 text-[#26F7F7] border-2 border-white shadow-xl flex items-center justify-center group-hover:scale-105 group-hover:border-[#26F7F7] transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-900 mt-1">Create</span>
          </button>

          {/* Library */}
          <button
            onClick={() => onChangeTab('library')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentTab === 'library' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-sans">Library</span>
            {currentTab === 'library' && (
              <span className="w-4 h-1 rounded-full bg-[#26F7F7] -mb-1 shadow-[0_0_6px_#26F7F7]" />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => onChangeTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentTab === 'profile' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-sans">Profile</span>
            {currentTab === 'profile' && (
              <span className="w-4 h-1 rounded-full bg-[#26F7F7] -mb-1 shadow-[0_0_6px_#26F7F7]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
