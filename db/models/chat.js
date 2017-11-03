const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    uid1: String,
    uid2: String,
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
