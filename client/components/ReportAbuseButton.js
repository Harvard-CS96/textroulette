import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import strings from '../json/strings.json';

class ReportAbuseButton extends React.Component {
    goToAbuse = () => {
        this.props.history.push('/report_abuse');
    }
    render() {
        const { goToAbuse } = this;
        return <div id="ReportAbuseButton">
            <div className="button" children={strings.ReportAbuseButton.link} onClick={goToAbuse} />
        </div>
    }
}

export default withRouter(ReportAbuseButton);