import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DEFAULT_AVATAR } from '../types';
import { SEED_USERS, FOUNDER_USER } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isFounder: boolean;
  isAdmin: boolean;
  isPremiumSubscriber: boolean;
  userAge: number;
  canAccessAgeRating: (ageRating?: string) => boolean;
  isBirthdayToday: boolean;
  birthdayGreetingShown: boolean;
  dismissBirthdayGreeting: () => void;
  login: (emailOrUsername: string, password?: string) => boolean;
  loginWithPassword: (emailOrUsername: string, password?: string) => { success: boolean; error?: string };
  register: (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    dob: string;
    country?: string;
    state?: string;
    city?: string;
    bio?: string;
    instagramHandle?: string;
    avatar?: string;
  }) => { success: boolean; error?: string };
  updateDob: (newDob: string) => { success: boolean; error?: string };
  updateLocation: (country: string, state?: string, city?: string) => void;
  updateReadingThemePreference: (theme: 'golden' | 'dark' | 'light') => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateLanguagePreference: (scope: 'reading' | 'writing' | 'ui', lang: string) => void;
  recordAudiobookProgress: (data: {
    storyId: string;
    storyTitle: string;
    coverImage: string;
    authorName: string;
    partNumber: number;
    partTitle: string;
    progress: number;
    speed: number;
    voice: string;
    language: string;
  }) => void;
  switchUser: (user: User) => void;
  followWriter: (writerId: string) => void;
  unfollowWriter: (writerId: string) => void;
  isFollowing: (writerId: string) => boolean;
  togglePremiumSubscription: (active: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  awardUserCrownAndVerification: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'lexora_current_user_v3';
const STORAGE_KEY_ALL_USERS = 'lexora_users_v3';
const STORAGE_KEY_CREDENTIALS = 'lexora_credentials_v3';
const STORAGE_KEY_BDAY_DISMISSED = 'lexora_bday_dismissed_';

// Initial pre-registered passwords
const DEFAULT_PASSWORDS: Record<string, string> = {
  'mishrashreyanshu11@gmail.com': 'Swayam11',
  'shreyanshu': 'Swayam11',
  'james.clear@lexora.read': 'password123',
  'jamesclear': 'password123',
  'morgan.housel@lexora.read': 'password123',
  'morganhousel': 'password123',
  'arjun.reader@lexora.com': 'password123',
  'arjun_reads': 'password123',
  'kavya.junior@lexora.com': 'password123',
  'kavya_jr': 'password123',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CREDENTIALS);
      return saved ? { ...DEFAULT_PASSWORDS, ...JSON.parse(saved) } : DEFAULT_PASSWORDS;
    } catch {
      return DEFAULT_PASSWORDS;
    }
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  const [birthdayGreetingShown, setBirthdayGreetingShown] = useState<boolean>(() => {
    if (!currentUser?.dob || !currentUser?.id) return true;
    const year = new Date().getFullYear();
    try {
      return localStorage.getItem(`${STORAGE_KEY_BDAY_DISMISSED}${currentUser.id}_${year}`) === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(credentials));
  }, [credentials]);

  // Founder verification
  const isFounder = Boolean(
    currentUser?.isFounder ||
    currentUser?.email?.toLowerCase() === 'mishrashreyanshu11@gmail.com' ||
    currentUser?.username?.toLowerCase() === 'shreyanshu' ||
    currentUser?.role === 'founder'
  );

  // Admin access is strictly restricted to Founder
  const isAdmin = isFounder;

  // Founder has universal premium access without subscription barrier
  const isPremiumSubscriber = Boolean(currentUser?.isPremiumSubscriber || isFounder);

  // Calculate user age from DOB
  const calculateAge = (dobString?: string): number => {
    if (!dobString) return 20;
    try {
      const bDate = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - bDate.getFullYear();
      const m = today.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
      }
      return Math.max(0, age);
    } catch {
      return 20;
    }
  };

  const userAge = calculateAge(currentUser?.dob);

  // Check age certification for a story
  const canAccessAgeRating = (ageRating?: string): boolean => {
    // Founder / CEO has unrestricted sovereign access to all content
    if (isFounder) return true;
    if (!ageRating || ageRating === '10+') return true;
    if (ageRating === '13+') return userAge >= 13;
    if (ageRating === '16+') return userAge >= 16;
    if (ageRating === '18+') return userAge >= 18;
    return true;
  };

  // Birthday check: matches month and day of user's DOB
  const isBirthdayToday = Boolean(
    currentUser?.dob && (() => {
      try {
        const bDate = new Date(currentUser.dob);
        const today = new Date();
        return (
          bDate.getMonth() === today.getMonth() &&
          bDate.getDate() === today.getDate()
        );
      } catch {
        return false;
      }
    })()
  );

  const dismissBirthdayGreeting = () => {
    if (currentUser) {
      const year = new Date().getFullYear();
      localStorage.setItem(`${STORAGE_KEY_BDAY_DISMISSED}${currentUser.id}_${year}`, 'true');
    }
    setBirthdayGreetingShown(true);
  };

  /**
   * Compulsory Password Authentication:
   * Every email can ONLY be logged into with its preexisting password combination.
   * Multiple devices can enter through the same email, but must supply the exact matching password!
   * mishrashreyanshu11@gmail.com is strictly restricted to "Swayam11".
   */
  const loginWithPassword = (emailOrUsername: string, password?: string): { success: boolean; error?: string } => {
    if (!emailOrUsername || !emailOrUsername.trim()) {
      return { success: false, error: 'Please enter your email address or username.' };
    }
    if (!password || !password.trim()) {
      return { success: false, error: 'Password is required. Please enter your account password.' };
    }

    const clean = emailOrUsername.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check if Founder account: STRICT "Swayam11" validation
    if (
      clean === 'mishrashreyanshu11@gmail.com' ||
      clean === 'mishrashreyanshu11@gmail.con' ||
      clean === 'shreyanshu'
    ) {
      const isCorrectFounderPass = cleanPass === 'Swayam11' || cleanPass.toLowerCase() === 'swayam11';
      if (!isCorrectFounderPass) {
        return {
          success: false,
          error: 'Access denied: Incorrect password for Founder account. Access is restricted to CEO & Founder Shreyanshu Mishra with designated master password.',
        };
      }

      setCurrentUser(FOUNDER_USER);
      return { success: true };
    }

    // 2. Standard User Preexisting Password Validation
    const expectedPassword = credentials[clean];
    if (!expectedPassword) {
      return {
        success: false,
        error: 'No account found for this email. Please check your credentials or create an account with a password.',
      };
    }

    if (expectedPassword !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password for this email account. Multiple devices may access, but the correct preexisting password is compulsory.',
      };
    }

    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true };
    }

    // Dynamic user fallback if in credentials
    const dynamicUser: User = {
      id: `usr_${clean.replace(/[^a-z0-9]/g, '_')}`,
      email: clean,
      username: clean.split('@')[0],
      displayName: clean.split('@')[0],
      dob: '2000-01-01',
      avatar: DEFAULT_AVATAR,
      role: 'reader',
      isVerified: false,
      isFounder: false,
      isPremiumSubscriber: false,
      followingIds: ['usr_founder_shreyanshu'],
      createdAt: new Date().toISOString(),
    };

    setAllUsers(prev => [dynamicUser, ...prev]);
    setCurrentUser(dynamicUser);
    return { success: true };
  };

  const login = (emailOrUsername: string, password?: string): boolean => {
    return loginWithPassword(emailOrUsername, password).success;
  };

  /**
   * User Registration with Compulsory Preexisting Password Assignment
   */
  const register = (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    dob: string;
    country?: string;
    state?: string;
    city?: string;
    bio?: string;
    instagramHandle?: string;
    avatar?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!data.password || data.password.trim().length < 4) {
      return { success: false, error: 'A secure password of at least 4 characters is compulsory.' };
    }

    if (!data.dob) {
      return { success: false, error: 'Date of Birth (DOB) is compulsory to confirm age.' };
    }

    // Age calculation
    const age = calculateAge(data.dob);
    if (age < 10) {
      return { success: false, error: 'You must be at least 10 years old to access LEXORA literature.' };
    }

    // Prevent impersonating founder
    if (cleanEmail === 'mishrashreyanshu11@gmail.com' || cleanUsername === 'shreyanshu') {
      return { success: false, error: 'This official Founder identity is reserved. Please sign in.' };
    }

    // Duplicate email or username check
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in using your preexisting password.' };
    }
    if (allUsers.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    const userAvatar = data.avatar && data.avatar.trim() ? data.avatar.trim() : DEFAULT_AVATAR;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: data.email.trim(),
      username: cleanUsername,
      displayName: data.displayName.trim() || cleanUsername,
      password: data.password.trim(),
      bio: data.bio || '',
      country: data.country || 'India',
      state: data.state || 'Odisha',
      city: data.city || 'Bhubaneswar',
      readingThemePreference: 'dark',
      instagramHandle: data.instagramHandle ? data.instagramHandle.replace('@', '').trim() : undefined,
      socialLinks: data.instagramHandle
        ? { instagram: `https://instagram.com/${data.instagramHandle.replace('@', '').trim()}` }
        : undefined,
      preferredReadingLanguage: 'en',
      preferredWritingLanguage: 'en',
      preferredUiLanguage: 'en',
      avatar: userAvatar,
      dob: data.dob,
      role: 'reader',
      isVerified: false,
      isFounder: false,
      isPremiumSubscriber: false,
      followingIds: ['usr_founder_shreyanshu'],
      createdAt: new Date().toISOString(),
    };

    // Save persistent credentials for this email and username
    setCredentials(prev => ({
      ...prev,
      [cleanEmail]: data.password.trim(),
      [cleanUsername]: data.password.trim(),
    }));

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Sync to backend API
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        username: cleanUsername,
        password: data.password.trim(),
        displayName: newUser.displayName,
        dob: data.dob,
        bio: newUser.bio,
        instagramHandle: newUser.instagramHandle,
        avatar: userAvatar,
      }),
    }).catch(() => {});

    return { success: true };
  };

  /**
   * Edit Date of Birth:
   * Rule: Users can edit their DOB if entered wrong, but at most once a month.
   */
  const updateDob = (newDob: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };
    if (!newDob) return { success: false, error: 'Date of Birth is required.' };

    const now = new Date();
    if (currentUser.dobLastEditedAt) {
      const lastDate = new Date(currentUser.dobLastEditedAt);
      const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        const daysLeft = Math.ceil(30 - diffDays);
        return {
          success: false,
          error: `Date of Birth can only be modified once a month. You can edit again in ${daysLeft} day(s).`,
        };
      }
    }

    const updatedUser = {
      ...currentUser,
      dob: newDob,
      dobLastEditedAt: now.toISOString(),
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    fetch('/api/user/dob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        email: currentUser.email,
        newDob,
        lastEditedAt: currentUser.dobLastEditedAt,
      }),
    }).catch(() => {});

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));

    fetch('/api/user/profile-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        email: currentUser.email,
        instagramHandle: updated.instagramHandle,
        bio: updated.bio,
        preferredReadingLanguage: updated.preferredReadingLanguage,
        preferredWritingLanguage: updated.preferredWritingLanguage,
        preferredUiLanguage: updated.preferredUiLanguage,
      }),
    }).catch(() => {});
  };

  const updateLanguagePreference = (scope: 'reading' | 'writing' | 'ui', lang: string) => {
    if (!currentUser) return;
    const key =
      scope === 'reading'
        ? 'preferredReadingLanguage'
        : scope === 'writing'
        ? 'preferredWritingLanguage'
        : 'preferredUiLanguage';
    updateProfile({ [key]: lang });
  };

  const recordAudiobookProgress = (data: {
    storyId: string;
    storyTitle: string;
    coverImage: string;
    authorName: string;
    partNumber: number;
    partTitle: string;
    progress: number;
    speed: number;
    voice: string;
    language: string;
  }) => {
    if (!currentUser) return;
    const history = currentUser.audiobookHistory || [];
    const existingIndex = history.findIndex(h => h.storyId === data.storyId);
    const newEntry = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    let updatedHistory = [...history];
    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = newEntry;
    } else {
      updatedHistory.unshift(newEntry);
    }
    if (updatedHistory.length > 20) updatedHistory = updatedHistory.slice(0, 20);

    updateProfile({ audiobookHistory: updatedHistory });
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const followWriter = (writerId: string) => {
    if (!currentUser) return;
    if (currentUser.followingIds.includes(writerId)) return;
    updateProfile({ followingIds: [...(currentUser.followingIds || []), writerId] });
  };

  const unfollowWriter = (writerId: string) => {
    if (!currentUser) return;
    updateProfile({
      followingIds: (currentUser.followingIds || []).filter(id => id !== writerId),
    });
  };

  const isFollowing = (writerId: string): boolean => {
    return Boolean(currentUser?.followingIds?.includes(writerId));
  };

  const togglePremiumSubscription = (active: boolean) => {
    if (!currentUser) return;
    updateProfile({
      isPremiumSubscriber: active,
      subscriptionExpiry: active ? '2030-12-31' : undefined,
    });
  };

  const toggleUserVerification = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, isVerified: !prev.isVerified } : null));
    }
  };

  const awardUserCrownAndVerification = (userId: string) => {
    const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setAllUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              hasCrownBadge: true,
              isVerified: true,
              verifiedUntil: oneMonthLater,
              challengeWins: (u.challengeWins || 0) + 1,
            }
          : u
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev =>
        prev
          ? {
              ...prev,
              hasCrownBadge: true,
              isVerified: true,
              verifiedUntil: oneMonthLater,
              challengeWins: (prev.challengeWins || 0) + 1,
            }
          : null
      );
    }
  };

  const updateLocation = (country: string, state?: string, city?: string) => {
    if (!currentUser) return;
    updateProfile({ country, state, city });
  };

  const updateReadingThemePreference = (theme: 'golden' | 'dark' | 'light') => {
    if (!currentUser) return;
    updateProfile({ readingThemePreference: theme });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isFounder,
        isAdmin,
        isPremiumSubscriber,
        userAge,
        canAccessAgeRating,
        isBirthdayToday,
        birthdayGreetingShown,
        dismissBirthdayGreeting,
        login,
        loginWithPassword,
        register,
        updateDob,
        updateLocation,
        updateReadingThemePreference,
        logout,
        updateProfile,
        updateLanguagePreference,
        recordAudiobookProgress,
        switchUser,
        followWriter,
        unfollowWriter,
        isFollowing,
        togglePremiumSubscription,
        toggleUserVerification,
        awardUserCrownAndVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
