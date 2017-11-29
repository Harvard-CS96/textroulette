const db = require('../db/connect');

const Criticism = db.models.Criticism;

const listAll = () => {
  return Criticism.find({}).exec()
}

module.exports = {
  listAll
}