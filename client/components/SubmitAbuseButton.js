import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import DiscreteQuestion from '../containers/DiscreteQuestion.js'
import strings from '../json/strings.json';

class SubmitAbuseButton extends React.Component {
    submitAbuse = () => {
        const { abuseType } = this.props;
        console.log(abuseType);
        this.props.history.push('/profile');
    }
    render() {
        const { submitAbuse } = this;
        return <div id="SubmitAbuseButton">
            <div className="button" children={strings.SubmitAbuseButton.link} onClick={submitFeedback} />
        </div>
    }// TODO: edit strings
}

export default withRouter(SubmitAbuseButton);