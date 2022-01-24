import { FileServiceContextApi } from './file-service.context';

const context: FileServiceContextApi = (window as any).electron__window.fileService;

export default context;
