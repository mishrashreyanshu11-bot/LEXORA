import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AVATAR } from '../../types';
import { FounderBadge } from '../common/FounderBadge';
import { X, Sparkles, UserCheck, ShieldCheck, ArrowRight, UserPlus, LogIn, KeyRound, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { loginWithPassword, register, allUsers, switchUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('mishrashreyanshu11@gmail.com');
  const [password, setPassword] = useState('founder123');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState(''); // MANDATORY
  const [bio, setBio] = useState('');
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
    const res = loginWithPassword(emailOrUsername, password);
    if (res.success) {
      setError(null);
      onClose();
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
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

    const res = register({
      username,
      email,
      displayName: displayName.trim() || username,
      dob,
      bio,
      avatar: avatar.trim() || DEFAULT_AVATAR,
    });

    if (res.success) {
      setError(null);
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleFillFounderCredentials = () => {
    setEmailOrUsername('mishrashreyanshu11@gmail.com');
    setPassword('founder123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#26f7db]">
                LEXORA Authentication
              </span>
            </div>
            <h3 className="text-xl font-bold font-sans-modern tracking-tight">
              {mode === 'login' ? 'Sign in to LEXORA' : 'Create Your Reader & Writer Account'}
            </h3>
            <p className="text-xs text-slate-300">
              {mode === 'login'
                ? 'Founder Access: mishrashreyanshu11@gmail.com with single password.'
                : 'Direct activation — no confirmation email required.'}
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-semibold">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Founder Pre-fill Action */}
              <div
                onClick={handleFillFounderCredentials}
                className="p-3 rounded-2xl bg-amber-50/60 border border-amber-300/70 hover:bg-amber-100/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FounderBadge size="sm" showLabel={false} />
                  <div>
                    <p className="font-bold text-slate-950 text-xs">Official Founder Account</p>
                    <p className="text-[11px] font-mono text-slate-600">mishrashreyanshu11@gmail.com</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-amber-300 font-bold text-[10px]">
                  Fill Credentials
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">Email or Username</label>
                <input
                  type="text"
                  placeholder="mishrashreyanshu11@gmail.com or shreyanshu"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26f7db] focus:border-teal-500 bg-slate-50 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                    <span>Password</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Single Password System</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26f7db] bg-slate-50 text-sm font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#26f7db]" />
                <span>Log In with Password</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Iyer"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26f7db] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Username</label>
                  <input
                    type="text"
                    placeholder="mayaiyer"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>

                {/* DOB MANDATORY */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 flex items-center gap-1">
                    <span>DOB (Mandatory)</span>
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-teal-50/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">Email Address</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900">Short Bio (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="What genres or topics excite you?"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Profile Picture (User chooses or skips for default) */}
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs">Profile Picture</label>
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {avatar ? 'Custom Photo' : 'Default Avatar Assigned'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={avatar || DEFAULT_AVATAR}
                    alt="Avatar preview"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#26f7db] shadow-xs shrink-0 bg-slate-950"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-teal-600" />
                        <span>Choose Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                        <span>URL</span>
                      </button>

                      {avatar && avatar !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar('');
                            setAvatarUrlInput('');
                          }}
                          className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reset to default avatar"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      {avatar && avatar !== DEFAULT_AVATAR
                        ? 'Custom photo chosen. You can also change this later.'
                        : 'Skip to use the default silhouette avatar (can be changed anytime later).'}
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {showUrlInput && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={avatarUrlInput}
                      onChange={e => setAvatarUrlInput(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (avatarUrlInput.trim()) {
                          setAvatar(avatarUrlInput.trim());
                          setShowUrlInput(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#26f7db]" />
                <span>Create Account Instantly</span>
              </button>
            </form>
          )}

          {/* Toggle Mode */}
          <div className="pt-2 text-center border-t border-slate-100">
            {mode === 'login' ? (
              <p className="text-slate-600">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
