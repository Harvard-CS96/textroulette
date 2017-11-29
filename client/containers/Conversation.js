import { connect } from 'react-redux';
import _Conversation from '../components/Conversation';
import { selectors as uSelectors, operations as uOperations } from '../modules/user';

const { checkStatus } = uOperations;

const mapStateToProps = (state, ownProps) => ({

})


const mapDispatchToProps = {
    checkStatus
}

const Conversation = connect(mapStateToProps, mapDispatchToProps)(_Conversation);
export default Conversation;
