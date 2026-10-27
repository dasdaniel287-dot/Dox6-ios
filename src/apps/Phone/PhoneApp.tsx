import React, { useState, useEffect, useRef } from 'react';
import {
  Phone as PhoneIcon,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  Delete,
  Star,
  Clock,
  User,
  Users,
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  Plus,
  Info,
  ChevronLeft,
  X,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicIslandState } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface PhoneAppProps {
  onClose: () => void;
  setIslandState?: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
}

interface RecentCall {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
  carrier: string;
}

interface ContactItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
  isFavorite?: boolean;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ onClose, setIslandState }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'>('keypad');
  const [dialedNumber, setDialedNumber] = useState('');
  const [recentsFilter, setRecentsFilter] = useState<'all' | 'missed'>('all');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [selectedRecentInfo, setSelectedRecentInfo] = useState<RecentCall | null>(null);

  // Active Call State
  const [isInCall, setIsInCall] = useState(false);
  const [activeCallTarget, setActiveCallTarget] = useState<{ name: string; number: string }>({ name: '', number: '' });
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showInCallKeypad, setShowInCallKeypad] = useState(false);
  const callTimerRef = useRef<any>(null);

  // Initial Data
  const [contacts, setContacts] = useState<ContactItem[]>([
    {
      id: 'c1',
      name: 'Alex Mercer',
      role: 'Core Metal & GPU Engineer',
      phone: '+1 (408) 555-0192',
      email: 'alex.mercer@dox6.dev',
      avatar: 'AM',
      isFavorite: true,
    },
    {
      id: 'c2',
      name: 'Craig Federighi',
      role: 'SVP Software Engineering',
      phone: '+1 (408) 996-1010',
      email: 'hairforceone@apple.com',
      avatar: 'CF',
      isFavorite: true,
    },
    {
      id: 'c3',
      name: 'Daniel Das',
      role: 'Dox6 iOS & CodeX Architect',
      phone: '+1 (408) 782-1513',
      email: 'dasdaniel287@gmail.com',
      avatar: 'DD',
      isFavorite: true,
    },
    {
      id: 'c4',
      name: 'John Ternus',
      role: 'Hardware Engineering Lead',
      phone: '+1 (408) 974-2000',
      email: 'ternus@apple.com',
      avatar: 'JT',
      isFavorite: false,
    },
    {
      id: 'c5',
      name: 'Phil Schiller',
      role: 'Apple Fellow',
      phone: '+1 (408) 996-8800',
      email: 'schiller@apple.com',
      avatar: 'PS',
      isFavorite: false,
    },
    {
      id: 'c6',
      name: 'Sarah Lin',
      role: 'SwiftUI & Dynamic Island Lead',
      phone: '+1 (408) 555-0144',
      email: 'sarah.lin@dox6.dev',
      avatar: 'SL',
      isFavorite: true,
    },
    {
      id: 'c7',
      name: 'Tim Cook',
      role: 'Chief Executive Officer',
      phone: '+1 (408) 996-0001',
      email: 'tcook@apple.com',
      avatar: 'TC',
      isFavorite: true,
    },
  ]);

  const [recents, setRecents] = useState<RecentCall[]>([
    {
      id: 'r1',
      name: 'Craig Federighi',
      number: '+1 (408) 996-1010',
      type: 'missed',
      time: '9:42 AM',
      carrier: 'Apple Park 5G Ultra Wideband',
    },
    {
      id: 'r2',
      name: 'Sarah Lin',
      number: '+1 (408) 555-0144',
      type: 'incoming',
      time: '9:15 AM',
      duration: '4m 12s',
      carrier: 'Verizon HD Voice',
    },
    {
      id: 'r3',
      name: 'Tim Cook',
      number: '+1 (408) 996-0001',
      type: 'outgoing',
      time: 'Yesterday',
      duration: '8m 45s',
      carrier: 'AT&T eSIM Pro',
    },
    {
      id: 'r4',
      name: 'Alex Mercer',
      number: '+1 (408) 555-0192',
      type: 'incoming',
      time: 'Yesterday',
      duration: '1m 20s',
      carrier: 'T-Mobile 5G',
    },
    {
      id: 'r5',
      name: '+1 (800) 692-7753',
      number: '+1 (800) 692-7753',
      type: 'missed',
      time: 'Oct 25',
      carrier: 'Apple Support',
    },
  ]);

  // Keypad keys definitions
  const keypadKeys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  // Call timer interval
  useEffect(() => {
    if (isInCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isInCall]);

  // Format call duration MM:SS
  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (num: string) => {
    soundManager.playDtmfTone(num);
    setDialedNumber((prev) => prev + num);
  };

  const handleBackspace = () => {
    soundManager.playKeyClick();
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleStartCall = (name: string, number: string) => {
    if (!number && !dialedNumber) return;
    const targetName = name || 'Cupertino Contact';
    const targetNumber = number || dialedNumber;

    soundManager.playCallConnected();
    setActiveCallTarget({ name: targetName, number: targetNumber });
    setIsInCall(true);

    if (setIslandState) {
      setIslandState({
        mode: 'compact',
        activity: 'call',
        title: targetName,
        subtitle: 'Dox6 HD Voice',
      });
    }

    // Add to Recents
    const newRecent: RecentCall = {
      id: 'rec-' + Date.now(),
      name: targetName,
      number: targetNumber,
      type: 'outgoing',
      time: 'Just now',
      carrier: 'Dox6 5G Voice',
    };
    setRecents((prev) => [newRecent, ...prev]);
  };

  const handleEndCall = () => {
    soundManager.playCallEnded();
    setIsInCall(false);
    setShowInCallKeypad(false);
    setIsMuted(false);
    setIsSpeaker(false);

    if (setIslandState) {
      setIslandState({
        mode: 'compact',
        activity: 'idle',
      });
    }
  };

  const filteredRecents = recents.filter((call) => {
    if (recentsFilter === 'missed') return call.type === 'missed';
    return true;
  });

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.phone.includes(contactSearch)
  );

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ACTIVE CALL MODAL VIEW */}
      <AnimatePresence>
        {isInCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="absolute inset-0 z-50 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 flex flex-col justify-between"
          >
            {/* Top Bar: Carrier & Status */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-6">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Dox6 HD Voice
              </span>
              <button
                onClick={() => setIsInCall(false)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] transition-colors"
                title="Minimize call to Dynamic Island"
              >
                Hide
              </button>
            </div>

            {/* Caller Info & Animated Avatar */}
            <div className="flex flex-col items-center my-auto space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neutral-700 via-neutral-600 to-neutral-500 flex items-center justify-center text-3xl font-light text-white shadow-2xl border-2 border-white/20">
                  {activeCallTarget.name.charAt(0) || <User className="w-10 h-10" />}
                </div>
                {/* Wave ring */}
                <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-pulse pointer-events-none" />
                <div className="absolute -inset-4 rounded-full border border-emerald-500/15 animate-ping pointer-events-none" />
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {activeCallTarget.name}
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  {activeCallTarget.number}
                </p>
                <p className="text-sm font-medium text-emerald-400 font-mono pt-1">
                  {formatCallTime(callDuration)}
                </p>
              </div>

              {/* In-Call Keypad Overlay */}
              {showInCallKeypad && (
                <div className="grid grid-cols-3 gap-3 w-64 pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      onClick={() => soundManager.playDtmfTone(k)}
                      className="w-16 h-12 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/35 text-white font-medium text-lg flex items-center justify-center transition-all"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-Call 6-Pod Controls */}
            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-3 gap-4 px-4">
                {/* Mute */}
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    soundManager.playKeyClick();
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-white text-black' : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
                  }`}>
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">mute</span>
                </button>

                {/* Keypad */}
                <button
                  onClick={() => {
                    setShowInCallKeypad(!showInCallKeypad);
                    soundManager.playKeyClick();
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    showInCallKeypad ? 'bg-white text-black' : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
                  }`}>
                    <span className="text-xl font-bold tracking-widest">:::</span>
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">keypad</span>
                </button>

                {/* Speaker */}
                <button
                  onClick={() => {
                    setIsSpeaker(!isSpeaker);
                    soundManager.playKeyClick();
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isSpeaker ? 'bg-white text-black' : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
                  }`}>
                    {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">audio</span>
                </button>

                {/* Add Call */}
                <button
                  onClick={() => soundManager.playKeyClick()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white flex items-center justify-center transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">add call</span>
                </button>

                {/* FaceTime */}
                <button
                  onClick={() => soundManager.playKeyClick()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white flex items-center justify-center transition-all">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">FaceTime</span>
                </button>

                {/* Contacts */}
                <button
                  onClick={() => {
                    setIsInCall(false);
                    setActiveTab('contacts');
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white flex items-center justify-center transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-neutral-300 font-medium">contacts</span>
                </button>
              </div>

              {/* End Call Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleEndCall}
                  className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-2xl transition-all"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-white capitalize">
          {activeTab}
        </h1>

        {activeTab === 'recents' && (
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => {
                setRecentsFilter('all');
                soundManager.playKeyClick();
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                recentsFilter === 'all' ? 'bg-neutral-700 text-white font-medium' : 'text-neutral-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setRecentsFilter('missed');
                soundManager.playKeyClick();
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                recentsFilter === 'missed' ? 'bg-neutral-700 text-white font-medium' : 'text-neutral-400'
              }`}
            >
              Missed
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN CONTENT BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 1. KEYPAD TAB */}
        {activeTab === 'keypad' && (
          <div className="h-full flex flex-col justify-between py-4 px-6">
            {/* Number Display */}
            <div className="flex flex-col items-center justify-center min-h-[70px] space-y-1">
              <span className="text-3xl font-light tracking-wide text-white font-mono break-all text-center select-text">
                {dialedNumber || '\u00A0'}
              </span>
              {dialedNumber && (
                <button
                  onClick={() => {
                    const newContact: ContactItem = {
                      id: 'c-' + Date.now(),
                      name: 'New Contact',
                      role: 'Personal',
                      phone: dialedNumber,
                      email: '',
                      avatar: '#',
                    };
                    setContacts([newContact, ...contacts]);
                    setSelectedContact(newContact);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Add Number
                </button>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-6 max-w-xs mx-auto w-full">
              {keypadKeys.map((item) => (
                <button
                  key={item.num}
                  onClick={() => handleKeyPress(item.num)}
                  className="w-18 h-18 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 flex flex-col items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  <span className="text-2xl font-light text-white leading-none">{item.num}</span>
                  {item.letters && (
                    <span className="text-[9px] font-semibold text-neutral-400 tracking-widest mt-0.5">
                      {item.letters}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Row: Call and Backspace buttons */}
            <div className="grid grid-cols-3 items-center max-w-xs mx-auto w-full pt-3">
              <div />
              <div className="flex justify-center">
                <button
                  onClick={() => handleStartCall('', dialedNumber)}
                  disabled={!dialedNumber}
                  className={`w-18 h-18 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    dialedNumber
                      ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white'
                      : 'bg-emerald-500/30 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <PhoneIcon className="w-8 h-8 fill-white" />
                </button>
              </div>
              <div className="flex justify-center">
                {dialedNumber && (
                  <button
                    onClick={handleBackspace}
                    className="p-3 text-neutral-400 hover:text-white active:scale-90 transition-transform"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. RECENTS TAB */}
        {activeTab === 'recents' && (
          <div className="divide-y divide-white/10 px-4">
            {filteredRecents.map((call) => (
              <div
                key={call.id}
                onClick={() => handleStartCall(call.name, call.number)}
                className="py-3 flex items-center justify-between group hover:bg-white/5 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="mt-0.5">
                    {call.type === 'missed' ? (
                      <PhoneMissed className="w-4 h-4 text-rose-500" />
                    ) : call.type === 'incoming' ? (
                      <PhoneIncoming className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <PhoneOutgoing className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${
                      call.type === 'missed' ? 'text-rose-500' : 'text-white'
                    }`}>
                      {call.name}
                    </h4>
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <span>{call.carrier}</span>
                      {call.duration && <span>· {call.duration}</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">{call.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecentInfo(call);
                    }}
                    className="text-blue-400 hover:text-blue-300 p-1"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="p-4 space-y-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Contacts"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
              />
            </div>

            {/* My Card */}
            <div
              onClick={() => {
                const myCard = contacts.find((c) => c.id === 'c3');
                if (myCard) setSelectedContact(myCard);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-white/10 cursor-pointer hover:bg-neutral-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base">
                DD
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Daniel Das</h3>
                <p className="text-xs text-neutral-400">My Card · Dox6 Architect</p>
              </div>
            </div>

            {/* Contacts Alphabetical List */}
            <div className="space-y-1">
              {filteredContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-800 text-neutral-300 font-medium text-xs flex items-center justify-center border border-white/10">
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{c.name}</h4>
                      <p className="text-[11px] text-neutral-400">{c.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCall(c.name, c.phone);
                    }}
                    className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="p-4 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
              Frequent Speed Dials
            </span>
            <div className="grid grid-cols-2 gap-3">
              {contacts.filter((c) => c.isFavorite).map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => handleStartCall(fav.name, fav.phone)}
                  className="p-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-emerald-500/50 hover:bg-neutral-800/80 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {fav.avatar}
                    </div>
                    <PhoneIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate">{fav.name}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{fav.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VOICEMAIL TAB */}
        {activeTab === 'voicemail' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No Voicemails</h3>
            <p className="text-xs text-neutral-400 max-w-xs">
              Your Dox6 visual voicemail inbox is completely clear. Any recorded messages will sync via iCloud.
            </p>
          </div>
        )}
      </div>

      {/* CONTACT DETAILS SHEET MODAL */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-40 bg-neutral-950 p-5 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Contacts
                </button>
                <button
                  onClick={() => {
                    setContacts(
                      contacts.map((c) =>
                        c.id === selectedContact.id ? { ...c, isFavorite: !c.isFavorite } : c
                      )
                    );
                    setSelectedContact({ ...selectedContact, isFavorite: !selectedContact.isFavorite });
                    soundManager.playKeyClick();
                  }}
                  className={`p-1.5 rounded-full ${
                    selectedContact.isFavorite ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                  {selectedContact.avatar}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">{selectedContact.name}</h2>
                  <p className="text-xs text-neutral-400">{selectedContact.role}</p>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    handleStartCall(selectedContact.name, selectedContact.phone);
                    setSelectedContact(null);
                  }}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 flex flex-col items-center gap-1 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-neutral-300">call</span>
                </button>
                <button
                  onClick={() => soundManager.playKeyClick()}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 flex flex-col items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] text-neutral-300">message</span>
                </button>
                <button
                  onClick={() => soundManager.playKeyClick()}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 flex flex-col items-center gap-1 transition-colors"
                >
                  <Video className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-neutral-300">FaceTime</span>
                </button>
                <button
                  onClick={() => soundManager.playKeyClick()}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 flex flex-col items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] text-neutral-300">Dox6 AI</span>
                </button>
              </div>

              {/* Contact Data Items */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold">phone</span>
                  <p className="text-sm text-blue-400 font-mono mt-0.5">{selectedContact.phone}</p>
                </div>
                {selectedContact.email && (
                  <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold">email</span>
                    <p className="text-sm text-neutral-200 mt-0.5">{selectedContact.email}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM TAB BAR */}
      <div className="border-t border-white/10 bg-neutral-950/90 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            setActiveTab('favorites');
            soundManager.playKeyClick();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'favorites' ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Star className="w-5 h-5" />
          <span className="text-[10px]">Favorites</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('recents');
            soundManager.playKeyClick();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'recents' ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Recents</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('contacts');
            soundManager.playKeyClick();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'contacts' ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Contacts</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('keypad');
            soundManager.playKeyClick();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'keypad' ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <div className="w-5 h-5 grid grid-cols-3 gap-0.5 p-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`rounded-[1px] ${activeTab === 'keypad' ? 'bg-blue-500' : 'bg-neutral-500'}`} />
            ))}
          </div>
          <span className="text-[10px]">Keypad</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('voicemail');
            soundManager.playKeyClick();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'voicemail' ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[10px]">Voicemail</span>
        </button>
      </div>
    </div>
  );
};
