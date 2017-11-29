import React from 'react';
//import SubmitAbuseButton from '../containers/SubmitAbuseButton';
import { withRouter, Link } from 'react-router-dom';

import strings from '../json/strings.json';
import DiscreteQuestion from '../containers/DiscreteQuestion.js'

class ReportAbuse extends React.Component {
    constructor() {
        super();
        this.state = {
            abuseType: "Select...",
            abuseComment: ""
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitReport(
            {
                kind: this.state.abuseType,
                text: this.state.abuseComment
            }
        ).then(() => {
            this.props.history.push('/');
        })
    }

    handleChangeComment = (event) => {
        this.setState({ abuseComment: event.target.value });
    }

    handleChangeType = (event) => {
        this.setState({ abuseType: event.target.value });
    }

    render() {
        const { handleChangeType, handleChangeComment, handleSubmit } = this;
        const { abuseType, abuseComment } = this.state;
        return <div id="ReportAbuse" className="Question DiscreteQuestion">
            <h1>Report Abuse</h1>
            <form onSubmit={handleSubmit}>
                <label>
                <select value={abuseType} onChange={this.handleChangeType}>
                    <option disabled value="Select...">Select...</option>
                    <option value="nudity">nudity</option>
                    <option value="offensive">offensive language</option>
                    <option value="other">other</option>
                </select>
                </label>
                <br />
                <input type="text" value={abuseComment} onChange={handleChangeComment} />
                <input type="submit" value="Submit" />
            </form>
        </div>
        //log who abuse is from and to
    }
}

export default withRouter(ReportAbuse);