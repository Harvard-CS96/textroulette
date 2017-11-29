import React from 'react';

class Leader extends React.Component {
    render() {

        return <div id="Leader">
            <h1>{this.props.leaderId}</h1>
        </div>
    }
}

export default Leader;