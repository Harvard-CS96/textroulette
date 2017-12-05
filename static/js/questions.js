
// Functions for building the questions page
function constructLabel(name, qID, userAnswer, idx) {
  if (name == userAnswer)
    var active = 'active';
  else
    var active = '';

  var start = ('<label class="btn btn-primary ' + active + '"' +
    '><input type="radio" name="options" ' +
    'qid= "' + qID + '" ' +
    'response= "' + name + '" ' +
    'autocomplete="off">');
  var end = '</label>'
  return start + name + end;
}

function constructDiv(names, qID, userAnswer, idx) {
  var s = '';
  var start = ('<div class="btn-group" style="display: block" id="question' +
    (idx + 1).toString() + '" ' +
    ' data-toggle="buttons">');
  var end = '</div>';
  s += start;
  {{!-- s += '<table><tr>'; --}}
  names.forEach(function (name, qid, idx) {
    s += constructLabel(name, qID, userAnswer, idx);
  })
  {{!-- s += '</tr></table>'; --}}
  //console.log(s + end);
  console.log(s + end);
  return s + end;
}

function constructSet(questions) {
  var s = '';
  var start = '<div id="holder">';
  var end = '</div>';
  s += start;
  numQ = questions.length;
  questions.forEach(function (question, idx) {
    s += '<h3>' + question.text + '</h3>';
    s += constructDiv(question['answer_options'], question['_id'], question['userAnswer'], idx);
  })
  return s + end;
}

function populateQuestions(questions) {
  var butt1 = '<button id="submit" type="button" class="gradient-btn">Update</button>';
  var butt2 = '<button id="call" type="button" class="gradient-btn">Update and Call</button>';
  document.getElementById('answer-questions').innerHTML = ('<h4>Update Your Answers</h4><hr>' +
    constructSet(questions) + butt1 + butt2);
}

// returns list of the questions but includes the user response to those questions
function getQuestionsWithUserAnswers(data) {
  // get questions and userAnswers from the data
  var questions = data.questions;
  if ("questions_answered" in data.userData)
    var userAnswers = data.userData.questions_answered;
  else
    var userAnswers = [];

  // maps question ids to user answers
  dictOfAnswers = {};

  // populate dictOfAnswers with ids of user answers and
  for (var i = 0; i < userAnswers.length; i++) {
    var userAnswer = userAnswers[i];
    if (userAnswer.response_data.length > 0) {
      // get last answer object of the response_data array
      var currentAnswer = userAnswer.response_data[userAnswer.response_data.length - 1];
      dictOfAnswers[userAnswer.question_id] = currentAnswer.response;
    }

  }

// READING RESPONSES CODE BELOW
function calcAttribute(parent, attr) {
  return Array.prototype.slice.call(parent.childNodes).map(function (elt) {
    return !!(elt.className.split(" ").indexOf("active") > -1) ? elt.firstChild.getAttribute(attr) : '';
  }).reduce((s, v) => s + v, '');
}

function getAnswer(questionNumber) {
  var parent = $('#question' + questionNumber)[0];
  console.log('#question' + questionNumber);
  console.log(parent);
  var response = calcAttribute(parent, 'response');
  if (response == '')
      response = null;
  return {
    question_id: parent.firstChild.firstChild.getAttribute('qid'),
    response: response
  };
}

// Reads form to get answers.  Stores in custom JSON.  We don't need you form built-ins.  Go away.
function getAnswersJSON() {
  var answers = [];
  for (var i = 1; i <= numQ; i++) {
    answers.push(getAnswer(i));
  }
  return answers;
}

function formSubmit() {
  json = getAnswersJSON()
  var isEmpty = true;
  json.forEach(function(d){
    isEmpty = isEmpty & !d.response;
  })
  if(isEmpty){
    return false;
  } else{
      console.log('about to ajax');
      console.log(json);
      $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          uuid: user.uuid,
          questions_answered: json
        }),
        url: '/updateStance',
        success: function (data) {
          // We get no notification of success right now
        },
        failure: function (result) {
          console.log('failure');
          error();
        }
      });
  }
  return true;
}