export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AISettings {
  modelId: string;
  systemPrompt: string;
  welcomeMessage: string;
  temperature: number;
  maxTokens: number;
  autoReply: boolean;
  enabledFeatures: {
    smartReply: boolean;
    messageAnalysis: boolean;
    contentGeneration: boolean;
    customerInsights: boolean;
  };
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'marketing' | 'customer-service' | 'sales' | 'content' | 'other';
  variables?: string[];
  createdAt: string;
  lastUsed?: string;
}

export interface AIInsight {
  id: string;
  type: 'customer_sentiment' | 'popular_topics' | 'response_time' | 'conversion_rate';
  title: string;
  description: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  timestamp: string;
}