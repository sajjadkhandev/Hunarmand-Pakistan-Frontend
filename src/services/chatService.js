/**
 * Real-Time Chat Service
 * Handles conversation threads, message exchange, and Socket.IO real-time channels
 */

import api from './api';
import { io } from 'socket.io-client';

let socket = null;

// Initialize or retrieve existing Socket connection
export const getSocket = () => {
  if (!socket) {
    const SOCKET_URL = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
};

// API Endpoints
export const getOrCreateConversation = async (recipientId, serviceRequestId = null) => {
  return await api.post('/chat/conversations', {
    recipientId,
    serviceRequestId,
  });
};

export const fetchMyConversations = async () => {
  return await api.get('/chat/conversations');
};

export const fetchMessages = async (conversationId) => {
  return await api.get(`/chat/conversations/${conversationId}/messages`);
};

export const sendMessage = async (conversationId, text) => {
  return await api.post('/chat/messages', {
    conversationId,
    text,
  });
};

export const markMessagesAsRead = async (conversationId) => {
  return await api.patch(`/chat/conversations/${conversationId}/read`);
};

export default {
  getSocket,
  getOrCreateConversation,
  fetchMyConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
};
