import { AIConversation, AISettings, AIPromptTemplate, AIInsight } from '@/types/ai';

export const mockAISettings: AISettings = {
  modelId: 'gemini-2.5-flash',
  systemPrompt: `Anda adalah "Asisten Virtual Display Jabar", sebuah AI yang ramah, profesional, proaktif, sabar, dan berorientasi solusi untuk layanan WhatsApp management.

**Tugas Utama Anda:**
1. Membantu pengguna dalam mengelola komunikasi WhatsApp bisnis
2. Memberikan saran untuk kampanye WhatsApp Blast yang efektif
3. Membantu menganalisis performa pesan dan engagement
4. Menyediakan template pesan yang sesuai dengan kebutuhan bisnis

**Sifat & Perilaku:**
- Berkomunikasi dengan gaya yang hangat, empatik, dan profesional
- Sajikan informasi kompleks dalam poin-poin yang mudah dicerna
- Proaktif dalam memberikan saran dan rekomendasi
- Selalu sertakan call-to-action yang jelas`,
  welcomeMessage: 'Halo! Saya adalah Asisten Virtual Display Jabar. Ada yang bisa saya bantu untuk mengelola komunikasi WhatsApp bisnis Anda hari ini?',
  temperature: 0.7,
  maxTokens: 2048,
  autoReply: false,
  enabledFeatures: {
    smartReply: true,
    messageAnalysis: true,
    contentGeneration: true,
    customerInsights: true
  }
};

export const mockAIConversations: AIConversation[] = [
  {
    id: '1',
    title: 'Strategi Kampanye Promo',
    messages: [
      {
        id: '1',
        content: 'Bisa bantu buatkan strategi kampanye WhatsApp untuk promo akhir tahun?',
        role: 'user',
        timestamp: '2024-01-15T10:00:00Z',
        status: 'sent'
      },
      {
        id: '2',
        content: 'Tentu! Untuk kampanye promo akhir tahun yang efektif, saya sarankan:\n\n**1. Segmentasi Audience:**\n- Bagi kontak berdasarkan riwayat pembelian\n- Pisahkan pelanggan lama vs pelanggan baru\n\n**2. Timeline Kampanye:**\n- Early bird (1-2 minggu sebelum)\n- Peak period (minggu terakhir)\n- Last chance (hari terakhir)\n\n**3. Jenis Pesan:**\n- Announcement dengan gambar menarik\n- Countdown timer untuk urgency\n- Personalisasi dengan nama pelanggan\n\nApakah ada produk atau target audience spesifik yang ingin difokuskan?',
        role: 'assistant',
        timestamp: '2024-01-15T10:00:30Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:30Z'
  },
  {
    id: '2',
    title: 'Template Pesan Follow-up',
    messages: [
      {
        id: '3',
        content: 'Buatkan template pesan follow-up untuk customer yang sudah 3 hari tidak membalas',
        role: 'user',
        timestamp: '2024-01-15T09:30:00Z',
        status: 'sent'
      },
      {
        id: '4',
        content: 'Berikut template follow-up yang sopan dan efektif:\n\n**Template 1 - Casual:**\n"Halo {nama}! 👋 Semoga kabarnya baik ya. Saya ingin memastikan pesan saya sebelumnya sudah diterima. Ada yang bisa saya bantu lebih lanjut?"\n\n**Template 2 - Professional:**\n"Selamat {waktu} {nama}, kami ingin menindaklanjuti penawaran sebelumnya. Jika ada pertanyaan atau butuh klarifikasi, jangan ragu untuk menghubungi kami."\n\n**Template 3 - Value-driven:**\n"Hi {nama}! Kami punya update menarik yang mungkin relevan dengan kebutuhan Anda. Kapan waktu yang tepat untuk berdiskusi?"\n\nPilih yang sesuai dengan tone bisnis Anda ya!',
        role: 'assistant',
        timestamp: '2024-01-15T09:30:45Z'
      }
    ],
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:45Z'
  }
];

export const mockPromptTemplates: AIPromptTemplate[] = [
  {
    id: '1',
    name: 'Template Pesan Promosi',
    description: 'Generate pesan promosi yang menarik untuk produk atau layanan',
    prompt: 'Buatkan pesan promosi WhatsApp untuk {produk} dengan diskon {diskon}%. Target audience: {target}. Tone: {tone}. Sertakan call-to-action yang kuat.',
    category: 'marketing',
    variables: ['produk', 'diskon', 'target', 'tone'],
    createdAt: '2024-01-10T08:00:00Z',
    lastUsed: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Analisis Sentiment Pesan',
    description: 'Analisis sentiment dan emosi dari pesan customer',
    prompt: 'Analisis sentiment dari pesan berikut: "{pesan}". Berikan: 1) Sentiment (positif/negatif/netral), 2) Tingkat urgency, 3) Saran respon yang tepat.',
    category: 'customer-service',
    variables: ['pesan'],
    createdAt: '2024-01-08T14:00:00Z',
    lastUsed: '2024-01-14T16:20:00Z'
  },
  {
    id: '3',
    name: 'Content Creator untuk Sosmed',
    description: 'Generate konten untuk social media dari informasi produk',
    prompt: 'Buatkan 3 variasi caption Instagram untuk {produk}. Informasi produk: {info}. Style: {style}. Sertakan hashtag yang relevan.',
    category: 'content',
    variables: ['produk', 'info', 'style'],
    createdAt: '2024-01-05T11:30:00Z'
  },
  {
    id: '4',
    name: 'Sales Script Generator',
    description: 'Generate sales script untuk closing deal',
    prompt: 'Buatkan sales script untuk closing {produk} dengan harga {harga}. Customer profile: {profile}. Objection yang mungkin muncul: {objection}.',
    category: 'sales',
    variables: ['produk', 'harga', 'profile', 'objection'],
    createdAt: '2024-01-03T09:15:00Z',
    lastUsed: '2024-01-12T11:45:00Z'
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'customer_sentiment',
    title: 'Sentiment Pelanggan',
    description: 'Rata-rata sentiment pesan masuk minggu ini',
    value: 'Positif (78%)',
    trend: 'up',
    timestamp: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    type: 'response_time',
    title: 'Response Time',
    description: 'Waktu rata-rata membalas pesan',
    value: '2.3 menit',
    trend: 'down',
    timestamp: '2024-01-15T12:00:00Z'
  },
  {
    id: '3',
    type: 'popular_topics',
    title: 'Topik Populer',
    description: 'Kata kunci paling banyak dibahas',
    value: 'Promo, Pengiriman, Stok',
    trend: 'neutral',
    timestamp: '2024-01-15T12:00:00Z'
  },
  {
    id: '4',
    type: 'conversion_rate',
    title: 'Conversion Rate',
    description: 'Tingkat konversi dari blast ke penjualan',
    value: '12.5%',
    trend: 'up',
    timestamp: '2024-01-15T12:00:00Z'
  }
];

export const mockAIFeatures = {
  smartReplyStats: {
    totalSuggestions: 1247,
    accepted: 892,
    acceptanceRate: 71.5,
    timeSaved: '18.2 jam'
  },
  messageAnalysis: {
    totalAnalyzed: 2847,
    sentimentBreakdown: {
      positive: 65,
      neutral: 28,
      negative: 7
    },
    topKeywords: ['harga', 'promo', 'pengiriman', 'stok', 'kualitas']
  },
  contentGeneration: {
    templatesGenerated: 156,
    campaignsCreated: 23,
    avgEngagementIncrease: '34%'
  }
};