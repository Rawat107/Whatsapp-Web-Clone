import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageTime: -1 });

// Static method to find or create conversation
ConversationSchema.statics.findOrCreateConversation = async function(participants) {
  const sortedParticipants = participants.sort();
  
  let conversation = await this.findOne({ 
    participants: { $all: sortedParticipants, $size: sortedParticipants.length } 
  });
  
  if (!conversation) {
    conversation = new this({
      participants: sortedParticipants
    });
    await conversation.save();
  }
  
  return conversation;
};

export default mongoose.model('Conversation', ConversationSchema);