import axios from 'axios';
import * as actions from './actions';

const submitFeedback = (rating, selectedBadges, selectedCriticisms) => dispatch => {
    console.log("OPERATION - SUBMIT FEEDBACK");
    console.log(rating);
    console.log(selectedBadges);
    console.log(selectedCriticisms);
    return axios.post('/chats', { badges: selectedBadges, criticisms: selectedCriticisms, stars: rating })
        .then(response => {
            console.log(response);
            dispatch(actions.submitFeedback(rating, selectedBadges, selectedCriticisms));
        })
        .catch(error => {
            console.log(error);
        });
}

const toggleBadge = actions.toggleBadge;

const toggleCriticism = actions.toggleCriticism;

const loadAllBadges = () => dispatch => {
    axios.get('/badges/list')
        .then(response => response.data)
        .then(response => {
            console.log("OPERATIONS - LOAD ALL BADGES");
            console.log(response)
            dispatch(actions.loadAllBadges(response));
        })

}

const loadAllCriticisms = () => dispatch => {
    console.log("OPERATIONS - LOAD ALL CRITICISMS");
    axios.get('/criticisms/list')
        .then(response => response.data)
        .then(response => {
            console.log("OPERATIONS - LOAD ALL CRITICISMS");
            console.log(response);
            dispatch(actions.loadAllCriticisms(response));
        })
        .catch(error => {
            console.log(error);
        });

}

export {
    submitFeedback,
    toggleBadge,
    loadAllBadges,
    toggleCriticism,
    loadAllCriticisms
}