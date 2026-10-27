export type DeviceModel = 'iphone-16-pro' | 'iphone-16-promax' | 'ipad-pro' | 'responsive';

export type DeviceColor = 'natural-titanium' | 'black-titanium' | 'desert-titanium' | 'white-titanium';

export type ActionButtonAction = 'intelligence' | 'flashlight' | 'codex-run' | 'camera' | 'mute' | 'voice-memo';

export type ClockStyle = 'default' | 'serif' | 'mono' | 'rounded';

export interface AppIconConfig {
  id: string;
  name: string;
  iconName: string;
  iconBg: string;
  iconColor?: string;
  badge?: number;
  category: 'Developer' | 'Utilities' | 'Media' | 'Productivity' | 'System';
  isRemovable?: boolean;
  installed?: boolean;
}

export interface DynamicIslandState {
  mode: 'compact' | 'expanded' | 'minimal';
  activity?: 'idle' | 'music' | 'building' | 'timer' | 'airdrop' | 'battery' | 'recording' | 'call';
  title?: string;
  subtitle?: string;
  progress?: number;
  duration?: number;
  remaining?: number;
}

export interface NotificationItem {
  id: string;
  appId: string;
  appName: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionText?: string;
}

export interface CodeXProject {
  id: string;
  title: string;
  category: string;
  description: string;
  files: {
    name: string;
    path: string;
    language: 'swift' | 'json' | 'plist';
    content: string;
  }[];
  activeFile: string;
  previewType: 'weather' | 'health' | 'wallet' | 'timer' | 'custom';
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface MessageItem {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isMe: boolean;
  codeSnippet?: string;
}

export interface ConversationItem {
  id: string;
  contactName: string;
  contactRole: string;
  avatar: string;
  messages: MessageItem[];
  unread: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'swift' | 'json' | 'folder' | 'image' | 'cert';
  updatedAt: string;
  path: string;
  content?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  accentColor: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  isPinned?: boolean;
  category: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  takenAt: string;
  filter?: string;
  title: string;
}

