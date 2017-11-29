import { connect } from 'react-redux';
import _LeaderboardButton from '../components/LeaderboardButton';
import { selectors as fSelectors, operations as fOperations } from '../modules/leaderboard';

const { toggleLeaderboard } = fOperations;
const { getLeaderStatus } = fSelectors;

const mapStateToProps = (state, ownProps) => ({
    selectedLeaderStatus: getLeaderStatus(state)
})
const mapDispatchToProps = {
    toggleLeaderboard
} 

// Eliminated this code block because properties were not being passed.
// const mapDispatchToProps = (dispatch, ownProps) => {
//     console.log(ownProps);
//     return {
//         submitFeedback: feedback => {
//             const { rating, selectedBadges } = ownProps;
//             console.log(rating);
//             console.log(selectedBadges);  
//             console.log(this.props);          
//             dispatch(submitFeedback(rating, selectedBadges))
//         }
//     }
// } 

const LeaderboardButton = connect(mapStateToProps, mapDispatchToProps)(_LeaderboardButton);
export default LeaderboardButton;