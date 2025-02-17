import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { safeStorage } from 'electron';

const storagePath = path.join(app.getPath('userData'), 'hh');
console.log('storagePath', storagePath);

function readStorageFile(): Record<string, string> {
    if (fs.existsSync(storagePath)) {
        try {
            const fileContent = fs.readFileSync(storagePath, 'utf-8');
            return JSON.parse(fileContent) as Record<string, string>;
        } catch (error) {
            console.error('Error reading storage file:', error);
        }
    }
    return {};
}

function writeStorageFile(data: Record<string, string>): void {
    try {
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing storage file:', error);
    }
}

export function storeSecureData(key: string, value: string): void {
    if (!safeStorage.isEncryptionAvailable()) {
        console.error('Safe storage encryption is not available.');
        return;
    }

    const data = readStorageFile();
    data[key] = safeStorage.encryptString(value).toString('base64');
    writeStorageFile(data);
}

export function readSecureData(key: string): string | null {
    if (!safeStorage.isEncryptionAvailable()) {
        console.error('Safe storage encryption is not available.');
        return null;
    }

    const data = readStorageFile();
    if (data[key]) {
        try {
            return safeStorage.decryptString(Buffer.from(data[key], 'base64'));
        } catch (error) {
            console.error('Error decrypting secure data:', error);
        }
    }
    return null;
}
