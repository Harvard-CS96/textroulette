const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: String,
    rating: Number,
    facebook: {
        id   : Number,
        name : String,
        token: String
    },
    // answers array members of the form:
    // {
    //   question: {
    //      id: String,
    //      response: Number,
    //      date: Date
    //    }
    // }
    answers: [ mongoose.Schema.Types.Mixed ],
    date_registered: {type: Date, default: Date.now}
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);
