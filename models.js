/**
 * models.js
 * Data model definitions for MongoDB documents
 */

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    uid1: String,
    uid2: String,
    ts: {type: Date, default: Date.now},
}, { collection: 'chats' });

const UserSchema = new mongoose.Schema({
    // Define user schema here
})

// var exports = module.exports = {};
// exports.Chat = mongoose.model('Chat', ChatSchema);
// exports.User = mongoose.model('User', UserSchema);

const Chat = mongoose.model('Chat', ChatSchema)
const User = mongoose.model('User', UserSchema)

module.exports = {
    Chat,
    User
}
