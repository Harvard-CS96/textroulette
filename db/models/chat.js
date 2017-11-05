const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const BadgeSchema = require('./badge');

// collect feedback on a conversation
const FeedbackSchema = new mongoose.Schema({
    from: UUID,
    chat: mongoose.Schema.Types.ObjectId,
    stars: {type: Number, min: 1, max: 5},
    badges: {type: [BadgeSchema], default: []},
    text: String
}, { noId: true });

const ChatSchema = new mongoose.Schema({
    users: [UUID],
    connected: {
        time: {type: Date, default: Date.now}
    },
    disconnected: { 
        is_disconnected: {type: Boolean, default: false},
        time: Date,
        reason: String,
        who: String,
    },
    feedback: [FeedbackSchema]
}, { collection: 'chats', preserveNull: true });

module.exports = mongoose.model('Chat', ChatSchema);
