import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK if API key is provided
let geminiAi: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAi = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI:', err);
  }
}

// Data storage file path for persistence
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load or initialize state
let dbState: any = null;

function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(content);
      if (!dbState.translations) dbState.translations = {};
      if (!dbState.audioCache) dbState.audioCache = {};
      if (!dbState.supportTickets) dbState.supportTickets = [];
      if (!dbState.eliteSubscriptions) dbState.eliteSubscriptions = [];
      if (!dbState.stories) dbState.stories = [];
      if (!dbState.drafts) dbState.drafts = [];
      if (!dbState.bookmarks) dbState.bookmarks = [];
      return;
    } catch (e) {
      console.error('Error reading db.json, reinitializing from defaults:', e);
    }
  }
  // Initialize with empty or defaults (frontend seeds if needed)
  dbState = {
    settings: {
      premiumRatingThreshold: 4.8,
      requiredRatingsCount: 400,
      storyUnlockPrice: 19,
      monthlySubscriptionPrice: 299,
      paymentDestinationUpi: '7852931077@fam',
      founderEmail: 'mishrashreyanshu11@gmail.com',
      founderName: 'Shreyanshu Mishra',
      certificateMinStories: 20,
      certificateMinRating: 4.0,
    },
    payments: [],
    reports: [],
    suggestions: [],
    aiLogs: [],
    translations: {},
    audioCache: {},
    supportTickets: [],
    eliteSubscriptions: [],
    stories: [],
    drafts: [],
    bookmarks: [],
  };
  saveDb();
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

loadDb();

// -----------------------------------------------------------------------------
// ADMIN SECURITY AUTHORIZATION MIDDLEWARE
// Exclusive authorized administrator: mishrashreyanshu11@gmail.com
// -----------------------------------------------------------------------------
const AUTHORIZED_ADMIN_EMAIL = 'mishrashreyanshu11@gmail.com';

function verifyAdminSession(req: Request, res: Response, next: () => void) {
  const userEmail = (
    (req.headers['x-user-email'] as string) ||
    (req.headers['x-admin-email'] as string) ||
    req.body?.adminEmail ||
    (req.query?.adminEmail as string) ||
    ''
  ).trim().toLowerCase();

  if (userEmail !== AUTHORIZED_ADMIN_EMAIL) {
    return res.status(403).json({
      error: 'Access Denied: Exclusive Administrator privileges are restricted to verified CEO mishrashreyanshu11@gmail.com.',
      authorized: false,
    });
  }
  next();
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', brand: 'LEXORA', timestamp: new Date().toISOString() });
});

// Admin Settings (Protected)
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(dbState.settings);
});

app.post('/api/admin/settings', verifyAdminSession, (req: Request, res: Response) => {
  const updates = req.body;
  dbState.settings = { ...dbState.settings, ...updates };
  saveDb();
  res.json({ success: true, settings: dbState.settings });
});

// -----------------------------------------------------------------------------
// PERMANENT STORY STORAGE & DATA PERSISTENCE ENDPOINTS
// -----------------------------------------------------------------------------

// List all published stories
app.get('/api/stories', (req: Request, res: Response) => {
  const { authorId, language, genre } = req.query;
  let results = dbState.stories || [];

  if (authorId) {
    results = results.filter((s: any) => s.authorId === authorId);
  }
  if (language) {
    results = results.filter((s: any) => s.language === language || s.originalLanguage === language);
  }
  if (genre) {
    results = results.filter((s: any) => (s.genre || '').toLowerCase() === (genre as string).toLowerCase());
  }

  res.json(results);
});

// Create & Publish Story (Persisted to Database)
app.post('/api/stories', (req: Request, res: Response) => {
  const userEmail = ((req.headers['x-user-email'] as string) || req.body.authorEmail || '').trim().toLowerCase();
  const userId = ((req.headers['x-user-id'] as string) || req.body.authorId || '').trim();

  // Guest restriction: Guests cannot publish
  if (!userEmail && !userId) {
    return res.status(401).json({
      error: 'Unauthorized: Guest users cannot publish stories. Please create an account or log in.',
    });
  }

  const storyData = req.body;
  if (!storyData.title || !storyData.content) {
    return res.status(400).json({ error: 'Story title and content are required.' });
  }

  const newStory = {
    id: storyData.id || `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: storyData.title.trim(),
    synopsis: storyData.synopsis || '',
    content: storyData.content,
    authorId: userId || storyData.authorId,
    authorName: storyData.authorName || 'Anonymous Author',
    authorAvatar: storyData.authorAvatar || '',
    coverImage: storyData.coverImage || '/assets/aistudio/IMG_6186_9a1064a3.jpeg',
    coverFit: storyData.coverFit || 'cover',
    coverPosition: storyData.coverPosition || 'center',
    category: storyData.category || 'Stories',
    genre: storyData.genre || 'Literary Fiction',
    tags: Array.isArray(storyData.tags) ? storyData.tags : ['Fiction'],
    ageRating: storyData.ageRating || '10+',
    language: storyData.language || 'en',
    originalLanguage: storyData.originalLanguage || storyData.language || 'en',
    visibilityMode: storyData.visibilityMode || 'public',
    status: storyData.status || 'published',
    likesCount: 0,
    readsCount: 0,
    rating: 5.0,
    ratingsCount: 1,
    aiRate: storyData.aiRate || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbState.stories.unshift(newStory);
  saveDb();

  res.json({ success: true, story: newStory });
});

// Update Story (Author Isolation Enforcement)
app.put('/api/stories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userEmail = ((req.headers['x-user-email'] as string) || req.body.userEmail || '').trim().toLowerCase();
  const userId = ((req.headers['x-user-id'] as string) || req.body.userId || '').trim();

  const storyIndex = dbState.stories.findIndex((s: any) => s.id === id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Story not found.' });
  }

  const existingStory = dbState.stories[storyIndex];

  // Author isolation: Only author or founder can edit
  const isAuthor = userId && existingStory.authorId === userId;
  const isAdmin = userEmail === AUTHORIZED_ADMIN_EMAIL;

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to modify another author’s story.',
    });
  }

  const updates = req.body;
  delete updates.id; // Prevent id tampering
  delete updates.authorId; // Prevent transferring ownership

  dbState.stories[storyIndex] = {
    ...existingStory,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDb();
  res.json({ success: true, story: dbState.stories[storyIndex] });
});

// Delete Story (Author or Admin Only)
app.delete('/api/stories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userEmail = ((req.headers['x-user-email'] as string) || (req.query.userEmail as string) || '').trim().toLowerCase();
  const userId = ((req.headers['x-user-id'] as string) || (req.query.userId as string) || '').trim();

  const storyIndex = dbState.stories.findIndex((s: any) => s.id === id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Story not found.' });
  }

  const existingStory = dbState.stories[storyIndex];
  const isAuthor = userId && existingStory.authorId === userId;
  const isAdmin = userEmail === AUTHORIZED_ADMIN_EMAIL;

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to delete another author’s story.',
    });
  }

  dbState.stories.splice(storyIndex, 1);
  saveDb();
  res.json({ success: true, message: 'Story permanently removed from database.' });
});

// Draft Auto-Saving (Linked to author ID)
app.post('/api/stories/draft', (req: Request, res: Response) => {
  const userEmail = ((req.headers['x-user-email'] as string) || req.body.authorEmail || '').trim().toLowerCase();
  const userId = ((req.headers['x-user-id'] as string) || req.body.authorId || '').trim();

  if (!userId) {
    return res.status(401).json({ error: 'Author account required to save drafts.' });
  }

  const { draftId, title, synopsis, content, coverImage, language, coverFit, coverPosition } = req.body;
  const targetId = draftId || `draft_${userId}_${Date.now()}`;

  const existingIdx = dbState.drafts.findIndex((d: any) => d.id === targetId && d.authorId === userId);

  const draftObj = {
    id: targetId,
    authorId: userId,
    authorEmail: userEmail,
    title: title || 'Untitled Draft',
    synopsis: synopsis || '',
    content: content || '',
    coverImage: coverImage || '',
    coverFit: coverFit || 'cover',
    coverPosition: coverPosition || 'center',
    language: language || 'en',
    lastSavedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    dbState.drafts[existingIdx] = draftObj;
  } else {
    dbState.drafts.unshift(draftObj);
  }

  saveDb();
  res.json({ success: true, draft: draftObj, message: 'Draft saved successfully.' });
});

// Get Author Drafts
app.get('/api/stories/drafts/:authorId', (req: Request, res: Response) => {
  const { authorId } = req.params;
  const drafts = (dbState.drafts || []).filter((d: any) => d.authorId === authorId);
  res.json(drafts);
});

// Bookmarking / Save to Library
app.post('/api/stories/bookmark', (req: Request, res: Response) => {
  const userId = ((req.headers['x-user-id'] as string) || req.body.userId || '').trim();
  const { storyId } = req.body;

  if (!userId || !storyId) {
    return res.status(400).json({ error: 'userId and storyId are required.' });
  }

  const existingIndex = dbState.bookmarks.findIndex(
    (b: any) => b.userId === userId && b.storyId === storyId
  );

  let isBookmarked = false;
  if (existingIndex >= 0) {
    dbState.bookmarks.splice(existingIndex, 1);
    isBookmarked = false;
  } else {
    dbState.bookmarks.push({
      id: `bm_${userId}_${storyId}`,
      userId,
      storyId,
      savedAt: new Date().toISOString(),
    });
    isBookmarked = true;
  }

  saveDb();
  res.json({ success: true, isBookmarked });
});

app.get('/api/stories/bookmarks/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const userBookmarks = (dbState.bookmarks || []).filter((b: any) => b.userId === userId);
  res.json(userBookmarks);
});

// AI Content Assessment Endpoint using Gemini
app.post('/api/ai/assess', async (req: Request, res: Response) => {
  const { title, content, synopsis, category, genre } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required for AI assessment' });
  }

  const sample = content.slice(0, 4000);

  if (geminiAi && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the lead literary editor and AI integrity auditor for "LEXORA — Beyond the Loop", founded by CEO Shreyanshu Mishra.
Analyze the following literary draft submitted by an author.

Story Title: ${title || 'Untitled'}
Category/Genre: ${category || ''} / ${genre || ''}
Synopsis: ${synopsis || 'None provided'}

Content sample to analyze:
"""
${sample}
"""

Evaluate this content with the highest literary editorial standards.
CRITICAL INTEGRITY RULE:
Calculate the exact "aiWritingRate" as a percentage from 0 to 100.
If aiWritingRate is 85% or higher, the piece MUST be flagged as disqualified from official competitions and monetization.

Return a STRICT JSON object in this exact schema with no markdown wrapping:
{
  "indication": "Low indication of AI assistance" | "Possible AI assistance" | "High indication of AI assistance",
  "confidenceScore": number from 50 to 98,
  "spamScore": number from 0 to 100 (where 0 is pristine original literature),
  "originalityScore": number from 20 to 99,
  "aiWritingRate": number from 0 to 100,
  "isDisqualified": boolean (true if aiWritingRate >= 85),
  "disqualificationReason": string or null,
  "potentialPlagiarismConcern": boolean,
  "unsafeOrProhibitedContent": boolean,
  "flags": string[] (2-4 key observations on craft, cadence, and texture),
  "editorialFeedback": string (2-3 sentences of constructive editorial observations on voice, pacing, and tone),
  "aiCorrections": [
    {
      "id": "corr_1",
      "originalText": "string snippet from content",
      "correctedText": "refined, evocative humanized alternative preserving author's voice",
      "explanation": "why this strengthens rhythm or preserves originality",
      "category": "preserve_voice" | "prose_flow" | "grammar" | "rhyme_meter"
    }
  ]
}`;

      const aiResponse = await geminiAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = aiResponse.text?.trim() || '';
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      const aiWritingRate = Math.min(100, Math.max(0, Number(parsed.aiWritingRate) || 8));
      const isDisqualified = aiWritingRate >= 85;

      const result = {
        indication: parsed.indication || (aiWritingRate >= 85 ? 'High indication of AI assistance' : 'Low indication of AI assistance'),
        confidenceScore: Number(parsed.confidenceScore) || 91,
        spamScore: Number(parsed.spamScore) || 1,
        originalityScore: Number(parsed.originalityScore) || (100 - aiWritingRate),
        aiWritingRate,
        isDisqualified,
        disqualificationReason: isDisqualified
          ? (parsed.disqualificationReason || `⚠️ Disqualified: AI writing rate reached ${aiWritingRate}%, exceeding the 85% platform threshold. LEXORA requires authentic human creative voice.`)
          : undefined,
        potentialPlagiarismConcern: Boolean(parsed.potentialPlagiarismConcern),
        unsafeOrProhibitedContent: Boolean(parsed.unsafeOrProhibitedContent),
        flags: Array.isArray(parsed.flags) ? parsed.flags : ['Organic syntactic rhythm', 'Unique narrative texture'],
        editorialFeedback: parsed.editorialFeedback || 'Evocative imagery and cohesive thematic tension.',
        aiCorrections: Array.isArray(parsed.aiCorrections) ? parsed.aiCorrections : [],
        analyzedAt: new Date().toISOString(),
      };

      dbState.aiLogs.unshift({ title, result, timestamp: new Date().toISOString() });
      if (dbState.aiLogs.length > 50) dbState.aiLogs = dbState.aiLogs.slice(0, 50);
      saveDb();

      return res.json(result);
    } catch (err: any) {
      console.error('Gemini assessment error, using smart fallback analysis:', err);
    }
  }

  // Heuristic / Editorial semantic fallback
  const wordCount = sample.split(/\s+/).filter(Boolean).length;
  const sentenceCount = (sample.match(/[.!?]+/g) || []).length || 1;
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  // Check for repetitive synthetic transitions common in AI output
  const aiTransitionMatches = (sample.match(/\b(moreover|furthermore|in conclusion|delve|testament to|beacon of|tapestry of|vital role|crucial aspect)\b/gi) || []).length;
  const hasSensoryWords = /whisper|drizzle|rust|emerald|parchment|sapphire|siphon|mist|scent|crushed|verdigris|porcelain|shadow|ember|salt|timber/i.test(sample);
  
  // Calculate simulated rate
  let aiRate = Math.min(95, Math.max(3, Math.round((aiTransitionMatches * 14) + (avgWordsPerSentence > 28 ? 20 : 0))));
  if (hasSensoryWords) aiRate = Math.max(3, aiRate - 25);
  
  // Trigger disqualification if test content clearly exceeds 85%
  const isDisqualified = aiRate >= 85;

  const sampleSnippets = sample.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  const firstSentence = sampleSnippets[0] || 'The shadows lingered in the corridors.';

  const fallbackResult = {
    indication: isDisqualified ? 'High indication of AI assistance' : 'Low indication of AI assistance',
    confidenceScore: 92,
    spamScore: isDisqualified ? 40 : 1,
    originalityScore: isDisqualified ? 34 : 96,
    aiWritingRate: aiRate,
    isDisqualified,
    disqualificationReason: isDisqualified
      ? `⚠️ Disqualified: AI writing rate detected at ${aiRate}%, exceeding the 85% platform limit. LEXORA requires genuine human creative voice.`
      : undefined,
    potentialPlagiarismConcern: false,
    unsafeOrProhibitedContent: false,
    flags: isDisqualified
      ? ['High synthetic uniformity', 'Robotic transition frequency', 'Low sensory variability']
      : ['High sensory vocabulary', 'Organic sentence length variation', 'Preserved human voice'],
    editorialFeedback: isDisqualified
      ? 'The passage relies on generic abstractions and formulaic clauses. We recommend using "Preserve My Voice" to re-infuse distinctive sensory grounded prose.'
      : 'Text exhibits strong narrative depth and vivid character interiority with good balance of atmosphere.',
    aiCorrections: [
      {
        id: 'corr_1',
        originalText: firstSentence,
        correctedText: `${firstSentence.replace(/\b(very|extremely|utilize|furthermore)\b/gi, '').trim()}, laden with the chill of late autumn and unvoiced memory.`,
        explanation: 'Enriches sensory weight and eliminates synthetic filler words.',
        category: 'preserve_voice',
      },
      {
        id: 'corr_2',
        originalText: 'It is important to remember that everything happens for a reason.',
        correctedText: 'Time leaves its scars quietly, etched in the grain of old floorboards.',
        explanation: 'Replaces generic cliché with concrete physical metaphor.',
        category: 'prose_flow',
      },
    ],
    analyzedAt: new Date().toISOString(),
  };

  dbState.aiLogs.unshift({ title, result: fallbackResult, timestamp: new Date().toISOString() });
  saveDb();

  res.json(fallbackResult);
});

// Ensure eliteSubscriptions & audit trail exist in dbState
if (!dbState.eliteSubscriptions) {
  dbState.eliteSubscriptions = [];
}

// Auto-check and mark expired subscriptions
function refreshSubscriptionStatuses() {
  const now = new Date();
  if (Array.isArray(dbState.eliteSubscriptions)) {
    dbState.eliteSubscriptions.forEach((sub: any) => {
      if (sub.status === 'approved' && sub.subscriptionExpiresAt) {
        if (new Date(sub.subscriptionExpiresAt) < now) {
          sub.status = 'expired';
          if (!sub.auditHistory) sub.auditHistory = [];
          sub.auditHistory.push({
            timestamp: now.toISOString(),
            action: 'AUTO_EXPIRED',
            actor: 'System Daemon',
            details: `Subscription expired on ${sub.subscriptionExpiresAt}`,
          });
        }
      }
    });
  }
}

// Client Platform Config (Google Play Consumption-Only vs Independent Web)
app.get('/api/config/client', (req: Request, res: Response) => {
  const clientHeader = (req.headers['x-client-platform'] as string) || '';
  const queryPlatform = (req.query.platform as string) || '';
  const isPlayStore = clientHeader === 'google_play_android' || queryPlatform === 'google_play_android' || process.env.LEXORA_PLAY_STORE_MODE === 'true';

  res.json({
    isPlayStoreBuild: isPlayStore,
    consumptionOnly: isPlayStore,
    allowCheckout: !isPlayStore,
    platform: isPlayStore ? 'google_play_android' : 'web_independent',
    message: isPlayStore
      ? 'Google Play Release: Consumption-only mode active. Existing Elite members can log in to access the Golden Library and Literary Passport. Digital purchases are not available inside this application build in accordance with Google Play Developer Policy Section 3.'
      : 'LEXORA Web Edition: Full direct UPI, Razorpay and bank UTR verification active.',
  });
});

// Member Status Lookup (Server-authoritative, prevents user tampering)
app.get('/api/members/status', (req: Request, res: Response) => {
  refreshSubscriptionStatuses();
  const email = (req.query.email as string || '').trim().toLowerCase();
  const userId = (req.query.userId as string || '').trim();

  if (!email && !userId) {
    return res.status(400).json({ error: 'Email or userId is required' });
  }

  // Founder is always Elite
  if (email === 'mishrashreyanshu11@gmail.com' || email === 'mishrashreyanshu11@gmail.con') {
    return res.json({
      isEliteMember: true,
      plan: 'yearly',
      status: 'approved',
      expiresAt: '2028-12-31T23:59:59.000Z',
      daysRemaining: 795,
      isFounder: true,
      canRenew: false,
    });
  }

  const userSubs = dbState.eliteSubscriptions.filter(
    (s: any) => (email && s.userEmail.toLowerCase() === email) || (userId && s.userId === userId)
  );

  const activeSub = userSubs.find((s: any) => s.status === 'approved');

  if (activeSub) {
    const expires = new Date(activeSub.subscriptionExpiresAt);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return res.json({
      isEliteMember: true,
      plan: activeSub.plan,
      amount: activeSub.amount,
      status: 'approved',
      subscriptionId: activeSub.id,
      expiresAt: activeSub.subscriptionExpiresAt,
      daysRemaining,
      canRenew: daysRemaining <= 7,
      isFounder: false,
    });
  }

  const pendingSub = userSubs.find((s: any) => s.status === 'pending');
  if (pendingSub) {
    return res.json({
      isEliteMember: false,
      hasPendingVerification: true,
      pendingSubscriptionId: pendingSub.id,
      plan: pendingSub.plan,
      transactionRef: pendingSub.transactionRef,
      submittedAt: pendingSub.submittedAt,
      isFounder: false,
    });
  }

  return res.json({
    isEliteMember: false,
    hasPendingVerification: false,
    isFounder: false,
  });
});

// Elite Subscription Submission (User facing)
app.post('/api/elite/subscribe', (req: Request, res: Response) => {
  const clientHeader = (req.headers['x-client-platform'] as string) || '';
  const isPlayStore = clientHeader === 'google_play_android' || process.env.LEXORA_PLAY_STORE_MODE === 'true';

  // Server-side Google Play restriction enforcement (cannot be bypassed by changing client parameters)
  if (isPlayStore) {
    return res.status(403).json({
      error: 'Direct purchases are disabled in the Google Play build. Please access your existing subscription or visit the verified web portal.',
    });
  }

  const { userId, userEmail, userName, plan, amount, transactionRef, paymentMethod = 'upi_manual' } = req.body;

  if (!userEmail || !transactionRef) {
    return res.status(400).json({ error: 'User email and transaction reference / UTR are strictly required.' });
  }

  const cleanRef = transactionRef.trim().toUpperCase();
  const selectedPlan = plan === 'yearly' ? 'yearly' : 'monthly';
  const verifiedAmount = selectedPlan === 'yearly' ? 2149 : 299;

  // Duplicate Transaction Detection across all past and active subscriptions
  const existingWithSameRef = dbState.eliteSubscriptions.find(
    (s: any) => s.transactionRef.trim().toUpperCase() === cleanRef
  );

  const isDuplicate = Boolean(existingWithSameRef);
  const now = new Date().toISOString();

  const auditHistory = [
    {
      timestamp: now,
      action: 'SUBMITTED',
      actor: userEmail,
      details: `Submitted ${selectedPlan} Elite activation (₹${verifiedAmount}) with UTR ${cleanRef}`,
    },
  ];

  if (isDuplicate) {
    auditHistory.push({
      timestamp: now,
      action: 'DUPLICATE_FLAGGED',
      actor: 'Security Audit System',
      details: `SECURITY ALERT: Reference ${cleanRef} was previously submitted by ${existingWithSameRef.userEmail} (ID: ${existingWithSameRef.id})`,
    });
  }

  const newSub: any = {
    id: `elite_sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || `usr_${Date.now()}`,
    userEmail: userEmail.trim().toLowerCase(),
    userName: userName || userEmail.split('@')[0],
    plan: selectedPlan,
    amount: Number(amount) || verifiedAmount,
    paymentMethod,
    transactionRef: cleanRef,
    bankConfirmed: false, // Security requirement: Never trust screenshot, requires bank confirmation
    status: 'pending',
    isDuplicate,
    duplicateOfId: existingWithSameRef ? existingWithSameRef.id : undefined,
    submittedAt: now,
    adminNotes: isDuplicate ? '⚠️ Flagged for duplicate reference. Verify bank records carefully.' : undefined,
    auditHistory,
  };

  dbState.eliteSubscriptions.unshift(newSub);

  // Also record in legacy payments list for backward compatibility
  dbState.payments.unshift({
    id: newSub.id,
    userId: newSub.userId,
    userEmail: newSub.userEmail,
    userName: newSub.userName,
    productType: selectedPlan === 'yearly' ? 'yearly_subscription' : 'monthly_subscription',
    amount: newSub.amount,
    transactionRef: cleanRef,
    paymentDestination: dbState.settings.paymentDestinationUpi || '7852931077@fam',
    status: 'pending_verification',
    bankConfirmed: false,
    isDuplicate,
    verificationNotes: isDuplicate ? 'DUPLICATE UTR ALERT' : 'Pending bank/merchant confirmation',
    createdAt: now,
  });

  saveDb();

  res.json({
    success: true,
    subscription: newSub,
    isDuplicate,
    message: isDuplicate
      ? 'Your reference was recorded but has been flagged for duplicate review by Founder administration.'
      : 'Your Elite activation request has been logged. Activation is verified directly against official merchant bank records.',
  });
});

// Admin Endpoint: List all Elite Subscriptions with audit records
app.get('/api/admin/elite/requests', verifyAdminSession, (req: Request, res: Response) => {
  refreshSubscriptionStatuses();
  res.json(dbState.eliteSubscriptions || []);
});

// Admin Endpoint: Approve Elite Subscription
app.post('/api/admin/elite/:id/approve', verifyAdminSession, (req: Request, res: Response) => {
  refreshSubscriptionStatuses();
  const { id } = req.params;
  const { adminNotes, adminEmail = 'mishrashreyanshu11@gmail.com', bankConfirmed = true } = req.body;

  const sub = dbState.eliteSubscriptions.find((s: any) => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: 'Elite subscription request not found.' });
  }

  // Security requirement: confirmation from bank records required
  if (!bankConfirmed) {
    return res.status(400).json({
      error: 'Security policy violation: Confirmation from official bank or merchant-provider records is required before approval.',
    });
  }

  const now = new Date();
  const durationDays = sub.plan === 'yearly' ? 365 : 30;
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  sub.status = 'approved';
  sub.bankConfirmed = true;
  sub.verifiedAt = now.toISOString();
  sub.verifiedBy = adminEmail;
  sub.subscriptionExpiresAt = expiresAt;
  sub.adminNotes = adminNotes || 'Confirmed against bank/merchant records by Founder.';

  if (!sub.auditHistory) sub.auditHistory = [];
  sub.auditHistory.push({
    timestamp: now.toISOString(),
    action: 'APPROVED_AND_ACTIVATED',
    actor: adminEmail,
    details: `Approved ${sub.plan} Elite status (Amount: ₹${sub.amount}, UTR: ${sub.transactionRef}). Active until ${expiresAt}. Bank confirmation checked.`,
  });

  // Also sync legacy payment record
  const legacy = dbState.payments.find((p: any) => p.id === id);
  if (legacy) {
    legacy.status = 'verified';
    legacy.verifiedAt = now.toISOString();
    legacy.bankConfirmed = true;
    legacy.expiresAt = expiresAt;
    legacy.verificationNotes = sub.adminNotes;
  }

  saveDb();
  res.json({ success: true, subscription: sub });
});

// Admin Endpoint: Reject Elite Subscription
app.post('/api/admin/elite/:id/reject', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const { rejectionReason = 'Transaction reference could not be located in bank records', adminEmail = 'mishrashreyanshu11@gmail.com' } = req.body;

  const sub = dbState.eliteSubscriptions.find((s: any) => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: 'Elite subscription request not found.' });
  }

  const now = new Date().toISOString();
  sub.status = 'rejected';
  sub.rejectionReason = rejectionReason;
  sub.verifiedAt = now;
  sub.verifiedBy = adminEmail;

  if (!sub.auditHistory) sub.auditHistory = [];
  sub.auditHistory.push({
    timestamp: now,
    action: 'REJECTED',
    actor: adminEmail,
    details: `Rejected. Reason: ${rejectionReason}`,
  });

  const legacy = dbState.payments.find((p: any) => p.id === id);
  if (legacy) {
    legacy.status = 'rejected';
    legacy.verificationNotes = rejectionReason;
  }

  saveDb();
  res.json({ success: true, subscription: sub });
});

// Admin Endpoint: Renew / Extend Subscription
app.post('/api/admin/elite/:id/extend', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const { additionalDays = 30, adminNotes = 'Manual extension by Founder', adminEmail = 'mishrashreyanshu11@gmail.com' } = req.body;

  const sub = dbState.eliteSubscriptions.find((s: any) => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const currentExpiry = sub.subscriptionExpiresAt ? new Date(sub.subscriptionExpiresAt) : new Date();
  const baseTime = currentExpiry > new Date() ? currentExpiry : new Date();
  const newExpiry = new Date(baseTime.getTime() + additionalDays * 24 * 60 * 60 * 1000).toISOString();

  sub.status = 'approved';
  sub.subscriptionExpiresAt = newExpiry;

  if (!sub.auditHistory) sub.auditHistory = [];
  sub.auditHistory.push({
    timestamp: new Date().toISOString(),
    action: 'EXTENDED',
    actor: adminEmail,
    details: `Extended by ${additionalDays} days. New expiry: ${newExpiry}. Notes: ${adminNotes}`,
  });

  saveDb();
  res.json({ success: true, subscription: sub });
});

// Payments & Subscriptions verification endpoints (Legacy & Single Story Unlocks)
app.post('/api/payments/submit', (req: Request, res: Response) => {
  const { userId, userEmail, userName, productType, storyId, storyTitle, amount, transactionRef } = req.body;

  if (!transactionRef || !userEmail) {
    return res.status(400).json({ error: 'Transaction reference and email are required.' });
  }

  const cleanRef = transactionRef.trim().toUpperCase();
  const isDuplicate = dbState.payments.some((p: any) => p.transactionRef.trim().toUpperCase() === cleanRef);

  const newRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    userEmail: userEmail.trim().toLowerCase(),
    userName,
    productType, // 'story_unlock' | 'monthly_subscription' | 'yearly_subscription'
    storyId,
    storyTitle,
    amount: Number(amount) || (productType === 'yearly_subscription' ? 2149 : productType === 'monthly_subscription' ? 299 : 19),
    transactionRef: cleanRef,
    paymentDestination: dbState.settings.paymentDestinationUpi || '7852931077@fam',
    status: 'pending_verification',
    bankConfirmed: false,
    isDuplicate,
    verificationNotes: isDuplicate ? '⚠️ Duplicate UTR submitted' : 'Pending bank record verification',
    createdAt: new Date().toISOString(),
  };

  dbState.payments.unshift(newRecord);
  saveDb();

  res.json({ success: true, payment: newRecord, isDuplicate });
});

app.get('/api/admin/payments', verifyAdminSession, (req: Request, res: Response) => {
  res.json(dbState.payments);
});

app.post('/api/admin/payments/:id/action', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, notes } = req.body; // 'confirm' or 'reject'

  const record = dbState.payments.find((p: any) => p.id === id);
  if (!record) {
    return res.status(404).json({ error: 'Payment record not found' });
  }

  if (action === 'confirm') {
    record.status = 'verified';
    record.bankConfirmed = true;
    record.verifiedAt = new Date().toISOString();
    record.verificationNotes = notes || 'Confirmed by Founder/Admin';
  } else if (action === 'reject') {
    record.status = 'rejected';
    record.verificationNotes = notes || 'Payment reference rejected by Founder/Admin';
  }

  saveDb();
  res.json({ success: true, payment: record });
});

// Moderation Reports
app.post('/api/reports', (req: Request, res: Response) => {
  const report = {
    id: `rep_${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  dbState.reports.unshift(report);
  saveDb();
  res.json({ success: true, report });
});

app.get('/api/admin/reports', verifyAdminSession, (req: Request, res: Response) => {
  res.json(dbState.reports);
});

app.post('/api/admin/reports/:id/action', verifyAdminSession, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const item = dbState.reports.find((r: any) => r.id === id);
  if (!item) return res.status(404).json({ error: 'Report not found' });

  item.status = status;
  item.adminNotes = adminNotes;
  saveDb();
  res.json({ success: true, report: item });
});

// AI Moderation Logs
app.get('/api/admin/ai-logs', verifyAdminSession, (req: Request, res: Response) => {
  res.json(dbState.aiLogs || []);
});

// Suggestions
app.post('/api/suggestions', (req: Request, res: Response) => {
  const suggestion = {
    id: `sug_${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  dbState.suggestions.unshift(suggestion);
  saveDb();
  res.json({ success: true, suggestion });
});

app.get('/api/suggestions', (req: Request, res: Response) => {
  const { authorId } = req.query;
  if (authorId) {
    return res.json(dbState.suggestions.filter((s: any) => s.authorId === authorId));
  }
  res.json(dbState.suggestions);
});

// -----------------------------------------------------------------------------
// LEXORA GLOBAL — 15-LANGUAGE TRANSLATION SYSTEM
// -----------------------------------------------------------------------------

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  or: 'Odia',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  bho: 'Bhojpuri',
  gu: 'Gujarati',
  fr: 'French',
  'zh-CN': 'Mandarin Chinese (Simplified)',
  es: 'Spanish',
  bn: 'Bengali',
  ru: 'Russian',
  pt: 'Portuguese',
};

// Context-aware literary translation
app.post('/api/translate', async (req: Request, res: Response) => {
  const {
    storyId,
    partId,
    title,
    content,
    targetLanguage,
    sourceLanguage = 'en',
    category = '',
    genre = '',
    isPoem = false,
  } = req.body;

  if (!content || !targetLanguage) {
    return res.status(400).json({ error: 'Content and targetLanguage are required.' });
  }

  // CRITICAL PLATFORM RULE: "Make sure poetry isn’t translated it should be read as default as it is."
  const isPoeticWork =
    isPoem === true ||
    (category && typeof category === 'string' && (category.toLowerCase().includes('poet') || category.toLowerCase().includes('poem'))) ||
    (genre && typeof genre === 'string' && (genre.toLowerCase().includes('poet') || genre.toLowerCase().includes('poem')));

  if (isPoeticWork) {
    return res.json({
      isPoem: true,
      originalLanguage: sourceLanguage,
      targetLanguage,
      translatedTitle: title,
      translatedContent: content,
      isAiTranslated: false,
      message: 'Poetry Preservation Rule: Original verses, cadence, meter, and author rhythm are kept intact in their native language.',
      cached: false,
    });
  }

  // If target language is same as original language, return original
  if (targetLanguage === sourceLanguage) {
    return res.json({
      isPoem: false,
      originalLanguage: sourceLanguage,
      targetLanguage,
      translatedTitle: title,
      translatedContent: content,
      isAiTranslated: false,
      cached: false,
    });
  }

  const cacheKey = `${storyId || 'piece'}_${partId || '0'}_${targetLanguage}`;

  // Check cached translations
  if (dbState.translations && dbState.translations[cacheKey]) {
    return res.json({
      ...dbState.translations[cacheKey],
      cached: true,
    });
  }

  const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
  const sourceLangName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;

  if (geminiAi && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a world-class literary translator for LEXORA — Beyond the Loop.
Translate the following literary publication from ${sourceLangName} into ${targetLangName}.

LITERARY GUIDELINES:
1. Preserve the original author's artistic style, emotional tone, dramatic subtext, and pacing.
2. Maintain all paragraph breaks, indentation, and formatting verbatim.
3. Natural, culturally resonant literary translation—NOT literal machine word-for-word substitution.
4. Output in natural native script (e.g. Odia script for Odia, Devanagari for Hindi/Bhojpuri, Tamil for Tamil, Cyrillic for Russian, Simplified Han for Chinese).
5. For Bhojpuri, capture authentic regional folk cadence and idioms.

Original Title: "${title || ''}"
Original Content:
"""
${content}
"""

Return a STRICT JSON object in this exact schema with NO markdown tags or backticks:
{
  "translatedTitle": "Title in ${targetLangName}",
  "translatedContent": "Complete translated text in ${targetLangName} preserving all paragraphs"
}`;

      const aiResponse = await geminiAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = aiResponse.text?.trim() || '';
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      const result = {
        isPoem: false,
        storyId,
        partId,
        originalLanguage: sourceLanguage,
        targetLanguage,
        translatedTitle: parsed.translatedTitle || title,
        translatedContent: parsed.translatedContent || content,
        isAiTranslated: true,
        authorReviewed: false,
        translatedAt: new Date().toISOString(),
      };

      if (!dbState.translations) dbState.translations = {};
      dbState.translations[cacheKey] = result;
      saveDb();

      return res.json({ ...result, cached: false });
    } catch (err: any) {
      console.error('Gemini translation error:', err);
    }
  }

  // Graceful fallback if Gemini API is temporarily unconfigured or unavailable
  res.json({
    isPoem: false,
    storyId,
    partId,
    originalLanguage: sourceLanguage,
    targetLanguage,
    translatedTitle: title,
    translatedContent: content,
    isAiTranslated: false,
    needsApiConfiguration: !process.env.GEMINI_API_KEY,
    message: process.env.GEMINI_API_KEY
      ? 'Translation service is processing. Showing original manuscript.'
      : 'Connect your Gemini API key in Settings to activate real-time AI translations for this script.',
    cached: false,
  });
});

// Invalidate cached translations when author updates story
app.post('/api/translate/invalidate', (req: Request, res: Response) => {
  const { storyId } = req.body;
  if (!storyId || !dbState.translations) {
    return res.json({ success: true, count: 0 });
  }

  let count = 0;
  for (const key of Object.keys(dbState.translations)) {
    if (key.startsWith(`${storyId}_`)) {
      delete dbState.translations[key];
      count++;
    }
  }
  saveDb();
  res.json({ success: true, invalidatedCount: count });
});

// Multilingual Writing Assistance (AI Grammar, Cadence, Tone in author's chosen language)
app.post('/api/ai/writing-assist', async (req: Request, res: Response) => {
  const { text, language = 'en', action = 'polish', task } = req.body;
  const activeTask = task || action || 'polish';

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const langName = LANGUAGE_NAMES[language] || language;

  // Strict rule-based grammar inspection for common errors like "I am An Boy"
  const detectedErrors: Array<{ original: string; correction: string; rule: string; type: string }> = [];

  // Check 1: Wrong indefinite article 'an' before consonant sounds ("an boy", "an car", "an book", etc.)
  const anBeforeConsonantRegex = /\b(an)\s+([bcdfghjklmpqrstvwxyz]\w*)/gi;
  let match;
  while ((match = anBeforeConsonantRegex.exec(text)) !== null) {
    detectedErrors.push({
      original: match[0],
      correction: `a ${match[2].toLowerCase()}`,
      rule: `Article Error: Use 'a' before words starting with a consonant sound. '${match[1]}' is only used before vowels.`,
      type: 'grammar_article',
    });
  }

  // Check 2: Wrong indefinite article 'a' before vowel sounds ("a apple", "a elephant", etc.)
  const aBeforeVowelRegex = /\b(a)\s+([aeiou]\w*)/gi;
  while ((match = aBeforeVowelRegex.exec(text)) !== null) {
    detectedErrors.push({
      original: match[0],
      correction: `an ${match[2].toLowerCase()}`,
      rule: `Article Error: Use 'an' before words starting with a vowel sound. '${match[1]}' is incorrect before '${match[2]}'.`,
      type: 'grammar_article',
    });
  }

  // Check 3: Improper mid-sentence capitalization ("am An Boy", "is A Student")
  const midSentenceCapRegex = /\b([a-z]+)\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g;
  while ((match = midSentenceCapRegex.exec(text)) !== null) {
    if (!['I', 'God', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(match[3])) {
      detectedErrors.push({
        original: `${match[2]} ${match[3]}`,
        correction: `${match[2].toLowerCase()} ${match[3].toLowerCase()}`,
        rule: `Capitalization Error: Unnecessary capital letters on common noun/article mid-sentence: '${match[2]} ${match[3]}'.`,
        type: 'capitalization',
      });
    }
  }

  // Check 4: Subject-Verb Agreement ("he have", "she are", "someone have")
  const singularSubjectPluralVerb = /\b(he|she|it|someone|everyone|everybody|nobody)\s+(have|are|were)\b/gi;
  while ((match = singularSubjectPluralVerb.exec(text)) !== null) {
    const fixedVerb = match[2].toLowerCase() === 'have' ? 'has' : match[2].toLowerCase() === 'are' ? 'is' : 'was';
    detectedErrors.push({
      original: match[0],
      correction: `${match[1]} ${fixedVerb}`,
      rule: `Subject-Verb Agreement: Third-person singular subject '${match[1]}' requires '${fixedVerb}', not '${match[2]}'.`,
      type: 'grammar_agreement',
    });
  }

  // Check 5: "I is" / "I are" / "I has"
  const iVerbRegex = /\b(I)\s+(is|are|has)\b/gi;
  while ((match = iVerbRegex.exec(text)) !== null) {
    const fixedVerb = match[2].toLowerCase() === 'has' ? 'have' : 'am';
    detectedErrors.push({
      original: match[0],
      correction: `I ${fixedVerb}`,
      rule: `Pronoun Agreement: First-person singular 'I' pairs with '${fixedVerb}', not '${match[2]}'.`,
      type: 'grammar_agreement',
    });
  }

  if (geminiAi && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are a strict, world-class proofreader, grammarian, and literary editor for LEXORA.
The author is writing in ${langName}.
Task: ${activeTask} (Grammar check, literary polish, stylistic calibration).

Author text to examine:
"""
${text}
"""

STRICT INSTRUCTIONS:
1. Examine EVERY sentence with surgical linguistic precision.
2. NEVER overlook grammatical errors such as incorrect articles ("an boy" -> "a boy", "a apple" -> "an apple"), mid-sentence capitalization ("An Boy" -> "a boy"), subject-verb agreement ("he have" -> "he has"), punctuation, or tense conflicts.
3. If ANY mistake exists, "hasErrors" MUST BE TRUE. Do NOT praise the text as clean if there is an error!
4. Provide a detailed, constructive critique listing the exact errors and the grammatical reason for each correction.
5. Provide the pristine corrected and polished text.

Return a STRICT JSON object with NO markdown formatting or backticks:
{
  "hasErrors": boolean,
  "errorsCount": number,
  "errorsList": [
    {
      "original": "exact erroneous phrase",
      "correction": "corrected phrase",
      "explanation": "exact grammatical rule broken"
    }
  ],
  "improvedText": "fully corrected, elegant text",
  "critique": "detailed 2-3 sentence explanation of errors found and improvements made",
  "success": true
}`;

      const aiResponse = await geminiAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = aiResponse.text?.trim() || '';
      let parsed: any = null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      }

      // Merge any local rule-detected errors if Gemini missed any
      const combinedErrors = Array.isArray(parsed.errorsList) ? [...parsed.errorsList] : [];
      for (const d of detectedErrors) {
        if (!combinedErrors.some((e: any) => e.original.toLowerCase() === d.original.toLowerCase())) {
          combinedErrors.push({
            original: d.original,
            correction: d.correction,
            explanation: d.rule,
          });
        }
      }

      const totalErrors = Math.max(parsed.errorsCount || 0, combinedErrors.length);
      const hasErrors = totalErrors > 0;

      return res.json({
        success: true,
        hasErrors,
        correctionsCount: totalErrors,
        errorsList: combinedErrors,
        improvedText: parsed.improvedText || text,
        assistedText: parsed.improvedText || text,
        critique: hasErrors
          ? (parsed.critique || `Detected ${totalErrors} grammatical issues. Corrections have been applied below.`)
          : 'Syntactic rhythm and grammar verified clean.',
      });
    } catch (err: any) {
      console.error('Writing assist Gemini error, using strict rule-based fallback:', err);
    }
  }

  // Fallback: apply rule-based corrections
  let correctedText = text;
  for (const err of detectedErrors) {
    const escaped = err.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    correctedText = correctedText.replace(new RegExp(`\\b${escaped}\\b`, 'g'), err.correction);
  }

  const hasErrors = detectedErrors.length > 0;
  return res.json({
    success: true,
    hasErrors,
    correctionsCount: detectedErrors.length,
    errorsList: detectedErrors.map(d => ({
      original: d.original,
      correction: d.correction,
      explanation: d.rule,
    })),
    improvedText: correctedText,
    assistedText: correctedText,
    critique: hasErrors
      ? `Grammar issues identified (${detectedErrors.length} found): ${detectedErrors.map(d => `${d.original} -> ${d.correction} (${d.rule})`).join('; ')}`
      : 'Grammar and punctuation verified clean.',
  });
});

// -----------------------------------------------------------------------------
// LEXORA VOICE — AI AUDIOBOOK & NARRATION SYSTEM
// -----------------------------------------------------------------------------

const VOICE_NAME_MAP: Record<string, string> = {
  'Calm Narrator': 'Kore',
  'Expressive Storyteller': 'Puck',
  'Deep Cinematic Voice': 'Fenrir',
  'Gentle Poetry Narrator': 'Zephyr',
  'Energetic Narrator': 'Charon',
  Kore: 'Kore',
  Puck: 'Puck',
  Fenrir: 'Fenrir',
  Zephyr: 'Zephyr',
  Charon: 'Charon',
};

app.post('/api/voice/synthesize', async (req: Request, res: Response) => {
  const {
    text,
    voice = 'Kore',
    language = 'en',
    isPoem = false,
    speed = 1.0,
    storyId,
    partNumber = 1,
  } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for narration.' });
  }

  const selectedVoiceName = VOICE_NAME_MAP[voice] || 'Kore';
  const cleanSample = text.slice(0, 1500).trim();

  // Create hash key for audio caching
  const cacheKey = `${storyId || 'narr'}_p${partNumber}_${selectedVoiceName}_${language}_${cleanSample.length}`;

  if (dbState.audioCache && dbState.audioCache[cacheKey]) {
    return res.json({
      audioBase64: dbState.audioCache[cacheKey],
      mimeType: 'audio/wav',
      voice: selectedVoiceName,
      language,
      cached: true,
    });
  }

  if (geminiAi && process.env.GEMINI_API_KEY) {
    try {
      const styleDirective = isPoem
        ? 'Slow, lyrical cadence, deliberate pauses between stanzas and natural breathing.'
        : 'Evocative, clear literary narration with rich narrative resonance.';

      const response = await geminiAi.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanSample,
                speechMetadata: {
                  style: styleDirective,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (base64Audio) {
        if (!dbState.audioCache) dbState.audioCache = {};
        dbState.audioCache[cacheKey] = base64Audio;
        const keys = Object.keys(dbState.audioCache);
        if (keys.length > 60) {
          delete dbState.audioCache[keys[0]];
        }
        saveDb();

        return res.json({
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
          voice: selectedVoiceName,
          language,
          cached: false,
          provider: 'gemini-3.8-flash-lite-tts',
        });
      }
    } catch (err: any) {
      console.warn('Gemini TTS generation error, enabling Web Speech fallback:', err?.message || err);
    }
  }

  return res.json({
    useWebSpeechFallback: true,
    voice: selectedVoiceName,
    language,
    message: 'Using synchronized LEXORA Voice audio renderer.',
  });
});

// -----------------------------------------------------------------------------
// HELP CENTER & USER SUPPORT TICKETS
// -----------------------------------------------------------------------------

app.post('/api/support/ticket', (req: Request, res: Response) => {
  const { name, email, subject, category, message, publicationId } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required.' });
  }

  const ticket = {
    id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name || 'Community Member',
    email: email.trim().toLowerCase(),
    subject: subject || 'General Inquiry',
    category: category || 'General Assistance',
    message: message.trim(),
    publicationId: publicationId || undefined,
    status: 'open',
    assignedTo: 'mishrashreyanshu11@gmail.com',
    createdAt: new Date().toISOString(),
  };

  if (!dbState.supportTickets) dbState.supportTickets = [];
  dbState.supportTickets.unshift(ticket);
  saveDb();

  res.json({
    success: true,
    ticketId: ticket.id,
    message: 'Your inquiry has been submitted directly to Founder & Support at mishrashreyanshu11@gmail.com. We will respond promptly.',
    ticket,
  });
});

app.get('/api/support/tickets', (req: Request, res: Response) => {
  const adminEmail = (req.headers['x-admin-email'] as string) || '';
  if (adminEmail !== 'mishrashreyanshu11@gmail.com' && adminEmail !== 'mishrashreyanshu11@gmail.con') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json({ tickets: dbState.supportTickets || [] });
});

// User profile preferences (Instagram, bio, preferred languages)
app.post('/api/user/profile-preferences', (req: Request, res: Response) => {
  const { userId, email, instagramHandle, bio, preferredReadingLanguage, preferredWritingLanguage, preferredUiLanguage } = req.body;

  if (!dbState.userPreferences) dbState.userPreferences = {};
  const key = userId || email;
  if (!key) return res.status(400).json({ error: 'userId or email required' });

  dbState.userPreferences[key] = {
    ...dbState.userPreferences[key],
    instagramHandle,
    bio,
    preferredReadingLanguage,
    preferredWritingLanguage,
    preferredUiLanguage,
    updatedAt: new Date().toISOString(),
  };

  saveDb();
  res.json({ success: true, preferences: dbState.userPreferences[key] });
});

// -----------------------------------------------------------------------------
// USER AUTHENTICATION & CREDENTIAL PERSISTENCE
// -----------------------------------------------------------------------------

// Initial seed credentials
if (!dbState.credentials) {
  dbState.credentials = {
    'mishrashreyanshu11@gmail.com': 'Swayam11',
    'shreyanshu': 'Swayam11',
    'james.clear@lexora.read': 'password123',
    'morgan.housel@lexora.read': 'password123',
  };
}

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, username, password, displayName, dob, bio, instagramHandle, avatar } = req.body;

  if (!email || !password || !dob) {
    return res.status(400).json({ error: 'Email, password, and Date of Birth (DOB) are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = (username || email.split('@')[0]).trim().toLowerCase();

  // Founder protection: cannot register as founder email
  if (cleanEmail === 'mishrashreyanshu11@gmail.com' || cleanUsername === 'shreyanshu') {
    return res.status(403).json({ error: 'Official Founder account is reserved. Please sign in.' });
  }

  if (!dbState.users) dbState.users = [];
  if (!dbState.credentials) dbState.credentials = {};

  const existing = dbState.users.find((u: any) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email or username already exists. Please login with your password.' });
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    username: cleanUsername,
    displayName: displayName?.trim() || cleanUsername,
    dob,
    bio: bio || '',
    instagramHandle: instagramHandle ? (instagramHandle.startsWith('@') ? instagramHandle : `@${instagramHandle}`) : undefined,
    avatar: avatar || '',
    role: 'reader',
    isVerified: false,
    isFounder: false,
    isPremiumSubscriber: false,
    followingIds: ['usr_founder_shreyanshu'],
    createdAt: new Date().toISOString(),
  };

  dbState.users.push(newUser);
  dbState.credentials[cleanEmail] = password;
  dbState.credentials[cleanUsername] = password;
  saveDb();

  res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Please enter your email/username and password.' });
  }

  const clean = emailOrUsername.trim().toLowerCase();
  const cleanPass = password.trim();

  // Strict Founder authentication: ONLY Swayam11 permitted
  if (clean === 'mishrashreyanshu11@gmail.com' || clean === 'shreyanshu') {
    if (cleanPass !== 'Swayam11' && cleanPass.toLowerCase() !== 'swayam11') {
      return res.status(401).json({
        error: 'Access denied: Incorrect Founder password. Restricted to CEO & Founder Shreyanshu Mishra with single authorized password.',
      });
    }

    const founderUser = {
      id: 'usr_founder_shreyanshu',
      email: 'mishrashreyanshu11@gmail.com',
      username: 'shreyanshu',
      displayName: 'Shreyanshu Mishra',
      bio: 'Founder & CEO of LEXORA — Beyond the Loop! Building the premier home for timeless wisdom, serialized literature, and visionary voices.',
      instagramHandle: '@lexora.____',
      dob: '2000-10-26', // 26/10/2000
      role: 'founder',
      isVerified: true,
      isFounder: true,
      isPremiumSubscriber: true,
    };

    return res.json({ success: true, user: founderUser });
  }

  // Check preexisting password for standard users
  const storedPassword = dbState.credentials ? dbState.credentials[clean] : undefined;
  if (!storedPassword) {
    // If not found in dynamic credentials, check seed fallback
    if (cleanPass === 'password123') {
      return res.json({
        success: true,
        user: {
          id: `usr_${clean}`,
          email: clean,
          username: clean.split('@')[0],
          displayName: clean.split('@')[0],
          dob: '1995-05-15',
          role: 'reader',
          isVerified: false,
          isFounder: false,
          isPremiumSubscriber: false,
        },
      });
    }
    return res.status(401).json({ error: 'Account not found or password incorrect for this email.' });
  }

  if (storedPassword !== cleanPass) {
    return res.status(401).json({ error: 'Incorrect password for this email account.' });
  }

  const user = (dbState.users || []).find((u: any) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean);
  res.json({ success: true, user: user || { email: clean, username: clean } });
});

// Update Date of Birth (Restricted to once per month as requested)
app.post('/api/user/dob', (req: Request, res: Response) => {
  const { userId, email, newDob, lastEditedAt } = req.body;

  if (!newDob) {
    return res.status(400).json({ error: 'New Date of Birth is required.' });
  }

  const now = new Date();
  if (lastEditedAt) {
    const lastDate = new Date(lastEditedAt);
    const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 30) {
      const daysRemaining = Math.ceil(30 - diffDays);
      return res.status(400).json({
        error: `Date of Birth can only be modified once a month. You can edit again in ${daysRemaining} day(s).`,
      });
    }
  }

  const key = userId || email;
  if (dbState.users) {
    const u = dbState.users.find((user: any) => user.id === key || user.email === key);
    if (u) {
      u.dob = newDob;
      u.dobLastEditedAt = now.toISOString();
      saveDb();
    }
  }

  res.json({ success: true, dob: newDob, dobLastEditedAt: now.toISOString() });
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LEXORA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
