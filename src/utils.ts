
import * as path from 'path';
import * as fs from 'fs';
import { app, shell, systemPreferences } from 'electron';
import { spawn } from 'child_process';

export const hasScreenRecordingPermission = () => {

    const mediaAccessStatus = systemPreferences.getMediaAccessStatus('screen');

    return mediaAccessStatus === "granted";
}

const firstRunFileName = 'first-run';
const firstRunFilePath = path.join(app.getPath('userData'), firstRunFileName);

export const setIsFirstRun = async (newIsFirstRun: boolean) => {

    if (await getIsFirstRun() === newIsFirstRun) {
        return
    };

    if (newIsFirstRun === true) {
        // we can unlink safely because we know it exists based on the check above
        fs.unlinkSync(firstRunFilePath);
    } else {
        fs.writeFileSync(firstRunFilePath, '');
    }

}

export const openScreenCapturePreference = () => {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture')
}

export const getIsFirstRun = async () => {

    try {

        return !fs.existsSync(firstRunFilePath);

    } catch (error) {
        console.error('Error checking first run:', error);

        // Default to false in case of error to avoid accidentally showing things twice
        return false;
    }
}