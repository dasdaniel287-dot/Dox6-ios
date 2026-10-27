import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Send, X, ArrowUpRight, Cpu, Check, Terminal, Play, Moon } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AppleIntelligenceProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCodeX: () => void;
  onToggleFlashlight: () => void;
  onSwitchWallpaper: (id: string) => void;
  onOpenApp: (appId: string) => void;
  onAirDrop: () => void;
}

export const AppleIntelligence: React.FC<AppleIntelligenceProps> = ({
  isOpen,
  onClose,
  onRunCodeX,
  onToggleFlashlight,
  onSwitchWallpaper,
  onOpenApp,
  onAirDrop,
}) => {
  const [query, setQuery] = useState('');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (type: string, customText?: string) => {
    soundManager.playKeyClick();
    setIsProcessing(true);
    setResponseMsg(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (type === 'run') {
        onRunCodeX();
        setResponseMsg('Compiling and launching WeatherPro target in Simulator.');
      } else if (type === 'torch') {
        onToggleFlashlight();
        setResponseMsg('Flashlight state toggled.');
      } else if (type === 'wallpaper') {
        onSwitchWallpaper('ios18-aurora');
        setResponseMsg('Wallpaper switched to Dynamic Aurora.');
      } else if (type === 'terminal') {
        onOpenApp('terminal');
        onClose();
      } else if (type === 'airdrop') {
        onAirDrop();
        setResponseMsg('AirDrop binary transfer initiated for MacBook Pro.');
      } else {
        setResponseMsg(
          `Executed: "${customText || query}". SwiftUI AST parsed with zero diagnostics.`
        );
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const lower = query.toLowerCase();
    if (lower.includes('run') || lower.includes('build')) {
      handleAction('run');
    } else if (lower.includes('torch') || lower.includes('light')) {
      handleAction('torch');
    } else if (lower.includes('wallpaper') || lower.includes('aurora')) {
      handleAction('wallpaper');
    } else if (lower.includes('terminal')) {
      handleAction('terminal');
    } else if (lower.includes('airdrop') || lower.includes('share')) {
      handleAction('airdrop');
    } else {
      handleAction('custom', query);
    }
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 pointer-events-auto flex flex-col justify-end">
          {/* iOS 18 Edge-Glow Glowing Border */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-[44px] z-10"
            style={{
              boxShadow:
                'inset 0 0 25px 6px rgba(168, 85, 247, 0.7), inset 0 0 50px 10px rgba(59, 130, 246, 0.5), inset 0 0 80px 15px rgba(236, 72, 153, 0.4)',
            }}
          />

          {/* Background backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Intelligence Panel */}
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-20 mx-3 mb-6 p-4 rounded-3xl bg-neutral-900/95 backdrop-blur-3xl border border-white/20 shadow-2xl space-y-3 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Glowing Animated Orb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-rose-500 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white animate-spin [animation-duration:8s]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>CodeX Intelligence</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                      Apple Intelligence
                    </span>
                  </h4>
                  <p className="text-[10px] text-neutral-400">Contextual System & Swift Assistant</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Intelligence Actions */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => handleAction('run')}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium flex items-center gap-1.5 shrink-0 border border-white/5 active:scale-95 transition-all"
              >
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>Build & Run</span>
              </button>
              <button
                onClick={() => handleAction('torch')}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium flex items-center gap-1.5 shrink-0 border border-white/5 active:scale-95 transition-all"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Toggle Torch</span>
              </button>
              <button
                onClick={() => handleAction('wallpaper')}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium flex items-center gap-1.5 shrink-0 border border-white/5 active:scale-95 transition-all"
              >
                <Moon className="w-3 h-3 text-cyan-400" />
                <span>Aurora Theme</span>
              </button>
              <button
                onClick={() => handleAction('airdrop')}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium flex items-center gap-1.5 shrink-0 border border-white/5 active:scale-95 transition-all"
              >
                <ArrowUpRight className="w-3 h-3 text-blue-400" />
                <span>AirDrop Project</span>
              </button>
            </div>

            {/* Response Box if triggered */}
            {responseMsg && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{responseMsg}</span>
              </motion.div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask or command CodeX Intelligence..."
                className="w-full bg-neutral-800/90 text-white placeholder-neutral-500 text-xs py-2.5 pl-3.5 pr-10 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/60 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="absolute right-1.5 w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:scale-100 active:scale-90"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
