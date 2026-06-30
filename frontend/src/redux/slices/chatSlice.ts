import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      const index = state.conversations.findIndex((c) => c._id === conversationId);
      if (index !== -1) {
        state.conversations[index].lastMessage = lastMessage;
        // Move the updated conversation to the top
        const [updatedConversation] = state.conversations.splice(index, 1);
        state.conversations.unshift(updatedConversation);
      }
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      // Prevent duplicate additions
      if (!state.messages.some((m) => m._id === message._id)) {
        state.messages.push(message);
      }
    },
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChatError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChatState: (state) => {
      state.conversations = [];
      state.activeConversation = null;
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setConversations,
  updateConversationLastMessage,
  setActiveConversation,
  setMessages,
  addMessage,
  setChatLoading,
  setChatError,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
