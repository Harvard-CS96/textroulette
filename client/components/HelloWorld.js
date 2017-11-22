import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../containers/Counter';
import Profile from '../containers/Profile'
import Feedback from '../containers/Feedback';
import Strings from '../json/strings.json';

class HelloWorld extends React.Component {
    render() {
        return <div id="HelloWorld">
            <Feedback />
            <Link to="/about">{Strings.HelloWorld.link}</Link>
            {Strings.HelloWorld.body}
            <ReportAbuse />
            <Feedback />
            <br />
            <Link to="/profile">{Strings.HelloWorld.link2}</Link>
            <br />
            <Link to="/about">{Strings.HelloWorld.link1}</Link>
            <br />
            <Link to="/feedback">{Strings.Feedback.link}</Link>
        </div>
    }
}

export default HelloWorld;