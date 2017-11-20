/**
 * users.js
 * Controllers for interacting with user documents in the database.
 */

var mongoose = require('mongoose'),
User = mongoose.model('User');

function findById(uuid, callback) {
  User.findOne({"uuid": uuid}, (err, results) => {
      if (err) {
        console.log(err)
      }
      callback(results);
    })
}

function findAllInList(uuids, callback) {
  const query = {"uuid": { $in: uuids }}
  User.find(query, (err, results) => {
      if (err) {
        console.log(err)
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
  findById(uuid, (result) => {
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

function incrementBadgeCount(currentBadges, badgeName){
  
  var badgeIdx = currentBadges.map(d => d.badge).indexOf(badgeName);
  // If this user hasn't recieved this badge before
  if(badgeIdx === -1){
    var newBadge = {
      "badge": badgeName,
      "count": 1
    };
    currentBadges.push(newBadge);
    return currentBadges;
  }
  // Otherwise find and update existing record
  else{
    var specificBadge = currentBadges[badgeIdx];
    specificBadge.count++;
    currentBadges[badgeIdx] = specificBadge;
    return currentBadges;
  }
}

function applyFeedback(uuid, feedback) {
  // find and update the relevant user's profile based on feedback
  findById(uuid, (user) => {
    // average new rating with all past ratings 
    const new_count = (+user.rating.count) + 1; // casting to int.
    const new_stars = ((+user.rating.stars) * (new_count - 1) + (+feedback.stars)) / new_count;

    var badges = user.badges;
    feedback.badges.forEach(function(badge){
      badges = incrementBadgeCount(badges, badge);
    })

    user.set({
      'rating.stars': new_stars,
      'rating.count': new_count,
      'badges': badges
    })
    
    user.save((err) => {
      if (err) {
        console.log(err);
      }
    })
  })
}

module.exports = {
  findAllInList,
  updateStance,
  applyFeedback,
  findById
}