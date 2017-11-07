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
* takes a chat object, feedback object
*/

function addChatFeedback(chat, feedback) {
  console.log("Adding feedback");
  if (chat.feedback.length < 2) {
    chat.feedback.push(feedback);

    // Save to the database
    chat.save((err) => {
      if (err) {
        throw err;
      }
    });

    var otherID = (chat.users.filter((u) => {
      u !== feedback.from;
    })[0];

    users.applyFeedback(otherID, feedback);
  }
}

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

module.exports = {
    logConnection,
    logDisconnection
}
