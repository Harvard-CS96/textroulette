/**
 * models.js
 * Data model definitions for MongoDB documents
 */

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    uid1: String,
    uid2: String,
    ts: {type: Date, default: Date.now}
});

const UserSchema = new mongoose.Schema({
    // Define user schema here
})

var exports = module.exports = {};
exports.ChatModel = mongoose.model('Chat', ConversationSchema);
exports.UserModel = mongoose.model('User', UserSchema);
