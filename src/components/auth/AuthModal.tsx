import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AVATAR } from '../../types';
import { FounderBadge } from '../common/FounderBadge';
import {
  STANDARDIZED_LOCATIONS,
  getStatesForCountry,
  getCitiesForState,
} from '../../data/locations';
import {
  X,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Instagram,
  FileText,
  Calendar,
  Lock,
  MapPin,
  Globe,
} from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  actionPrompt?: string; // Reason why user was prompted (e.g., 'to read chapters' or 'to publish stories')
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  actionPrompt,
}) => {
  const { loginWithPassword, register, allUsers } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Login Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState(''); // MANDATORY
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('Odisha');
  const [cityName, setCityName] = useState('Bhubaneswar');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [bio, setBio] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [avatar, setAvatar] = useState<string>(''); // If empty, will default to DEFAULT_AVATAR
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      setError('Please enter your email or username');
      return;
    }
    if (!loginPassword.trim()) {
      setError('Password is required. Each email is secured with its preexisting password combination.');
      return;
    }

    const res = loginWithPassword(emailOrUsername, loginPassword);
    if (res.success) {
      setError(null);
      onClose();
    } else {
      setError(res.error || 'Authentication failed. Please verify your preexisting password.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !dob) {
      setError('Username, Email, and Date of Birth (DOB) are strictly mandatory.');
      return;
    }
    if (!registerPassword.trim() || registerPassword.length < 4) {
      setError('Please enter a secure password with at least 4 characters.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter matching passwords.');
      return;
    }
    if (!ageConfirmed) {
      setError('Please confirm your Date of Birth before registering.');
      return;
    }

    const cleanInsta = instagramHandle.trim().replace(/^@+/, '');

    const res = register({
      username,
      email,
      password: registerPassword.trim(),
      displayName: displayName.trim() || username,
      dob,
      country,
      state: stateName,
      city: cityName,
      bio: bio.trim(),
      instagramHandle: cleanInsta ? `@${cleanInsta}` : undefined,
      avatar: avatar.trim() || DEFAULT_AVATAR,
    });

    if (res.success) {
      setError(null);
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#090b10] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(243,186,56,0.2)] overflow-hidden border border-amber-500/40 flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-[#101217] to-black text-white flex items-start justify-between border-b border-amber-500/25">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LexoraSymbol size={28} glow={true} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                LEXORA · Beyond the Loop!
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white tracking-tight">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create Free Account'}
            </h3>
            <p className="text-xs text-amber-200/80 font-sans">
              {actionPrompt
                ? `Login or register ${actionPrompt}.`
                : mode === 'login'
                ? 'Each account is secured with its preexisting password combination.'
                : 'Free reading and author studio access with age certification.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 text-rose-200 border border-rose-500/50 font-semibold">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              <div className="space-y-1.5">
                <label className="font-serif font-bold text-slate-200">Email Address or Username</label>
                <input
                  type="text"
                  placeholder="e.g. mishrashreyanshu11@gmail.com or username"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-slate-200 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password (Preexisting Combination)</span>
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">Password Required</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your exact account password..."
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-[0_0_15px_rgba(243,186,56,0.4)] hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In Securely</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-serif font-bold text-slate-200">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Iyer"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-serif font-bold text-slate-200">Username</label>
                  <input
                    type="text"
                    placeholder="mayaiyer"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white font-mono text-xs"
                    required
                  />
                </div>

                {/* DOB MANDATORY */}
                <div className="space-y-1">
                  <label className="font-serif font-bold text-slate-200 flex items-center gap-1">
                    <span>DOB (Mandatory)</span>
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-serif font-bold text-slate-200">Email Address</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs"
                  required
                />
              </div>

              {/* Location Details (Country, State, City) for Regional Discovery */}
              <div className="space-y-2 p-3 rounded-2xl bg-black/50 border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audience &amp; Regional Location</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Used for regional story discovery, Literary Passport targeting, and localized circles. Never shared publicly without permission.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-300 font-medium block mb-1">Country</label>
                    <select
                      value={country}
                      onChange={e => {
                        const newC = e.target.value;
                        setCountry(newC);
                        const states = getStatesForCountry(newC);
                        const firstState = states[0]?.name || '';
                        setStateName(firstState);
                        const cities = getCitiesForState(newC, firstState);
                        setCityName(cities[0] || '');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-black/80 text-white text-xs focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                      {STANDARDIZED_LOCATIONS.map(c => (
                        <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-300 font-medium block mb-1">State / Province</label>
                    <select
                      value={stateName}
                      onChange={e => {
                        const newS = e.target.value;
                        setStateName(newS);
                        const cities = getCitiesForState(country, newS);
                        setCityName(cities[0] || '');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-black/80 text-white text-xs focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                      {getStatesForCountry(country).map(s => (
                        <option key={s.code} value={s.name} className="bg-slate-900 text-white">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-300 font-medium block mb-1">City</label>
                    <select
                      value={cityName}
                      onChange={e => setCityName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-black/80 text-white text-xs focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                      {getCitiesForState(country, stateName).map(city => (
                        <option key={city} value={city} className="bg-slate-900 text-white">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Registration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-serif font-bold text-slate-200 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-serif font-bold text-slate-200">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Age Confirmation Checkbox */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <label className="flex items-start gap-2 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={e => setAgeConfirmed(e.target.checked)}
                    className="accent-amber-400 rounded mt-0.5"
                    required
                  />
                  <span>
                    I confirm my Date of Birth is accurate for age certification, and I understand it can only be modified once a month thereafter.
                  </span>
                </label>
              </div>

              {/* Instagram Handle Before Logging In */}
              <div className="space-y-1">
                <label className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram Handle (Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono">@</span>
                  <input
                    type="text"
                    placeholder="yourhandle or lexora.____"
                    value={instagramHandle}
                    onChange={e => setInstagramHandle(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Bio Before Logging In */}
              <div className="space-y-1">
                <label className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Author &amp; Reader Bio (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="What literary themes or philosophy inspire you?"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-500/30 focus:outline-hidden focus:border-amber-400 bg-black/60 text-white text-xs resize-none"
                />
              </div>

              {/* Dignified Neutral Profile Picture */}
              <div className="space-y-2 p-3 rounded-2xl bg-black/60 border border-amber-500/25">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-slate-200 text-xs">Profile Avatar</label>
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {avatar ? 'Custom Photo' : 'Neutral Silhouette'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={avatar || DEFAULT_AVATAR}
                    alt="Avatar preview"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md shrink-0 bg-black"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-amber-500/30 hover:bg-white/10 text-amber-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-amber-400" />
                        <span>Upload Photo</span>
                      </button>

                      {avatar && avatar !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar('');
                            setAvatarUrlInput('');
                          }}
                          className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reset to default neutral silhouette"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-[0_0_15px_rgba(243,186,56,0.4)] hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Account &amp; Save Credentials</span>
              </button>
            </form>
          )}

          {/* Toggle Mode & Guest Access */}
          <div className="pt-2 text-center border-t border-white/10 space-y-2">
            {mode === 'login' ? (
              <p className="text-slate-400">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-slate-400 hover:text-amber-200 underline pt-1 cursor-pointer transition-colors block mx-auto"
            >
              Continue as Guest Visitor Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
