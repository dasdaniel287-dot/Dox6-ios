/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Tablet,
  Maximize2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Flashlight,
  Cpu,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Camera,
  Share2,
} from 'lucide-react';

import {
  DEFAULT_APPS,
  INITIAL_NOTIFICATIONS,
  MUSIC_PLAYLIST,
  SAMPLE_PHOTOS,
  WALLPAPERS,
} from './data/initialData';
import {
  ActionButtonAction,
  AppIconConfig,
  DeviceColor,
  DeviceModel,
  DynamicIslandState,
  MusicTrack,
  NotificationItem,
  PhotoItem,
} from './types/ios';
import { soundManager } from './utils/audio';

import { DeviceFrame } from './components/hardware/DeviceFrame';
import { StatusBar } from './components/system/StatusBar';
import { ControlCenter } from './components/system/ControlCenter';
import { NotificationCenter } from './components/system/NotificationCenter';
import { LockScreen } from './components/system/LockScreen';
import { AppSwitcher } from './components/system/AppSwitcher';
import { HomeScreen } from './components/home/HomeScreen';
import { AppleIntelligence } from './components/system/AppleIntelligence';

// Native Apps
import { CodeXStudioApp } from './apps/CodeXStudio/CodeXStudioApp';
import { SafariApp } from './apps/Safari/SafariApp';
import { CalculatorApp } from './apps/Calculator/CalculatorApp';
import { NotesApp } from './apps/Notes/NotesApp';
import { MusicApp } from './apps/Music/MusicApp';
import { CameraApp } from './apps/Camera/CameraApp';
import { PhotosApp } from './apps/Photos/PhotosApp';
import { TerminalApp } from './apps/Terminal/TerminalApp';
import { SettingsApp } from './apps/Settings/SettingsApp';
import { AppStoreApp } from './apps/AppStore/AppStoreApp';
import { MessagesApp } from './apps/Messages/MessagesApp';
import { FilesApp } from './apps/Files/FilesApp';
import { MapsApp } from './apps/Maps/MapsApp';
import { SideloadApp } from './apps/Sideload/SideloadApp';
import { WeatherApp } from './apps/Weather/WeatherApp';
import { HealthApp } from './apps/Health/HealthApp';
import { VoiceMemosApp } from './apps/VoiceMemos/VoiceMemosApp';
import { ClockApp } from './apps/Clock/ClockApp';
import { PhoneApp } from './apps/Phone/PhoneApp';
import { RemindersApp } from './apps/Reminders/RemindersApp';
import { MailApp } from './apps/Mail/MailApp';
import { StocksApp } from './apps/Stocks/StocksApp';
import { WalletApp } from './apps/Wallet/WalletApp';
import { FaceTimeApp } from './apps/FaceTime/FaceTimeApp';
import { PodcastsApp } from './apps/Podcasts/PodcastsApp';

export default function App() {
  // Device & System Settings
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone-16-pro');
  const [deviceColor, setDeviceColor] = useState<DeviceColor>('natural-titanium');
  const [currentWallpaperId, setCurrentWallpaperId] = useState<string>('dox6-obsidian');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [actionButtonAction, setActionButtonAction] = useState<ActionButtonAction>('intelligence');

  // System Controls
  const [brightness, setBrightness] = useState<number>(85);
  const [volume, setVolume] = useState<number>(75);
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState<boolean>(false);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState<boolean>(false);
  const [isScreenRecording, setIsScreenRecording] = useState<boolean>(false);
  const [screenshotFlash, setScreenshotFlash] = useState<boolean>(false);

  // App & Window State
  const [apps, setApps] = useState<AppIconConfig[]>(DEFAULT_APPS);
  const [activeAppId, setActiveAppId] = useState<string | null>('codex'); // Start inside CodeX Studio for immediate developer focus
  const [openAppIds, setOpenAppIds] = useState<string[]>([
    'codex',
    'terminal',
    'safari',
    'messages',
    'files',
    'maps',
  ]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [photos, setPhotos] = useState<PhotoItem[]>(SAMPLE_PHOTOS);

  // Music & Media State
  const [playlist, setPlaylist] = useState<MusicTrack[]>(MUSIC_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Dynamic Island State
  const [islandState, setIslandState] = useState<DynamicIslandState>({
    mode: 'compact',
    activity: 'idle',
  });

  const currentTrack = playlist[currentTrackIndex];
  const activeWallpaper = WALLPAPERS.find((w) => w.id === currentWallpaperId) || WALLPAPERS[0];

  // Music actions
  const handleToggleMusic = () => {
    const nextState = !isPlayingMusic;
    setIsPlayingMusic(nextState);
    if (nextState) {
      setIslandState({
        mode: 'compact',
        activity: 'music',
        title: currentTrack.title,
        subtitle: currentTrack.artist,
      });
    } else {
      setIslandState((prev) => (prev.activity === 'music' ? { ...prev, activity: 'idle' } : prev));
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    if (isPlayingMusic) {
      setIslandState({
        mode: 'compact',
        activity: 'music',
        title: playlist[(currentTrackIndex + 1) % playlist.length].title,
        subtitle: playlist[(currentTrackIndex + 1) % playlist.length].artist,
      });
    }
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // App Lifecycle
  const handleOpenApp = (appId: string) => {
    setActiveAppId(appId);
    if (!openAppIds.includes(appId)) {
      setOpenAppIds((prev) => [...prev, appId]);
    }
    setIsControlCenterOpen(false);
    setIsNotificationCenterOpen(false);
    setIsAppSwitcherOpen(false);
    setIsIntelligenceOpen(false);
  };

  const handleCloseActiveApp = () => {
    soundManager.playKeyClick();
    setActiveAppId(null);
  };

  const handleKillApp = (appId: string) => {
    setOpenAppIds((prev) => prev.filter((id) => id !== appId));
    if (activeAppId === appId) {
      setActiveAppId(null);
    }
  };

  // Hardware button behaviors
  const handlePowerButton = () => {
    const next = !isLocked;
    setIsLocked(next);
    if (next) {
      soundManager.playLockSound();
      setActiveAppId(null);
      setIsIntelligenceOpen(false);
    } else {
      soundManager.playUnlockSound();
    }
  };

  const handleActionButton = () => {
    soundManager.playKeyClick();
    if (actionButtonAction === 'intelligence') {
      soundManager.playSiriChime();
      setIsIntelligenceOpen(!isIntelligenceOpen);
    } else if (actionButtonAction === 'flashlight') {
      setIsFlashlightOn(!isFlashlightOn);
    } else if (actionButtonAction === 'codex-run') {
      handleQuickRunCodeX();
    } else if (actionButtonAction === 'camera') {
      handleOpenApp('camera');
      soundManager.playCameraShutter();
    } else if (actionButtonAction === 'voice-memo') {
      handleOpenApp('voicememos');
    } else if (actionButtonAction === 'mute') {
      const next = !isSoundMuted;
      setIsSoundMuted(next);
      soundManager.setSoundEnabled(!next);
    }
  };

  const handleVolumeUp = () => {
    setVolume((v) => Math.min(100, v + 10));
  };

  const handleVolumeDown = () => {
    setVolume((v) => Math.max(0, v - 10));
  };

  // Quick run shortcut
  const handleQuickRunCodeX = () => {
    handleOpenApp('codex');
    setIslandState({
      mode: 'compact',
      activity: 'building',
      title: 'CodeX1513 Build',
      subtitle: 'Compiling SwiftUI...',
    });
    soundManager.playBuildSuccess();
    setTimeout(() => {
      setIslandState((prev) => ({ ...prev, activity: 'idle' }));
    }, 2000);
  };

  // Screenshot Action
  const handleTakeScreenshot = () => {
    soundManager.playCameraShutter();
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 140);

    const newShot: PhotoItem = {
      id: `screenshot-${Date.now()}`,
      title: `Screenshot_${new Date().toISOString().slice(0, 10)}.png`,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      takenAt: 'Just now',
      filter: 'none',
    };
    setPhotos([newShot, ...photos]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      appId: 'photos',
      appName: 'Photos',
      title: 'Screenshot Saved',
      message: 'Tap to view the captured screen in your camera roll.',
      time: 'Just now',
      unread: true,
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Screen Recording Action
  const handleToggleScreenRecording = () => {
    const next = !isScreenRecording;
    setIsScreenRecording(next);
    soundManager.playKeyClick();

    if (next) {
      setIslandState({
        mode: 'compact',
        activity: 'recording',
        title: 'Screen Recording',
        subtitle: 'Capturing Display',
      });
      soundManager.playBuildSuccess();
    } else {
      setIslandState((prev) => ({ ...prev, activity: 'idle' }));
      handleTakeScreenshot();
    }
  };

  // AirDrop Action
  const handleAirDrop = () => {
    soundManager.playAirDropSend();
    setIslandState({
      mode: 'compact',
      activity: 'airdrop',
      title: 'AirDrop Sending',
      subtitle: "Daniel's MacBook Pro M4",
    });
    setTimeout(() => {
      soundManager.playBuildSuccess();
      setIslandState((prev) => ({ ...prev, activity: 'idle' }));
    }, 2400);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        handleQuickRunCodeX();
      }
      if (e.key === 'Escape') {
        if (isIntelligenceOpen) setIsIntelligenceOpen(false);
        else if (isControlCenterOpen) setIsControlCenterOpen(false);
        else if (isNotificationCenterOpen) setIsNotificationCenterOpen(false);
        else if (isAppSwitcherOpen) setIsAppSwitcherOpen(false);
        else if (activeAppId) handleCloseActiveApp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntelligenceOpen, isControlCenterOpen, isNotificationCenterOpen, isAppSwitcherOpen, activeAppId]);

  return (
    <div className="w-screen h-screen bg-[#09090b] text-neutral-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Desktop Navigation & Controls Bar */}
      <header className="h-14 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-50 shrink-0">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Dox6 iOS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30 font-semibold">
                Dox6 18.2 Pro
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              Next-Gen iOS & Swift Operating System Simulation
            </p>
          </div>
        </div>

        {/* Center: Device Model Segmented Controls */}
        <div className="hidden md:flex items-center bg-neutral-800/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              setDeviceModel('iphone-16-pro');
              soundManager.playKeyClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              deviceModel === 'iphone-16-pro'
                ? 'bg-neutral-700 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 16 Pro</span>
          </button>
          <button
            onClick={() => {
              setDeviceModel('iphone-16-promax');
              soundManager.playKeyClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              deviceModel === 'iphone-16-promax'
                ? 'bg-neutral-700 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Pro Max</span>
          </button>
          <button
            onClick={() => {
              setDeviceModel('ipad-pro');
              soundManager.playKeyClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              deviceModel === 'ipad-pro'
                ? 'bg-neutral-700 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad Pro</span>
          </button>
          <button
            onClick={() => {
              setDeviceModel('responsive');
              soundManager.playKeyClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              deviceModel === 'responsive'
                ? 'bg-neutral-700 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Responsive</span>
          </button>
        </div>

        {/* Right Quick Actions Bar */}
        <div className="flex items-center gap-2">
          {/* Dox6 Intelligence Quick Launch */}
          <button
            onClick={() => {
              soundManager.playSiriChime();
              setIsIntelligenceOpen(!isIntelligenceOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 border border-purple-500/30 text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Invoke Dox6 Intelligence (Edge-Glow)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Dox6 Intelligence</span>
          </button>

          {/* Quick Lock / Unlock */}
          <button
            onClick={handlePowerButton}
            className={`p-2 rounded-xl border transition-colors ${
              isLocked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-white/10'
            }`}
            title={isLocked ? 'Unlock Screen' : 'Lock Screen (Space)'}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Quick CodeX Run */}
          <button
            onClick={handleQuickRunCodeX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            title="Compile & Run in Simulator (⌘R)"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Build & Run</span>
          </button>

          {/* Haptics & Sound Toggle */}
          <button
            onClick={() => {
              const next = !isSoundMuted;
              setIsSoundMuted(next);
              soundManager.setSoundEnabled(!next);
              if (!next) soundManager.playKeyClick();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              !isSoundMuted
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-white/10'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
            title={isSoundMuted ? 'Unmute Audio' : 'Mute System Sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 relative flex items-center justify-center p-2 overflow-y-auto no-scrollbar">
        <DeviceFrame
          deviceModel={deviceModel}
          deviceColor={deviceColor}
          isFlashlightOn={isFlashlightOn}
          onPowerButton={handlePowerButton}
          onActionButton={handleActionButton}
          onVolumeUp={handleVolumeUp}
          onVolumeDown={handleVolumeDown}
          onHomeSwipe={handleCloseActiveApp}
          onAppSwitcher={() => {
            soundManager.playKeyClick();
            setIsAppSwitcherOpen(true);
          }}
        >
          {/* Screenshot White Flash animation */}
          {screenshotFlash && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150 pointer-events-none" />
          )}

          {/* Wallpaper Layer */}
          <div
            className="absolute inset-0 transition-all duration-500 bg-cover bg-center"
            style={{
              background: activeWallpaper.bgStyle,
              filter: `brightness(${brightness}%)`,
            }}
          />

          {/* System Status Bar & Dynamic Island */}
          <StatusBar
            islandState={islandState}
            setIslandState={setIslandState}
            currentTrack={currentTrack}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            onNextTrack={handleNextTrack}
            onOpenControlCenter={() => {
              soundManager.playKeyClick();
              setIsControlCenterOpen(true);
            }}
            onOpenNotifications={() => {
              soundManager.playKeyClick();
              setIsNotificationCenterOpen(true);
            }}
          />

          {/* Active Screen Body (App or Home Screen) */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col justify-between">
            {activeAppId === 'codex' ? (
              <CodeXStudioApp
                onClose={handleCloseActiveApp}
                setIslandState={setIslandState}
              />
            ) : activeAppId === 'safari' ? (
              <SafariApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'calculator' ? (
              <CalculatorApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'notes' ? (
              <NotesApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'music' ? (
              <MusicApp
                currentTrack={currentTrack}
                isPlayingMusic={isPlayingMusic}
                onToggleMusic={handleToggleMusic}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
                playlist={playlist}
                onSelectTrack={(track) => {
                  const idx = playlist.findIndex((t) => t.id === track.id);
                  if (idx !== -1) setCurrentTrackIndex(idx);
                }}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'camera' ? (
              <CameraApp
                onCapturePhoto={(newPhoto) => setPhotos([newPhoto, ...photos])}
                onOpenPhotos={() => handleOpenApp('photos')}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'photos' ? (
              <PhotosApp
                photos={photos}
                onDeletePhoto={(id) => setPhotos(photos.filter((p) => p.id !== id))}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'terminal' ? (
              <TerminalApp
                onClose={handleCloseActiveApp}
                onQuickRunCodeX={handleQuickRunCodeX}
              />
            ) : activeAppId === 'settings' ? (
              <SettingsApp
                currentWallpaperId={currentWallpaperId}
                onSelectWallpaper={setCurrentWallpaperId}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                deviceModel={deviceModel}
                setDeviceModel={setDeviceModel}
                deviceColor={deviceColor}
                setDeviceColor={setDeviceColor}
                isSoundMuted={isSoundMuted}
                setIsSoundMuted={setIsSoundMuted}
                actionButtonAction={actionButtonAction}
                setActionButtonAction={setActionButtonAction}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'appstore' ? (
              <AppStoreApp
                installedApps={apps}
                onInstallApp={(newApp) => setApps([...apps, newApp])}
                onUninstallApp={(appId) => setApps(apps.filter((a) => a.id !== appId))}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'sideload' ? (
              <SideloadApp
                onInstallApp={(newApp) => setApps([...apps, newApp])}
                installedApps={apps}
                onClose={handleCloseActiveApp}
              />
            ) : activeAppId === 'phone' ? (
              <PhoneApp
                onClose={handleCloseActiveApp}
                setIslandState={setIslandState}
              />
            ) : activeAppId === 'clock' ? (
              <ClockApp
                onClose={handleCloseActiveApp}
                setIslandState={setIslandState}
              />
            ) : activeAppId === 'reminders' ? (
              <RemindersApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'weather' ? (
              <WeatherApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'health' ? (
              <HealthApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'voicememos' ? (
              <VoiceMemosApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'messages' ? (
              <MessagesApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'files' ? (
              <FilesApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'maps' ? (
              <MapsApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'mail' ? (
              <MailApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'stocks' ? (
              <StocksApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'wallet' ? (
              <WalletApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'facetime' ? (
              <FaceTimeApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'podcasts' ? (
              <PodcastsApp onClose={handleCloseActiveApp} />
            ) : activeAppId === 'git-lens' ? (
              <CodeXStudioApp onClose={handleCloseActiveApp} setIslandState={setIslandState} />
            ) : activeAppId === 'postman-lite' ? (
              <TerminalApp onClose={handleCloseActiveApp} onQuickRunCodeX={handleQuickRunCodeX} />
            ) : activeAppId === 'regex-lab' ? (
              <CodeXStudioApp onClose={handleCloseActiveApp} setIslandState={setIslandState} />
            ) : activeAppId === 'metal-bench' ? (
              <TerminalApp onClose={handleCloseActiveApp} onQuickRunCodeX={handleQuickRunCodeX} />
            ) : (
              <HomeScreen
                apps={apps}
                onOpenApp={handleOpenApp}
                onUninstallApp={(appId) => setApps(apps.filter((a) => a.id !== appId))}
                onQuickRunCodeX={handleQuickRunCodeX}
              />
            )}
          </div>

          {/* Apple Intelligence Edge-Glow Overlay */}
          <AppleIntelligence
            isOpen={isIntelligenceOpen}
            onClose={() => setIsIntelligenceOpen(false)}
            onRunCodeX={handleQuickRunCodeX}
            onToggleFlashlight={() => setIsFlashlightOn(!isFlashlightOn)}
            onSwitchWallpaper={(id) => setCurrentWallpaperId(id)}
            onOpenApp={handleOpenApp}
            onAirDrop={handleAirDrop}
          />

          {/* System Overlays */}
          {/* 1. Control Center */}
          <ControlCenter
            isOpen={isControlCenterOpen}
            onClose={() => setIsControlCenterOpen(false)}
            brightness={brightness}
            setBrightness={setBrightness}
            volume={volume}
            setVolume={setVolume}
            isFlashlightOn={isFlashlightOn}
            setIsFlashlightOn={setIsFlashlightOn}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isSoundMuted={isSoundMuted}
            setIsSoundMuted={setIsSoundMuted}
            currentTrack={currentTrack}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            onNextTrack={handleNextTrack}
            onOpenApp={handleOpenApp}
            onTriggerIntelligence={() => {
              soundManager.playSiriChime();
              setIsIntelligenceOpen(true);
            }}
            onTakeScreenshot={handleTakeScreenshot}
            isScreenRecording={isScreenRecording}
            onToggleScreenRecording={handleToggleScreenRecording}
          />

          {/* 2. Notification Center */}
          <NotificationCenter
            isOpen={isNotificationCenterOpen}
            onClose={() => setIsNotificationCenterOpen(false)}
            notifications={notifications}
            onClearAll={() => setNotifications([])}
            onOpenApp={handleOpenApp}
          />

          {/* 3. App Switcher / Multitasking */}
          <AppSwitcher
            isOpen={isAppSwitcherOpen}
            onClose={() => setIsAppSwitcherOpen(false)}
            openAppIds={openAppIds}
            activeAppId={activeAppId}
            onSelectApp={handleOpenApp}
            onCloseApp={handleKillApp}
            onClearAll={() => {
              setOpenAppIds([]);
              setActiveAppId(null);
            }}
          />

          {/* 4. Lock Screen */}
          <LockScreen
            isLocked={isLocked}
            onUnlock={() => setIsLocked(false)}
            notifications={notifications}
            onOpenNotification={(appId) => handleOpenApp(appId)}
            isFlashlightOn={isFlashlightOn}
            setIsFlashlightOn={setIsFlashlightOn}
            onLaunchCamera={() => handleOpenApp('camera')}
          />
        </DeviceFrame>
      </main>
    </div>
  );
}
