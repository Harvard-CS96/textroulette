/**
 * users.js
 * Controllers for interacting with user documents in the database.
 */

var mongoose = require('mongoose'),
User = mongoose.model('User');

// use the facebook API
const fb = require('fb');

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

// Get a list of user profiles from a list of facebook ids
function findByFBIdList(fbids, callback) {
  User.find({"facebook.id": {$in: fbids}}, (err, results) => {
    if (err) {
      console.log(err)
    }
    if (results === undefined) {
      results = []
    }
    callback(results);
  })
}

// Get leaderboard (of unrestricted length) made up of user's facebook friends.
function getLeaderboard(uuid, callback) {
  console.log(uuid);
  findById(uuid, (profile) => {

    console.log(profile);

    // Get user's friends who use the app from the FB api
    fb.api(
        "me", 
        {fields: "friends", access_token: profile.facebook.token},
        response => {
          // Find all friends in the database
          findByFBIdList(response.friends, friends => {
            // Keep only friends willing to appear on leaderboards
            public_friends = friends.filter(f => f.showLeaderboard)

            // Count up badge totals
            public_friends = public_friends.map(f => {
              f.badge_total = f.badges.reduce((acc, b) => {acc + b.count}, 0);
              return f
            })

            // Sort friends by number of badges, descending
            public_friends.sort((a, b) => {
              return b.badge_total - a.badge_total;
            });

            // Feed the leaderboard into the callback
            callback(public_friends)
          });
        }
    );

    // Update user to show up on other's leaderboards
    profile.showLeaderboard = true;
    profile.save()

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

function incrementBadgeCount(currentBadges, incrementId) {
  
  const existIndex = currentBadges.map(x => x.badge.uuid).indexOf(incrementId) 
  if (existIndex === -1) {
    currentBadges.push({
      badge: incrementId,
      count: 1
    })
  } else {
    currentBadges[existIndex].count++
  }

  return currentBadges
}

function applyFeedback(uuid, feedback) {
  // find and update the relevant user's profile based on feedback
  findById(uuid, (user) => {
    // average new rating with all past ratings 
    const new_count = (+user.rating.count) + 1; // casting to int.
    const new_stars = ((+user.rating.stars) * (new_count - 1) + (+feedback.stars)) / new_count;

    var badges = user.badges;
    feedback.badges.forEach(badgeId => {
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
  findById,
  findByFBIdList,
  getLeaderboard
}