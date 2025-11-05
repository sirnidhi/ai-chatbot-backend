const Joi = require('joi');

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  chatMessage: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    conversationId: Joi.string().optional(),
    aiProvider: Joi.string().valid('openai', 'gemini').optional()
  }),

  updateConversation: Joi.object({
    title: Joi.string().min(1).max(100).optional()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }
    next();
  };
};

module.exports = {
  validate,
  schemas
};