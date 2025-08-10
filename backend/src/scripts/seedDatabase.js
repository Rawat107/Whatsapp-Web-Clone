import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config()

import connectDB from '../config/db';

import Contact from '../models/contactModel';
import Conversation from '../models/ConversationModel';
import Message from '../models/MessageModel';

// MongoDB connection
connectDB()

// Sample webhook data
const webhookData = [
  // Ravi Kumar conversation
  {
    contact: { name: "Ravi Kumar", wa_id: "919937320320" },
    messages: [
      {
        messageId: "msg_ravi_1",
        from: "919937320320",
        to: "918329446654",
        text: "Hi, I'd like to know more about your services.",
        timestamp: new Date('2025-08-06T12:00:00.000Z'),
        type: "incoming",
        status: "read"
      },
      {
        messageId: "msg_ravi_2", 
        from: "918329446654",
        to: "919937320320",
        text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
        timestamp: new Date('2025-08-06T12:00:20.000Z'),
        type: "outgoing",
        status: "read"
      }
    ]
  },
  // Neha Joshi conversation
  {
    contact: { name: "Neha Joshi", wa_id: "929967673820" },
    messages: [
      {
        messageId: "msg_neha_1",
        from: "929967673820", 
        to: "918329446654",
        text: "Hi, I saw your ad. Can you share more details?",
        timestamp: new Date('2025-08-06T12:16:40.000Z'),
        type: "incoming",
        status: "read"
      },
      {
        messageId: "msg_neha_2",
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
    console.log(' Starting database seeding...');
    
    // Clear existing data
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Contact.deleteMany({});
    console.log('  Cleared existing data');

    const businessPhone = process.env.BUSINESS_PHONE || '918329446654';

    // Process each conversation
    for (const convData of webhookData) {
      // Create or update contact
      const contact = await Contact.findOneAndUpdate(
        { wa_id: convData.contact.wa_id },
        { 
          name: convData.contact.name,
          avatar: convData.contact.name.split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2),
          lastSeen: new Date()
        },
        { upsert: true, new: true }
      );
      
      console.log(` Created/updated contact: ${contact.name}`);

      // Create conversation
      const participants = [convData.contact.wa_id, businessPhone].sort();
      const conversation = await Conversation.findOrCreateConversation(participants);
      
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
        console.log(` Created message: "${msgData.text.substring(0, 30)}..."`);
      }

      // Update conversation with last message
      if (lastMessage) {
        conversation.lastMessage = lastMessage._id;
        conversation.lastMessageTime = lastMessage.timestamp;
        await conversation.save();
      }
    }

    // Display summary
    const messageCount = await Message.countDocuments();
    const conversationCount = await Conversation.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log('\n Seeding Summary:');
    console.log(`    Messages: ${messageCount}`);
    console.log(`    Conversations: ${conversationCount}`);
    console.log(`    Contacts: ${contactCount}`);
    console.log('\n Database seeding completed!');
    
  } catch (error) {
    console.error(' Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase };