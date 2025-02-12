import './screen-recorder.css';

const videoEl: HTMLVideoElement = document.querySelector('video');
const imageEl: HTMLImageElement = document.querySelector('img');
const canvasEl: HTMLCanvasElement = document.createElement('canvas');
const context2d: CanvasRenderingContext2D = canvasEl.getContext('2d') as CanvasRenderingContext2D;

init();

async function init() {

    try {

        await initVideo();

        window.addEventListener('click', ()=>{
            console.log('click');
            const screenshot = takeScreenshot();
            console.log('screenshot', screenshot);
            window.electronAPI.screenRecorderMessage(screenshot);
            imageEl.src = screenshot;
        });
    } catch (error) {
        console.error('Error initializing video:', error);
    }
}

async function initVideo() {
    console.log('initVideo', 0, videoEl);
    return navigator.mediaDevices.getDisplayMedia({
        video: {
            width: { ideal: window.screen.width }, // Use "ideal" to request closest to actual resolution.
            height: { ideal: window.screen.height }, // Important for high-DPI screens
            frameRate: { ideal: 60 } // Optional, adjust as needed
        },
        audio: false // Or true if you need audio
    })
        .then(stream => {
            console.log('initVideo', 1, stream);
            videoEl.srcObject = stream;
            videoEl.onloadedmetadata = () => videoEl.play();

        })
        .catch(e => {
            console.log('initVideo', 2);
            console.error("getDisplayMedia error:", e)
        });
}

function takeScreenshot() {
    
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    context2d.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    
    return canvasEl.toDataURL("image/png");
}