import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import strings from '../json/strings.json';

class StartConversationButton extends React.Component {
    componentDidMount() {
        this.props.checkStatus();
    }
    onClick = () => {
        const { passedSystemCheck } = this.props;
        if (passedSystemCheck === true) {
            this.props.history.push('/conversation');
        } else {
            this.props.history.push('/system_check');
        }
    }
    render() {
        const { onClick } = this;
        return <div id="StartConversationButton">
            <div className="button" children={strings.StartConversationButton.link} onClick={onClick}/>
        </div>
    }
}

export default withRouter(StartConversationButton);