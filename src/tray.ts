import { BrowserWindow, nativeImage, Tray, Menu, MenuItemConstructorOptions, app } from 'electron';
import * as path from 'path';
import trayImagePath from './assets/images/trayTemplate.png';

let tray: Tray;


function createTray(onTrayClick: () => void) {
    const trayIcon = nativeImage.createFromPath(trayImagePath);

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start Recording',
            click: () => {
                console.log('Start Recording');
            },
        },
        {
            label: 'Stop Recording',
            click: () => {
                console.log('Stop Recording');
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
    
    tray.on('click', onTrayClick);
}


export default createTray;