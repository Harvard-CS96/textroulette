import React from 'react';
import { Link } from 'react-router-dom';
import Strings from '../json/strings.json';
import VideoChat from './VideoChat';

class Conversation extends React.Component {
    /**
     * Components:
     * 1) "From" video screen - should always be present
     * 2) Hang up button - should link to profile if not in conversation; otherwise link to feedback
     * 3) Matching screen - present until matched (get info from backend?)
     * 4) Connecting screen - present for specified time delay, i.e. 3-5 seconds + however long it takes to connect (also from backend?)
     * 5) "To" video screen - if the call ends, proceed to feedback.
     */

    render() {
        const { room_id } = this.props.match.params;

        return <div id="Conversation">
            <VideoChat room_id={room_id} />
            <Link to="/feedback">{Strings.Feedback.link}</Link>
        </div>
    }
}

export default Conversation