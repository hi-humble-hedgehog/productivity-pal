import './index.css';
import copy from '../../assets/copy.json';
import { State } from '../../managers/stateManager';

let state: State;

let contentEl: HTMLElement;
let quitButtonEl: HTMLButtonElement;
let grantPermissionButtonEl: HTMLButtonElement;

const init = async () => {
  
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

  // TODO message main app about screensharing permission change
}

init();