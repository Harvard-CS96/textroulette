import { connect } from 'react-redux';
import _CriticismSet from '../components/CriticismSet';
import { selectors as fSelectors, operations as fOperations } from '../modules/feedback';

const { getCriticisms } = fSelectors;
const { toggleCriticism, loadAllCriticisms } = fOperations;

const mapStateToProps = (state, ownProps) => ({
    selectedCriticisms: getCriticisms(state)
})


const mapDispatchToProps = {
    toggleCriticism,
    loadAllCriticisms
}

const CriticismSet = connect(mapStateToProps, mapDispatchToProps)(_CriticismSet);
export default CriticismSet;