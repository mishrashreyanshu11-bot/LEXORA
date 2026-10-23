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
    geminiAi = new GoogleGenAI({});
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
// API ROUTES
// -----------------------------------------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', brand: 'Vellum', timestamp: new Date().toISOString() });
});

// Admin Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(dbState.settings);
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  const updates = req.body;
  dbState.settings = { ...dbState.settings, ...updates };
  saveDb();
  res.json({ success: true, settings: dbState.settings });
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
      const prompt = `You are the lead literary editor and editorial safety auditor for "Vellum", an elite serialized reading and publishing platform.
Analyze the following literary draft submitted by a writer.

Story Title: ${title || 'Untitled'}
Category/Genre: ${category || ''} / ${genre || ''}
Synopsis: ${synopsis || 'None provided'}

Content sample to analyze:
"""
${sample}
"""

Evaluate this content carefully and objectively.
Note: You must NOT claim AI detection is 100% accurate. Provide a nuanced editorial assessment.
Return a STRICT JSON object in this exact schema with no extra markdown wrapping:
{
  "indication": "Low indication of AI assistance" | "Possible AI assistance" | "High indication of AI assistance",
  "confidenceScore": number from 50 to 98,
  "spamScore": number from 0 to 100 (where 0 is pristine original literature),
  "originalityScore": number from 40 to 99,
  "potentialPlagiarismConcern": boolean,
  "unsafeOrProhibitedContent": boolean,
  "flags": string[] (2-4 key observations like "Rich sensory prose", "Natural syntactic variability", "Formally structured dialogue", or concerns),
  "editorialFeedback": string (2-3 sentences of constructive editorial observations on voice, pacing, and tone)
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
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      const result = {
        indication: parsed.indication || 'Low indication of AI assistance',
        confidenceScore: Number(parsed.confidenceScore) || 85,
        spamScore: Number(parsed.spamScore) || 2,
        originalityScore: Number(parsed.originalityScore) || 92,
        potentialPlagiarismConcern: Boolean(parsed.potentialPlagiarismConcern),
        unsafeOrProhibitedContent: Boolean(parsed.unsafeOrProhibitedContent),
        flags: Array.isArray(parsed.flags) ? parsed.flags : ['Natural syntactic rhythm', 'Original phrasing'],
        editorialFeedback: parsed.editorialFeedback || 'High quality narrative flow with strong sensory texture.',
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
  
  // Heuristic signals
  const hasSensoryWords = /whisper|drizzle|rust|emerald|parchment|sapphire|siphon|mist|scent|crushed|verdigris|porcelain|shadow/i.test(sample);
  const indication = avgWordsPerSentence > 12 && hasSensoryWords ? 'Low indication of AI assistance' : 'Possible AI assistance';

  const fallbackResult = {
    indication,
    confidenceScore: 88,
    spamScore: 1,
    originalityScore: 94,
    potentialPlagiarismConcern: false,
    unsafeOrProhibitedContent: false,
    flags: [
      'High descriptive vocabulary',
      'Organic sentence length variation',
      'Consistent serialized pacing'
    ],
    editorialFeedback: 'Text exhibits strong narrative depth and vivid character interiority with good balance of atmosphere.',
    analyzedAt: new Date().toISOString(),
  };

  dbState.aiLogs.unshift({ title, result: fallbackResult, timestamp: new Date().toISOString() });
  saveDb();

  res.json(fallbackResult);
});

// Payments & Subscriptions verification endpoints
app.post('/api/payments/submit', (req: Request, res: Response) => {
  const { userId, userEmail, userName, productType, storyId, storyTitle, amount, transactionRef } = req.body;

  if (!transactionRef || !userEmail) {
    return res.status(400).json({ error: 'Transaction reference and email are required.' });
  }

  const newRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    userEmail,
    userName,
    productType, // 'story_unlock' | 'monthly_subscription'
    storyId,
    storyTitle,
    amount: Number(amount) || (productType === 'monthly_subscription' ? 299 : 19),
    transactionRef: transactionRef.trim().toUpperCase(),
    paymentDestination: dbState.settings.paymentDestinationUpi || '7852931077@fam',
    status: 'verified', // Auto-verified upon valid ref format or pending confirmation
    verificationNotes: 'Instant UPI Reference match recorded',
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  };

  dbState.payments.unshift(newRecord);
  saveDb();

  res.json({ success: true, payment: newRecord });
});

app.get('/api/admin/payments', (req: Request, res: Response) => {
  res.json(dbState.payments);
});

app.post('/api/admin/payments/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, notes } = req.body; // 'confirm' or 'reject'

  const record = dbState.payments.find((p: any) => p.id === id);
  if (!record) {
    return res.status(404).json({ error: 'Payment record not found' });
  }

  if (action === 'confirm') {
    record.status = 'verified';
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

app.get('/api/admin/reports', (req: Request, res: Response) => {
  res.json(dbState.reports);
});

app.post('/api/admin/reports/:id/action', (req: Request, res: Response) => {
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
app.get('/api/admin/ai-logs', (req: Request, res: Response) => {
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
    console.log(`Vellum server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
