import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import logo from '@assets/images/logo.png';
import './Application.less';
import { InputWindow } from './views/input-window';
import ItemData from '../../models/item-data';
import { ListItem } from './views/ListItem';
import { getStockItem, getStock } from '../../services/services';
import { stringify } from 'querystring';

interface IState {
    listItems: ItemData[] | [];
    currentTotal: number;
    displayTotal: string;
}


class Application extends React.Component<{}, IState, {}> {

    constructor(props: React.Component) {
        super(props);
        this.state = {
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00'
        }
        this.renderListItem = this.renderListItem.bind(this);
    }


    onSubmitItem = async (itemId: string) => {
        const currentItemsInList = this.state.listItems ?? [];
        // Consider making an object holding all the required data for an item on it's return;
        // API to use item number to get back item data
        try {
            await getStock();

            const newRawItem = getStockItem(itemId);
            if (!newRawItem) return; // <--- Add display result here

            const itemData: ItemData = new ItemData(
                newRawItem.uuid,
                newRawItem,
            );
            currentItemsInList.push(itemData);
            this.setState(prevState => (
                {
                    listItems: [...currentItemsInList],
                    currentTotal: prevState.currentTotal + parseFloat(itemData.itemData.itemPrice),
                    displayTotal:  (prevState.currentTotal + parseFloat(itemData.itemData.itemPrice)).toFixed(2)
                }
            ));
            return;
        } catch (error) {
            console.error(String(error));
        }
        
    }

    onRemoveListItem = (itemCode: string): void => {
        const itemData = this.state.listItems.find(itemToRemove => {
            return itemToRemove.getListId === itemCode;
        })
        console.log(itemData)
        const tempList = this.state.listItems.filter(item => {
            return item.getListId !== itemCode;
        });

        this.setState(prevState => (
            {
                listItems: tempList,
                currentTotal: prevState.currentTotal - parseFloat(itemData.itemData.itemPrice),
                displayTotal:  (prevState.currentTotal - parseFloat(itemData.itemData.itemPrice)).toFixed(2)
            }
        ));
    }

    renderListItem() {
        return this.state.listItems.map(item => {
            return (
                <ListItem
                    itemName={item.itemData.itemName}
                    itemDescription={item.itemData.itemDescription}
                    itemPrice={item.itemData.itemPrice}
                    itemCode={item.itemData.uuid}
                    uid={item.getListId}
                    onClick={this.onRemoveListItem}
                />
            )
        })
    }


    render() {
        return (
            <div id='gbpos'>
                <div className='leftPane'>
                    <InputWindow onSubmitProp={this.onSubmitItem}/>
                    <div style={{ marginTop: '15px' }}/>
                    {this.renderListItem()}
                </div>
                <div className='rightPane'>
                    <h3>{`Total: ${this.state.displayTotal}`}</h3>
                </div>
            </div>
        );
    }
};

export default hot(module)(Application);
