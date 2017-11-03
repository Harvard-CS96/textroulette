

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

// Ideas:
// 1. Get current value of questions_answered, update it, then use $set
// 2. Do several updates.  
// Not possible to use $each in something other than the last.

function modifyResponse(submitted, stored){
	console.log('modifyResponse called');
	submitted.forEach(function(question){
		var id = question.question_id;
		var response = question.response;
		console.log('stored');
		console.log(stored);
		var seenQuestion = stored.findIndex(function(d){ 
			return d.question_id == id 
		});
		console.log('seen question');
		console.log(seenQuestion);
		if(seenQuestion === -1){
			stored.push({
				question_id: id,
				response_data: [response]
			});
		}
		else {
			stored[seenQuestion].response_data.push({
				response: response
			})
		}
	})
	console.log('stored');
	console.log(stored);
	return stored;
}

function updatePreferences(req, res){
	console.log('Update preferences called');

	User.findOne({"uuid": req.body.uuid}, 
		function(err, result){
			console.log('find');
			console.log(result);
			User.updateOne({ "uuid": req.body.uuid }, { 
				$set: {
					rating: 17,
					questions_answered: modifyResponse(req.body.questions_answered, 
						                               result.questions_answered)
				},
			}, function (err, n, raw){ // Specifying callback somehow necessary
				console.log(err);
				console.log(n);
				console.log(raw); 
			})

		}) // End of findOne
	res.send({'hello': 'we made it'});
}

module.exports = {
  findAll,
  updatePreferences
}