import { BrowserWindow, screen } from 'electron';
import * as path from 'path';



export function createWindow(preloadPath: string, windowPath: string, options: Electron.BrowserWindowConstructorOptions = {}): BrowserWindow {

    const mergedOptions = { ...{ webPreferences: {preload: preloadPath} }, ...options };

    const browserWindow = new BrowserWindow(mergedOptions);

    browserWindow.loadURL(windowPath);

    return browserWindow;
}