import { connect } from 'react-redux';
import _StartConversationButton from '../components/StartConversationButton';
import { selectors as uSelectors, operations as uOperations } from '../modules/user';
import { selectors as qSelectors, operations as qOperations } from '../modules/questions';

const { passedSystemCheck } = uSelectors;
const { checkStatus } = uOperations;

const mapStateToProps = (state, ownProps) => ({
    passedSystemCheck: passedSystemCheck(state)
})


const mapDispatchToProps = {
    checkStatus
} 

const StartConversationButton = connect(mapStateToProps, mapDispatchToProps)(_StartConversationButton);
export default StartConversationButton;