/**
 * chat.js
 * Controllers for interacting with chat documents in the database.
 */

const db = require('../db/connect');

const Chat = db.models.Chat;

function logConnection(payload) {

    console.log("Logging: logConnection fired");    

    // Instantiate new chat document
    const chat = new Chat({
        users: [payload.uid1, payload.uid2],
    });

    // Save to the database
    chat.save((err) => {
        if (err) {
            throw err;
        } 
    });
}

function logDisconnection(payload) {

    console.log("Logging: logDisconnection fired on reason " + payload.reason);

    // The disconnecter
    const who = payload.who;
    // The disconnectee
    const partner = payload.partner;

    // Instructions to locate the ongoing conversation in the database
    const query = {
        $or: [
            {users: [who, partner]},
            {users: [partner, who]}
        ],
        disconnected: {is_disconnected: false}
    };

    // Instructions to update that conversation's disconnection data
    const update = {
        disconnected: {
            who: who,
            time: Date.now(),
            reason: payload.reason,
            is_disconnected: true
        }
    };

    // Execute the update
    Chat.findOneAndUpdate(query, update).exec();
} 

function getMostRecent(user_id, callback) {
    // Get most recent chat for a user
    Chat.find({ users: user_id })
        .sort('-connected.time')
        .limit(1)
        .exec((err, result) => {
            callback(result[0]);
        });
}

module.exports = {
    logConnection,
    logDisconnection,
    getMostRecent
}