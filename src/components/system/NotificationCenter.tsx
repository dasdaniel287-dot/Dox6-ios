import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Trash2, X, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
  onOpenApp: (appId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onOpenApp,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="absolute inset-0 z-50 p-6 pt-12 bg-black/65 backdrop-blur-3xl text-white flex flex-col justify-between"
          onClick={onClose}
        >
          <div className="space-y-4 max-w-md w-full mx-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-neutral-300" />
                <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                  Notification Center
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  {notifications.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      onClearAll();
                      soundManager.playKeyClick();
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto no-scrollbar pt-1">
              {notifications.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs">No Recent Notifications</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundManager.playKeyClick();
                      onOpenApp(item.appId);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-white/10 cursor-pointer shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-neutral-200">
                          {item.appName}
                        </span>
                        {item.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-400">{item.time}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Bottom dismiss indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-24 h-1 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
