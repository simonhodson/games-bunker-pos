import { ipcRenderer } from 'electron';

const fileServiceContext = {
  writeFile() {
    ipcRenderer.invoke('write-file')
  },
  test() {
      console.log('PRE INVOKE ------------- >');
      ipcRenderer.invoke('test')
  }
};

export type FileServiceContextApi = typeof fileServiceContext;

export default fileServiceContext;