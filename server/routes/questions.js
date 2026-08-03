const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion, addAnswer, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.get('/', getQuestions);
router.post('/', protect, createQuestion);
router.post('/:id/answers', protect, addAnswer);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
