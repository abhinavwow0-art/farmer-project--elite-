const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// @route   POST /api/ai/chat
// @desc    Chat with KrishiAI
// @access  Private
router.post('/chat', protect, aiController.chatWithAI);

module.exports = router;
