import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import BadgeSet from '../containers/BadgeSet';
import StartConversationButton from "../containers/StartConversationButton"
// import LeaderSet from "../containers/LeaderSet"
import LeaderboardButton from "../containers/LeaderboardButton"
import QuestionSet from './QuestionSet'
import Logout from '../containers/Logout'
import { Link } from 'react-router-dom';
import Strings from '../json/strings.json';

class Profile extends React.Component {
    componentDidMount() {
        this.props.loadQuestions()
    }
    constructor() {
        super();
        this.state = {
            toggle: false
        };
    }
    render() {
        console.log(this.props);
        const { questions } = this.props;
        return <div id="Profile">
            {Strings.Profile.body}
            <QuestionSet questions={questions} />
            <BadgeSet />
            <LeaderboardButton toggle={this.state.toggle} />
            <StartConversationButton />
            <Logout />
        </div>
    }
}

export default Profile;