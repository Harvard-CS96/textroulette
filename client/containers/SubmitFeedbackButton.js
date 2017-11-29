import { connect } from 'react-redux';
import _SubmitFeedbackButton from '../components/SubmitFeedbackButton';
import { selectors as fSelectors, operations as fOperations } from '../modules/feedback';

const { submitFeedback } = fOperations;
const { getBadges, getCriticisms } = fSelectors;

const mapStateToProps = (state, ownProps) => ({
    selectedBadges: getBadges(state),
    selectedCriticisms: getCriticisms(state)
})
const mapDispatchToProps = {
    submitFeedback
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

const SubmitFeedbackButton = connect(mapStateToProps, mapDispatchToProps)(_SubmitFeedbackButton);
export default SubmitFeedbackButton;