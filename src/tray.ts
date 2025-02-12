import { BrowserWindow, nativeImage, Tray, Menu, MenuItemConstructorOptions, app } from 'electron';
import * as path from 'path';
import trayImagePath from './assets/images/trayTemplate.png';
import { openScreenCapturePreference, setIsFirstRun } from './utils';

let tray: Tray;


function createTray(onTrayClick: () => void) {
    const trayIcon = nativeImage.createFromPath(trayImagePath);

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Reset first run',
            click: () => {
                setIsFirstRun(true);
            },
        },
        {
            label: 'Remove screen sharing permission',
            click: () => {
                openScreenCapturePreference();
            },
        },
        {
            label: 'Open Chat Window',
            click: () => {
                onTrayClick();
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            role: 'quit',
        },
    ]);

    tray.setToolTip('Productivity Pal');
    tray.setContextMenu(contextMenu);
}


export default createTray;