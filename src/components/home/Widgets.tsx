import React, { useState, useEffect } from 'react';
import { Sun, Play, Cpu, Sparkles, HeartPulse, BatteryCharging, Headphones, Watch } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WidgetProps {
  onOpenApp: (appId: string) => void;
  onQuickRunCodeX?: () => void;
}

export const ClockWidget: React.FC<WidgetProps> = ({ onOpenApp }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSeconds(now.getSeconds());
      setMinutes(now.getMinutes());
      setHours(now.getHours() % 12);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div
      onClick={() => {
        soundManager.playKeyClick();
        onOpenApp('settings');
      }}
      className="relative w-full h-[152px] rounded-3xl bg-neutral-900/85 backdrop-blur-2xl border border-white/10 p-3.5 flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all group overflow-hidden"
    >
      <div className="flex items-center justify-between text-neutral-300">
        <span className="text-[11px] font-semibold tracking-tight uppercase">Cupertino</span>
        <span className="text-[10px] text-neutral-500 font-mono">PST</span>
      </div>

      {/* Clock Face */}
      <div className="relative w-20 h-20 mx-auto rounded-full border-2 border-white/20 bg-neutral-950 flex items-center justify-center">
        {/* Hour Hand */}
        <div
          className="absolute w-1 bg-white rounded-full origin-bottom"
          style={{
            height: '22px',
            top: '18px',
            transform: `rotate(${hourDeg}deg)`,
          }}
        />
        {/* Minute Hand */}
        <div
          className="absolute w-0.5 bg-neutral-300 rounded-full origin-bottom"
          style={{
            height: '28px',
            top: '12px',
            transform: `rotate(${minDeg}deg)`,
          }}
        />
        {/* Second Hand (Orange) */}
        <div
          className="absolute w-[1px] bg-orange-500 rounded-full origin-bottom"
          style={{
            height: '32px',
            top: '8px',
            transform: `rotate(${secDeg}deg)`,
          }}
        />
        {/* Center Pivot */}
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 z-10" />
      </div>

      <div className="text-center text-[11px] font-semibold text-white">
        {hours === 0 ? 12 : hours}:{minutes < 10 ? `0${minutes}` : minutes}
      </div>
    </div>
  );
};

export const WeatherWidget: React.FC<WidgetProps> = ({ onOpenApp }) => {
  return (
    <div
      onClick={() => {
        soundManager.playKeyClick();
        onOpenApp('weather');
      }}
      className="relative w-full h-[152px] rounded-3xl bg-gradient-to-br from-blue-600/90 via-sky-600/80 to-indigo-700/80 backdrop-blur-2xl border border-white/20 p-3.5 flex flex-col justify-between text-white cursor-pointer hover:scale-[1.02] active:scale-98 transition-all group"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-tight">Cupertino</span>
          <Sun className="w-5 h-5 text-amber-300 fill-amber-300" />
        </div>
        <div className="text-3xl font-light tracking-tight mt-1">72°</div>
      </div>

      <div>
        <div className="text-[11px] font-medium text-white/90">Sunny & Clear</div>
        <div className="text-[10px] text-white/70">H: 78° · L: 54° · AQI 32</div>
      </div>
    </div>
  );
};

export const CodeXQuickLauncherWidget: React.FC<WidgetProps> = ({ onOpenApp, onQuickRunCodeX }) => {
  return (
    <div
      onClick={() => {
        soundManager.playKeyClick();
        onOpenApp('codex');
      }}
      className="relative w-full rounded-3xl bg-neutral-900/90 backdrop-blur-2xl border border-white/10 p-3.5 flex flex-col justify-between text-white cursor-pointer hover:border-cyan-500/40 transition-all group overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Cpu className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold tracking-tight">Dox6 18.2 Pro</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
          ARM64
        </span>
      </div>

      <div className="my-2 py-1.5 px-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-neutral-400">Target project:</div>
          <div className="text-xs font-semibold text-white truncate">WeatherPro SwiftUI</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickRunCodeX) {
              onQuickRunCodeX();
            } else {
              onOpenApp('codex');
            }
          }}
          className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
          title="Run in Simulator"
        >
          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <Sparkles className="w-3 h-3" /> Ready to Build
        </span>
        <span>Swift 6.2</span>
      </div>
    </div>
  );
};

export const ActivityRingsWidget: React.FC<WidgetProps> = ({ onOpenApp }) => {
  return (
    <div
      onClick={() => {
        soundManager.playKeyClick();
        onOpenApp('health');
      }}
      className="relative w-full h-[152px] rounded-3xl bg-neutral-900/85 backdrop-blur-2xl border border-white/10 p-3.5 flex flex-col justify-between text-white cursor-pointer hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-tight">Activity</span>
        <HeartPulse className="w-4 h-4 text-rose-500" />
      </div>

      {/* Activity Rings visualization */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Move Ring (Red) */}
          <circle cx="50" cy="50" r="40" stroke="#331414" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#ef4444"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset="38"
            fill="none"
          />

          {/* Exercise Ring (Green) */}
          <circle cx="50" cy="50" r="30" stroke="#14331e" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="188.4"
            strokeDashoffset="48"
            fill="none"
          />

          {/* Stand Ring (Cyan) */}
          <circle cx="50" cy="50" r="20" stroke="#0e2a33" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#06b6d4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset="12"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[9px] text-neutral-400 font-semibold uppercase">
        <span className="text-rose-400">540 CAL</span>
        <span className="text-emerald-400">22 MIN</span>
        <span className="text-cyan-400">11 HRS</span>
      </div>
    </div>
  );
};

export const BatteryStatusWidget: React.FC<WidgetProps> = () => {
  return (
    <div className="w-full rounded-3xl bg-neutral-900/85 backdrop-blur-2xl border border-white/10 p-3.5 text-white space-y-2.5">
      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Batteries</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span className="text-xs">iPhone 16 Pro</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">98%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-white/80" />
            <span className="text-xs">AirPods Pro</span>
          </div>
          <span className="text-xs font-semibold text-white/80">92%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Watch className="w-4 h-4 text-white/80" />
            <span className="text-xs">Apple Watch Ultra</span>
          </div>
          <span className="text-xs font-semibold text-white/80">84%</span>
        </div>
      </div>
    </div>
  );
};
