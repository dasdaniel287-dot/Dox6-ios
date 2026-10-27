import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Flashlight,
  Camera,
  ChevronUp,
  Bell,
  Sparkles,
  Sun,
  BatteryCharging,
  Heart,
  Delete,
} from 'lucide-react';
import { NotificationItem, ClockStyle } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  notifications: NotificationItem[];
  onOpenNotification: (appId: string) => void;
  isFlashlightOn: boolean;
  setIsFlashlightOn: React.Dispatch<React.SetStateAction<boolean>>;
  onLaunchCamera: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  notifications,
  onOpenNotification,
  isFlashlightOn,
  setIsFlashlightOn,
  onLaunchCamera,
}) => {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [clockStyle, setClockStyle] = useState<ClockStyle>('default');
  const [showKeypad, setShowKeypad] = useState(false);
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setDateStr(now.toLocaleDateString('en-US', options));
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setTimeStr(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTriggerUnlock = () => {
    setIsAuthenticating(true);
    soundManager.playUnlockSound();
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowKeypad(false);
      setPasscode('');
      onUnlock();
    }, 450);
  };

  const handleDigitPress = (digit: string) => {
    soundManager.playKeyClick();
    const next = passcode + digit;
    setPasscode(next);
    if (next.length === 4) {
      handleTriggerUnlock();
    }
  };

  const cycleClockFont = () => {
    soundManager.playKeyClick();
    const styles: ClockStyle[] = ['default', 'serif', 'mono', 'rounded'];
    const nextIdx = (styles.indexOf(clockStyle) + 1) % styles.length;
    setClockStyle(styles[nextIdx]);
  };

  const getClockFontClass = () => {
    switch (clockStyle) {
      case 'serif':
        return 'font-serif font-normal';
      case 'mono':
        return 'font-mono font-medium tracking-tight';
      case 'rounded':
        return 'font-black tracking-normal';
      default:
        return 'font-extralight tracking-tighter';
    }
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: -700, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="absolute inset-0 z-50 flex flex-col justify-between p-6 pt-14 pb-8 text-white select-none backdrop-blur-xs"
        >
          {/* Top Lock Icon & Face ID simulation */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: isAuthenticating ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-2 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={handleTriggerUnlock}
              title="Tap for Face ID Unlock"
            >
              {isAuthenticating ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-300" />
              )}
            </motion.div>

            {/* Date */}
            <span className="text-sm font-medium text-neutral-200 tracking-wide drop-shadow-md">
              {dateStr || 'Sunday, October 27'}
            </span>

            {/* Big Clock with Tap to change typography */}
            <h1
              onClick={cycleClockFont}
              className={`text-7xl ${getClockFontClass()} text-white drop-shadow-lg my-1 cursor-pointer hover:opacity-90 active:scale-98 transition-all`}
              title="Tap clock to switch typography style"
            >
              {timeStr || '9:41'}
            </h1>

            {/* Lock Screen Widgets Row (iOS 18) */}
            <div className="flex items-center gap-3 mt-1 py-1 px-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs">
              <div className="flex items-center gap-1 text-amber-300">
                <Sun className="w-3.5 h-3.5" />
                <span>72°</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>98%</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>72 BPM</span>
              </div>
            </div>

            {/* Dox6 Identity Badge */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[10px] text-neutral-300 mt-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Dox6 iOS 18.2 Pro</span>
            </div>
          </div>

          {/* Center Area: PIN Keypad or Notifications */}
          {showKeypad ? (
            <div className="max-w-xs w-full mx-auto flex flex-col items-center space-y-4 my-2">
              <span className="text-xs text-neutral-300 font-medium">Enter Passcode</span>
              {/* Passcode dots */}
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border border-white transition-all ${
                      passcode.length > idx ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              {/* Number pad */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitPress(digit)}
                    className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/40 text-xl font-light text-white flex items-center justify-center transition-all"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => setShowKeypad(false)}
                  className="w-14 h-14 rounded-full text-xs text-neutral-400 flex items-center justify-center hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDigitPress('0')}
                  className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/40 text-xl font-light text-white flex items-center justify-center transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    soundManager.playKeyClick();
                    setPasscode(passcode.slice(0, -1));
                  }}
                  className="w-14 h-14 rounded-full text-xs text-neutral-400 flex items-center justify-center hover:text-white"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-sm w-full mx-auto flex flex-col justify-center space-y-2.5 my-4 overflow-y-auto no-scrollbar">
              {notifications.length > 0 && (
                <div className="flex items-center justify-between px-2 text-[11px] text-neutral-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Notifications
                  </span>
                  <span>{notifications.length} alerts</span>
                </div>
              )}

              {notifications.slice(0, 3).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundManager.playKeyClick();
                    onOpenNotification(item.appId);
                    onUnlock();
                  }}
                  className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/55 backdrop-blur-xl border border-white/15 cursor-pointer shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-neutral-200">
                      {item.appName}
                    </span>
                    <span className="text-[10px] text-neutral-400">{item.time}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom Area: Flashlight, Camera & Swipe Up bar */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-full flex items-center justify-between px-4">
              {/* Flashlight button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlashlightOn(!isFlashlightOn);
                  soundManager.playKeyClick();
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg active:scale-90 ${
                  isFlashlightOn
                    ? 'bg-white text-black ring-4 ring-amber-400/50'
                    : 'bg-black/40 text-white hover:bg-black/60 border border-white/20'
                }`}
                title="Torch"
              >
                <Flashlight className="w-5 h-5" />
              </button>

              {/* Enter Passcode shortcut */}
              {!showKeypad && (
                <button
                  onClick={() => {
                    soundManager.playKeyClick();
                    setShowKeypad(true);
                  }}
                  className="text-[11px] text-neutral-300 hover:text-white px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10"
                >
                  Passcode
                </button>
              )}

              {/* Camera button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLaunchCamera();
                  soundManager.playCameraShutter();
                  onUnlock();
                }}
                className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl transition-all shadow-lg active:scale-90"
                title="Camera"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Tap or Swipe up to unlock prompt */}
            <motion.button
              onClick={handleTriggerUnlock}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1 focus:outline-none group cursor-pointer"
            >
              <ChevronUp className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors tracking-wide">
                Swipe up or tap to unlock
              </span>
              <div className="w-32 h-1 bg-white/70 rounded-full mt-2" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
