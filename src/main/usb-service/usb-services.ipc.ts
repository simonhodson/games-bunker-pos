import fs from 'fs';
import path from 'path';
import os from 'os';
import HID from 'node-hid';
import usbDetect from 'usb-detection';

import { ipcMain, shell } from 'electron';

export const registerUsbServicesIpc = () => {

    ipcMain.handle('get-devices', async (): Promise<any[]> => {
        return await getAllDevices();
    });

    ipcMain.handle('on-scanned', async (): Promise<string> => {
        const result = onScannerInput();
        return result;
    });

    ipcMain.handle('get-input-device', async (): Promise<string> => {
        const result = getDevice();
        return result;
    });

}

const onScannerInput = (): string => {
    console.log('USB DEVICE >>>>>>>>>>>>>>>>>>>>>')
    return "SCANNER INPUT"
};

const getAllDevices = async (): Promise<any[]> => {
    const devices = HID.devices()
    return devices;
}

const getDevice = async (): Promise<any> => {
    // listen for device and report
    usbDetect.startMonitoring();
    usbDetect.on('add', (device) => {
        console.log('ADD >>> ', device)
        return new HID.HID(device.vendorId, device.productId);
    });
    
}


/*
  locationId: 337641472,
  vendorId: 2056,
  productId: 1542,
  deviceName: 'USB Keyboard',
  manufacturer: '',
  serialNumber: '',
  deviceAddress: 27
*/