import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DEFAULT_AVATAR } from '../types';
import { SEED_USERS, FOUNDER_USER } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isFounder: boolean;
  isAdmin: boolean;
  isPremiumSubscriber: boolean;
  login: (emailOrUsername: string, password?: string) => boolean;
  loginWithPassword: (emailOrUsername: string, password?: string) => { success: boolean; error?: string };
  register: (data: {
    username: string;
    email: string;
    displayName: string;
    dob: string;
    bio?: string;
    avatar?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchUser: (user: User) => void;
  followWriter: (writerId: string) => void;
  unfollowWriter: (writerId: string) => void;
  isFollowing: (writerId: string) => boolean;
  togglePremiumSubscription: (active: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  awardUserCrownAndVerification: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'lexora_current_user_v2';
const STORAGE_KEY_ALL_USERS = 'lexora_users_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      // Default to Founder mishrashreyanshu11@gmail.com
      return FOUNDER_USER;
    } catch {
      return FOUNDER_USER;
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

  const isFounder = Boolean(
    currentUser?.isFounder || 
    currentUser?.email.toLowerCase() === 'mishrashreyanshu11@gmail.com' ||
    currentUser?.role === 'founder'
  );

  const isAdmin = isFounder || currentUser?.role === 'admin';
  const isPremiumSubscriber = Boolean(currentUser?.isPremiumSubscriber || isFounder);

  /**
   * Founder Authentication:
   * mishrashreyanshu11@gmail.com requires the designated Founder master password.
   * Other passwords are strictly rejected for security and authenticity.
   */
  const FOUNDER_VALID_PASSWORDS = [
    'Shreyanshu#2026',
    'LexoraFounder11',
    'Shreyanshu11*',
    'Shreyanshu11',
    'Founder@Lexora',
    'Lexora@2026',
  ];

  const loginWithPassword = (emailOrUsername: string, password?: string): { success: boolean; error?: string } => {
    const clean = emailOrUsername.trim().toLowerCase();

    // Check if Founder account
    if (
      clean === 'mishrashreyanshu11@gmail.com' ||
      clean === 'mishrashreyanshu11@gmail.con' ||
      clean === 'shreyanshu'
    ) {
      if (!password || !password.trim()) {
        return { success: false, error: 'Please enter your Founder password.' };
      }

      // Check against designated founder passwords
      const isCorrectFounderPass = FOUNDER_VALID_PASSWORDS.includes(password.trim());
      if (!isCorrectFounderPass) {
        return {
          success: false,
          error: 'Incorrect password for Founder account. Access restricted to CEO & Founder Shreyanshu Mishra.',
        };
      }

      setCurrentUser(FOUNDER_USER);
      return { success: true };
    }

    const found = allUsers.find(
      u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    return { success: false, error: 'Account not found. Please check your credentials or sign up.' };
  };

  const login = (emailOrUsername: string, password?: string): boolean => {
    return loginWithPassword(emailOrUsername, password).success;
  };

  const register = (data: {
    username: string;
    email: string;
    displayName: string;
    dob: string;
    bio?: string;
    avatar?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!data.dob) {
      return { success: false, error: 'Date of Birth is mandatory for compliance and age controls.' };
    }

    // Age calculation
    const birthDate = new Date(data.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      return { success: false, error: 'You must be at least 13 years old to join LEXORA.' };
    }

    // Check duplicate
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (allUsers.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken.' };
    }

    const isOfficialFounder = cleanEmail === 'mishrashreyanshu11@gmail.com';

    // User chooses avatar or skips to DEFAULT_AVATAR (/assets/aistudio/IMG_6033_dd143268.jpeg)
    const userAvatar = data.avatar && data.avatar.trim() ? data.avatar.trim() : DEFAULT_AVATAR;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: data.email.trim(),
      username: cleanUsername,
      displayName: data.displayName.trim() || cleanUsername,
      bio: data.bio || '',
      avatar: userAvatar,
      dob: data.dob,
      role: isOfficialFounder ? 'founder' : 'reader',
      isVerified: isOfficialFounder,
      isFounder: isOfficialFounder,
      isPremiumSubscriber: isOfficialFounder,
      followingIds: ['usr_founder_shreyanshu', 'usr_author_james_clear'],
      createdAt: new Date().toISOString(),
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const followWriter = (writerId: string) => {
    if (!currentUser || currentUser.id === writerId) return;
    const currentFollowing = currentUser.followingIds || [];
    if (!currentFollowing.includes(writerId)) {
      updateProfile({
        followingIds: [...currentFollowing, writerId],
      });
    }
  };

  const unfollowWriter = (writerId: string) => {
    if (!currentUser) return;
    const currentFollowing = currentUser.followingIds || [];
    updateProfile({
      followingIds: currentFollowing.filter(id => id !== writerId),
    });
  };

  const isFollowing = (writerId: string): boolean => {
    if (!currentUser) return false;
    return (currentUser.followingIds || []).includes(writerId);
  };

  const togglePremiumSubscription = (active: boolean) => {
    if (!currentUser) return;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    updateProfile({
      isPremiumSubscriber: active,
      subscriptionExpiry: active ? nextDate.toISOString() : undefined,
    });
  };

  /**
   * Founder Privilege: Manage verification across the platform
   */
  const toggleUserVerification = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = !u.isVerified;
          return { ...u, isVerified: newStatus };
        }
        return u;
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, isVerified: !prev.isVerified } : null));
    }
  };

  /**
   * Challenge Winner Grand Prize:
   * 1. 👑 Crown badge above avatar
   * 2. 1 Month Free Verification (isVerified: true with 30-day verifiedUntil)
   * 3. Increments challengeWins
   */
  const awardUserCrownAndVerification = (userId: string) => {
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            hasCrownBadge: true,
            isVerified: true,
            verifiedUntil: expiry,
            challengeWins: (u.challengeWins || 0) + 1,
          };
        }
        return u;
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev =>
        prev
          ? {
              ...prev,
              hasCrownBadge: true,
              isVerified: true,
              verifiedUntil: expiry,
              challengeWins: (prev.challengeWins || 0) + 1,
            }
          : null
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isFounder,
        isAdmin,
        isPremiumSubscriber,
        login,
        loginWithPassword,
        register,
        logout,
        updateProfile,
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
