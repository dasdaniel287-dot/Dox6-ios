import React, { useState } from 'react';
import {
  Play,
  Copy,
  Download,
  Terminal as TerminalIcon,
  Sparkles,
  ChevronDown,
  Layers,
  Code,
  Smartphone,
  Check,
  Search,
  X,
  Plus,
  RefreshCw,
  Cpu,
  Heart,
  DollarSign,
  CloudSun,
  Clock,
  GitBranch,
  GitCommit as GitCommitIcon,
  Share2,
  Send,
  Sliders,
  Laptop,
} from 'lucide-react';
import { CODEX_PROJECTS, SF_SYMBOLS_LIST, SAMPLE_GIT_COMMITS } from '../../data/initialData';
import { CodeXProject, DynamicIslandState, GitCommit } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface CodeXStudioAppProps {
  onClose: () => void;
  setIslandState: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
}

export const CodeXStudioApp: React.FC<CodeXStudioAppProps> = ({
  onClose,
  setIslandState,
}) => {
  const [projects, setProjects] = useState<CodeXProject[]>(CODEX_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('weather-pro');
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isSymbolsModalOpen, setIsSymbolsModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isAirDropModalOpen, setIsAirDropModalOpen] = useState<boolean>(false);
  const [isGitPanelOpen, setIsGitPanelOpen] = useState<boolean>(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTemplate, setNewProjectTemplate] = useState<'blank' | 'list' | 'dashboard' | 'game'>('blank');

  // Git State
  const [gitCommits, setGitCommits] = useState<GitCommit[]>(SAMPLE_GIT_COMMITS);
  const [commitMessage, setCommitMessage] = useState('');
  const [currentBranch, setCurrentBranch] = useState('main');

  const [symbolSearch, setSymbolSearch] = useState<string>('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [airDropTarget, setAirDropTarget] = useState<string | null>(null);
  const [airDropSuccess, setAirDropSuccess] = useState<boolean>(false);

  const [buildLogs, setBuildLogs] = useState<string[]>([
    'CodeX1513 Swift Toolchain 6.2 (LLVM 18.1.0)',
    'Target architecture: arm64-apple-ios18.2-simulator',
    'Ready for incremental compilation.',
  ]);

  // Current active project & file
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeFileObj =
    currentProject.files.find((f) => f.name === currentProject.activeFile) ||
    currentProject.files[0];
  const [currentCode, setCurrentCode] = useState<string>(activeFileObj.content);

  // Switch Project
  const handleSelectProject = (projId: string) => {
    if (projId === 'NEW_PROJECT') {
      setIsNewProjectModalOpen(true);
      return;
    }
    setActiveProjectId(projId);
    const proj = projects.find((p) => p.id === projId) || projects[0];
    const file = proj.files.find((f) => f.name === proj.activeFile) || proj.files[0];
    setCurrentCode(file.content);
    soundManager.playKeyClick();
  };

  const handleSelectFile = (fileName: string) => {
    const file = currentProject.files.find((f) => f.name === fileName);
    if (file) {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, activeFile: fileName } : p))
      );
      setCurrentCode(file.content);
      soundManager.playKeyClick();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCurrentCode(val);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            files: p.files.map((f) =>
              f.name === currentProject.activeFile ? { ...f, content: val } : f
            ),
          };
        }
        return p;
      })
    );
  };

  // Build & Run Trigger
  const handleBuildAndRun = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    soundManager.playKeyClick();

    setIslandState({
      mode: 'compact',
      activity: 'building',
      title: 'CodeX1513 Build',
      subtitle: `${currentProject.title} (arm64)`,
    });

    const timestamp = new Date().toLocaleTimeString();
    setBuildLogs((prev) => [
      ...prev,
      `[${timestamp}] ─── Starting build for target '${currentProject.title}' ───`,
      `[${timestamp}] compile_swift_sources: ${currentProject.activeFile}`,
      `[${timestamp}] emitting module '${currentProject.id}'`,
    ]);

    setTimeout(() => {
      setBuildLogs((prev) => [
        ...prev,
        `[${timestamp}] linking binary: ${currentProject.id}.app`,
        `[${timestamp}] codesign --force --sign - ${currentProject.id}.app`,
        `[${timestamp}] Build Succeeded in 0.58s (0 errors, 0 warnings)`,
      ]);
      setIsBuilding(false);
      soundManager.playBuildSuccess();

      setTimeout(() => {
        setIslandState((prev) => ({
          ...prev,
          activity: 'idle',
        }));
      }, 2500);
    }, 700);
  };

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    soundManager.playKeyClick();
    const newId = newProjectName.toLowerCase().replace(/\s+/g, '-');
    const newProj: CodeXProject = {
      id: newId,
      title: newProjectName,
      category: 'Custom iOS Project',
      description: `Custom ${newProjectTemplate} SwiftUI application created in CodeX 1513.`,
      activeFile: 'ContentView.swift',
      previewType: 'custom',
      files: [
        {
          name: 'ContentView.swift',
          path: 'Sources/ContentView.swift',
          language: 'swift',
          content: `import SwiftUI\n\nstruct ContentView: View {\n    @State private var message = "Welcome to ${newProjectName}!"\n    @State private var counter = 0\n    \n    var body: some View {\n        VStack(spacing: 20) {\n            Image(systemName: "sparkles")\n                .font(.system(size: 60))\n                .foregroundColor(.blue)\n            Text(message)\n                .font(.title2.bold())\n            Text("Counter: \\(counter)")\n                .font(.headline)\n            Button("Increment") {\n                counter += 1\n            }\n            .buttonStyle(.borderedProminent)\n        }\n        .padding()\n    }\n}`,
        },
      ],
    };

    setProjects([...projects, newProj]);
    setActiveProjectId(newId);
    setCurrentCode(newProj.files[0].content);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    soundManager.playBuildSuccess();
  };

  const handleGitCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    soundManager.playKeyClick();
    const newCommit: GitCommit = {
      hash: Math.random().toString(16).substring(2, 9),
      message: commitMessage,
      author: 'Daniel Das <dasdaniel287@gmail.com>',
      date: 'Just now',
    };
    setGitCommits([newCommit, ...gitCommits]);
    setCommitMessage('');
    soundManager.playBuildSuccess();
  };

  const handleAirDropSend = (targetDevice: string) => {
    soundManager.playAirDropSend();
    setAirDropTarget(targetDevice);
    setAirDropSuccess(false);

    setIslandState({
      mode: 'compact',
      activity: 'airdrop',
      title: 'AirDrop Sending',
      subtitle: targetDevice,
    });

    setTimeout(() => {
      setAirDropSuccess(true);
      soundManager.playBuildSuccess();
      setTimeout(() => {
        setAirDropTarget(null);
        setIsAirDropModalOpen(false);
        setIslandState((prev) => ({ ...prev, activity: 'idle' }));
      }, 1500);
    }, 1800);
  };

  const insertSnippet = (snippet: string) => {
    setCurrentCode((prev) => prev + '\n' + snippet);
    soundManager.playKeyClick();
  };

  const copySymbolCode = (sym: string) => {
    const snippet = `Image(systemName: "${sym}")`;
    navigator.clipboard?.writeText(snippet);
    setCopiedSymbol(sym);
    soundManager.playKeyClick();
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  const exportProjectCode = () => {
    soundManager.playKeyClick();
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFileObj.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------- Interactive Live Previews ---------------- */
  const [weatherTemp, setWeatherTemp] = useState(72);
  const [isCelsius, setIsCelsius] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);

  const [moveVal, setMoveVal] = useState(540);
  const [exerciseVal, setExerciseVal] = useState(22);
  const [standVal, setStandVal] = useState(11);

  const [walletBalance, setWalletBalance] = useState(14285.5);
  const [isNfcPaying, setIsNfcPaying] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('250.00');

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);

  const [sandboxCount, setSandboxCount] = useState(0);
  const [sandboxToggle, setSandboxToggle] = useState(false);

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col overflow-hidden select-none">
      {/* Top Main Toolbar */}
      <div className="h-12 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 px-3 flex items-center justify-between gap-2 shrink-0">
        {/* Project Selector & Run */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="bg-neutral-800 text-xs font-semibold text-white py-1.5 pl-3 pr-7 rounded-xl border border-white/10 focus:outline-none appearance-none cursor-pointer hover:bg-neutral-750 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                  {p.title}
                </option>
              ))}
              <option value="NEW_PROJECT" className="bg-neutral-900 text-blue-400 font-bold">
                + Create New Project...
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Build and Run Button */}
          <button
            onClick={handleBuildAndRun}
            disabled={isBuilding}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 ${
              isBuilding
                ? 'bg-blue-900 text-blue-300 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            title="Build & Run Target (⌘R)"
          >
            <Play className={`w-3.5 h-3.5 ${isBuilding ? 'animate-spin' : 'fill-white'}`} />
            <span>{isBuilding ? 'Compiling...' : 'Run'}</span>
          </button>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center bg-neutral-800/80 p-0.5 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              viewMode === 'code' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Code Only"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              viewMode === 'split' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Split Code & Simulator"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              viewMode === 'preview' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Simulator Preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Auxiliary Actions: Git, SF Symbols, AirDrop, Console, Export */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsGitPanelOpen(!isGitPanelOpen);
              soundManager.playKeyClick();
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isGitPanelOpen ? 'bg-neutral-700 text-amber-400' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            title="Git Source Control"
          >
            <GitBranch className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSymbolsModalOpen(true)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="SF Symbols Browser"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => setIsAirDropModalOpen(true)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="AirDrop Project Binary"
          >
            <Share2 className="w-4 h-4 text-blue-400" />
          </button>

          <button
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              isConsoleOpen ? 'bg-neutral-700 text-emerald-400' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            title="Toggle Build Console"
          >
            <TerminalIcon className="w-4 h-4" />
          </button>

          <button
            onClick={exportProjectCode}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Export Swift File"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary File Tabs & Snippet bar */}
      <div className="h-8 bg-neutral-900 border-b border-white/5 px-3 flex items-center justify-between text-xs overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1">
          {currentProject.files.map((file) => (
            <button
              key={file.name}
              onClick={() => handleSelectFile(file.name)}
              className={`px-3 py-1 rounded-t-lg transition-colors flex items-center gap-1.5 ${
                file.name === currentProject.activeFile
                  ? 'bg-neutral-800 text-white font-medium border-b-2 border-blue-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Insert Snippet Buttons */}
        <div className="flex items-center gap-1 text-[11px] text-neutral-400 pl-4">
          <span className="text-[10px] text-neutral-500 font-mono">Insert:</span>
          {['VStack', 'HStack', 'Button', 'Text', 'State', 'Image'].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === 'VStack') insertSnippet('VStack(spacing: 12) {\n    // content\n}');
                if (item === 'HStack') insertSnippet('HStack(spacing: 8) {\n    // content\n}');
                if (item === 'Button') insertSnippet('Button("Action") {\n    // handle tap\n}');
                if (item === 'Text') insertSnippet('Text("CodeX 1513")\n    .font(.headline)');
                if (item === 'State') insertSnippet('@State private var isEnabled: Bool = false');
                if (item === 'Image') insertSnippet('Image(systemName: "sparkles")');
              }}
              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors font-mono text-[10px]"
            >
              +{item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* GIT SOURCE CONTROL PANEL */}
        {isGitPanelOpen && (
          <div className="w-64 bg-neutral-900/95 border-r border-white/10 p-3 flex flex-col justify-between shrink-0 font-sans text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>Source Control</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {currentBranch}
                </span>
              </div>

              {/* Commit form */}
              <form onSubmit={handleGitCommit} className="space-y-2">
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Commit message (e.g. feat: add dynamic island)..."
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl p-2 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none h-16"
                />
                <button
                  type="submit"
                  disabled={!commitMessage.trim()}
                  className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <GitCommitIcon className="w-3.5 h-3.5" /> Commit to {currentBranch}
                </button>
              </form>

              {/* Commit History */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                  Commit History ({gitCommits.length})
                </span>
                <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1.5">
                  {gitCommits.map((cmt) => (
                    <div key={cmt.hash} className="p-2 rounded-xl bg-neutral-800/60 border border-white/5 space-y-0.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-cyan-400">{cmt.hash}</span>
                        <span className="text-neutral-500">{cmt.date}</span>
                      </div>
                      <p className="text-[11px] text-neutral-200 leading-snug line-clamp-2">
                        {cmt.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsGitPanelOpen(false)}
              className="text-xs text-neutral-400 hover:text-white pt-2 border-t border-white/10 text-center"
            >
              Close Git Inspector
            </button>
          </div>
        )}

        {/* LEFT / CENTER: CODE EDITOR */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col bg-neutral-950 border-r border-white/10 ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            <div className="flex-1 relative font-mono text-xs overflow-hidden flex">
              {/* Line Numbers */}
              <div className="w-10 py-3 bg-neutral-950 text-neutral-600 text-right pr-2 select-none shrink-0 font-mono text-[11px] leading-relaxed border-r border-white/5">
                {currentCode.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Editable Text Area */}
              <textarea
                value={currentCode}
                onChange={handleCodeChange}
                spellCheck={false}
                className="flex-1 h-full p-3 bg-transparent text-neutral-100 font-mono text-xs leading-relaxed resize-none focus:outline-none overflow-y-auto"
                style={{
                  tabSize: 4,
                  whiteSpace: 'pre',
                }}
              />
            </div>
          </div>
        )}

        {/* RIGHT / SIMULATOR PREVIEW */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col bg-neutral-900/60 overflow-hidden ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            {/* Simulator Device Header */}
            <div className="h-8 bg-neutral-800/60 px-3 flex items-center justify-between text-[11px] text-neutral-400 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulator · iPhone 16 Pro (iOS 18.2)</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Rendering
              </span>
            </div>

            {/* Simulator Canvas */}
            <div className="flex-1 p-4 flex items-center justify-center overflow-y-auto no-scrollbar bg-neutral-950/70">
              <div className="w-full max-w-sm rounded-[32px] bg-neutral-900 border-2 border-white/10 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between p-4 relative">
                {/* 1. WEATHER PRO PREVIEW */}
                {currentProject.previewType === 'weather' && (
                  <div className="space-y-4 text-white">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold">Cupertino, CA</span>
                      <button
                        onClick={() => {
                          setIsCelsius(!isCelsius);
                          soundManager.playKeyClick();
                        }}
                        className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px]"
                      >
                        {isCelsius ? '°C' : '°F'}
                      </button>
                    </div>

                    <div className="text-center py-2">
                      <CloudSun className="w-12 h-12 mx-auto text-amber-400" />
                      <div className="text-5xl font-light tracking-tight mt-1">
                        {isCelsius ? Math.round(((weatherTemp - 32) * 5) / 9) : weatherTemp}°
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">Sunny & Clear</p>
                      <div className="text-[11px] text-neutral-500 mt-0.5">H: 78° · L: 54°</div>
                    </div>

                    {/* Hourly Forecast Scroller */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-neutral-400 mb-2 font-medium uppercase tracking-wider">
                        Hourly Forecast
                      </div>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        {['Now', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'].map((hr, idx) => (
                          <div
                            key={hr}
                            onClick={() => {
                              setSelectedHour(idx);
                              setWeatherTemp(72 + idx);
                              soundManager.playKeyClick();
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all ${
                              selectedHour === idx
                                ? 'bg-blue-600 text-white'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            <span className="text-[10px]">{hr}</span>
                            <CloudSun className="w-4 h-4 text-amber-300" />
                            <span className="text-[11px] font-semibold">
                              {72 + idx}°
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weather Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5">
                        <span className="text-[10px] text-neutral-400">UV Index</span>
                        <div className="font-semibold text-white mt-0.5">3 (Moderate)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5">
                        <span className="text-[10px] text-neutral-400">Wind</span>
                        <div className="font-semibold text-white mt-0.5">6 mph WNW</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VITALFIT PREVIEW */}
                {currentProject.previewType === 'health' && (
                  <div className="space-y-4 text-white">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold">VitalFit Activity</span>
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>

                    {/* Concentric Rings */}
                    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#331414" strokeWidth="8" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (moveVal / 600) * 251.2}
                          fill="none"
                        />
                        <circle cx="50" cy="50" r="30" stroke="#14331e" strokeWidth="8" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="188.4"
                          strokeDashoffset={188.4 - (exerciseVal / 30) * 188.4}
                          fill="none"
                        />
                        <circle cx="50" cy="50" r="20" stroke="#0e2a33" strokeWidth="8" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="20"
                          stroke="#06b6d4"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (standVal / 12) * 125.6}
                          fill="none"
                        />
                      </svg>
                    </div>

                    {/* Ring Controls */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-rose-400 font-semibold">MOVE</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setMoveVal((m) => Math.min(m + 40, 700));
                              soundManager.playKeyClick();
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 hover:bg-rose-600/50"
                          >
                            +40 cal
                          </button>
                          <span>{moveVal} / 600 CAL</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-emerald-400 font-semibold">EXERCISE</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setExerciseVal((e) => Math.min(e + 5, 45));
                              soundManager.playKeyClick();
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50"
                          >
                            +5 min
                          </button>
                          <span>{exerciseVal} / 30 MIN</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-cyan-400 font-semibold">STAND</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setStandVal((s) => Math.min(s + 1, 12));
                              soundManager.playKeyClick();
                            }}
                            className="px-2 py-0.5 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50"
                          >
                            +1 hr
                          </button>
                          <span>{standVal} / 12 HRS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. APEX WALLET PREVIEW */}
                {currentProject.previewType === 'wallet' && (
                  <div className="space-y-4 text-white">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold">Apex Titanium Card</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-white/20 shadow-xl space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold tracking-wider text-neutral-300">
                          Apex Card
                        </span>
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                          
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-neutral-400 font-mono">•••• 1513</div>
                        <div className="text-2xl font-bold text-white mt-1">
                          ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsSendOpen(!isSendOpen);
                          soundManager.playKeyClick();
                        }}
                        className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition-colors"
                      >
                        {isSendOpen ? 'Cancel Send' : 'Send Money'}
                      </button>

                      <button
                        onClick={() => {
                          setIsNfcPaying(true);
                          soundManager.playBuildSuccess();
                          setTimeout(() => setIsNfcPaying(false), 1800);
                        }}
                        className="py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 font-semibold text-xs text-white border border-white/10 transition-colors"
                      >
                        {isNfcPaying ? '✓ Double Click' : 'Tap to Pay'}
                      </button>
                    </div>

                    {isSendOpen && (
                      <div className="p-3 rounded-xl bg-neutral-800 border border-white/10 space-y-2">
                        <span className="text-[11px] text-neutral-300">Transfer Amount:</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-2 text-xs text-white"
                          />
                          <button
                            onClick={() => {
                              const amt = parseFloat(sendAmount) || 0;
                              setWalletBalance((prev) => Math.max(0, prev - amt));
                              setIsSendOpen(false);
                              soundManager.playBuildSuccess();
                            }}
                            className="px-3 py-1 bg-emerald-600 rounded-lg text-xs font-semibold"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. FOCUSPULSE PREVIEW */}
                {currentProject.previewType === 'timer' && (
                  <div className="space-y-6 text-white text-center py-4">
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      FocusPulse Pomodoro
                    </div>

                    <div className="text-4xl font-light font-mono text-white">
                      {Math.floor(timerSeconds / 60)}:
                      {timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setTimerRunning(!timerRunning);
                          soundManager.playKeyClick();
                        }}
                        className="px-4 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white shadow-lg"
                      >
                        {timerRunning ? 'Pause' : 'Start Focus'}
                      </button>
                      <button
                        onClick={() => {
                          setTimerSeconds(25 * 60);
                          setTimerRunning(false);
                          soundManager.playKeyClick();
                        }}
                        className="px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. CUSTOM SANDBOX PREVIEW */}
                {currentProject.previewType === 'custom' && (
                  <div className="space-y-4 text-white text-center py-4">
                    <Cpu className="w-12 h-12 mx-auto text-orange-400" />
                    <h4 className="text-sm font-semibold">{currentProject.title}</h4>
                    <p className="text-xs text-neutral-400">
                      Counter Value: <span className="font-mono text-white font-bold">{sandboxCount}</span>
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSandboxCount((c) => c - 1);
                          soundManager.playKeyClick();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 text-xs font-semibold"
                      >
                        - Decrement
                      </button>
                      <button
                        onClick={() => {
                          setSandboxCount((c) => c + 1);
                          soundManager.playKeyClick();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-xs font-semibold"
                      >
                        + Increment
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-800/80 flex items-center justify-between text-xs">
                      <span>Dynamic Island Sync</span>
                      <button
                        onClick={() => {
                          setSandboxToggle(!sandboxToggle);
                          soundManager.playKeyClick();
                        }}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          sandboxToggle ? 'bg-emerald-500' : 'bg-neutral-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            sandboxToggle ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Console Drawer */}
      {isConsoleOpen && (
        <div className="h-36 bg-black/95 border-t border-white/10 p-3 flex flex-col justify-between font-mono text-[11px] shrink-0">
          <div className="flex items-center justify-between pb-1 border-b border-white/10 text-neutral-400">
            <span className="flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>CodeX Diagnostics & Compilation Logs</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500">RAM: 42 MB · FPS: 60</span>
              <button
                onClick={() => setBuildLogs([])}
                className="hover:text-white"
                title="Clear Logs"
              >
                Clear
              </button>
              <button onClick={() => setIsConsoleOpen(false)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5 pt-1 text-neutral-300">
            {buildLogs.map((log, i) => (
              <div key={i} className="leading-snug">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {isNewProjectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsNewProjectModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/15 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Create New iOS Project</h3>
                <p className="text-[11px] text-neutral-400">Bootstrap a fresh SwiftUI application</p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProject} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. FlightPulse, SpatialCanvas, NeuralNotes"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                  Starter Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'blank', label: 'Blank Canvas' },
                    { id: 'list', label: 'List & Navigation' },
                    { id: 'dashboard', label: 'Metrics Dashboard' },
                    { id: 'game', label: 'SpriteKit 2D' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setNewProjectTemplate(tpl.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        newProjectTemplate === tpl.id
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-medium'
                          : 'bg-neutral-800 border-white/5 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold shadow-md"
                >
                  Create App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AIRDROP MODAL */}
      {isAirDropModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsAirDropModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/15 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">AirDrop</h3>
                <p className="text-[11px] text-neutral-400">Share "{currentProject.title}" with nearby Apple devices</p>
              </div>
              <button
                onClick={() => setIsAirDropModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {[
                { name: "Daniel's MacBook Pro M4", type: 'MacBook', icon: Laptop },
                { name: "Daniel's iPad Pro (M4)", type: 'iPad Pro', icon: Smartphone },
                { name: "Developer iPhone 16 Pro", type: 'iPhone', icon: Smartphone },
              ].map((device) => (
                <button
                  key={device.name}
                  onClick={() => handleAirDropSend(device.name)}
                  className="w-full p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-750 border border-white/10 flex items-center gap-3 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <device.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">{device.name}</h5>
                    <span className="text-[10px] text-neutral-400">{device.type} · Ready to receive</span>
                  </div>
                </button>
              ))}
            </div>

            {airDropTarget && (
              <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200 text-center animate-pulse">
                {airDropSuccess
                  ? `✓ Sent to ${airDropTarget}!`
                  : `Connecting to ${airDropTarget}...`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SF Symbols Browser Modal */}
      {isSymbolsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsSymbolsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/15 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">SF Symbols Library</h3>
                <p className="text-[11px] text-neutral-400">Tap any symbol to copy Swift code</p>
              </div>
              <button
                onClick={() => setIsSymbolsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 border border-white/10">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                placeholder="Search symbol names (e.g. sun, heart, swift)..."
                className="bg-transparent border-none text-xs text-white placeholder-neutral-400 focus:outline-none w-full"
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto no-scrollbar pt-1">
              {SF_SYMBOLS_LIST.filter((s) =>
                s.name.toLowerCase().includes(symbolSearch.toLowerCase())
              ).map((sym) => (
                <button
                  key={sym.name}
                  onClick={() => copySymbolCode(sym.name)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    copiedSymbol === sym.name
                      ? 'bg-emerald-600 text-white border-emerald-500 scale-105'
                      : 'bg-neutral-800/80 hover:bg-neutral-750 text-neutral-200 border-white/5'
                  }`}
                  title={`Copy Image(systemName: "${sym.name}")`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-[9px] truncate w-full font-mono">{sym.name}</span>
                </button>
              ))}
            </div>

            {copiedSymbol && (
              <div className="text-center text-xs text-emerald-400 font-semibold">
                ✓ Copied: Image(systemName: "{copiedSymbol}")
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
