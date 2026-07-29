import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import toast from 'react-hot-toast';
import {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  setChatLoading,
} from '../redux/slices/chatSlice.js';
import { getConversations, getMessages } from '../services/chat.service.js';
import { useSocket } from '../context/SocketContext';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations, activeConversation, messages, loading } = useSelector((state: RootState) => state.chat);
  const socket = useSocket();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    const loadConversationsList = async () => {
      dispatch(setChatLoading(true));
      try {
        const response = await getConversations();
        if (response.success) {
          dispatch(setConversations(response.data.conversations));
        }
      } catch (error) {
        toast.error('Failed to load conversations list');
      } finally {
        dispatch(setChatLoading(false));
      }
    };
    loadConversationsList();
  }, [dispatch]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    // Join conversation Socket room
    if (socket) {
      socket.emit('joinConversation', activeConversation._id);
    }

    const loadMessagesList = async () => {
      try {
        const response = await getMessages(activeConversation._id);
        if (response.success) {
          dispatch(setMessages(response.data.messages));
        }
      } catch (error) {
        toast.error('Failed to load message history');
      }
    };
    loadMessagesList();

    // Cleanup: Leave conversation Socket room
    return () => {
      if (socket) {
        socket.emit('leaveConversation', activeConversation._id);
      }
    };
  }, [activeConversation?._id, dispatch]);

  // Reset typing states when switching conversations or on unmount
  useEffect(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [activeConversation?._id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Listen for typing events from other participants
  useEffect(() => {
    setIsRecipientTyping(false);

    if (!socket || !activeConversation) return;

    const handleUserTyping = (data) => {
      if (data.conversationId === activeConversation._id && data.userId !== user.id) {
        setIsRecipientTyping(data.typing);
      }
    };

    socket.on('userTyping', handleUserTyping);

    const handleError = (data: any) => {
      toast.error(data.message);
    };
    socket.on('error', handleError);

    return () => {
      socket.off('userTyping', handleUserTyping);
      socket.off('error', handleError);
    };
  }, [activeConversation?._id, socket, user.id]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageText(value);

    if (!socket || !activeConversation) return;

    if (value.trim() === '') {
      if (isTyping) {
        socket.emit('stopTyping', { conversationId: activeConversation._id });
        setIsTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { conversationId: activeConversation._id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: activeConversation._id });
      setIsTyping(false);
    }, 2000);
  };

  // Auto Scroll to bottom on new message or when recipient starts typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecipientTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const recipient = activeConversation.participants.find((p) => p._id !== user.id);
    if (!recipient) return;

    // Send via socket connection (it handles db save & global emit)
    if (socket) {
      socket.emit('sendMessage', {
        conversationId: activeConversation._id,
        content: messageText,
        recipientId: recipient._id,
      });
      // Stop typing immediately
      socket.emit('stopTyping', { conversationId: activeConversation._id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setMessageText('');
  };

  const getRecipientName = (conversation) => {
    const recipient = conversation.participants.find((p) => p._id !== user.id);
    return recipient?.name || 'Skilled Worker';
  };

  const getRecipientRoleLabel = (conversation) => {
    const recipient = conversation.participants.find((p) => p._id !== user.id);
    if (recipient?.roles.includes('worker')) return 'Worker';
    return 'Customer';
  };

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[450px] flex rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
      {/* Conversations List Panel (Left Side) */}
      <ChatSidebar
        conversations={conversations}
        loading={loading}
        activeConversation={activeConversation}
        dispatch={dispatch}
        setActiveConversation={setActiveConversation}
        getRecipientName={getRecipientName}
        getRecipientRoleLabel={getRecipientRoleLabel}
      />

      {/* Chat Messages Panel (Right Side) */}
      <ChatWindow
        user={user}
        activeConversation={activeConversation}
        messages={messages}
        isRecipientTyping={isRecipientTyping}
        messagesEndRef={messagesEndRef}
        messageText={messageText}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        dispatch={dispatch}
        setActiveConversation={setActiveConversation}
        getRecipientName={getRecipientName}
        getRecipientRoleLabel={getRecipientRoleLabel}
      />
    </div>
  );
}
