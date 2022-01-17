import ItemData from '@src/models/item-data';
import axios from 'axios';

const url = 'http://localhost:3001/';
const postUrl = 'http//localhost:3001/post-item'

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

let stockArray: IStockItem[] | undefined = undefined;


export function getStock(): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(res => {
            stockArray = res.data;
            resolve();
        })
        .catch(err => {
            console.log(err)
            reject();
        })
    });
}

export function getStockItem(barcode: string): IStockItem | undefined {
    if (stockArray.length > 0) {
        return stockArray.find(item => item.uuid === barcode);
    } else {
        return;
    }
}

export function postTransaction(order: SalesTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(url) // <--- POST HERE
        .then(res => {
            stockArray = res.data;
            setTimeout(() => {
                resolve();
            }, 3000);
        })
        .catch(err => {
            console.log(err)
            reject();
        })
    })
}

export function buildStockAdjustmentRecord(items: ItemData[]): any {
    const rebuild: IStockItem[] = [];

    // Will create a array of object with items boiled down to quntaties
    return items;
}