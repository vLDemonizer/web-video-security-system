import React, {Component} from 'react';
import RecordRTC from 'recordrtc';
 

class Camera extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cameras: [],
            socket: new WebSocket('ws://' + host || '127.0.0.1:8000' + '/video/stream/')
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
                    reject(error)
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
            mimeType: 'video/webm',
            bitsPerSecond: 128000 
        };
        this.getStreams().then(cameras => {
            this.setState({cameras: cameras});
            for (camera in cameras) {
                rec = new RecordRTC(camera, options);
                rec.startRecording();
                records.push(rec);
            }
            for (record in records){
                intervals.push(setInterval(records => {
                    records.stopRecording(audioVideoWebMURL => {
                        let recordedBlob = records[i].getBlob();
                        console.log(recordedBlob);
                    })
                }, 60000))
            }
        })

        
    }

    render() {
        let videos = this.state.cameras.map(camera => <video key={camera.id} src={camera.url}></video>)
        return videos
    }
}

export default Camera