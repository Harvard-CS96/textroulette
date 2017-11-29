import * as types from './types';

const loadQuestions = (data) => ({
    type: types.LOAD_QUESTIONS,
    data: {
        data
    }
})

const setAnswer = (questionId, answer) => ({
    type: types.SET_ANSWER,
    data: {
        questionId,
        answer
    }
})

export {
    loadQuestions,
    setAnswer 
}