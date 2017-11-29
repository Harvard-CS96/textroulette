import { connect } from 'react-redux';
import _Login from '../components/Login';
// import { operations as userOperations } from '../modules/user';

// const { login } = userOperations;

const mapStateToProps = (state, ownProps) => ({

})


const mapDispatchToProps = {
    // login
} 

const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);
export default Login;