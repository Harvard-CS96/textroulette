import { connect } from 'react-redux';
import _App from '../components/App';
import { selectors as userSelectors } from '../modules/user';

const { isAuthenticated } = userSelectors;

const mapStateToProps = (state, ownProps) => ({
    isAuthenticated: isAuthenticated(state)
})


const mapDispatchToProps = {
    
}

const App = connect(mapStateToProps, mapDispatchToProps)(_App);
export default App;