import { connect } from 'react-redux';
import _Counter from '../components/Counter';
import {
    selectors as counterSelectors,
    operations as counterOperations
} from '../modules/counter';

const { getCount } = counterSelectors;
const { increment, decrement } = counterOperations;

const mapStateToProps = (state, ownProps) => ({
    count: getCount(state)
})


const mapDispatchToProps = {
    increment,
    decrement
} 

const Counter = connect(mapStateToProps, mapDispatchToProps)(_Counter);
export default Counter;