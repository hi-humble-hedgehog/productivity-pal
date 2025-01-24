import { app, BrowserWindow, session } from 'electron';
import createTray from './tray';
import { getState } from './managers/stateManager';


const isDev = !app.isPackaged;  


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      }
    });
    
    mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}?state=${getState()}`);
  }
};

app.on('ready', ()=>{

  const DEV_CSP = "default-src 'none'; script-src 'self' 'unsafe-eval'; connect-src 'self'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; video-src 'self';";
  const PROD_CSP = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'";  

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,        
        'Content-Security-Policy': [isDev ? DEV_CSP : PROD_CSP],
      }
    })
  })

  createWindow()
  createTray(createWindow);
});



app.on('window-all-closed', () => {
  
  app.dock.hide();
});

app.on('activate', createWindow);
