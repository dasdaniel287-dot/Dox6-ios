import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, CheckCircle2, Loader2, Music, Sparkles, BatteryCharging, Timer, Volume2, PhoneCall, PhoneOff } from 'lucide-react';
import { DynamicIslandState, MusicTrack } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface DynamicIslandProps {
  islandState: DynamicIslandState;
  setIslandState: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
  currentTrack?: MusicTrack;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNextTrack: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  islandState,
  setIslandState,
  currentTrack,
  isPlayingMusic,
  onToggleMusic,
  onNextTrack,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = islandState.mode === 'expanded';

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    setIslandState(prev => ({
      ...prev,
      mode: prev.mode === 'expanded' ? 'compact' : 'expanded',
    }));
  };

  return (
    <div className="relative z-50 flex justify-center w-full">
      <motion.div
        layout
        onClick={toggleExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-black text-white cursor-pointer select-none overflow-hidden transition-all duration-300 shadow-2xl border border-white/5"
        style={{
          borderRadius: isExpanded ? 34 : 22,
        }}
        animate={{
          width: isExpanded ? 320 : islandState.activity === 'music' && isPlayingMusic ? 180 : islandState.activity === 'call' ? 180 : 124,
          height: isExpanded ? 154 : 34,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 32,
        }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* COMPACT MODE */
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full px-3 flex items-center justify-between"
            >
              {/* Left Side: Activity indicator or camera cutout */}
              <div className="flex items-center gap-1.5">
                {islandState.activity === 'call' ? (
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ) : islandState.activity === 'building' ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                ) : islandState.activity === 'recording' ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                ) : islandState.activity === 'airdrop' ? (
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                ) : islandState.activity === 'music' && isPlayingMusic ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0ms] h-full" />
                    <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:150ms] h-2/3" />
                    <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:300ms] h-4/5" />
                  </div>
                ) : islandState.activity === 'battery' ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                ) : islandState.activity === 'timer' ? (
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800" />
                )}
                
                {islandState.activity === 'call' && (
                  <span className="text-[11px] font-medium text-emerald-400 truncate max-w-[80px]">
                    {islandState.title || 'In Call'}
                  </span>
                )}
                {islandState.activity === 'music' && (
                  <span className="text-[11px] font-medium text-neutral-300 truncate max-w-[80px]">
                    {currentTrack?.title || 'CodeX Music'}
                  </span>
                )}
                {islandState.activity === 'building' && (
                  <span className="text-[11px] font-medium text-blue-400">
                    Compiling...
                  </span>
                )}
                {islandState.activity === 'recording' && (
                  <span className="text-[11px] font-medium text-rose-400 font-mono">
                    REC
                  </span>
                )}
                {islandState.activity === 'airdrop' && (
                  <span className="text-[11px] font-medium text-blue-400">
                    AirDrop...
                  </span>
                )}
              </div>

              {/* Right Side: Sensor pill */}
              <div className="flex items-center gap-1.5">
                {islandState.activity === 'call' ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : islandState.activity === 'music' && isPlayingMusic ? (
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                ) : islandState.activity === 'building' ? (
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-indigo-950/80 ring-1 ring-indigo-900/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/60" />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* EXPANDED MODE */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="p-4 h-full flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {islandState.activity === 'call' ? (
                /* Active Call Live Activity */
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{islandState.title || 'In Call'}</h4>
                        <p className="text-[11px] text-emerald-400 font-mono">00:18 · Dox6 HD Voice</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                    <span className="text-[11px] text-neutral-400">Microphone active</span>
                    <button
                      onClick={() => {
                        soundManager.playCallEnded();
                        setIslandState({ mode: 'compact', activity: 'idle' });
                      }}
                      className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <PhoneOff className="w-3.5 h-3.5" /> End Call
                    </button>
                  </div>
                </div>
              ) : islandState.activity === 'building' ? (
                /* Active Build Widget */
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-100">CodeX1513 LLVM Toolchain</h4>
                        <p className="text-[11px] text-neutral-400">Compiling SwiftUI Ast & Symbols...</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40">
                      ARM64
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Generating Mach-O binary</span>
                      <span className="text-neutral-200">92%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[92%] rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0 Warnings
                    </span>
                    <button
                      onClick={toggleExpand}
                      className="text-neutral-400 hover:text-white px-2 py-0.5 rounded text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                /* Music & Media Player Widget */
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                      alt={currentTrack?.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-md border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {currentTrack?.title || 'Silicon Dreams'}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {currentTrack?.artist || 'CodeX Ambient'} · {currentTrack?.album || 'Cupertino'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-rose-400 mt-0.5">
                        <Volume2 className="w-3 h-3" />
                        <span>Spatial Audio</span>
                      </div>
                    </div>
                  </div>

                  {/* Scrubber simulation */}
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-rose-500 h-full w-2/5 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>1:14</span>
                      <span>-2:18</span>
                    </div>
                  </div>

                  {/* Media Controls */}
                  <div className="flex items-center justify-between px-6 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playKeyClick();
                      }}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <span className="text-xs font-mono">15s</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMusic();
                        soundManager.playKeyClick();
                      }}
                      className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      {isPlayingMusic ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNextTrack();
                        soundManager.playKeyClick();
                      }}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
