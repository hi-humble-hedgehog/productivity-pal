import { BrowserWindow, nativeImage, Tray, Menu, MenuItemConstructorOptions, app } from 'electron';
import * as path from 'path';
import trayImagePath from './assets/images/trayTemplate.png';

let tray: Tray;


function createTray() {
    const trayIcon = nativeImage.createFromPath(trayImagePath);

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start Recording',
            click: () => {
                console.log('Start Recording');
                // mainWindow.webContents.send('start-recording');
            },
        },
        {
            label: 'Stop Recording',
            click: () => {
                console.log('Stop Recording');
                // mainWindow.webContents.send('stop-recording');
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            role: 'quit',
        },
    ]);

    tray.setToolTip('Productivity Pal'); // Set tooltip
    tray.setContextMenu(contextMenu);

    // Click on tray icon to toggle window visibility
    tray.on('click', () => {
        console.log('clicked');
    });
}


export default createTray;