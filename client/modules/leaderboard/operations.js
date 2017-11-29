import axios from 'axios';
import * as actions from './actions';

const toggleLeaderboard = (selectedLeaderStatus) => dispatch => {
    console.log("OPERATION - TOGGLE LEADERBOARD");
    console.log(selectedLeaderStatus);
    //TODO: Get rid of "from" parameter once db updates this and test POST request.
    return axios.post('/users', {showLeaderboard: selectedLeaderStatus})
        .then(response => {
            console.log(response);
            dispatch(actions.toggleLeaderboard(selectedLeaderStatus));
        })
        .catch(error => {
            console.log(error);
        });
}

const loadLeaders = () => dispatch => {
    // This should be replaced with whatever db team makes for leaders.
    // Return an array of strings
    // axios.get('/badges/list')
    //     .then(response => response.data)    
    //     .then(response => {
    //         console.log("OPERATIONS - LOAD ALL BADGES");
    //         console.log(response)
    //         dispatch(actions.loadAllBadges(response));
    //     })

    return ["Stewart", "Stuart"];
        
}
        

export {
    toggleLeaderboard,
    loadLeaders
}