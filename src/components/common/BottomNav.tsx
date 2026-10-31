import React from 'react';
import {
  Home,
  Bookmark,
  Plus,
  Compass,
  User,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

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
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      {/* Floating Pill Container */}
      <nav
        className={`pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full backdrop-blur-xl border shadow-2xl transition-all ${
          isDark
            ? 'bg-black/90 border-[#D4AF37]/40 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.2)]'
            : 'bg-white/95 border-[#26F7F7] shadow-[0_12px_40px_rgba(38,247,247,0.25)]'
        }`}
      >
        {/* Home */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            currentTab === 'home'
              ? isDark
                ? 'bg-gradient-to-r from-amber-500/25 via-[#f3ba38]/20 to-amber-500/10 text-[#ffd700] border border-[#e5b95a]/50 shadow-[0_0_12px_rgba(243,186,56,0.3)] font-semibold'
                : 'bg-cyan-50 text-cyan-800 border border-[#26F7F7] font-semibold'
              : isDark
              ? 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
              : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
          }`}
          title={t.home || 'Home'}
        >
          <Home className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-cyan-600'}`} />
          <span className="hidden sm:inline font-sans">{t.home || 'Home'}</span>
        </button>

        {/* Library */}
        <button
          onClick={() => onChangeTab('library')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            currentTab === 'library'
              ? isDark
                ? 'bg-gradient-to-r from-amber-500/25 via-[#f3ba38]/20 to-amber-500/10 text-[#ffd700] border border-[#e5b95a]/50 shadow-[0_0_12px_rgba(243,186,56,0.3)] font-semibold'
                : 'bg-cyan-50 text-cyan-800 border border-[#26F7F7] font-semibold'
              : isDark
              ? 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
              : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
          }`}
          title={t.library || 'Library'}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline font-sans">{t.library || 'Library'}</span>
        </button>

        {/* Write (Center Accent Button) */}
        <button
          onClick={onOpenCreateStory}
          className={`mx-1 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isDark
              ? 'bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black shadow-[0_0_16px_rgba(243,186,56,0.5)]'
              : 'bg-gradient-to-r from-[#26F7F7] to-[#06b6d4] text-slate-950 shadow-[0_0_16px_rgba(38,247,247,0.5)]'
          }`}
          title="Write New Story"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="font-serif">{t.write || 'Write'}</span>
        </button>

        {/* Explore / Discover */}
        <button
          onClick={() => onChangeTab('discover')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            currentTab === 'discover'
              ? isDark
                ? 'bg-gradient-to-r from-amber-500/25 via-[#f3ba38]/20 to-amber-500/10 text-[#ffd700] border border-[#e5b95a]/50 shadow-[0_0_12px_rgba(243,186,56,0.3)] font-semibold'
                : 'bg-cyan-50 text-cyan-800 border border-[#26F7F7] font-semibold'
              : isDark
              ? 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
              : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
          }`}
          title={t.explore || 'Explore'}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline font-sans">{t.explore || 'Explore'}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            currentTab === 'profile'
              ? isDark
                ? 'bg-gradient-to-r from-amber-500/25 via-[#f3ba38]/20 to-amber-500/10 text-[#ffd700] border border-[#e5b95a]/50 shadow-[0_0_12px_rgba(243,186,56,0.3)] font-semibold'
                : 'bg-cyan-50 text-cyan-800 border border-[#26F7F7] font-semibold'
              : isDark
              ? 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
              : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
          }`}
          title={t.profile || 'Profile'}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline font-sans">{t.profile || 'Profile'}</span>
        </button>
      </nav>
    </div>
  );
};
