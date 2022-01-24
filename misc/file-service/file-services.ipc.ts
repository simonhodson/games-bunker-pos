// const fs = require('fs');
import { ipcMain, shell } from 'electron';

export const registerFileServicesIpc = () => {

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
    return new Promise((res, rej) => {
        setTimeout(() =>{
            return res()
        }, 3000)
    })

}

const test = () => {
    console.log('>>>>>>>>>>>> inner test function <<<<<<<<<<<<<');
}