import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Image as ImageIcon,
  Key,
  Search,
  Plus,
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_FILES } from '../../data/initialData';
import { FileItem } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface FilesAppProps {
  onClose: () => void;
}

export const FilesApp: React.FC<FilesAppProps> = ({ onClose }) => {
  const [files, setFiles] = useState<FileItem[]>(SAMPLE_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('All Files');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'swift':
        return <FileCode className="w-5 h-5 text-orange-400" />;
      case 'json':
        return <FileText className="w-5 h-5 text-yellow-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-cyan-400" />;
      case 'cert':
        return <Key className="w-5 h-5 text-rose-400" />;
      default:
        return <Folder className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleDownload = (file: FileItem) => {
    soundManager.playKeyClick();
    const content = file.content || `// CodeX 1513 File: ${file.name}\n// Path: ${file.path}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    soundManager.playKeyClick();
    setFiles(files.filter((f) => f.id !== id));
    if (selectedFile?.id === id) setSelectedFile(null);
  };

  const handleAddNewFile = () => {
    soundManager.playKeyClick();
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: `NewComponent_${Math.floor(Math.random() * 100)}.swift`,
      size: '2.4 KB',
      type: 'swift',
      updatedAt: 'Just now',
      path: 'CodeX Projects/NewComponent.swift',
      content: `import SwiftUI\n\nstruct NewComponent: View {\n    var body: some View {\n        Text("Hello CodeX")\n    }\n}`,
    };
    setFiles([newFile, ...files]);
  };

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="pt-3 pb-2 px-4 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Files</h2>
          <span className="text-[11px] text-neutral-400">iCloud Drive · CodeX Workspace</span>
        </div>
        <button
          onClick={handleAddNewFile}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          title="Create New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 bg-neutral-900/60 border-b border-white/5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-neutral-800 border border-white/10 text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files and packages..."
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Main Files List or File Preview */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        {selectedFile ? (
          <div className="space-y-4">
            <button
              onClick={() => {
                setSelectedFile(null);
                soundManager.playKeyClick();
              }}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Files
            </button>

            <div className="p-4 rounded-3xl bg-neutral-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                  {getFileIcon(selectedFile.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{selectedFile.name}</h3>
                  <p className="text-[11px] text-neutral-400">{selectedFile.size} · {selectedFile.updatedAt}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 font-mono text-[11px] text-neutral-300 overflow-x-auto border border-white/5 max-h-48">
                <pre>{selectedFile.content || `// File located at: ${selectedFile.path}\n// Ready for CodeX compiler.`}</pre>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  soundManager.playKeyClick();
                }}
                className="p-3 rounded-2xl bg-neutral-900/70 hover:bg-neutral-850 border border-white/10 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-semibold text-white truncate">{file.name}</h4>
                    <span className="text-[10px] text-neutral-400">{file.size} · {file.updatedAt}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-9 bg-neutral-900/90 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
        <span>{files.length} items</span>
        <span>184 GB available on iCloud</span>
      </div>
    </div>
  );
};
