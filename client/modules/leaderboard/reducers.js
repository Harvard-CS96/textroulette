import * as types from './types';

const initialState = {
    rating: null,
    selectedBadges: [],
    selectedCriticisms: []
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.TOGGLE_LEADERBOARD: {
            const { selectedLeaderStatus } = data;
            console.log("REDUCER - TOGGLE LEADERBOARD");
            console.log(selectedLeaderStatus);
            return {
                ...state,
                selectedLeaderStatus: selectedLeaderStatus
            }
        }
        case types.LOAD_LEADERS: {
            const { leaders } = data;
            console.log("REDUCER - LOAD CRITICISMS");
            return {
                ...state,
                selectedLeaders: leaders.map(leader => ({
                    leaderId: leader.uuid,
                    leaderName: leader.name,
                    enabled: false
                }))
            }
        }   
        default: {
            return state;
        }
    }
}