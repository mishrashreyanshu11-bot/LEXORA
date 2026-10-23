import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoryContext';
import { FounderBadge, VerifiedBadge } from './FounderBadge';
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
  Scale,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onOpenUpgradeModal: () => void;
  onOpenProfile: () => void;
  onOpenIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin,
  onOpenUpgradeModal,
  onOpenProfile,
  onOpenIntro,
}) => {
  const { currentUser, isFounder, isPremiumSubscriber, logout, switchUser, allUsers } = useAuth();
  const { notifications } = useStories();

  const [menuOpen, setMenuOpen] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Brand Logo matching the exact image: "Vellum." */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1 cursor-pointer group select-none"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-slate-950 flex items-center">
            Vellum
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#26F7F7] ml-0.5 shadow-[0_0_6px_#26F7F7]" />
          </span>
        </div>

        {/* Right Actions: User Name Pill + Circular Menu */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-tight shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="View Profile"
            >
              <span>{currentUser.displayName || 'Shreyanshu'}</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-tight shadow-xs transition-all cursor-pointer"
            >
              Log in
            </button>
          )}

          {/* Circular Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-800 transition-all cursor-pointer"
            title="Menu"
            aria-label="Navigation Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Menu Drawer Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 space-y-3 text-xs z-50 animate-fade-in">
          {/* User Status Card */}
          {currentUser && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">{currentUser.displayName}</span>
                  {currentUser.isFounder ? (
                    <FounderBadge size="sm" showLabel={false} />
                  ) : currentUser.isVerified ? (
                    <VerifiedBadge size="sm" />
                  ) : null}
                </div>
              </div>
              <p className="text-slate-400 font-mono text-[11px] truncate">{currentUser.email}</p>
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
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-950 text-white font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-800"
              >
                <Sliders className="w-4 h-4 text-[#26F7F7]" />
                <span>Founder / Admin Console</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2.5 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explore Famous Writings</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenNotifications();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-slate-400" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
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
                className="w-full text-left px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-950 font-bold flex items-center gap-2.5 cursor-pointer border border-[#26F7F7]/40"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Vellum Premium (₹299/mo)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenProfile();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2.5 cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>My Account &amp; Settings</span>
            </button>

            {onOpenIntro && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenIntro();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-cyan-50/80 text-cyan-950 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#00c9af]" />
                <span>Vellum Intro</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Quick Account Switcher */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-1">
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
                    currentUser?.id === u.id ? 'bg-teal-50/70 border-[#26F7F7] font-bold' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate text-xs">{u.displayName}</span>
                  {u.isFounder ? (
                    <span className="text-[10px] font-mono font-bold text-teal-600">Founder</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
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
