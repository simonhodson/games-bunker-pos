import ItemData from '@src/models/item-data';
import axios from 'axios';
import { IStockItem, IStockList, SalesTransaction } from '../ts-structures/interfaces';

const url = 'http://localhost:3001/';
const postUrl = 'http//localhost:3001/post-item'


export function getStock(): Promise<IStockList> {
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            console.log(err)
            reject();
        })
    });
}

export function getStockItem(barcode: string): IStockItem | undefined {
    // replace with read from disk service
    const stockArray: IStockItem[] = [];
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

    // Will create a array of object with items boiled down to quantities
    return items;
}