// Global types for WhatsApp Display Jabar application

export interface WhatsAppClient {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'scanning' | 'error';
  lastSeen?: string;
  rating: number; // Health score 1-100
  dailyLimit: number;
  sentToday: number;
  avatar?: string;
  qrCode?: string;
}

export interface BlastCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  template: MessageTemplate;
  targets: BlastTarget[];
  clientIds: string[];
  scheduledAt?: string;
  createdAt: string;
  completedAt?: string;
  stats: BlastStats;
}

export interface BlastTarget {
  id: string;
  phoneNumber: string;
  name?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  error?: string;
}

export interface BlastStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables?: string[];
  createdAt: string;
  lastUsed?: string;
}

export interface WarmerSession {
  id: string;
  clientId: string;
  targetClientId: string;
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  duration: number; // minutes
  messagesSent: number;
  lastActivity?: string;
}

export interface NumberCheck {
  phoneNumber: string;
  isValid: boolean;
  hasWhatsApp: boolean;
  lastChecked: string;
  profilePicture?: string;
  about?: string;
  error?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  contactNumber: string;
  contactName?: string;
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isArchived: boolean;
  isPinned: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  fileName?: string;
}

export interface DashboardStats {
  totalClients: number;
  connectedClients: number;
  totalBlasts: number;
  activeBlasts: number;
  totalMessages: number;
  messagesThisWeek: number;
  warmerSessions: number;
  conversationsToday: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
  lastLogin: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  rating?: number | null;
  reviews?: number | null;
  website?: string | null;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  postalCode?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  url?: string | null;
  odp?: string | null;
  distance?: string | null;
  status?: string | null;
  isBusiness: boolean;
  businessName?: string | null;
  businessCategory?: string | null;
  hasReceivedMessage: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    desktop: boolean;
    sound: boolean;
    newMessages: boolean;
    blastUpdates: boolean;
  };
  autoConnect: boolean;
  maxRetries: number;
  socketUrl: string;
}