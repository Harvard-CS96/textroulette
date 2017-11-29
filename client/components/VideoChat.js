import React from 'react';

class VideoChat extends React.Component {
    constructor() {
        super()
        this.width = 320;
        this.height = 240;
        this.webRTC = null;
    }
    
    // localVideoRef = localVideo => { this.localVideo = localVideo; }
    // remoteVideoContainerRef = remoteVideoContainer => { this.remoteVideoContainer = remoteVideoContainer; }
    localVideoRef = "local-video"
    remoteVideoContainerRef = "remote-video-container"
    remoteVideoCanvasRef = "remote-video-canvas"

    componentDidMount() {
        const { localVideoRef, remoteVideoContainerRef, remoteVideoCanvasRef, width, height } = this;
        const { room_id } = this.props;

        const webRTC = new SimpleWebRTC({
            // the id/element dom element that will hold "our" video
            localVideoEl: localVideoRef,
            // the id/element dom element that will hold remote videos
            remoteVideosEl: remoteVideoContainerRef,
            // immediately ask for camera access
            autoRequestMedia: true,
            // set signaling server
            url: 'https://signaling.tk/',
            debug: true
        });

        webRTC.on('readyToCall', function () {
            webRTC.joinRoom(room_id)
            // $("#join-room").submit(function(e) {
            //     e.preventDefault();
            //     webRTC.joinRoom($("#room").val(), function() {
            //         $("#end-conversation").removeClass("disabled").click(function() {
            //             webRTC.leaveRoom();
            //             $(this).addClass("disabled");
            //         });
            //     });
            // });
        });

        this.webRTC = webRTC;

        webRTC.on('videoAdded', function (video, peer) {
            // console.log('video added', peer['id']);
            // Grab the ID of the peer video tag
            var video_id = '#' + peer['id'] + '_video_incoming'
            // Grab the canvas ID and getContext
            var canvas = document.getElementById(remoteVideoCanvasRef);
            var context = canvas.getContext('2d');
            // Set the tracker up with default settings
            var tracker = new window.tracking.ObjectTracker('face');
            tracker.setInitialScale(4);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);
            // Had to set camera to false on the peer video
            // so that it doesn't automatically try to play a foreign stream
            tracking.track(video_id, tracker, { camera: false });
            // Variables to help with smoothing
            // Smoothing only occurs with one face in the frame though
            var frames_without_face = 0;
            var frames_without_face_threshold = 20;
            var prior_data = [];
            // On track event
            tracker.on('track', function (event) {
              var rectangles = event.data;     
              // If statements to check whether last few frames had a face
              if (rectangles.length == 0) {
                // then increment
                frames_without_face++;
                if (frames_without_face < frames_without_face_threshold) {
                  // stores previous data as the current rectangle to use
                  // if there is currently no face but not that many
                  // frames have occurred since last face seen
                  rectangles = prior_data;
                }
              } else {
                frames_without_face = 0;
                prior_data = rectangles;
              }
              
              // clear the canvas in case there are previous drawings there
              // context.clearRect(0, 0, canvas.width, canvas.height);
              // make everything white before finding a face
              context.fillStyle = "#fff";
              context.fillRect(0,0,canvas.width,canvas.height);
              // Debugging console statements
              // console.log(event.data);
              // console.log("The frames without face is", frames_without_face);
              // Loop through the faces collected in rectangles variable
              rectangles.forEach(function(rect) {
                // console.log(rect.x, rect.y)
                // context.strokeStyle = '#a64ceb';
                var center = {"x": rect.x + (0.5 * rect.width), "y": rect.y + (0.5 * rect.height)}
                // console.log(center)
                // Below line draws the rectangle for the face
                // context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                // Below lines draw the dot for center of face and text for width and height
                // context.fillStyle = "#000";
                // context.fillRect(center.x - 1, center.y - 1, 2, 2);
                // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                // Our oval-creating part
                context.globalCompositeOperation = 'destination-out';
                context.beginPath();
                var centerX = center.x;
                var centerY = center.y;
                // Add some wiggle room to the rect width and height
                var height = rect.height * 1.5;
                var width = rect.width * 1.5;
                context.moveTo(centerX, centerY - height/2); // A1
                context.bezierCurveTo(
                  centerX + width/2, centerY - height/2, // C1
                  centerX + width/2, centerY + height/2, // C2
                  centerX, centerY + height/2); // A2
                context.bezierCurveTo(
                  centerX - width/2, centerY + height/2, // C3
                  centerX - width/2, centerY - height/2, // C4
                  centerX, centerY - height/2); // A1
                context.fill();
                context.closePath();
                context.globalCompositeOperation = 'source-over';
              });
            });
        });
    }
    
    render() {
        const { localVideoRef, remoteVideoCanvasRef, remoteVideoContainerRef, width, height } = this;

        return (
            <div id="VideoChat">
                Video Chat
                <div className="local-video-container">
                    <video id={localVideoRef} />
                </div>    
                <div className="remote-video-container" id={remoteVideoContainerRef}>
                    <canvas id={remoteVideoCanvasRef} width={width} height={height} />
                </div>    
            </div>
        )
    }
}

export default VideoChat;