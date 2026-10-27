import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { DEFAULT_APPS } from '../../data/initialData';
import { soundManager } from '../../utils/audio';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  openAppIds: string[];
  activeAppId: string | null;
  onSelectApp: (appId: string) => void;
  onCloseApp: (appId: string) => void;
  onClearAll: () => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({
  isOpen,
  onClose,
  openAppIds,
  activeAppId,
  onSelectApp,
  onCloseApp,
  onClearAll,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black/75 backdrop-blur-2xl flex flex-col justify-between p-6 pt-16 pb-12 select-none"
          onClick={onClose}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Multitasking ({openAppIds.length} open)
            </span>
            {openAppIds.length > 0 && (
              <button
                onClick={() => {
                  onClearAll();
                  soundManager.playKeyClick();
                  onClose();
                }}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 transition-colors"
              >
                Close All
              </button>
            )}
          </div>

          {/* Cards carousel */}
          <div
            className="flex items-center gap-5 overflow-x-auto py-8 px-4 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {openAppIds.length === 0 ? (
              <div className="mx-auto text-center text-neutral-400 py-12">
                <p className="text-sm">No Apps Running in Background</p>
                <p className="text-xs text-neutral-500 mt-1">Open an app from the Home screen</p>
              </div>
            ) : (
              openAppIds.map((appId) => {
                const appConfig = DEFAULT_APPS.find((a) => a.id === appId) || {
                  id: appId,
                  name: appId.toUpperCase(),
                  iconBg: 'bg-blue-600',
                  iconColor: 'text-white',
                };

                return (
                  <motion.div
                    key={appId}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0, y: -80 }}
                    className="relative shrink-0 w-64 h-96 rounded-3xl bg-neutral-900 border border-white/15 overflow-hidden shadow-2xl flex flex-col group cursor-pointer"
                    onClick={() => {
                      soundManager.playKeyClick();
                      onSelectApp(appId);
                      onClose();
                    }}
                  >
                    {/* Top App Header */}
                    <div className="p-3.5 bg-neutral-800/80 flex items-center justify-between border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${appConfig.iconBg} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {appConfig.name.slice(0, 1)}
                        </div>
                        <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                          {appConfig.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playKeyClick();
                          onCloseApp(appId);
                        }}
                        className="w-6 h-6 rounded-full bg-neutral-700/80 hover:bg-rose-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Close App"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* App Window Preview Mock */}
                    <div className="flex-1 bg-neutral-950 p-4 flex flex-col justify-center items-center text-center">
                      <div className={`w-14 h-14 rounded-2xl ${appConfig.iconBg} flex items-center justify-center text-white mb-3 shadow-lg`}>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">{appConfig.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1">Tap to resume session</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Swipe indicator at bottom */}
          <div className="flex justify-center" onClick={onClose}>
            <div className="w-28 h-1 bg-white/40 rounded-full cursor-pointer hover:bg-white/70 transition-colors" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
