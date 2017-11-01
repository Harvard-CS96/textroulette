/**
 * logging.js
 * Callbacks for logging events to the database
 */

const db = require('../db/connect');

function logConnection(payload) {

    console.log("Logging: logConnection fired");    

    // Instantiate new chat document
    const chat = new db.models.Chat({
        uid1: payload.uid1, 
        uid2: payload.uid2,
        disconnected: {
            is_disconnected: false,
            time: undefined,
            who: undefined,
            reason: undefined
        }
    });

    // Save to the database
    chat.save((err, _) => {
        if (err) throw err;
    });
}

function logDisconnection(payload) {

    console.log("Logging: logDisconnection fired on reason " + payload.reason);

    // The disconnecter
    const who = payload.who;
    // The disconnectee
    const partner = payload.partner;

    // Find the ongoing conversation
    const query = {
        uid1: {$in: [who, partner]},
        uid2: {$in: [who, partner]},
        disconnected: {is_disconnected: false}
    };

    // Update disconnect data
    const update = {
        disconnected: {
            is_disconnected: true,
            who: who,
            reason: payload.reason
        }
    };

    // Update disconnection time and reason
    db.models.Chat.findOneAndUpdate(query, update).exec();
} 

module.exports = {
    logConnection,
    logDisconnection
}