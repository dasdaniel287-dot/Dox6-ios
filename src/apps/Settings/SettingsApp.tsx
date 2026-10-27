import React, { useState } from 'react';
import {
  ChevronRight,
  User,
  Image as ImageIcon,
  Moon,
  Volume2,
  Smartphone,
  Info,
  Shield,
  Wifi,
  Bluetooth,
  Bell,
  Palette,
  Check,
} from 'lucide-react';
import { WALLPAPERS } from '../../data/initialData';
import { ActionButtonAction, DeviceColor, DeviceModel } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface SettingsAppProps {
  currentWallpaperId: string;
  onSelectWallpaper: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  deviceModel: DeviceModel;
  setDeviceModel: (model: DeviceModel) => void;
  deviceColor: DeviceColor;
  setDeviceColor: (color: DeviceColor) => void;
  isSoundMuted: boolean;
  setIsSoundMuted: (val: boolean) => void;
  actionButtonAction?: ActionButtonAction;
  setActionButtonAction?: (action: ActionButtonAction) => void;
  onClose: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentWallpaperId,
  onSelectWallpaper,
  isDarkMode,
  setIsDarkMode,
  deviceModel,
  setDeviceModel,
  deviceColor,
  setDeviceColor,
  isSoundMuted,
  setIsSoundMuted,
  actionButtonAction = 'intelligence',
  setActionButtonAction,
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'wallpaper' | 'about' | 'hardware' | 'action-button'>('main');

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {activeSection === 'main' ? 'Settings' : activeSection === 'wallpaper' ? 'Wallpaper' : activeSection === 'hardware' ? 'Device & Frame' : 'About CodeX1513'}
        </h2>
        {activeSection !== 'main' && (
          <button
            onClick={() => {
              setActiveSection('main');
              soundManager.playKeyClick();
            }}
            className="text-xs text-blue-400 hover:underline"
          >
            Settings
          </button>
        )}
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {activeSection === 'main' && (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Apple ID / Developer Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                DD
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">Daniel Das</h4>
                <p className="text-xs text-neutral-400 truncate">dasdaniel287@gmail.com</p>
                <span className="text-[10px] text-blue-400">Apple Developer Program</span>
              </div>
            </div>

            {/* General Settings Group */}
            <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden divide-y divide-white/5 text-xs">
              {/* Wallpaper */}
              <div
                onClick={() => {
                  setActiveSection('wallpaper');
                  soundManager.playKeyClick();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">Wallpaper</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="text-[11px] capitalize">
                    {WALLPAPERS.find((w) => w.id === currentWallpaperId)?.name || 'Titanium'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Hardware & Device Frame */}
              <div
                onClick={() => {
                  setActiveSection('hardware');
                  soundManager.playKeyClick();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-700 flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">Device & Frame</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="text-[11px]">iPhone 16 Pro</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Action Button */}
              <div
                onClick={() => {
                  setActiveSection('action-button');
                  soundManager.playKeyClick();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">Action Button</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="text-[11px] capitalize">{actionButtonAction.replace('-', ' ')}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">Dark Appearance</span>
                </div>
                <button
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    soundManager.playKeyClick();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    isDarkMode ? 'bg-blue-600' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Sounds & Haptics Toggle */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">System Haptics & Audio</span>
                </div>
                <button
                  onClick={() => {
                    const next = !isSoundMuted;
                    setIsSoundMuted(next);
                    soundManager.setSoundEnabled(!next);
                    if (!next) soundManager.playKeyClick();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    !isSoundMuted ? 'bg-blue-600' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      !isSoundMuted ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* About CodeX1513 */}
            <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden divide-y divide-white/5 text-xs">
              <div
                onClick={() => {
                  setActiveSection('about');
                  soundManager.playKeyClick();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-600 flex items-center justify-center text-white">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">About</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="text-[11px]">iOS 18.2</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: WALLPAPER PICKER */}
        {activeSection === 'wallpaper' && (
          <div className="space-y-4 max-w-xl mx-auto">
            <p className="text-xs text-neutral-400">
              Select an official iOS 18 dynamic wallpaper:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.id}
                  onClick={() => {
                    onSelectWallpaper(wp.id);
                    soundManager.playKeyClick();
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-40 relative overflow-hidden group ${
                    currentWallpaperId === wp.id
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ background: wp.bgStyle }}
                >
                  {currentWallpaperId === wp.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div />
                  <div className="p-2 rounded-xl bg-black/50 backdrop-blur-md">
                    <span className="text-xs font-semibold text-white block">
                      {wp.name}
                    </span>
                    <span className="text-[10px] text-neutral-300">iOS 18 Dynamic</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: DEVICE & FRAME */}
        {activeSection === 'hardware' && (
          <div className="space-y-4 max-w-xl mx-auto text-xs">
            <div className="rounded-2xl bg-neutral-900 border border-white/10 p-4 space-y-3">
              <span className="font-semibold text-white block">Device Chassis</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'iphone-16-pro', label: 'iPhone 16 Pro (6.3")' },
                  { id: 'iphone-16-promax', label: 'iPhone 16 Pro Max (6.9")' },
                  { id: 'ipad-pro', label: 'iPad Pro (11" M4)' },
                  { id: 'responsive', label: 'Responsive / Fullscreen' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDeviceModel(item.id as DeviceModel);
                      soundManager.playKeyClick();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deviceModel === item.id
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                        : 'bg-neutral-800/80 border-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-900 border border-white/10 p-4 space-y-3">
              <span className="font-semibold text-white block">Titanium Finish</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'natural-titanium', label: 'Natural Titanium', color: '#c5beb4' },
                  { id: 'black-titanium', label: 'Black Titanium', color: '#2e2c2f' },
                  { id: 'desert-titanium', label: 'Desert Titanium', color: '#d4a373' },
                  { id: 'white-titanium', label: 'White Titanium', color: '#eae6e1' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDeviceColor(item.id as DeviceColor);
                      soundManager.playKeyClick();
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                      deviceColor === item.id
                        ? 'bg-white/10 border-white/30 text-white font-medium'
                        : 'bg-neutral-800/80 border-white/5 text-neutral-300'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ACTION BUTTON */}
        {activeSection === 'action-button' && (
          <div className="space-y-4 max-w-xl mx-auto text-xs">
            <p className="text-xs text-neutral-400">
              Customize what pressing the physical Titanium Action Button activates:
            </p>
            <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden divide-y divide-white/5">
              {[
                { id: 'intelligence', label: 'Dox6 Intelligence', desc: 'Trigger edge-glowing Siri voice and AI model' },
                { id: 'flashlight', label: 'Flashlight / Torch', desc: 'Toggle hardware LED flash on or off' },
                { id: 'codex-run', label: 'Build & Run CodeX Target', desc: 'Trigger LLVM compilation pipeline in Simulator' },
                { id: 'camera', label: 'Camera Snapshot', desc: 'Launch camera view and capture instantly' },
                { id: 'voice-memo', label: 'Voice Memo Recorder', desc: 'Start live audio memo recording' },
                { id: 'mute', label: 'Silent Mode', desc: 'Mute or unmute all system audio haptics' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (setActionButtonAction) setActionButtonAction(item.id as ActionButtonAction);
                    soundManager.playKeyClick();
                  }}
                  className="p-3.5 flex items-center justify-between hover:bg-neutral-800/60 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-white font-medium">{item.label}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</p>
                  </div>
                  {actionButtonAction === item.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: ABOUT */}
        {activeSection === 'about' && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden divide-y divide-white/5 text-xs">
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Operating System</span>
                <span className="text-white font-bold text-sm">Dox6 iOS</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Build Number</span>
                <span className="text-purple-400 font-mono">Dox6 18.2 (22C152-DOX6)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Device Hardware</span>
                <span className="text-white font-medium">iPhone 16 Pro (Dox6 Edition)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Processor Chip</span>
                <span className="text-white font-medium">Apple A18 Pro (3nm TSMC N3E)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">RAM / Unified Memory</span>
                <span className="text-white font-medium">8 GB LPDDR5X (60 GB/s)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Storage Capacity</span>
                <span className="text-white font-medium">256 GB (184 GB free)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Kernel Subsystem</span>
                <span className="text-cyan-400 font-mono">Darwin 24.2.0-dox6 (arm64)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Swift Toolchain</span>
                <span className="text-emerald-400 font-mono">Swift 6.2 · LLVM 18</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
