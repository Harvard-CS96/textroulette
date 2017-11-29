const db = require('../db/connect');

const Badge = db.models.Badge;

const listAll = () => {
    return Badge.find({}).exec()
}

module.exports = {
    listAll
}