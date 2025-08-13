import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

// Import models
import Contact from './src/models/contactModel.js';
import Conversation from './src/models/ConversationModel.js';
import Message from './src/models/MessageModel.js';

const app = express();
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Basic middleware
app.use(cors());
app.use(express.json());

// API Routes
const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

// Get all conversations
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const customerPhone = conv.participants.find(p => p !== businessPhone);
        const contact = await Contact.findOne({ wa_id: customerPhone });
        
        return {
          id: conv._id,
          contact: {
            name: contact?.name || 'Unknown Contact',
            phone: customerPhone,
            avatar: contact?.avatar || 'UN'
          },
          lastMessage: conv.lastMessage?.text || '',
          lastMessageTime: conv.lastMessageTime.getTime().toString(),
          unreadCount: conv.unreadCount || 0
        };
      })
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
app.get('/api/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    
    const result = messages.map(msg => ({
      id: msg._id,
      messageId: msg.messageId,
      from: msg.from,
      to: msg.to,
      text: msg.text,
      timestamp: msg.timestamp.getTime().toString(),
      type: msg.type,
      status: msg.status
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Send a new message
app.post('/api/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const recipientPhone = conversation.participants.find(p => p !== businessPhone);
    
    const message = new Message({
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: conversation._id,
      from: businessPhone,
      to: recipientPhone,
      text: text.trim(),
      type: 'outgoing',
      status: 'sent',
      timestamp: new Date()
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = message.timestamp;
    await conversation.save();

    const result = {
      id: message._id,
      messageId: message.messageId,
      from: message.from,
      to: message.to,
      text: message.text,
      timestamp: message.timestamp.getTime().toString(),
      type: message.type,
      status: message.status
    };

    // Broadcast to socket
    io.to(conversationId).emit('new-message', { conversationId, message: result });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
  });
});

// Start server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;