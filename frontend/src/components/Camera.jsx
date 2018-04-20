import React, {Component} from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class Camera extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cameras: []
        };
        
        this.getCams = this.getCams.bind(this);
        this.fetchStream = this.fetchStream.bind(this);
        this.addStreams = this.addStreams.bind(this);
        this.getStreams = this.getStreams.bind(this);
    }

    getCams() {
        return new Promise(resolve => {
            navigator.mediaDevices.enumerateDevices()
            .then(deviceInfos => {
                let cams = []
                for (let i = 0; i < deviceInfos.length; i++) {
                    if (deviceInfos[i].kind === 'videoinput') {
                        cams.push(deviceInfos[i].deviceId)
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
        let mediaStreams = []
        for (let i = 0; i < cams.length; i++) {
            let stream = await this.fetchStream(cams[i])
            mediaStreams.push({
                src: stream,
                id: cams[i],
                name: 'cam' + (i+1),
                url: window.URL.createObjectURL(stream)
            })
        }
        return mediaStreams
    }
    
    async getStreams() {
        let cams = await this.getCams()
        return  this.addStreams(cams)
    }

    componentDidMount() {
        let intervals = [];
        let records = [];
        const options = {
            mimeType: 'video/webm\;codecs=h264',
            bitsPerSecond: 128000 
        };
        const handleRecorder = record => {
            record.stopRecording(audioVideoWebMURL => {
                let recordedBlob = record.getBlob();
                let file = new File(
                    [recordedBlob], 
                    'filename.h264', {
                    type: 'video/webm\;codecs=h264'
                });
                let form = new FormData();
                form.append('video', file);
                form.append('videoId', 23);
                form.append('nodeId', 34);
                axios.post('http://192.168.0.106:8000/video-stream/', form)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                
            });
            record.startRecording();
        }
        this.getStreams().then(cameras => {
            this.setState({cameras: cameras});
            for (let i = 0; i < cameras.length; i++) {
                let rec = new RecordRTC(cameras[i].src, options);
                rec.startRecording();
                records.push(rec);
            }
            for (let i = 0; i < records.length; i++){
                intervals.push(setInterval(() => handleRecorder(records[i]), 6000))
            }
            
        })

        
    }

    render() {
        let videos = this.state.cameras.map(camera => <video key={camera.id} src={camera.url}></video>);
        return videos;
    }
}

export default Camera;