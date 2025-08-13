/**
 * Socket Utility
 * 
 * Purpose: Handle WebSocket connection for real-time messaging
 * - Creates socket.io client connection to backend
 * - Handles connection/disconnection events
 * - Only connects if VITE_SOCKET_URL environment variable is set
 * - Used for real-time message updates and status changes
 */

import { io } from 'socket.io-client';

/**
 * Create and return a socket instance
 * @returns {Socket|null} Socket instance or null if no URL configured
 */
export const createSocket = () => {
  // Get socket URL from environment variables
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  
  // If no socket URL is configured, return null (app works without real-time)
  if (!socketUrl) {
    console.log('No VITE_SOCKET_URL configured, running in offline mode');
    return null;
  }

  // Create socket connection
  const socket = io(socketUrl, {
    // Use WebSocket transport for better performance
    transports: ['websocket'],
    
    // Automatically try to reconnect if connection is lost
    autoConnect: true,
    
    // Reconnection options
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    
    // Timeout settings
    timeout: 20000,
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log(' Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log(' Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error(' Socket connection error:', error);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection failed:', error);
  });

  return socket;
};

/**
 * Join a conversation room (for receiving real-time messages)
 * @param {Socket} socket - Socket instance
 * @param {string} conversationId - ID of conversation to join
 */
export const joinConversationRoom = (socket, conversationId) => {
  if (socket && socket.connected) {
    socket.emit('join-conversation', conversationId);
    console.log(' Joined conversation room:', conversationId);
  }
};

/**
 * Leave a conversation room
 * @param {Socket} socket - Socket instance
 * @param {string} conversationId - ID of conversation to leave
 */
export const leaveConversationRoom = (socket, conversationId) => {
  if (socket && socket.connected) {
    socket.emit('leave-conversation', conversationId);
    console.log(' Left conversation room:', conversationId);
  }
};

/**
 * Send a message via socket (for real-time delivery)
 * @param {Socket} socket - Socket instance
 * @param {string} conversationId - ID of conversation
 * @param {Object} message - Message object
 */
export const sendMessageViaSocket = (socket, conversationId, message) => {
  if (socket && socket.connected) {
    socket.emit('send-message', {
      conversationId,
      message
    });
    console.log('💬 Message sent via socket:', message.text);
  }
};