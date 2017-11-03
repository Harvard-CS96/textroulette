

var mongoose = require('mongoose'),
User = mongoose.model('User');

// Note the way this works: Takes the function that it will call upon completion. 
// No return statement.
function findAll(callback){
	User.find({}, function(err, results) {
    	callback(results);
  	});
}

// Logs user responses to database.  Talk to Russell before changing.  This is 
// A very careful function.
function modifyResponse(submitted, stored){
	submitted.forEach(function(question){
		var id = question.question_id;
		var response = question.response;
		var seenQuestion = stored.findIndex(function(d){ 
			return d.question_id == id;
		});
		// Never answered this question before
		if(seenQuestion === -1){
			stored.push({
				question_id: id,
				response_data: [{
					response: response
				}]
			});
		}
		else {
			stored[seenQuestion].response_data.push({
				response: response
			})
		}
	})
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
					questions_answered: modifyResponse(req.body.questions_answered, 
						                               result.questions_answered)
				},
			}, function (err, n, raw){ // Specifying callback somehow necessary
				console.log(err);
				console.log(n);
				console.log(raw); 
			})

		}) // End of findOne
	res.send('success'); // TODO get this to work.
}

module.exports = {
  findAll,
  updatePreferences
}