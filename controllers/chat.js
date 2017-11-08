/**
 * chat.js
 * Controllers for interacting with chat documents in the database.
 */

const db = require('../db/connect');

const users = require('./users');

const Chat = db.models.Chat;

/**
* addChatFeedback
* Take a chat object containing all the data listed in the chat schema
* also includes a feedback object
* append that that feedback object to the chat feedback attribute which is a list
* verify that ChatSchema.feedback is of length >= 2
* takes a feedback object
*/

function addChatFeedback(feedback) {

    console.log("Chat: adding feedback");
    getMostRecent(feedback.from, (chat) => {
        if (chat.feedback.length >= 2) {
            return;
        }

        chat.feedback.push(feedback);

        // Save to the database
        chat.save((err) => {
            if (err) {
                throw err;
            }
        });
    
        var otherID = (chat.users.filter( (u) => {u !== feedback.from} ))[0];

        users.applyFeedback(otherID, feedback);
    })
}

function getMostRecent(uuid, callback) {
    // Get most recent chat involving a user with id uuid
    Chat.find({user_id: uuid})
        .sort('-connected.time')
        .limit(1)
        .exect((err, result) => {
            if (err) {
                throw err
            }
            callback(result)
        })
}

function logConnection(payload) {

    console.log("Chat: logConnection fired");

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

    console.log("Chat: logDisconnection fired on reason " + payload.reason);

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

module.exports = {
    logConnection,
    logDisconnection
}
