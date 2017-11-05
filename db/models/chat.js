const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const ChatSchema = new mongoose.Schema({
    uid1: UUID,
    uid2: UUID,
    connected: {
        time: {type: Date, default: Date.now}
    },
    disconnected: { 
        is_disconnected: Boolean,
        time: Date,
        reason: String,
        who: String
    }
}, { collection: 'chats', preserveNull: true });

module.exports = mongoose.model('Chat', ChatSchema);
