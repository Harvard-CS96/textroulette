const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const BadgeSchema = require('./badge');

// How many badges of a certain type does this user have?
const BadgeCountSchema = new mongoose.Schema({
    badge: BadgeSchema,
    count: Number
}, { noId: true })

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
    question_id: mongoose.Schema.Types.ObjectId,
    response_data: [ResponseSchema]
}, { noId: true })

const UserSchema = new mongoose.Schema({
    uuid: { type: UUID, default: uuid.v4 },
    rating: { type: Number, default: 5 },
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
    badges: { type: [BadgeCountSchema], default: [] },
}, { collection: 'users' }) 

UserSchema.set('toObject', {getters: true});
UserSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('User', UserSchema);
