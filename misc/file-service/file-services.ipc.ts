import fs from 'fs';
import path from 'path';
import os from 'os';

import { ipcMain, shell } from 'electron';
import { IStockList } from '../../src/ts-structures/interfaces';

// TODO: Create Constants
const url = path.join(os.homedir(), 'Desktop/stock.json');

export const registerFileServicesIpc = () => {

    ipcMain.handle('write-stock-file', async  (event, data: any): Promise<void> => {
        const result = await writeStockFile(data);
        return result;
    });

    ipcMain.handle('read-stock-file', async  (event): Promise<IStockList | null> => {
        const result = await readStockFile();
        return result;
    });

}

const writeStockFile = (data: IStockList): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.truncate(url, 0, () => {
            fs.writeFile(
                url,
                JSON.stringify(data),
                (err) => {
                    if (err) { reject(err) };
                    resolve();
            });
        })
    }
)};

const readStockFile = (): Promise<IStockList> => {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}