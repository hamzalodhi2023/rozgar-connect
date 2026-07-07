import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, updateConversationLastMessage } from '../redux/slices/chatSlice.js';
import { setOnlineUsers } from '../redux/slices/authSlice.js';
import type { RootState } from '../redux/store';

const SocketContext = createContext(null);

const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${HOST}:5000`;

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { activeConversation } = useSelector((state: RootState) => state.chat);

  // Keep a ref of activeConversation so that event listeners can access its updated value without closing over stale state
  const activeConversationRef = React.useRef(activeConversation);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Global socket connected successfully');
    });

    socketInstance.on('onlineUsersList', (usersList) => {
      dispatch(setOnlineUsers(usersList));
    });

    socketInstance.on('newMessage', (message) => {
      // Access the ref's current value directly to prevent closures from using stale state
      const currentActiveConv = activeConversationRef.current;
      if (currentActiveConv && currentActiveConv._id === message.conversationId) {
        dispatch(addMessage(message));
      }

      dispatch(
        updateConversationLastMessage({
          conversationId: message.conversationId,
          lastMessage: message,
        })
      );
    });

    socketInstance.on('newConversationUpdate', (data) => {
      dispatch(
        updateConversationLastMessage({
          conversationId: data.conversationId,
          lastMessage: data.lastMessage,
        })
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken, isAuthenticated, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
