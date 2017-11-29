import React from 'react';
import { Link } from 'react-router-dom';
import Profile from '../containers/Profile'
import Feedback from '../containers/Feedback';
import Strings from '../json/strings.json';
import Logout from '../containers/Logout';

class HelloWorld extends React.Component {
    render() {
        return <div id="HelloWorld">
            {/* <Profile /> */}
            <Link to="/about">{Strings.HelloWorld.link}</Link>
            {Strings.HelloWorld.body}
            <br />
            <Link to="/profile">{Strings.HelloWorld.link2}</Link>
            <br />
            <Link to="/about">{Strings.HelloWorld.link1}</Link>
            <br />
            <Link to="/feedback">{Strings.Feedback.link}</Link>
            <br />
            <Link to="/system_check">{Strings.SystemCheck.link}</Link>
            <br />
            <Link to="/conversation/test">test convo</Link>
            <br />
            <Logout />
        </div>
    }
}

export default HelloWorld;