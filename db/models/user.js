const mongoose = require('mongoose');

// Note: I am aware not everyone will be a fan of how I abstracted this schema stuff.
// I think it will be good in terms of increasing understanding and usability.

// Single response to a specific question
const ResponseSchema = new mongoose.Schema({
	date: Date,
	response: String
}, { noId: true })

// Vector is list of question responses.
const VectorSchema = new mongoose.Schema([{
    question_id: String,
    response_data: [ResponseSchema]
}], { noId: true })

const UserSchema = new mongoose.Schema({
    uuid: String,
    rating: Number,
    facebook: {
        id   : Number,
        name : String,
        token: String
    },
    status: {
        type: String,
        enum: ['offline', 'online', 'paired', 'pairing'],
        default: 'online'
    },
    date_registered: {type: Date, default: Date.now},
    questions_answered: [VectorSchema]
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);
