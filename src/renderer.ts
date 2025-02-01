import './index.css';
import copy from './assets/copy.json';
import { State } from './managers/stateManager';

let state: State;
let videoEl: HTMLVideoElement;
let contentEl: HTMLElement;
let quitButtonEl: HTMLButtonElement;
let grantPermissionButtonEl: HTMLButtonElement;

const init = async () => {

  videoEl = document.querySelector('video');
  contentEl = document.querySelector('.content');
  quitButtonEl = document.querySelector('#btn-quit');
  grantPermissionButtonEl = document.querySelector('#btn-grant-permission');

  quitButtonEl.addEventListener('click', onQuitClick);
  grantPermissionButtonEl.addEventListener('click', onGrantPermissionClick);

  const urlParams = new URLSearchParams(window.location.search);
  const stateParam = urlParams.get('state');

  if (stateParam) {
    updateState(stateParam as State);
  } else {
    throw new Error('No state and/or access parameter found');
  }
}

const updateState = (newState: State) => {

  if (newState !== state) {

    state = newState;


    const hasVideo = state !== 'setup' && state !== 'restricted' && state !== 'incognito';
    videoEl.style.display = hasVideo ? 'block' : 'none';

    switch (state) {
      case 'setup':
        contentEl.innerHTML = copy.setup.content;
        break;
      case 'restricted':
        contentEl.innerHTML = copy.restricted.content;
        break;
      default:
        quitButtonEl.style.display = 'none';
        grantPermissionButtonEl.style.display = 'none';
        contentEl.innerHTML = copy.recording.content;
        initVideo();
        break;
    }
  }
}


const onQuitClick = async () => {
  // buttonEl.removeEventListener('click', onButtonClick);
  // window.electronAPI.quitApp();

  // buttonEl.style.opacity = '0';
  window.electronAPI.quitApp();
};

const onGrantPermissionClick = async () => {

  return initVideo();
}


const initVideo = async () => {
  
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      width: { ideal: window.screen.width }, // Use "ideal" to request closest to actual resolution.
      height: { ideal: window.screen.height }, // Important for high-DPI screens
      frameRate: { ideal: 60 } // Optional, adjust as needed
    },
    audio: false // Or true if you need audio
  })
    .then(stream => {
      
      videoEl.srcObject = stream;
      videoEl.onloadedmetadata = () => videoEl.play();

      updateState('recording');
    })
    .catch(e => {
      
      console.error("getDisplayMedia error:", e)
    });
}

init();