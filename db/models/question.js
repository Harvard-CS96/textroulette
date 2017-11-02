const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: String,
    answer_type: String, // e.g., 'binary', 'continuous', 'discrete-multiple'
    answer_options: [String],
    topic: String,
    is_active: Boolean,
    date_added: { type: Date, default: Date.now() }
}, { collection: 'questions',
     preserveNull: true }); // Necessary since some fields will be null by design.

module.exports = mongoose.model('Question', QuestionSchema);