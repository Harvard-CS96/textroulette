import axios from 'axios';
import * as actions from './actions';
// axios.defaults.withCredentials = true;

const login = () => dispatch => {
    return axios('/user/login')
        .then(response => response.data)
        .then(data => {
            console.log(data)
            const { id } = data;
            dispatch(actions.login(id))
        })
}

const logout = actions.logout;

const checkStatus = () => dispatch => {
    return axios('/system-check')
        .then(response => response.data)
        .then(response => {
            console.log("OPERATIONS - CHECK STATUS");
            console.log(response.check);
            dispatch(actions.checkStatus(response.check))
        });
}

const updateStatus = () => dispatch => {
    console.log("OPERATION - UPDATE STATUS");
    // axios.post('/system-check', {check: true}).then(response => {console.log(response.data.status);});
    // axios('/system-check').then(response => response.data).then(response => {console.log(response)});
    // return axios({
    //     method: 'POST',
    //     url: '/system-check',
    //     data: {check: true},
    //     withCredentials: true
    // }).then(response => {
    //     console.log(response.data.status);
    //     dispatch(actions.updateStatus(true));
    // })
    // .catch(error => {
    //     console.log(error);
    // });
    return axios.post('/system-check', {check: true})
        .then(response => {
            console.log(response.data.status);
            dispatch(actions.updateStatus(true));
        })
        .catch(error => {
            console.log(error);
        });
}

export {
    login, 
    logout,
    checkStatus,
    updateStatus
}