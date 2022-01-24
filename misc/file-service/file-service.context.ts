import { ipcRenderer } from 'electron';

const fileServiceContext = {
  writeFile(txt: string) {
    ipcRenderer.invoke('write-file', txt)
  },
  test() {
      console.log('PRE INVOKE ------------- >');
      ipcRenderer.invoke('test')
  }
};

export type FileServiceContextApi = typeof fileServiceContext;

export default fileServiceContext;