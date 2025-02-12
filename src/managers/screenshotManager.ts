import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export const getTemporaryDirectory = () => {
    const tempDirectory = app.getPath('temp');
    const appSpecificTempDir = path.join(tempDirectory, app.getName());

    // Create directory only if doesn't exist
    if (!fs.existsSync(appSpecificTempDir)) {
        fs.mkdirSync(appSpecificTempDir, { recursive: true });
    }


    return appSpecificTempDir;

};

export const saveScreenshot = async (base64Data: string) => {
    const tempDir = getTemporaryDirectory();
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `screenshot-${timestamp}`;
    const fileType = '.png';
    const tempFilePath = path.join(tempDir, fileName + fileType);
    console.log('tempFilePath',tempFilePath);

    fs.writeFileSync(tempFilePath, base64Data, 'base64');
}