import * as types from './types';

const login = (id) => ({
    type: types.LOGIN,
    data: {
        id
    } 
})

const logout = () => ({
    type: types.LOGOUT
})

const updateStatus = (passedSystemCheck) => ({
    type: types.UPDATE_STATUS,
    data: {
        passedSystemCheck
    }
})

const checkStatus = (passedSystemCheck) => ({
    type: types.CHECK_STATUS,
    data: {
        passedSystemCheck
    }
})

export {
    login,
    logout,
    updateStatus,
    checkStatus
}