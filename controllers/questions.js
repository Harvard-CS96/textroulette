/**
 * questions.js
 * Controllers for interacting with question documents in the database.
 */

var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Find all questions then fire a callback
function findAll(callback) {
  Question.find({}, (err, result) => {
    callback
  });
}

// Find all active questions
function findActive(callback) {
  Question.find({
    is_active : true
  }, (err, result) => {
    callback(result)
  });
}

module.exports = {
  findAll,
  findActive
}
