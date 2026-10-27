import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Radio,
  Sun,
  Volume2,
  Flashlight,
  Moon,
  Calculator,
  Camera,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Cpu,
  X,
  Battery,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { MusicTrack } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  isFlashlightOn: boolean;
  setIsFlashlightOn: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSoundMuted: boolean;
  setIsSoundMuted: React.Dispatch<React.SetStateAction<boolean>>;
  currentTrack?: MusicTrack;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onOpenApp: (appId: string) => void;
  onTriggerIntelligence?: () => void;
  onTakeScreenshot?: () => void;
  isScreenRecording?: boolean;
  onToggleScreenRecording?: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  brightness,
  setBrightness,
  volume,
  setVolume,
  isFlashlightOn,
  setIsFlashlightOn,
  isDarkMode,
  setIsDarkMode,
  isSoundMuted,
  setIsSoundMuted,
  currentTrack,
  isPlayingMusic,
  onToggleMusic,
  onNextTrack,
  onOpenApp,
  onTriggerIntelligence,
  onTakeScreenshot,
  isScreenRecording,
  onToggleScreenRecording,
}) => {
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [wifiEnabled, setWifiEnabled] = React.useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = React.useState(true);
  const [cellularEnabled, setCellularEnabled] = React.useState(true);
  const [lowPowerMode, setLowPowerMode] = React.useState(false);

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    soundManager.setSoundEnabled(!next);
    if (!next) soundManager.playKeyClick();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="absolute inset-0 z-50 p-5 pt-12 bg-black/60 backdrop-blur-3xl text-white flex flex-col justify-between overflow-y-auto no-scrollbar"
          onClick={onClose}
        >
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Top Bar with Dismiss */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                Control Center
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Row 1: Connectivity Pod & Media Pod */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Connectivity Pod (2x2) */}
              <div className="p-3.5 rounded-3xl bg-neutral-900/80 border border-white/10 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setAirplaneMode(!airplaneMode);
                    soundManager.playKeyClick();
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    airplaneMode ? 'bg-amber-500 text-white' : 'bg-neutral-800/90 text-neutral-400'
                  }`}
                  title="Airplane Mode"
                >
                  <Plane className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCellularEnabled(!cellularEnabled);
                    soundManager.playKeyClick();
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    cellularEnabled ? 'bg-emerald-500 text-white' : 'bg-neutral-800/90 text-neutral-400'
                  }`}
                  title="Cellular Data"
                >
                  <Radio className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setWifiEnabled(!wifiEnabled);
                    soundManager.playKeyClick();
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    wifiEnabled ? 'bg-blue-500 text-white' : 'bg-neutral-800/90 text-neutral-400'
                  }`}
                  title="Wi-Fi"
                >
                  <Wifi className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setBluetoothEnabled(!bluetoothEnabled);
                    soundManager.playKeyClick();
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    bluetoothEnabled ? 'bg-blue-600 text-white' : 'bg-neutral-800/90 text-neutral-400'
                  }`}
                  title="Bluetooth"
                >
                  <Bluetooth className="w-5 h-5" />
                </button>
              </div>

              {/* Media Pod */}
              <div className="p-3.5 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Now Playing</div>
                  <h5 className="text-xs font-semibold text-white truncate mt-1">
                    {currentTrack?.title || 'Silicon Dreams'}
                  </h5>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {currentTrack?.artist || 'CodeX Beats'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      onOpenApp('music');
                      onClose();
                    }}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    Open Music
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onToggleMusic}
                      className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center active:scale-95"
                    >
                      {isPlayingMusic ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                    </button>
                    <button
                      onClick={onNextTrack}
                      className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center active:scale-95"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Sliders & Quick Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Left Column: Sliders for Brightness & Volume */}
              <div className="grid grid-cols-2 gap-2.5 h-36">
                {/* Brightness Slider */}
                <div className="relative rounded-3xl bg-neutral-900/80 border border-white/10 overflow-hidden flex flex-col justify-end p-2.5">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-white/90 transition-all duration-75"
                    style={{ height: `${brightness}%` }}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-between h-full pointer-events-none">
                    <Sun className={`w-5 h-5 ${brightness > 50 ? 'text-neutral-900' : 'text-neutral-300'}`} />
                    <span className={`text-[10px] font-semibold ${brightness > 25 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {brightness}%
                    </span>
                  </div>
                  {/* Invisible range control for drag */}
                  <input
                    type="range"
                    min="15"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                  />
                </div>

                {/* Volume Slider */}
                <div className="relative rounded-3xl bg-neutral-900/80 border border-white/10 overflow-hidden flex flex-col justify-end p-2.5">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-white/90 transition-all duration-75"
                    style={{ height: `${volume}%` }}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-between h-full pointer-events-none">
                    <Volume2 className={`w-5 h-5 ${volume > 50 ? 'text-neutral-900' : 'text-neutral-300'}`} />
                    <span className={`text-[10px] font-semibold ${volume > 25 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {volume}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                  />
                </div>
              </div>

              {/* Right Column: 2x2 Action Tiles */}
              <div className="grid grid-cols-2 gap-2.5 h-36">
                <button
                  onClick={() => {
                    setIsFlashlightOn(!isFlashlightOn);
                    soundManager.playKeyClick();
                  }}
                  className={`rounded-3xl flex flex-col items-center justify-center p-3 border transition-all active:scale-95 ${
                    isFlashlightOn
                      ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg shadow-amber-500/20'
                      : 'bg-neutral-900/80 text-white border-white/10'
                  }`}
                >
                  <Flashlight className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Torch</span>
                </button>

                <button
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    soundManager.playKeyClick();
                  }}
                  className={`rounded-3xl flex flex-col items-center justify-center p-3 border transition-all active:scale-95 ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-neutral-900/80 text-white border-white/10'
                  }`}
                >
                  <Moon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Dark Mode</span>
                </button>

                <button
                  onClick={toggleSound}
                  className={`rounded-3xl flex flex-col items-center justify-center p-3 border transition-all active:scale-95 ${
                    isSoundMuted
                      ? 'bg-rose-500/80 text-white border-rose-400'
                      : 'bg-neutral-900/80 text-white border-white/10'
                  }`}
                >
                  {isSoundMuted ? <VolumeX className="w-5 h-5 mb-1" /> : <Volume2 className="w-5 h-5 mb-1" />}
                  <span className="text-[10px] font-medium">{isSoundMuted ? 'Muted' : 'Haptics'}</span>
                </button>

                <button
                  onClick={() => {
                    setLowPowerMode(!lowPowerMode);
                    soundManager.playKeyClick();
                  }}
                  className={`rounded-3xl flex flex-col items-center justify-center p-3 border transition-all active:scale-95 ${
                    lowPowerMode
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-900/80 text-white border-white/10'
                  }`}
                >
                  <Battery className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Low Power</span>
                </button>
              </div>
            </div>

            {/* Row 3: App Shortcuts Bar */}
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              <button
                onClick={() => {
                  onOpenApp('calculator');
                  onClose();
                }}
                className="h-16 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors active:scale-95"
              >
                <Calculator className="w-5 h-5 text-neutral-300 mb-0.5" />
                <span className="text-[9px] text-neutral-400">Calc</span>
              </button>

              <button
                onClick={() => {
                  onOpenApp('camera');
                  onClose();
                }}
                className="h-16 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors active:scale-95"
              >
                <Camera className="w-5 h-5 text-neutral-300 mb-0.5" />
                <span className="text-[9px] text-neutral-400">Camera</span>
              </button>

              <button
                onClick={() => {
                  onOpenApp('codex');
                  onClose();
                }}
                className="h-16 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors active:scale-95"
              >
                <Cpu className="w-5 h-5 text-cyan-400 mb-0.5" />
                <span className="text-[9px] text-neutral-400">CodeX</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playUnlockSound();
                  onClose();
                }}
                className="h-16 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors active:scale-95"
              >
                <RotateCcw className="w-5 h-5 text-neutral-300 mb-0.5" />
                <span className="text-[9px] text-neutral-400">Lock</span>
              </button>
            </div>

            {/* Row 4: Apple Intelligence & Media Capture */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => {
                  if (onTriggerIntelligence) onTriggerIntelligence();
                  onClose();
                }}
                className="h-14 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-indigo-900/60 border border-purple-500/30 flex items-center justify-center gap-2 hover:from-purple-800/70 hover:to-indigo-800/70 transition-all active:scale-95 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-semibold text-purple-200">Intelligence</span>
              </button>

              <button
                onClick={() => {
                  if (onToggleScreenRecording) onToggleScreenRecording();
                  onClose();
                }}
                className={`h-14 rounded-2xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isScreenRecording
                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                    : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isScreenRecording ? 'bg-white' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-semibold">{isScreenRecording ? 'Recording' : 'Record'}</span>
              </button>

              <button
                onClick={() => {
                  if (onTakeScreenshot) onTakeScreenshot();
                  onClose();
                }}
                className="h-14 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-center justify-center gap-2 hover:bg-neutral-800 text-neutral-300 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-semibold text-neutral-200">Snapshot</span>
              </button>
            </div>
          </div>

          {/* Swipe indicator at bottom */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-24 h-1 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
