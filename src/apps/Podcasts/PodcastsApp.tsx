import React, { useState } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  FastForward,
  SkipForward,
  Volume2,
  X,
  Search,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface PodcastEpisode {
  id: string;
  showTitle: string;
  episodeTitle: string;
  duration: string;
  date: string;
  coverUrl: string;
  description: string;
}

interface PodcastsAppProps {
  onClose: () => void;
}

export const PodcastsApp: React.FC<PodcastsAppProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const episodes: PodcastEpisode[] = [
    {
      id: 'ep-1',
      showTitle: 'Swift by Sundell',
      episodeTitle: 'Swift 6.2 and the Future of Concurrency',
      duration: '52 min',
      date: 'Today',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80',
      description: 'John Sundell and guests discuss the evolution of data isolation, actors, and the new live compiler toolchains in iOS 18.',
    },
    {
      id: 'ep-2',
      showTitle: 'Accidental Tech Podcast',
      episodeTitle: 'ATP 610: The Titanium Silicon Revolution',
      duration: '2 hr 14 min',
      date: 'Yesterday',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
      description: 'Marco Arment, Casey Liss, and John Siracusa breakdown the A18 Pro architecture, Dynamic Island APIs, and developer benchmarks.',
    },
    {
      id: 'ep-3',
      showTitle: 'The Talk Show',
      episodeTitle: 'Deep Dive into Dox6 iOS with Daniel Das',
      duration: '1 hr 42 min',
      date: 'Oct 24',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      description: 'John Gruber discusses on-device compilation, native SwiftUI glass aesthetics, and the new CodeX 1513 developer environment.',
    },
  ];

  const [currentEp, setCurrentEp] = useState<PodcastEpisode>(episodes[0]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    soundManager.playKeyClick();
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    soundManager.playKeyClick();
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER */}
      <div className="px-5 pt-11 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            Podcasts
          </h1>
          <p className="text-[10px] text-neutral-400">Apple Podcasts · Up Next</p>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* BODY SCROLL */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* CURRENTLY PLAYING POD */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/20 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={currentEp.coverUrl}
              alt={currentEp.showTitle}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                {currentEp.showTitle}
              </span>
              <h3 className="text-xs font-bold text-white line-clamp-1">{currentEp.episodeTitle}</h3>
              <p className="text-[10px] text-neutral-400">{currentEp.duration} · {currentEp.date}</p>
            </div>
          </div>

          {/* Scrubber */}
          <div className="space-y-1 pt-1">
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full w-1/3 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>18:24</span>
              <span>-33:36</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 pt-1">
            <button
              onClick={cycleSpeed}
              className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-neutral-300 hover:text-white"
            >
              {playbackSpeed}x
            </button>

            <button
              onClick={() => soundManager.playKeyClick()}
              className="text-neutral-300 hover:text-white p-2"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
            </button>

            <button
              onClick={() => soundManager.playKeyClick()}
              className="text-neutral-300 hover:text-white p-2"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <div className="w-6" />
          </div>
        </div>

        {/* EPISODE QUEUE */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
            Up Next in Queue
          </span>

          <div className="space-y-2">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => {
                  setCurrentEp(ep);
                  setIsPlaying(true);
                  soundManager.playKeyClick();
                }}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer border transition-all ${
                  currentEp.id === ep.id
                    ? 'bg-purple-900/30 border-purple-500/40'
                    : 'bg-neutral-900/70 border-white/5 hover:bg-neutral-800'
                }`}
              >
                <img
                  src={ep.coverUrl}
                  alt={ep.showTitle}
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-purple-400 font-semibold block">{ep.showTitle}</span>
                  <h4 className="text-xs font-bold text-white truncate">{ep.episodeTitle}</h4>
                  <p className="text-[10px] text-neutral-400 truncate">{ep.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-neutral-400 block">{ep.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
