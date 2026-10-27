import React, { useState } from 'react';
import {
  HeartPulse,
  Flame,
  Footprints,
  Moon,
  Droplets,
  Plus,
  TrendingUp,
  Activity,
  Heart,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface HealthAppProps {
  onClose: () => void;
}

export const HealthApp: React.FC<HealthAppProps> = ({ onClose }) => {
  const [waterMl, setWaterMl] = useState(1500);
  const [heartBpm, setHeartBpm] = useState(72);
  const [steps, setSteps] = useState(8420);

  const addWater = () => {
    soundManager.playKeyClick();
    setWaterMl((w) => w + 250);
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-y-auto no-scrollbar select-none p-4">
      {/* Header */}
      <div className="pt-2 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Health</h2>
          <span className="text-[11px] text-rose-400 font-medium">VitalFit Dox6 Summary</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
          <HeartPulse className="w-4 h-4" />
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="p-4 rounded-3xl bg-neutral-900 border border-white/10 my-3 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-white">Daily Activity Rings</span>
          <span className="text-[10px] text-neutral-400">Target: 600 Cal</span>
        </div>

        {/* Concentric Rings SVG */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#331414" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="40"
              fill="none"
            />
            <circle cx="50" cy="50" r="30" stroke="#14331e" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="188.4"
              strokeDashoffset="35"
              fill="none"
            />
            <circle cx="50" cy="50" r="20" stroke="#0e2a33" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="20"
              stroke="#06b6d4"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset="15"
              fill="none"
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-rose-400 block font-semibold">MOVE</span>
            <span className="font-bold text-white">540 CAL</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 block font-semibold">EXERCISE</span>
            <span className="font-bold text-white">28 MIN</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 block font-semibold">STAND</span>
            <span className="font-bold text-white">11 HRS</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="space-y-2.5">
        {/* Steps */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">Steps Count</span>
              <span className="text-sm font-bold text-white">
                {steps.toLocaleString()} <span className="text-xs font-normal text-neutral-400">steps</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">+12% vs last week</span>
        </div>

        {/* Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">Resting Heart Rate</span>
              <span className="text-sm font-bold text-white">
                {heartBpm} <span className="text-xs font-normal text-neutral-400">BPM</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">Normal (60-100)</span>
        </div>

        {/* Sleep Tracker */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">Sleep Analysis</span>
              <span className="text-sm font-bold text-white">
                7 hr 45 min <span className="text-xs font-normal text-indigo-400">(Core & Deep)</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-indigo-300 font-semibold">92% Quality</span>
        </div>

        {/* Water Intake with interactive Logger */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">Hydration</span>
              <span className="text-sm font-bold text-white">
                {waterMl} / 2500 <span className="text-xs font-normal text-neutral-400">mL</span>
              </span>
            </div>
          </div>
          <button
            onClick={addWater}
            className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> +250ml
          </button>
        </div>
      </div>
    </div>
  );
};
