import React, { useState } from 'react';
import {
  Mail as MailIcon,
  Inbox,
  Star,
  Send,
  Trash2,
  Archive,
  Edit3,
  Search,
  ChevronLeft,
  X,
  Paperclip,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';

interface MailItem {
  id: string;
  sender: string;
  email: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  isFlagged: boolean;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
}

interface MailAppProps {
  onClose: () => void;
}

export const MailApp: React.FC<MailAppProps> = ({ onClose }) => {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'flagged' | 'sent' | 'trash'>('inbox');
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose fields
  const [toAddress, setToAddress] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');

  const [emails, setEmails] = useState<MailItem[]>([
    {
      id: 'm-1',
      sender: 'Apple Developer Program',
      email: 'developer@apple.com',
      avatar: '',
      subject: 'CodeX 1513 iOS Build Approved for Production',
      preview: 'Your application target has met all Human Interface Guidelines and Swift 6 runtime integrity standards...',
      body: `Hello Daniel,

We are pleased to inform you that your latest build of CodeX 1513 for Dox6 iOS has successfully passed automated App Review and security validation checks.

Key Highlights:
• Strict Concurrency Checking: Passed (0 data races detected)
• Dynamic Island Live Activities: Validated on iPhone 16 Pro and Pro Max
• Metal Shader Optimization: 60 FPS verified across Apple A18 Pro

The build is now ready for deployment across TestFlight and the App Store.

Best regards,
The Apple Developer Review Team
One Apple Park Way, Cupertino, CA`,
      time: '10:45 AM',
      unread: true,
      isFlagged: true,
      folder: 'inbox',
    },
    {
      id: 'm-2',
      sender: 'Craig Federighi',
      email: 'hairforceone@apple.com',
      avatar: 'CF',
      subject: 'Swift 6.2 Spatial Canvas Architecture',
      preview: 'Daniel, I looked through your proposal for the zero-latency live compiler pipeline. It is fantastic...',
      body: `Daniel,

I took a close look at the Dox6 architecture document you shared. The way CodeX 1513 leverages AST synthesis with dynamic island live compilation feedback is truly next level.

Let's do a quick sync tomorrow at 3:30 PM in Cupertino to discuss integration with Apple Intelligence on-device models.

Craig`,
      time: '9:12 AM',
      unread: true,
      isFlagged: true,
      folder: 'inbox',
    },
    {
      id: 'm-3',
      sender: 'GitHub Notifications',
      email: 'notifications@github.com',
      avatar: 'GH',
      subject: '[dox6/codex-1513] Release v1.8.2-pro published',
      preview: 'Release v1.8.2-pro has been tagged. Binaries uploaded: CodeXStudio-arm64.ipa, Dox6-Toolchain.tar.gz...',
      body: `Release v1.8.2-pro has been published:

• Added full DTMF audio synthesis in Phone dialer
• Added Reminders smart categories and priority filters
• Updated A18 Pro GPU compute pipeline
• Enhanced Dynamic Island live activity transitions

Download assets:
- CodeXStudio-arm64.ipa (48.2 MB)
- Dox6-CoreToolchain.pkg (112 MB)`,
      time: 'Yesterday',
      unread: false,
      isFlagged: false,
      folder: 'inbox',
    },
    {
      id: 'm-4',
      sender: 'Sarah Lin',
      email: 'sarah.lin@dox6.dev',
      avatar: 'SL',
      subject: 'SwiftUI Glassmorphism Design Tokens',
      preview: 'Here are the exact spring damping coefficients and backdrop blur filters for the iOS 18 glass cards...',
      body: `Hey Daniel,

Attached are the SwiftUI token constants we settled on for Dox6 Obsidian and Cyber Titanium:

- Blur radius: 32pt
- Background opacity: 0.18
- Border stroke: White 15% with smooth continuous corners

Everything renders at a stable 60 fps on the simulator!

Cheers,
Sarah`,
      time: 'Oct 25',
      unread: false,
      isFlagged: false,
      folder: 'inbox',
    },
  ]);

  const toggleFlag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    setEmails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFlagged: !m.isFlagged } : m))
    );
  };

  const deleteEmail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    setEmails((prev) => prev.filter((m) => m.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  const handleSendEmail = () => {
    if (!toAddress.trim() || !subjectInput.trim()) return;
    soundManager.playMessageSent();

    const newMail: MailItem = {
      id: 'm-' + Date.now(),
      sender: 'Daniel Das',
      email: 'dasdaniel287@gmail.com',
      avatar: 'DD',
      subject: subjectInput.trim(),
      preview: bodyInput.trim().slice(0, 80) + '...',
      body: bodyInput.trim(),
      time: 'Just now',
      unread: false,
      isFlagged: false,
      folder: 'sent',
    };

    setEmails([newMail, ...emails]);
    setToAddress('');
    setSubjectInput('');
    setBodyInput('');
    setIsComposeOpen(false);
  };

  const filteredEmails = emails.filter((m) => {
    if (searchQuery) {
      return (
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFolder === 'flagged') return m.isFlagged;
    if (activeFolder === 'sent') return m.folder === 'sent';
    return m.folder === 'inbox';
  });

  const unreadCount = emails.filter((m) => m.folder === 'inbox' && m.unread).length;

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {selectedMail && (
            <button
              onClick={() => setSelectedMail(null)}
              className="mr-1 text-blue-400 hover:text-blue-300 flex items-center text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Inbox
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-blue-400" />
            {selectedMail ? 'Message' : 'Mail'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!selectedMail && (
            <button
              onClick={() => {
                setIsComposeOpen(true);
                soundManager.playKeyClick();
              }}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAIL VIEW */}
      {selectedMail ? (
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {selectedMail.avatar}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedMail.sender}</h3>
                <p className="text-xs text-neutral-400">{selectedMail.email}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">To: Daniel Das &lt;dasdaniel287@gmail.com&gt;</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400">{selectedMail.time}</span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-3">{selectedMail.subject}</h2>
            <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
              {selectedMail.body}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={(e) => toggleFlag(selectedMail.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-xs text-neutral-300 hover:text-amber-400 border border-white/10"
            >
              <Star className={`w-4 h-4 ${selectedMail.isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{selectedMail.isFlagged ? 'Flagged' : 'Flag'}</span>
            </button>

            <button
              onClick={(e) => deleteEmail(selectedMail.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* FOLDERS ROW */}
          <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveFolder('inbox');
                soundManager.playKeyClick();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                activeFolder === 'inbox' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveFolder('flagged');
                soundManager.playKeyClick();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                activeFolder === 'flagged' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Flagged</span>
            </button>

            <button
              onClick={() => {
                setActiveFolder('sent');
                soundManager.playKeyClick();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                activeFolder === 'sent' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sent</span>
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search mail by sender, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* EMAIL LIST */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/10 px-2">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 space-y-2">
                <MailIcon className="w-8 h-8 mx-auto text-neutral-600" />
                <p className="text-xs">No mail in this folder.</p>
              </div>
            ) : (
              filteredEmails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => {
                    setSelectedMail(mail);
                    // Mark as read
                    setEmails((prev) =>
                      prev.map((m) => (m.id === mail.id ? { ...m, unread: false } : m))
                    );
                    soundManager.playKeyClick();
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors space-y-1 ${
                    mail.unread ? 'bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {mail.unread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <span className={`text-xs truncate ${mail.unread ? 'font-bold text-white' : 'font-medium text-neutral-300'}`}>
                        {mail.sender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-neutral-400">{mail.time}</span>
                      <button
                        onClick={(e) => toggleFlag(mail.id, e)}
                        className="text-neutral-500 hover:text-amber-400"
                      >
                        <Star className={`w-3.5 h-3.5 ${mail.isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className={`text-xs truncate ${mail.unread ? 'font-semibold text-neutral-100' : 'text-neutral-300'}`}>
                    {mail.subject}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {mail.preview}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* COMPOSE MODAL */}
      <AnimatePresence>
        {isComposeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-neutral-950 p-4 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-3 pt-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <button
                  onClick={() => setIsComposeOpen(false)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">New Message</h3>
                <button
                  onClick={handleSendEmail}
                  disabled={!toAddress.trim() || !subjectInput.trim()}
                  className={`text-xs font-bold ${
                    toAddress.trim() && subjectInput.trim()
                      ? 'text-blue-500 hover:text-blue-400'
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  Send
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center border-b border-white/10 py-1.5">
                  <span className="text-neutral-400 w-12">To:</span>
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="name@apple.com"
                    className="bg-transparent border-none text-white focus:outline-none w-full"
                    autoFocus
                  />
                </div>

                <div className="flex items-center border-b border-white/10 py-1.5">
                  <span className="text-neutral-400 w-12">Subject:</span>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    placeholder="Subject"
                    className="bg-transparent border-none text-white focus:outline-none w-full"
                  />
                </div>

                <textarea
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  placeholder="Sent from my Dox6 iPhone 16 Pro..."
                  rows={8}
                  className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-500 focus:outline-none resize-none pt-2 leading-relaxed"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
