/**
 * users.js
 * Controllers for interacting with user documents in the database.
 */

var mongoose = require('mongoose'),
User = mongoose.model('User');

function findById(uuid, callback) {
  User.findOne({user_id: uuid}, (err, results) => {
      if (err) {
        throw err
      }
      callback(results);
    })
}

function findAllInList(uuids, callback) {
  const query = {user_id: { $in: uuids }}
  User.find(query, (err, results) => {
      if (err) {
        throw err
      }
      callback(results);
    });
}

// Logs user responses to database.  Talk to Russell before changing.  
// This is a very careful function.
function modifyResponse(submitted, stored) {
  submitted.forEach(function(question) {
    var id = question.question_id;
    var response = question.response;
    var questionIndex = stored.findIndex((d) => { 
      return d.question_id == id;
    });
    // Never answered this question before
    if (questionIndex === -1) {
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

function updateStance(uuid, questions_answered, callback=(res)=>{}) {
  findById(uuid, (err, result) => {
      User.updateOne({ "uuid": uuid }, { 
        $set: {
          questions_answered: modifyResponse(questions_answered, 
                                             result.questions_answered)
        },
      }, (err, result) => {
        callback(result);
      })
 });
}

function updateRating(uuid, feedback) {
  console.log("Updating user rating for " + uuid + " based on feedback " + feedback);
  // update the relevant user's rating
  findById(uuid, (res) => {
    console.log("DOESN'T ACTUALLY UPDATE YET");
  })
}

module.exports = {
  findAllInList,
  updateStance,
  updateRating
}