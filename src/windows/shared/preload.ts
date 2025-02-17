import { contextBridge, ipcRenderer } from 'electron';
import { State } from '../../managers/stateManager';
console.log('Preload script loading...')
contextBridge.exposeInMainWorld('electronAPI', {
    quitApp: () => {
        console.log('quitApp, called');
        ipcRenderer.send('quit-app')
    },
    updateState: (state:State) => ipcRenderer.send('update-state'),
    credentialMessage: (message:string) => ipcRenderer.send('credential-message', message),
    screenRecorderMessage: (message:string) => ipcRenderer.send('screen-recorder-message', message)
});

console.log('Preload script finished loading')