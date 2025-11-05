const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const QueryLog = require('../models/QueryLog');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

module.exports = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User ${socket.user.username} connected via Socket.IO`);

    // Join user to their personal room
    socket.join(`user_${socket.user._id}`);

    // Handle chat messages
    socket.on('send_message', async (data) => {
      try {
        const { message, conversationId, aiProvider = 'openai' } = data;
        const userId = socket.user._id;
        const startTime = Date.now();

        // Validate message
        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        let conversation;

        if (conversationId) {
          conversation = await Conversation.findOne({
            _id: conversationId,
            userId,
            isActive: true
          });
          
          if (!conversation) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
          }
        } else {
          conversation = new Conversation({
            userId,
            aiProvider,
            title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
          });
        }

        // Add user message
        const userMessage = {
          role: 'user',
          content: message,
          timestamp: new Date()
        };
        conversation.messages.push(userMessage);

        // Emit user message immediately
        socket.emit('message_received', {
          conversationId: conversation._id,
          message: userMessage,
          type: 'user'
        });

        // Emit typing indicator
        socket.emit('ai_typing', { conversationId: conversation._id });

        // Get AI response
        const messages = aiService.formatMessagesForAI(conversation);
        const aiResult = await aiService.generateResponse(messages, aiProvider);

        // Add AI response
        const aiMessage = {
          role: 'assistant',
          content: aiResult.response,
          timestamp: new Date(),
          aiProvider: aiResult.provider,
          tokens: aiResult.tokens
        };
        conversation.messages.push(aiMessage);

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
          ipAddress: socket.handshake.address,
          userAgent: socket.handshake.headers['user-agent']
        });
        await queryLog.save();

        // Stop typing indicator and emit AI response
        socket.emit('ai_typing_stop', { conversationId: conversation._id });
        socket.emit('message_received', {
          conversationId: conversation._id,
          message: aiMessage,
          type: 'assistant',
          provider: aiResult.provider,
          tokens: aiResult.tokens,
          responseTime: aiResult.responseTime,
          fallback: aiResult.fallback || false
        });

        logger.info(`Socket chat message processed for user ${userId}`);

      } catch (error) {
        logger.error('Socket chat error:', error);
        
        socket.emit('ai_typing_stop', { conversationId: data.conversationId });
        socket.emit('error', { 
          message: 'Failed to process message',
          details: error.message 
        });

        // Log error
        if (data.conversationId) {
          const errorLog = new QueryLog({
            userId: socket.user._id,
            conversationId: data.conversationId,
            userQuery: data.message,
            aiResponse: '',
            aiProvider: data.aiProvider || 'openai',
            responseTime: Date.now() - Date.now(),
            status: 'error',
            errorMessage: error.message,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent']
          });
          await errorLog.save().catch(() => {});
        }
      }
    });

    // Handle conversation events
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      logger.info(`User ${socket.user.username} joined conversation ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      logger.info(`User ${socket.user.username} left conversation ${conversationId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User ${socket.user.username} disconnected from Socket.IO`);
    });
  });
};