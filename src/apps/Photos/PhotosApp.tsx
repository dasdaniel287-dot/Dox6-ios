import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Trash2,
  Heart,
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react';
import { PhotoItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface PhotosAppProps {
  photos: PhotoItem[];
  onDeletePhoto: (id: string) => void;
  onClose: () => void;
}

export const PhotosApp: React.FC<PhotosAppProps> = ({
  photos,
  onDeletePhoto,
  onClose,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Photos</h2>
          <span className="text-[11px] text-neutral-400">{photos.length} Photos · Library</span>
        </div>
        <div className="flex bg-neutral-800 p-0.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'all' ? 'bg-neutral-700 text-white' : 'text-neutral-400'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites' ? 'bg-neutral-700 text-white' : 'text-neutral-400'
            }`}
          >
            Albums
          </button>
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => {
                setSelectedPhoto(photo);
                soundManager.playKeyClick();
              }}
              className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[9px] text-white font-medium truncate">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 rounded-full bg-white/10 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h4 className="text-xs font-semibold text-white">{selectedPhoto.title}</h4>
              <span className="text-[10px] text-neutral-400">{selectedPhoto.takenAt}</span>
            </div>
            <button
              onClick={() => {
                onDeletePhoto(selectedPhoto.id);
                setSelectedPhoto(null);
                soundManager.playKeyClick();
              }}
              className="p-2 rounded-full bg-white/10 text-neutral-300 hover:text-rose-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Large image */}
          <div className="flex-1 flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="flex justify-around items-center py-2 text-neutral-400 text-xs" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => soundManager.playKeyClick()} className="hover:text-white flex items-center gap-1">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={() => soundManager.playKeyClick()} className="hover:text-white flex items-center gap-1">
              <Heart className="w-4 h-4 text-rose-500" /> Favorite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
