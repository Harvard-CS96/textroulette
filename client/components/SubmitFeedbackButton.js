import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import cn from 'classnames';
import strings from '../json/strings.json';

class SubmitFeedbackButton extends React.Component {
    onClickSubmit = () => {
        const { rating, selectedBadges, selectedCriticisms } = this.props;
        const { submitFeedback } = this.props;
        submitFeedback(rating, selectedBadges, selectedCriticisms);
        this.props.history.push('/profile');
    }
    render() {
        const { rating } = this.props;
        const { onClickSubmit } = this;
        const className = cn([
            'button',
            { 'disabled-link': (typeof rating !== 'number') }
        ])
        const buttonText = typeof rating === 'number' ?
            strings.SubmitFeedbackButton.link :
            strings.SubmitFeedbackButton.disabled;
        return <div id="SubmitFeedbackButton">
            <div className={className} children={buttonText} onClick={onClickSubmit} />
        </div>
    }
}

export default withRouter(SubmitFeedbackButton);