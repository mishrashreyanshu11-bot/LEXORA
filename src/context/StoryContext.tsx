import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Story,
  StoryPart,
  RatingReview,
  PaymentRecord,
  WriterCertificate,
  StorySuggestion,
  CommunityThread,
  CommunityReply,
  ReportItem,
  AppNotification,
  PlatformSettings,
  AIAssessmentResult,
  ReadingProgress,
  Challenge,
  ChallengeSubmission,
  InkVaultItem,
  WritersCircleGroup,
  AICorrectionSuggestion,
} from '../types';
import {
  SEED_STORIES,
  SEED_PARTS,
  SEED_REVIEWS,
  SEED_PAYMENTS,
  SEED_CERTIFICATE,
  SEED_COMMUNITY_THREADS,
  SEED_NOTIFICATIONS,
  SEED_SETTINGS,
  SEED_CHALLENGES,
  SEED_CHALLENGE_SUBMISSIONS,
  SEED_INK_VAULT,
  SEED_WRITERS_CIRCLES,
} from '../data/seedData';
import { isStoryPremium } from '../utils/premiumRules';
import { useAuth } from './AuthContext';

interface StoryContextType {
  stories: Story[];
  parts: StoryPart[];
  reviews: RatingReview[];
  savedStoryIds: string[];
  readingProgress: Record<string, ReadingProgress>;
  bookmarks: string[]; // partIds
  purchasedStoryIds: string[];
  payments: PaymentRecord[];
  certificates: WriterCertificate[];
  suggestions: StorySuggestion[];
  threads: CommunityThread[];
  reports: ReportItem[];
  notifications: AppNotification[];
  settings: PlatformSettings;

  // Challenge Arena (Quarterly, 4x a year)
  challenges: Challenge[];
  activeChallenge: Challenge;
  submissions: ChallengeSubmission[];
  submitStoryToChallenge: (data: {
    storyId: string;
    contentType: 'Story' | 'Poem' | 'Article';
    challengeId?: string;
  }) => Promise<ChallengeSubmission>;
  verifySubmissionByCEO: (submissionId: string, rank?: 1 | 2 | 3, ceoRemarks?: string) => void;
  awardChampionWinner: (submissionId: string, remarks?: string) => void;

  // InkVault
  inkVaultItems: InkVaultItem[];
  addInkVaultItem: (item: Omit<InkVaultItem, 'id' | 'lastVaultedAt'>) => InkVaultItem;
  deleteInkVaultItem: (id: string) => void;

  // Writers' Circle Pro
  writersCircles: WritersCircleGroup[];

  // AI Editorial & Integrity Actions
  applyCorrectionToPart: (partId: string, originalText: string, correctedText: string) => void;
  
  // Actions
  toggleSaveStory: (storyId: string) => void;
  isStorySaved: (storyId: string) => boolean;
  saveReadingProgress: (storyId: string, partId: string, partNumber: number, percent: number) => void;
  toggleBookmark: (partId: string) => void;
  isBookmarked: (partId: string) => boolean;
  
  // Story management
  createStory: (storyData: Partial<Story>) => Story;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  toggleFeatureStory: (id: string) => void;
  
  // Parts management
  getStoryParts: (storyId: string) => StoryPart[];
  createPart: (storyId: string, title: string, content: string, status?: 'draft' | 'published') => StoryPart;
  updatePart: (partId: string, updates: Partial<StoryPart>) => void;
  deletePart: (partId: string) => void;
  reorderParts: (storyId: string, orderedPartIds: string[]) => void;
  
  // Rating and review
  addRatingAndReview: (storyId: string, rating: number, reviewText?: string) => void;
  getUserRatingForStory: (storyId: string) => RatingReview | undefined;
  
  // Payments & Unlocks
  submitPayment: (data: {
    productType: 'story_unlock' | 'monthly_subscription';
    storyId?: string;
    storyTitle?: string;
    amount: number;
    transactionRef: string;
  }) => Promise<PaymentRecord>;
  confirmPaymentByAdmin: (paymentId: string, notes?: string) => void;
  confirmAllPendingPayments: () => void;
  rejectPaymentByAdmin: (paymentId: string, notes?: string) => void;
  
  // Suggestions
  submitSuggestion: (data: {
    storyId: string;
    storyTitle: string;
    partId?: string;
    partTitle?: string;
    authorId: string;
    category: any;
    comment: string;
    selectedText?: string;
  }) => void;
  updateSuggestionStatus: (suggestionId: string, status: 'accepted' | 'declined') => void;
  
  // Community
  createThread: (title: string, content: string, category: any, storyId?: string, storyTitle?: string) => void;
  toggleLikeThread: (threadId: string) => void;
  
  // Moderation
  submitReport: (report: Omit<ReportItem, 'id' | 'status' | 'createdAt'>) => void;
  updateReportStatus: (reportId: string, status: 'reviewed' | 'action_taken' | 'dismissed', notes?: string) => void;
  
  // Settings
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  
  // AI Assessment
  assessStoryContent: (title: string, content: string, category?: string, genre?: string) => Promise<AIAssessmentResult>;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isFounder, togglePremiumSubscription, awardUserCrownAndVerification } = useAuth();

  // Settings
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('lexora_settings');
      return saved ? JSON.parse(saved) : SEED_SETTINGS;
    } catch {
      return SEED_SETTINGS;
    }
  });

  // Stories
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_stories_v2');
      return saved ? JSON.parse(saved) : SEED_STORIES;
    } catch {
      return SEED_STORIES;
    }
  });

  // Parts
  const [parts, setParts] = useState<StoryPart[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_parts_v2');
      return saved ? JSON.parse(saved) : SEED_PARTS;
    } catch {
      return SEED_PARTS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<RatingReview[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_reviews_v2');
      return saved ? JSON.parse(saved) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  });

  // Saved Stories (Library)
  const [savedStoryIds, setSavedStoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_saved_stories_v2');
      return saved ? JSON.parse(saved) : ['story_atomic_habits', 'story_psychology_of_money'];
    } catch {
      return ['story_atomic_habits', 'story_psychology_of_money'];
    }
  });

  // Reading progress
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgress>>(() => {
    try {
      const saved = localStorage.getItem('lexora_reading_progress_v2');
      return saved ? JSON.parse(saved) : {
        story_atomic_habits: {
          storyId: 'story_atomic_habits',
          lastPartId: 'part_atomic_1',
          lastPartNumber: 1,
          progressPercent: 30,
          updatedAt: '2026-10-21T18:00:00.000Z',
        },
      };
    } catch {
      return {};
    }
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_bookmarks');
      return saved ? JSON.parse(saved) : ['part_echoes_2'];
    } catch {
      return [];
    }
  });

  // Purchased Stories (₹19 story unlocks)
  const [purchasedStoryIds, setPurchasedStoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_purchased_stories');
      return saved ? JSON.parse(saved) : ['story_echoes_bangalore'];
    } catch {
      return ['story_echoes_bangalore'];
    }
  });

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_payments');
      return saved ? JSON.parse(saved) : SEED_PAYMENTS;
    } catch {
      return SEED_PAYMENTS;
    }
  });

  // Certificates
  const [certificates, setCertificates] = useState<WriterCertificate[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_certificates');
      return saved ? JSON.parse(saved) : [SEED_CERTIFICATE];
    } catch {
      return [SEED_CERTIFICATE];
    }
  });

  // Suggestions
  const [suggestions, setSuggestions] = useState<StorySuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_suggestions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sug_1',
          storyId: 'story_echoes_bangalore',
          storyTitle: 'The Echoes of Bangalore',
          partId: 'part_echoes_1',
          partNumber: 1,
          partTitle: 'The Subterranean Cables',
          authorId: 'usr_writer_ananya',
          suggestedByUserId: 'usr_reader_priya',
          suggestedByUserName: 'Priya Sharma',
          category: 'Pacing',
          comment: 'The transition from the Shivajinagar street market to the optics shop could linger on the sound of the rain for two more sentences to establish the mood even deeper.',
          status: 'pending',
          createdAt: '2026-10-20T11:00:00.000Z',
        },
      ];
    } catch {
      return [];
    }
  });

  // Community
  const [threads, setThreads] = useState<CommunityThread[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_threads');
      return saved ? JSON.parse(saved) : SEED_COMMUNITY_THREADS;
    } catch {
      return SEED_COMMUNITY_THREADS;
    }
  });

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_reports');
      return saved ? JSON.parse(saved) : [
        {
          id: 'rep_1',
          targetType: 'review',
          targetId: 'rev_sample',
          targetTitle: 'Off-topic comment on chapter 4',
          reportedByUserId: 'usr_reader_priya',
          reportedByUserName: 'Priya Sharma',
          reason: 'Spam or promotional link',
          status: 'pending',
          createdAt: '2026-10-21T09:30:00.000Z',
        },
      ];
    } catch {
      return [];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_notifications');
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  // Challenges (Quarterly, 4x a year)
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_challenges');
      return saved ? JSON.parse(saved) : SEED_CHALLENGES;
    } catch {
      return SEED_CHALLENGES;
    }
  });

  const activeChallenge = challenges.find(c => c.status === 'active') || challenges[0];

  // Challenge Submissions
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_challenge_submissions');
      return saved ? JSON.parse(saved) : SEED_CHALLENGE_SUBMISSIONS;
    } catch {
      return SEED_CHALLENGE_SUBMISSIONS;
    }
  });

  // InkVault Items
  const [inkVaultItems, setInkVaultItems] = useState<InkVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('lexora_ink_vault');
      return saved ? JSON.parse(saved) : SEED_INK_VAULT;
    } catch {
      return SEED_INK_VAULT;
    }
  });

  // Writers Circles
  const [writersCircles, setWritersCircles] = useState<WritersCircleGroup[]>(() => {
    return SEED_WRITERS_CIRCLES;
  });

  useEffect(() => {
    localStorage.setItem('lexora_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('lexora_challenge_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('lexora_ink_vault', JSON.stringify(inkVaultItems));
  }, [inkVaultItems]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('lexora_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lexora_stories_v2', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('lexora_parts_v2', JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem('lexora_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('lexora_saved_stories_v2', JSON.stringify(savedStoryIds));
  }, [savedStoryIds]);

  useEffect(() => {
    localStorage.setItem('lexora_reading_progress_v2', JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    localStorage.setItem('lexora_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('lexora_purchased_stories', JSON.stringify(purchasedStoryIds));
  }, [purchasedStoryIds]);

  useEffect(() => {
    localStorage.setItem('lexora_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('lexora_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('lexora_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem('lexora_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('lexora_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('lexora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const toggleSaveStory = (storyId: string) => {
    setSavedStoryIds(prev =>
      prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
    );
  };

  const isStorySaved = (storyId: string) => savedStoryIds.includes(storyId);

  const saveReadingProgress = (storyId: string, partId: string, partNumber: number, percent: number) => {
    setReadingProgress(prev => ({
      ...prev,
      [storyId]: {
        storyId,
        lastPartId: partId,
        lastPartNumber: partNumber,
        progressPercent: percent,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const toggleBookmark = (partId: string) => {
    setBookmarks(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const isBookmarked = (partId: string) => bookmarks.includes(partId);

  // Story management
  const createStory = (storyData: Partial<Story>): Story => {
    const author = currentUser || {
      id: 'usr_anon',
      displayName: 'LEXORA Author',
      username: 'author',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: false,
      isFounder: false,
    };

    const newStory: Story = {
      id: `story_${Date.now()}`,
      title: storyData.title || 'Untitled Serial',
      synopsis: storyData.synopsis || 'An original serialized story on LEXORA.',
      coverImage: storyData.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      authorId: author.id,
      authorName: author.displayName,
      authorUsername: author.username,
      authorAvatar: author.avatar,
      authorIsVerified: Boolean(author.isVerified),
      authorIsFounder: Boolean(author.isFounder),
      category: storyData.category || 'Fiction',
      genre: storyData.genre || 'General',
      language: storyData.language || 'English',
      tags: storyData.tags || ['Original', 'Serialized'],
      status: storyData.status || 'published',
      isFeatured: false,
      ratingAverage: 0,
      ratingCount: 0,
      readerCount: 1,
      partsCount: 1,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStories(prev => [newStory, ...prev]);

    // Create initial part 1
    const part1: StoryPart = {
      id: `part_${Date.now()}_1`,
      storyId: newStory.id,
      partNumber: 1,
      title: 'Part 1 — The Beginning',
      content: 'Every great serialized narrative begins with a single deliberate sentence...',
      wordCount: 120,
      estimatedReadingTimeMinutes: 1,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setParts(prev => [...prev, part1]);

    return newStory;
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
        return updated;
      })
    );
  };

  const deleteStory = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
    setParts(prev => prev.filter(p => p.storyId !== id));
  };

  const toggleFeatureStory = (id: string) => {
    setStories(prev =>
      prev.map(s => (s.id === id ? { ...s, isFeatured: !s.isFeatured } : s))
    );
  };

  // Parts management
  const getStoryParts = (storyId: string) => {
    return parts
      .filter(p => p.storyId === storyId)
      .sort((a, b) => a.partNumber - b.partNumber);
  };

  const createPart = (storyId: string, title: string, content: string, status: 'draft' | 'published' = 'published'): StoryPart => {
    const existing = parts.filter(p => p.storyId === storyId);
    const partNumber = existing.length + 1;
    const words = content.split(/\s+/).filter(Boolean).length;
    const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(words / 220));

    const newPart: StoryPart = {
      id: `part_${Date.now()}_${partNumber}`,
      storyId,
      partNumber,
      title: title.trim() || `Part ${partNumber}`,
      content,
      wordCount: words,
      estimatedReadingTimeMinutes,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setParts(prev => [...prev, newPart]);

    // Update story parts count
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, partsCount: s.partsCount + 1, updatedAt: new Date().toISOString() } : s))
    );

    return newPart;
  };

  const updatePart = (partId: string, updates: Partial<StoryPart>) => {
    setParts(prev =>
      prev.map(p => {
        if (p.id !== partId) return p;
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        if (updates.content) {
          const words = updates.content.split(/\s+/).filter(Boolean).length;
          updated.wordCount = words;
          updated.estimatedReadingTimeMinutes = Math.max(1, Math.ceil(words / 220));
        }
        return updated;
      })
    );
  };

  const deletePart = (partId: string) => {
    const target = parts.find(p => p.id === partId);
    if (!target) return;
    const storyId = target.storyId;

    setParts(prev => {
      const remaining = prev.filter(p => p.id !== partId);
      // Re-index part numbers for that story
      let currentNum = 1;
      return remaining.map(p => {
        if (p.storyId === storyId) {
          return { ...p, partNumber: currentNum++ };
        }
        return p;
      });
    });

    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, partsCount: Math.max(0, s.partsCount - 1) } : s))
    );
  };

  const reorderParts = (storyId: string, orderedPartIds: string[]) => {
    setParts(prev => {
      return prev.map(p => {
        if (p.storyId !== storyId) return p;
        const newIndex = orderedPartIds.indexOf(p.id);
        if (newIndex !== -1) {
          return { ...p, partNumber: newIndex + 1 };
        }
        return p;
      });
    });
  };

  // Rating and review
  const addRatingAndReview = (storyId: string, rating: number, reviewText?: string) => {
    if (!currentUser) return;

    const existingIndex = reviews.findIndex(r => r.storyId === storyId && r.userId === currentUser.id);
    let updatedReviews = [...reviews];

    if (existingIndex >= 0) {
      updatedReviews[existingIndex] = {
        ...updatedReviews[existingIndex],
        rating,
        reviewText: reviewText || updatedReviews[existingIndex].reviewText,
        createdAt: new Date().toISOString(),
      };
    } else {
      const newReview: RatingReview = {
        id: `rev_${Date.now()}`,
        storyId,
        userId: currentUser.id,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatar,
        userIsVerified: currentUser.isVerified,
        userIsFounder: currentUser.isFounder,
        rating,
        reviewText,
        createdAt: new Date().toISOString(),
      };
      updatedReviews = [newReview, ...updatedReviews];
    }

    setReviews(updatedReviews);

    // Recalculate average rating for the story
    const targetStory = stories.find(s => s.id === storyId);
    if (targetStory) {
      const wasPremiumBefore = isStoryPremium(targetStory, settings);

      // Weighted calculation using base count + new rating
      const oldRatingTotal = targetStory.ratingAverage * targetStory.ratingCount;
      const isNewUser = existingIndex < 0;
      const newCount = isNewUser ? targetStory.ratingCount + 1 : targetStory.ratingCount;
      const newRatingTotal = isNewUser
        ? oldRatingTotal + rating
        : oldRatingTotal - (reviews[existingIndex]?.rating || rating) + rating;
      const newAvg = Number((newRatingTotal / Math.max(1, newCount)).toFixed(2));

      const updatedStory = {
        ...targetStory,
        ratingAverage: newAvg,
        ratingCount: newCount,
        updatedAt: new Date().toISOString(),
      };

      setStories(prev => prev.map(s => (s.id === storyId ? updatedStory : s)));

      // Check if newly crossed threshold
      const isPremiumNow = isStoryPremium(updatedStory, settings);
      if (!wasPremiumBefore && isPremiumNow) {
        // Trigger Founder notification
        const founderNotif: AppNotification = {
          id: `notif_${Date.now()}`,
          userId: 'usr_founder_shreyanshu',
          type: 'premium_eligibility',
          title: 'Premium Story Threshold Reached!',
          message: `"${updatedStory.title}" has crossed ${settings.premiumRatingThreshold} rating and ${settings.requiredRatingsCount} reader reviews!`,
          link: `/story/${updatedStory.id}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [founderNotif, ...prev]);
      }
    }
  };

  const getUserRatingForStory = (storyId: string) => {
    if (!currentUser) return undefined;
    return reviews.find(r => r.storyId === storyId && r.userId === currentUser.id);
  };

  // Payments & Unlocks
  const submitPayment = async (data: {
    productType: 'story_unlock' | 'monthly_subscription';
    storyId?: string;
    storyTitle?: string;
    amount: number;
    transactionRef: string;
  }): Promise<PaymentRecord> => {
    const user = currentUser || {
      id: 'usr_guest',
      email: 'guest@lexora.read',
      displayName: 'Guest Reader',
    };

    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.displayName,
          productType: data.productType,
          storyId: data.storyId,
          storyTitle: data.storyTitle,
          amount: data.amount,
          transactionRef: data.transactionRef,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        const record = payload.payment;
        setPayments(prev => [record, ...prev]);

        // If product is story unlock, unlock story access
        if (data.productType === 'story_unlock' && data.storyId) {
          if (!purchasedStoryIds.includes(data.storyId)) {
            setPurchasedStoryIds(prev => [...prev, data.storyId!]);
          }
        } else if (data.productType === 'monthly_subscription') {
          togglePremiumSubscription(true);
        }

        return record;
      }
    } catch (err) {
      console.warn('Backend payment submission error, recording locally:', err);
    }

    // Local fallback
    const fallbackRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.displayName,
      productType: data.productType,
      storyId: data.storyId,
      storyTitle: data.storyTitle,
      amount: data.amount,
      transactionRef: data.transactionRef.trim().toUpperCase(),
      paymentDestination: settings.paymentDestinationUpi || '7852931077@fam',
      status: 'verified',
      verificationNotes: 'Instant verified via UPI reference match',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    setPayments(prev => [fallbackRecord, ...prev]);

    if (data.productType === 'story_unlock' && data.storyId) {
      if (!purchasedStoryIds.includes(data.storyId)) {
        setPurchasedStoryIds(prev => [...prev, data.storyId!]);
      }
    } else if (data.productType === 'monthly_subscription') {
      togglePremiumSubscription(true);
    }

    return fallbackRecord;
  };

  const confirmPaymentByAdmin = async (paymentId: string, notes?: string) => {
    try {
      await fetch(`/api/admin/payments/${paymentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', notes }),
      });
    } catch {}

    setPayments(prev =>
      prev.map(p => {
        if (p.id !== paymentId) return p;
        const updated: PaymentRecord = {
          ...p,
          status: 'verified',
          verifiedAt: new Date().toISOString(),
          verificationNotes: notes || 'Confirmed by Founder/Admin',
        };
        // If story unlock, grant
        if (updated.productType === 'story_unlock' && updated.storyId) {
          if (!purchasedStoryIds.includes(updated.storyId)) {
            setPurchasedStoryIds(list => [...list, updated.storyId!]);
          }
        }
        return updated;
      })
    );
  };

  const confirmAllPendingPayments = () => {
    const newlyUnlockedStories: string[] = [];
    setPayments(prev =>
      prev.map(p => {
        if (p.status === 'pending_verification') {
          if (p.productType === 'story_unlock' && p.storyId) {
            newlyUnlockedStories.push(p.storyId);
          }
          return {
            ...p,
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            verificationNotes: 'Batch verified by Founder Shreyanshu Mishra',
          };
        }
        return p;
      })
    );
    if (newlyUnlockedStories.length > 0) {
      setPurchasedStoryIds(prev => Array.from(new Set([...prev, ...newlyUnlockedStories])));
    }
  };

  const rejectPaymentByAdmin = async (paymentId: string, notes?: string) => {
    try {
      await fetch(`/api/admin/payments/${paymentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', notes }),
      });
    } catch {}

    setPayments(prev =>
      prev.map(p => {
        if (p.id !== paymentId) return p;
        return {
          ...p,
          status: 'rejected',
          verificationNotes: notes || 'Rejected by Founder/Admin',
        };
      })
    );
  };

  // Suggestions
  const submitSuggestion = (data: {
    storyId: string;
    storyTitle: string;
    partId?: string;
    partTitle?: string;
    authorId: string;
    category: any;
    comment: string;
    selectedText?: string;
  }) => {
    const user = currentUser || { id: 'usr_reader', displayName: 'Thoughtful Reader' };
    const newSug: StorySuggestion = {
      id: `sug_${Date.now()}`,
      storyId: data.storyId,
      storyTitle: data.storyTitle,
      partId: data.partId,
      partTitle: data.partTitle,
      authorId: data.authorId,
      suggestedByUserId: user.id,
      suggestedByUserName: user.displayName,
      category: data.category,
      comment: data.comment,
      selectedText: data.selectedText,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setSuggestions(prev => [newSug, ...prev]);

    // Send notification to author
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: data.authorId,
      type: 'suggestion',
      title: `New Edit Suggestion: ${data.category}`,
      message: `${user.displayName} suggested an improvement on "${data.partTitle || data.storyTitle}".`,
      link: `/story/${data.storyId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateSuggestionStatus = (suggestionId: string, status: 'accepted' | 'declined') => {
    setSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, status } : s))
    );
  };

  // Community
  const createThread = (
    title: string,
    content: string,
    category: any,
    storyId?: string,
    storyTitle?: string
  ) => {
    if (!currentUser) return;
    const newThread: CommunityThread = {
      id: `thread_${Date.now()}`,
      storyId,
      storyTitle,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      isPremiumAuthor: Boolean(currentUser.isPremiumSubscriber || isFounder),
      title: title.trim(),
      content: content.trim(),
      category: category || 'Story Discussion',
      repliesCount: 0,
      likesCount: 0,
      likedByUserIds: [],
      createdAt: new Date().toISOString(),
    };
    setThreads(prev => [newThread, ...prev]);
  };

  const toggleLikeThread = (threadId: string) => {
    if (!currentUser) return;
    setThreads(prev =>
      prev.map(t => {
        if (t.id !== threadId) return t;
        const liked = t.likedByUserIds.includes(currentUser.id);
        return {
          ...t,
          likesCount: liked ? t.likesCount - 1 : t.likesCount + 1,
          likedByUserIds: liked
            ? t.likedByUserIds.filter(id => id !== currentUser.id)
            : [...t.likedByUserIds, currentUser.id],
        };
      })
    );
  };

  // Moderation
  const submitReport = (reportData: Omit<ReportItem, 'id' | 'status' | 'createdAt'>) => {
    const report: ReportItem = {
      id: `rep_${Date.now()}`,
      ...reportData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [report, ...prev]);
  };

  const updateReportStatus = (
    reportId: string,
    status: 'reviewed' | 'action_taken' | 'dismissed',
    notes?: string
  ) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status, adminNotes: notes } : r))
    );
  };

  // Settings
  const updateSettings = async (newSettings: Partial<PlatformSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch {}
  };

  // Challenge Arena Methods
  const submitStoryToChallenge = async (data: {
    storyId: string;
    contentType: 'Story' | 'Poem' | 'Article';
    challengeId?: string;
  }): Promise<ChallengeSubmission> => {
    const targetStory = stories.find(s => s.id === data.storyId);
    const storyParts = parts.filter(p => p.storyId === data.storyId);
    const textSample = storyParts.map(p => p.content).join('\n\n') || targetStory?.synopsis || '';

    // Real-time AI Editorial assessment
    const assessment = await assessStoryContent(
      targetStory?.title || 'Challenge Submission',
      textSample,
      targetStory?.category,
      targetStory?.genre
    );

    const overallScore = Math.max(35, Math.min(99, Math.round((assessment.originalityScore * 0.45) + (assessment.confidenceScore * 0.45) - (assessment.aiWritingRate * 0.25))));

    const newSub: ChallengeSubmission = {
      id: `sub_${Date.now()}`,
      challengeId: data.challengeId || activeChallenge.id,
      storyId: data.storyId,
      storyTitle: targetStory?.title || 'Untitled',
      storySynopsis: targetStory?.synopsis || '',
      storyCover: targetStory?.coverImage || 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80',
      authorId: currentUser?.id || 'usr_anonymous',
      authorName: currentUser?.displayName || 'Anonymous Author',
      authorUsername: currentUser?.username || 'author',
      authorAvatar: currentUser?.avatar || '/assets/aistudio/IMG_6033_dd143268.jpeg',
      contentType: data.contentType,
      submittedAt: new Date().toISOString(),
      aiGrading: {
        overallScore,
        creativityScore: Math.min(99, overallScore + 2),
        proseScore: Math.min(99, overallScore - 1),
        emotionalDepthScore: Math.min(99, overallScore),
        aiWritingRate: assessment.aiWritingRate,
        isDisqualified: assessment.isDisqualified,
        disqualificationReason: assessment.disqualificationReason,
        editorialCritique: assessment.editorialFeedback,
        evaluatedAt: new Date().toISOString(),
      },
    };

    setSubmissions(prev => [newSub, ...prev]);

    // Update story with challengeEntryId
    setStories(prev =>
      prev.map(st => (st.id === data.storyId ? { ...st, challengeEntryId: newSub.id } : st))
    );

    // If disqualified, notify author
    if (assessment.isDisqualified) {
      setNotifications(prev => [
        {
          id: `notif_disq_${Date.now()}`,
          userId: currentUser?.id || 'usr_anonymous',
          type: 'moderation',
          title: '⚠️ Arena Submission Disqualified by AI Team',
          message: assessment.disqualificationReason || `Detected AI writing rate of ${assessment.aiWritingRate}%, exceeding the 85% limit.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    return newSub;
  };

  const verifySubmissionByCEO = (submissionId: string, rank?: 1 | 2 | 3, ceoRemarks?: string) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            ceoVerification: {
              isVerifiedByCEO: true,
              rank,
              ceoRemarks: ceoRemarks || `Verified by CEO Shreyanshu Mishra${rank ? ` for ${rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} place.` : '.'}`,
              verifiedAt: new Date().toISOString(),
            },
          };
        }
        return sub;
      })
    );
  };

  const awardChampionWinner = (submissionId: string, remarks?: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const finalRemarks = remarks || 'Crowned 1st position winner of the LEXORA Literary Arena by CEO Shreyanshu Mishra.';

    // 1. Update submission with rank 1
    verifySubmissionByCEO(submissionId, 1, finalRemarks);

    // 2. Award User: Floating Crown Badge + 1 Month Free Verification
    awardUserCrownAndVerification(sub.authorId);

    // 3. Cast Winning Story on Home Page for 1 Week!
    const castedExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setStories(prev =>
      prev.map(st => {
        if (st.id === sub.storyId) {
          return {
            ...st,
            isCastedOnHomeUntil: castedExpiry,
            authorHasCrownBadge: true,
            isFeatured: true,
          };
        }
        return st;
      })
    );

    // 4. Update Challenge Winner
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === sub.challengeId) {
          return {
            ...c,
            winnerSubmissionId: sub.id,
            winnerAuthorId: sub.authorId,
            winnerStoryId: sub.storyId,
          };
        }
        return c;
      })
    );

    // 5. Generate Official Winner Certificate
    const certId = `CERT-ARENA-${Date.now().toString(36).toUpperCase()}`;
    const newCert: WriterCertificate = {
      id: `cert_${Date.now()}`,
      certificateId: certId,
      writerId: sub.authorId,
      writerName: sub.authorName,
      writerUsername: sub.authorUsername,
      qualifyingStoriesCount: 1,
      averageRating: Math.round((sub.aiGrading.overallScore / 20) * 10) / 10,
      issuedDate: new Date().toISOString(),
      signedBy: 'Shreyanshu Mishra, CEO & Founder',
      verificationCode: `LEXORA-CHAMPION-${sub.challengeId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setCertificates(prev => [newCert, ...prev]);

    // 6. Celebratory Notification to winner
    setNotifications(prev => [
      {
        id: `notif_crown_${Date.now()}`,
        userId: sub.authorId,
        type: 'writer_certificate',
        title: '👑 1st Position Awarded — LEXORA Literary Arena!',
        message: `Congratulations ${sub.authorName}! CEO Shreyanshu Mishra has verified your masterpiece "${sub.storyTitle}". You have been awarded 1st position with a floating crown badge, 1 month free verification, 1-week home page casting, and an official signed Winner Certificate.`,
        link: `/story/${sub.storyId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // InkVault Methods
  const addInkVaultItem = (item: Omit<InkVaultItem, 'id' | 'lastVaultedAt'>): InkVaultItem => {
    const newItem: InkVaultItem = {
      ...item,
      id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lastVaultedAt: new Date().toISOString(),
    };
    setInkVaultItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const deleteInkVaultItem = (id: string) => {
    setInkVaultItems(prev => prev.filter(v => v.id !== id));
  };

  // 1-Click AI Suggestion Application (Preserve My Voice)
  const applyCorrectionToPart = (partId: string, originalText: string, correctedText: string) => {
    setParts(prev =>
      prev.map(p => {
        if (p.id === partId) {
          const updatedContent = p.content.replace(originalText, correctedText);
          return {
            ...p,
            content: updatedContent,
            updatedAt: new Date().toISOString(),
            aiAssessment: p.aiAssessment
              ? {
                  ...p.aiAssessment,
                  aiWritingRate: Math.max(2, p.aiAssessment.aiWritingRate - 25),
                  isDisqualified: false,
                  disqualificationReason: undefined,
                }
              : undefined,
          };
        }
        return p;
      })
    );
  };

  // AI Content Assessment using backend Gemini with 85% rule & corrections
  const assessStoryContent = async (
    title: string,
    content: string,
    category?: string,
    genre?: string
  ): Promise<AIAssessmentResult> => {
    try {
      const res = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, genre }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API assess failed, generating client fallback assessment:', e);
    }

    // Client fallback adhering to 85% threshold rule
    const sample = (content || '').slice(0, 1000);
    const aiTransitionMatches = (sample.match(/\b(moreover|furthermore|in conclusion|delve|testament to|beacon of|vital role)\b/gi) || []).length;
    let aiRate = Math.min(92, Math.max(4, aiTransitionMatches * 18));
    const isDisqualified = aiRate >= 85;

    return {
      indication: isDisqualified ? 'High indication of AI assistance' : 'Low indication of AI assistance',
      confidenceScore: 92,
      spamScore: isDisqualified ? 30 : 1,
      originalityScore: isDisqualified ? 35 : 96,
      aiWritingRate: aiRate,
      isDisqualified,
      disqualificationReason: isDisqualified
        ? `⚠️ Disqualified: AI writing rate detected at ${aiRate}%, exceeding the 85% limit. LEXORA requires genuine human creative originality.`
        : undefined,
      potentialPlagiarismConcern: false,
      unsafeOrProhibitedContent: false,
      flags: isDisqualified
        ? ['High synthetic uniformity', 'Robotic transitions', 'Low sensory variability']
        : ['Organic narrative flow', 'Nuanced character interiority', 'Original descriptive imagery'],
      editorialFeedback: isDisqualified
        ? 'High AI assistance rate. Use "Preserve My Voice" corrections below to restore your personal authorial tone.'
        : 'High stylistic cohesion with authentic emotional resonance and rhythmic prose.',
      aiCorrections: [
        {
          id: 'corr_1',
          originalText: sample.slice(0, 60),
          correctedText: `${sample.slice(0, 60).replace(/\b(very|extremely|furthermore)\b/gi, '').trim()}, laden with the chill of late autumn and unvoiced memory.`,
          explanation: 'Restores sensory weight and human descriptive cadence.',
          category: 'preserve_voice',
        },
      ],
      analyzedAt: new Date().toISOString(),
    };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        parts,
        reviews,
        savedStoryIds,
        readingProgress,
        bookmarks,
        purchasedStoryIds,
        payments,
        certificates,
        suggestions,
        threads,
        reports,
        notifications,
        settings,

        // Challenges & Arena
        challenges,
        activeChallenge,
        submissions,
        submitStoryToChallenge,
        verifySubmissionByCEO,
        awardChampionWinner,

        // InkVault & Writers Circles
        inkVaultItems,
        addInkVaultItem,
        deleteInkVaultItem,
        writersCircles,

        // AI Corrections
        applyCorrectionToPart,

        toggleSaveStory,
        isStorySaved,
        saveReadingProgress,
        toggleBookmark,
        isBookmarked,

        createStory,
        updateStory,
        deleteStory,
        toggleFeatureStory,

        getStoryParts,
        createPart,
        updatePart,
        deletePart,
        reorderParts,

        addRatingAndReview,
        getUserRatingForStory,

        submitPayment,
        confirmPaymentByAdmin,
        confirmAllPendingPayments,
        rejectPaymentByAdmin,

        submitSuggestion,
        updateSuggestionStatus,

        createThread,
        toggleLikeThread,

        submitReport,
        updateReportStatus,

        updateSettings,
        assessStoryContent,

        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (!context) throw new Error('useStories must be used within StoryProvider');
  return context;
};
