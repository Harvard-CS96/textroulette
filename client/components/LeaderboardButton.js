import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import cn from 'classnames';
import strings from '../json/strings.json';

class LeaderboardButton extends React.Component {
    onClickSubmit = () => {
        const { selectedLeaderStatus } = this.props;
        const { toggleLeaderboard } = this.props;
        toggleLeaderboard(selectedLeaderStatus);
        this.props.history.push('/profile');
    }
    render() {
        const { toggle } = this.props;
        const { onClickSubmit } = this;
        // const className = cn([
        //     'button',
        //     { 'disabled-link': (typeof toggle !== 'number') }
        // ])
        const buttonText = typeof toggle === 'number' ?
            strings.LeaderboardButton.link :
            strings.LeaderboardButton.disabled;
        return <div className="button">
            <div children={buttonText} onClick={onClickSubmit} />
        </div>
    }
}

export default withRouter(LeaderboardButton);