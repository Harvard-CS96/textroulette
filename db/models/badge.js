const mongoose = require('mongoose');

// To add a new type of badge, update the enum
const BadgeSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: ['funny', 'creative', 'friendly']
    }
}, { noId: true })