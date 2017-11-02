var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Gets questions perhaps based on user identity.
function findPermittedQuestions(userID){
	return [1,2,4,5];
}

// Finds specific questions given a request.
function findForUser(id, callback){
  Question.find({
  	question_number: { $in: findPermittedQuestions(id) }
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
  findPermittedQuestions,
  findForUser,
  findAll
}