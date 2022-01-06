import axios from 'axios';

const url = 'http://localhost:3001/';

export interface IStockItem {
    uuid: string;
    itemName: string;
    itemDescription: string;
    itemPrice: string;
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