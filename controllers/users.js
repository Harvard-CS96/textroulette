

var mongoose = require('mongoose'),
User = mongoose.model('User');

function findAllMatcher(callback){
	console.log("At findAllMatcher.")
	User.find({}, function(err, results) {
    	callback(results);
  	});
}

module.exports = {
  findAllMatcher
}