var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Finds specific questions given a request.
function findForUser(id, callback){
  Question.find({
  	is_active: true
  }, function(err, results) {
    callback(results);
  });
};

// Find all questions then fire a callback
function findAll(callback) {
  Question.find({}, function(err, result) {
    callback(result);
  });
}

module.exports = {
  findForUser,
  findAll
}