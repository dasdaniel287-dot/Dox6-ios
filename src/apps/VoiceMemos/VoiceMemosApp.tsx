import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  Trash2,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface RecordingItem {
  id: string;
  title: string;
  duration: string;
  date: string;
}

const INITIAL_RECORDINGS: RecordingItem[] = [
  { id: 'rec-1', title: 'Dox6 1513 LLVM Architecture Idea', duration: '01:42', date: 'Today, 9:20 AM' },
  { id: 'rec-2', title: 'SwiftUI Spatial Audio Discussion', duration: '03:15', date: 'Yesterday' },
  { id: 'rec-3', title: 'Dox6 System Kernel Notes', duration: '00:54', date: 'Oct 24, 2026' },
];

interface VoiceMemosAppProps {
  onClose: () => void;
}

export const VoiceMemosApp: React.FC<VoiceMemosAppProps> = ({ onClose }) => {
  const [recordings, setRecordings] = useState<RecordingItem[]>(INITIAL_RECORDINGS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    soundManager.playKeyClick();
    if (isRecording) {
      const mins = Math.floor(recordSeconds / 60);
      const secs = recordSeconds % 60;
      const formatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      const newRec: RecordingItem = {
        id: `rec-${Date.now()}`,
        title: `New Memo ${recordings.length + 1}`,
        duration: formatted,
        date: 'Just now',
      };
      setRecordings([newRec, ...recordings]);
      setIsRecording(false);
      soundManager.playBuildSuccess();
    } else {
      setIsRecording(true);
    }
  };

  const deleteRecording = (id: string) => {
    soundManager.playKeyClick();
    setRecordings(recordings.filter((r) => r.id !== id));
    if (playingId === id) setPlayingId(null);
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Voice Memos</h2>
          <span className="text-[11px] text-neutral-400">All Recordings · Dox6 Audio</span>
        </div>
        <span className="text-xs text-rose-400 font-mono font-medium">
          {recordings.length} Memos
        </span>
      </div>

      {/* Visualizer / Waveform Display */}
      <div className="h-36 bg-black/60 border-b border-white/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {isRecording ? (
          <div className="flex items-center gap-1.5 h-16">
            {[40, 75, 100, 60, 85, 30, 95, 45, 80, 65, 90, 50, 70, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 text-xs">
            <Mic className="w-8 h-8 mx-auto text-neutral-600 mb-1" />
            <span>Tap record button to begin recording</span>
          </div>
        )}

        {isRecording && (
          <div className="text-base font-mono font-bold text-rose-400 mt-2">
            {Math.floor(recordSeconds / 60)}:
            {recordSeconds % 60 < 10 ? `0${recordSeconds % 60}` : recordSeconds % 60}
          </div>
        )}
      </div>

      {/* Recordings List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="p-3 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  setPlayingId(playingId === rec.id ? null : rec.id);
                  soundManager.playKeyClick();
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  playingId === rec.id ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-white'
                }`}
              >
                {playingId === rec.id ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>
              <div className="truncate">
                <h4 className="text-xs font-semibold text-white truncate">{rec.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <span>{rec.duration}</span>
                  <span>·</span>
                  <span>{rec.date}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => deleteRecording(rec.id)}
              className="p-2 text-neutral-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Record Button Bar */}
      <div className="h-20 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-center shrink-0">
        <button
          onClick={toggleRecording}
          className={`w-14 h-14 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl ${
            isRecording ? 'p-3' : 'p-1'
          }`}
        >
          <div
            className={`w-full h-full bg-rose-500 transition-all ${
              isRecording ? 'rounded-xs' : 'rounded-full'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
