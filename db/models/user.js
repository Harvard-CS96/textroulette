const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

// Note: I am aware not everyone will be a fan of how I abstracted this schema stuff.
// I think it will be good in terms of increasing understanding and usability.

// Single response to a specific question
const ResponseSchema = new mongoose.Schema({
	date: {
        type: Date,
        default: Date.now
    },
	response: String
}, { noId: true })

// Vector is list of question responses.
const VectorSchema = new mongoose.Schema({
    question_id: String,
    response_data: [ResponseSchema]
}, { noId: true })

const UserSchema = new mongoose.Schema({
    uuid: { type: UUID, default: uuid.v4 },
    rating: { type: Number, default: 100 },
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
    date_registered: { type: Date, default: Date.now },
    questions_answered: { type: [VectorSchema], default: [] },
}, { collection: 'users' }) 

UserSchema.set('toObject', {getters: true});
UserSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('User', UserSchema);
