// Realistic dummy data for development and demo purposes
import { 
  WhatsAppClient, 
  BlastCampaign, 
  MessageTemplate, 
  WarmerSession, 
  NumberCheck, 
  Conversation, 
  DashboardStats,
  User,
  AppSettings
} from '@/types';

// WhatsApp Clients - Realistic business accounts
export const mockClients: WhatsAppClient[] = [
  {
    id: '1',
    name: 'Toko Baju Jabar',
    phoneNumber: '+6281234567890',
    status: 'connected',
    lastSeen: '2024-01-15T10:30:00Z',
    rating: 95,
    dailyLimit: 1000,
    sentToday: 247,
    avatar: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150'
  },
  {
    id: '2', 
    name: 'Warung Makan Sederhana',
    phoneNumber: '+6281234567891',
    status: 'connected',
    lastSeen: '2024-01-15T11:15:00Z',
    rating: 88,
    dailyLimit: 500,
    sentToday: 89,
    avatar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=150'
  },
  {
    id: '3',
    name: 'Bengkel Motor Jaya',
    phoneNumber: '+6281234567892', 
    status: 'disconnected',
    lastSeen: '2024-01-15T08:45:00Z',
    rating: 72,
    dailyLimit: 300,
    sentToday: 0,
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150'
  },
  {
    id: '4',
    name: 'Salon Kecantikan Prima',
    phoneNumber: '+6281234567893',
    status: 'scanning',
    rating: 91,
    dailyLimit: 800,
    sentToday: 0,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  {
    id: '5',
    name: 'Distributor Elektronik',
    phoneNumber: '+6281234567894',
    status: 'error',
    lastSeen: '2024-01-14T16:20:00Z',
    rating: 45,
    dailyLimit: 1200,
    sentToday: 0,
  }
];

// Message Templates
export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Promosi Flash Sale',
    content: 'Halo {nama}! 🔥 Flash Sale 50% OFF untuk semua produk pilihan hari ini saja! Buruan order sebelum kehabisan ya! Link: bit.ly/flashsale-{tanggal}',
    variables: ['nama', 'tanggal'],
    createdAt: '2024-01-10T09:00:00Z',
    lastUsed: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Reminder Pembayaran',
    content: 'Halo {nama}, ini adalah pengingat bahwa pembayaran untuk order #{order_id} sebesar Rp {jumlah} akan jatuh tempo besok. Terima kasih!',
    variables: ['nama', 'order_id', 'jumlah'],
    createdAt: '2024-01-08T14:00:00Z',
    lastUsed: '2024-01-14T16:20:00Z'
  },
  {
    id: '3',
    name: 'Welcome New Customer',
    content: 'Selamat datang di {nama_toko}! 🎉 Dapatkan diskon 15% untuk pembelian pertama dengan kode: WELCOME15. Berlaku sampai akhir bulan!',
    variables: ['nama_toko'],
    createdAt: '2024-01-05T11:30:00Z'
  }
];

// Blast Campaigns
export const mockBlastCampaigns: BlastCampaign[] = [
  {
    id: '1',
    name: 'Promo Akhir Tahun 2024',
    status: 'completed',
    template: mockTemplates[0],
    targets: [],
    clientIds: ['1', '2'],
    scheduledAt: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-14T15:30:00Z',
    completedAt: '2024-01-15T10:45:00Z',
    stats: {
      total: 500,
      sent: 487,
      delivered: 445,
      failed: 13,
      pending: 0
    }
  },
  {
    id: '2',
    name: 'Reminder Pembayaran Bulanan',
    status: 'running',
    template: mockTemplates[1],
    targets: [],
    clientIds: ['1', '3'],
    scheduledAt: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-15T08:45:00Z',
    stats: {
      total: 150,
      sent: 89,
      delivered: 67,
      failed: 2,
      pending: 61
    }
  },
  {
    id: '3',
    name: 'Welcome Campaign Q1',
    status: 'scheduled',
    template: mockTemplates[2],
    targets: [],
    clientIds: ['2', '4'],
    scheduledAt: '2024-01-16T10:00:00Z',
    createdAt: '2024-01-15T11:00:00Z',
    stats: {
      total: 200,
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 200
    }
  }
];

// Mock Blast Results for detailed progress tracking
export const mockBlastResults = {
  '1': Array.from({ length: 100 }, (_, i) => ({
    id: `result-${i + 1}`,
    phoneNumber: `+62${Math.floor(8000000000 + Math.random() * 1999999999)}`,
    name: ['Budi Santoso', 'Siti Rahma', 'Ahmad Wijaya', 'Dewi Kusuma', 'Rizki Pratama'][i % 5],
    status: (['delivered', 'sent', 'failed', 'pending'] as const)[Math.floor(Math.random() * 4)],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    errorMessage: Math.random() > 0.8 ? 'Number not registered on WhatsApp' : undefined,
  })),
  '2': Array.from({ length: 50 }, (_, i) => ({
    id: `result-${i + 101}`,
    phoneNumber: `+62${Math.floor(8000000000 + Math.random() * 1999999999)}`,
    name: ['Andi Setiawan', 'Maya Putri', 'Doni Kurnia', 'Lina Safitri'][i % 4],
    status: (['delivered', 'sent', 'failed', 'pending'] as const)[Math.floor(Math.random() * 4)],
    timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
    errorMessage: Math.random() > 0.9 ? 'Message sending timeout' : undefined,
  })),
};

// Mock Warmer Messages
export const mockWarmerMessages = {
  '1': Array.from({ length: 30 }, (_, i) => ({
    id: `msg-${i + 1}`,
    from: i % 2 === 0 ? '1' : '2',
    to: i % 2 === 0 ? '2' : '1',
    message: [
      "Hey, how's your day going?",
      "Just checking in! How are things?",
      "Hope you're having a great day! 😊",
      "What's new with you?",
      "Good morning! Hope your day starts well!",
      "Any exciting plans for today?",
      "Hope you're doing well! 👋",
      "Just wanted to say hi!",
      "How's everything going on your end?",
      "Thanks for staying in touch!"
    ][i % 10],
    timestamp: new Date(Date.now() - (30 - i) * 5 * 60 * 1000).toISOString(),
    direction: (i % 2 === 0 ? 'sent' : 'received') as 'sent' | 'received',
  })),
  '2': Array.from({ length: 15 }, (_, i) => ({
    id: `msg-${i + 31}`,
    from: i % 2 === 0 ? '2' : '3',
    to: i % 2 === 0 ? '3' : '2',
    message: [
      "Hi there! How are you?",
      "Hope you're having a wonderful day!",
      "Just wanted to catch up!",
      "How's work treating you?",
      "Any fun plans for the weekend?"
    ][i % 5],
    timestamp: new Date(Date.now() - (15 - i) * 8 * 60 * 1000).toISOString(),
    direction: (i % 2 === 0 ? 'sent' : 'received') as 'sent' | 'received',
  })),
};

// Warmer Sessions
export const mockWarmerSessions: WarmerSession[] = [
  {
    id: '1',
    clientId: '1',
    targetClientId: '2',
    status: 'active',
    startedAt: '2024-01-15T09:00:00Z',
    duration: 120,
    messagesSent: 15,
    lastActivity: '2024-01-15T11:20:00Z'
  },
  {
    id: '2',
    clientId: '4',
    targetClientId: '1',
    status: 'paused',
    startedAt: '2024-01-15T08:30:00Z',
    duration: 90,
    messagesSent: 8,
    lastActivity: '2024-01-15T10:45:00Z'
  }
];

// Number Checks
export const mockNumberChecks: NumberCheck[] = [
  {
    phoneNumber: '+6281234567890',
    isValid: true,
    hasWhatsApp: true,
    lastChecked: '2024-01-15T11:30:00Z',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b619639a?w=150',
    about: 'Busy entrepreneur'
  },
  {
    phoneNumber: '+6281234567899',
    isValid: true,
    hasWhatsApp: false,
    lastChecked: '2024-01-15T11:29:00Z'
  },
  {
    phoneNumber: '+6281234567888',
    isValid: false,
    hasWhatsApp: false,
    lastChecked: '2024-01-15T11:28:00Z',
    error: 'Invalid number format'
  }
];

// Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    clientId: '1',
    contactNumber: '+6281234567801',
    contactName: 'Ibu Sari',
    lastMessage: {
      id: '1',
      conversationId: '1',
      content: 'Terima kasih ya, barangnya sudah sampai dan sesuai pesanan!',
      type: 'text',
      direction: 'incoming',
      timestamp: '2024-01-15T11:45:00Z',
      status: 'read'
    },
    unreadCount: 0,
    updatedAt: '2024-01-15T11:45:00Z',
    isArchived: false,
    isPinned: true
  },
  {
    id: '2',
    clientId: '1',
    contactNumber: '+6281234567802',
    contactName: 'Pak Budi',
    lastMessage: {
      id: '2',
      conversationId: '2',
      content: 'Kapan barang bisa dikirim?',
      type: 'text',
      direction: 'incoming',
      timestamp: '2024-01-15T11:30:00Z',
      status: 'delivered'
    },
    unreadCount: 2,
    updatedAt: '2024-01-15T11:30:00Z',
    isArchived: false,
    isPinned: false
  },
  {
    id: '3',
    clientId: '2',
    contactNumber: '+6281234567803',
    contactName: 'Mbak Dewi',
    lastMessage: {
      id: '3',
      conversationId: '3',
      content: 'Menu hari ini apa aja ya?',
      type: 'text',
      direction: 'incoming',
      timestamp: '2024-01-15T10:15:00Z',
      status: 'delivered'
    },
    unreadCount: 1,
    updatedAt: '2024-01-15T10:15:00Z',
    isArchived: false,
    isPinned: false
  }
];

// Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalClients: 5,
  connectedClients: 2,
  totalBlasts: 15,
  activeBlasts: 1,
  totalMessages: 12547,
  messagesThisWeek: 1284,
  warmerSessions: 2,
  conversationsToday: 23
};

// Current User
export const mockUser: User = {
  id: '1',
  name: 'Admin Display Jabar',
  email: 'admin@displayjabar.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  lastLogin: '2024-01-15T08:00:00Z'
};

// App Settings
export const mockSettings: AppSettings = {
  theme: 'light',
  notifications: {
    desktop: true,
    sound: true,
    newMessages: true,
    blastUpdates: true
  },
  autoConnect: true,
  maxRetries: 3,
  socketUrl: 'ws://localhost:3001'
};