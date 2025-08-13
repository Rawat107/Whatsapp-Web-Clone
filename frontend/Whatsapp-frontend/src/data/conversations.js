/**
 * Conversations Data
 * 
 * Purpose: Sample conversation data converted from webhook JSON files
 * - Contains the Ravi Kumar and Neha Joshi conversations
 * - Properly formatted timestamps and message structure
 * - Business phone number configuration
 * - This simulates data that would come from your backend API
 */

export const conversationsData = {
  conversations: [
    {
      // Conversation 1: Ravi Kumar
      id: "conv1",
      contact: {
        name: "Ravi Kumar",
        phone: "919937320320",
        avatar: "RK" // Will be auto-generated from name
      },
      lastMessage: "Hi, I'd like to know more about your services.",
      lastMessageTime: "1691740800000", // Converted to milliseconds
      unreadCount: 0,
      messages: [
        {
          id: "msg1",
          from: "919937320320", // From Ravi Kumar
          to: "918329446654",   // To Business
          text: "Hi, I'd like to know more about your services.",
          timestamp: "1691740800000", // 2023-08-06 12:00:00 UTC
          type: "incoming",
          status: "read"
        },
        {
          id: "msg2",
          from: "918329446654", // From Business
          to: "919937320320",   // To Ravi Kumar
          text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
          timestamp: "1691740820000", // 2023-08-06 12:00:20 UTC
          type: "outgoing",
          status: "read"
        }
      ]
    },
    {
      // Conversation 2: Neha Joshi
      id: "conv2",
      contact: {
        name: "Neha Joshi",
        phone: "929967673820",
        avatar: "NJ" // Will be auto-generated from name
      },
      lastMessage: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
      lastMessageTime: "1691741830000", // Most recent message time
      unreadCount: 0,
      messages: [
        {
          id: "msg3",
          from: "929967673820", // From Neha Joshi
          to: "918329446654",   // To Business
          text: "Hi, I saw your ad. Can you share more details?",
          timestamp: "1691741800000", // 2023-08-06 12:16:40 UTC
          type: "incoming",
          status: "read"
        },
        {
          id: "msg4",
          from: "918329446654", // From Business
          to: "929967673820",   // To Neha Joshi
          text: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
          timestamp: "1691741830000", // 2023-08-06 12:17:10 UTC
          type: "outgoing",
          status: "delivered" // Not read yet
        }
      ]
    }
  ],
  
  // Business phone number (your WhatsApp Business account)
  businessPhone: "918329446654"
};

/**
 * Helper function to get conversation by ID
 * @param {string} conversationId 
 * @returns {Object|null} Conversation object or null if not found
 */
export const getConversationById = (conversationId) => {
  return conversationsData.conversations.find(conv => conv.id === conversationId) || null;
};

/**
 * Helper function to add a new message to a conversation
 * @param {string} conversationId 
 * @param {Object} message 
 * @returns {Object} Updated conversations data
 */
export const addMessageToConversation = (conversationId, message) => {
  const conversations = [...conversationsData.conversations];
  const convIndex = conversations.findIndex(conv => conv.id === conversationId);
  
  if (convIndex !== -1) {
    conversations[convIndex] = {
      ...conversations[convIndex],
      messages: [...conversations[convIndex].messages, message],
      lastMessage: message.text,
      lastMessageTime: message.timestamp
    };
  }
  
  return { ...conversationsData, conversations };
};