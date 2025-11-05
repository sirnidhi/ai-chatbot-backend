const express = require('express');
const {
  sendMessage,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation
} = require('../controllers/chatController');
const { validate, schemas } = require('../utils/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

router.post('/message', validate(schemas.chatMessage), sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.put('/conversations/:id', validate(schemas.updateConversation), updateConversation);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;