/**
 * chat.js
 * Controllers for interacting with chat documents in the database.
 */

const db = require('../db/connect');

const users = require('./users');

const Chat = db.models.Chat;

// const UUID = require('uuid-1345');
// require('mongoose-uuid2')(mongoose);

/**
* addChatFeedback
* Take a chat object containing all the data listed in the chat schema
* also includes a feedback object
* append that that feedback object to the chat feedback attribute which is a list
* verify that ChatSchema.feedback is of length >= 2
* takes a feedback object
*/

function logFeedback(feedback) {

    getMostRecent(feedback.from, (chat) => {

        if (!chat){
            console.log('did not find last conversation of ' + feedback.from);
            return;
        }
        if (chat.feedback.length >= 2) {
            return;
        }

        chat.feedback.push(feedback);

        // Save to the database
        chat.save((err) => {
            if (err) {
                console.log(err);
            }
        });
    

        var otherID = feedback.from === chat.user1 ? chat.user2 : chat.user1;

        console.log("Chat: adding feedback from " + feedback.from + " to " + otherID);

        users.applyFeedback(otherID, feedback);
    })

}

function getMostRecent(uuid, callback) {
    // Get most recent chat involving a user with id uuid
    var query = {
        $or: [ 
            { user1: uuid }, 
            { user2: uuid }
        ]
    }
    Chat.find(query)
        .sort({'connected.time': -1})
        .limit(1)
        .exec((err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                callback(result[0]) // A list was returned, must get element.
            }
        })
}

function getChatsForUUID(uuid, callback) {
    // Get all chats involving a user
    var query = {
        $or: [
            { user1: uuid },
            { user2: uuid }
        ],
        "disconnected.is_disconnected": true,
    }

    Chat.find(query)
        .exec((err, chats) => {
            if (err) {
                console.log(err);
            }
            
            var promises = chats.map(chat => {
                var partner_id = uuid === chat.user1 ? chat.user2 : chat.user1;

                return users.findById(partner_id, res => {});
            })

            Promise.all(promises).then((partners) => {
                var chats_w_name = chats.map((chat, i) => {
                    return [chat, partners[i].facebook.name]
                })
                callback(chats_w_name);
            })
        })
}

function logConnection(payload) {
    console.log("Chat: logConnection fired");
    // Instantiate new chat document
    const chat = new Chat({
        user1: payload.uid1, 
        user2: payload.uid2,
    });

    // Save to the database
    chat.save((err) => {
        if (err) {
            console.log(err);
        }
    });
}

function logDisconnection(payload) {
    console.log("Chat: logDisconnection fired on reason " + payload.reason);

    // disconnecter, disconectee
    const { who, partner }  = payload;

    // Instructions to locate the ongoing conversation in the database
    const query = {
        $or: [
            { $and: [
                { user1: who }, 
                { user2: partner }
                ]
            },
            { $and: [
                { user1: partner }, 
                { user2: who }
                ]
            }
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
    logDisconnection,
    logFeedback,
    getMostRecent,
    getChatsForUUID
}
