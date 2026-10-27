import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  ListTodo,
  Tag,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';

interface RemindersAppProps {
  onClose: () => void;
}

interface ReminderItem {
  id: string;
  title: string;
  notes?: string;
  dueDate: string;
  priority: 'low' | 'med' | 'high' | 'none';
  completed: boolean;
  listId: string;
  isFlagged?: boolean;
}

interface ReminderList {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export const RemindersApp: React.FC<RemindersAppProps> = ({ onClose }) => {
  const [activeSmartView, setActiveSmartView] = useState<'today' | 'scheduled' | 'all' | 'flagged' | 'completed' | null>('all');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New reminder form fields
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newListId, setNewListId] = useState('list-1');
  const [newPriority, setNewPriority] = useState<'low' | 'med' | 'high' | 'none'>('none');
  const [newDueDate, setNewDueDate] = useState('Today, 5:00 PM');
  const [newIsFlagged, setNewIsFlagged] = useState(false);

  // Initial Lists
  const [lists, setLists] = useState<ReminderList[]>([
    { id: 'list-1', name: 'CodeX 1513 & Swift', color: 'bg-indigo-500', iconName: 'Code' },
    { id: 'list-2', name: 'Cupertino & Apple', color: 'bg-blue-500', iconName: 'Apple' },
    { id: 'list-3', name: 'Personal & Health', color: 'bg-rose-500', iconName: 'Heart' },
    { id: 'list-4', name: 'Ideas & Architecture', color: 'bg-amber-500', iconName: 'Lightbulb' },
  ]);

  // Initial Reminders
  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 'rem-1',
      title: 'Verify Swift 6 Actor Isolation in VitalFitView',
      notes: 'Make sure @MainActor is enforced on UI state mutation pipeline.',
      dueDate: 'Today, 2:30 PM',
      priority: 'high',
      completed: false,
      listId: 'list-1',
      isFlagged: true,
    },
    {
      id: 'rem-2',
      title: 'Submit CodeX 1513 iOS 18.2 Build to TestFlight',
      notes: 'Include release notes for Dynamic Island live activities and Swift Concurrency.',
      dueDate: 'Today, 6:00 PM',
      priority: 'high',
      completed: false,
      listId: 'list-1',
      isFlagged: true,
    },
    {
      id: 'rem-3',
      title: 'Review A18 Pro Metal Shader Frame Timing',
      notes: 'Benchmark 4K spatial compute shaders with Alex Mercer.',
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'med',
      completed: false,
      listId: 'list-1',
      isFlagged: false,
    },
    {
      id: 'rem-4',
      title: 'Sync with Craig Federighi on Swift 6.2 preview',
      notes: 'Prepare slide deck for SwiftUI dynamic layout updates.',
      dueDate: 'Tomorrow, 3:30 PM',
      priority: 'high',
      completed: false,
      listId: 'list-2',
      isFlagged: true,
    },
    {
      id: 'rem-5',
      title: 'Daily 30-minute Cardio & Stand Goal',
      notes: 'Close red, green, and cyan Activity Rings in VitalFit.',
      dueDate: 'Today, 8:00 PM',
      priority: 'low',
      completed: true,
      listId: 'list-3',
      isFlagged: false,
    },
    {
      id: 'rem-6',
      title: 'Refactor Dynamic Island timer live activities',
      notes: 'Ensure smooth spring damping transition on island expand.',
      dueDate: 'Oct 28',
      priority: 'none',
      completed: true,
      listId: 'list-4',
      isFlagged: false,
    },
  ]);

  const toggleReminder = (id: string) => {
    soundManager.playKeyClick();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    soundManager.playKeyClick();
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateReminder = () => {
    if (!newTitle.trim()) return;
    soundManager.playBuildSuccess();

    const created: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: newTitle.trim(),
      notes: newNotes.trim() || undefined,
      dueDate: newDueDate,
      priority: newPriority,
      completed: false,
      listId: newListId,
      isFlagged: newIsFlagged,
    };

    setReminders([created, ...reminders]);
    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Smart counts
  const todayCount = reminders.filter((r) => !r.completed && r.dueDate.includes('Today')).length;
  const scheduledCount = reminders.filter((r) => !r.completed && r.dueDate).length;
  const allCount = reminders.filter((r) => !r.completed).length;
  const flaggedCount = reminders.filter((r) => !r.completed && r.isFlagged).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  // Filtered Reminders
  const displayedReminders = reminders.filter((r) => {
    if (searchQuery) {
      return (
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedListId) {
      return r.listId === selectedListId;
    }
    if (activeSmartView === 'today') {
      return !r.completed && r.dueDate.includes('Today');
    }
    if (activeSmartView === 'scheduled') {
      return !r.completed && r.dueDate;
    }
    if (activeSmartView === 'flagged') {
      return !r.completed && r.isFlagged;
    }
    if (activeSmartView === 'completed') {
      return r.completed;
    }
    return !r.completed; // 'all' view shows active items
  });

  const getListName = (id: string) => {
    return lists.find((l) => l.id === id)?.name || 'Reminders';
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER */}
      <div className="px-5 pt-11 pb-3 flex items-center justify-between border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-blue-400" />
            Reminders
          </h1>
          <p className="text-[11px] text-neutral-400">iCloud Synced · Dox6 OS</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              soundManager.playKeyClick();
            }}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reminders, notes, tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* BODY SCROLL */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        {/* TOP SMART TILES (iOS Standard 4-tile or 5-tile Grid) */}
        {!searchQuery && !selectedListId && (
          <div className="grid grid-cols-2 gap-3">
            {/* Today */}
            <div
              onClick={() => {
                setActiveSmartView('today');
                soundManager.playKeyClick();
              }}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                activeSmartView === 'today'
                  ? 'bg-blue-900/40 border-blue-500'
                  : 'bg-neutral-900/90 border-white/10 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-white">{todayCount}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300 mt-2 block">Today</span>
            </div>

            {/* Scheduled */}
            <div
              onClick={() => {
                setActiveSmartView('scheduled');
                soundManager.playKeyClick();
              }}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                activeSmartView === 'scheduled'
                  ? 'bg-rose-900/40 border-rose-500'
                  : 'bg-neutral-900/90 border-white/10 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-white">{scheduledCount}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300 mt-2 block">Scheduled</span>
            </div>

            {/* All */}
            <div
              onClick={() => {
                setActiveSmartView('all');
                soundManager.playKeyClick();
              }}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                activeSmartView === 'all'
                  ? 'bg-neutral-800 border-white/40'
                  : 'bg-neutral-900/90 border-white/10 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-white shadow-md">
                  <ListTodo className="w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-white">{allCount}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300 mt-2 block">All</span>
            </div>

            {/* Flagged */}
            <div
              onClick={() => {
                setActiveSmartView('flagged');
                soundManager.playKeyClick();
              }}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                activeSmartView === 'flagged'
                  ? 'bg-amber-900/40 border-amber-500'
                  : 'bg-neutral-900/90 border-white/10 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md">
                  <Flag className="w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-white">{flaggedCount}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300 mt-2 block">Flagged</span>
            </div>
          </div>
        )}

        {/* LISTS FILTER PILLS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              My Lists
            </span>
            {selectedListId && (
              <button
                onClick={() => setSelectedListId(null)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                Show All Lists
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {lists.map((lst) => {
              const count = reminders.filter((r) => r.listId === lst.id && !r.completed).length;
              return (
                <div
                  key={lst.id}
                  onClick={() => {
                    setSelectedListId(selectedListId === lst.id ? null : lst.id);
                    soundManager.playKeyClick();
                  }}
                  className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${
                    selectedListId === lst.id
                      ? 'bg-white/15 border-white/40'
                      : 'bg-neutral-900/70 border-white/5 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-3 h-3 rounded-full ${lst.color}`} />
                    <span className="text-xs font-medium text-neutral-200 truncate">{lst.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE REMINDERS LIST */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white capitalize">
              {selectedListId
                ? getListName(selectedListId)
                : activeSmartView || 'Reminders'}
            </h3>
            <span className="text-[11px] text-neutral-400">
              {displayedReminders.length} items
            </span>
          </div>

          {displayedReminders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-xs">No reminders found in this category.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedReminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    reminder.completed
                      ? 'bg-neutral-900/40 border-white/5 opacity-60'
                      : 'bg-neutral-900/90 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className="mt-0.5 text-neutral-400 hover:text-blue-400 transition-colors"
                    >
                      {reminder.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-500 hover:border-blue-400" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {reminder.priority === 'high' && (
                          <span className="text-xs font-bold text-rose-500">!!!</span>
                        )}
                        {reminder.priority === 'med' && (
                          <span className="text-xs font-bold text-amber-500">!!</span>
                        )}
                        {reminder.priority === 'low' && (
                          <span className="text-xs font-bold text-blue-400">!</span>
                        )}
                        <h4 className={`text-xs font-semibold text-white ${
                          reminder.completed ? 'line-through text-neutral-400' : ''
                        }`}>
                          {reminder.title}
                        </h4>
                      </div>

                      {reminder.notes && (
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                          {reminder.notes}
                        </p>
                      )}

                      {/* Metadata Row */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-400">
                        {reminder.dueDate && (
                          <span className="flex items-center gap-1 text-blue-400 font-medium">
                            <Clock className="w-3 h-3" />
                            {reminder.dueDate}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {getListName(reminder.listId)}
                        </span>
                        {reminder.isFlagged && (
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Flag className="w-2.5 h-2.5 fill-current" /> Flagged
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE REMINDER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="absolute inset-0 z-50 bg-neutral-950 p-5 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">New Reminder</h3>
                <button
                  onClick={handleCreateReminder}
                  disabled={!newTitle.trim()}
                  className={`text-xs font-semibold ${
                    newTitle.trim() ? 'text-blue-500 hover:text-blue-400' : 'text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  Done
                </button>
              </div>

              {/* Form Inputs */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Test Swift Concurrency)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                  autoFocus
                />
                <textarea
                  placeholder="Notes & Details"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  className="bg-transparent border-t border-white/10 pt-2 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none w-full resize-none"
                />
              </div>

              {/* Target List */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">List</span>
                <select
                  value={newListId}
                  onChange={(e) => setNewListId(e.target.value)}
                  className="w-full bg-neutral-800 text-xs text-white rounded-lg p-2 border border-white/10 focus:outline-none"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date & Time */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Due Date</span>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Today, 5:00 PM or Oct 29"
                  className="w-full bg-neutral-800 text-xs text-white rounded-lg p-2 border border-white/10 focus:outline-none"
                />
              </div>

              {/* Priority */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Priority</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'low', 'med', 'high'] as const).map((pri) => (
                    <button
                      key={pri}
                      onClick={() => setNewPriority(pri)}
                      className={`py-1.5 rounded-lg text-xs capitalize transition-all ${
                        newPriority === pri
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flag Toggle */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-200">Flag this reminder</span>
                <button
                  onClick={() => setNewIsFlagged(!newIsFlagged)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    newIsFlagged ? 'bg-amber-500' : 'bg-neutral-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    newIsFlagged ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
