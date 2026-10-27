import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Pin,
  ArrowLeft,
  Share,
  Calendar,
  Folder,
} from 'lucide-react';
import { SAMPLE_NOTES } from '../../data/initialData';
import { NoteItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface NotesAppProps {
  onClose: () => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<NoteItem[]>(SAMPLE_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleCreateNote = () => {
    soundManager.playKeyClick();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      updatedAt: 'Just now',
      isPinned: false,
      category: 'General',
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    soundManager.playKeyClick();
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const handleTogglePin = (id: string) => {
    soundManager.playKeyClick();
    setNotes(
      notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleUpdateContent = (field: 'title' | 'content', val: string) => {
    if (!selectedNoteId) return;
    setNotes(
      notes.map((n) =>
        n.id === selectedNoteId
          ? { ...n, [field]: val, updatedAt: 'Just now' }
          : n
      )
    );
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* If note is selected: Note Editor View */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col justify-between p-4 bg-neutral-950">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <button
              onClick={() => {
                setSelectedNoteId(null);
                soundManager.playKeyClick();
              }}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Notes</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTogglePin(selectedNote.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  selectedNote.isPinned
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Pin Note"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Note Inputs */}
          <div className="flex-1 flex flex-col py-4 overflow-y-auto no-scrollbar space-y-3">
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => handleUpdateContent('title', e.target.value)}
              placeholder="Note Title"
              className="w-full bg-transparent border-none text-xl font-bold text-white placeholder-neutral-500 focus:outline-none"
            />
            <div className="text-[11px] text-neutral-500">
              {selectedNote.updatedAt} · {selectedNote.content.length} characters
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) => handleUpdateContent('content', e.target.value)}
              placeholder="Start typing your note, Swift code, or checklist..."
              className="flex-1 w-full bg-transparent border-none text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>
        </div>
      ) : (
        /* Notes List View */
        <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-2xl font-bold text-white">Notes</h2>
              <button
                onClick={handleCreateNote}
                className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 active:scale-95 shadow-md transition-all"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-900 border border-white/10 text-xs">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="bg-transparent border-none text-white w-full focus:outline-none placeholder-neutral-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {['All', 'Architecture', 'Swift Guide', 'Design'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    soundManager.playKeyClick();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pt-1">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 text-xs">
                  No notes found in this folder
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      soundManager.playKeyClick();
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-white/10 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {note.title || 'Untitled Note'}
                      </h4>
                      {note.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {note.content || 'No additional text'}
                    </p>
                    <div className="text-[10px] text-neutral-500 pt-0.5">
                      {note.updatedAt}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Count Footer */}
          <div className="text-center text-[11px] text-neutral-500 pt-2 border-t border-white/10">
            {notes.length} Notes · iCloud Synced
          </div>
        </div>
      )}
    </div>
  );
};
