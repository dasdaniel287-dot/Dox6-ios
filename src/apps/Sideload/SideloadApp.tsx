import React, { useState } from 'react';
import {
  Package,
  ShieldCheck,
  Download,
  Check,
  Cpu,
  Trash2,
  RefreshCw,
  Plus,
  Zap,
  Clock,
  Layers,
} from 'lucide-react';
import { AppIconConfig } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface SideloadAppProps {
  onInstallApp: (app: AppIconConfig) => void;
  installedApps: AppIconConfig[];
  onClose: () => void;
}

interface SideloadPackage {
  id: string;
  name: string;
  version: string;
  size: string;
  developer: string;
  iconBg: string;
  iconName: string;
  bundleId: string;
}

const AVAILABLE_IPAS: SideloadPackage[] = [
  {
    id: 'utm-vm',
    name: 'UTM Virtual Machine',
    version: 'v4.5.3',
    size: '124 MB',
    developer: 'UTM Project',
    iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-700',
    iconName: 'Cpu',
    bundleId: 'com.dox6.utm',
  },
  {
    id: 'delta-emu',
    name: 'Delta Retro Lab',
    version: 'v1.6.0',
    size: '68 MB',
    developer: 'Riley Testut',
    iconBg: 'bg-gradient-to-tr from-violet-600 to-fuchsia-600',
    iconName: 'Package',
    bundleId: 'com.dox6.delta',
  },
  {
    id: 'kodi-player',
    name: 'Kodi Media Center',
    version: 'v21.1',
    size: '95 MB',
    developer: 'XBMC Foundation',
    iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-700',
    iconName: 'Layers',
    bundleId: 'com.dox6.kodi',
  },
];

export const SideloadApp: React.FC<SideloadAppProps> = ({
  onInstallApp,
  installedApps,
  onClose,
}) => {
  const [isSigning, setIsSigning] = useState<string | null>(null);
  const [jitEnabled, setJitEnabled] = useState(true);

  const isAppInstalled = (id: string) => installedApps.some((a) => a.id === id);

  const handleSideload = (ipa: SideloadPackage) => {
    setIsSigning(ipa.id);
    soundManager.playKeyClick();

    setTimeout(() => {
      onInstallApp({
        id: ipa.id,
        name: ipa.name,
        iconName: ipa.iconName,
        iconBg: ipa.iconBg,
        iconColor: 'text-white',
        category: 'Developer',
        installed: true,
        isRemovable: true,
      });
      setIsSigning(null);
      soundManager.playBuildSuccess();
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dox6 Sideload</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Enterprise CA
            </span>
          </h2>
          <p className="text-[11px] text-neutral-400">IPA Package Installer & JIT Debugger</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Certificate Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Dox6 Developer Certificate</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Active (365d)</span>
          </div>
          <div className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
            <div>Team ID: <span className="text-neutral-200">DOX6_DEV_1513</span></div>
            <div>Provisioning: <span className="text-neutral-200">Wildcard (*.dox6.app)</span></div>
          </div>
        </div>

        {/* JIT Compilation Setting */}
        <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-semibold text-white block">JIT Compilation</span>
              <span className="text-[10px] text-neutral-400">Enable high-performance emulation</span>
            </div>
          </div>
          <button
            onClick={() => {
              setJitEnabled(!jitEnabled);
              soundManager.playKeyClick();
            }}
            className={`w-10 h-6 rounded-full transition-colors relative ${
              jitEnabled ? 'bg-indigo-600' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                jitEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* IPA Packages Catalog */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
            Featured IPA Packages
          </span>

          {AVAILABLE_IPAS.map((ipa) => {
            const installed = isAppInstalled(ipa.id);
            const signing = isSigning === ipa.id;

            return (
              <div
                key={ipa.id}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className={`w-11 h-11 rounded-2xl ${ipa.iconBg} text-white flex items-center justify-center shrink-0 shadow-md`}>
                  <Package className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{ipa.name}</h4>
                  <p className="text-[10px] text-neutral-400">{ipa.developer} · {ipa.version}</p>
                  <span className="text-[10px] text-neutral-500 font-mono">{ipa.size}</span>
                </div>

                <button
                  onClick={() => handleSideload(ipa)}
                  disabled={signing}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                    installed
                      ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                      : signing
                      ? 'bg-purple-900 text-purple-200 animate-pulse'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {signing ? 'Signing...' : installed ? 'Installed' : 'Sideload'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="h-9 bg-neutral-900/90 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
        <span>Dox6 Subsystem 18.2</span>
        <span>Zero Revoke Guard</span>
      </div>
    </div>
  );
};
