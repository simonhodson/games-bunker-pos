import { ipcRenderer } from 'electron';

const fileServiceContext = {
  async writeStockFile(data: any) {
    return await ipcRenderer.invoke('write-stock-file', data)
  }

};

export type FileServiceContextApi = typeof fileServiceContext;

export default fileServiceContext;