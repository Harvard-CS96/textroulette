import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import FeedbackBadgeSet from '../containers/FeedbackBadgeSet';
import CriticismSet from '../containers/CriticismSet'
import ReportAbuseButton from '../containers/ReportAbuseButton';
import SubmitFeedbackButton from '../containers/SubmitFeedbackButton';

import strings from '../json/strings.json';

class Feedback extends React.Component {
    constructor() {
        super();
        this.state = {
            rating: null
        };
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    }
    render() {
        console.log(this.props);
        return <div id="Feedback">
            <div>
                {strings.Feedback.body}
            </div>
            <div id="StarRating">
            <StarRatingComponent
                name="user_star_rating"
                starCount={5}
                onStarClick={this.onStarClick.bind(this)}
                starColor='#cbe1f9'
            /></div><br/>            
            <div>
                {strings.Feedback.badges}
            </div>
            <FeedbackBadgeSet />
            <br/><div>
                {strings.Feedback.criticisms}
            </div>
            <CriticismSet />
            <br/>
            <SubmitFeedbackButton rating={this.state.rating} />
            <ReportAbuseButton />
        </div>
    }
}

export default Feedback;