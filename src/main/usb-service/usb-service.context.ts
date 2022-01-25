import { ipcRenderer } from 'electron';

const usbServiceContext = {
  async onScannerInput() {
    return await ipcRenderer.invoke('on-scanned')
  },
  async getDevices() {
    return await ipcRenderer.invoke('get-devices')
  },
  async getInputDevice() {
    return await ipcRenderer.invoke('get-input-device')
  }
};

export type UsbServiceContextApi = typeof usbServiceContext;

export default usbServiceContext;