import { app, BrowserWindow, session, systemPreferences, desktopCapturer, shell, ipcMain, safeStorage, IpcMainEvent } from 'electron';
import createTray from './tray';
import { getState, State } from './managers/stateManager';
import { hasScreenRecordingPermission, getIsFirstRun, openScreenCapturePreference, setIsFirstRun } from './utils';
import { saveScreenshot } from './managers/screenshotManager';
import {writeFileSync} from 'fs';
import { createWindow } from './managers/windowManager';
import { readSecureData, storeSecureData } from './managers/userPreferenceManager';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const isDev = !app.isPackaged;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let isFirstRun = false;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const init = async () => {

  isFirstRun = await getIsFirstRun();

  ipcMain.on('credential-message', (event: IpcMainEvent, message:string) => {

    storeSecureData("key", message);
  });

  ipcMain.on('quit-app', () => {

    app.quit();
  });  
  
  ipcMain.on('screen-recorder-message', (event: IpcMainEvent, message:string) => {

    console.log('got the message', message);
    
    const base64Data = message.replace(/^data:image\/png;base64,/, "");
    saveScreenshot(base64Data);    
  });

  app.on('window-all-closed', () => {

    app.dock.hide();
  });

  app.on('activate', createCharacterWindow);



  await app.whenReady();

  onAppReady();
}

const createCharacterWindow = () => {

  const characterWindow = createWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, `${MAIN_WINDOW_WEBPACK_ENTRY}?state=${getCurrentState()}`, {    
  });  
}

const createScreenshotWindow = () => {

  const windowPath = MAIN_WINDOW_WEBPACK_ENTRY.replace('main_window', 'screen_recorder');

  const screenshotWindow = createWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, windowPath, {
    // show: false
  });  
}

const createCredentialsWindow = () => {

  const windowPath = MAIN_WINDOW_WEBPACK_ENTRY.replace('main_window', 'credentials');
  const storedKey = readSecureData("key") || "";
  const credentialsWindow = createWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, `${windowPath}?key=${storedKey}`, {    
  });  
}

const getCurrentState = (): State => {

  if (isFirstRun) {
    return 'setup'
  }

  if (!hasScreenRecordingPermission()) {
    return 'restricted';
  }

  return 'recording';
}

const onAppReady = () => {

  console.log('safeStorage.isEncryptionAvailable()', safeStorage.isEncryptionAvailable());
  const a = safeStorage.encryptString("Rick van Mook")
  console.log('a');
  console.log(a);
  const b = safeStorage.decryptString(a);

  console.log('b');
  console.log(b);



  // Set content headers based on dev and prod for Content-Security-Policy best practices
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {

    const DEV_CSP = "default-src 'none'; script-src 'self' 'unsafe-eval'; connect-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self';";
    const PROD_CSP = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; media-src 'self';";

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [isDev ? DEV_CSP : PROD_CSP],
      }
    })
  })


  session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {

    let sources: Electron.DesktopCapturerSource[] = [];

    try {

      setIsFirstRun(false);


      if (isFirstRun || hasScreenRecordingPermission()) {
        sources = await desktopCapturer.getSources({ types: ['screen'] });

      } else if (!isFirstRun) {
        openScreenCapturePreference();
      }

    } catch (error) {

      // on first run, Mac will open the privacy settings for us through a dialog.
      if (!isFirstRun) {
        // TODO display message to users that we can't display the screen. In the interface ask for permission again.
        openScreenCapturePreference();
      }
    }

    if (sources && sources.length) {
      const selectedSource = sources[0];

      callback({ video: selectedSource, audio: 'loopback' })
    } else {

      callback({ video: null, audio: null });
    }


  }, { useSystemPicker: false });

  createTray(createCharacterWindow, createCredentialsWindow);
  createCredentialsWindow();
};

init();