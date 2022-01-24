import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import fileServiceContext from '../file-service/file-service.context';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
  // fileService: fileServiceContext
});

contextBridge.exposeInMainWorld('file_service', {
  fileService: fileServiceContext
})
