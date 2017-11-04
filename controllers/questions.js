var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Finds specific questions given a request.
function findForUser(callback){
  console.log('questions find for user called');
  Question.find({
  	is_active: true
  }, callback);
};

// Find all active questions
function findActive(callback) {
  Question.find({
    is_active : true
  }, function(err, result) {
    callback(result);
  });
}

module.exports = {
  findForUser,
  findAll,
  findActive
}
