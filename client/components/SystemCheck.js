import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Strings from '../json/strings.json';
import { ReactMic } from 'react-mic';

class SystemCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: false,
            blobURL: null
        }
    }

    startRecording = () => {
        this.setState({
            record: true
        });
    }

    stopRecording = () => {
        this.setState({
            record: false
        });
    }

    onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        this.setState({
            blobURL: recordedBlob.blobURL
        });
    }

    onReturn = () => {
        this.props.history.push('/profile');
    }

    onContinue = () => {
        this.props.updateStatus();
        this.props.history.push('/conversation');
    }

    render() {
        return <div id="SystemCheck">
            {/* TODO: Include video face detection check here. */}
            <div id="WebcamCheck">
            </div>
            <div>
                <ReactMic
                    record={this.state.record}
                    className="sound-wave"
                    onStop={this.onStop}
                    strokeColor="#000000"
                    backgroundColor="#eeeeee" />
                <br />
                <button onClick={this.startRecording} type="button">Start</button>
                <button onClick={this.stopRecording} type="button">Stop</button>
                <div><audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio></div>
            </div>
            <div className="button" children="Return To Profile" onClick={this.onReturn} />
            {/* TODO: Add proceed button that checks if all tests done. */}
            <div className="button" children="Continue" onClick={this.onContinue} />
        </div>
    }
}

export default withRouter(SystemCheck);
