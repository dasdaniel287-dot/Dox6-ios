import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Code,
  Heart,
  ThumbsUp,
  Sparkles,
  Phone,
  Video,
} from 'lucide-react';
import { SAMPLE_CONVERSATIONS } from '../../data/initialData';
import { ConversationItem, MessageItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface MessagesAppProps {
  onClose: () => void;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState<ConversationItem[]>(SAMPLE_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConvId) return;

    soundManager.playMessageSent();
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      avatar: 'DD',
      text: inputMessage,
      time: 'Just now',
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
          ? { ...c, messages: [...c.messages, newMsg] }
          : c
      )
    );
    setInputMessage('');

    // Simulate reply after 900ms
    setTimeout(() => {
      soundManager.playNotification();
      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: activeConv?.contactName || 'Colleague',
        avatar: activeConv?.avatar || '',
        text: 'Got it! I will test this on the iOS 18.2 simulator right away.',
        time: 'Just now',
        isMe: false,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvId
            ? { ...c, messages: [...c.messages, replyMsg] }
            : c
        )
      );
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* If conversation is open */}
      {activeConv ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Conversation Header */}
          <div className="pt-3 pb-2 px-3 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                setSelectedConvId(null);
                soundManager.playKeyClick();
              }}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Messages
            </button>
            <div className="text-center">
              <h4 className="text-xs font-semibold text-white">{activeConv.contactName}</h4>
              <span className="text-[10px] text-neutral-400">{activeConv.contactRole}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <button onClick={() => soundManager.playKeyClick()} className="hover:text-white">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                    msg.isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-xs border border-white/5'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.codeSnippet && (
                    <div className="mt-2 p-2 rounded-xl bg-black/60 font-mono text-[10px] text-emerald-300 overflow-x-auto border border-white/10">
                      <pre>{msg.codeSnippet}</pre>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-neutral-900/90 border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="iMessage · CodeX iOS"
              className="flex-1 bg-neutral-800 text-xs text-white placeholder-neutral-500 py-2 px-3 rounded-full border border-white/10 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List */
        <div className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
            <span className="text-xs text-neutral-400">3 Conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {conversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConvId(conv.id);
                    soundManager.playKeyClick();
                  }}
                  className="p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-white/10 flex items-center gap-3 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {conv.contactName}
                      </h4>
                      <span className="text-[10px] text-neutral-400">{lastMsg?.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                      {lastMsg?.text || 'No messages'}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
