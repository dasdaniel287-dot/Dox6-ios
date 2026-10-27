import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Plus,
  Share2,
  Sparkles,
  User,
  Users,
  Search,
  X,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';

interface FaceTimeAppProps {
  onClose: () => void;
}

export const FaceTimeApp: React.FC<FaceTimeAppProps> = ({ onClose }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [activeContact, setActiveContact] = useState<{ name: string; avatar: string; role: string }>({
    name: 'Craig Federighi',
    avatar: 'CF',
    role: 'SVP Software Engineering',
  });
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(14);

  const contacts = [
    { name: 'Craig Federighi', avatar: 'CF', role: 'SVP Software Engineering', color: 'from-blue-600 to-indigo-600' },
    { name: 'Sarah Lin', avatar: 'SL', role: 'Lead iOS Architect', color: 'from-purple-600 to-rose-600' },
    { name: 'Tim Cook', avatar: 'TC', role: 'Chief Executive Officer', color: 'from-amber-600 to-orange-600' },
    { name: 'Alex Mercer', avatar: 'AM', role: 'Metal GPU Lead', color: 'from-emerald-600 to-teal-600' },
  ];

  const handleStartCall = (contact: typeof contacts[0]) => {
    soundManager.playCallConnected();
    setActiveContact(contact);
    setIsInCall(true);
  };

  const handleEndCall = () => {
    soundManager.playCallEnded();
    setIsInCall(false);
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ACTIVE CALL OVERLAY */}
      <AnimatePresence>
        {isInCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-4"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pt-8 px-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white">{activeContact.name}</span>
                <span className="text-neutral-400 font-mono">00:{callDuration}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                  Spatial Audio
                </span>
              </div>
            </div>

            {/* Remote Video Stream View (Simulated Apple Park High-Def stream) */}
            <div className="relative flex-1 my-4 rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/10 flex flex-col items-center justify-center shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="FaceTime Feed"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="relative z-10 text-center space-y-1">
                <span className="text-lg font-bold text-white drop-shadow-md">{activeContact.name}</span>
                <p className="text-xs text-neutral-300 drop-shadow">{activeContact.role}</p>
              </div>

              {/* Picture-in-picture local preview */}
              <div className="absolute top-4 right-4 w-24 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-neutral-800">
                {!isVideoMuted ? (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                    alt="Self camera"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
                    <VideoOff className="w-6 h-6" />
                  </div>
                )}
                <span className="absolute bottom-1 left-2 text-[9px] font-bold text-white drop-shadow">You</span>
              </div>
            </div>

            {/* In-Call Controls */}
            <div className="p-3 rounded-3xl bg-neutral-900/90 backdrop-blur-2xl border border-white/10 flex items-center justify-around shadow-2xl">
              <button
                onClick={() => {
                  setIsMicMuted(!isMicMuted);
                  soundManager.playKeyClick();
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMicMuted ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  setIsVideoMuted(!isVideoMuted);
                  soundManager.playKeyClick();
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isVideoMuted ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                }`}
              >
                {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => soundManager.playKeyClick()}
                className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            FaceTime
          </h1>
          <p className="text-[10px] text-neutral-400">Spatial Audio & HD Video</p>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CONTACT LIST & QUICK CALL */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* CREATE LINK OR NEW CALL */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => soundManager.playAirDropSend()}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Create Link</span>
          </button>

          <button
            onClick={() => handleStartCall(contacts[0])}
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">New FaceTime</span>
          </button>
        </div>

        {/* RECENTS & FAVORITES */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
            FaceTime Contacts
          </span>

          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.name}
                onClick={() => handleStartCall(contact)}
                className="p-3 rounded-2xl bg-neutral-900/80 border border-white/5 hover:border-emerald-500/30 hover:bg-neutral-800 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${contact.color} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                    {contact.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{contact.name}</h4>
                    <p className="text-[11px] text-neutral-400">{contact.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="text-[10px] font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    HD
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
