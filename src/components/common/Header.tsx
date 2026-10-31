import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguageCode, SUPPORTED_LANGUAGES } from '../../data/languages';
import { FounderBadge, VerifiedBadge } from './FounderBadge';
import { LexoraSymbol } from './LexoraSymbol';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  User as UserIcon,
  LogOut,
  Sliders,
  BookOpen,
  FileText,
  Bookmark,
  Award,
  Trophy,
  Lock,
  Crown,
  CreditCard,
  Globe,
  LifeBuoy,
  MessageCircle,
  Instagram,
  Headphones,
  Gift,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onOpenUpgradeModal: () => void;
  onOpenProfile: () => void;
  onOpenIntro?: () => void;
  onOpenArena?: () => void;
  onOpenInkVault?: () => void;
  onOpenPremiumHub?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenEliteCardModal?: () => void;
  onOpenCommunity?: () => void;
  onOpenHelpCenter?: () => void;
  onOpenGoldenLibrary?: () => void;
  onOpenLiteraryPassport?: () => void;
  onOpenLegal?: () => void;
  currentScreen?: string;
  onNavigate?: (screen: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin,
  onOpenUpgradeModal,
  onOpenProfile,
  onOpenIntro,
  onOpenArena,
  onOpenInkVault,
  onOpenPremiumHub,
  onOpenCertificateModal,
  onOpenEliteCardModal,
  onOpenCommunity,
  onOpenHelpCenter,
  onOpenGoldenLibrary,
  onOpenLiteraryPassport,
  onOpenLegal,
  currentScreen = 'home',
  onNavigate,
}) => {
  const { currentUser, isFounder, isPremiumSubscriber, logout, switchUser, allUsers } = useAuth();
  const { notifications } = useStories();
  const { uiLanguage, setUiLanguage, t } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch();
  };

  return (
    <header
      className={`sticky top-0 z-[1000] backdrop-blur-md border-b max-w-full transition-colors ${
        isDark
          ? 'bg-[#000000]/95 border-[#D4AF37]/25 shadow-[0_4px_25px_rgba(0,0,0,0.85)] text-white'
          : 'bg-white/95 border-[#26F7F7]/30 shadow-sm text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* ==================================================================== */}
        {/* Left: Brand Logo & Tagline */}
        {/* ==================================================================== */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <LexoraSymbol size={28} glow={true} />
          <div className="flex flex-col">
            <span
              className={`font-serif text-lg sm:text-2xl font-black tracking-[0.14em] uppercase transition-colors ${
                isDark
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#ffd700] to-[#dfb15b]'
                  : 'text-[#182B32]'
              }`}
            >
              LEXORA
            </span>
            <span
              className={`text-[7.5px] sm:text-[9px] font-serif font-bold tracking-[0.2em] uppercase -mt-0.5 hidden xs:inline sm:inline transition-colors ${
                isDark ? 'text-[#e5b95a]' : 'text-[#0891b2]'
              }`}
            >
              Beyond the Loop!
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* Middle: Desktop Nav Links with Multilingual Labels */}
        {/* ==================================================================== */}
        <nav
          className={`hidden lg:flex items-center gap-5 text-xs font-serif font-semibold tracking-wide transition-colors ${
            isDark ? 'text-slate-300' : 'text-[#182B32]'
          }`}
        >
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative py-1 transition-colors cursor-pointer ${
              currentScreen === 'home'
                ? isDark
                  ? 'text-[#f3ba38] font-bold'
                  : 'text-[#0891b2] font-bold'
                : isDark
                ? 'hover:text-[#f3ba38]'
                : 'hover:text-[#0891b2]'
            }`}
          >
            {t.home || 'Home'}
            {currentScreen === 'home' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  isDark ? 'bg-[#f3ba38] shadow-[0_0_8px_#f3ba38]' : 'bg-[#26F7F7] shadow-[0_0_8px_#26F7F7]'
                }`}
              />
            )}
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('discover');
            }}
            className={`py-1 transition-colors cursor-pointer ${
              currentScreen === 'discover'
                ? isDark
                  ? 'text-[#f3ba38] font-bold'
                  : 'text-[#0891b2] font-bold'
                : isDark
                ? 'hover:text-[#f3ba38]'
                : 'hover:text-[#0891b2]'
            }`}
          >
            {t.explore || 'Explore'}
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('discover');
            }}
            className={`py-1 transition-colors cursor-pointer ${
              isDark ? 'hover:text-[#f3ba38]' : 'hover:text-[#0891b2]'
            }`}
          >
            {t.poetry || 'Poetry'}
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('library');
            }}
            className={`py-1 transition-colors cursor-pointer ${
              currentScreen === 'library'
                ? isDark
                  ? 'text-[#f3ba38] font-bold'
                  : 'text-[#0891b2] font-bold'
                : isDark
                ? 'hover:text-[#f3ba38]'
                : 'hover:text-[#0891b2]'
            }`}
          >
            {t.stories || 'Stories'}
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('community');
            }}
            className={`py-1 transition-colors cursor-pointer ${
              currentScreen === 'community'
                ? isDark
                  ? 'text-[#f3ba38] font-bold'
                  : 'text-[#0891b2] font-bold'
                : isDark
                ? 'hover:text-[#f3ba38]'
                : 'hover:text-[#0891b2]'
            }`}
          >
            {t.community || 'Community'}
          </button>

          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="py-1 transition-colors hover:text-[#f3ba38] cursor-pointer text-amber-200/90 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.community || 'Community'}</span>
            </button>
          )}

          {onOpenArena && (
            <button
              onClick={onOpenArena}
              className={`py-1 transition-colors hover:text-[#f3ba38] cursor-pointer flex items-center gap-1 ${
                currentScreen === 'arena' ? 'text-[#f3ba38] font-bold' : 'text-amber-200/90'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#f3ba38]" />
              <span>{t.arena || 'Arena'}</span>
            </button>
          )}
        </nav>

        {/* ==================================================================== */}
        {/* Independent Home Menu / UI Language Selector (15 Languages) & Theme Toggle */}
        {/* ==================================================================== */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative shrink-0">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full border text-xs font-serif font-bold transition-all cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-black/80 hover:bg-black border-amber-500/35 hover:border-amber-400 text-amber-200'
                  : 'bg-white hover:bg-slate-50 border-[#26F7F7] text-cyan-800'
              }`}
              title="Choose Menu & UI Language"
            >
              <Globe className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-cyan-600'}`} />
              <span className="uppercase text-[10.5px] sm:text-[11px] font-mono">{uiLanguage}</span>
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute top-11 right-0 w-52 rounded-2xl shadow-2xl border p-2 z-[1050] animate-fade-in max-h-72 overflow-y-auto ${
                  isDark
                    ? 'bg-[#090b10] border-amber-500/40 text-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.95)]'
                    : 'bg-white border-[#26F7F7] text-slate-800 shadow-[0_15px_40px_rgba(38,247,247,0.25)]'
                }`}
              >
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider block px-2 py-1 font-bold ${
                    isDark ? 'text-amber-400/80' : 'text-cyan-700'
                  }`}
                >
                  Home Menu Language (15):
                </span>
                <div className="space-y-1 pt-1">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setUiLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        uiLanguage === lang.code
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40'
                            : 'bg-cyan-50 text-cyan-800 font-bold border border-[#26F7F7]'
                          : isDark
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="font-mono text-[10px] opacity-60">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark: Black & Gold / Light: White & Cyan) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all cursor-pointer shadow-xs border ${
              isDark
                ? 'bg-black/80 hover:bg-black border-amber-500/40 text-[#ffd700] hover:border-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                : 'bg-white hover:bg-slate-50 border-[#26F7F7] text-[#0891b2] hover:border-cyan-400 shadow-[0_0_12px_rgba(38,247,247,0.3)]'
            }`}
            title={isDark ? 'Switch to Light Mode (White & Electric Cyan)' : 'Switch to Dark Mode (Black & Gold)'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* ==================================================================== */}
        {/* Search Pill */}
        {/* ==================================================================== */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xs relative"
        >
          <Search
            className={`w-4 h-4 absolute left-3 pointer-events-none ${
              isDark ? 'text-amber-500/60' : 'text-[#0891b2]'
            }`}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder || 'Search stories, poems, authors...'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={onOpenSearch}
            className={`w-full pl-9 pr-3 py-1.5 rounded-full text-xs transition-colors focus:outline-hidden ${
              isDark
                ? 'bg-[#101217] text-slate-200 placeholder-slate-500 border border-amber-500/25 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40'
                : 'bg-[#F7FFFF] text-[#182B32] placeholder-[#64748B] border border-[#D9F5F5] focus:border-[#26F7F7] focus:ring-1 focus:ring-[#26F7F7]/50'
            }`}
          />
        </form>

        {/* ==================================================================== */}
        {/* Right Actions: Login/Sign Up or Profile Pill + Menu */}
        {/* ==================================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-serif text-xs font-medium tracking-tight shadow-md transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 max-w-[95px] sm:max-w-none ${
                isDark
                  ? 'bg-[#101217] hover:bg-[#181a24] text-white border border-[#e5b95a]/40'
                  : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5] shadow-xs'
              }`}
              title="View Profile"
            >
              <span className="truncate max-w-[50px] sm:max-w-none">
                {currentUser.displayName?.split(' ')[0] || 'User'}
              </span>
              {currentUser.isVerified || currentUser.isFounder ? (
                <VerifiedBadge size="xs" />
              ) : null}
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className={`text-xs font-serif px-2 sm:px-3 py-1.5 cursor-pointer transition-colors ${
                  isDark ? 'text-slate-300 hover:text-[#f3ba38]' : 'text-[#182B32] hover:text-[#0891b2] font-semibold'
                }`}
              >
                {t.login || 'Login'}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className={`px-2.5 sm:px-4 py-1.5 rounded-full font-serif font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-400 to-[#f3ba38] hover:opacity-95 text-slate-950'
                    : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_2px_12px_rgba(38,247,247,0.35)]'
                }`}
              >
                {t.signUp || 'Sign Up'}
              </button>
            </div>
          )}

          {/* Circular Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isDark
                ? 'border border-amber-500/30 hover:border-amber-400 bg-[#0e1017] hover:bg-[#161822] text-amber-200'
                : 'border border-[#D9F5F5] hover:border-[#26F7F7] bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32]'
            }`}
            title="Menu"
            aria-label="Navigation Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* Menu Drawer Dropdown */}
      {/* ==================================================================== */}
      {menuOpen && (
        <div
          className={`absolute top-16 sm:top-20 right-4 w-80 rounded-3xl p-4 space-y-3 text-xs z-[1050] animate-fade-in border transition-all ${
            isDark
              ? 'bg-[#0a0b10] border-amber-500/40 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(243,186,56,0.25)]'
              : 'bg-white border-[#D9F5F5] text-[#182B32] shadow-[0_20px_50px_rgba(38,247,247,0.2)]'
          }`}
        >
          {/* User Status Card */}
          {currentUser && (
            <div
              className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-black/60 border-amber-500/25' : 'bg-[#F7FFFF] border-[#D9F5F5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-serif font-bold text-sm ${
                      isDark ? 'text-white' : 'text-[#182B32]'
                    }`}
                  >
                    {currentUser.displayName}
                  </span>
                  {currentUser.isVerified || currentUser.isFounder ? (
                    <VerifiedBadge size="sm" />
                  ) : null}
                </div>
              </div>
              <p
                className={`font-mono text-[11px] truncate ${
                  isDark ? 'text-amber-500/70' : 'text-[#64748B]'
                }`}
              >
                {currentUser.email}
              </p>
              {currentUser.instagramHandle && (
                <p className="text-[#0891b2] font-mono text-[10px]">
                  {currentUser.instagramHandle}
                </p>
              )}
            </div>
          )}

          {/* Links */}
          <div className="space-y-1">
            {isFounder && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAdmin();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-950/70 to-black text-amber-200 border border-amber-500/40 hover:bg-black'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                <Sliders className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Admin Console</span>
              </button>
            )}

            {onOpenCommunity && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCommunity();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-serif font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200 border border-emerald-500/30'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                <MessageCircle className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#0891b2]'}`} />
                <span>Join WhatsApp &amp; Instagram Circles</span>
              </button>
            )}

            {onOpenHelpCenter && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHelpCenter();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-serif font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-[#f3ba38] border border-amber-500/30'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                <LifeBuoy className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Help Center &amp; Concierge</span>
              </button>
            )}

            {onOpenCertificateModal && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCertificateModal();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-serif font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-black hover:bg-white/5 text-amber-200 border border-white/10'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                <Award className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Achievement Certificate</span>
              </button>
            )}

            {onOpenEliteCardModal && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenEliteCardModal();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-serif font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-black hover:bg-amber-950/30 text-amber-200 border border-amber-500/30'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border border-[#D9F5F5]'
                }`}
              >
                <CreditCard className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Digital Elite Card</span>
              </button>
            )}

            {onOpenArena && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenArena();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-100 border-amber-400/40'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                }`}
              >
                <Trophy className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>🏆 Literary Arena (Quarterly)</span>
              </button>
            )}

            {onOpenGoldenLibrary && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenGoldenLibrary();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-950/40 to-black hover:opacity-90 text-[#ffd700] border-amber-500/40'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>✦ Golden Library (Curated Classics)</span>
              </button>
            )}

            {onOpenLiteraryPassport && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenLiteraryPassport();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-200 border-indigo-500/30'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                }`}
              >
                <Gift className={`w-4 h-4 ${isDark ? 'text-indigo-300' : 'text-[#0891b2]'}`} />
                <span>✈ Literary Passport (Dedicate &amp; Gift)</span>
              </button>
            )}

            {onOpenPremiumHub && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPremiumHub();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-500/20 via-black to-black hover:opacity-90 text-amber-200 border-amber-400/30'
                    : 'bg-[#F7FFFF] hover:bg-[#E9FFFF] text-[#182B32] border-[#D9F5F5]'
                }`}
              >
                <Crown className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>👑 LEXORA Premium (16 Pillars)</span>
              </button>
            )}
            {onOpenInkVault && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenInkVault();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-[#E9FFFF] text-[#182B32]'
                }`}
              >
                <Lock className={`w-4 h-4 ${isDark ? 'text-[#f3ba38]' : 'text-[#0891b2]'}`} />
                <span>🔐 InkVault (Encrypted Drafts)</span>
              </button>
            )}

            {onOpenLegal && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenLegal();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-[#E9FFFF] text-[#182B32]'
                }`}
              >
                <FileText className={`w-4 h-4 ${isDark ? 'text-amber-500/70' : 'text-[#0891b2]'}`} />
                <span>📜 Terms &amp; Privacy Policy</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSearch();
              }}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-[#E9FFFF] text-[#182B32]'
              }`}
            >
              <Search className={`w-4 h-4 ${isDark ? 'text-amber-500/70' : 'text-[#0891b2]'}`} />
              <span>Explore Masterworks</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenNotifications();
              }}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-[#E9FFFF] text-[#182B32]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${isDark ? 'text-amber-500/70' : 'text-[#0891b2]'}`} />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDark ? 'bg-amber-500 text-slate-950' : 'bg-[#26F7F7] text-[#182B32]'
                }`}>
                  {unreadNotifs}
                </span>
              )}
            </button>

            {!isPremiumSubscriber && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenUpgradeModal();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 cursor-pointer shadow-xs transition-all ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-400 to-[#f3ba38] text-slate-950'
                    : 'bg-[#26F7F7] hover:bg-[#00E5E5] text-[#182B32] shadow-[0_4px_16px_rgba(38,247,247,0.35)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Join VIP Elite (₹299/mo)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenProfile();
              }}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-[#E9FFFF] text-[#182B32]'
              }`}
            >
              <UserIcon className={`w-4 h-4 ${isDark ? 'text-amber-500/70' : 'text-[#0891b2]'}`} />
              <span>My Account &amp; Settings</span>
            </button>

            {onOpenIntro && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenIntro();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-white/5 text-amber-300' : 'hover:bg-[#E9FFFF] text-[#0891b2]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#ffd700]' : 'text-[#0891b2]'}`} />
                <span>Replay LEXORA Intro</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-500 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
