const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question_number: Number,
    question_text: String,
    question_type: String,
    question_options: [String],
    question_range: [String]
}, { collection: 'questions',
     preserveNull: true }); // Necessary since some fields will be null by design.

module.exports = mongoose.model('Question', QuestionSchema);