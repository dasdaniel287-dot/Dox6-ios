import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  ListMusic,
  Heart,
  Share2,
} from 'lucide-react';
import { MusicTrack } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface MusicAppProps {
  currentTrack?: MusicTrack;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  playlist: MusicTrack[];
  onSelectTrack: (track: MusicTrack) => void;
  onClose: () => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  currentTrack,
  isPlayingMusic,
  onToggleMusic,
  onNextTrack,
  onPrevTrack,
  playlist,
  onSelectTrack,
}) => {
  const [progressSec, setProgressSec] = React.useState(68);
  const [isLiked, setIsLiked] = React.useState(true);

  const duration = currentTrack?.duration || 180;
  const mins = Math.floor(progressSec / 60);
  const secs = progressSec % 60;
  const remMins = Math.floor((duration - progressSec) / 60);
  const remSecs = (duration - progressSec) % 60;

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between p-6 overflow-y-auto no-scrollbar select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="font-semibold tracking-wider uppercase text-[10px]">
          Apple Music · Spatial
        </span>
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            soundManager.playKeyClick();
          }}
          className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Album Artwork with animated shadow */}
      <div className="py-6 flex justify-center">
        <div className="relative group">
          <img
            src={currentTrack?.coverUrl}
            alt={currentTrack?.title}
            className="w-56 h-56 rounded-3xl object-cover shadow-2xl border border-white/10 group-hover:scale-102 transition-transform duration-300"
          />
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-40 -z-10"
            style={{ backgroundColor: currentTrack?.accentColor || '#3b82f6' }}
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentTrack?.title || 'Midnight Compiling'}
            </h2>
            <p className="text-xs text-neutral-400 font-medium">
              {currentTrack?.artist || 'CodeX Beats'} · {currentTrack?.album || 'Silicon Dreams'}
            </p>
          </div>
          <button
            onClick={() => soundManager.playKeyClick()}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubber */}
      <div className="space-y-1 py-2">
        <div className="relative w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(progressSec / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
          <span>{mins}:{secs < 10 ? `0${secs}` : secs}</span>
          <span>-{remMins}:{remSecs < 10 ? `0${remSecs}` : remSecs}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => soundManager.playKeyClick()}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <Shuffle className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            onPrevTrack();
            soundManager.playKeyClick();
          }}
          className="text-white hover:opacity-80 active:scale-95 transition-all"
        >
          <SkipBack className="w-6 h-6 fill-white" />
        </button>
        <button
          onClick={() => {
            onToggleMusic();
            soundManager.playKeyClick();
          }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {isPlayingMusic ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-0.5" />
          )}
        </button>
        <button
          onClick={() => {
            onNextTrack();
            soundManager.playKeyClick();
          }}
          className="text-white hover:opacity-80 active:scale-95 transition-all"
        >
          <SkipForward className="w-6 h-6 fill-white" />
        </button>
        <button
          onClick={() => soundManager.playKeyClick()}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Playlist Queue */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
          <ListMusic className="w-3.5 h-3.5" />
          <span>Queue ({playlist.length} tracks)</span>
        </div>
        <div className="space-y-1 max-h-28 overflow-y-auto no-scrollbar">
          {playlist.map((track) => (
            <div
              key={track.id}
              onClick={() => {
                onSelectTrack(track);
                soundManager.playKeyClick();
              }}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                currentTrack?.id === track.id
                  ? 'bg-white/10 text-rose-400 font-medium'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <span className="truncate">{track.title}</span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {Math.floor(track.duration / 60)}:
                {track.duration % 60 < 10 ? `0${track.duration % 60}` : track.duration % 60}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
