import React, { useState } from 'react';
import { InkVaultItem } from '../../types';
import { useStories } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Unlock,
  Key,
  Plus,
  Trash2,
  FileText,
  Book,
  Feather,
  Database,
  Sparkles,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface InkVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateStory?: () => void;
  onOpenEditor?: () => void;
}

export const InkVaultModal: React.FC<InkVaultModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateStory,
  onOpenEditor,
}) => {
  const { inkVaultItems, addInkVaultItem, deleteInkVaultItem } = useStories();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'manuscript' | 'journal' | 'poem_idea' | 'backup'>('all');
  const [selectedItem, setSelectedItem] = useState<InkVaultItem | null>(inkVaultItems[0] || null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Item State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'manuscript' | 'journal' | 'poem_idea' | 'backup'>('manuscript');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Private, Draft');
  const [isEncrypted, setIsEncrypted] = useState(true);

  if (!isOpen) return null;

  const filteredItems = inkVaultItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleCreateVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const words = newContent.trim().split(/\s+/).length;
    const item = addInkVaultItem({
      userId: currentUser?.id || 'usr_author',
      title: newTitle.trim(),
      type: newType,
      content: newContent.trim(),
      wordCount: words,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      isEncrypted,
    });

    setSelectedItem(item);
    setIsAddingNew(false);
    setNewTitle('');
    setNewContent('');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'manuscript':
        return <Book className="w-4 h-4 text-amber-500" />;
      case 'journal':
        return <FileText className="w-4 h-4 text-teal-500" />;
      case 'poem_idea':
        return <Feather className="w-4 h-4 text-purple-500" />;
      default:
        return <Database className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">InkVault 🔐</h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[#26f7db] text-[10px] font-extrabold uppercase">
                  End-to-End Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Secure sanctuary for unpublished manuscripts, private journals &amp; poetic fragments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#26f7db] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Vault Document</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 text-xs overflow-x-auto scrollbar-none">
          {(['all', 'manuscript', 'journal', 'poem_idea', 'backup'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-100'
              }`}
            >
              {tab === 'poem_idea' ? 'Poem Ideas' : tab}
            </button>
          ))}
        </div>

        {/* Main Vault Content Area: Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Vault Items List */}
          <div className="w-full md:w-80 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50/50 shrink-0 max-h-60 md:max-h-none">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <Lock className="w-8 h-8 mx-auto text-slate-300" />
                <p>No vaulted documents in this category.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsAddingNew(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-amber-400 shadow-sm'
                        : 'bg-white/80 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getIconForType(item.type)}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      {item.isEncrypted && (
                        <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Key className="w-2.5 h-2.5" />
                          <span>256-bit</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-serif italic">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                      <span>{item.wordCount} words</span>
                      <span>{new Date(item.lastVaultedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Preview / Add View */}
          <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col justify-between">
            {isAddingNew ? (
              /* Add New Document Form */
              <form onSubmit={handleCreateVaultItem} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Deposit into Secure InkVault</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Title:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unfinished Epic / Midnight Journals"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#26f7db]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Vault Category:
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#26f7db]"
                    >
                      <option value="manuscript">Unpublished Manuscript</option>
                      <option value="journal">Private Journal</option>
                      <option value="poem_idea">Poem Idea / Fragment</option>
                      <option value="backup">Cloud Backup Vault</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Encryption Shield:
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsEncrypted(!isEncrypted)}
                      className={`w-full p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        isEncrypted
                          ? 'bg-teal-50 border-teal-300 text-teal-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {isEncrypted ? <Lock className="w-3.5 h-3.5 text-teal-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isEncrypted ? 'AES-256 Enabled' : 'Standard'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Content:
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write or paste your private draft here..."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed focus:outline-none focus:border-[#26f7db]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Lock into InkVault
                  </button>
                </div>
              </form>
            ) : selectedItem ? (
              /* View Selected Item */
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-900">
                        {selectedItem.type.replace('_', ' ')}
                      </span>
                      {selectedItem.isEncrypted && (
                        <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3 text-teal-600" />
                          <span>Encrypted</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-950 mt-1">
                      {selectedItem.title}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Vaulted on {new Date(selectedItem.lastVaultedAt).toLocaleString()} · {selectedItem.wordCount} words
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteInkVaultItem(selectedItem.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete from InkVault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Box in Literature Font */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line select-text">
                  {selectedItem.content}
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {selectedItem.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Lock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Select an item from the left or deposit a new document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
