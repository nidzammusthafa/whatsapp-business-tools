import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WhatsAppClient, BlastCampaign, MessageTemplate, Conversation, Address, WarmerSession } from '@/types';
import { AIConversation, AISettings, AIPromptTemplate } from '@/types/ai';
import { mockAddresses } from '@/lib/mock-addresses';
import { mockAIConversations, mockAISettings, mockPromptTemplates } from '@/lib/ai-mock-data';

interface AppState {
  // UI State
  isLoading: boolean;
  theme: string;
  sidebarCollapsed: boolean;
  
  // Data State
  clients: WhatsAppClient[];
  campaigns: BlastCampaign[];
  templates: MessageTemplate[];
  conversations: Conversation[];
  addresses: Address[];
  warmerSessions: WarmerSession[];
  
  // AI Features
  aiConversations: AIConversation[];
  aiSettings: AISettings;
  promptTemplates: AIPromptTemplate[];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  
  // Client Actions
  addClient: (client: WhatsAppClient) => void;
  updateClient: (id: string, updates: Partial<WhatsAppClient>) => void;
  removeClient: (id: string) => void;
  
  // Campaign Actions
  addCampaign: (campaign: BlastCampaign) => void;
  deleteCampaign: (campaignId: string) => void;
  updateCampaign: (id: string, updates: Partial<BlastCampaign>) => void;
  removeCampaign: (id: string) => void;
  
  // Template Actions
  addTemplate: (template: MessageTemplate) => void;
  updateTemplate: (id: string, updates: Partial<MessageTemplate>) => void;
  removeTemplate: (id: string) => void;
  
  // Warmer Session Actions
  addWarmerSession: (session: WarmerSession) => void;
  updateWarmerSession: (sessionId: string, updates: Partial<WarmerSession>) => void;
  deleteWarmerSession: (sessionId: string) => void;
  
  // Address Actions
  addAddress: (address: Address) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      isLoading: false,
      theme: 'system',
      sidebarCollapsed: false,
      clients: [],
      campaigns: [],
      templates: [],
      conversations: [],
      addresses: mockAddresses,
      warmerSessions: [],
      
      // AI Features
      aiConversations: mockAIConversations,
      aiSettings: mockAISettings,
      promptTemplates: mockPromptTemplates,
      
      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Client Actions
      addClient: (client) => set((state) => ({ 
        clients: [...state.clients, client] 
      })),
      updateClient: (id, updates) => set((state) => ({
        clients: state.clients.map(client => 
          client.id === id ? { ...client, ...updates } : client
        )
      })),
      removeClient: (id) => set((state) => ({
        clients: state.clients.filter(client => client.id !== id)
      })),
      
      // Campaign Actions
      addCampaign: (campaign) => set((state) => ({
        campaigns: [...state.campaigns, campaign]
      })),
      
      deleteCampaign: (campaignId) => set((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== campaignId)
      })),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      })),
      removeCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id)
      })),
      
      // Template Actions
      addTemplate: (template) => set((state) => ({ 
        templates: [...state.templates, template] 
      })),
      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(template => 
          template.id === id ? { ...template, ...updates } : template
        )
      })),
      removeTemplate: (id) => set((state) => ({
        templates: state.templates.filter(template => template.id !== id)
      })),
      
      // Warmer Session Actions
      addWarmerSession: (session) => set((state) => ({ 
        warmerSessions: [...state.warmerSessions, session] 
      })),
      updateWarmerSession: (sessionId, updates) => set((state) => ({
        warmerSessions: state.warmerSessions.map(session =>
          session.id === sessionId ? { ...session, ...updates } : session
        )
      })),
      deleteWarmerSession: (sessionId) => set((state) => ({
        warmerSessions: state.warmerSessions.filter(s => s.id !== sessionId)
      })),
      
      // Address Actions
      addAddress: (address) => set((state) => ({ 
        addresses: [...state.addresses, address] 
      })),
      updateAddress: (id, updates) => set((state) => ({
        addresses: state.addresses.map(address => 
          address.id === id ? { ...address, ...updates } : address
        )
      })),
      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter(address => address.id !== id)
      })),
    }),
    {
      name: 'whatsapp-display-jabar-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        clients: state.clients,
        campaigns: state.campaigns,
        templates: state.templates,
        addresses: state.addresses,
        warmerSessions: state.warmerSessions,
      }),
    }
  )
);