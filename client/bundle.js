import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import { withRouter } from 'react-router';
import { Switch } from 'react-router-dom';
import App from './containers/App';
import routes from './routes';

import './style/master.scss';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

const RoutedApp = withRouter(App)

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <RoutedApp>
                <Switch>
                    {routes}
                </Switch>
            </RoutedApp>
        </ConnectedRouter>
    </Provider>
), document.getElementById("app-root"))