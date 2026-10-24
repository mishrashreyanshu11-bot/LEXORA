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
  Trophy,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'discover' | 'arena' | 'community' | 'library' | 'profile';
  onChangeTab: (tab: 'home' | 'discover' | 'arena' | 'community' | 'library' | 'profile') => void;
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
                <h3 className="font-bold text-sm">LEXORA Authoring Studio</h3>
                <p className="text-[11px] text-slate-500">Beyond the Loop · Serialized Publishing</p>
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
                className="w-full p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-[#26f7db]/60 flex items-center gap-3 text-teal-950 font-bold transition-all cursor-pointer text-left"
              >
                <div className="p-2 rounded-xl bg-slate-900 text-[#26f7db]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">Create New Story / Serial</p>
                  <p className="text-[10px] text-teal-800 font-normal">Start a new serialized title with cover &amp; tags</p>
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
                  <p className="text-xs">Add New Chapter / Installment</p>
                  <p className="text-[10px] text-slate-400 font-normal">Append installments to your existing stories</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateMenuOpen(false);
                  onChangeTab('arena');
                }}
                className="w-full p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-300 flex items-center gap-3 text-amber-950 font-bold transition-all cursor-pointer text-left"
              >
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">Enter Quarterly Arena (4x/Year)</p>
                  <p className="text-[10px] text-amber-800 font-normal">Win 👑 Crown Badge, 1-mo verification, &amp; home feature</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setCreateMenuOpen(false)} />
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          {/* Home */}
          <button
            onClick={() => onChangeTab('home')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'home' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-sans">Home</span>
            {currentTab === 'home' && (
              <span className="w-4 h-0.5 rounded-full bg-[#26f7db] shadow-[0_0_6px_#26f7db]" />
            )}
          </button>

          {/* Discover */}
          <button
            onClick={() => onChangeTab('discover')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'discover' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-sans">Discover</span>
            {currentTab === 'discover' && (
              <span className="w-4 h-0.5 rounded-full bg-[#26f7db] shadow-[0_0_6px_#26f7db]" />
            )}
          </button>

          {/* Create Button (Center Accent) */}
          <button
            onClick={() => setCreateMenuOpen(true)}
            className="flex flex-col items-center -mt-4 group cursor-pointer"
            title="Create Serialized Story"
          >
            <div className="w-11 h-11 rounded-full bg-slate-950 text-[#26f7db] border-2 border-white shadow-xl flex items-center justify-center group-hover:scale-105 group-hover:border-[#26f7db] transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-slate-900 mt-0.5">Write</span>
          </button>

          {/* Arena (Quarterly Challenge) */}
          <button
            onClick={() => onChangeTab('arena')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'arena' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-amber-500'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[9px] font-sans">Arena 🏆</span>
            {currentTab === 'arena' && (
              <span className="w-4 h-0.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            )}
          </button>

          {/* Library */}
          <button
            onClick={() => onChangeTab('library')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'library' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-[9px] font-sans">Library</span>
            {currentTab === 'library' && (
              <span className="w-4 h-0.5 rounded-full bg-[#26f7db] shadow-[0_0_6px_#26f7db]" />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => onChangeTab('profile')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              currentTab === 'profile' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] font-sans">Profile</span>
            {currentTab === 'profile' && (
              <span className="w-4 h-0.5 rounded-full bg-[#26f7db] shadow-[0_0_6px_#26f7db]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
