const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(messages, options = {}) {
    try {
      const startTime = Date.now();
      
      // Convert messages to Gemini format
      const prompt = this.formatMessagesForGemini(messages);
      
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const responseTime = Date.now() - startTime;
      const tokens = this.estimateTokens(prompt + response);

      logger.info(`Gemini response generated in ${responseTime}ms, estimated tokens: ${tokens}`);

      return {
        response,
        tokens,
        responseTime,
        provider: 'gemini'
      };
    } catch (error) {
      logger.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  formatMessagesForGemini(messages) {
    return messages.map(msg => {
      const role = msg.role === 'assistant' ? 'Model' : 'User';
      return `${role}: ${msg.content}`;
    }).join('\n\n');
  }

  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  async isHealthy() {
    try {
      await this.model.generateContent('Hello');
      return true;
    } catch (error) {
      logger.error('Gemini health check failed:', error);
      return false;
    }
  }
}

module.exports = new GeminiService();