

var mongoose = require('mongoose'),
User = mongoose.model('User');

function findAll(callback){
	User.find({}, function(err, results) {
    	callback(results);
  	});
}

module.exports = {
  findAllMatcher
}