const getCams = () => {
    return new Promise(resolve => {
        let cams = []
        navigator.mediaDevices.enumerateDevices()
        .then(deviceInfos => {
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

const fetchStream = (cam) => {
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
                reject('nope')
            });
    })
}

const addStreams = async (cams) => {
    let mediaStreams = []
    for (let i = 0; i < cams.length; i++) {
        let stream = await fetchStream(cams[i])
        mediaStreams.push(stream)
    }
    return mediaStreams
}

const getStreams = async () => {
    let cams = await getCams()
    return  addStreams(cams)
}


getStreams().then(streams => {
    let mediaStreams = streams
    let i = 0
    mediaStreams.forEach(stream => {
        let video = document.getElementById('cam' + (++i))
        video.src = window.URL.createObjectURL(stream)
        video.onloadedmetadata = () => {
            video.play()
        }
    })
})