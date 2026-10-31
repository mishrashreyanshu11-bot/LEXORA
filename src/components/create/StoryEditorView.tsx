import React, { useState, useRef, useEffect } from 'react';
import { Story, StoryPart, LISTING_CATEGORIES } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../../data/languages';
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Sparkles,
  Trash2,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Upload,
  Crown,
  BookOpen,
  Wand2,
  Check,
  X,
  Lock,
  Compass,
  Layers,
  Clock,
  Type,
  Globe,
  Headphones,
  Volume2,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { LexoraSymbol } from '../common/LexoraSymbol';

interface StoryEditorViewProps {
  storyToEdit?: Story;
  onBack: () => void;
  onSaved: (story: Story) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
];

export const StoryEditorView: React.FC<StoryEditorViewProps> = ({
  storyToEdit,
  onBack,
  onSaved,
  onOpenAuth,
}) => {
  const {
    createStory,
    updateStory,
    getStoryParts,
    createPart,
    updatePart,
    deletePart,
    stories,
  } = useStories();

  const { currentUser } = useAuth();
  const { writingLanguage, setWritingLanguage } = useLanguage();

  // If user is not authenticated, show sign-in gate
  const [showAuthGate, setShowAuthGate] = useState(!currentUser);

  // Story Form State
  const [title, setTitle] = useState(storyToEdit?.title || '');
  const [synopsis, setSynopsis] = useState(storyToEdit?.synopsis || '');
  // Mandatory Cover Image:
  const [coverImage, setCoverImage] = useState<string>(storyToEdit?.coverImage || '');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [category, setCategory] = useState(storyToEdit?.category || LISTING_CATEGORIES[0].name);
  const [genre, setGenre] = useState(storyToEdit?.genre || 'Speculative');
  const [ageRating, setAgeRating] = useState<'10+' | '13+' | '16+' | '18+'>(storyToEdit?.ageRating || '10+');
  const [isGoldenLibrary, setIsGoldenLibrary] = useState<boolean>(storyToEdit?.isGoldenLibrary || false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>(
    (storyToEdit?.language as SupportedLanguageCode) || writingLanguage || 'en'
  );
  const [tagsInput, setTagsInput] = useState(storyToEdit?.tags?.join(', ') || 'Original, Beyond The Loop');
  const [completed, setCompleted] = useState(storyToEdit?.completed || false);
  const [isPoem, setIsPoem] = useState(storyToEdit?.isPoem || false);
  const [audiobookEnabled, setAudiobookEnabled] = useState(storyToEdit?.audiobookEnabled ?? true);
  const [audiobookVoice, setAudiobookVoice] = useState(storyToEdit?.audiobookVoice || 'Kore');

  // Writer Customization: Font Style and Size
  const [writerFontSize, setWriterFontSize] = useState<number>(18);
  const [writerFontStyle, setWriterFontStyle] = useState<'serif' | 'sans' | 'mono' | 'literary' | 'editorial'>('serif');

  // Cover Alignment & Visibility
  const [coverFit, setCoverFit] = useState<'contain' | 'cover'>(storyToEdit?.coverFit || 'contain');
  const [coverPosition, setCoverPosition] = useState<'center' | 'top' | 'bottom'>(storyToEdit?.coverPosition || 'center');
  const [isVerifyingAi, setIsVerifyingAi] = useState(false);
  const [aiDisqualificationModal, setAiDisqualificationModal] = useState<{ open: boolean; rate: number; reason: string } | null>(null);

  // Active Story & Parts
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(storyToEdit?.id || null);
  const parts = currentStoryId ? getStoryParts(currentStoryId) : [];

  // Active Part Selected for Editing
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [partTitle, setPartTitle] = useState('');
  const [partContent, setPartContent] = useState('');
  const [partStatus, setPartStatus] = useState<'draft' | 'published'>('published');

  // Preview Mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // AI Writing Assistant state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);
  const [aiResultText, setAiResultText] = useState('');
  const [aiErrorsDetected, setAiErrorsDetected] = useState<string[]>([]);
  const [aiTaskType, setAiTaskType] = useState<'polish' | 'grammar' | 'style' | 'rhyme'>('polish');

  // Elite writer check for emoji insertion
  const isEliteWriter = Boolean(currentUser?.isPremiumSubscriber || currentUser?.isFounder);

  const handleInsertEmoji = (emoji: string) => {
    if (!isEliteWriter) {
      showNotification('✦ Elite Feature: Literary emojis are exclusive to Elite Pass members & Subscribers.', 'error');
      return;
    }
    setPartContent(prev => prev + emoji);
    showNotification(`Inserted ${emoji}`);
  };

  // Sync when storyToEdit changes (e.g. Founder editing "Beyond the Loop")
  useEffect(() => {
    if (storyToEdit) {
      setCurrentStoryId(storyToEdit.id);
      setTitle(storyToEdit.title);
      setSynopsis(storyToEdit.synopsis);
      setCoverImage(storyToEdit.coverImage);
      if (storyToEdit.coverFit) setCoverFit(storyToEdit.coverFit);
      if (storyToEdit.coverPosition) setCoverPosition(storyToEdit.coverPosition);
      setCategory(storyToEdit.category);
      setGenre(storyToEdit.genre);
      setAgeRating(storyToEdit.ageRating || '10+');
      setIsGoldenLibrary(Boolean(storyToEdit.isGoldenLibrary));
      setTagsInput(storyToEdit.tags?.join(', ') || '');
      setCompleted(storyToEdit.completed);
      setIsPoem(Boolean(storyToEdit.isPoem));
      setSelectedLanguage((storyToEdit.language as SupportedLanguageCode) || 'en');
      const sParts = getStoryParts(storyToEdit.id);
      if (sParts.length > 0) {
        setSelectedPartId(sParts[0].id);
        setPartTitle(sParts[0].title);
        setPartContent(sParts[0].content);
        setPartStatus(sParts[0].status);
      }
    }
  }, [storyToEdit]);

  // Real auto-save state & debounced persistent draft saving
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!currentUser?.id || (!title.trim() && !partContent.trim())) return;
    setHasUnsavedChanges(true);
    setAutoSaveStatus('saving');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/stories/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-user-email': currentUser.email,
          },
          body: JSON.stringify({
            draftId: currentStoryId || undefined,
            title: title.trim(),
            synopsis: synopsis.trim(),
            content: partContent,
            coverImage,
            coverFit,
            coverPosition,
            language: selectedLanguage,
          }),
        });
        if (res.ok) {
          setAutoSaveStatus('saved');
          setHasUnsavedChanges(false);
        } else {
          setAutoSaveStatus('error');
        }
      } catch {
        setAutoSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, synopsis, partContent, coverImage, coverFit, coverPosition, selectedLanguage, currentUser?.id]);

  const handleSafeBack = () => {
    if (hasUnsavedChanges && partContent.trim().length > 30) {
      const confirmLeave = window.confirm('You have unsaved manuscript drafts. Are you sure you wish to exit to previous screen?');
      if (!confirmLeave) return;
    }
    onBack();
  };

  // Notifications & Validations
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Sync writing language preference when selected
  const handleLanguageChange = (lang: SupportedLanguageCode) => {
    setSelectedLanguage(lang);
    setWritingLanguage(lang);
    showNotification(`Writing Studio language switched to ${lang.toUpperCase()}`);
  };

  // Auto-detect poetry based on category or genre
  useEffect(() => {
    if (
      category.toLowerCase().includes('poet') ||
      genre.toLowerCase().includes('poet')
    ) {
      setIsPoem(true);
    }
  }, [category, genre]);

  // Select part
  const handleSelectPart = (part: StoryPart) => {
    setSelectedPartId(part.id);
    setPartTitle(part.title);
    setPartContent(part.content);
    setPartStatus(part.status);
  };

  // Handle local image file upload as cover
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setShowCoverModal(false);
          showNotification('Cover artwork uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Writing Assistant (Server-Side)
  const runAiAssist = async (task: 'polish' | 'grammar' | 'style' | 'rhyme') => {
    if (!partContent.trim()) {
      showNotification('Please write some content first before requesting AI feedback.', 'error');
      return;
    }

    setAiTaskType(task);
    setAiAssisting(true);
    setAiAssistantOpen(true);
    setAiResultText('');

    try {
      const res = await fetch('/api/ai/writing-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: partContent.trim(),
          language: selectedLanguage,
          task,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiResultText(data.assistedText || data.improvedText || '');
        const list = Array.isArray(data.errorsList) ? data.errorsList : Array.isArray(data.errorsDetected) ? data.errorsDetected : [];
        const formatted = list.map((e: any) =>
          typeof e === 'string' ? e : `"${e.original}" → "${e.correction}": ${e.explanation}`
        );
        setAiErrorsDetected(formatted);
      } else {
        setAiResultText('Could not complete literary assistance. Your manuscript is untouched.');
        setAiErrorsDetected([]);
      }
    } catch {
      setAiResultText('Network issue contacting literary assistance. Your manuscript remains safe.');
      setAiErrorsDetected([]);
    } finally {
      setAiAssisting(false);
    }
  };

  // Accept AI suggestion without overwriting unless author explicitly approves
  const handleAcceptAiSuggestion = () => {
    if (aiResultText) {
      setPartContent(aiResultText);
      setAiAssistantOpen(false);
      showNotification('AI suggestions incorporated into your draft.');
    }
  };

  // Save story metadata & publish with pre-publish AI verification
  const handlePublish = async () => {
    if (!currentUser) {
      setShowAuthGate(true);
      return;
    }

    if (!title.trim()) {
      showNotification('Please enter a title for your piece.', 'error');
      return;
    }

    // MANDATORY COVER VALIDATION
    if (!coverImage || coverImage.trim() === '') {
      showNotification('Cover page is strictly mandatory! Please upload or select cover artwork before publishing.', 'error');
      setShowCoverModal(true);
      return;
    }

    // PRE-PUBLISH AI VERIFICATION (Disqualify if AI Writing Rate exceeds 85%)
    setIsVerifyingAi(true);
    try {
      const sampleText = `${title}\n\n${synopsis}\n\n${partContent}`.trim();
      const res = await fetch('/api/stories/ai-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          synopsis: synopsis.trim(),
          sample: sampleText,
        }),
      });
      const assessData = await res.json();
      if (assessData && (assessData.isDisqualified || (typeof assessData.aiWritingRate === 'number' && assessData.aiWritingRate > 85))) {
        setIsVerifyingAi(false);
        setAiDisqualificationModal({
          open: true,
          rate: assessData.aiWritingRate || 89,
          reason: assessData.disqualificationReason || `⚠️ Disqualified: AI writing rate detected at ${assessData.aiWritingRate}%, exceeding the 85% platform limit. LEXORA requires genuine human creative voice.`,
        });
        return;
      }
    } catch (err) {
      console.warn('AI assessment check warning:', err);
    } finally {
      setIsVerifyingAi(false);
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    let savedStory: Story;

    if (currentStoryId) {
      updateStory(currentStoryId, {
        title: title.trim(),
        synopsis: synopsis.trim(),
        coverImage: coverImage.trim(),
        coverFit,
        coverPosition,
        category,
        genre,
        ageRating,
        isGoldenLibrary,
        language: selectedLanguage,
        originalLanguage: selectedLanguage,
        tags,
        completed,
        isPoem,
        audiobookEnabled,
        audiobookVoice,
      });

      if (selectedPartId) {
        updatePart(selectedPartId, {
          title: partTitle.trim() || 'Chapter 1',
          content: partContent.trim(),
          status: partStatus,
        });
      }

      savedStory = stories.find(s => s.id === currentStoryId) || {
        ...storyToEdit!,
        title,
        coverImage,
        coverFit,
        coverPosition,
        ageRating,
        isGoldenLibrary,
      };
      showNotification('Piece published and updated successfully!');
    } else {
      savedStory = createStory({
        title: title.trim(),
        synopsis: synopsis.trim() || 'A new serialized journey on LEXORA.',
        coverImage: coverImage.trim(),
        coverFit,
        coverPosition,
        category,
        genre,
        ageRating,
        isGoldenLibrary,
        language: selectedLanguage,
        tags,
        completed,
      });

      // Update the first chapter with whatever the user typed
      const initialParts = getStoryParts(savedStory.id);
      if (initialParts.length > 0) {
        updatePart(initialParts[0].id, {
          title: partTitle.trim() || 'Part I',
          content: partContent.trim() || 'The ink began to form...',
          status: 'published',
        });
      }

      showNotification('Your masterpiece has been published to LEXORA!');
    }

    onSaved(savedStory);
  };

  // Word count & read time calculations
  const wordCount = partContent.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // If not logged in, render the login required barrier
  if (showAuthGate || !currentUser) {
    return (
      <div className="min-h-screen bg-[#06070a] text-slate-100 flex items-center justify-center p-4">
        <div className="relative max-w-md w-full bg-black/90 rounded-3xl border border-amber-500/30 p-8 text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(243,186,56,0.2)]">
          <div className="flex flex-col items-center space-y-3">
            <LexoraSymbol size={64} glow={true} animated={true} />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>Author Sign-In Required</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Write on LEXORA
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Readers are free to explore stories without an account. However, creating new stories, uploading cover art, and publishing serials requires an authenticated writer profile.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth('login');
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs shadow-[0_0_15px_rgba(243,186,56,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>

            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth('register');
              }}
              className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/25 text-amber-200 text-xs font-medium transition-all cursor-pointer"
            >
              Create Free Writer Account
            </button>

            <button
              onClick={onBack}
              className="w-full text-slate-400 hover:text-white text-xs pt-2 cursor-pointer transition-colors"
            >
              ← Return to Reading Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-[#e5b95a]/30 selection:text-amber-100 pb-20">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs flex items-center gap-2 animate-fade-in ${
            notificationMsg.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
              : 'bg-black/95 text-amber-200 border-amber-500/50'
          }`}
        >
          {notificationMsg.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-[#090b10]/95 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Back & New Piece Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSafeBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Return to Previous Section"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide flex items-center gap-2">
              <span>{storyToEdit ? 'Edit Piece' : 'Writing Studio'}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                15 Languages
              </span>
            </h1>
            <p className="text-[10px] text-amber-400/80 font-mono hidden sm:block">
              Beyond the Loop · Multilingual Authoring
            </p>
          </div>
        </div>

        {/* Middle: 15-Language Selector for Author (Independent) & Dynamic Auto-Save Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 border border-amber-500/35">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedLanguage}
              onChange={e => handleLanguageChange(e.target.value as SupportedLanguageCode)}
              className="bg-transparent text-amber-200 text-xs font-serif font-semibold focus:outline-hidden cursor-pointer"
              title="Select your native writing language"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-sans">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <div
            className={`hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
              autoSaveStatus === 'saving'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : autoSaveStatus === 'saved'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {autoSaveStatus === 'saving' && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
            {autoSaveStatus === 'saved' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
            {autoSaveStatus === 'error' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
            <span>
              {autoSaveStatus === 'saving' ? 'Saving...' : autoSaveStatus === 'saved' ? 'Saved' : 'Save failed'}
            </span>
          </div>
        </div>

        {/* Right: Preview & Publish Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Reader Preview"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handlePublish}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(243,186,56,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Studio Grid: Center Canvas + Right Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CENTER WRITING CANVAS (COL 1 to 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* MANDATORY COVER ARTWORK CARD WITH LIVE ALIGNMENT PREVIEW */}
          <div className="relative p-5 rounded-3xl bg-black/80 border border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Cover Live Preview Box */}
              <div
                onClick={() => setShowCoverModal(true)}
                className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 bg-[#08090d] flex flex-col items-center justify-center cursor-pointer group shrink-0 hover:border-amber-400 transition-all shadow-md p-1"
                title="Click to change cover image"
              >
                {coverImage ? (
                  <>
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className={`w-full h-full rounded-xl ${coverFit === 'cover' ? 'object-cover' : 'object-contain'} ${
                        coverPosition === 'top' ? 'object-top' : coverPosition === 'bottom' ? 'object-bottom' : 'object-center'
                      } group-hover:scale-102 transition-transform duration-300`}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-200 text-xs font-semibold rounded-2xl">
                      Change Artwork
                    </div>
                  </>
                ) : (
                  <div className="p-3 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-amber-300/90 font-medium block">
                      Upload Cover
                    </span>
                    <span className="text-[9px] text-rose-400 font-bold block">
                      *Strictly Required
                    </span>
                  </div>
                )}
              </div>

              {/* Cover Description & Alignment Controls */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Mandatory Cover · Live Alignment Control</span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  Cover Artwork &amp; Framing Preview
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Ensure all titles, author typography, and poster details are 100% visible before publishing. Adjust frame fit and vertical focus below:
                </p>

                {/* Framing & Position Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {/* Fit Mode */}
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400/90 font-bold block">
                      Poster Fit:
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCoverFit('contain')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          coverFit === 'contain'
                            ? 'bg-amber-400 text-black shadow-xs'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Contain (100% Full)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverFit('cover')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          coverFit === 'cover'
                            ? 'bg-amber-400 text-black shadow-xs'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cover (Fill)
                      </button>
                    </div>
                  </div>

                  {/* Alignment Position */}
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400/90 font-bold block">
                      Vertical Position:
                    </span>
                    <div className="flex gap-1">
                      {(['top', 'center', 'bottom'] as const).map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setCoverPosition(pos)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            coverPosition === pos
                              ? 'bg-amber-400 text-black shadow-xs'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  <button
                    onClick={() => setShowCoverModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-serif font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{coverImage ? 'Replace Cover Image' : 'Upload Cover Page'}</span>
                  </button>

                  {coverImage && (
                    <button
                      onClick={() => setCoverImage('')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Synopsis Inputs */}
          <div className="space-y-4 p-5 rounded-3xl bg-black/70 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-bold">
                Work Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-amber-500/25 text-white font-serif text-lg sm:text-xl font-bold focus:outline-hidden focus:border-amber-400 placeholder-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-bold">
                Synopsis / Prologue:
              </label>
              <textarea
                rows={2}
                value={synopsis}
                onChange={e => setSynopsis(e.target.value)}
                placeholder="A brief overview or philosophical hook for readers..."
                className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs focus:outline-hidden focus:border-amber-400 placeholder-slate-600 resize-none"
              />
            </div>

            {/* Category & Genre & Age Rating & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-amber-500/30 text-amber-200 text-xs focus:outline-hidden"
                >
                  {LISTING_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  placeholder="e.g. Philosophical, Poetry, Essay"
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Age Certification Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-300 font-bold">Age Certification</label>
                <select
                  value={ageRating}
                  onChange={e => setAgeRating(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold focus:outline-hidden"
                >
                  <option value="10+" className="bg-slate-900 text-white">10+ (General Audiences)</option>
                  <option value="13+" className="bg-slate-900 text-white">13+ (Teen Readers)</option>
                  <option value="16+" className="bg-slate-900 text-white">16+ (Mature Themes)</option>
                  <option value="18+" className="bg-slate-900 text-white">18+ (Explicit / Dark Themes)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Publication Flags</label>
                <div className="space-y-1 pt-0.5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPoem}
                      onChange={e => setIsPoem(e.target.checked)}
                      className="accent-amber-400 rounded"
                    />
                    <span>Poetry (Preserved Voice)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGoldenLibrary}
                      onChange={e => setIsGoldenLibrary(e.target.checked)}
                      className="accent-amber-400 rounded"
                    />
                    <span>✦ Golden Library</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter / Part Writing Canvas */}
          <div className="p-5 rounded-3xl bg-black/70 border border-white/10 space-y-4">
            {/* Responsive Chapter Header: Two rows on mobile, balanced on desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={partTitle}
                  onChange={e => setPartTitle(e.target.value)}
                  placeholder="Chapter Title (e.g. Part 1 — The Awakening)"
                  className="w-full bg-transparent text-white font-serif font-bold text-sm sm:text-base focus:outline-hidden border-b border-dashed border-white/20 pb-0.5"
                />
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 shrink-0 self-end sm:self-auto">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                  {wordCount} words
                </span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300">
                  ~{readMinutes} min read
                </span>
              </div>
            </div>

            {/* Writer Typography Toolbar: Responsive flex-wrap */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-1 font-bold">Style:</span>
                {(['serif', 'sans', 'mono', 'literary', 'editorial'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setWriterFontStyle(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      writerFontStyle === f ? 'bg-amber-400 text-black shadow-xs' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Size: {writerFontSize}px</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWriterFontSize(prev => Math.max(14, prev - 2))}
                    className="w-7 h-6 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold cursor-pointer flex items-center justify-center"
                    title="Decrease font size"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setWriterFontSize(prev => Math.min(28, prev + 2))}
                    className="w-7 h-6 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold cursor-pointer flex items-center justify-center"
                    title="Increase font size"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Elite Literary Emoji Bar: Wrapped with safe container bounds */}
            <div className="p-3 rounded-2xl bg-black/80 border border-amber-500/30 text-xs shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-300 font-bold uppercase flex items-center gap-1.5 shrink-0">
                  <Crown className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>Elite Literary Emojis:</span>
                </span>
                {!isEliteWriter && (
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    (Elite Pass Exclusive)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto pr-1">
                {['✨', '🌟', '🖋️', '📜', '📖', '🎭', '🌙', '🕯️', '⏳', '🗝️', '🕊️', '🪐', '💫', '💎', '⚜️', '👑', '🖤', '🌹', '🔮', '🌊'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="p-1 rounded-lg hover:bg-amber-400/20 text-base transition-transform hover:scale-125 cursor-pointer"
                    title={isEliteWriter ? `Insert ${emoji}` : 'Elite Pass Exclusive'}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Manuscript Textarea with writer font styling */}
            <textarea
              rows={16}
              value={partContent}
              onChange={e => setPartContent(e.target.value)}
              placeholder="Begin pouring your words into the page. Formats, line breaks, stanzas, and native scripts are preserved with strict fidelity..."
              className={`w-full p-4 rounded-2xl bg-black/40 border border-white/5 text-slate-100 leading-relaxed focus:outline-hidden focus:border-amber-400/60 placeholder-slate-600 resize-y ${
                writerFontStyle === 'serif'
                  ? 'font-serif'
                  : writerFontStyle === 'sans'
                  ? 'font-sans'
                  : writerFontStyle === 'mono'
                  ? 'font-mono'
                  : writerFontStyle === 'literary'
                  ? 'font-serif tracking-wide leading-loose text-amber-50/95'
                  : 'font-serif italic tracking-wide text-amber-50/95'
              }`}
              style={{ minHeight: '340px', fontSize: `${writerFontSize}px` }}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR (COL 9 to 12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Literary Companion Card */}
          <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>AI Literary Companion</span>
              </h4>
              <span className="text-[10px] font-mono text-amber-400/90 font-bold uppercase">
                {selectedLanguage}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Enhance vocabulary, check grammar, or tune rhythm without altering your sovereign voice.
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => runAiAssist('polish')}
                className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-amber-200 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Literary Polish &amp; Cadence</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">Run</span>
              </button>

              <button
                onClick={() => runAiAssist('grammar')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Grammar &amp; Punctuation</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Check</span>
              </button>

              <button
                onClick={() => runAiAssist('style')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tone &amp; Style Enhancement</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Calibrate</span>
              </button>
            </div>
          </div>

          {/* LEXORA Voice Author Studio */}
          <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#ffd700]" />
                <span>LEXORA Voice Studio</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Enabled</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enable AI Audiobooks for your readers. Choose your manuscript's cinematic narration voice.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Default Narrator Voice:
                </label>
                <select
                  value={audiobookVoice}
                  onChange={e => setAudiobookVoice(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black border border-amber-500/30 text-amber-200 text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="Kore" className="bg-slate-900 text-white">Kore — Calm &amp; Elegant Narrator</option>
                  <option value="Puck" className="bg-slate-900 text-white">Puck — Expressive Storyteller</option>
                  <option value="Fenrir" className="bg-slate-900 text-white">Fenrir — Deep &amp; Cinematic</option>
                  <option value="Zephyr" className="bg-slate-900 text-white">Zephyr — Gentle Poetry Cadence</option>
                  <option value="Charon" className="bg-slate-900 text-white">Charon — Classical &amp; Gravitas</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAudiobook"
                  checked={audiobookEnabled}
                  onChange={e => setAudiobookEnabled(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <label htmlFor="enableAudiobook" className="text-xs text-slate-300 cursor-pointer">
                  Generate Synchronized Audio Narration
                </label>
              </div>
            </div>
          </div>

          {/* Elite Author Privileges Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-black to-black border border-amber-500/40 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300">
              <Crown className="w-4 h-4 text-[#ffd700]" />
              <h4 className="font-serif font-bold text-sm text-white">Elite Writer Privileges</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <p>Digital Elite Card &amp; black and gold combo verification tick.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <p>Multi-language publication in 15 global languages.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <p>Full copyright ownership &amp; encrypted manuscript backup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT RESULT DIALOG (NEVER OVERWRITES UNLESS CONFIRMED) */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#090b10] rounded-3xl border border-amber-500/40 shadow-2xl p-6 space-y-4 text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffd700]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Literary Companion Suggestions ({aiTaskType.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Detected Grammar Violations Banner */}
            {aiErrorsDetected.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Grammar Violations Identified ({aiErrorsDetected.length}):</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs text-rose-200 font-mono">
                  {aiErrorsDetected.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-slate-200 font-serif leading-relaxed whitespace-pre-wrap">
              {aiAssisting ? (
                <div className="flex items-center justify-center py-12 gap-3 text-amber-300 font-sans">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Refining in {selectedLanguage.toUpperCase()}...</span>
                </div>
              ) : (
                aiResultText || 'No suggestions returned.'
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <p className="text-[11px] text-slate-400">
                Your original draft is never overwritten unless you click "Apply to Draft".
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiResultText);
                    showNotification('Copied to clipboard!');
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={handleAcceptAiSuggestion}
                  disabled={aiAssisting || !aiResultText}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black font-serif font-bold cursor-pointer hover:scale-105 transition-all shadow-md disabled:opacity-50"
                >
                  Apply to Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY COVER SELECTION MODAL */}
      {showCoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#090b10] rounded-3xl border border-amber-500/40 shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#ffd700]" />
                  <span>Choose Cover Artwork</span>
                </h3>
                <p className="text-xs text-amber-400/80 font-mono">
                  Mandatory cover image for every publication
                </p>
              </div>
              <button
                onClick={() => setShowCoverModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option 1: Upload from Device */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-slate-200 block">
                1. Upload from Device (Photo / Artwork)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-dashed border-amber-500/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Browse &amp; Upload Cover Image</span>
              </button>
            </div>

            {/* Option 2: Enter Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-slate-200 block">
                2. Or Enter Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customCoverUrl}
                  onChange={e => setCustomCoverUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black border border-amber-500/30 text-white text-xs focus:outline-hidden focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (customCoverUrl.trim()) {
                      setCoverImage(customCoverUrl.trim());
                      setShowCoverModal(false);
                      showNotification('Custom cover URL set!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f3ba38] text-black font-serif font-bold text-xs cursor-pointer hover:scale-105 transition-all shadow-md"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Option 3: Curated Presets */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-slate-200 block">
                3. Or Select from Curated Gold Presets
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_COVERS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCoverImage(preset);
                      setShowCoverModal(false);
                      showNotification('Curated cover artwork selected!');
                    }}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-102 ${
                      coverImage === preset ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 hover:border-amber-400/60'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRE-PUBLISH AI DISQUALIFICATION MODAL (RATE > 85%) */}
      {aiDisqualificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0a0a] rounded-3xl border-2 border-rose-500/70 p-6 sm:p-8 space-y-5 text-slate-100 shadow-[0_20px_60px_rgba(255,0,0,0.35)]">
            <div className="flex items-center gap-3 border-b border-rose-500/30 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-rose-200">
                  Publication Disqualified
                </h3>
                <p className="text-xs text-rose-400 font-mono font-bold">
                  AI Writing Rate: {aiDisqualificationModal.rate}% (Platform Threshold: 85%)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {aiDisqualificationModal.reason}
            </p>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-rose-500/30 text-xs text-rose-200 space-y-1">
              <span className="font-bold block text-rose-300">LEXORA Human Expression Integrity:</span>
              <p className="text-[11px] text-slate-400">
                To protect authentic human literary craft across LEXORA, any submission with synthetic or algorithmic phrasing exceeding 85% is blocked from publication. Please enrich your manuscript with your authentic human voice, sensory descriptions, and personal introspection.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setAiDisqualificationModal(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-700 text-white font-serif font-bold text-xs hover:brightness-110 cursor-pointer shadow-md"
              >
                Return &amp; Revise Manuscript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
