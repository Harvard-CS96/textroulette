

var mongoose = require('mongoose'),
User = mongoose.model('User');

// Note the way this works: Takes the function that it will call upon completion. 
// No return statement.
function findAll(callback){
	User.find({}, function(err, results) {
    	callback(results);
  	});
}

// Logs user responses to database.
function logResponses(req, res){
	var uuid = req.params.uuid;
	console.log(req.params.responses);
	// User.update({ uuid: uuid }, { 
	// 	$set: { 
	// 		question_answers: 'Mariah Carey ft. Boyz II Men',
	// 	},
	// 	$push: { 
	// 		scores: 89 
	// 	}
	// }
}

module.exports = {
  findAllMatcher
}