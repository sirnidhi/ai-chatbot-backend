const OpenAI = require('openai');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateResponse(messages, options = {}) {
    try {
      const startTime = Date.now();
      
      const completion = await this.client.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        ...options
      });

      const responseTime = Date.now() - startTime;
      const response = completion.choices[0].message.content;
      const tokens = completion.usage.total_tokens;

      logger.info(`OpenAI response generated in ${responseTime}ms, tokens: ${tokens}`);

      return {
        response,
        tokens,
        responseTime,
        provider: 'openai'
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async isHealthy() {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      logger.error('OpenAI health check failed:', error);
      return false;
    }
  }
}

module.exports = new OpenAIService();