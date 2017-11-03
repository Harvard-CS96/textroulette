var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Finds specific questions given a request.
function findForUser(req, res){
  console.log('questions find for user called');
  Question.find({
  	is_active: true
  }, function(err, results) {
    res.send(results);
  });
};

// Find all questions then fire a callback
function findAll(callback) {
  Question.find({}, function(err, result) {
    res.send(results);
  });
}

module.exports = {
  findForUser,
  findAll
}