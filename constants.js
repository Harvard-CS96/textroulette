const path = require('path');

const ROOT_DIR = process.cwd();

const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

module.exports = {
    CONN_STATUS: {
        WAITING: 'WAITING',
        PAIRING: 'PAIRING',
        PAIRED: 'PAIRED'
    },
    DIR: {
        ROOT: ROOT_DIR,
        PUBLIC: PUBLIC_DIR
    }
}