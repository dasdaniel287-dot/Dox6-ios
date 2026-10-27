import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Layers,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Landmark {
  id: string;
  name: string;
  address: string;
  desc: string;
  x: number; // percentage in map
  y: number;
}

const LANDMARKS: Landmark[] = [
  {
    id: 'apple-park-ring',
    name: 'Apple Park (The Ring)',
    address: '1 Apple Park Way, Cupertino, CA 95014',
    desc: 'The iconic 2.8 million-square-foot ring designed by Norman Foster. Home of Apple Design and Engineering.',
    x: 50,
    y: 45,
  },
  {
    id: 'steve-jobs-theater',
    name: 'Steve Jobs Theater',
    address: 'Apple Park South Hill, Cupertino, CA',
    desc: 'The subterranean glass cylinder pavilion where Apple Keynotes and WWDC keynote events are hosted.',
    x: 35,
    y: 70,
  },
  {
    id: 'visitor-center',
    name: 'Apple Park Visitor Center',
    address: '10600 N Tantau Ave, Cupertino, CA',
    desc: 'Public exhibition space with AR architectural models, Caffè Macs, and the Apple Company Store.',
    x: 75,
    y: 52,
  },
  {
    id: 'infinite-loop',
    name: 'Apple Infinite Loop',
    address: '1 Infinite Loop, Cupertino, CA',
    desc: 'Original Apple headquarters campus from 1993 to 2017. Current software & LLVM research labs.',
    x: 20,
    y: 25,
  },
];

interface MapsAppProps {
  onClose: () => void;
}

export const MapsApp: React.FC<MapsAppProps> = ({ onClose }) => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(LANDMARKS[0]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Search Header */}
      <div className="p-3 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center gap-2 z-20 shrink-0">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-neutral-800 border border-white/10 text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Cupertino, Apple Park..."
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-500"
          />
        </div>
        <button
          onClick={() => {
            setMapType(mapType === 'standard' ? 'satellite' : 'standard');
            soundManager.playKeyClick();
          }}
          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          title="Toggle Satellite View"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map View */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{
          background:
            mapType === 'satellite'
              ? 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 60%, #020617 100%)'
              : 'radial-gradient(circle at 50% 50%, #1a221f 0%, #121815 60%, #0c100e 100%)',
        }}
      >
        {/* Apple Park Circular Ring Map Graphic */}
        <div className="relative w-80 h-80 rounded-full border-12 border-emerald-950/60 flex items-center justify-center shadow-inner">
          <div className="w-64 h-64 rounded-full border-10 border-neutral-700/60 bg-emerald-900/10 flex items-center justify-center">
            <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
              Apple Park Ring
            </span>
          </div>

          {/* Road grid lines */}
          <div className="absolute inset-x-0 h-[1px] bg-neutral-800/80" />
          <div className="absolute inset-y-0 w-[1px] bg-neutral-800/80" />

          {/* Landmark Pins */}
          {LANDMARKS.map((lm) => (
            <button
              key={lm.id}
              onClick={() => {
                setSelectedLandmark(lm);
                soundManager.playKeyClick();
              }}
              style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform ${
                selectedLandmark.id === lm.id ? 'scale-125 z-30' : 'hover:scale-110 z-10'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  selectedLandmark.id === lm.id
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/40'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-semibold text-white px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md mt-1 truncate max-w-[90px]">
                {lm.name}
              </span>
            </button>
          ))}
        </div>

        {/* Map Compass */}
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300">
          <Compass className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      {/* Selected Landmark Drawer */}
      <div className="p-4 bg-neutral-900/95 backdrop-blur-2xl border-t border-white/10 space-y-3 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold text-white">{selectedLandmark.name}</h3>
            <p className="text-[11px] text-neutral-400">{selectedLandmark.address}</p>
          </div>
          <button
            onClick={() => {
              setIsNavigating(!isNavigating);
              soundManager.playKeyClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>{isNavigating ? 'End Route' : 'Directions'}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          {selectedLandmark.desc}
        </p>

        {isNavigating && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Drive: 4 min (1.2 miles) via N Tantau Ave</span>
            </span>
            <span className="font-semibold text-white">ETA 11:42</span>
          </div>
        )}
      </div>
    </div>
  );
};
