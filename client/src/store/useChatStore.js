import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const res = await api.get('/messages/conversations');
      set({ conversations: res.data.data.conversations });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loadingConversations: false });
    }
  },

  setActiveConversation: async (user) => {
    set({ activeConversation: user, loadingMessages: true });
    try {
      const res = await api.get(`/messages/${user._id}`);
      set({ messages: res.data.data.messages });
      // Mark as read
      await api.put(`/messages/${user._id}/read`);
    } catch (err) {
      console.error(err);
    } finally {
      set({ loadingMessages: false });
    }
  },

  addMessage: (message) => {
    const { activeConversation, messages } = get();
    
    // Only add to messages array if it's the active conversation
    if (activeConversation && (
      message.senderId === activeConversation._id || 
      message.receiverId === activeConversation._id
    )) {
      set({ messages: [...messages, message] });
    }

    // Refresh conversations list to update last message
    get().fetchConversations();
  }
}));
