
var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Gets questions perhaps based on user identity.
function findPermittedQuestions(userID){
	return [1,2,4,5];
}

// Finds specific questions given a request.
exports.findForUser = function(req, res){
  Question.find({
  	question_number: { $in: findPermittedQuestions(req.query.id) }
  }, function(err, results) {
    return res.send(results);
  });
};

// This should find all but it is not tested yet.
exports.findAll = function(req, res){
  var id = req.params.id;
  Question.find({},function(err, result) {
    return res.send(result);
  });
};