$(document).ready(function() {
    jQuery(function() {
        // const user = {{{ user }}};

        var feedback = [{
          qid: 'stars',
          text: 'How was your conversation?',
          type: 'one',
          options: [1, 2, 3, 4, 5]
        },
        {
          qid: 'badges',
          text: 'Award a badge?', 
          type: 'multiple',
          options: ['funny', 'creative', 'friendly']
        },
        {
          qid: 'improvements',
          text: 'Anything to improve?',
          type: 'multiple',
          options: ['Listening', 'Volume']
        }];

        // CONSTRUCTING HTML SECTION (TODO: REACT)
        function constructLabel(name, qID, buttonType, idx){
          if (qid == 'badges'){
            return '<div><span class="glyphicon glyphicon-education"></span></div>'
          }
          if (buttonType == 'multiple'){
            var type = "checkbox";
          }
          else if(buttonType == 'one'){
            var type = "radio";
          }
          var start = ('<label class="btn btn-primary"' +
                       '><input type="' + type + '" name="options"' +
                       'qid= "' + qID + '" ' + 
                       'response= "' + name + '" ' +
                       'autocomplete="off">');
          var end = '</label>'
          return start + name + end;
        }

        function constructDiv(names, qID, buttonType, idx){
          var s = '';
          var start = ('<div class="btn-group" id="question' + (idx + 1) + '" ' +
                       ' data-toggle="buttons"' + 
                       '>');
          var end = '</div>';
          s += start;
          names.forEach(function(name, qid, idx){
            s += constructLabel(name, qID, buttonType, idx);
          })
          return s + end;
        }

        // Constructs the html used for the badges part
        function constructBadges(names, qID, buttonType, idx){

        }

        function constructSet(questions){
          var s = '';
          var start = '<div id="holder">';
          var end = '</div>';
          s += start;
          questions.forEach(function(question, idx){
            s += '<h3>' + question.text + '</h3>';
            s += constructDiv(question['options'], question['qid'], question['type'], idx);
          })
          return s + end;
        }

        function populateQuestions(questions){
          document.getElementById('answer-questions').innerHTML = constructSet(questions);
        }

        // READING RESPONSES CODE BELOW
        function calcQID(parent, attr){
          return Array.prototype.slice.call(parent.childNodes).map(function(elt){ 
            return !!(elt.className.split(" ").indexOf("active") > -1) ? elt.firstChild.getAttribute(attr) : '';
          }).filter(function(elt){ return elt!== ''; })[0];  // Returns a list of active things, stringified.
        }

        // READING RESPONSES CODE BELOW
        function calcResponse(parent, attr){
          return Array.prototype.slice.call(parent.childNodes).map(function(elt){ 
            return !!(elt.className.split(" ").indexOf("active") > -1) ? elt.firstChild.getAttribute(attr) : '';
          }).filter(function(elt){ return elt!== ''; });  // Returns a list of active things, stringified.
        }

        function getAnswer(questionNumber){
          console.log('getAnswer called' + questionNumber);
          var parent = $('#question' + questionNumber)[0];
          console.log(parent);
          return {
            question_id: calcQID(parent, 'qid'),
            response: calcResponse(parent, 'response')
          };
        }

        // Reads form to get answers.  Stores in custom JSON.  We don't need you form built-ins.  Go away.
        function getAnswersJSON(){
          var numQuestions = document.getElementsByTagName('h3').length;
          console.log('getting answeres for ' + numQuestions + 'questions');
          var answers = [];
          for (var i = 1; i <= numQuestions; i++){
            answers.push(getAnswer(i));
          }
          return answers;
        }

        function formSubmit(){
          console.log('formsubmit called');
          var question_responses = getAnswersJSON().filter(function(d){ return d.question_id != ''; });
          console.log('about to ajax');
          json = {
              from: user.uuid,
              stars: question_responses.filter(function(d){ return d.question_id == 'stars'; })[0].response[0],
              badges: question_responses.filter(function(d){ return d.question_id == 'badges'; })[0].response,
          };
          console.log(json);
          $.ajax({
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(json),
              url: '/chats/',
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

        // Set up the page.
        // populateQuestions(feedback);
        // document.getElementById("submit").onclick = function (){ formSubmit() };
    })
})