import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Login from '../containers/Login';
import Logout from '../containers/Logout';
import LandingPage from '../containers/LandingPage';

class App extends React.Component {
    render() {
        const { children, isAuthenticated } = this.props;
        const content = isAuthenticated === true ?
            [
                children,
            ] :
            [
                <LandingPage />
            ]

        return <div id="App">
            {/* TODO: BETTER NAME */}
            {content.map((x, i) => ({ ...x, key: i }))}
        </div>
    }
}

export default App;