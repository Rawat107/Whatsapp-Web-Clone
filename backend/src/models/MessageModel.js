import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read'],
    default: 'sent'
  },
  timestamp: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

MessageSchema.index({ conversationId: 1, timestamp: -1 });

export default mongoose.model('Message', MessageSchema);