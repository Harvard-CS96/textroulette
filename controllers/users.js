

var mongoose = require('mongoose'),
User = mongoose.model('User');

function findAll(callback){
  User.find({}, function(err, results) {
      callback(results);
    });
}

// Logs user responses to database.  Talk to Russell before changing.  
// This is a very careful function.
function modifyResponse(submitted, stored){
  submitted.forEach(function(question){
    var id = question.question_id;
    var response = question.response;
    var questionIndex = stored.findIndex(function(d){ 
      return d.question_id == id;
    });
    // Never answered this question before
    if(questionIndex === -1){
      stored.push({
        question_id: id,
        response_data: [{
          response: response
        }]
      });
    }
    else {
      stored[questionIndex].response_data.push({
        response: response
      })
    }
  })
  return stored;
}

function updatePreferences(uuid, questions_answered, callback=console.log){
  User.findOne({ "uuid": uuid }, 
    function(err, result){
      User.updateOne({ "uuid": uuid }, { 
        $set: {
          questions_answered: modifyResponse(questions_answered, 
                                             result.questions_answered)
        },
      }, function (err, result){ // Specifying callback somehow necessary
        callback(result);
      })

    }) // End of findOne
  //res.send('success'); // TODO get this to send something useful.
}

module.exports = {
  findAll,
  updatePreferences,
  modifyResponse
}