import { connect } from 'react-redux';
import _Profile from '../components/Profile';
import {
    selectors as qSelectors,
    operations as qOperations
} from '../modules/questions';

const { loadQuestions } = qOperations
const { getQuestions } = qSelectors; 

const mapStateToProps = (state, ownProps) => ({
    questions: getQuestions(state)
})


const mapDispatchToProps = {
    loadQuestions
} 

const Profile = connect(mapStateToProps, mapDispatchToProps)(_Profile);
export default Profile;