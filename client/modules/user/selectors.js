const isAuthenticated = state => state.user.isAuthenticated === true
const getUserId = state => state.user.id;
const getUserName = state => state.user.name;
const getBadges = state => state.user.badges;
const passedSystemCheck = state => state.user.passedSystemCheck === true

export {
    isAuthenticated,
    getUserId,
    getUserName,
    getBadges,
    passedSystemCheck
}