import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Compass,
  Droplets,
  Eye,
  Thermometer,
  ChevronDown,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WeatherAppProps {
  onClose: () => void;
}

const CITIES = [
  { name: 'Cupertino', region: 'California', temp: 72, condition: 'Sunny & Clear', high: 78, low: 54 },
  { name: 'San Francisco', region: 'California', temp: 64, condition: 'Partly Cloudy', high: 68, low: 52 },
  { name: 'Tokyo', region: 'Japan', temp: 68, condition: 'Clear Night', high: 72, low: 58 },
  { name: 'London', region: 'United Kingdom', temp: 58, condition: 'Light Rain', high: 62, low: 48 },
];

export const WeatherApp: React.FC<WeatherAppProps> = ({ onClose }) => {
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const city = CITIES[selectedCityIdx];

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-600 via-blue-700 to-indigo-950 text-white flex flex-col justify-between overflow-y-auto no-scrollbar select-none p-4">
      {/* City Switcher Header */}
      <div className="pt-2 flex justify-between items-center shrink-0">
        <div className="relative">
          <select
            value={selectedCityIdx}
            onChange={(e) => {
              setSelectedCityIdx(Number(e.target.value));
              soundManager.playKeyClick();
            }}
            className="bg-black/20 text-white font-semibold text-sm py-1 pl-3 pr-7 rounded-xl border border-white/20 focus:outline-none appearance-none cursor-pointer"
          >
            {CITIES.map((c, i) => (
              <option key={c.name} value={i} className="bg-neutral-900 text-white">
                {c.name}, {c.region}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2 top-2 pointer-events-none" />
        </div>
        <span className="text-xs text-white/70">Dox6 Weather</span>
      </div>

      {/* Main Temperature Display */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-semibold tracking-tight">{city.name}</h1>
        <div className="text-6xl font-extralight tracking-tighter my-1">{city.temp}°</div>
        <p className="text-sm font-medium text-white/90">{city.condition}</p>
        <div className="text-xs text-white/75 mt-1">
          H: {city.high}° · L: {city.low}°
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="p-3.5 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
          Hourly Forecast
        </span>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {['Now', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'].map((time, idx) => (
            <div key={time} className="flex flex-col items-center gap-1.5 shrink-0 text-xs">
              <span className="text-[10px] text-white/80">{time}</span>
              {idx > 5 ? (
                <CloudRain className="w-4 h-4 text-sky-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
              <span className="font-semibold">{city.temp + (idx < 4 ? idx : -idx + 3)}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Day Extended Forecast */}
      <div className="p-3.5 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 space-y-2.5 my-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
          10-Day Forecast
        </span>
        <div className="space-y-2 text-xs">
          {[
            { day: 'Today', high: 78, low: 54, icon: Sun },
            { day: 'Mon', high: 76, low: 53, icon: Sun },
            { day: 'Tue', high: 74, low: 52, icon: CloudSun },
            { day: 'Wed', high: 70, low: 50, icon: CloudRain },
            { day: 'Thu', high: 72, low: 51, icon: Sun },
          ].map((d) => (
            <div key={d.day} className="flex items-center justify-between">
              <span className="w-12 text-white/90">{d.day}</span>
              <d.icon className="w-4 h-4 text-amber-300" />
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-[11px]">{d.low}°</span>
                <div className="w-20 h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 w-3/4 rounded-full" />
                </div>
                <span className="font-semibold text-[11px]">{d.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-white/70 text-[10px]">
            <Droplets className="w-3.5 h-3.5" />
            <span>HUMIDITY</span>
          </div>
          <div className="text-lg font-bold">48%</div>
          <p className="text-[10px] text-white/60">The dew point is 52° right now.</p>
        </div>

        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-white/70 text-[10px]">
            <Wind className="w-3.5 h-3.5" />
            <span>WIND</span>
          </div>
          <div className="text-lg font-bold">6 mph</div>
          <p className="text-[10px] text-white/60">Gusts to 12 mph from WNW.</p>
        </div>
      </div>
    </div>
  );
};
