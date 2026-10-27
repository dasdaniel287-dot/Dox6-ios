import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface TerminalAppProps {
  onClose: () => void;
  onQuickRunCodeX?: () => void;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ onClose, onQuickRunCodeX }) => {
  const [history, setHistory] = useState<string[]>([
    'CodeX1513 Darwin Core (v24.2.0-arm64)',
    'Type "help" for a list of developer commands.',
    '',
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    soundManager.playKeyClick();
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs = [`codex@ios:~$ ${trimmed}`];

    switch (command) {
      case 'help':
        newLogs.push(
          'Available CodeX 1513 Commands:',
          '  swift --version     Display Swift toolchain compiler version',
          '  codex build         Compile active SwiftUI project target',
          '  xcrun simctl list   List available iOS simulators & devices',
          '  uname -a            Print system kernel architecture',
          '  ls                  List directory contents',
          '  cat <file>          Print file contents (e.g. cat ContentView.swift)',
          '  whoami              Print active developer credentials',
          '  date                Print current timestamp',
          '  clear               Clear console screen'
        );
        break;

      case 'swift':
        if (args[0] === '--version' || args[0] === '-v') {
          newLogs.push(
            'Apple Swift version 6.2 (swiftlang-6.2.0.12 clang-1600.0.3)',
            'Target: arm64-apple-ios18.2-simulator',
            'Toolchain: CodeX1513 Embedded LLVM 18'
          );
        } else {
          newLogs.push('Swift interactive REPL ready. Type :help or swift --version');
        }
        break;

      case 'codex':
        if (args[0] === 'build' || args[0] === 'run') {
          newLogs.push(
            'Initiating CodeX 1513 LLVM pipeline...',
            '[1/3] Compiling Swift sources for arm64...',
            '[2/3] Resolving symbols & asset catalogs...',
            '[3/3] Linking Mach-O binary...',
            'Build Succeeded in 0.42s (0 warnings)'
          );
          if (onQuickRunCodeX) onQuickRunCodeX();
        } else {
          newLogs.push('Usage: codex build | codex test | codex run');
        }
        break;

      case 'xcrun':
        newLogs.push(
          '== Devices ==',
          '-- iOS 18.2 --',
          '    iPhone 16 Pro (37AC3E76-CFA8-4CDD-9FC8-E5D7065DD357) (Booted)',
          '    iPhone 16 Pro Max (F4B2E8A1-1513-4ABC-90EF-1234567890AB) (Shutdown)',
          '    iPad Pro (M4) (D8A7C6B5-1513-4000-8888-AABBCCDDEEFF) (Available)'
        );
        break;

      case 'uname':
        newLogs.push('Darwin CodeX-iPhone 24.2.0 Darwin Kernel Version 24.2.0: arm64');
        break;

      case 'ls':
        newLogs.push(
          'drwxr-xr-x  Sources/       ContentView.swift  AppModel.swift',
          'drwxr-xr-x  Assets/        Assets.xcassets    AppIcon.png',
          '-rw-r--r--  Package.swift  Info.plist'
        );
        break;

      case 'cat':
        if (args[0]?.includes('ContentView')) {
          newLogs.push('import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text("CodeX 1513 iOS")\n    }\n}');
        } else {
          newLogs.push('Package.swift (Swift 6.0 Package Manifest for CodeX1513)');
        }
        break;

      case 'whoami':
        newLogs.push('developer@codex-1513-ios.local');
        break;

      case 'date':
        newLogs.push(new Date().toString());
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newLogs.push(`codex-sh: command not found: ${command}. Type "help" for instructions.`);
        break;
    }

    setHistory((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="w-full h-full bg-black text-emerald-400 font-mono text-xs flex flex-col justify-between p-4 overflow-hidden select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40 text-[11px] text-emerald-600 shrink-0">
        <span className="flex items-center gap-1.5">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>zsh · arm64 · 80x24</span>
        </span>
        <button
          onClick={() => {
            setHistory([]);
            soundManager.playKeyClick();
          }}
          className="hover:text-emerald-300"
        >
          Clear
        </button>
      </div>

      {/* Terminal Logs Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-1">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt Row */}
      <div className="flex items-center gap-2 pt-2 border-t border-emerald-900/40 shrink-0">
        <span className="text-emerald-500 font-bold shrink-0">codex@ios:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-emerald-300 border-none focus:outline-none font-mono text-xs"
        />
      </div>
    </div>
  );
};
