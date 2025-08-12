// src/data/conversations.js
export const conversationsData = {
  conversations: [
    {
      id: "conv1",
      contact: {
        name: "Ravi Kumar",
        phone: "919937320320",
        avatar: "RK"
      },
      lastMessage: "Hi, I'd like to know more about your services.",
      lastMessageTime: "1691740800000",
      unreadCount: 0,
      messages: [
        {
          id: "msg1",
          from: "919937320320",
          to: "918329446654",
          text: "Hi, I'd like to know more about your services.",
          timestamp: "1691740800000",
          type: "incoming",
          status: "read"
        },
        {
          id: "msg2",
          from: "918329446654",
          to: "919937320320",
          text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
          timestamp: "1691740820000",
          type: "outgoing",
          status: "read"
        }
      ]
    },
    {
      id: "conv2",
      contact: {
        name: "Neha Joshi",
        phone: "929967673820",
        avatar: "NJ"
      },
      lastMessage: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
      lastMessageTime: "1691741830000",
      unreadCount: 0,
      messages: [
        {
          id: "msg3",
          from: "929967673820",
          to: "918329446654",
          text: "Hi, I saw your ad. Can you share more details?",
          timestamp: "1691741800000",
          type: "incoming",
          status: "read"
        },
        {
          id: "msg4",
          from: "918329446654",
          to: "929967673820",
          text: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
          timestamp: "1691741830000",
          type: "outgoing",
          status: "delivered"
        }
      ]
    }
  ],
  businessPhone: "918329446654"
};
