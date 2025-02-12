import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    screenRecorderMessage: (message:string) => ipcRenderer.send('screen-recorder-message', message)
});
