import * as types from './types';

const initialState = {
    questions: []
}

function getDictOfUserAnswers(data){
    // get userAnswers from the data
    if ("questions_answered" in data.userData)
        var userAnswers = data.userData.questions_answered;
    else
        var userAnswers = [];

    // maps question ids to user answers
    var dictOfAnswers = {};
    
    // populate dictOfAnswers with ids of user answers and 
    for (var i = 0; i < userAnswers.length; i++) {
        var userAnswer = userAnswers[i];
        if (userAnswer.response_data.length > 0){
            // get last answer object of the response_data array
            var currentAnswer = userAnswer.response_data[userAnswer.response_data.length - 1];
            dictOfAnswers[userAnswer.question_id] = currentAnswer.response;
        }
        
    }
    return dictOfAnswers;
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.LOAD_QUESTIONS: {
            console.log("DATA", data.data);
            let { questions } = data.data;
 
            var dictOfAnswers = getDictOfUserAnswers(data.data);

            console.log("reducer got questions, and user answers: ", questions, dictOfAnswers)
            
            if (!Array.isArray(questions)) {
                questions = [questions]
            }
            questions = questions
                .filter(q => (
                    q._id &&
                    q.text &&
                    q.answer_type &&
                    q.topic &&
                    q.is_active === true &&
                    Array.isArray(q.answer_options) &&
                    q.answer_options.length > 0
                ))    
                .map(q => (
                    {
                        ...q,
                        answer: q._id in dictOfAnswers ? dictOfAnswers[q._id] : ""
                    }
                ))
            return {
                ...state,
                questions: questions
            }
        }
        case types.SET_ANSWER: {
            let { questionId, answer } = data;
            if (answer === "") {
                answer = null;
            }
            const newAnswers = [ ...state.questions ];
            const { length } = newAnswers
            for (let i = 0; i < length; i++) {
                if (newAnswers[i]._id === questionId) {
                    newAnswers[i].answer = answer;
                    break;
                } 
            }
            return {
                ...state,
                questions: newAnswers
            }
        }
        default: {
            return state;
        }
    }
}

export default reducer;