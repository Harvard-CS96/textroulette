/**
 * questions.js
 * Controllers for interacting with question documents in the database.
 */

var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Find all active questions
function findActive(callback) {
  Question.find({
    is_active : true
  }, (err, result) => {
    callback(result)
  });
}

module.exports = {
  findActive
}