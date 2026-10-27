import React, { useState } from 'react';
import {
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Sparkles,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import { PhotoItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface CameraAppProps {
  onCapturePhoto: (photo: PhotoItem) => void;
  onOpenPhotos: () => void;
  onClose: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({
  onCapturePhoto,
  onOpenPhotos,
  onClose,
}) => {
  const [lensMode, setLensMode] = useState<'1x' | '2x' | '0.5x'>('1x');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'none' | 'vibrant' | 'mono' | 'warm'>('none');
  const [flashScreen, setFlashScreen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');

  const takeSnapshot = () => {
    soundManager.playCameraShutter();
    setFlashScreen(true);
    setTimeout(() => setFlashScreen(false), 120);

    // Create captured photo record
    const photoUrls = [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    ];
    const randomUrl = photoUrls[Math.floor(Math.random() * photoUrls.length)];

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: `IMG_1513_${Math.floor(Math.random() * 900 + 100)}.HEIC`,
      url: randomUrl,
      takenAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      filter: selectedFilter,
    };
    onCapturePhoto(newPhoto);
  };

  const getFilterStyle = () => {
    if (selectedFilter === 'vibrant') return 'saturate(160%) contrast(110%)';
    if (selectedFilter === 'mono') return 'grayscale(100%) contrast(120%)';
    if (selectedFilter === 'warm') return 'sepia(35%) saturate(120%)';
    return 'none';
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Flash Screen Flash animation */}
      {flashScreen && (
        <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150 pointer-events-none" />
      )}

      {/* Top Controls Bar */}
      <div className="pt-2 pb-3 px-5 flex items-center justify-between text-xs z-20 bg-black/40 backdrop-blur-md">
        <button
          onClick={() => {
            setIsFlashActive(!isFlashActive);
            soundManager.playKeyClick();
          }}
          className={`p-2 rounded-full transition-colors ${
            isFlashActive ? 'bg-amber-400 text-black' : 'text-neutral-300 hover:text-white'
          }`}
        >
          {isFlashActive ? <Zap className="w-4 h-4 fill-black" /> : <ZapOff className="w-4 h-4" />}
        </button>

        <span className="text-[11px] font-mono text-neutral-400">4K · 60 FPS · HDR</span>

        <button
          onClick={() => {
            const next = selectedFilter === 'none' ? 'vibrant' : selectedFilter === 'vibrant' ? 'mono' : 'none';
            setSelectedFilter(next);
            soundManager.playKeyClick();
          }}
          className="p-2 rounded-full text-neutral-300 hover:text-white"
          title="Toggle Photographic Style"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder Canvas */}
      <div className="flex-1 relative mx-2 rounded-3xl overflow-hidden bg-neutral-900 flex items-center justify-center border border-white/10">
        <img
          src={
            cameraFacing === 'back'
              ? 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
          }
          alt="Viewfinder"
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: getFilterStyle() }}
        />

        {/* Framing Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10 flex items-center justify-center">
            {/* Center Focus Box */}
            <div className="w-12 h-12 border border-amber-300/80 rounded-md animate-pulse" />
          </div>
          <div className="border-b border-white/10" />
        </div>

        {/* Focal Length Selector Buttons (0.5x, 1x, 2x) */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
          {(['0.5x', '1x', '2x'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setLensMode(mode);
                soundManager.playKeyClick();
              }}
              className={`w-9 h-9 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
                lensMode === mode
                  ? 'bg-amber-400 text-black scale-110'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Shutter & Gallery Bar */}
      <div className="py-6 px-8 flex items-center justify-between z-20 bg-black/60 backdrop-blur-md">
        {/* Gallery Thumbnail */}
        <button
          onClick={() => {
            soundManager.playKeyClick();
            onOpenPhotos();
          }}
          className="w-12 h-12 rounded-xl border border-white/30 overflow-hidden bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center"
          title="Open Photos Gallery"
        >
          <ImageIcon className="w-6 h-6 text-neutral-300" />
        </button>

        {/* Shutter Button */}
        <button
          onClick={takeSnapshot}
          className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-xl"
        >
          <div className="w-full h-full rounded-full bg-white active:bg-neutral-200" />
        </button>

        {/* Flip Camera Button */}
        <button
          onClick={() => {
            setCameraFacing(cameraFacing === 'back' ? 'front' : 'back');
            soundManager.playKeyClick();
          }}
          className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white active:scale-95 transition-all"
          title="Flip Camera"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
