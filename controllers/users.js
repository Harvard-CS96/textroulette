

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
function updatePreferences(req, res){
	var uuid = req.params.uuid;
	console.log('Update preferences called');
	console.log(req.body);
	// console.log(res);
	// User.update({ uuid: uuid }, { 
	// 	$set: { 
	// 		question_answers: 'Mariah Carey ft. Boyz II Men',
	// 	},
	// 	$push: { 
	// 		scores: 89 
	// 	}
	// }
	res.send({'hello': 'we made it'});
}

module.exports = {
  findAll,
  updatePreferences
}