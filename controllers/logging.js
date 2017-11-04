/**
 * logging.js
 * Controllers for logging events to the database
 */

const db = require('../db/connect');

const Chat = db.models.Chat;

function logConnection(payload) {

    console.log("Logging: logConnection fired");    

    // Instantiate new chat document
    const chat = new Chat({
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
        uid1: {$in: [who, partner]},
        uid2: {$in: [who, partner]},
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

module.exports = {
    logConnection,
    logDisconnection
}