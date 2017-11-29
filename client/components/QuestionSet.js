import React from 'react';
import { Link } from 'react-router-dom';

import strings from '../json/strings.json';
import DiscreteQuestion from '../containers/DiscreteQuestion.js'

class QuestionSet extends React.Component {
    renderQuestion = question => {
        const { _id, text, answer_type, answer_options, answer } = question;

        switch (answer_type) {
            case "discrete": {
                return <DiscreteQuestion key={_id} id={_id} text={text} options={answer_options} answer={answer} />
            }
            default: {
                return null;
            }    
        }
    }
    render() {
        const { questions } = this.props;
        const { renderQuestion } = this;
        const renderedQuestions = questions.map(renderQuestion);
        return <div id="QuestionSet">
	        { renderedQuestions }
        </div>
    }
}

export default QuestionSet;