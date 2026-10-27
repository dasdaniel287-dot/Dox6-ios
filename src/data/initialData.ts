import { AppIconConfig, CodeXProject, MusicTrack, NotificationItem, NoteItem, PhotoItem, ConversationItem, FileItem, GitCommit } from '../types/ios';

export const WALLPAPERS = [
  {
    id: 'dox6-obsidian',
    name: 'Dox6 Obsidian Pro',
    gradient: 'from-[#050505] via-[#121217] to-[#1f1e29]',
    accent: '#6366f1',
    type: 'dark',
    bgStyle: 'radial-gradient(circle at 50% 30%, #2e284a 0%, #110e1e 40%, #06050a 100%)',
  },
  {
    id: 'dox6-cyber',
    name: 'Dox6 Cyber Titanium',
    gradient: 'from-[#2e1c0c] via-[#1c1611] to-[#080706]',
    accent: '#f59e0b',
    type: 'dark',
    bgStyle: 'linear-gradient(135deg, #45240f 0%, #1e1208 40%, #0d0a08 80%, #000000 100%)',
  },
  {
    id: 'ios18-titanium',
    name: 'Titanium Glow',
    gradient: 'from-[#1c1917] via-[#292524] to-[#0c0a09]',
    accent: '#f59e0b',
    type: 'dark',
    bgStyle: 'radial-gradient(ellipse at top, #332a24 0%, #151419 50%, #09090b 100%)',
  },
  {
    id: 'ios18-aurora',
    name: 'Dynamic Aurora',
    gradient: 'from-[#064e3b] via-[#0f172a] to-[#311042]',
    accent: '#10b981',
    type: 'dark',
    bgStyle: 'radial-gradient(circle at 80% 20%, #10b981 0%, #064e3b 25%, #0f172a 70%, #020617 100%)',
  },
  {
    id: 'ios18-neon',
    name: 'Neon Horizon',
    gradient: 'from-[#1e1b4b] via-[#4c1d95] to-[#831843]',
    accent: '#a855f7',
    type: 'dark',
    bgStyle: 'linear-gradient(145deg, #18092e 0%, #3b0764 40%, #831843 75%, #0f172a 100%)',
  },
  {
    id: 'ios18-ocean',
    name: 'Pacific Blue',
    gradient: 'from-[#082f49] via-[#0c4a6e] to-[#0284c7]',
    accent: '#38bdf8',
    type: 'dark',
    bgStyle: 'radial-gradient(circle at 20% 30%, #0284c7 0%, #0369a1 35%, #082f49 75%, #020617 100%)',
  },
  {
    id: 'ios18-desert',
    name: 'Desert Gold',
    gradient: 'from-[#451a03] via-[#78350f] to-[#b45309]',
    accent: '#f59e0b',
    type: 'dark',
    bgStyle: 'linear-gradient(160deg, #2c1810 0%, #572914 45%, #92400e 80%, #180e0a 100%)',
  },
  {
    id: 'ios18-monolith',
    name: 'Minimal Onyx',
    gradient: 'from-[#18181b] via-[#09090b] to-[#000000]',
    accent: '#e4e4e7',
    type: 'dark',
    bgStyle: 'radial-gradient(ellipse at center, #27272a 0%, #18181b 45%, #09090b 100%)',
  },
];

export const DEFAULT_APPS: AppIconConfig[] = [
  {
    id: 'phone',
    name: 'Phone',
    iconName: 'Phone',
    iconBg: 'bg-gradient-to-tr from-emerald-500 to-green-600',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'codex',
    name: 'CodeX Studio',
    iconName: 'Code2',
    iconBg: 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400',
    iconColor: 'text-white',
    badge: 1,
    category: 'Developer',
    installed: true,
  },
  {
    id: 'clock',
    name: 'Clock',
    iconName: 'Clock',
    iconBg: 'bg-gradient-to-tr from-neutral-900 via-neutral-800 to-black border border-white/20',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'reminders',
    name: 'Reminders',
    iconName: 'ListChecks',
    iconBg: 'bg-gradient-to-tr from-white to-neutral-200',
    iconColor: 'text-blue-500',
    badge: 4,
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    iconName: 'Terminal',
    iconBg: 'bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700',
    iconColor: 'text-emerald-400',
    category: 'Developer',
    installed: true,
  },
  {
    id: 'safari',
    name: 'Safari',
    iconName: 'Compass',
    iconBg: 'bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600',
    iconColor: 'text-white',
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    iconName: 'Settings',
    iconBg: 'bg-gradient-to-tr from-neutral-500 via-neutral-600 to-neutral-400',
    iconColor: 'text-white',
    category: 'System',
    installed: true,
  },
  {
    id: 'appstore',
    name: 'App Store',
    iconName: 'ShoppingBag',
    iconBg: 'bg-gradient-to-tr from-blue-500 to-sky-400',
    iconColor: 'text-white',
    badge: 2,
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'sideload',
    name: 'Dox6 Sideload',
    iconName: 'Package',
    iconBg: 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500',
    iconColor: 'text-white',
    category: 'Developer',
    installed: true,
  },
  {
    id: 'weather',
    name: 'Weather',
    iconName: 'CloudSun',
    iconBg: 'bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-600',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'health',
    name: 'Health',
    iconName: 'HeartPulse',
    iconBg: 'bg-gradient-to-tr from-white to-neutral-100',
    iconColor: 'text-rose-500',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'voicememos',
    name: 'Voice Memos',
    iconName: 'Mic',
    iconBg: 'bg-gradient-to-tr from-neutral-950 via-neutral-900 to-rose-950',
    iconColor: 'text-rose-400',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'music',
    name: 'Music',
    iconName: 'Music',
    iconBg: 'bg-gradient-to-tr from-red-500 via-pink-500 to-rose-400',
    iconColor: 'text-white',
    category: 'Media',
    installed: true,
  },
  {
    id: 'camera',
    name: 'Camera',
    iconName: 'Camera',
    iconBg: 'bg-gradient-to-tr from-neutral-700 via-neutral-600 to-neutral-500',
    iconColor: 'text-white',
    category: 'Media',
    installed: true,
  },
  {
    id: 'photos',
    name: 'Photos',
    iconName: 'Image',
    iconBg: 'bg-gradient-to-tr from-amber-400 via-rose-400 to-violet-500',
    iconColor: 'text-white',
    category: 'Media',
    installed: true,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    iconName: 'Calculator',
    iconBg: 'bg-gradient-to-tr from-neutral-900 to-orange-500',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    iconName: 'FileText',
    iconBg: 'bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500',
    iconColor: 'text-neutral-900',
    badge: 3,
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'messages',
    name: 'Messages',
    iconName: 'MessageCircle',
    iconBg: 'bg-gradient-to-tr from-emerald-500 to-green-600',
    iconColor: 'text-white',
    badge: 2,
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'files',
    name: 'Files',
    iconName: 'Folder',
    iconBg: 'bg-gradient-to-tr from-blue-400 to-blue-600',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'maps',
    name: 'Maps',
    iconName: 'MapPin',
    iconBg: 'bg-gradient-to-tr from-sky-400 via-emerald-400 to-emerald-600',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'mail',
    name: 'Mail',
    iconName: 'Mail',
    iconBg: 'bg-gradient-to-tr from-sky-400 to-blue-600',
    iconColor: 'text-white',
    badge: 2,
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'stocks',
    name: 'Stocks',
    iconName: 'TrendingUp',
    iconBg: 'bg-gradient-to-tr from-neutral-900 via-neutral-800 to-black border border-white/20',
    iconColor: 'text-emerald-400',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'wallet',
    name: 'Wallet',
    iconName: 'CreditCard',
    iconBg: 'bg-gradient-to-tr from-neutral-900 to-neutral-700',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
  },
  {
    id: 'facetime',
    name: 'FaceTime',
    iconName: 'Video',
    iconBg: 'bg-gradient-to-tr from-emerald-500 to-green-600',
    iconColor: 'text-white',
    category: 'Productivity',
    installed: true,
  },
  {
    id: 'podcasts',
    name: 'Podcasts',
    iconName: 'Radio',
    iconBg: 'bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-800',
    iconColor: 'text-white',
    category: 'Media',
    installed: true,
  },
  {
    id: 'git-lens',
    name: 'GitLens Mobile',
    iconName: 'GitBranch',
    iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500',
    iconColor: 'text-white',
    category: 'Developer',
    installed: true,
    isRemovable: true,
  },
  {
    id: 'postman-lite',
    name: 'API Inspector',
    iconName: 'Globe',
    iconBg: 'bg-gradient-to-tr from-orange-600 to-red-500',
    iconColor: 'text-white',
    category: 'Developer',
    installed: true,
    isRemovable: true,
  },
  {
    id: 'regex-lab',
    name: 'Regex Lab',
    iconName: 'Code',
    iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600',
    iconColor: 'text-white',
    category: 'Utilities',
    installed: true,
    isRemovable: true,
  },
  {
    id: 'metal-bench',
    name: 'Metal GPU',
    iconName: 'Cpu',
    iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    iconColor: 'text-white',
    category: 'Developer',
    installed: true,
    isRemovable: true,
  },
];

export const SAMPLE_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    contactName: 'Apple Developer Relations',
    contactRole: 'Cupertino, CA',
    avatar: '',
    unread: true,
    messages: [
      {
        id: 'm1',
        sender: 'Apple Developer Relations',
        avatar: '',
        text: 'Congratulations! Your CodeX 1513 app build has passed TestFlight pre-validation checks for iOS 18.2.',
        time: '11:15 AM',
        isMe: false,
      },
      {
        id: 'm2',
        sender: 'You',
        avatar: 'DD',
        text: 'Thank you! We just verified strict concurrency with Swift 6.',
        time: '11:18 AM',
        isMe: true,
      },
      {
        id: 'm3',
        sender: 'Apple Developer Relations',
        avatar: '',
        text: 'Awesome. Liquid glass and spatial haptic responses look pristine.',
        time: '11:21 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Sarah Lin',
    contactRole: 'Lead iOS Architect',
    avatar: 'SL',
    unread: true,
    messages: [
      {
        id: 'm21',
        sender: 'Sarah Lin',
        avatar: 'SL',
        text: 'Hey Daniel, did you test the new ActivityRing SwiftUI custom modifier?',
        time: '10:45 AM',
        isMe: false,
      },
      {
        id: 'm22',
        sender: 'Sarah Lin',
        avatar: 'SL',
        text: 'Here is the helper struct for the animation curve:',
        time: '10:46 AM',
        isMe: false,
        codeSnippet: `withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
    ringProgress = min(1.0, currentVal / targetVal)
}`,
      },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Alex Mercer',
    contactRole: 'Core Metal Engineer',
    avatar: 'AM',
    unread: false,
    messages: [
      {
        id: 'm31',
        sender: 'Alex Mercer',
        avatar: 'AM',
        text: 'The A18 Pro GPU benchmarks in CodeX Terminal are clocking steady 60fps at 4K.',
        time: 'Yesterday',
        isMe: false,
      },
      {
        id: 'm32',
        sender: 'You',
        avatar: 'DD',
        text: 'Incredible work on the LLVM pipeline.',
        time: 'Yesterday',
        isMe: true,
      },
    ],
  },
];

export const SAMPLE_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'WeatherPro.swift',
    size: '14.2 KB',
    type: 'swift',
    updatedAt: 'Today, 11:20 AM',
    path: 'CodeX Projects/WeatherPro/WeatherPro.swift',
  },
  {
    id: 'f-2',
    name: 'VitalFitView.swift',
    size: '22.8 KB',
    type: 'swift',
    updatedAt: 'Today, 10:14 AM',
    path: 'CodeX Projects/VitalFit/VitalFitView.swift',
  },
  {
    id: 'f-3',
    name: 'ApplePayCert.p12',
    size: '4.8 KB',
    type: 'cert',
    updatedAt: 'Oct 26, 2026',
    path: 'Certificates/ApplePayCert.p12',
  },
  {
    id: 'f-4',
    name: 'Package.resolved',
    size: '8.1 KB',
    type: 'json',
    updatedAt: 'Oct 25, 2026',
    path: 'Config/Package.resolved',
  },
  {
    id: 'f-5',
    name: 'AppIcon-1024.png',
    size: '1.2 MB',
    type: 'image',
    updatedAt: 'Oct 24, 2026',
    path: 'Assets/AppIcon-1024.png',
  },
];

export const SAMPLE_GIT_COMMITS: GitCommit[] = [
  {
    hash: 'a1513f2',
    message: 'feat: add Swift 6 Observation and ActivityKit Live Activities',
    author: 'Daniel Das <dasdaniel287@gmail.com>',
    date: '12 minutes ago',
  },
  {
    hash: 'c8842e1',
    message: 'perf: optimize Metal shaders and smooth 60fps ring animations',
    author: 'Daniel Das <dasdaniel287@gmail.com>',
    date: '2 hours ago',
  },
  {
    hash: 'e419b03',
    message: 'init: bootstrap CodeX 1513 iOS 18 toolchain & simulator',
    author: 'Daniel Das <dasdaniel287@gmail.com>',
    date: 'Yesterday',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    appId: 'codex',
    appName: 'CodeX Studio',
    title: 'Build Succeeded',
    message: 'VitalFit iOS target compiled cleanly in 0.62s. 0 warnings.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    appId: 'safari',
    appName: 'Apple Developer',
    title: 'WWDC26 Preview',
    message: 'Swift 6.2 and SwiftUI Spatial Canvas APIs are now documented.',
    time: '24m ago',
    unread: true,
  },
  {
    id: 'notif-3',
    appId: 'notes',
    appName: 'Notes',
    title: 'Architecture Spec',
    message: 'Shared note "CodeX1513 Compiler Pipeline" was synced to iCloud.',
    time: '1h ago',
    unread: false,
  },
];

export const MUSIC_PLAYLIST: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Midnight Compiling',
    artist: 'CodeX Beats',
    album: 'Silicon Dreams',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    accentColor: '#3b82f6',
  },
  {
    id: 'track-2',
    title: 'Infinite Loop in Cupertino',
    artist: 'Neural Wave',
    album: 'Subroutine Symphony',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    accentColor: '#10b981',
  },
  {
    id: 'track-3',
    title: 'SwiftUI Glassmorphism',
    artist: 'Cupertino Ambient',
    album: 'Human Interface',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80',
    accentColor: '#a855f7',
  },
];

export const SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'CodeX 1513 Architecture Vision',
    content: `Building next-generation iOS apps directly on Web & iOS platforms.
Key requirements:
1. Instant SwiftUI live-preview feedback loop
2. Zero-latency compiler simulation
3. Full SF Symbol integration
4. Native Dynamic Island activity triggers
5. Multi-device responsive rendering (iPhone 16 Pro, iPad Pro)`,
    updatedAt: 'Today, 11:20 AM',
    isPinned: true,
    category: 'Architecture',
  },
  {
    id: 'note-2',
    title: 'Swift 6 Concurrency Checklist',
    content: `- Check Actor isolation on view models
- Audit @MainActor annotations on UI updates
- Use Task { @MainActor in ... } for state mutate
- Ensure Sendable conformance on payload types`,
    updatedAt: 'Yesterday',
    isPinned: true,
    category: 'Swift Guide',
  },
  {
    id: 'note-3',
    title: 'Design Tokens: Titanium Finish',
    content: `Hex colors for iOS 18 Titanium palette:
• Natural: #c5beb4
• Black: #2e2c2f
• Desert: #d4a373
• White: #eae6e1`,
    updatedAt: 'Oct 25',
    isPinned: false,
    category: 'Design',
  },
];

export const SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: 'p-1',
    title: 'Apple Park Ring',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    takenAt: 'Oct 26, 2026',
    filter: 'none',
  },
  {
    id: 'p-2',
    title: 'M4 Silicon Die Shot',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    takenAt: 'Oct 24, 2026',
    filter: 'vibrant',
  },
  {
    id: 'p-3',
    title: 'Minimal Titanium Desk',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    takenAt: 'Oct 22, 2026',
    filter: 'mono',
  },
  {
    id: 'p-4',
    title: 'San Francisco Skyline',
    url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&auto=format&fit=crop&q=80',
    takenAt: 'Oct 20, 2026',
    filter: 'warm',
  },
];

export const CODEX_PROJECTS: CodeXProject[] = [
  {
    id: 'weather-pro',
    title: 'WeatherPro SwiftUI',
    category: 'SwiftUI Weather App',
    description: 'Dynamic iOS weather dashboard with live atmospheric particle simulation, UV gauge, hourly forecast carousel, and rain radar.',
    activeFile: 'ContentView.swift',
    previewType: 'weather',
    files: [
      {
        name: 'ContentView.swift',
        path: 'Sources/ContentView.swift',
        language: 'swift',
        content: `import SwiftUI

struct ContentView: View {
    @State private var selectedHour = 0
    @State private var isCelsius = true
    @State private var condition = "Sunny & Clear"
    @State private var temperature = 72
    
    var body: some View {
        ZStack {
            // Dynamic sky gradient
            LinearGradient(
                colors: [Color.blue.opacity(0.8), Color.indigo],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    // Location Header
                    VStack(spacing: 4) {
                        Text("Cupertino, CA")
                            .font(.system(size: 32, weight: .semibold))
                            .foregroundColor(.white)
                        Text("\\(temperature)°")
                            .font(.system(size: 84, weight: .thin))
                            .foregroundColor(.white)
                        Text(condition)
                            .font(.title3)
                            .foregroundColor(.white.opacity(0.9))
                        HStack(spacing: 12) {
                            Text("H: 78°")
                            Text("L: 54°")
                            Text("AQI: 32 (Good)")
                        }
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.75))
                    }
                    .padding(.top, 40)
                    
                    // Hourly Forecast Card
                    HourlyForecastCard(selectedHour: $selectedHour)
                    
                    // Weather Metrics Grid
                    WeatherMetricsGrid()
                }
                .padding(.horizontal, 16)
            }
        }
    }
}

struct HourlyForecastCard: View {
    @Binding var selectedHour: Int
    let hours = ["Now", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"]
    let temps = [72, 74, 75, 77, 76, 73, 69, 66]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("HOURLY FORECAST", systemImage: "clock")
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(0..<hours.count, id: \\.self) { i in
                        VStack(spacing: 8) {
                            Text(hours[i])
                                .font(.caption2)
                            Image(systemName: i > 5 ? "moon.stars.fill" : "sun.max.fill")
                                .foregroundColor(.yellow)
                            Text("\\(temps[i])°")
                                .font(.callout)
                                .fontWeight(.medium)
                        }
                        .foregroundColor(.white)
                        .padding(.vertical, 8)
                        .padding(.horizontal, 10)
                        .background(selectedHour == i ? Color.white.opacity(0.2) : Color.clear)
                        .cornerRadius(12)
                        .onTapGesture { selectedHour = i }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white.opacity(0.15))
        .cornerRadius(18)
    }
}
`,
      },
      {
        name: 'Info.plist',
        path: 'Config/Info.plist',
        language: 'plist',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>WeatherPro</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>WeatherPro needs your location to provide accurate local forecasts.</string>
</dict>
</plist>`,
      },
    ],
  },
  {
    id: 'vital-fit',
    title: 'VitalFit Health Rings',
    category: 'SwiftUI Health & Fitness',
    description: 'Activity rings animation engine, Apple Health metric charts, heart rate monitor, step counter, and workout logger.',
    activeFile: 'VitalFitView.swift',
    previewType: 'health',
    files: [
      {
        name: 'VitalFitView.swift',
        path: 'Sources/VitalFitView.swift',
        language: 'swift',
        content: `import SwiftUI

struct VitalFitView: View {
    @State private var moveProgress: Double = 0.85
    @State private var exerciseProgress: Double = 0.65
    @State private var standProgress: Double = 0.92
    @State private var currentHeartRate: Int = 74
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Activity Rings Cluster
                ZStack {
                    ActivityRing(color: .red, progress: moveProgress, radius: 100, lineWidth: 18)
                    ActivityRing(color: .green, progress: exerciseProgress, radius: 76, lineWidth: 18)
                    ActivityRing(color: .cyan, progress: standProgress, radius: 52, lineWidth: 18)
                }
                .frame(height: 240)
                
                // Ring Breakdown
                HStack(spacing: 16) {
                    RingStat(label: "MOVE", val: "540 / 600 CAL", color: .red)
                    RingStat(label: "EXERCISE", val: "22 / 30 MIN", color: .green)
                    RingStat(label: "STAND", val: "11 / 12 HRS", color: .cyan)
                }
                
                // Heart Rate Widget
                HeartRateCard(bpm: currentHeartRate)
            }
            .padding()
        }
        .background(Color.black.ignoresSafeArea())
    }
}
`,
      },
      {
        name: 'Package.swift',
        path: 'Package.swift',
        language: 'swift',
        content: `// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "VitalFit",
    platforms: [.iOS(.v18)],
    products: [.library(name: "VitalFit", targets: ["VitalFit"])],
    targets: [.target(name: "VitalFit", dependencies: [])]
)`,
      },
    ],
  },
  {
    id: 'apex-wallet',
    title: 'Apex Crypto & Apple Wallet',
    category: 'SwiftUI FinTech App',
    description: 'Apple Pay titanium card presentation with dynamic tilt, contactless NFC tap simulation, and crypto portfolio graph.',
    activeFile: 'ApexWalletView.swift',
    previewType: 'wallet',
    files: [
      {
        name: 'ApexWalletView.swift',
        path: 'Sources/ApexWalletView.swift',
        language: 'swift',
        content: `import SwiftUI

struct ApexWalletView: View {
    @State private var cardTilted = false
    @State private var balance: Double = 14285.50
    @State private var isSendModalOpen = false
    
    var body: some View {
        VStack(spacing: 20) {
            // Apple Pay Style Titanium Card
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(
                        LinearGradient(
                            colors: [Color(white: 0.2), Color(white: 0.08)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 22)
                            .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(0.4), radius: 15, y: 10)
                
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text("Apex Titanium")
                            .font(.headline)
                            .foregroundColor(.white)
                        Spacer()
                        Image(systemName: "wave.3.forward")
                            .foregroundColor(.white.opacity(0.8))
                    }
                    Spacer()
                    Text("•••• 1513")
                        .font(.caption.monospaced())
                        .foregroundColor(.white.opacity(0.7))
                    Text("$\\(balance, specifier: "%.2f")")
                        .font(.title.bold())
                        .foregroundColor(.white)
                }
                .padding(22)
            }
            .frame(height: 200)
            .padding(.horizontal)
            
            // Action Buttons
            HStack(spacing: 20) {
                Button("Send") { isSendModalOpen = true }
                Button("Receive") { }
                Button("Pay with Face ID") { }
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
`,
      },
    ],
  },
  {
    id: 'focus-pulse',
    title: 'FocusPulse Pomodoro',
    category: 'SwiftUI Productivity',
    description: 'Deep focus interval timer with ambient frequency generator, haptic ticks, and session productivity streaks.',
    activeFile: 'FocusPulseView.swift',
    previewType: 'timer',
    files: [
      {
        name: 'FocusPulseView.swift',
        path: 'Sources/FocusPulseView.swift',
        language: 'swift',
        content: `import SwiftUI

struct FocusPulseView: View {
    @State private var isRunning = false
    @State private var timeRemaining = 25 * 60
    @State private var focusMode = "Deep Work"
    
    var body: some View {
        VStack(spacing: 36) {
            Text(focusMode)
                .font(.title2.bold())
                .foregroundColor(.white)
            
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.1), lineWidth: 12)
                Circle()
                    .trim(from: 0, to: CGFloat(timeRemaining) / (25 * 60))
                    .stroke(Color.orange, style: StrokeStyle(lineWidth: 12, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.linear, value: timeRemaining)
                
                VStack {
                    Text(formatTime(timeRemaining))
                        .font(.system(size: 54, weight: .thin, design: .monospaced))
                        .foregroundColor(.white)
                    Text(isRunning ? "Stay Focused" : "Ready")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .frame(width: 260, height: 260)
            
            HStack(spacing: 30) {
                Button(action: { isRunning.toggle() }) {
                    Image(systemName: isRunning ? "pause.fill" : "play.fill")
                        .font(.title)
                        .frame(width: 70, height: 70)
                        .background(Color.orange)
                        .foregroundColor(.white)
                        .clipShape(Circle())
                }
            }
        }
        .padding()
        .background(Color.black.ignoresSafeArea())
    }
    
    func formatTime(_ totalSeconds: Int) -> String {
        let mins = totalSeconds / 60
        let secs = totalSeconds % 60
        return String(format: "%02d:%02d", mins, secs)
    }
}
`,
      },
    ],
  },
  {
    id: 'custom-sandbox',
    title: 'Custom SwiftUI Sandbox',
    category: 'Scratchpad',
    description: 'Create your own custom SwiftUI application with live code-runner and component sandbox.',
    activeFile: 'CustomApp.swift',
    previewType: 'custom',
    files: [
      {
        name: 'CustomApp.swift',
        path: 'Sources/CustomApp.swift',
        language: 'swift',
        content: `import SwiftUI

struct CustomApp: View {
    @State private var count = 0
    @State private var isToggled = false
    @State private var message = "Hello from CodeX 1513 iOS!"
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "swift")
                .font(.system(size: 64))
                .foregroundColor(.orange)
            
            Text(message)
                .font(.title2.bold())
                .multilineTextAlignment(.center)
            
            Text("Counter: \\(count)")
                .font(.headline)
                .foregroundColor(.secondary)
            
            HStack(spacing: 16) {
                Button("Decrement") { count -= 1 }
                    .buttonStyle(.bordered)
                Button("Increment") { count += 1 }
                    .buttonStyle(.borderedProminent)
            }
            
            Toggle("Dynamic Island Sync", isOn: $isToggled)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
        }
        .padding()
    }
}
`,
      },
    ],
  },
];

export const SF_SYMBOLS_LIST = [
  { name: 'swift', category: 'Developer' },
  { name: 'hammer.fill', category: 'Developer' },
  { name: 'terminal.fill', category: 'Developer' },
  { name: 'cpu', category: 'Developer' },
  { name: 'curlybraces', category: 'Developer' },
  { name: 'play.fill', category: 'Media' },
  { name: 'pause.fill', category: 'Media' },
  { name: 'forward.fill', category: 'Media' },
  { name: 'backward.fill', category: 'Media' },
  { name: 'speaker.wave.3.fill', category: 'Media' },
  { name: 'sun.max.fill', category: 'Weather' },
  { name: 'cloud.rain.fill', category: 'Weather' },
  { name: 'cloud.bolt.fill', category: 'Weather' },
  { name: 'snowflake', category: 'Weather' },
  { name: 'wind', category: 'Weather' },
  { name: 'heart.fill', category: 'Health' },
  { name: 'flame.fill', category: 'Health' },
  { name: 'figure.run', category: 'Health' },
  { name: 'bolt.heart.fill', category: 'Health' },
  { name: 'creditcard.fill', category: 'Commerce' },
  { name: 'wave.3.forward', category: 'Commerce' },
  { name: 'dollarsign.circle.fill', category: 'Commerce' },
  { name: 'cart.fill', category: 'Commerce' },
  { name: 'wifi', category: 'Connectivity' },
  { name: 'antenna.radiowaves.left.and.right', category: 'Connectivity' },
  { name: 'bell.fill', category: 'System' },
  { name: 'gearshape.fill', category: 'System' },
  { name: 'lock.fill', category: 'System' },
  { name: 'flashlight.on.fill', category: 'System' },
  { name: 'camera.fill', category: 'System' },
  { name: 'sparkles', category: 'System' },
  { name: 'app.badge.fill', category: 'System' },
];
