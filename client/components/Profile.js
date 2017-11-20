import React from 'react';
// import StarRatingComponent from 'react-star-rating-component';
// import BadgeSet from '../containers/BadgeSet';
import StarRatingComponent from 'react-star-rating-component';
import BadgeSet from '../containers/BadgeSet';
import QuestionSet from '../containers/QuestionSet'
import StartConversationButton from "../containers/StartConversationButton"
import LeaderSet from "../containers/LeaderSet"

import { Link } from 'react-router-dom';

import Strings from '../json/strings.json';

class Profile extends React.Component {
    componentDidMount() {
        this.props.loadQuestions()
    }
    render() {
        const { questions } = this.props;
        return <div id="Profile">
        	{Strings.Profile.body}
            <QuestionSet questions={questions}/>
            <QuestionSet />
            <BadgeSet badgesDisplayed={['01','02','03']}/>
            <LeaderSet showLeaderboard={true}/>
            <StartConversationButton />
        </div>
    }
}

export default Profile;