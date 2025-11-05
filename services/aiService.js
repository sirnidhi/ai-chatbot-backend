const openaiService = require('./openaiService');
const geminiService = require('./geminiService');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.providers = {
      openai: openaiService,
      gemini: geminiService
    };
  }

  async generateResponse(messages, provider = 'openai', options = {}) {
    const service = this.providers[provider];
    
    if (!service) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    try {
      return await service.generateResponse(messages, options);
    } catch (error) {
      logger.error(`AI service error with ${provider}:`, error);
      
      // Fallback to alternative provider
      const fallbackProvider = provider === 'openai' ? 'gemini' : 'openai';
      logger.info(`Attempting fallback to ${fallbackProvider}`);
      
      try {
        const result = await this.providers[fallbackProvider].generateResponse(messages, options);
        result.provider = fallbackProvider;
        result.fallback = true;
        return result;
      } catch (fallbackError) {
        logger.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError);
        throw new Error('All AI providers are currently unavailable');
      }
    }
  }

  async getProviderHealth() {
    const health = {};
    
    for (const [provider, service] of Object.entries(this.providers)) {
      health[provider] = await service.isHealthy();
    }
    
    return health;
  }

  formatMessagesForAI(conversation) {
    return conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

module.exports = new AIService();