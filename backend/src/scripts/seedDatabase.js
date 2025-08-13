import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/contactModel.js';
import Conversation from '../models/ConversationModel.js';
import Message from '../models/MessageModel.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to MongoDB
await connectDB();

const webhookData = [
  {
    contact: { name: "Ravi Kumar", wa_id: "919937320320" },
    messages: [
      {
        messageId: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=",
        from: "919937320320",
        to: "918329446654",
        text: "Hi, I'd like to know more about your services.",
        timestamp: new Date('2025-08-06T12:00:00.000Z'),
        type: "incoming",
        status: "read"
      },
      {
        messageId: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggNDc4NzZBQ0YxMjdCQ0VFOTk2NzA3MTI4RkZCNjYyMjc=",
        from: "918329446654",
        to: "919937320320",
        text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
        timestamp: new Date('2025-08-06T12:00:20.000Z'),
        type: "outgoing",
        status: "read"
      }
    ]
  },
  {
    contact: { name: "Neha Joshi", wa_id: "929967673820" },
    messages: [
      {
        messageId: "wamid.HBgMOTI5OTY3NjczODIwFQIAEhggQ0FBQkNERUYwMDFGRjEyMzQ1NkZGQTk5RTJCM0I2NzY=",
        from: "929967673820",
        to: "918329446654",
        text: "Hi, I saw your ad. Can you share more details?",
        timestamp: new Date('2025-08-06T12:16:40.000Z'),
        type: "incoming",
        status: "read"
      },
      {
        messageId: "wamid.HBgMOTI5OTY3NjczODIwFQIAEhggM0RFNDkxRjEwNDhDQzgwMzk3NzA1ODc1RkU3QzI0MzU=",
        from: "918329446654",
        to: "929967673820",
        text: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
        timestamp: new Date('2025-08-06T12:17:10.000Z'),
        type: "outgoing",
        status: "delivered"
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Contact.deleteMany({});
    console.log('Cleared existing data');

    const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

    for (const convData of webhookData) {
      // Create contact
      const contact = new Contact({
        wa_id: convData.contact.wa_id,
        name: convData.contact.name,
        lastSeen: new Date()
      });
      await contact.save();
      console.log(`Created contact: ${contact.name}`);

      // Create conversation
      const participants = [convData.contact.wa_id, businessPhone].sort();
      const conversation = await Conversation.findOrCreateConversation(participants);
      console.log(`Created conversation: ${conversation._id}`);

      // Create messages
      let lastMessage = null;
      for (const msgData of convData.messages) {
        const message = new Message({
          messageId: msgData.messageId,
          conversationId: conversation._id,
          from: msgData.from,
          to: msgData.to,
          text: msgData.text,
          type: msgData.type,
          status: msgData.status,
          timestamp: msgData.timestamp
        });
        await message.save();
        lastMessage = message;
        console.log(`Created message: ${msgData.text.substring(0, 30)}...`);
      }

      // Update conversation
      if (lastMessage) {
        conversation.lastMessage = lastMessage._id;
        conversation.lastMessageTime = lastMessage.timestamp;
        await conversation.save();
      }
    }

    const messageCount = await Message.countDocuments();
    const conversationCount = await Conversation.countDocuments();
    const contactCount = await Contact.countDocuments();

    console.log('\nSeeding completed!');
    console.log(`Messages: ${messageCount}`);
    console.log(`Conversations: ${conversationCount}`);
    console.log(`Contacts: ${contactCount}`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();