const mongoose = require('mongoose');

const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const FeedbackSchema = new mongoose.Schema({
    giver: UUID,
    receiver: UUID,
    chat: String,
    stars: Number,
    badges: [],
    text: String
}, { collection: 'feedback'});