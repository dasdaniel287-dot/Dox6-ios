import React, { useState, useEffect, useRef } from 'react';
import {
  Clock as ClockIcon,
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Bell,
  Globe,
  Check,
} from 'lucide-react';
import { DynamicIslandState } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface ClockAppProps {
  onClose: () => void;
  setIslandState: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
}

interface WorldCity {
  city: string;
  country: string;
  offset: string;
  time: string;
  isDay: boolean;
}

export const ClockApp: React.FC<ClockAppProps> = ({ onClose, setIslandState }) => {
  const [activeTab, setActiveTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('stopwatch');

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0); // milliseconds
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchRef = useRef<any>(null);

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingTimerSeconds, setRemainingTimerSeconds] = useState(300);

  // Alarms state
  const [alarms, setAlarms] = useState([
    { id: '1', time: '06:30', period: 'AM', label: 'Morning Run & Code', enabled: true },
    { id: '2', time: '09:00', period: 'AM', label: 'Dox6 Daily Standup', enabled: true },
    { id: '3', time: '10:30', period: 'PM', label: 'Bedtime Reading', enabled: false },
  ]);

  // Stopwatch logic
  useEffect(() => {
    if (isStopwatchRunning) {
      const startTime = Date.now() - stopwatchTime;
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [isStopwatchRunning]);

  // Timer countdown logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && remainingTimerSeconds > 0) {
      interval = setInterval(() => {
        setRemainingTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundManager.playBuildSuccess();
            setIslandState((s) => ({ ...s, activity: 'idle' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTimerSeconds]);

  const toggleStopwatch = () => {
    soundManager.playKeyClick();
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  const resetStopwatch = () => {
    soundManager.playKeyClick();
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const lapStopwatch = () => {
    soundManager.playKeyClick();
    setLaps([stopwatchTime, ...laps]);
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${centis < 10 ? '0' : ''}${centis}`;
  };

  const startTimer = () => {
    soundManager.playKeyClick();
    const totalSecs = timerMinutes * 60 + timerSeconds;
    setRemainingTimerSeconds(totalSecs);
    setIsTimerRunning(true);
    setIslandState({
      mode: 'compact',
      activity: 'timer',
      title: 'Timer',
      subtitle: `${timerMinutes}m 00s`,
    });
  };

  const cancelTimer = () => {
    soundManager.playKeyClick();
    setIsTimerRunning(false);
    setRemainingTimerSeconds(timerMinutes * 60);
    setIslandState((prev) => ({ ...prev, activity: 'idle' }));
  };

  const toggleAlarm = (id: string) => {
    soundManager.playKeyClick();
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Main View Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col">
        {/* 1. STOPWATCH TAB */}
        {activeTab === 'stopwatch' && (
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center py-8">
              <span className="text-6xl font-light font-mono tracking-tight text-white">
                {formatStopwatch(stopwatchTime)}
              </span>
            </div>

            {/* Lap / Start Controls */}
            <div className="flex justify-between items-center px-6">
              <button
                onClick={isStopwatchRunning ? lapStopwatch : resetStopwatch}
                className="w-18 h-18 rounded-full bg-neutral-800 text-neutral-300 font-medium text-sm flex items-center justify-center border border-white/10 active:scale-95 transition-all"
              >
                {isStopwatchRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                onClick={toggleStopwatch}
                className={`w-18 h-18 rounded-full font-medium text-sm flex items-center justify-center active:scale-95 transition-all shadow-xl ${
                  isStopwatchRunning
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {isStopwatchRunning ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Laps List */}
            <div className="flex-1 max-h-48 overflow-y-auto no-scrollbar mt-6 divide-y divide-white/10 text-xs font-mono">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between py-2 px-2 text-neutral-300">
                  <span>Lap {laps.length - i}</span>
                  <span className="text-white font-medium">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. TIMER TAB */}
        {activeTab === 'timer' && (
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center py-6">
              <div className="text-6xl font-extralight font-mono tracking-tight text-white">
                {Math.floor(remainingTimerSeconds / 60)}:
                {remainingTimerSeconds % 60 < 10
                  ? `0${remainingTimerSeconds % 60}`
                  : remainingTimerSeconds % 60}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                {isTimerRunning ? 'Countdown Active · Dynamic Island' : 'Select Timer Duration'}
              </p>
            </div>

            {/* Minutes selector if stopped */}
            {!isTimerRunning && (
              <div className="flex justify-center gap-3 py-4">
                {[1, 5, 10, 15, 25].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setTimerMinutes(m);
                      setRemainingTimerSeconds(m * 60);
                      soundManager.playKeyClick();
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                      timerMinutes === m
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center px-6 mt-4">
              <button
                onClick={cancelTimer}
                className="w-18 h-18 rounded-full bg-neutral-800 text-neutral-300 font-medium text-sm flex items-center justify-center border border-white/10 active:scale-95 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={isTimerRunning ? cancelTimer : startTimer}
                className={`w-18 h-18 rounded-full font-medium text-sm flex items-center justify-center active:scale-95 transition-all shadow-xl ${
                  isTimerRunning
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    : 'bg-orange-950/80 text-orange-400 border border-orange-500/40'
                }`}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        )}

        {/* 3. ALARMS TAB */}
        {activeTab === 'alarm' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Alarms</h2>
              <button
                onClick={() => soundManager.playKeyClick()}
                className="w-7 h-7 rounded-full bg-neutral-800 text-orange-400 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-light text-white">{alarm.time}</span>
                      <span className="text-xs font-medium text-neutral-400">{alarm.period}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">{alarm.label}</span>
                  </div>

                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      alarm.enabled ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        alarm.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. WORLD CLOCK TAB */}
        {activeTab === 'world' && (
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-bold text-white">World Clock</h2>
            <div className="space-y-2">
              {[
                { city: 'Cupertino', country: 'United States', time: '09:41', offset: 'Today, +0HRS' },
                { city: 'New York', country: 'United States', time: '12:41', offset: 'Today, +3HRS' },
                { city: 'London', country: 'United Kingdom', time: '17:41', offset: 'Today, +8HRS' },
                { city: 'Tokyo', country: 'Japan', time: '02:41', offset: 'Tomorrow, +17HRS' },
                { city: 'Sydney', country: 'Australia', time: '04:41', offset: 'Tomorrow, +19HRS' },
              ].map((item) => (
                <div
                  key={item.city}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase">{item.offset}</span>
                    <h4 className="text-sm font-semibold text-white">{item.city}</h4>
                  </div>
                  <span className="text-2xl font-light font-mono text-white">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Segmented Tab Bar */}
      <div className="h-14 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around text-xs shrink-0">
        {[
          { id: 'world', label: 'World Clock', icon: Globe },
          { id: 'alarm', label: 'Alarm', icon: Bell },
          { id: 'stopwatch', label: 'Stopwatch', icon: ClockIcon },
          { id: 'timer', label: 'Timer', icon: TimerIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              soundManager.playKeyClick();
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === tab.id ? 'text-orange-500 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
