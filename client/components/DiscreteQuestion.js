import React from 'react';

class DiscreteQuestion extends React.Component {
    renderOption = (option, i) => {
        return <option key={i} value={option}>{option}</option>
    }
    onChange = (e) => {
        const { value } = e.target;
        this.props.setAnswer(value)
    }
    render() {
        const { id, text, options, answer, userAnswer } = this.props;
        const { renderOption, onChange } = this;
        const renderedOptions = options.map(renderOption);
        console.log("IT WORKED: ", userAnswer);


        return <div className="Question DiscreteQuestion">
            <h1>{text}</h1>
            <select value={answer} onChange={onChange}>
                <option value="">Select...</option>
                {renderedOptions}
            </select>
        </div>
    }
}

export default DiscreteQuestion;