import { User, Story, StoryPart, RatingReview, PaymentRecord, WriterCertificate, CommunityThread, AppNotification, PlatformSettings } from '../types';
import { DEFAULT_PLATFORM_SETTINGS } from '../utils/premiumRules';

export const SEED_SETTINGS: PlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS };

export const FOUNDER_USER: User = {
  id: 'usr_founder_shreyanshu',
  email: 'mishrashreyanshu11@gmail.com',
  username: 'shreyanshu',
  displayName: 'Shreyanshu',
  bio: 'Founder of Vellum. Building the premier home for timeless wisdom, serialized knowledge, and thoughtful readers.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  dob: '1998-08-14',
  socialLinks: {
    twitter: 'https://twitter.com/shreyanshu',
    website: 'https://vellum.read',
  },
  role: 'founder',
  isVerified: true,
  isFounder: true,
  isPremiumSubscriber: true,
  subscriptionExpiry: '2028-12-31',
  followingIds: ['usr_author_james_clear', 'usr_author_morgan_housel'],
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const SEED_USERS: User[] = [
  FOUNDER_USER,
  {
    id: 'usr_author_james_clear',
    email: 'james.clear@vellum.read',
    username: 'jamesclear',
    displayName: 'James Clear',
    bio: 'Author of the #1 New York Times bestseller Atomic Habits. Focused on habits, decision making, and continuous improvement.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    dob: '1986-01-22',
    socialLinks: {
      twitter: 'https://twitter.com/jamesclear',
      website: 'https://jamesclear.com',
    },
    role: 'writer',
    isVerified: true,
    isFounder: false,
    isPremiumSubscriber: true,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'usr_author_morgan_housel',
    email: 'morgan.housel@vellum.read',
    username: 'morganhousel',
    displayName: 'Morgan Housel',
    bio: 'Partner at The Collaborative Fund and author of The Psychology of Money and Same As Ever.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    dob: '1984-05-14',
    socialLinks: {
      twitter: 'https://twitter.com/morganhousel',
    },
    role: 'writer',
    isVerified: true,
    isFounder: false,
    isPremiumSubscriber: true,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'usr_author_robert_greene',
    email: 'robert.greene@vellum.read',
    username: 'robertgreene',
    displayName: 'Robert Greene',
    bio: 'Internationally renowned author of The 48 Laws of Power, Mastery, The Art of Seduction, and The Laws of Human Nature.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    dob: '1959-05-14',
    socialLinks: {
      twitter: 'https://twitter.com/robertgreene',
    },
    role: 'writer',
    isVerified: true,
    isFounder: false,
    isPremiumSubscriber: true,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'usr_author_robert_kiyosaki',
    email: 'robert.kiyosaki@vellum.read',
    username: 'therealkiyosaki',
    displayName: 'Robert Kiyosaki',
    bio: 'Author of Rich Dad Poor Dad, the #1 personal finance book of all time. Dedicated to financial education.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    dob: '1947-04-08',
    socialLinks: {
      twitter: 'https://twitter.com/therealkiyosaki',
    },
    role: 'writer',
    isVerified: true,
    isFounder: false,
    isPremiumSubscriber: false,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-01-20T10:00:00.000Z',
  },
];

export const SEED_STORIES: Story[] = [
  {
    id: 'story_atomic_habits',
    title: 'Atomic Habits: The 1% Compounding Method',
    synopsis: 'An actionable framework for improving every day. Tiny changes in your daily systems deliver extraordinary compounding returns over time.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_author_james_clear',
    authorName: 'James Clear',
    authorUsername: 'jamesclear',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    category: 'Productivity',
    genre: 'Behavioral Psychology',
    language: 'English',
    tags: ['Habits', 'Self-Improvement', 'Systems', 'Productivity'],
    status: 'published',
    isFeatured: true,
    ratingAverage: 4.94,
    ratingCount: 890, // > 4.8 AND >= 400 -> PREMIUM!
    readerCount: 38400,
    partsCount: 40, // 40 parts: at least 20 parts free before ₹19 paywall!
    completed: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-10-20T14:30:00.000Z',
    aiAssessment: {
      indication: 'Low indication of AI assistance',
      confidenceScore: 98,
      spamScore: 0,
      originalityScore: 99,
      potentialPlagiarismConcern: false,
      unsafeOrProhibitedContent: false,
      flags: ['Authoritative voice', 'Exemplary clarity', 'High behavioral precision'],
      editorialFeedback: 'Seminal modern literature on behavioral change. Systems-first pedagogy presented with peerless concision.',
      analyzedAt: '2026-10-20T14:30:00.000Z',
    },
  },
  {
    id: 'story_psychology_of_money',
    title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed & Happiness',
    synopsis: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. Real wealth is the freedom to wake up and decide what to do with your day.',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_author_morgan_housel',
    authorName: 'Morgan Housel',
    authorUsername: 'morganhousel',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    category: 'Finance',
    genre: 'Behavioral Economics',
    language: 'English',
    tags: ['Money', 'Psychology', 'Wealth', 'Investing'],
    status: 'published',
    isFeatured: true,
    ratingAverage: 4.91,
    ratingCount: 760, // > 4.8 AND >= 400 -> PREMIUM!
    readerCount: 29500,
    partsCount: 20, // < 40 parts: 75% free = 15 parts free, remaining locked
    completed: true,
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-10-18T16:00:00.000Z',
    aiAssessment: {
      indication: 'Low indication of AI assistance',
      confidenceScore: 96,
      spamScore: 0,
      originalityScore: 98,
      potentialPlagiarismConcern: false,
      unsafeOrProhibitedContent: false,
      flags: ['Narrative brilliance', 'Deep psychological depth', 'Historical grounding'],
      editorialFeedback: 'Philosophical economic journalism at its absolute peak. Resonant across all generations of investors.',
      analyzedAt: '2026-10-18T16:00:00.000Z',
    },
  },
  {
    id: 'story_48_laws_of_power',
    title: 'The 48 Laws of Power: Strategy, Influence & Mastery',
    synopsis: 'Three thousand years of power distilled into 48 definitive strategic laws drawn from Machiavelli, Sun Tzu, Talleyrand, and Casanova.',
    coverImage: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_author_robert_greene',
    authorName: 'Robert Greene',
    authorUsername: 'robertgreene',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    category: 'Strategy',
    genre: 'Historical Philosophy',
    language: 'English',
    tags: ['Power', 'Strategy', 'Psychology', 'History'],
    status: 'published',
    isFeatured: true,
    ratingAverage: 4.89,
    ratingCount: 1420, // > 4.8 AND >= 400 -> PREMIUM!
    readerCount: 52000,
    partsCount: 48, // >= 40 parts: at least 20 parts free before ₹19 paywall! (24 parts free)
    completed: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-10-19T11:00:00.000Z',
    aiAssessment: {
      indication: 'Low indication of AI assistance',
      confidenceScore: 97,
      spamScore: 0,
      originalityScore: 99,
      potentialPlagiarismConcern: false,
      unsafeOrProhibitedContent: false,
      flags: ['Profound historical scholarship', 'Cold strategic precision'],
      editorialFeedback: 'Incomparable strategic depth and forensic examination of human ambition across dynasties.',
      analyzedAt: '2026-10-19T11:00:00.000Z',
    },
  },
  {
    id: 'story_rich_dad_poor_dad',
    title: 'Rich Dad Poor Dad: What The Rich Teach Their Kids About Money',
    synopsis: 'The contrasting financial philosophies of two fathers that explodes the myth that you need to earn a high income to become rich, defining the fundamental difference between assets and liabilities.',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_author_robert_kiyosaki',
    authorName: 'Robert Kiyosaki',
    authorUsername: 'therealkiyosaki',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    category: 'Finance',
    genre: 'Financial Literacy',
    language: 'English',
    tags: ['Money', 'Assets', 'Real Estate', 'Education'],
    status: 'published',
    isFeatured: false,
    ratingAverage: 4.85,
    ratingCount: 610, // > 4.8 AND >= 400 -> PREMIUM!
    readerCount: 31200,
    partsCount: 10, // < 40 parts: 75% free = 8 parts free, remaining locked
    completed: true,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-09-15T12:00:00.000Z',
  },
  {
    id: 'story_meditations_aurelius',
    title: 'Meditations: The Private Journals of Marcus Aurelius',
    synopsis: 'The personal writings of the Roman Emperor on Stoic philosophy, self-discipline, mortality, and duty in a chaotic world.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_founder_shreyanshu',
    authorName: 'Shreyanshu',
    authorUsername: 'shreyanshu',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    authorIsFounder: true,
    category: 'Philosophy',
    genre: 'Stoicism',
    language: 'English',
    tags: ['Stoicism', 'Philosophy', 'Wisdom', 'Classics'],
    status: 'published',
    isFeatured: true,
    ratingAverage: 4.96,
    ratingCount: 540, // > 4.8 AND >= 400 -> PREMIUM!
    readerCount: 22100,
    partsCount: 12, // < 40 parts: 75% free = 9 parts free
    completed: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-10-21T09:00:00.000Z',
  },
  {
    id: 'story_thinking_fast_slow',
    title: 'Thinking, Fast and Slow: The Two Systems of Mind',
    synopsis: 'Nobel laureate Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast, emotional) and System 2 (slow, deliberate).',
    coverImage: 'https://images.unsplash.com/photo-1507842229450-7907e5c5c637?auto=format&fit=crop&w=800&q=80',
    authorId: 'usr_author_james_clear',
    authorName: 'James Clear',
    authorUsername: 'jamesclear',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorIsVerified: true,
    category: 'Science',
    genre: 'Cognitive Science',
    language: 'English',
    tags: ['Mind', 'Psychology', 'Biases', 'Decisions'],
    status: 'published',
    isFeatured: false,
    ratingAverage: 4.78, // Under 4.8 threshold -> completely FREE story!
    ratingCount: 310,
    readerCount: 14200,
    partsCount: 16,
    completed: true,
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-08-10T14:00:00.000Z',
  },
];

export const SEED_PARTS: StoryPart[] = [];

// =============================================================================
// SEED PARTS: ATOMIC HABITS (40 Parts)
// =============================================================================
const ATOMIC_HABITS_CHAPTERS = [
  'The Surprising Power of Atomic Habits',
  'How Your Habits Shape Your Identity (and Vice Versa)',
  'How to Build Better Habits in 4 Simple Steps',
  'The Man Who Didn\'t Look Right: Cue Recognition',
  'The Best Way to Start a New Habit: Implementation Intentions',
  'Motivation Is Overrated; Environment Often Matters More',
  'The Secret to Self-Control: Inversion of the Cue',
  'How to Make a Habit Irresistible: Temptation Bundling',
  'The Role of Family and Friends in Shaping Your Habits',
  'How to Find and Fix the Causes of Your Bad Habits',
  'Walk Slowly, but Never Backward: The Motion Trap',
  'The Law of Least Effort: Friction Optimization',
  'How to Stop Procrastinating by Using the Two-Minute Rule',
  'How to Make Good Habits Inevitable and Bad Habits Impossible',
  'The Cardinal Rule of Behavior Change: Immediate Satisfaction',
  'How to Stick with Good Habits Every Day: The Paperclip Strategy',
  'How an Accountability Partner Can Change Everything',
  'The Truth About Talent: When Genes Matter and When They Don’t',
  'The Goldilocks Rule: How to Stay Motivated in Life and Work',
  'The Downside of Creating Good Habits: Complacency & Review',
];

// Seed 40 parts for Atomic Habits
for (let i = 1; i <= 40; i++) {
  const chapterName = ATOMIC_HABITS_CHAPTERS[(i - 1) % ATOMIC_HABITS_CHAPTERS.length];
  SEED_PARTS.push({
    id: `part_atomic_${i}`,
    storyId: 'story_atomic_habits',
    partNumber: i,
    title: `Part ${i} — ${chapterName}`,
    content: `It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.\n\nImproving by 1 percent isn’t particularly notable—sometimes it isn’t even noticeable—but it can be far more meaningful, especially in the long run. If you can get 1 percent better each day for one year, you’ll end up thirty-seven times better by the time you’re done.\n\nHabits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.\n\nYou do not rise to the level of your goals. You fall to the level of your systems. Your goal is your desired outcome. Your system is the collection of daily behaviors that will get you there. When you focus on the system rather than the goal, results take care of themselves.`,
    wordCount: 820,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: `2026-01-${String(Math.min(28, i)).padStart(2, '0')}T10:00:00.000Z`,
    updatedAt: `2026-01-${String(Math.min(28, i)).padStart(2, '0')}T10:00:00.000Z`,
  });
}

// =============================================================================
// SEED PARTS: THE PSYCHOLOGY OF MONEY (20 Parts)
// =============================================================================
const PSYCHOLOGY_MONEY_CHAPTERS = [
  'No One\'s Crazy: Your Personal History Shapes 80% of Decisions',
  'Luck & Risk: Why Nothing Is as Good or as Bad as It Looks',
  'Never Enough: When the Rich Do Crazy Things',
  'Confounding Compounding: Warren Buffett\'s Greatest Secret',
  'Getting Wealthy vs. Staying Wealthy: Survival Is Strategy',
  'Tails, You Win: You Can Be Wrong Half the Time and Still Win',
  'Freedom: The Highest Dividend Money Pays',
  'Man in the Car Paradox: No One Is as Impressed With Your Possessions as You Are',
  'Wealth Is What You Don’t See: The Difference Between Rich and Wealthy',
  'Save Money: The Only Factor You Have Complete Control Over',
  'Reasonable > Rational: Designing a Plan You Can Sleep With',
  'Surprise!: History Is the Study of Surprises Used as a Map',
  'Room for Error: The Wisdom of Leaving a Margin of Safety',
  'You’ll Change: Long-Term Financial Planning in a Fluid World',
  'Nothing’s Free: The Hidden Cost of Emotional Volatility',
  'You & Me: Why You Shouldn’t Take Financial Cues From People Playing a Different Game',
  'The Seduction of Pessimism: Why Optimism Sounds Like a Sales Pitch',
  'When You’ll Believe Anything: Stories Rule the Financial World',
  'All Together Now: A Short Summary of How to Think About Money',
  'Confessions: How Morgan Housel Invests His Own Family Capital',
];

PSYCHOLOGY_MONEY_CHAPTERS.forEach((title, idx) => {
  const num = idx + 1;
  SEED_PARTS.push({
    id: `part_psych_${num}`,
    storyId: 'story_psychology_of_money',
    partNumber: num,
    title: `Part ${num} — ${title}`,
    content: `Doing well with money has a little to do with how smart you are and a lot to do with how you behave. And behavior is hard to teach, even to really smart people.\n\nThe premise of this work is that doing well with money is not a science. It is a soft skill, where how you behave is more important than what you know. I call this soft skill the psychology of money.\n\nTwo people with the same financial education can make completely opposite decisions. That’s because people from different generations, raised by different parents who earned different incomes in different parts of the world, learn vastly different lessons.\n\nThe highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today." People want to become wealthy to be free. But when wealth is used solely to buy luxury items that signal prestige, you often trade away your independence to impress strangers who don't care about you anyway.`,
    wordCount: 880,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: `2026-01-${String(Math.min(28, num)).padStart(2, '0')}T10:00:00.000Z`,
    updatedAt: `2026-01-${String(Math.min(28, num)).padStart(2, '0')}T10:00:00.000Z`,
  });
});

// =============================================================================
// SEED PARTS: THE 48 LAWS OF POWER (48 Parts)
// =============================================================================
const POWER_LAWS = [
  'Never Outshine the Master',
  'Never Put Too Much Trust in Friends; Learn How to Use Enemies',
  'Conceal Your Intentions',
  'Always Say Less Than Necessary',
  'So Much Depends on Reputation—Guard It With Your Life',
  'Court Attention at All Costs',
  'Get Others to Do the Work for You, but Always Take the Credit',
  'Make Other People Come to You—Use Bait if Necessary',
  'Win Through Your Actions, Never Through Argument',
  'Infection: Avoid the Unhappy and Unlucky',
  'Learn to Keep People Dependent on You',
  'Use Selective Honesty and Generosity to Disarm Your Victim',
  'When Asking for Help, Appeal to People’s Self-Interest, Never to Their Mercy',
  'Pose as a Friend, Work as a Spy',
  'Crush Your Enemy Totally',
  'Use Absence to Increase Respect and Honor',
  'Keep Others in Suspended Terror: Cultivate an Air of Unpredictability',
  'Do Not Build Fortresses to Protect Yourself—Isolation Is Dangerous',
  'Know Who You’re Dealing With—Do Not Offend the Wrong Person',
  'Do Not Commit to Anyone',
];

for (let i = 1; i <= 48; i++) {
  const lawTitle = POWER_LAWS[(i - 1) % POWER_LAWS.length];
  SEED_PARTS.push({
    id: `part_power_${i}`,
    storyId: 'story_48_laws_of_power',
    partNumber: i,
    title: `Part ${i} — Law ${i}: ${lawTitle}`,
    content: `Always make those above you feel comfortably superior. In your desire to please or impress them, do not go too far in displaying your talents, or you might accomplish the opposite—inspire fear and insecurity. Make your masters appear more brilliant than they are and you will attain the heights of power.\n\nPower is essentially amoral and one of the most important skills to acquire is the ability to see circumstances rather than good or evil. Power is a game—this cannot be repeated too often—and in games you do not judge your opponents by their intentions but by the effect of their actions.\n\nWhen you show yourself to the world and display your talents, you naturally stir up all kinds of resentment, envy, and other manifestations of insecurity. You cannot spend your life worrying about the petty feelings of others, but with those above you you must take a different approach: when it comes to power, outshining the master is perhaps the worst mistake of all.`,
    wordCount: 890,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: `2026-01-${String(Math.min(28, i)).padStart(2, '0')}T10:00:00.000Z`,
    updatedAt: `2026-01-${String(Math.min(28, i)).padStart(2, '0')}T10:00:00.000Z`,
  });
}

// =============================================================================
// SEED PARTS: RICH DAD POOR DAD (10 Parts)
// =============================================================================
const RICH_DAD_CHAPTERS = [
  'Lesson 1: The Rich Don\'t Work for Money',
  'Lesson 2: Why Teach Financial Literacy? (Assets vs. Liabilities)',
  'Lesson 3: Mind Your Own Business',
  'Lesson 4: The History of Taxes and the Power of Corporations',
  'Lesson 5: The Rich Invent Money',
  'Lesson 6: Work to Learn—Don\'t Work for Money',
  'Overcoming Obstacles: Fear, Cynicism, Laziness, and Bad Habits',
  'Getting Started: 10 Steps to Awaken Your Financial Genius',
  'Action Items: Concrete Steps to Begin Building Your Asset Column',
  'Epilogue: Financial Freedom and Educating the Next Generation',
];

RICH_DAD_CHAPTERS.forEach((title, idx) => {
  const num = idx + 1;
  SEED_PARTS.push({
    id: `part_richdad_${num}`,
    storyId: 'story_rich_dad_poor_dad',
    partNumber: num,
    title: `Part ${num} — ${title}`,
    content: `I had two fathers, a rich one and a poor one. One was highly educated and intelligent; he had a Ph.D. and completed four years of undergraduate work in less than two years. The other father never finished the eighth grade.\n\nBoth men were successful in their careers, working hard all their lives. Both earned substantial incomes. Yet one struggled financially all his life. The other became one of the richest men in Hawaii.\n\nOne father would say, "The love of money is the root of all evil." The other said, "The lack of money is the root of all evil."\n\nRule One: You must know the difference between an asset and a liability, and buy assets. If you want to be rich, this is all you need to know. It is Rule No. 1. It is the only rule. An asset puts money in my pocket. A liability takes money out of my pocket. Rich people acquire assets. The poor and middle class acquire liabilities that they think are assets.`,
    wordCount: 850,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: `2026-01-2${num}T10:00:00.000Z`,
    updatedAt: `2026-01-2${num}T10:00:00.000Z`,
  });
});

// =============================================================================
// SEED PARTS: MEDITATIONS (12 Parts)
// =============================================================================
for (let i = 1; i <= 12; i++) {
  SEED_PARTS.push({
    id: `part_meditations_${i}`,
    storyId: 'story_meditations_aurelius',
    partNumber: i,
    title: `Part ${i} — Book ${i}: On Virtue, Mortality & Mind`,
    content: `When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.\n\nNone of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my fellow man, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural.\n\nThe impediment to action advances action. What stands in the way becomes the way.`,
    wordCount: 790,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: `2026-02-${String(i).padStart(2, '0')}T10:00:00.000Z`,
    updatedAt: `2026-02-${String(i).padStart(2, '0')}T10:00:00.000Z`,
  });
}

// Seed reviews
export const SEED_REVIEWS: RatingReview[] = [
  {
    id: 'rev_1',
    storyId: 'story_atomic_habits',
    userId: 'usr_founder_shreyanshu',
    userName: 'Shreyanshu',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    userIsVerified: true,
    userIsFounder: true,
    rating: 5,
    reviewText: 'The cornerstone handbook on compounding progress. The distinction between identity-based habits and outcome-based habits fundamentally changes execution.',
    createdAt: '2026-09-10T14:00:00.000Z',
  },
  {
    id: 'rev_2',
    storyId: 'story_psychology_of_money',
    userId: 'usr_founder_shreyanshu',
    userName: 'Shreyanshu',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    userIsVerified: true,
    userIsFounder: true,
    rating: 5,
    reviewText: 'Morgan Housel proves that money is not an intellectual exercise in spreadsheet formulas—it is a study of human psychology, ego, and quiet independence.',
    createdAt: '2026-09-12T18:30:00.000Z',
  },
  {
    id: 'rev_3',
    storyId: 'story_48_laws_of_power',
    userId: 'usr_author_james_clear',
    userName: 'James Clear',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    userIsVerified: true,
    rating: 5,
    reviewText: 'Robert Greene’s historical cataloging of strategy is unrivaled. Essential reading for navigating complex organizations and understanding motives.',
    createdAt: '2026-10-02T19:40:00.000Z',
  },
];

export const SEED_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_sub_1',
    userId: 'usr_author_james_clear',
    userEmail: 'james.clear@vellum.read',
    userName: 'James Clear',
    productType: 'monthly_subscription',
    amount: 299,
    transactionRef: 'UPI-REF-992148102941',
    paymentDestination: '7852931077@fam',
    status: 'verified',
    verificationNotes: 'Verified against UPI merchant bank feed',
    createdAt: '2026-10-01T10:14:00.000Z',
    verifiedAt: '2026-10-01T10:15:20.000Z',
  },
  {
    id: 'pay_unlock_2',
    userId: 'usr_author_morgan_housel',
    userEmail: 'morgan.housel@vellum.read',
    userName: 'Morgan Housel',
    productType: 'story_unlock',
    storyId: 'story_atomic_habits',
    storyTitle: 'Atomic Habits',
    amount: 19,
    transactionRef: 'UPI-REF-884102948172',
    paymentDestination: '7852931077@fam',
    status: 'verified',
    verificationNotes: 'Instant UPI UTR match',
    createdAt: '2026-09-08T18:22:00.000Z',
    verifiedAt: '2026-09-08T18:23:00.000Z',
  },
];

export const SEED_CERTIFICATE: WriterCertificate = {
  id: 'cert_james_clear_01',
  certificateId: 'VLM-CERT-2026-0001',
  writerId: 'usr_author_james_clear',
  writerName: 'James Clear',
  writerUsername: 'jamesclear',
  qualifyingStoriesCount: 24,
  averageRating: 4.94,
  issuedDate: '2026-09-15',
  signedBy: 'Shreyanshu Mishra, Founder',
  verificationCode: 'VRF-9812-CLEAR-2026',
  badgeUrl: 'https://vellum.read/verify/cert/VLM-CERT-2026-0001',
};

export const SEED_COMMUNITY_THREADS: CommunityThread[] = [
  {
    id: 'thread_1',
    storyId: 'story_atomic_habits',
    storyTitle: 'Atomic Habits',
    authorId: 'usr_author_james_clear',
    authorName: 'James Clear',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorRole: 'writer',
    isPremiumAuthor: true,
    title: 'Why Systems Exceed Goals: A Practical Guide to Habit Architecture',
    content: 'When you fall in love with the process rather than the product, you don’t have to wait to give yourself permission to be happy. You can be satisfied anytime your system is running.',
    category: 'Story Discussion',
    repliesCount: 42,
    likesCount: 154,
    likedByUserIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-10-18T16:20:00.000Z',
  },
  {
    id: 'thread_2',
    authorId: 'usr_founder_shreyanshu',
    authorName: 'Shreyanshu Mishra',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorRole: 'founder',
    isPremiumAuthor: true,
    title: 'Vellum Editorial Philosophy: Everyone Has Something Worth Saying',
    content: 'We built Vellum around timeless, distillation-first writing. From Morgan Housel to Robert Greene and James Clear, great writing is about clarity of thought and respect for the reader’s time.',
    category: 'General',
    repliesCount: 28,
    likesCount: 92,
    likedByUserIds: ['usr_author_james_clear', 'usr_author_morgan_housel'],
    createdAt: '2026-10-15T09:00:00.000Z',
  },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_founder_shreyanshu',
    type: 'premium_eligibility',
    title: 'Premium Story Threshold Reached!',
    message: '"Atomic Habits" has reached 4.94 rating from 890 verified readers.',
    link: '/story/story_atomic_habits',
    isRead: false,
    createdAt: '2026-10-18T14:35:00.000Z',
  },
];
