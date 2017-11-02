
var mongoose = require('mongoose'),
Question = mongoose.model('Question');

// Finds specific questions given a request.
function findForUser(req, res){
  Question.find({
  	is_active: true
  }, function(err, results) {
    return res.send(results);
  });
};

// This should find all but it is not tested yet.
function findAll(req, res){
  var id = req.params.id;
  Question.find({},function(err, result) {
    return res.send(result);
  });
};

module.exports = {
  findForUser,
  findAll
}