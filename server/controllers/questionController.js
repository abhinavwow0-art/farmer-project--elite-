const Question = require('../models/Question');

// GET /api/questions
exports.getQuestions = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        const questions = await Question.find(query).sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/questions
exports.createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const question = await Question.create({
            userId: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            title,
            content,
            tags: tags || []
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/questions/:id/answers
exports.addAnswer = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        question.answers.push({
            userId: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            content: req.body.content
        });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        if (question.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await question.deleteOne();
        res.json({ message: 'Question removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
