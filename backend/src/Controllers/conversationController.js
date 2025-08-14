import Contact from '../models/ContactModel.js';
import Conversation from '../models/ConversationModel.js';
import Message from '../models/MessageModel.js';

const conversationController = {
  
  /**
   * Get all conversations for the business account
   * GET /api/conversations
   */
  getConversations: async (req, res) => {
    try {
      const businessPhone = process.env.BUSINESS_PHONE || '918329446654';
      const { page = 1, limit = 20, includeArchived = false } = req.query;

      // Get conversations with pagination
      const conversations = await Conversation.find({
        participants: businessPhone,
        ...(includeArchived === 'false' && { 'metadata.isArchived': { $ne: true } })
      })
        .populate('lastMessage')
        .sort({ lastMessageTime: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Format conversations for frontend
      const formattedConversations = await Promise.all(
        conversations.map(async (conv) => {
          // Get customer phone (non-business participant)
          const customerPhone = conv.participants.find(p => p !== businessPhone);
          
          // Get contact information
          const contact = await Contact.findOne({ wa_id: customerPhone });
          
          return {
            id: conv._id,
            contact: {
              name: contact?.name || 'Unknown Contact',
              phone: customerPhone,
              avatar: contact?.avatar || 'UN'
            },
            lastMessage: conv.lastMessage?.text || 'No messages yet',
            lastMessageTime: conv.lastMessageTime.getTime().toString(),
            unreadCount: conv.unreadCount || 0,
            isArchived: conv.metadata?.isArchived || false,
            isMuted: conv.metadata?.isMuted || false
          };
        })
      );

      res.json({
        success: true,
        data: formattedConversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: conversations.length
        }
      });

    } catch (error) {
      console.error(' Error fetching conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversations',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get messages for a specific conversation
   * GET /api/conversations/:conversationId/messages
   */
  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50, sortOrder = 1 } = req.query;

      // Validate conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }

      // Get messages for the conversation
      const messages = await Message.getConversationMessages(conversationId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortOrder: parseInt(sortOrder)
      });

      // Format messages for frontend
      const formattedMessages = messages.map(msg => ({
        id: msg._id,
        messageId: msg.messageId,
        from: msg.from,
        to: msg.to,
        text: msg.text,
        timestamp: msg.timestamp.getTime().toString(),
        type: msg.type,
        status: msg.status
      }));

      res.json({
        success: true,
        data: formattedMessages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length
        }
      });

    } catch (error) {
      console.error(' Error fetching messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Send a new message
   * POST /api/conversations/:conversationId/messages
   */
  sendMessage: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { text } = req.body;
      const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

      // Validate input
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message text is required'
        });
      }

      if (text.trim().length > 4096) {
        return res.status(400).json({
          success: false,
          error: 'Message text too long (max 4096 characters)'
        });
      }

      // Validate conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }

      // Get recipient phone number
      const recipientPhone = conversation.participants.find(p => p !== businessPhone);
      if (!recipientPhone) {
        return res.status(400).json({
          success: false,
          error: 'Invalid conversation participants'
        });
      }

      // Create new message
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
      await conversation.updateLastMessage(message._id, message.timestamp);
      conversation.metadata.lastBusinessActivity = new Date();
      await conversation.save();

      // Format message for response
      const formattedMessage = {
        id: message._id,
        messageId: message.messageId,
        from: message.from,
        to: message.to,
        text: message.text,
        timestamp: message.timestamp.getTime().toString(),
        type: message.type,
        status: message.status
      };

      // Emit real-time event via Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.to(conversationId).emit('new-message', {
          conversationId,
          message: formattedMessage
        });
      }

      res.status(201).json({
        success: true,
        data: formattedMessage,
        message: 'Message sent successfully'
      });

    } catch (error) {
      console.error(' Error sending message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Update message status
   * PATCH /api/messages/:messageId/status
   */
  updateMessageStatus: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'sent', 'delivered', 'read', 'failed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Update message status
      const message = await Message.updateMessageStatus(messageId, status);
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      // Emit real-time status update
      const io = req.app.get('io');
      if (io) {
        io.to(message.conversationId.toString()).emit('message-status-update', {
          conversationId: message.conversationId,
          messageId: message.messageId,
          status: message.status
        });
      }

      res.json({
        success: true,
        data: {
          messageId: message.messageId,
          status: message.status,
          updatedAt: new Date().toISOString()
        },
        message: 'Message status updated successfully'
      });

    } catch (error) {
      console.error(' Error updating message status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update message status',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Search conversations
   * GET /api/conversations/search
   */
  searchConversations: async (req, res) => {
    try {
      const { q: searchTerm, limit = 10 } = req.query;
      const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

      if (!searchTerm || searchTerm.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Search term is required'
        });
      }

      // Search contacts first
      const contacts = await Contact.searchContacts(searchTerm.trim(), limit);
      
      // Get conversations for found contacts
      const contactPhones = contacts.map(c => c.wa_id);
      const conversations = await Conversation.find({
        participants: { $all: [businessPhone], $in: contactPhones }
      })
        .populate('lastMessage')
        .sort({ lastMessageTime: -1 });

      // Format results
      const formattedResults = await Promise.all(
        conversations.map(async (conv) => {
          const customerPhone = conv.participants.find(p => p !== businessPhone);
          const contact = contacts.find(c => c.wa_id === customerPhone);

          return {
            id: conv._id,
            contact: {
              name: contact?.name || 'Unknown Contact',
              phone: customerPhone,
              avatar: contact?.avatar || 'UN'
            },
            lastMessage: conv.lastMessage?.text || 'No messages yet',
            lastMessageTime: conv.lastMessageTime.getTime().toString(),
            unreadCount: conv.unreadCount || 0
          };
        })
      );

      res.json({
        success: true,
        data: formattedResults,
        searchTerm: searchTerm.trim(),
        resultsCount: formattedResults.length
      });

    } catch (error) {
      console.error(' Error searching conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search conversations',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

export default conversationController;