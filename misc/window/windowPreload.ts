import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import fileServiceContext from '../file-service/file-service.context';
import usbServiceContext from '../../src/main/usb-service/usb-service.context';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
  // fileService: fileServiceContext
});

contextBridge.exposeInMainWorld('file_service', {
  fileService: fileServiceContext
})

contextBridge.exposeInMainWorld('usb_service', {
  usbService: usbServiceContext
})