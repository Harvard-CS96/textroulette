const mongoose = require('mongoose');

// To add a new type of badge, update the enum
const BadgeSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: ['funny', 'creative', 'friendly']
    },
    img_uri: { 
        type: String,
        enum: ['uri1', 'uri2', 'uri3']    
    }
}, { noId: true })