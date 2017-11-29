import * as types from './types';

const submitFeedback = (rating, selectedBadges, selectedCriticisms) => ({
    type: types.SUBMIT_FEEDBACK,
    data: {
        rating,
        selectedBadges,
        selectedCriticisms
    }
})

const toggleBadge = (badgeId) => ({
    type: types.TOGGLE_BADGE,
    data: {
        badgeId
    }
})

const toggleCriticism = (criticismId) => ({
    type: types.TOGGLE_CRITICISM,
    data: {
        criticismId
    }
})

const loadAllBadges = (badges) => ({
    type: types.LOAD_BADGES,
    data: {
        badges
    }
})

const loadAllCriticisms = (criticisms) => ({
    type: types.LOAD_CRITICISMS,
    data: {
        criticisms
    }
})

export {
    submitFeedback,
    toggleBadge,
    toggleCriticism,
    loadAllBadges,
    loadAllCriticisms
}