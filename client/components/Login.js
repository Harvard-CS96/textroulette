import React from 'react';
import { Link } from 'react-router-dom';

import strings from '../json/strings.json';

class Login extends React.Component {
    login = () => {
        window.location.pathname = "/auth/facebook";
    }
    render() {
        const { login } = this;
        return <div id="Login">
        		<div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary" children={strings.Login.link} onClick={login}>Continue with Facebook</button>
                      </div>
                    </div>
                  </div>
                </div>
        	</div>
    }
}

export default Login;