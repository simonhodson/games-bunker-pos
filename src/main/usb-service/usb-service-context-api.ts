import { UsbServiceContextApi } from './usb-service.context';

const usbContext: UsbServiceContextApi = (window as any).usb_service.usbService;

export default usbContext;
