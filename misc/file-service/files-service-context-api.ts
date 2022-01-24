import { FileServiceContextApi } from './file-service.context';

const fileContext: FileServiceContextApi = (window as any).file_service.fileService;

export default fileContext;
