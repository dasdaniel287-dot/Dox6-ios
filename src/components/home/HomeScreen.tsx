import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Terminal,
  Compass,
  Settings,
  ShoppingBag,
  Music,
  Camera,
  Image as ImageIcon,
  Calculator,
  FileText,
  HeartPulse,
  Folder,
  Search,
  Check,
  Minus,
  Sparkles,
  MessageCircle,
  MapPin,
  Package,
  CloudSun,
  Mic,
  Phone,
  Clock,
  ListChecks,
  Mail,
  TrendingUp,
  CreditCard,
  Video,
  Radio,
  GitBranch,
  Globe,
  Code,
  Cpu,
} from 'lucide-react';
import { AppIconConfig } from '../../types/ios';
import { ClockWidget, WeatherWidget, CodeXQuickLauncherWidget, ActivityRingsWidget, BatteryStatusWidget } from './Widgets';
import { soundManager } from '../../utils/audio';

interface HomeScreenProps {
  apps: AppIconConfig[];
  onOpenApp: (appId: string) => void;
  onUninstallApp?: (appId: string) => void;
  onQuickRunCodeX?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  apps,
  onOpenApp,
  onUninstallApp,
  onQuickRunCodeX,
}) => {
  const [currentPage, setCurrentPage] = useState(1); // 0 = Today View, 1 = Main, 2 = Extra/Tools, 3 = App Library
  const [isJiggleMode, setIsJiggleMode] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Map icon strings to Lucide components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Phone':
        return <Phone className="w-7 h-7 fill-white/10" />;
      case 'Clock':
        return <Clock className="w-7 h-7" />;
      case 'ListChecks':
        return <ListChecks className="w-7 h-7" />;
      case 'Mail':
        return <Mail className="w-7 h-7" />;
      case 'TrendingUp':
        return <TrendingUp className="w-7 h-7" />;
      case 'CreditCard':
        return <CreditCard className="w-7 h-7" />;
      case 'Video':
        return <Video className="w-7 h-7" />;
      case 'Radio':
        return <Radio className="w-7 h-7" />;
      case 'GitBranch':
        return <GitBranch className="w-7 h-7" />;
      case 'Globe':
        return <Globe className="w-7 h-7" />;
      case 'Code':
        return <Code className="w-7 h-7" />;
      case 'Cpu':
        return <Cpu className="w-7 h-7" />;
      case 'Code2':
        return <Code2 className="w-7 h-7" />;
      case 'Terminal':
        return <Terminal className="w-7 h-7" />;
      case 'Compass':
        return <Compass className="w-7 h-7" />;
      case 'Settings':
        return <Settings className="w-7 h-7" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-7 h-7" />;
      case 'Music':
        return <Music className="w-7 h-7" />;
      case 'Camera':
        return <Camera className="w-7 h-7" />;
      case 'Image':
        return <ImageIcon className="w-7 h-7" />;
      case 'Calculator':
        return <Calculator className="w-7 h-7" />;
      case 'FileText':
        return <FileText className="w-7 h-7" />;
      case 'HeartPulse':
        return <HeartPulse className="w-7 h-7" />;
      case 'Folder':
        return <Folder className="w-7 h-7" />;
      case 'MessageCircle':
        return <MessageCircle className="w-7 h-7" />;
      case 'MapPin':
        return <MapPin className="w-7 h-7" />;
      case 'Package':
        return <Package className="w-7 h-7" />;
      case 'CloudSun':
        return <CloudSun className="w-7 h-7" />;
      case 'Mic':
        return <Mic className="w-7 h-7" />;
      default:
        return <Sparkles className="w-7 h-7" />;
    }
  };

  const handleAppClick = (appId: string) => {
    if (isJiggleMode) return;
    soundManager.playKeyClick();
    onOpenApp(appId);
  };

  const handleAppLongPress = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsJiggleMode(true);
    soundManager.playKeyClick();
  };

  // Dock items (iOS Standard 4 items: Phone, Safari, CodeX, Music)
  const dockApps = apps.filter((app) => ['phone', 'safari', 'codex', 'music'].includes(app.id));
  const mainGridApps = apps.filter((app) => !['phone', 'safari', 'codex', 'music'].includes(app.id));

  // Filtered apps for Spotlight
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between pt-12 pb-5 px-4 text-white select-none overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault();
        setIsJiggleMode(true);
      }}
    >
      {/* Top Controls: Jiggle Done button & Spotlight button */}
      <div className="flex items-center justify-between px-2 h-7">
        <button
          onClick={() => {
            setIsSpotlightOpen(!isSpotlightOpen);
            soundManager.playKeyClick();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] text-neutral-300 hover:text-white transition-all border border-white/5 active:scale-95"
        >
          <Search className="w-3 h-3" />
          <span>Spotlight Search</span>
        </button>

        {isJiggleMode && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => {
              setIsJiggleMode(false);
              soundManager.playKeyClick();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg hover:bg-blue-500 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Done
          </motion.button>
        )}
      </div>

      {/* Spotlight Overlay if open */}
      <AnimatePresence>
        {isSpotlightOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-4 top-14 z-40 p-4 rounded-3xl bg-neutral-900/95 backdrop-blur-3xl border border-white/15 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-800/80 border border-white/10">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                placeholder="Search Apps, CodeX, Swift, Settings..."
                className="bg-transparent border-none text-xs text-white placeholder-neutral-400 focus:outline-none w-full"
                autoFocus
              />
            </div>

            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    handleAppClick(app.id);
                    setIsSpotlightOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl ${app.iconBg} ${app.iconColor || 'text-white'} flex items-center justify-center`}>
                    {getIconComponent(app.iconName)}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">{app.name}</h5>
                    <span className="text-[10px] text-neutral-400">{app.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pages Carousel */}
      <div className="flex-1 flex flex-col justify-start pt-2 overflow-y-auto no-scrollbar">
        {/* PAGE 0: TODAY / WIDGETS SCREEN */}
        {currentPage === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="space-y-3.5 py-1"
          >
            <div className="grid grid-cols-2 gap-3.5">
              <ClockWidget onOpenApp={onOpenApp} />
              <WeatherWidget onOpenApp={onOpenApp} />
            </div>
            <CodeXQuickLauncherWidget onOpenApp={onOpenApp} onQuickRunCodeX={onQuickRunCodeX} />
            <ActivityRingsWidget onOpenApp={onOpenApp} />
            <BatteryStatusWidget onOpenApp={onOpenApp} />
          </motion.div>
        )}

        {/* PAGE 1: MAIN HOME SCREEN */}
        {currentPage === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4 py-1"
          >
            {/* Top Widget Row: Clock & Weather */}
            <div className="grid grid-cols-2 gap-3.5">
              <ClockWidget onOpenApp={onOpenApp} />
              <WeatherWidget onOpenApp={onOpenApp} />
            </div>

            {/* CodeX Featured Card */}
            <CodeXQuickLauncherWidget onOpenApp={onOpenApp} onQuickRunCodeX={onQuickRunCodeX} />

            {/* Apps Grid */}
            <div className="grid grid-cols-4 gap-y-4 gap-x-3 pt-2">
              {mainGridApps.map((app) => (
                <div
                  key={app.id}
                  onMouseDown={handleAppLongPress}
                  onClick={() => handleAppClick(app.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className={`relative w-14 h-14 rounded-2xl ${app.iconBg} ${app.iconColor || 'text-white'} flex items-center justify-center shadow-lg transition-transform ${
                      isJiggleMode ? 'jiggle-animate' : ''
                    }`}
                  >
                    {getIconComponent(app.iconName)}

                    {/* Unread badge */}
                    {app.badge && !isJiggleMode && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md">
                        {app.badge}
                      </span>
                    )}

                    {/* Jiggle delete button */}
                    {isJiggleMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onUninstallApp) onUninstallApp(app.id);
                          soundManager.playKeyClick();
                        }}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-neutral-800 text-white border border-white/20 flex items-center justify-center hover:bg-rose-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>

                  <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-md text-center truncate max-w-[64px]">
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PAGE 2: APP LIBRARY / CATEGORIES */}
        {currentPage === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-4 py-1"
          >
            <div className="text-xs font-semibold tracking-wider text-neutral-400 uppercase px-1">
              App Library
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Category: Developer Tools */}
              <div className="p-3 rounded-3xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-neutral-200">Developer</span>
                <div className="grid grid-cols-2 gap-2">
                  {apps
                    .filter((a) => a.category === 'Developer')
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAppClick(a.id)}
                        className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all`}
                        title={a.name}
                      >
                        {getIconComponent(a.iconName)}
                      </button>
                    ))}
                </div>
              </div>

              {/* Category: Utilities */}
              <div className="p-3 rounded-3xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-neutral-200">Utilities</span>
                <div className="grid grid-cols-2 gap-2">
                  {apps
                    .filter((a) => a.category === 'Utilities')
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAppClick(a.id)}
                        className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all`}
                        title={a.name}
                      >
                        {getIconComponent(a.iconName)}
                      </button>
                    ))}
                </div>
              </div>

              {/* Category: Media */}
              <div className="p-3 rounded-3xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-neutral-200">Media</span>
                <div className="grid grid-cols-2 gap-2">
                  {apps
                    .filter((a) => a.category === 'Media')
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAppClick(a.id)}
                        className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all`}
                        title={a.name}
                      >
                        {getIconComponent(a.iconName)}
                      </button>
                    ))}
                </div>
              </div>

              {/* Category: Productivity */}
              <div className="p-3 rounded-3xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-neutral-200">Productivity</span>
                <div className="grid grid-cols-2 gap-2">
                  {apps
                    .filter((a) => a.category === 'Productivity' || a.category === 'System')
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAppClick(a.id)}
                        className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all`}
                        title={a.name}
                      >
                        {getIconComponent(a.iconName)}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Page Indicator Dots */}
      <div className="flex items-center justify-center gap-2 py-2">
        {[0, 1, 2].map((pageIdx) => (
          <button
            key={pageIdx}
            onClick={() => {
              setCurrentPage(pageIdx);
              soundManager.playKeyClick();
            }}
            className={`transition-all rounded-full ${
              currentPage === pageIdx ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Dock Bar */}
      <div className="mt-1 px-1">
        <div className="p-3 rounded-3xl bg-white/20 backdrop-blur-3xl border border-white/20 flex items-center justify-around shadow-2xl">
          {dockApps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleAppClick(app.id)}
              className="cursor-pointer relative"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${app.iconBg} ${app.iconColor || 'text-white'} flex items-center justify-center shadow-lg ${
                  isJiggleMode ? 'jiggle-animate' : ''
                }`}
              >
                {getIconComponent(app.iconName)}
              </div>
              {app.badge && !isJiggleMode && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md">
                  {app.badge}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
