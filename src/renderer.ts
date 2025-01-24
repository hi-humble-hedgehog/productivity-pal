import './index.css';
import { State } from './managers/stateManager';

let state:State;

const init = async ()=>{    

    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');

    if (stateParam) {
        state = stateParam as State;

        document.querySelector('p').innerHTML = state;

    } else {
        throw new Error('No state parameter found');
    }
}

init();
