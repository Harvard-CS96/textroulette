const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: String,
    facebook: {
        id   : Number,
        name : String,
        token: String
    },
    date_registered: {type: Date, default: Date.now}
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);
