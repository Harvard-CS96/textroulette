import * as types from './types';

const initialState = {
    report: null,
}

const reducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case types.SUBMIT_REPORT: {
            const { report } = data;
            console.log("Hit reducer for submitting report");
            console.log(report);
            return {
                ...state,
                report: report
            }
        }
        default: {
            return state;
        }
    }
}
