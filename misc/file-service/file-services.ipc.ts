// const fs = require('fs');
import { BrowserWindow, ipcMain, shell } from 'electron';

export const registerFileServicesIpc = (mainWindow: BrowserWindow) => {

    ipcMain.handle('write-file', async  (event, arg) => {
        console.log('>>>>>>>>>>>>>>>>>>>>> ...', arg);
        return await writeFile();
    });

    ipcMain.handle('test', () => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> TESTING <<<<<<<<<<<<<<<<<<<<<<<')
        test();
    })
}

const writeFile = (): Promise<void> => {
    console.log('>>>>>>>>>>>>>>>>>>>> I AM WRITING A FILE');
    return Promise.resolve();
}

const test = () => {
    console.log(('inner test functioin'))
}