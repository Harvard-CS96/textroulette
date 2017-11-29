const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const CriticismSchema = new mongoose.Schema({
  uuid: UUID,
  name: {
    type: String
  }
}, { collection: 'criticisms' })

CriticismSchema.set('toObject', { getters: true }); // Return uuids as string in a nice way.
CriticismSchema.set('toJSON', { getters: true });

module.exports = CriticismSchema