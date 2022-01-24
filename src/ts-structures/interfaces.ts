import ItemData from "../models/item-data";

export interface IStockItem {
    uuid: string;
    itemName: string;
    itemDescription: string;
    itemPrice: string;
}

export interface SalesTransaction {
    orderNumber: number;
    itemList: ItemData[];
    transactionTimeStamp: Date;
}

export interface IStockList {
    data: IStockItem[];
}