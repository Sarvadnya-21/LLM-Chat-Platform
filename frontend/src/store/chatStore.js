import { create } from 'zustand';
import api from '../lib/api';

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useChatStore = create((set, get) => ({
  messages: [],
  chats: [],
  selectedChatId: null,
  loading: false,
  loadingChats: false,
  loadingMessages: false,
  error: null,

  clearChat() {
    set({
      messages: [],
      selectedChatId: null,
      error: null,
    });
  },

  async loadChats() {
    set({ loadingChats: true, error: null });
    try {
      const res = await api.get('/chats');
      const chats = res?.data?.chats || [];

      set((state) => ({
        chats,
        // Keep existing selection if still present; otherwise select most recent.
        selectedChatId:
          state.selectedChatId && chats.some((c) => c.id === state.selectedChatId)
            ? state.selectedChatId
            : chats[0]?.id || null,
        loadingChats: false,
      }));
    } catch (err) {
      set({ loadingChats: false, error: err?.response?.data?.error || null });
    }
  },

  async loadMessages(chatId) {
    if (!chatId) {
      set({ messages: [], selectedChatId: null, loadingMessages: false });
      return;
    }

    set({ loadingMessages: true, error: null });
    try {
      const res = await api.get(`/chats/${chatId}`);
      const messages = res?.data?.messages || [];

      set({
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
        selectedChatId: chatId,
        loadingMessages: false,
      });
    } catch (err) {
      set({
        loadingMessages: false,
        error: err?.response?.data?.error || err.message || 'Failed to load chat',
      });
    }
  },

  async sendMessage(message) {
    const content = String(message || '').trim();
    if (!content) return;

    const userMessage = { id: createId(), role: 'user', content };
    set((state) => ({
      messages: [...state.messages, userMessage],
      loading: true,
      error: null,
    }));

    try {
      const res = await api.post('/chat', {
        message: content,
        chatId: get().selectedChatId,
      });
      const assistantText =
        res?.data?.reply || 'No reply returned from server';
      const returnedChatId = res?.data?.chatId || null;

      const assistantMessage = {
        id: createId(),
        role: 'assistant',
        content: assistantText,
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        loading: false,
        selectedChatId: returnedChatId || state.selectedChatId,
      }));

      if (returnedChatId) {
        // Ensure sidebar shows newly created chats.
        get().loadChats();
      }
    } catch (err) {
      const assistantMessage = {
        id: createId(),
        role: 'assistant',
        content: err?.response?.data?.error || err.message || 'Request failed',
      };

      if (assistantMessage.content === 'Login required to continue') {
        window.alert('Login required to continue');
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        loading: false,
        error: assistantMessage.content,
      }));
    }
  },
}));

