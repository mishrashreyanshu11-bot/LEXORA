import React, { useState } from 'react';
import { Story, StoryPart, AIAssessmentResult } from '../../types';
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
  } = useStories();

  const { currentUser } = useAuth();

  // Story Form State
  const [title, setTitle] = useState(storyToEdit?.title || '');
  const [synopsis, setSynopsis] = useState(storyToEdit?.synopsis || '');
  const [coverImage, setCoverImage] = useState(storyToEdit?.coverImage || PRESET_COVERS[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [category, setCategory] = useState(storyToEdit?.category || 'Fiction');
  const [genre, setGenre] = useState(storyToEdit?.genre || 'Speculative Fiction');
  const [language, setLanguage] = useState(storyToEdit?.language || 'English');
  const [tagsInput, setTagsInput] = useState(storyToEdit?.tags.join(', ') || 'Serialized, Original');
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

            {/* Categorization */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Speculative Fiction">Speculative Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Poetry & Short Form">Poetry & Short Form</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  placeholder="e.g. Cyberpunk Noir"
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300"
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
                  className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7]"
                />
              </div>

              {/* Part Content Area */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Chapter Content</label>
                <textarea
                  rows={20}
                  value={partContent}
                  onChange={e => setPartContent(e.target.value)}
                  placeholder="Compose your serialized story here. Use double line breaks between paragraphs for natural editorial spacing..."
                  className="w-full p-4 font-editorial text-base text-slate-800 leading-relaxed rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#26F7F7] bg-white resize-y"
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

      {/* AI Assessment Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-slate-900 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 border border-[#26F7F7]">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Content & Safety Assessment</h3>
                  <p className="text-[11px] text-slate-500">Gemini-assisted literary audit signal</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAssessing ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Auditing literary style, syntactic variability, spam patterns, and originality...
                </p>
              </div>
            ) : aiResult ? (
              <div className="space-y-4 text-xs">
                {/* Indication Banner */}
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-teal-950">
                      {aiResult.indication}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-teal-800 font-bold border border-teal-200">
                      {aiResult.confidenceScore}% confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Note: AI assessment is an informative moderation signal, not absolute verification.
                  </p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Originality Score</span>
                    <p className="text-xl font-bold font-mono text-slate-900">{aiResult.originalityScore}/100</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Spam Index</span>
                    <p className="text-xl font-bold font-mono text-emerald-600">{aiResult.spamScore}%</p>
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700">Observed Stylistic Markers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.flags.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-medium">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Editorial Critique */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">Editorial Feedback:</span>
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
