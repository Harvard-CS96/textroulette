const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Define user schema here
})

module.exports = mongoose.model('User', UserSchema);
