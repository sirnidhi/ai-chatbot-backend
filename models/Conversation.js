const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'gemini'],
    required: function() {
      return this.role === 'assistant';
    }
  },
  tokens: {
    type: Number,
    default: 0
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'gemini'],
    default: 'openai'
  }
}, {
  timestamps: true
});

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ 'messages.timestamp': -1 });

module.exports = mongoose.model('Conversation', conversationSchema);