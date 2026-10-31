import {
  User,
  Story,
  StoryPart,
  RatingReview,
  PaymentRecord,
  WriterCertificate,
  CommunityThread,
  AppNotification,
  PlatformSettings,
  Challenge,
  ChallengeSubmission,
  InkVaultItem,
  WritersCircleGroup,
  DEFAULT_AVATAR,
} from '../types';
import { DEFAULT_PLATFORM_SETTINGS } from '../utils/premiumRules';

export const SEED_SETTINGS: PlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS };

export const FOUNDER_USER: User = {
  id: 'usr_founder_shreyanshu',
  email: 'mishrashreyanshu11@gmail.com',
  username: 'shreyanshu',
  displayName: 'Shreyanshu Mishra',
  password: 'Swayam11',
  bio: 'Founder & CEO of LEXORA — Beyond the Loop! Building the premier home for timeless wisdom, serialized literature, and visionary voices.',
  instagramHandle: 'lexora.____',
  avatar: DEFAULT_AVATAR,
  dob: '2000-10-26', // 26/10/2000
  country: 'India',
  state: 'Odisha',
  city: 'Bhubaneswar',
  readingThemePreference: 'golden',
  socialLinks: {
    twitter: 'https://twitter.com/shreyanshu',
    instagram: 'https://www.instagram.com/lexora.____?srtk=ZHkxMW1nd2NtN21h&utm_source=qr',
    website: 'https://whatsapp.com/channel/0029Vb8s4JuDuMRn4H7z0n3t',
  },
  preferredReadingLanguage: 'en',
  preferredWritingLanguage: 'en',
  preferredUiLanguage: 'en',
  role: 'founder',
  isVerified: true,
  isFounder: true,
  isPremiumSubscriber: true,
  subscriptionExpiry: '2030-12-31',
  followingIds: ['usr_author_james_clear', 'usr_author_morgan_housel'],
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const SEED_USERS: User[] = [
  FOUNDER_USER,
  {
    id: 'usr_author_james_clear',
    email: 'james.clear@lexora.read',
    username: 'jamesclear',
    displayName: 'James Clear',
    password: 'password123',
    bio: 'Author of Atomic Habits. Focused on human discipline, continuous compounding, and creative clarity.',
    avatar: DEFAULT_AVATAR,
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
    email: 'morgan.housel@lexora.read',
    username: 'morganhousel',
    displayName: 'Morgan Housel',
    password: 'password123',
    bio: 'Partner at Collaborative Fund, author of The Psychology of Money and Same As Ever.',
    avatar: DEFAULT_AVATAR,
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
    id: 'usr_reader_arjun',
    email: 'arjun.reader@lexora.com',
    username: 'arjun_reads',
    displayName: 'Arjun Verma',
    password: 'password123',
    bio: 'Avid explorer of serialized philosophy and classical mythologies.',
    avatar: DEFAULT_AVATAR,
    dob: '2008-04-12', // 18 years old
    role: 'reader',
    isVerified: false,
    isFounder: false,
    isPremiumSubscriber: false,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'usr_reader_young_kavya',
    email: 'kavya.junior@lexora.com',
    username: 'kavya_jr',
    displayName: 'Kavya Sharma',
    password: 'password123',
    bio: 'Junior reader studying folktales and school essays.',
    avatar: DEFAULT_AVATAR,
    dob: '2014-06-15', // 12 years old (underaged for 16+/18+ stories)
    role: 'reader',
    isVerified: false,
    isFounder: false,
    isPremiumSubscriber: false,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

// =============================================================================
// SEED STORIES — Flagship "Beyond the Loop" with Image 2 Cover + Real Published Works
// =============================================================================
export const SEED_STORIES: Story[] = [
  {
    id: 'story_beyond_the_loop',
    title: 'Beyond the Loop',
    synopsis: 'Where words find their worth, and creativity finds its home. Some cycles are meant to be broken. A profound serial exploring the boundaries of sovereign human expression, escaping the synthetic algorithmic loop, and stepping into the timeless realm of radiated thought.',
    coverImage: '/assets/aistudio/6EFD680D-3328-45B5-BDBD-1B2D6271E557_fd4e64c3.png', // Image 2 Cover
    authorId: 'usr_founder_shreyanshu',
    authorName: 'Shreyanshu Mishra',
    authorUsername: 'shreyanshu',
    authorAvatar: DEFAULT_AVATAR,
    authorIsVerified: true,
    authorIsFounder: true,
    authorHasCrownBadge: true,
    category: 'Philosophy & Visionary Literature',
    genre: 'Philosophical Serial',
    language: 'English',
    originalLanguage: 'en',
    ageRating: '10+', // Universal certification
    isGoldenLibrary: true, // Flagship Golden Library Masterpiece
    tags: ['Beyond the Loop', 'Founder Masterpiece', 'Literature', 'Philosophy', 'Radiated Thought'],
    status: 'published',
    isFeatured: true,
    ratingAverage: 5.0,
    ratingCount: 1840,
    readerCount: 42800,
    partsCount: 5,
    completed: true,
    audiobookEnabled: true,
    audiobookVoice: 'Kore',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
    aiAssessment: {
      indication: 'Low indication of AI assistance',
      confidenceScore: 100,
      spamScore: 0,
      originalityScore: 100,
      aiWritingRate: 0,
      isDisqualified: false,
      potentialPlagiarismConcern: false,
      unsafeOrProhibitedContent: false,
      flags: ['Sovereign authentic voice', 'Profound philosophical depth', 'Immaculate literary cadence'],
      editorialFeedback: 'A breathtaking manifesto of human literary sovereignty. Evocative, urgent, and timeless.',
      analyzedAt: '2026-10-25T18:00:00.000Z',
    },
  },
];

// =============================================================================
// SEED PARTS
// =============================================================================
export const SEED_PARTS: StoryPart[] = [
  // Beyond the Loop (5 parts)
  {
    id: 'part_beyond_the_loop_1',
    storyId: 'story_beyond_the_loop',
    partNumber: 1,
    title: 'Part 1 — The Architecture of Sovereign Thought',
    content: `The modern world does not ask you to think; it asks you to react. It feeds you infinite vertical feeds, calibrated dopamine loops, and synthetic prose designed to simulate intelligence without touching the soul.\n\nTo write—truly write—is to declare independence from this mechanized consensus. When an author sits before an unblemished page, refusing autocomplete, refusing generic clichés, and refusing algorithmic suggestions, something sacred occurs: the sovereign mind awakens.\n\nBeyond the loop is not a geographic destination; it is an interior posture. It is the deliberate decision to slow down, to hold a thought until it yields its deeper marrow, and to give your ideas the magnificent home they deserve. Where words find their worth, and creativity finds its home.`,
    wordCount: 820,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
  },
  {
    id: 'part_beyond_the_loop_2',
    storyId: 'story_beyond_the_loop',
    partNumber: 2,
    title: 'Part 2 — Breaking the Algorithmic Echo',
    content: `Look closely at the language of the modern century. It is smoothed, sanitized, stripped of jagged edges and authentic human scent. We are drowning in a deluge of synthetic certainty.\n\nYet what has ever moved the human heart? Was it predictable symmetry, or was it the sudden, breathless vulnerability of an honest confession? A line of poetry written under the lamplight while the rest of the city sleeps; a forgotten dispatch tucked inside a cedar drawer; the sudden silence when twilight breaks over the rooftops.\n\nWhen you step outside the loop, you realize that attention is our most sacred currency. To spend it on trivial noise is to squander a finite life. The writer who honors their craft creates a sanctuary where others can breathe freely once again.`,
    wordCount: 890,
    estimatedReadingTimeMinutes: 4,
    status: 'published',
    createdAt: '2026-01-08T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
  },
  {
    id: 'part_beyond_the_loop_3',
    storyId: 'story_beyond_the_loop',
    partNumber: 3,
    title: 'Part 3 — The Crucible of Radiated Thought',
    content: `Why radiated thought? Because genuine literature is radioactive in the most beautiful sense: it emanates energy across generations, unperturbed by the half-life of shifting trends.\n\nYou can read a sentence written in Florence six centuries ago, or an essay penned in Kyoto three hundred years prior, and your pulse quickens as though the author were whispering beside you in the room. That is the magic of the written word. It dissolves distance. It defeats time.\n\nAt LEXORA, we built this platform not for casual distraction, but as a temple for genuine craft. The Literary Passport is not a vanity metric; it is your record of devotion to the sovereign word.`,
    wordCount: 760,
    estimatedReadingTimeMinutes: 3,
    status: 'published',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
  },
  {
    id: 'part_beyond_the_loop_4',
    storyId: 'story_beyond_the_loop',
    partNumber: 4,
    title: 'Part 4 — The Golden Sanctuary',
    content: `A library is not merely a collection of books; it is a repository of human consciousness. When you enter the Golden Library, you enter a space shielded from commercial noise, where every manuscript has earned its place through reader resonance and editorial reverence.\n\nHere, the reader is not an ad impression. The writer is not content creator fodder. Both meet as equals in the shared reverence for ideas that deserve beautiful homes.\n\nAs we expand the frontiers of literature, we invite you to write with fearless authenticity. The loop ends the moment you choose your own voice.`,
    wordCount: 710,
    estimatedReadingTimeMinutes: 3,
    status: 'published',
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
  },
  {
    id: 'part_beyond_the_loop_5',
    storyId: 'story_beyond_the_loop',
    partNumber: 5,
    title: 'Part 5 — Where Words Find Their Worth',
    content: `We stand at the threshold of a new Renaissance. The future belongs not to those who can generate the most noise, but to those who can convey the deepest truth with the purest cadence.\n\nEvery voice has a universe. Every thought has a sanctuary waiting to receive it. To those who write differently, to those who read with patience, and to those who belong to the fellowship of the pen: welcome.\n\nLEXORA — Beyond the Loop!\nWhere words find their worth, and creativity finds its home.`,
    wordCount: 650,
    estimatedReadingTimeMinutes: 3,
    status: 'published',
    createdAt: '2026-01-30T00:00:00.000Z',
    updatedAt: '2026-10-25T18:00:00.000Z',
  },
];

export const SEED_REVIEWS: RatingReview[] = [
  {
    id: 'rev_beyond_1',
    storyId: 'story_beyond_the_loop',
    userId: 'usr_author_james_clear',
    userName: 'James Clear',
    userAvatar: DEFAULT_AVATAR,
    userIsVerified: true,
    userIsFounder: false,
    rating: 5,
    reviewText: 'A seminal treatise on creative sovereignty. Shreyanshu Mishra articulates the psychological cost of algorithmic distraction with peerless clarity.',
    createdAt: '2026-09-10T14:00:00.000Z',
  },
  {
    id: 'rev_beyond_2',
    storyId: 'story_beyond_the_loop',
    userId: 'usr_author_morgan_housel',
    userName: 'Morgan Housel',
    userAvatar: DEFAULT_AVATAR,
    userIsVerified: true,
    userIsFounder: false,
    rating: 5,
    reviewText: 'The true luxury in the 21st century is uninterrupted human contemplation. Beyond the Loop is both a beacon and a sanctuary for writers who refuse to surrender their depth.',
    createdAt: '2026-09-12T18:30:00.000Z',
  },
];

export const SEED_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_sub_1',
    userId: 'usr_author_james_clear',
    userEmail: 'james.clear@lexora.read',
    userName: 'James Clear',
    productType: 'monthly_subscription',
    amount: 299,
    transactionRef: 'UPI-REF-992148102941',
    paymentDestination: '7852931077@fam',
    status: 'verified',
    bankConfirmed: true,
    verificationNotes: 'Verified against merchant bank record',
    createdAt: '2026-10-01T10:14:00.000Z',
  },
];

export const SEED_CERTIFICATES: WriterCertificate[] = [
  {
    id: 'cert_lexora_1',
    certificateId: 'LX-CERT-2026-001',
    writerId: 'usr_founder_shreyanshu',
    writerName: 'Shreyanshu Mishra',
    writerUsername: 'shreyanshu',
    qualifyingStoriesCount: 5,
    averageRating: 5.0,
    issuedDate: '2026-10-25',
    signedBy: 'Shreyanshu Mishra, Founder & CEO',
    verificationCode: 'LX-CEO-FOUNDER-2026',
  },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_bday_1',
    userId: 'usr_founder_shreyanshu',
    title: '🎂 Happy Birthday from LEXORA! ✨',
    message: 'Dearest Shreyanshu, wishing you a triumphant birthday! May your words forever radiate truth beyond the loop. — Personally greeted by Shreyanshu Mishra, Founder & CEO',
    createdAt: '2026-10-26T00:00:00.000Z',
    isRead: false,
    type: 'announcement',
    link: '/story/story_beyond_the_loop',
  },
  {
    id: 'notif_welcome',
    userId: 'usr_founder_shreyanshu',
    title: 'LEXORA Sanctuary Live',
    message: 'Beyond the Loop has been published. Cover art updated to official edition.',
    createdAt: '2026-10-25T18:00:00.000Z',
    isRead: false,
    type: 'announcement',
    link: '/story/story_beyond_the_loop',
  },
];

export const SEED_CHALLENGES: Challenge[] = [];
export const SEED_SUBMISSIONS: ChallengeSubmission[] = [];
export const SEED_CHALLENGE_SUBMISSIONS = SEED_SUBMISSIONS;
export const SEED_INKVAULT_ITEMS: InkVaultItem[] = [];
export const SEED_INK_VAULT = SEED_INKVAULT_ITEMS;
export const SEED_THREADS: CommunityThread[] = [];
export const SEED_COMMUNITY_THREADS = SEED_THREADS;
export const SEED_CIRCLES: WritersCircleGroup[] = [];
export const SEED_WRITERS_CIRCLES = SEED_CIRCLES;
export const SEED_CERTIFICATE = SEED_CERTIFICATES;

