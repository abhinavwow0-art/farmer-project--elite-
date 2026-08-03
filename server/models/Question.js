const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'farmer' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'farmer' },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    answers: [answerSchema]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
