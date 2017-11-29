import React from 'react';
import { Link } from 'react-router-dom';

import strings from '../json/strings.json';
import Leader from '../components/Leader.js'
import ShowLeaders from "../containers/ShowLeaders"
import HideLeaders from "../containers/HideLeaders"

class LeaderSet extends React.Component {
    render() {
    	const { showLeaderboard } = this.props
    	var leaders = [];
    	if (showLeaderboard) {
	        leaders.push(<Leader leaderId="Stuart" />)
	        leaders.push(<Leader leaderId="Stewart" />)
	        leaders.push(<Leader leaderId="You" />)
	        leaders.push(<HideLeaders />)
	    } else {
	    	leaders.push(<ShowLeaders />)
	    }

	    return <div id="LeaderSet">
	    <h3>Leaderboard</h3>
			{ leaders.map((x, i) => ({...x, key: i})) }

        </div>


    }
}

export default LeaderSet;