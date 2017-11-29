const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: String,
    answer_type: {
        type: String,
        enum: ['binary', 'continuous', 'five']
    },
    answer_options: [String],
    topic: String,
    is_active: Boolean,
    date_added: { type: Date, default: Date.now() }
}, { collection: 'questions',
     preserveNull: true }); // Necessary since some fields will be null by design.

module.exports = QuestionSchema