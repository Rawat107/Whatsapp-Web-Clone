import Contact from '../models/contactModel';
import Conversation from '../models/ConversationModel';
import Message from '../models/MessageModel';

const conversationController = {
  // Get all conversations
  getConversations: async (req, res) => {
    try {
      const businessPhone = process.env.BUSINESS_PHONE || '918329446654';
      
      const conversations = await Conversation.find()
        .populate('lastMessage')
        .sort({ lastMessageTime: -1 });

      const formattedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const contactPhone = conv.participants.find(p => p !== businessPhone);
          const contact = await Contact.findOne({ wa_id: contactPhone });
          
          return {
            id: conv._id,
            contact: {
              name: contact?.name || 'Unknown Contact',
              phone: contactPhone,
              avatar: contact?.avatar || 'UN'
            },
            lastMessage: conv.lastMessage?.text || '',
            lastMessageTime: conv.lastMessageTime,
            unreadCount: conv.unreadCount
          };
        })
      );

      res.json({
        success: true,
        data: formattedConversations
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversations'
      });
    }
  },

  // Get messages for a conversation
  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      const messages = await Message.find({ conversationId })
        .sort({ timestamp: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const formattedMessages = messages.map(msg => ({
        id: msg._id,
        messageId: msg.messageId,
        from: msg.from,
        to: msg.to,
        text: msg.text,
        timestamp: msg.timestamp,
        type: msg.type,
        status: msg.status
      }));

      res.json({
        success: true,
        data: formattedMessages
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  },

  // Send a new message
  sendMessage: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { text } = req.body;
      const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message text is required'
        });
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
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

      const formattedMessage = {
        id: message._id,
        messageId: message.messageId,
        from: message.from,
        to: message.to,
        text: message.text,
        timestamp: message.timestamp,
        type: message.type,
        status: message.status
      };

      res.json({
        success: true,
        data: formattedMessage
      });

    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  }
};

module.exports = conversationController;