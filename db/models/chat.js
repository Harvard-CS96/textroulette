const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    uid1: String,
    uid2: String,
    start_time: {type: Date, default: Date.now},
    end_time: Date
}, { collection: 'chats' });

module.exports = mongoose.model('Chat', ChatSchema);
