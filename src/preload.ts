import { contextBridge, ipcRenderer } from 'electron';
import { State } from './managers/stateManager';

contextBridge.exposeInMainWorld('electronAPI', {
    quitApp: () => ipcRenderer.send('quit-app'),
    updateState: (state:State) => ipcRenderer.send('update-state'),
});
