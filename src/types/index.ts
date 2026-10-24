export type UserRole = 'founder' | 'admin' | 'writer' | 'reader';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar: string;
  dob: string; // YYYY-MM-DD - Mandatory during registration
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  role: UserRole;
  isVerified: boolean;
  verifiedUntil?: string; // 1-month free verification expiration date
  hasCrownBadge?: boolean; // 👑 Floating crown badge above PFP for Arena 1st place winners
  challengeWins?: number;
  signatureCard?: {
    penName: string;
    biography: string;
    motto: string;
    favoriteGenre: string;
    masterpieceTitle: string;
  };
  isFounder: boolean;
  isPremiumSubscriber: boolean;
  subscriptionExpiry?: string;
  followingIds: string[];
  createdAt: string;
}

export type StoryStatus = 'draft' | 'published' | 'hidden';

export interface StoryPart {
  id: string;
  storyId: string;
  partNumber: number;
  title: string;
  content: string;
  wordCount: number;
  estimatedReadingTimeMinutes: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  aiAssessment?: AIAssessmentResult;
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorIsVerified?: boolean;
  authorIsFounder?: boolean;
  authorHasCrownBadge?: boolean;
  category: string;
  genre: string;
  language: string;
  tags: string[];
  status: StoryStatus;
  isFeatured: boolean;
  isCastedOnHomeUntil?: string; // Pinned to home page for 1 week upon winning 1st place
  challengeEntryId?: string;
  ratingAverage: number;
  ratingCount: number;
  readerCount: number;
  partsCount: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  aiAssessment?: AIAssessmentResult;
}

export interface RatingReview {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userIsVerified?: boolean;
  userIsFounder?: boolean;
  rating: number; // 1 to 5
  reviewText?: string;
  createdAt: string;
}

export interface ReadingProgress {
  storyId: string;
  lastPartId: string;
  lastPartNumber: number;
  progressPercent: number;
  updatedAt: string;
}

export type ProductType = 'story_unlock' | 'monthly_subscription';

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productType: ProductType;
  storyId?: string;
  storyTitle?: string;
  amount: number; // 19 or 299
  transactionRef: string;
  paymentDestination: string; // "7852931077@fam"
  status: 'pending_verification' | 'verified' | 'rejected';
  verificationNotes?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface StoryPurchase {
  id: string;
  userId: string;
  storyId: string;
  amount: number;
  transactionRef: string;
  purchasedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number; // 299
  startDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'cancelled';
  transactionRef: string;
  renewalStatus: 'manual' | 'auto';
}

export interface WriterCertificate {
  id: string;
  certificateId: string;
  writerId: string;
  writerName: string;
  writerUsername: string;
  qualifyingStoriesCount: number;
  averageRating: number;
  issuedDate: string;
  signedBy: string; // "Shreyanshu Mishra, Founder"
  verificationCode: string;
  badgeUrl?: string;
}

export type SuggestionCategory = 
  | 'Plot' 
  | 'Characters' 
  | 'Pacing' 
  | 'Grammar' 
  | 'Writing style' 
  | 'Continuity' 
  | 'Structure';

export interface StorySuggestion {
  id: string;
  storyId: string;
  storyTitle: string;
  partId?: string;
  partNumber?: number;
  partTitle?: string;
  authorId: string; // story author
  suggestedByUserId: string;
  suggestedByUserName: string;
  category: SuggestionCategory;
  comment: string;
  selectedText?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface CommunityThread {
  id: string;
  storyId?: string;
  storyTitle?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isPremiumAuthor: boolean;
  title: string;
  content: string;
  category: 'Story Discussion' | 'Writer Recommendation' | 'Constructive Feedback' | 'General';
  repliesCount: number;
  likesCount: number;
  likedByUserIds: string[];
  createdAt: string;
}

export interface CommunityReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isPremiumAuthor: boolean;
  content: string;
  likesCount: number;
  likedByUserIds: string[];
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetType: 'story' | 'part' | 'review' | 'user' | 'message';
  targetId: string;
  targetTitle: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 
    | 'new_part' 
    | 'new_follower' 
    | 'story_rating' 
    | 'review' 
    | 'writer_certificate' 
    | 'premium_eligibility' 
    | 'payment_confirmed' 
    | 'subscription_active' 
    | 'subscription_expiry' 
    | 'moderation' 
    | 'announcement'
    | 'suggestion';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AICorrectionSuggestion {
  id: string;
  originalText: string;
  correctedText: string;
  explanation: string;
  category: 'grammar' | 'prose_flow' | 'preserve_voice' | 'rhyme_meter';
  applied?: boolean;
}

export interface AIAssessmentResult {
  indication: 'Low indication of AI assistance' | 'Possible AI assistance' | 'High indication of AI assistance';
  confidenceScore: number; // e.g. 84
  spamScore: number; // 0 to 100
  originalityScore: number; // 0 to 100
  aiWritingRate: number; // 0 to 100 percentage
  isDisqualified: boolean; // TRUE if aiWritingRate >= 85%
  disqualificationReason?: string;
  potentialPlagiarismConcern: boolean;
  unsafeOrProhibitedContent: boolean;
  flags: string[];
  editorialFeedback: string;
  aiCorrections?: AICorrectionSuggestion[];
  analyzedAt: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  storyId: string;
  storyTitle: string;
  storySynopsis: string;
  storyCover: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  contentType: 'Story' | 'Poem' | 'Article';
  submittedAt: string;
  aiGrading: {
    overallScore: number; // 0 to 100
    creativityScore: number;
    proseScore: number;
    emotionalDepthScore: number;
    aiWritingRate: number; // 0 to 100
    isDisqualified: boolean; // >= 85%
    disqualificationReason?: string;
    editorialCritique: string;
    evaluatedAt: string;
  };
  ceoVerification?: {
    isVerifiedByCEO: boolean;
    rank?: 1 | 2 | 3;
    ceoRemarks?: string;
    verifiedAt?: string;
  };
}

export interface Challenge {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  seasonName: string; // e.g. "Vernal Equinox Showcase"
  year: number;
  title: string;
  themePrompt: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'judging' | 'completed';
  grandPrize: string;
  submissionsCount: number;
  winnerSubmissionId?: string;
  winnerAuthorId?: string;
  winnerStoryId?: string;
}

export interface InkVaultItem {
  id: string;
  userId: string;
  title: string;
  type: 'manuscript' | 'journal' | 'poem_idea' | 'backup';
  content: string;
  wordCount: number;
  tags: string[];
  isEncrypted: boolean;
  lastVaultedAt: string;
}

export interface WritersCircleGroup {
  id: string;
  name: string;
  description: string;
  genre: string;
  membersCount: number;
  isPrivate: boolean;
  leaderId: string;
  leaderName: string;
  recentActivity: string;
}

export interface PlatformSettings {
  premiumRatingThreshold: number; // default 4.8
  requiredRatingsCount: number; // default 400
  storyUnlockPrice: number; // default 19
  monthlySubscriptionPrice: number; // default 299
  paymentDestinationUpi: string; // "7852931077@fam"
  founderEmail: string; // "mishrashreyanshu11@gmail.com"
  founderName: string; // "Shreyanshu Mishra"
  certificateMinStories: number; // 20
  certificateMinRating: number; // 4.0
}

export interface ContentCategory {
  id: string;
  name: string;
  emoji: string;
}

export const LISTING_CATEGORIES: ContentCategory[] = [
  { id: 'nature', name: 'Nature', emoji: '🌲' },
  { id: 'opinion', name: 'Opinion', emoji: '🕵️‍♂️' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🫧' },
  { id: 'society', name: 'Society', emoji: '🖼️' },
  { id: 'technology', name: 'Technology', emoji: '✈️' },
  { id: 'science', name: 'Science', emoji: '🧬' },
  { id: 'education', name: 'Education', emoji: '👨‍🏫' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎢' },
  { id: 'thriller', name: 'Thriller', emoji: '🏚️' },
  { id: 'culture', name: 'Culture', emoji: '🎑' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '🏡' },
  { id: 'sports', name: 'Sports', emoji: '🏏' },
  { id: 'personal_stories', name: 'Personal Stories', emoji: '⛱️' },
  { id: 'romance', name: 'Romance', emoji: '👥' },
  { id: 'science_fiction', name: 'Science Fiction', emoji: '📺' },
  { id: 'current_affairs', name: 'Current Affairs', emoji: '👀' },
  { id: 'poetry', name: 'Poetry', emoji: '✍🏻' },
  { id: 'reformative', name: 'Reformative', emoji: '👣' },
  { id: 'horror', name: 'Horror', emoji: '🫣' },
  { id: 'mystery', name: 'Mystery', emoji: '💭' },
  { id: 'financial_statistics', name: 'Financial Statistics', emoji: '📊' },
  { id: 'short_stories', name: 'Short Stories', emoji: '📝' },
  { id: 'biography', name: 'Biography', emoji: '👤' },
];

export const DEFAULT_AVATAR = '/assets/aistudio/IMG_6033_dd143268.jpeg';
