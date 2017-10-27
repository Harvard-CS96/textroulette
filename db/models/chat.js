const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    uid1: String,
    uid2: String,
    ts: {type: Date, default: Date.now},
}, { collection: 'chats' });

module.exports = mongoose.model('Chat', ChatSchema);
