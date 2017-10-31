/**
 * logging.js
 * Callbacks for logging events to the database
 */

const db = require('../db/connect');

function logConnection(payload) {
    const chat = new db.models.Chat({
        uid1: payload.uid1, 
        uid2: payload.uid2
    });

    chat.save()    
}

module.exports = {
    logConnection
}