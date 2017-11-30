// load when jquery and page has be loaded
$(document).ready(function() {
    jQuery(function() {
        // get data from database through AJAX request
        console.log('about to ask for questions');
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/questions',
            dataType: 'json',
            success: function(data){
              // On success, update questions.
              console.log('pulled questions and userdata');
              var questionsWithUserAnswers = getQuestionsWithUserAnswers(data);
              populateQuestions(questionsWithUserAnswers);
              document.getElementById("submit").onclick = function (){ formSubmit(); };
            },
            failure: function(result){
              error();
            }
        });

        function constructLabel(name, qID, userAnswer, idx){
          if (name == userAnswer)
              var active = 'active';
          else
              var active = '';
          
          var start = ('<label class="btn btn-primary ' + active + '"' + 
                       '><input type="radio" name="options"' +
                       'qid= "' + qID + '" ' +
                       'response= "' + name + '" ' +
                       'autocomplete="off">');
          var end = '</label>'
          return start + name + end;
        }

        function constructDiv(names, qID, userAnswer, idx){
          var s = '';
          var start = ('<div class="btn-group" id="question' + (idx + 1) + '" ' +
                       ' data-toggle="buttons"' +
                       '>');
          var end = '</div>';
          s += start;
          names.forEach(function(name, qid, idx){
            s += constructLabel(name, qID, userAnswer, idx);
          })
          //console.log(s + end);
          return s + end;
        }

        function constructSet(questions){
          var s = '';
          var start = '<div id="holder">';
          var end = '</div>';
          s += start;
          questions.forEach(function(question, idx){
            s += '<h3>' + question.text + '</h3>';
            s += constructDiv(question['answer_options'], question['_id'], question['userAnswer'], idx);
          })
          return s + end;
        }

        function populateQuestions(questions){
          document.getElementById('answer-questions').innerHTML = constructSet(questions);
        }

        // returns list of the questions but includes the user response to those questions
        function getQuestionsWithUserAnswers(data){
          var questions = data.questions;
          var userAnswers = data.userData.questions_answered;

          // maps question ids to user answers
          dictOfAnswers = {};
          
          // populate dictOfAnswers with ids of user answers and 
          for (var i = 0; i < userAnswers.length; i++) {
              var userAnswer = userAnswers[i];
              if (userAnswer.response_data.length > 0){
                  // get last answer object of the response_data array
                  var currentAnswer = userAnswer.response_data[userAnswer.response_data.length - 1];
                  dictOfAnswers[userAnswer.question_id] = currentAnswer.response;
              }
              
          }

          var newQuestionsArray = [];
          for (var i = 0; i < questions.length; i++) { 
              var question = questions[i];

              question.userAnswer = null;
              if (question["_id"] in dictOfAnswers){
                  question.userAnswer = dictOfAnswers[question["_id"]];
              }

              newQuestionsArray.push(question);
          }
          return newQuestionsArray;
        }

        // READING RESPONSES CODE BELOW
        function calcAttribute(parent, attr){
          return Array.prototype.slice.call(parent.childNodes).map(function(elt){
            return !!(elt.className.split(" ").indexOf("active") > -1) ? elt.firstChild.getAttribute(attr) : '';
          }).reduce((s, v) => s + v, '');
        }

        function getAnswer(questionNumber){
          var parent = $('#question' + questionNumber)[0];
          return {
            question_id: calcAttribute(parent, 'qid'),
            response: calcAttribute(parent, 'response')
          };
        }

        // Reads form to get answers.  Stores in custom JSON.  We don't need you form built-ins.  Go away.
        function getAnswersJSON(){
          var numQuestions = document.getElementsByTagName('h3').length;
          var answers = [];
          for (var i = 1; i <= numQuestions; i++){
            answers.push(getAnswer(i));
          }
          return answers;
        }

        function formSubmit(){
          json = getAnswersJSON().filter(function(d){ return d.question_id != ''; });
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
              success: function(data){
                // On success, update questions.
                console.log(data);
              },
              failure: function(result){
                console.log('failure');
                error();
              }
          });
        }
    })
})