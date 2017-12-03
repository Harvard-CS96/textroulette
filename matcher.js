/**
 * matcher.js
 * A wrapper around a dictionary to simplify matching connections
 */
const { CONN_STATUS } = require('./constants')
const { WAITING, PAIRING, DISCONNECTED } = CONN_STATUS;
const path = require('path');
const DIR = require('./constants.js').DIR
const uuid = require('uuid');

const users = require(path.join(DIR.ROOT, 'controllers/users'));
const questions = require(path.join(DIR.ROOT, 'controllers/questions'));
const chat = require(path.join(DIR.ROOT, 'controllers/chats'));

// End example

class Matcher {
    constructor(setStatus, maxBlacklist = 1) {
        this.connections = {};
        this.callbacks = {};
        this._setStatus = setStatus;
        this._maxBlacklist = maxBlacklist;
    }

    // Add a callback that fires when we switch to a certain status
    addCallback(status, callback) {
        if (this.callbacks[status] === undefined) {
            this.callbacks[status] = [callback];
        }
        else {
            this.callbacks[status].push(callback);
        }
    }

    // Fire callbacks for a given status
    fireCallbacks(status, payload) {
        if (this.callbacks[status] !== undefined) {
            this.callbacks[status].forEach( (callback) => {
                callback(payload);
            });
        }
    }

    // Add a new id into the connection pool
    connect(id, username = +new Date(), user_id) {
        // If id is empty, don't try to add it
        if (id === undefined || id === "" || user_id === undefined) {
            return;
        }
        // If a connection with given id exists, don't try to add it
        if (this.connections[id] !== undefined) {
            return;
        }

        // Set the connection in the dictionary to null partner (single)
        this.connections[id] = {
            partner: null,
            username,
            user_id,
            blacklist: []
        }
        console.log(`Matcher: Connected ${id}`)

        this._setStatus(id, WAITING);

        // Check if we can match a partner for the new connection
        this.checkForMatches(id);
    }

    // Unpair two still-connected users.
    unpair(id, reason) {

        // If a conenction with the given id doesn't exist, don't do anything
        if (this.connections[id] === undefined) {
            return;
        }

        // Find the partner of the connected id, if it exists
        const { partner } = this.connections[id];

        // If the partner existed, set it to single
        if (partner !== null && this.connections[partner]) {
            this.connections[partner].partner = null;
            console.log(`Matcher: ${id} partner ${partner} is now single`)

            this._setStatus(partner, DISCONNECTED, id)

            this.fireCallbacks(DISCONNECTED, {
                who: this.connections[id].user_id,
                partner: this.connections[partner].user_id,
                reason: reason
            })

        }

        this._setStatus(id, DISCONNECTED, partner);

    }

    // Remove an id from the connection pool
    disconnect(id) {
        // Same procedure as hanging up a call between still-connected users.
        this.unpair(id, 'disconnect');

        // Delete connection from the pool
        delete this.connections[id];
        console.log(`Matcher: Disconnected ${id}`)
    }

    // Hangup a still-connected user.
    hangup(id) {
        this.unpair(id, 'hangup')
        this.addBlacklist(id, this.connections[id].partner)
        this._setStatus(id, DISCONNECTED);
        this._setStatus(this.connections[id].partner, DISCONNECTED);
        this.connections[id].partner = null;
    }

    addBlacklist(id, blacklisted) {
        this.connections[id].blacklist.push(blacklisted)
        this.connections[id].blacklist = this.connections[id].blacklist.slice(-1 * this._maxBlacklist);
    }


    // Attempt to find new single match for given id
    checkForMatches(id) {

        // Make sure the id is a string
        id = id + "";

        // so that callbacks can access the this variable
        var referenceToThis = this;

        // If the connection doesn't exist, don't do anything
        if (this.connections[id] === undefined) {
            // TODO: trying to find match for nonexistant connection
            return;
        }

        // If the connection has a partner, don't do anything
        if (this.connections[id].partner !== null) {
            // TODO: checking for match for a nonsingle id
            return;
        }
        console.log(`Matcher: Checking for matches for ${id}...`)

        const userIds = Object.keys(this.connections).map((k) => { return this.connections[k].user_id });
        users.findAllInList(userIds, function(userData){
            questions.findActive(function(questionData){
                referenceToThis.findMatch(userData, questionData, id);
            });
        });
    }


    findMatch(userData, questionData, id){

        // this is hacky - we encounter this case when submitting feedback but haven't figured out why :(
        if (!this.connections[id]) {
            console.log("Missing connection for id: " + id)
            return;
        }

        // get user data from id
        var user1ID = this.connections[id].user_id;
        var userData1 = getUserDataOfID(userData, user1ID);
        var Questions1 = getAvailableUserQuestions(userData1, questionData);


        // randomly sort questions so that user does not always get matched on same question
        var Questions1IDS = Questions1.map(function (obj) {
                                    return obj.id;
                                });

        // Iterate over all connections
        const ids = Object.keys(this.connections);
        const { length } = ids;
        console.log(this.connections)
        for (let i = 0; i < length; i++) {
            const key = ids[i]
            // If we find an entry that's single and also not the same user, connect
            if (
                this.connections[key].user_id !== this.connections[id].user_id &&
                this.connections[key].partner === null &&
                this.connections[key].blacklist.indexOf(id) === -1 &&
                this.connections[id].blacklist.indexOf(key) === -1
            ) {
                // get second user data from key
                var user2ID = this.connections[key].user_id;
                var userData2 = getUserDataOfID(userData, user2ID);
                var Questions2 = getAvailableUserQuestions(userData2, questionData);
                var Questions2IDs = Questions2.map(function (obj) {
                                        return String(obj.id);
                                    });
                for (let i = 0; i < Questions1.length; i++) {
                    var question1 = Questions1[i];
                    var Question2Index = Questions2IDs.indexOf(String(question1.id))
                    if (Question2Index >= 0) {
                        if (isDifferentOpinion(question1.response, Questions2[Question2Index].response)) {
                            // set partner on conversation about question with this id
                            var questionTitle = getQuestionByID(question1.id, questionData);
                            this.setPartner(id, key, {text: questionTitle, id: question1.id});
                            break;

                        }
                    }
                }
            }
        }
    }


    // Set two ids to be each others' partners
    setPartner(id1, id2, question) {
        // If either is nonsingle, do nothing
        if (
            this.connections[id1].partner !== null ||
            this.connections[id2].partner !== null
        ) {
            // TODO: handle if you can't pair
            return;
        }

        // Set each id's partner to the other
        this.connections[id1].partner = id2;
        this.connections[id2].partner = id1;

        console.log("Users will discuss the question: " + question.text);

        // Create a new room name for this Conversation
        var room = uuid();

        console.log(`Matcher: Pairing ${id1} and ${id2} in room ${room}`);

        this._setStatus(id1, PAIRING, id2, room);
        this._setStatus(id2, PAIRING, id1, room);
        this.fireCallbacks(PAIRING, {
            uid1: this.connections[id1].user_id,
            uid2: this.connections[id2].user_id,
            room: room
        });
    }

    // Get the partner of a given id
    getPartner(id) {
        // If the given id doesn't exist, return null
        if (this.connections[id] === undefined) {
            // TODO: handle nonexistant id
            return null;
        }
        return this.connections[id].partner
    }

    // Set username of a given id
    setUsername(id, username) {
        if (this.connections[id] === undefined) {
            return;
        }
        this.connections[id].username = username || +new Date();
    }

    // Get username of a given id
    getUsername(id) {
        if (this.connections[id] === undefined) {
            // TODO: handle nonexistant id
            return "";
        }
        return this.connections[id].username;
    }

    // Utility function to print all connections
    prettyPrint() {
        let string = '';
        const ids = Object.keys(this.connections)
        const { length } = ids;
        for (let i = 0; i < length; i++) {
            const key = ids[i]
            const { partner } = this.connections[key];
            const keyUsername = this.getUsername(key) || key;
            const partnerUsername = this.getUsername(partner) || partner;
            if (partner !== null) {
                string += `${keyUsername} ---> ${partnerUsername}`
            } else {
                string += `${keyUsername} ----`
            }
            string += '\n'
        }
        return string;
    }

    logAll() {
        return JSON.stringify(this)
    }
}

// HELPER FUNCTIONS

function getUserDataOfID(userData, id){
    for (var i=0, iLen=userData.length; i < iLen; i++) {
        if (userData[i].uuid == id) return userData[i];
    }
}

// return a list of questions the user wants to talk about
function getAvailableUserQuestions(userData, questionData){
    var ChosenQuestions = [];
    var questionsAnswered = userData.questions_answered;
    for (let i = 0; i < questionsAnswered.length; i++) {
        var responseData = questionsAnswered[i].response_data;
        if (responseData[responseData.length - 1] != null) {
            var el = {response: responseData[responseData.length - 1].response, id: questionsAnswered[i].question_id}
            ChosenQuestions.push(el)
        }
    }
    return ChosenQuestions;
}

function getQuestionByID(id, questionData){
    for (var i=0; i < questionData.length ; ++i){
        if (questionData[i].id == id){
            return questionData[i].text;
        }
    }
    throw "Question id not found in questionData";
}

function isDifferentOpinion(a, b){
    return (a !== b)
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = Matcher
