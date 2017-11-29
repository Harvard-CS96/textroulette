import axios from 'axios';
import * as actions from './actions';


const loadQuestions = () => dispatch => {
    return axios('/questions')
        .then(response => response.data)
        .then(data => {
            let { questions } = data;

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
            dispatch(actions.loadQuestions(data));
        })
}

const setAnswer = actions.setAnswer;

export {
    loadQuestions,
    setAnswer
}