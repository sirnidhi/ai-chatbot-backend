const mongoose = require('mongoose');

const queryLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  userQuery: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'gemini'],
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  tokens: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['success', 'error'],
    default: 'success'
  },
  errorMessage: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

queryLogSchema.index({ userId: 1, createdAt: -1 });
queryLogSchema.index({ aiProvider: 1, createdAt: -1 });
queryLogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('QueryLog', queryLogSchema);