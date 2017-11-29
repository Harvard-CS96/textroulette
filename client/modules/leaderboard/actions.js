import * as types from './types';

const toggleLeaderboard = (selectedLeaderStatus) => ({
    type: types.TOGGLE_LEADERBOARD,
    data: {
        selectedLeaderStatus
    }
})

const loadLeaders = (leaders) => ({
    type: types.LOAD_LEADERS,
    data: {
        leaders
    }
})


export {
    toggleLeaderboard,
    loadLeaders
}