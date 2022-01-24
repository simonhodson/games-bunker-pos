import fs from 'fs';
import path from 'path';
import os from 'os';

import { ipcMain, shell } from 'electron';

export const registerFileServicesIpc = () => {

    ipcMain.handle('write-stock-file', async  (event, data: any) => {
        const result = await writeStockFile(data);
        return result;
    });

}

const writeStockFile = (data: any): Promise<void> => {
    const url = path.join(os.homedir(), 'Desktop/stock.json');

    return new Promise((resolve, reject) => {
        fs.writeFile(
            url,
            JSON.stringify(data),
            { flag: 'a+'},
            (err) => {
                if (err) { reject(err) };
                resolve();
        });
    }
)}