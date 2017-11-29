import * as types from './types';

const initialState = {
    rating: null,
    selectedBadges: [],
    selectedCriticisms: []
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.SUBMIT_FEEDBACK: {
            const { rating, selectedBadges, selectedCriticisms } = data;
            console.log("REDUCER - SUBMIT FEEDBACK");
            console.log(rating);
            console.log(selectedBadges);
            console.log(selectedCriticisms);
            return {
                ...state,
                rating: rating,
                selectedBadges: selectedBadges,
                selectedCriticisms: selectedCriticisms
            }
        }
        case types.TOGGLE_BADGE: {
            const { badgeId } = data;
            let selectedBadges = [...state.selectedBadges];
            var location = selectedBadges.map(x => x.badge).indexOf(badgeId);
            if (location === -1) {
                return state;
            }
            selectedBadges[location].enabled = !selectedBadges[location].enabled;
            console.log("REDUCER - TOGGLE BADGE");
            console.log(selectedBadges);
            return {
                ...state,
                selectedBadges: selectedBadges
            }
        }
        case types.TOGGLE_CRITICISM: {
            const { criticismId } = data;
            let selectedCriticisms = [...state.selectedCriticisms];
            var location = selectedCriticisms.map(x => x.criticismId).indexOf(criticismId);
            if (location === -1) {
                return state;
            }
            selectedCriticisms[location].enabled = !selectedCriticisms[location].enabled;
            console.log("REDUCER - TOGGLE CRITICISM");
            console.log(selectedCriticisms);
            return {
                ...state,
                selectedCriticisms: selectedCriticisms
            }
        }
        case types.LOAD_BADGES: {
            const { badges } = data;
            console.log("REDUCER - LOAD BADGES");
            return {
                ...state,
                selectedBadges: badges.map(badge => ({
                    badge: badge.uuid,
                    name: badge.name,
                    enabled: false
                }))
            }
        }  
        case types.LOAD_CRITICISMS: {
            const { criticisms } = data;
            console.log("REDUCER - LOAD CRITICISMS");
            return {
                ...state,
                selectedCriticisms: criticisms.map(criticism => ({
                    criticismId: criticism.uuid,
                    criticismName: criticism.name,
                    enabled: false
                }))
            }
        }   
        default: {
            return state;
        }
    }
}

export default reducer;