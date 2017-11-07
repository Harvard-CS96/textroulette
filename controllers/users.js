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

function applyFeedback(uuid, feedback) {
  console.log("Updating profile for " + uuid + " based on feedback " + feedback);
  // find and update the relevant user's profile based on feedback
  findById(uuid, (user) => {
    // average new rating with all past ratings
    const new_count = user.rating.count + 1;
    const new_stars = (user.rating.stars * (new_count - 1) + feedback.stars) / new_count;

    user.set({
      'rating.stars': new_stars,
      'rating.count': new_count 
    })

    // TODO: update user's badge count

    user.save((err) => {
      if (err) {
        throw err;
      }
    })
  })
}

module.exports = {
  findAllInList,
  updateStance,
  updateRating
}