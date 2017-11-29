import React from 'react';
import { Link } from 'react-router-dom';

import strings from '../json/strings.json';

class Logout extends React.Component {
    render() {
        const { increment, decrement, count } = this.props
        return <div id="Counter">
            <div className="button" children={strings.Counter.decrement} onClick={decrement} />
            {count}
            <div className="button" children={strings.Counter.increment} onClick={increment} />
        </div>
    }
}

export default Logout;