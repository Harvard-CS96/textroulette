import * as types from './types';

let initialID = null,
    initialName = null,
    initialBadges = null;

if (window.user && window.user.facebook) {
    initialID = window.user.id;
    initialName = window.user.facebook.name;
    initialBadges = window.user.badges;
}

const initialState = {
    isAuthenticated: window.isAuthenticated,
    id: initialID,
    name: initialName,
    badges: initialBadges,
    passedSystemCheck: null
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.LOGIN: {
            const { id } = data;
            return {
                ...state,
                isAuthenticated: true,
                id: id
            }
        }
        case types.LOGOUT: {
            state.isAuthenticated = false;
            state.id = null;
            return {
                ...state,
                isAuthenticated: false,
                id: null
            }
        }
        case types.UPDATE_STATUS: {
            const { passedSystemCheck } = data;
            console.log("REDUCER - UPDATE STATUS");
            console.log(passedSystemCheck);
            return {
                ...state,
                passedSystemCheck: true
            }
        }
        case types.CHECK_STATUS: {
            const { passedSystemCheck } = data;
            console.log("REDUCER - CHECK STATUS");
            console.log(passedSystemCheck);
            return {
                ...state,
                passedSystemCheck: passedSystemCheck
            }
        }
        default: {
            return state;
        }
    }
}

export default reducer;