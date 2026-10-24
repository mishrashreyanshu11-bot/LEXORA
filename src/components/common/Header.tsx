import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { FounderBadge, VerifiedBadge } from './FounderBadge';
import { LexoraSymbol } from './LexoraSymbol';
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
  currentScreen = 'home',
  onNavigate,
}) => {
  const { currentUser, isFounder, isPremiumSubscriber, logout, switchUser, allUsers } = useAuth();
  const { notifications } = useStories();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06070a]/95 backdrop-blur-md border-b border-[#e5b95a]/25 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* ==================================================================== */}
        {/* Left: Brand Logo from Image 4 */}
        {/* ==================================================================== */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <LexoraSymbol size={34} glow={true} />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-black tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#ffd700] to-[#dfb15b] uppercase">
              LEXORA
            </span>
            <span className="text-[8px] sm:text-[9px] font-serif font-bold tracking-[0.3em] uppercase text-[#e5b95a] -mt-0.5">
              Radiated Ink
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* Middle: Desktop Nav Links from Image 4 */}
        {/* ==================================================================== */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-serif font-semibold tracking-wide text-slate-300">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative py-1 transition-colors hover:text-[#f3ba38] cursor-pointer ${
              currentScreen === 'home' ? 'text-[#f3ba38] font-bold' : ''
            }`}
          >
            Home
            {currentScreen === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f3ba38] shadow-[0_0_8px_#f3ba38]" />
            )}
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('discover');
            }}
            className={`py-1 transition-colors hover:text-[#f3ba38] cursor-pointer ${
              currentScreen === 'discover' ? 'text-[#f3ba38] font-bold' : ''
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('discover');
            }}
            className="py-1 transition-colors hover:text-[#f3ba38] cursor-pointer"
          >
            Poetry
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('library');
            }}
            className={`py-1 transition-colors hover:text-[#f3ba38] cursor-pointer ${
              currentScreen === 'library' ? 'text-[#f3ba38] font-bold' : ''
            }`}
          >
            Stories
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('community');
            }}
            className={`py-1 transition-colors hover:text-[#f3ba38] cursor-pointer ${
              currentScreen === 'community' ? 'text-[#f3ba38] font-bold' : ''
            }`}
          >
            Essays
          </button>

          {onOpenArena && (
            <button
              onClick={onOpenArena}
              className={`py-1 transition-colors hover:text-[#f3ba38] cursor-pointer flex items-center gap-1 ${
                currentScreen === 'arena' ? 'text-[#f3ba38] font-bold' : 'text-amber-200/90'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#f3ba38]" />
              <span>Challenges</span>
            </button>
          )}
        </nav>

        {/* ==================================================================== */}
        {/* Search Pill from Image 4 */}
        {/* ==================================================================== */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xs relative"
        >
          <Search className="w-4 h-4 text-amber-500/60 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stories, poems, authors..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={onOpenSearch}
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#101217] text-xs text-slate-200 placeholder-slate-500 border border-amber-500/25 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
          />
        </form>

        {/* ==================================================================== */}
        {/* Right Actions: Login/Sign Up or Profile Pill + Menu */}
        {/* ==================================================================== */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#101217] hover:bg-[#181a24] text-white border border-[#e5b95a]/40 font-serif text-xs font-medium tracking-tight shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              title="View Profile"
            >
              <span className="truncate max-w-[100px] sm:max-w-none">
                {currentUser.displayName || 'Shreyanshu'}
              </span>
              {currentUser.isFounder ? (
                <FounderBadge size="xs" showLabel={false} />
              ) : currentUser.isVerified ? (
                <VerifiedBadge size="xs" />
              ) : null}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-serif text-slate-300 hover:text-[#f3ba38] px-3 py-1.5 cursor-pointer transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] hover:opacity-95 text-slate-950 font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Circular Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-500/30 hover:border-amber-400 bg-[#0e1017] hover:bg-[#161822] flex items-center justify-center text-amber-200 transition-all cursor-pointer"
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
        <div className="absolute top-16 sm:top-20 right-4 w-76 bg-[#0a0b10] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(243,186,56,0.25)] border border-amber-500/40 p-4 space-y-3 text-xs z-50 animate-fade-in text-slate-200">
          {/* User Status Card */}
          {currentUser && (
            <div className="p-3.5 bg-black/60 rounded-2xl border border-amber-500/25 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-white text-sm">
                    {currentUser.displayName}
                  </span>
                  {currentUser.isFounder ? (
                    <FounderBadge size="sm" showLabel={false} />
                  ) : currentUser.isVerified ? (
                    <VerifiedBadge size="sm" />
                  ) : null}
                </div>
              </div>
              <p className="text-amber-500/70 font-mono text-[11px] truncate">
                {currentUser.email}
              </p>
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
                className="w-full text-left px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-950/70 to-black text-amber-200 border border-amber-500/40 font-bold flex items-center gap-2 cursor-pointer hover:bg-black"
              >
                <Sliders className="w-4 h-4 text-[#ffd700]" />
                <span>Founder / Admin Console</span>
              </button>
            )}

            {onOpenCertificateModal && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCertificateModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#f3ba38] border border-amber-500/30 font-serif font-bold flex items-center gap-2.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#ffd700]" />
                <span>Achievement Certificate (Image 3)</span>
              </button>
            )}

            {onOpenEliteCardModal && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenEliteCardModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-black hover:bg-amber-950/30 text-amber-200 border border-amber-500/30 font-serif font-bold flex items-center gap-2.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#ffd700]" />
                <span>Digital Elite Card (Image 2)</span>
              </button>
            )}

            {onOpenArena && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenArena();
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 text-amber-100 font-bold flex items-center gap-2.5 cursor-pointer border border-amber-400/40"
              >
                <Trophy className="w-4 h-4 text-[#ffd700]" />
                <span>🏆 Literary Arena (Quarterly)</span>
              </button>
            )}

            {onOpenPremiumHub && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPremiumHub();
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-black to-black hover:opacity-90 text-amber-200 font-bold flex items-center gap-2.5 cursor-pointer border border-amber-400/30"
              >
                <Crown className="w-4 h-4 text-[#ffd700]" />
                <span>👑 LEXORA Premium (16 Pillars)</span>
              </button>
            )}

            {onOpenInkVault && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenInkVault();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#f3ba38]" />
                <span>🔐 InkVault (Encrypted Drafts)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 font-semibold flex items-center gap-2.5 cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-500/70" />
              <span>Explore Masterworks</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenNotifications();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 font-semibold flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-500/70" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
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
                className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#f3ba38] text-slate-950 font-bold flex items-center gap-2.5 cursor-pointer shadow-sm"
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
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 font-semibold flex items-center gap-2.5 cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-amber-500/70" />
              <span>My Account &amp; Settings</span>
            </button>

            {onOpenIntro && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenIntro();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-amber-300 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>Replay LEXORA Intro</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Quick Account Switcher (For testing) */}
          <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/60 block px-1">
              Switch User (Demo):
            </span>
            <div className="flex flex-col gap-1">
              {allUsers.slice(0, 3).map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u);
                    setMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentUser?.id === u.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 font-bold'
                      : 'border-white/5 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="truncate text-xs">{u.displayName}</span>
                  {u.isFounder ? (
                    <FounderBadge size="xs" showLabel={true} />
                  ) : (
                    <span className="text-[10px] text-slate-500 capitalize">{u.role}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
