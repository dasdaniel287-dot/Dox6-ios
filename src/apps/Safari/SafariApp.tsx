import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  Share,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Code,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SafariAppProps {
  onClose: () => void;
}

interface DocArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  codeSnippet?: string;
}

const DOCS: DocArticle[] = [
  {
    id: 'swiftui-state',
    title: 'Managing State in Modern SwiftUI 6',
    category: 'SwiftUI Guides',
    readTime: '4 min read',
    summary:
      'With Swift 6 and the Observation framework, the @Observable macro replaces ObservableObject. Views automatically register dependencies for properties they access.',
    codeSnippet: `@Observable
class FlightTracker {
    var flightNumber = "AA1513"
    var altitude = 32000
    var isCruising: Bool { altitude > 28000 }
}`,
  },
  {
    id: 'dynamic-island-apis',
    title: 'Live Activities & Dynamic Island Architecture',
    category: 'iOS 18 APIs',
    readTime: '6 min read',
    summary:
      'ActivityKit enables apps to deliver real-time information to the Dynamic Island and Lock Screen using concise SwiftUI presentation layouts (compactLeading, compactTrailing, and expanded).',
    codeSnippet: `struct CodeXActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BuildAttributes.self) { context in
            LockScreenLiveActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) { Text("CodeX") }
                DynamicIslandExpandedRegion(.trailing) { Text("98%") }
            } compactLeading: {
                Image(systemName: "sparkles")
            } compactTrailing: {
                Text("Arm64")
            }
        }
    }
}`,
  },
  {
    id: 'hig-liquid-glass',
    title: 'Apple Human Interface Guidelines: Spatial Blur & Haptics',
    category: 'Design Systems',
    readTime: '5 min read',
    summary:
      'Designing for iOS 18 requires deep respect for visual hierarchy: avoid pill badges over pill badges, preserve 44pt minimum touch targets, and use dynamic vibrancy materials.',
  },
  {
    id: 'swift-concurrency',
    title: 'Strict Concurrency and Data Race Safety',
    category: 'Swift 6 Architecture',
    readTime: '7 min read',
    summary:
      'Complete concurrency checking is enabled by default in Swift 6. Understand Sendable types, actor isolation domains, and preventing cross-isolation boundary mutations.',
  },
];

export const SafariApp: React.FC<SafariAppProps> = ({ onClose }) => {
  const [url, setUrl] = useState('developer.apple.com/codex-1513');
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'article'>('bookmarks');
  const [selectedArticle, setSelectedArticle] = useState<DocArticle>(DOCS[0]);

  const handleOpenArticle = (article: DocArticle) => {
    setSelectedArticle(article);
    setActiveTab('article');
    setUrl(`developer.apple.com/docs/${article.id}`);
    soundManager.playKeyClick();
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Browser Bar */}
      <div className="pt-2 pb-2 px-3 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Back / Forward / Refresh */}
          <button
            onClick={() => {
              if (activeTab === 'article') setActiveTab('bookmarks');
              soundManager.playKeyClick();
            }}
            disabled={activeTab === 'bookmarks'}
            className="p-1 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => soundManager.playKeyClick()}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Address & Search Input */}
          <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/90 border border-white/10 text-xs">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-transparent border-none text-white text-xs w-full focus:outline-none font-mono"
            />
          </div>

          <button
            onClick={() => soundManager.playKeyClick()}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Browser Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {activeTab === 'bookmarks' ? (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Apple Developer Header Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-neutral-900 border border-blue-500/20 shadow-lg">
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                Apple Developer Documentation
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                CodeX 1513 iOS Developer Reference
              </h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Explore official developer guides, SwiftUI architectures, Swift 6 concurrency patterns, and Human Interface Guidelines.
              </p>
            </div>

            {/* Articles List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 px-1 uppercase tracking-wider">
                Featured Guides & Frameworks
              </div>
              {DOCS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleOpenArticle(doc)}
                  className="p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-white/10 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span className="text-blue-400 font-medium">{doc.category}</span>
                      <span>·</span>
                      <span>{doc.readTime}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ARTICLE DETAIL VIEW */
          <div className="space-y-4 max-w-xl mx-auto pb-8">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Guides
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                <span>{selectedArticle.category}</span>
                <span>·</span>
                <span className="text-neutral-400">{selectedArticle.readTime}</span>
              </div>
              <h1 className="text-xl font-bold text-white leading-tight">
                {selectedArticle.title}
              </h1>
              <p className="text-xs text-neutral-300 leading-relaxed pt-2">
                {selectedArticle.summary}
              </p>
            </div>

            {selectedArticle.codeSnippet && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Swift Implementation</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedArticle.codeSnippet || '');
                      soundManager.playKeyClick();
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Copy Snippet
                  </button>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 font-mono text-[11px] text-neutral-200 overflow-x-auto leading-relaxed">
                  <pre>{selectedArticle.codeSnippet}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Safari Bar */}
      <div className="h-10 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-between text-neutral-400 text-xs shrink-0">
        <button onClick={() => setActiveTab('bookmarks')} className="hover:text-white flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>Guides</span>
        </button>
        <span className="text-[11px] text-neutral-500">Apple WebKit · Safari 18</span>
      </div>
    </div>
  );
};
