import { IStockItem } from '../services/services';

export default class ItemData {
    public barcodeId: string;
    public itemData: IStockItem;
    public listId: string;

    constructor(
        barcodeId: string,
        itemData: any,
    ) {
        this.barcodeId = barcodeId;
        this.itemData = itemData;
        this.listId = barcodeId + Date.now().toString();
    }

    
    public get getListId() : string {
        return this.listId;
    }
    
}