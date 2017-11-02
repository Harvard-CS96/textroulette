/**
 * matcher.js
 * A wrapper around a dictionary to simplify matching connections
 */
const { CONN_STATUS } = require('./constants')
const { WAITING, PAIRING, DISCONNECTED } = CONN_STATUS;
const path = require('path');
const DIR = require('./constants.js').DIR

var users = require(path.join(DIR.ROOT, 'controllers/users'));

// The data for the function is printed in a callback after it is retrieved.  
// Hopefully my example is instructive.  
users.findAll(function(d){ callMatcher(d); });

function callMatcher(d){
    console.log('Elon');
    console.log(d);
}
// End example

class Matcher {
    constructor(setStatus, maxBlacklist = 1) {
        this.connections = {}
        this._setStatus = setStatus;
        this._maxBlacklist = maxBlacklist;
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
    unpair(id) {

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
            this._setStatus(partner, WAITING)

            // Check for a partner for the newly single ex-partner
            this.checkForMatches(partner);
        }

        this._setStatus(id, DISCONNECTED, partner);
        
    }

    // Remove an id from the connection pool
    disconnect(id) {
        // Same procedure as hanging up a call between still-connected users.
        this.unpair(id);

        // Delete connection from the pool
        delete this.connections[id];
        console.log(`Matcher: Disconnected ${id}`)
    }

    // Hangup a still-connected user.
    hangup(id) {
        this.unpair(id)
        this.addBlacklist(id, this.connections[id].partner)
        this.connections[id].partner = null;
        this._setStatus(id, WAITING);
        this.checkForMatches(id);
    }

    addBlacklist(id, blacklisted) {
        this.connections[id].blacklist.push(blacklisted)
        this.connections[id].blacklist = this.connections[id].blacklist.slice(-1 * this._maxBlacklist);
    }
    

    // Attempt to find new single match for given id
    checkForMatches(id) {
        // Make sure the id is a string
        id = id + "";

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

        // Iterate over all connections
        const ids = Object.keys(this.connections)
        const { length } = ids;
        for (let i = 0; i < length; i++) {
            const key = ids[i]
            // If we find an entry that's single and also not the same user, connect
            if (
                this.connections[key].user_id !== this.connections[id].user_id &&
                this.connections[key].partner === null
            ) {
                this.setPartner(id, key);
                break;
            }
        }
    }

    // Set two ids to be each others' partners
    setPartner(id1, id2) {
        // If either is nonsingle, do nothing
        if (
            this.connections[id1].partner !== null ||
            this.connections[id2].partner !== null
        ) {
            // TODO: handle if you can't pair
            return;
        }
        console.log(`Matcher: Pairing ${id1} and ${id2}`)

        // Set each id's partner to the other
        this.connections[id1].partner = id2;
        this.connections[id2].partner = id1;

        this._setStatus(id1, PAIRING, id2);
        this._setStatus(id2, PAIRING, id1);
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

module.exports = Matcher
