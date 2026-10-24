import React, { useState } from 'react';
import { Story, StoryPart, AIAssessmentResult, LISTING_CATEGORIES } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Sparkles,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  X,
  Bot,
  Brain,
  Feather,
  Wand2,
  Music,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface StoryEditorViewProps {
  storyToEdit?: Story;
  onBack: () => void;
  onSaved: (story: Story) => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
];

export const StoryEditorView: React.FC<StoryEditorViewProps> = ({
  storyToEdit,
  onBack,
  onSaved,
}) => {
  const {
    createStory,
    updateStory,
    getStoryParts,
    createPart,
    updatePart,
    deletePart,
    reorderParts,
    assessStoryContent,
    applyCorrectionToPart,
  } = useStories();

  const { currentUser } = useAuth();

  // Story Form State
  const [title, setTitle] = useState(storyToEdit?.title || '');
  const [synopsis, setSynopsis] = useState(storyToEdit?.synopsis || '');
  const [coverImage, setCoverImage] = useState(storyToEdit?.coverImage || PRESET_COVERS[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [category, setCategory] = useState(storyToEdit?.category || LISTING_CATEGORIES[0].name);
  const [contentType, setContentType] = useState<'Article' | 'Story' | 'Poem'>('Story');
  const [genre, setGenre] = useState(storyToEdit?.genre || 'Speculative');
  const [language, setLanguage] = useState(storyToEdit?.language || 'English');
  const [tagsInput, setTagsInput] = useState(storyToEdit?.tags.join(', ') || 'Original, Insight');
  const [completed, setCompleted] = useState(storyToEdit?.completed || false);

  // Active Story & Parts
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(storyToEdit?.id || null);
  const parts = currentStoryId ? getStoryParts(currentStoryId) : [];

  // Active Part Selected for Editing
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [partTitle, setPartTitle] = useState('');
  const [partContent, setPartContent] = useState('');
  const [partStatus, setPartStatus] = useState<'draft' | 'published'>('published');

  // AI Assessment State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAssessmentResult | null>(null);

  // Advanced Writing Studio States (Feature 2 & 1)
  const [distractionFree, setDistractionFree] = useState(false);
  const [rhymeModalOpen, setRhymeModalOpen] = useState(false);
  const [rhymeQuery, setRhymeQuery] = useState('');
  const [rhymeResults, setRhymeResults] = useState<string[]>([]);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Select part to edit in the right editor pane
  const handleSelectPart = (part: StoryPart) => {
    setSelectedPartId(part.id);
    setPartTitle(part.title);
    setPartContent(part.content);
    setPartStatus(part.status);
  };

  // Save story metadata
  const handleSaveStoryMeta = () => {
    if (!title.trim()) {
      showNotification('Story title is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (currentStoryId) {
      updateStory(currentStoryId, {
        title: title.trim(),
        synopsis: synopsis.trim(),
        coverImage,
        category,
        genre,
        language,
        tags,
        completed,
      });
      showNotification('Story metadata updated successfully!');
    } else {
      const newStory = createStory({
        title: title.trim(),
        synopsis: synopsis.trim(),
        coverImage,
        category,
        genre,
        language,
        tags,
        completed,
      });
      setCurrentStoryId(newStory.id);
      const newParts = getStoryParts(newStory.id);
      if (newParts.length > 0) {
        handleSelectPart(newParts[0]);
      }
      showNotification('Story created! You can now add serialized parts.');
    }
  };

  // Add new part to the serial
  const handleAddNewPart = () => {
    if (!currentStoryId) {
      handleSaveStoryMeta();
      return;
    }
    const newPartNum = parts.length + 1;
    const newPart = createPart(
      currentStoryId,
      `Part ${newPartNum} — Untitled`,
      'Begin writing your new chapter here...'
    );
    handleSelectPart(newPart);
    showNotification(`Part ${newPartNum} created!`);
  };

  // Save active part changes
  const handleSaveActivePart = () => {
    if (!selectedPartId) return;
    updatePart(selectedPartId, {
      title: partTitle.trim() || 'Untitled Part',
      content: partContent,
      status: partStatus,
    });
    showNotification('Chapter saved successfully!');
  };

  // Reordering parts
  const handleMovePart = (index: number, direction: 'up' | 'down') => {
    if (!currentStoryId) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parts.length) return;

    const newOrder = [...parts];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    reorderParts(currentStoryId, newOrder.map(p => p.id));
  };

  // Trigger Gemini AI Content Assessment
  const handleRunAiAssessment = async () => {
    const textToAssess = partContent.trim() || synopsis;
    if (!textToAssess) {
      showNotification('Please write some content to analyze with AI.');
      return;
    }

    setIsAssessing(true);
    setAiModalOpen(true);
    try {
      const result = await assessStoryContent(
        partTitle || title || 'Untitled',
        textToAssess,
        category,
        genre
      );
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Studio</span>
        </button>

        <div className="flex items-center gap-2">
          {notificationMsg && (
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 animate-fade-in">
              {notificationMsg}
            </span>
          )}

          <button
            onClick={handleRunAiAssessment}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-[#26F7F7] text-teal-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="AI Content & Safety Assessment"
          >
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Assessment</span>
          </button>

          <button
            onClick={handleSaveStoryMeta}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#26F7F7]" />
            <span>Save Story</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Story Details & Serial Parts Manager (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Story Metadata Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Story Overview</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Story Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Last Train to Darjeeling"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Synopsis / Description</label>
              <textarea
                rows={3}
                value={synopsis}
                onChange={e => setSynopsis(e.target.value)}
                placeholder="A compelling summary for prospective readers..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
              />
            </div>

            {/* Cover Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Cover Artwork</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PRESET_COVERS.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Preset"
                    onClick={() => setCoverImage(img)}
                    className={`w-14 h-20 object-cover rounded-xl shrink-0 cursor-pointer transition-all ${
                      coverImage === img ? 'ring-2 ring-[#26F7F7] scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Or paste custom image URL..."
                value={customCoverUrl}
                onChange={e => {
                  setCustomCoverUrl(e.target.value);
                  if (e.target.value.startsWith('http')) setCoverImage(e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            {/* Listing Type: Article, Story, or Poem */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Listing Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Article', 'Story', 'Poem'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setContentType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      contentType === type
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{type === 'Article' ? '📄' : type === 'Story' ? '📖' : '✍️'}</span>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Official Categories matching IMG_6032_e62ea990.jpeg */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  CATEGORIES
                </span>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                  <span>Selected:</span>
                  <span>{category}</span>
                </span>
              </div>

              {/* Scrollable / wrap grid of categories */}
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-inner">
                {LISTING_CATEGORIES.map(cat => {
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs scale-105'
                          : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm select-none">{cat.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-genre & Language */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Sub-genre / Topic</label>
                <input
                  type="text"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  placeholder="e.g. Behavioral, Speculative"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  placeholder="e.g. English, Hindi"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Cyberpunk, Mystery, Bengaluru"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="completedCheckbox"
                checked={completed}
                onChange={e => setCompleted(e.target.checked)}
                className="rounded accent-teal-600"
              />
              <label htmlFor="completedCheckbox" className="text-xs font-semibold text-slate-700">
                Mark serial as Completed
              </label>
            </div>
          </div>

          {/* Serial Parts / Chapters Manager */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Serialized Parts</h3>
                <p className="text-xs text-slate-500">{parts.length} parts in this story</p>
              </div>
              <button
                onClick={handleAddNewPart}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#26F7F7]" />
                <span>Add Part</span>
              </button>
            </div>

            <div className="space-y-2">
              {parts.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPart(p)}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    selectedPartId === p.id
                      ? 'border-[#26F7F7] bg-teal-50/50 shadow-xs ring-1 ring-[#26F7F7]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{p.partNumber}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-xs text-slate-900 truncate">{p.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {p.wordCount} words • {p.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleMovePart(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-500"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePart(idx, 'down')}
                      disabled={idx === parts.length - 1}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-500"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePart(p.id)}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                      title="Delete Part"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Part Content Editor (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPartId ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Editing Chapter</h3>
                  <p className="text-xs text-slate-500">
                    Word Count: {partContent.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={partStatus}
                    onChange={e => setPartStatus(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Unpublished)</option>
                  </select>

                  <button
                    onClick={handleSaveActivePart}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#26F7F7]" />
                    <span>Save Part</span>
                  </button>
                </div>
              </div>

              {/* Part Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Part / Chapter Title</label>
                <input
                  type="text"
                  value={partTitle}
                  onChange={e => setPartTitle(e.target.value)}
                  placeholder="e.g. Part 1 — The Empty Platform"
                  className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26f7db]"
                />
              </div>

              {/* AI Writing Companion & Studio Toolbar */}
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                    AI Studio
                  </span>

                  <button
                    type="button"
                    onClick={handleRunAiAssessment}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-[#26f7db] border border-teal-400/30 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Audit AI rate (85% rule) and generate Preserve My Voice suggestions"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#26f7db]" />
                    <span>AI Integrity &amp; Voice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const words = partContent.split(/\s+/).filter(Boolean);
                      const lastWord = words[words.length - 1] || 'light';
                      setRhymeQuery(lastWord.replace(/[^a-zA-Z]/g, ''));
                      setRhymeResults(['bright', 'night', 'flight', 'sight', 'ignite', 'zenith height', 'sublime']);
                      setRhymeModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5 text-purple-300" />
                    <span>Rhyme Finder</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Export chapter to PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Export PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDistractionFree(!distractionFree)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title={distractionFree ? 'Exit Distraction-Free' : 'Distraction-Free Mode'}
                  >
                    {distractionFree ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Part Content Area */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Chapter Content</label>
                <textarea
                  rows={distractionFree ? 30 : 20}
                  value={partContent}
                  onChange={e => setPartContent(e.target.value)}
                  placeholder="Compose your serialized story here. Use double line breaks between paragraphs for natural editorial spacing..."
                  className="w-full p-4 font-serif text-base text-slate-800 leading-relaxed rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26f7db] bg-white resize-y"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">Select or create a chapter to begin writing</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a part from the left column or tap "Add Part" to write serialized installments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rhyme Finder Modal */}
      {rhymeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-purple-200 animate-fade-in">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-950">AI Rhyme &amp; Meter Finder</h3>
              </div>
              <button onClick={() => setRhymeModalOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Query Word:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rhymeQuery}
                  onChange={e => setRhymeQuery(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const w = rhymeQuery.toLowerCase();
                    const common: Record<string, string[]> = {
                      light: ['bright', 'night', 'flight', 'sight', 'ignite', 'zenith height'],
                      voice: ['choice', 'rejoice', 'poise'],
                      heart: ['part', 'start', 'art', 'depart'],
                      ink: ['think', 'blink', 'link', 'brink', 'distinct link'],
                      soul: ['whole', 'scroll', 'console', 'unfold'],
                    };
                    setRhymeResults(common[w] || [`echoing ${w}`, `deep ${w}`, `silent ${w}`, `un${w}`]);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Find
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Rhymes &amp; Assonances:</span>
              <div className="flex flex-wrap gap-1.5">
                {rhymeResults.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPartContent(prev => prev + ' ' + r);
                      setRhymeModalOpen(false);
                      showNotification(`Inserted "${r}" into chapter.`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold cursor-pointer"
                  >
                    + {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assessment & Integrity Guard Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-slate-900 border border-slate-100 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 border border-[#26f7db]">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Integrity Team &amp; Editorial Scanner</h3>
                  <p className="text-[11px] text-slate-500">Autonomous 85% rule audit &amp; Preserve My Voice</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAssessing ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Scanning for synthetic transitions, perplexity burstiness, and calculating AI rate...
                </p>
              </div>
            ) : aiResult ? (
              <div className="space-y-4 text-xs">
                {/* 85% Disqualification Warning Alert */}
                {aiResult.isDisqualified ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="font-extrabold text-sm text-rose-900 uppercase tracking-wide">
                        ⚠️ DISQUALIFIED: Exceeds 85% AI Rate
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-rose-800">
                      {aiResult.disqualificationReason || `Detected AI writing rate is ${aiResult.aiWritingRate}%, exceeding the 85% platform limit. LEXORA requires authentic human creative originality.`}
                    </p>
                    <p className="text-[11px] text-rose-700 font-semibold pt-1">
                      Action Required: Apply the "Preserve My Voice" corrections below to restore human sensory texture and bring your rate below 85%.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-teal-950 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        <span>Passed AI Integrity Check ({aiResult.aiWritingRate}% AI Rate)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-teal-800 font-bold border border-teal-200">
                        Human Authenticity
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Well below the 85% disqualification threshold. Eligible for official curation and Quarterly Arena.
                    </p>
                  </div>
                )}

                {/* Scorecards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">AI Rate</span>
                    <p className={`text-xl font-bold font-mono ${aiResult.isDisqualified ? 'text-rose-600' : 'text-teal-700'}`}>
                      {aiResult.aiWritingRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Originality</span>
                    <p className="text-xl font-bold font-mono text-slate-900">{aiResult.originalityScore}/100</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Spam Index</span>
                    <p className="text-xl font-bold font-mono text-emerald-600">{aiResult.spamScore}%</p>
                  </div>
                </div>

                {/* AI Team 1-Click Correction Suggestions */}
                {aiResult.aiCorrections && aiResult.aiCorrections.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-teal-600" />
                      <span>Preserve My Voice — Suggested Corrections:</span>
                    </span>

                    <div className="space-y-2.5">
                      {aiResult.aiCorrections.map(corr => (
                        <div key={corr.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="text-[11px] text-slate-600">
                            <span className="font-bold text-rose-800 line-through block mb-0.5">
                              "{corr.originalText}"
                            </span>
                            <span className="font-serif italic font-bold text-teal-900 block">
                              "{corr.correctedText}"
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{corr.explanation}</p>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedPartId) {
                                const newContent = partContent.replace(corr.originalText, corr.correctedText);
                                setPartContent(newContent);
                                applyCorrectionToPart(selectedPartId, corr.originalText, corr.correctedText);
                                setAiResult({
                                  ...aiResult,
                                  aiWritingRate: Math.max(4, aiResult.aiWritingRate - 30),
                                  isDisqualified: false,
                                  disqualificationReason: undefined,
                                });
                                showNotification('✓ Correction applied! AI writing rate reduced.');
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[#26f7db]" />
                            <span>Apply Correction (Humanize)</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editorial Feedback */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">AI Editorial Feedback:</span>
                  <p className="text-slate-600 italic leading-relaxed">
                    "{aiResult.editorialFeedback}"
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setAiModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
