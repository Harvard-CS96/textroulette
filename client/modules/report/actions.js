import * as types from './types';

const submitReport = (report) => ({
    type: types.SUBMIT_REPORT,
    data: {
        report
    }
})

export {
    submitReport 
}