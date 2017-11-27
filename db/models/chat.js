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
    user1: UUID,
    user2: UUID,
    connected: {
        time: {type: Date, default: Date.now}
    },
    disconnected: {
        is_disconnected: {type: Boolean, default: false},
        time: Date,
        reason: {type: String, enum: ['hangup', 'disconnect']},
        who: String,
    },
    feedback: {
        type: [FeedbackSchema],
        default: []
    }
}, { collection: 'chats', preserveNull: true });

ChatSchema.set('toObject', {getters: true}); // Returns uuid as string when accessed.
ChatSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('Chat', ChatSchema);
