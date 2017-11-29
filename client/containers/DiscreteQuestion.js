import { connect } from 'react-redux';
import _DiscreteQuestion from '../components/DiscreteQuestion';
import { operations as qOperations } from '../modules/questions';

const { setAnswer } = qOperations;

const mapStateToProps = (state, ownProps) => ({
})


const mapDispatchToProps = (dispatch, ownProps) => {
    const { id } = ownProps;
    return {
        setAnswer: answer => {
            console.log(id, answer)
            dispatch(setAnswer(id, answer))
        }
    }
} 

const DiscreteQuestion = connect(mapStateToProps, mapDispatchToProps)(_DiscreteQuestion);
export default DiscreteQuestion;