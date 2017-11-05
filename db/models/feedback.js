const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const BadgeSchema = require('./badge');

const FeedbackSchema = new mongoose.Schema({
    giver: UUID,
    receiver: UUID,
    chat: mongoose.Schema.Types.ObjectId,
    stars: { type: Number, min: 1, max: 5 },
    badges: { type: [BadgeSchema], default: [] },
    text: String
}, { collection: 'feedback' });

module.exports = mongoose.model("Feedback", FeedbackSchema);