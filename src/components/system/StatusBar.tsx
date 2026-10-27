import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { DynamicIsland } from './DynamicIsland';
import { DynamicIslandState, MusicTrack } from '../../types/ios';

interface StatusBarProps {
  islandState: DynamicIslandState;
  setIslandState: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
  currentTrack?: MusicTrack;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onOpenControlCenter: () => void;
  onOpenNotifications: () => void;
  batteryLevel?: number;
  isCharging?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  islandState,
  setIslandState,
  currentTrack,
  isPlayingMusic,
  onToggleMusic,
  onNextTrack,
  onOpenControlCenter,
  onOpenNotifications,
  batteryLevel = 98,
  isCharging = false,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-40 w-full pt-3 pb-1 px-7 flex items-center justify-between text-white text-[13px] font-semibold tracking-tight select-none">
      {/* Left side: Time (tap to open Notification Center) */}
      <button
        onClick={onOpenNotifications}
        className="flex items-center gap-1.5 focus:outline-none hover:opacity-80 active:scale-95 transition-all text-left z-20 py-1"
        title="Open Notification Center"
      >
        <span>{timeStr || '9:41'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" title="Location active" />
      </button>

      {/* Center: Dynamic Island */}
      <div className="absolute left-1/2 top-2.5 -translate-x-1/2 z-30">
        <DynamicIsland
          islandState={islandState}
          setIslandState={setIslandState}
          currentTrack={currentTrack}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={onToggleMusic}
          onNextTrack={onNextTrack}
        />
      </div>

      {/* Right side: Status icons (tap to open Control Center) */}
      <button
        onClick={onOpenControlCenter}
        className="flex items-center gap-2 focus:outline-none hover:opacity-80 active:scale-95 transition-all z-20 py-1"
        title="Open Control Center"
      >
        {/* Cellular Signal (4 bars) */}
        <div className="flex items-end gap-[1.5px] h-3">
          <span className="w-[3px] h-1 bg-white rounded-xs" />
          <span className="w-[3px] h-1.5 bg-white rounded-xs" />
          <span className="w-[3px] h-2.5 bg-white rounded-xs" />
          <span className="w-[3px] h-3 bg-white rounded-xs" />
        </div>

        {/* 5G Label */}
        <span className="text-[11px] font-bold tracking-tighter">5G</span>

        {/* Wi-Fi Icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery Indicator */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-6 h-3 rounded-[4px] border border-white/80 p-[1.5px] flex items-center">
            <div
              className={`h-full rounded-xs transition-all ${
                isCharging ? 'bg-emerald-400' : batteryLevel <= 20 ? 'bg-rose-500' : 'bg-white'
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
          <div className="w-[1.5px] h-1.5 bg-white/80 rounded-r-xs -ml-[1px]" />
        </div>
      </button>
    </div>
  );
};
