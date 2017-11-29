import axios from 'axios';
import * as actions from './actions';

//TODO: change reportType to reportData, which includes from and to (currently only holds kind)
const submitReport = ({ kind, text }) => dispatch => {
    console.log("Hit submit operation");
    //TODO: Add to and from userIDs
    return axios.post('/feedback/report', { kind, text });
}

export {
    submitReport,
}