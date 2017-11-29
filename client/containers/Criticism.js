import { connect } from 'react-redux';
import _Criticism from '../components/Criticism';
import { getCriticisms } from '../modules/feedback/selectors';
import { toggleCriticism } from '../modules/feedback/operations';

const mapStateToProps = (state, ownProps) => ({
    selectedCriticisms: getCriticisms(state)    
})


const mapDispatchToProps = {
    toggleCriticism    
} 

const Criticism = connect(mapStateToProps, mapDispatchToProps)(_Criticism);
export default Criticism;