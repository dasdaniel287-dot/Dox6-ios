import React, { useState } from 'react';
import {
  Search,
  Download,
  Check,
  Star,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Compass,
} from 'lucide-react';
import { AppIconConfig } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface StoreAppItem {
  id: string;
  name: string;
  category: 'Developer' | 'Utilities' | 'Media' | 'Productivity';
  rating: number;
  reviewsCount: string;
  iconBg: string;
  iconColor: string;
  iconName: string;
  description: string;
  size: string;
}

const STORE_CATALOG: StoreAppItem[] = [
  {
    id: 'git-lens',
    name: 'GitLens Mobile',
    category: 'Developer',
    rating: 4.9,
    reviewsCount: '12K',
    iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500',
    iconColor: 'text-white',
    iconName: 'Code2',
    description: 'Visual Git commit graph, branch merge inspector, and blame lens for iOS repositories.',
    size: '34 MB',
  },
  {
    id: 'postman-lite',
    name: 'API Inspector Pro',
    category: 'Developer',
    rating: 4.8,
    reviewsCount: '45K',
    iconBg: 'bg-gradient-to-tr from-orange-600 to-red-500',
    iconColor: 'text-white',
    iconName: 'Compass',
    description: 'Test REST, GraphQL, and WebSocket endpoints with headers and mock responses.',
    size: '42 MB',
  },
  {
    id: 'regex-lab',
    name: 'Regex Lab',
    category: 'Utilities',
    rating: 4.7,
    reviewsCount: '8.4K',
    iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600',
    iconColor: 'text-white',
    iconName: 'Terminal',
    description: 'Real-time Regular Expression testing with pattern visualizer and Swift code generator.',
    size: '18 MB',
  },
  {
    id: 'metal-bench',
    name: 'Metal GPU Benchmark',
    category: 'Developer',
    rating: 4.9,
    reviewsCount: '19K',
    iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    iconColor: 'text-white',
    iconName: 'Cpu',
    description: 'Measure A18 Pro Metal 3 compute shaders, ray tracing fps, and bandwidth.',
    size: '88 MB',
  },
];

interface AppStoreAppProps {
  installedApps: AppIconConfig[];
  onInstallApp: (app: AppIconConfig) => void;
  onUninstallApp: (appId: string) => void;
  onClose: () => void;
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({
  installedApps,
  onInstallApp,
  onUninstallApp,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const isInstalled = (id: string) => installedApps.some((a) => a.id === id);

  const handleInstallClick = (item: StoreAppItem) => {
    if (isInstalled(item.id)) {
      onUninstallApp(item.id);
      soundManager.playKeyClick();
      return;
    }

    setInstallingId(item.id);
    soundManager.playKeyClick();

    setTimeout(() => {
      onInstallApp({
        id: item.id,
        name: item.name,
        iconName: item.iconName,
        iconBg: item.iconBg,
        iconColor: item.iconColor,
        category: item.category,
        installed: true,
        isRemovable: true,
      });
      setInstallingId(null);
      soundManager.playBuildSuccess();
    }, 900);
  };

  const handleInstallAll = () => {
    soundManager.playBuildSuccess();
    STORE_CATALOG.forEach((item) => {
      if (!isInstalled(item.id)) {
        onInstallApp({
          id: item.id,
          name: item.name,
          iconName: item.iconName,
          iconBg: item.iconBg,
          iconColor: item.iconColor,
          category: item.category,
          installed: true,
          isRemovable: true,
        });
      }
    });
  };

  const filtered = STORE_CATALOG.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allInstalled = STORE_CATALOG.every((item) => isInstalled(item.id));

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">App Store</h2>
          <button
            onClick={handleInstallAll}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
              allInstalled ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{allInstalled ? 'All Apps Installed' : 'Install All Apps'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-neutral-800 border border-white/10 text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Developer Apps, Compilers, Tools..."
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Featured Banner & App List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-neutral-900 border border-blue-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              Apple Design Award Winner
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
              iOS 18.2 Ready
            </span>
          </div>
          <h3 className="text-base font-bold text-white">CodeX 1513 Developer Toolkit</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Everything you need to engineer, profile, and ship Swift 6 apps right on your device.
          </p>
          <div className="pt-1">
            <button
              onClick={handleInstallAll}
              className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors shadow-md"
            >
              {allInstalled ? '✓ All Ecosystem Apps Ready' : 'Install Entire iOS Suite'}
            </button>
          </div>
        </div>

        {/* App List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
            Featured Developer Tools
          </div>

          {filtered.map((item) => {
            const installed = isInstalled(item.id);
            const inProgress = installingId === item.id;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-md`}>
                  <Code2 className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                    </span>
                    <span>·</span>
                    <span>{item.size}</span>
                  </div>
                </div>

                {/* Get / Installed button */}
                <button
                  onClick={() => handleInstallClick(item)}
                  disabled={inProgress}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm shrink-0 ${
                    installed
                      ? 'bg-neutral-800 text-neutral-300 hover:text-rose-400 hover:bg-neutral-750'
                      : inProgress
                      ? 'bg-blue-900 text-blue-300 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {inProgress ? 'Installing...' : installed ? 'Remove' : 'GET'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
