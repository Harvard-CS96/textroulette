const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const BadgeSchema = new mongoose.Schema({
    uuid: UUID,
    name: { 
        type: String 
    }
}, { noId: true })

BadgeSchema.set('toObject', { getters: true }); // Return uuids as string in a nice way.
BadgeSchema.set('toJSON', { getters: true });

module.exports = BadgeSchema