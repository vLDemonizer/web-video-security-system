import React, {Component} from 'react';
import RecordRTC from 'recordrtc';
import CameraItem from './CameraItem.jsx';
import {Row, Container, Button} from 'reactstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class Cameras extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cameras: '',
            backendCameras: [],
            record: false,
        };
        
        this.getCams = this.getCams.bind(this);
        this.fetchStream = this.fetchStream.bind(this);
        this.addStreams = this.addStreams.bind(this);
        this.getStreams = this.getStreams.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.startRecordings = this.startRecordings.bind(this);
        this.getBackendCameras = this.getBackendCameras.bind(this);
    }

    getCams() {
        return new Promise(resolve => {
            navigator.mediaDevices.enumerateDevices()
            .then(deviceInfos => {
                let cams = []
                for (let i = 0; i < deviceInfos.length; i++) {
                    if (deviceInfos[i].kind === 'videoinput') {
                        cams.push(deviceInfos[i].deviceId);
                    }
                }
                resolve(cams)
            })
            .catch(errors => console.log(errors))
        })
    }
    
    fetchStream(cam) {
        return new Promise(resolve => {
            navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: {
                        exact: cam
                        }
                    }
                })
                .then(mediaStream => {
                    resolve(mediaStream)
                })
                .catch(error => {
                    console.log(error)
                });
        })
    }
    
    async addStreams(cams) {
        let mediaStreams = [];
        for (let i = 0; i < cams.length; i++) {
            let stream = await this.fetchStream(cams[i]);
            mediaStreams.push({
                src: stream,
                id: cams[i],
                name: 'cam' + (i+1),
                url: window.URL.createObjectURL(stream)
            });
        }
        return mediaStreams;
    }
    
    async getStreams() {
        let cams = await this.getCams();
        return  this.addStreams(cams);
    }

    getBackendCameras() {
        axios.get(this.props.ip + '/get-cameras/' + this.props.node + '/')
            .then(response => this.setState({backendCameras: response.data}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getBackendCameras();
        this.getStreams().then(cameras => this.setState({cameras: cameras}));
    }

    startRecordings() {
        /*
        const cameras = this.state.cameras;
        let intervals = [];
        let records = [];
        const options = {
            mimeType: 'video/webm',
            bitsPerSecond: 128000 
        };
        const handleRecorder = record => {
            record.stopRecording(audioVideoWebMURL => {
                let recordedBlob = record.getBlob();
                let file = new File(
                    [recordedBlob], 
                    new Date().valueOf() + '.webm', {
                    type: 'video/webm'
                });
                let form = new FormData();
                form.append('video', file);
                form.append('videoId', 23);
                form.append('nodeId', this.props.node);
                axios.post(this.props.ip + '/video-stream/', form)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                
            });
            record.startRecording();
        }
        for (let i = 0; i < cameras.length; i++) {
            let rec = new RecordRTC(cameras[i].src, options);
            rec.startRecording();
            records.push(rec);
        }
        for (let i = 0; i < records.length; i++){
            intervals.push(setInterval(() => handleRecorder(records[i]), 6000))
        }*/
        this.setState({record: !this.state.record});
    }

    startRecording(camera, identifier) {
        console.log(camera, identifier)
        const options = {
            mimeType: 'video/webm',
            bitsPerSecond: 128000 
        };
        
        const handleRecorder = record => {
            record.stopRecording(audioVideoWebMURL => {
                let recordedBlob = record.getBlob();
                let file = new File(
                    [recordedBlob], 
                    new Date().valueOf() + '.webm', {
                    type: 'video/webm'
                });
                let form = new FormData();
                form.append('video', file);
                form.append('camera', identifier);
                axios.post(this.props.ip + '/video-stream/', form)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                
            });
            record.startRecording();
        }
        
        let rec = new RecordRTC(camera, options);
        rec.startRecording();

        setInterval(() => handleRecorder(rec), 30000)
        
    }

    render() {
        let videos = <div></div>
        if (this.state.cameras) {
            let videos = this.state.cameras.map(camera => (
                <CameraItem 
                    key={camera.id} 
                    url={camera.url} 
                    src={camera.src}
                    node={this.props.node} 
                    ip={this.props.ip}
                    backendCameras={this.state.backendCameras} 
                    selectCamera={(backendCameras) => this.setState({backendCameras: backendCameras})}
                    updateBackendCameras={this.getBackendCameras}
                    startRecording={this.startRecording}
                    record={this.state.record}
                />
            ));
            return (
                <Container fluid={true}>
                    <Row>
                        {videos}
                    </Row>
                    <div className="text-center">
                        <h3>Remember to verify that the cameras are set correctly!</h3>
                        <Button color="primary" onClick={this.startRecordings}>Star Recording</Button>
                    </div> 
                </Container>
            )
        }
        else {
            return videos;
        }
    }
}

export default Cameras;