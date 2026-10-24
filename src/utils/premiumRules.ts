import { Story, StoryPart, User, PlatformSettings } from '../types';

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  premiumRatingThreshold: 4.8,
  requiredRatingsCount: 400,
  storyUnlockPrice: 19,
  monthlySubscriptionPrice: 299,
  paymentDestinationUpi: '7852931077@fam',
  founderEmail: 'mishrashreyanshu11@gmail.com',
  founderName: 'Shreyanshu Mishra',
  certificateMinStories: 20,
  certificateMinRating: 4.0,
};

/**
 * Determines if a story has crossed both conditions to become Premium:
 * Condition 1: average rating strictly > threshold (default 4.8)
 * Condition 2: total ratings >= requiredRatingsCount (default 400)
 */
export function isStoryPremium(
  story: Story, 
  settings: PlatformSettings = DEFAULT_PLATFORM_SETTINGS
): boolean {
  if (!story) return false;
  const ratingThreshold = settings.premiumRatingThreshold ?? 4.8;
  const countThreshold = settings.requiredRatingsCount ?? 400;

  return story.ratingAverage > ratingThreshold && story.ratingCount >= countThreshold;
}

/**
 * Calculates how many parts of a premium story are free preview parts before the ₹19 paywall:
 * - Stories under 40 parts must offer 75% free.
 * - Stories with 40 or more parts must offer at least 20 parts free before the ₹19 paywall is triggered.
 * If the story is NOT premium, all parts are free!
 */
export function getFreePartsCount(
  totalParts: number, 
  isPremium: boolean
): number {
  if (!isPremium) return totalParts;
  if (totalParts <= 0) return 0;

  if (totalParts >= 40) {
    // Stories with 40 or more parts must offer at least 20 parts free (50% or minimum 20 parts)
    return Math.max(20, Math.floor(totalParts * 0.5));
  } else {
    // Stories under 40 parts must offer 75% free
    return Math.max(1, Math.ceil(totalParts * 0.75));
  }
}

/**
 * Checks whether a specific user can access a specific story part.
 * Returns { canAccess: boolean, reason?: string, isPreviewPart: boolean }
 */
export function checkPartAccess(params: {
  story: Story;
  part: StoryPart;
  user: User | null;
  purchasedStoryIds: string[];
  settings?: PlatformSettings;
}): {
  canAccess: boolean;
  reason?: 'founder' | 'author' | 'subscription' | 'story_purchased' | 'free_preview' | 'free_story';
  freePartsCount: number;
  totalPartsCount: number;
  isPremium: boolean;
  isPreviewPart: boolean;
} {
  const { story, part, user, purchasedStoryIds, settings = DEFAULT_PLATFORM_SETTINGS } = params;
  const premium = isStoryPremium(story, settings);
  const totalParts = Math.max(story.partsCount, 1);
  const freePartsCount = getFreePartsCount(totalParts, premium);
  const isPreviewPart = part.partNumber <= freePartsCount;

  // 1. If not premium story, all parts are accessible to all users
  if (!premium) {
    return {
      canAccess: true,
      reason: 'free_story',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: false,
      isPreviewPart: true,
    };
  }

  // 2. Founder / Admin bypass
  if (user && (user.isFounder || user.role === 'founder' || user.email.toLowerCase() === settings.founderEmail.toLowerCase())) {
    return {
      canAccess: true,
      reason: 'founder',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: true,
      isPreviewPart,
    };
  }

  // 3. Author bypass for their own story
  if (user && user.id === story.authorId) {
    return {
      canAccess: true,
      reason: 'author',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: true,
      isPreviewPart,
    };
  }

  // 4. Free preview parts (e.g. 50% if >=40 parts, 75% if <40 parts)
  if (isPreviewPart) {
    return {
      canAccess: true,
      reason: 'free_preview',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: true,
      isPreviewPart: true,
    };
  }

  // 5. Active LEXORA Premium subscription (₹299/month)
  if (user && user.isPremiumSubscriber) {
    return {
      canAccess: true,
      reason: 'subscription',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: true,
      isPreviewPart: false,
    };
  }

  // 6. User purchased this individual story (₹19 story unlock)
  if (purchasedStoryIds.includes(story.id)) {
    return {
      canAccess: true,
      reason: 'story_purchased',
      freePartsCount,
      totalPartsCount: totalParts,
      isPremium: true,
      isPreviewPart: false,
    };
  }

  // Otherwise locked!
  return {
    canAccess: false,
    freePartsCount,
    totalPartsCount: totalParts,
    isPremium: true,
    isPreviewPart: false,
  };
}

/**
 * Checks if a writer qualifies for the LEXORA Writer Certificate:
 * - Completed at least 20 stories
 * - Average rating >= 4.0 across qualifying stories
 */
export function checkCertificateEligibility(
  completedStoriesCount: number,
  averageRating: number,
  settings: PlatformSettings = DEFAULT_PLATFORM_SETTINGS
): {
  isEligible: boolean;
  requiredStories: number;
  requiredRating: number;
  currentStories: number;
  currentRating: number;
  progressPercent: number;
} {
  const minStories = settings.certificateMinStories ?? 20;
  const minRating = settings.certificateMinRating ?? 4.0;

  const isEligible = completedStoriesCount >= minStories && averageRating >= minRating;
  const storiesProgress = Math.min(100, (completedStoriesCount / minStories) * 100);
  const ratingProgress = Math.min(100, (averageRating / minRating) * 100);
  const progressPercent = Math.round((storiesProgress * 0.7) + (ratingProgress * 0.3));

  return {
    isEligible,
    requiredStories: minStories,
    requiredRating: minRating,
    currentStories: completedStoriesCount,
    currentRating: averageRating,
    progressPercent: Math.min(100, progressPercent),
  };
}
