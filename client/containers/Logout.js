import { connect } from 'react-redux';
import _Logout from '../components/Logout';
import {
    selectors as userSelectors,
    // operations as userOperations
} from '../modules/user';

const { getUserId, getUserName } = userSelectors;
// const { logout } = userOperations;

const mapStateToProps = (state, ownProps) => ({
    user: {
        id: getUserId(state),
        name: getUserName(state)
    }
})


const mapDispatchToProps = {
    // logout
} 

const Logout = connect(mapStateToProps, mapDispatchToProps)(_Logout);
export default Logout;