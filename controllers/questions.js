
var mongoose = require('mongoose'),
Question = mongoose.model('Question');

function findPermittedQuestions(userID){
	return [1,2,4];
}

exports.findForUser = function(req, res){
  console.log('find for user');
  console.log(findPermittedQuestions(req.query.id));
  Question.find({
  	question_number: { $in: findPermittedQuestions(req.query.id) }
  }, function(err, results) {
    console.log(err);
    console.log(results);
    return res.send(results);
  });
};

exports.findAll = function(req, res){
  var id = req.params.id;
  Question.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};