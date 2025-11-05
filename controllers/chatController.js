const Conversation = require('../models/Conversation');
const QueryLog = require('../models/QueryLog');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

const sendMessage = async (req, res) => {
  try {
    const { message, conversationId, aiProvider = 'openai' } = req.body;
    const userId = req.user._id;
    const startTime = Date.now();

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
        isActive: true
      });
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({
        userId,
        aiProvider,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    const messages = aiService.formatMessagesForAI(conversation);
    const aiResult = await aiService.generateResponse(messages, aiProvider);

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResult.response,
      timestamp: new Date(),
      aiProvider: aiResult.provider,
      tokens: aiResult.tokens
    });

    conversation.totalTokens += aiResult.tokens;
    await conversation.save();

    // Log the query
    const queryLog = new QueryLog({
      userId,
      conversationId: conversation._id,
      userQuery: message,
      aiResponse: aiResult.response,
      aiProvider: aiResult.provider,
      responseTime: aiResult.responseTime,
      tokens: aiResult.tokens,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await queryLog.save();

    logger.info(`Chat message processed for user ${userId}, conversation ${conversation._id}`);

    res.json({
      conversationId: conversation._id,
      message: aiResult.response,
      provider: aiResult.provider,
      tokens: aiResult.tokens,
      responseTime: aiResult.responseTime,
      fallback: aiResult.fallback || false
    });

  } catch (error) {
    logger.error('Chat error:', error);
    
    // Log error
    if (req.body.conversationId) {
      const errorLog = new QueryLog({
        userId: req.user._id,
        conversationId: req.body.conversationId,
        userQuery: req.body.message,
        aiResponse: '',
        aiProvider: req.body.aiProvider || 'openai',
        responseTime: Date.now() - Date.now(),
        status: 'error',
        errorMessage: error.message,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      await errorLog.save().catch(() => {});
    }

    res.status(500).json({ error: 'Failed to process message' });
  }
};

const getConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const conversations = await Conversation.find({
      userId,
      isActive: true
    })
    .select('title createdAt updatedAt totalTokens aiProvider')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Conversation.countDocuments({ userId, isActive: true });

    res.json({
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: id,
      userId,
      isActive: true
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation updated successfully', conversation });
  } catch (error) {
    logger.error('Update conversation error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation
};