import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import logo from '@assets/images/logo.png';
import './Application.less';
import { InputWindow } from './views/input-window';
import ItemData from '../../models/item-data';
import { ListItem } from './views/ListItem';
import { getStockItem, getStock } from '../../services/services';
import { TotalDisplay } from './views/total-display';
import { ActionButton } from './views/action-button';

interface IState {
    listItems: ItemData[] | [];
    currentTotal: number;
    displayTotal: string;
    willCheckout: boolean;
}


class Application extends React.Component<{}, IState, {}> {

    constructor(props: React.Component) {
        super(props);
        this.state = {
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00',
            willCheckout: true,
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

    onClickDiscount = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('Do you wish to apply discount?')) {
            console.log('>>>>>>>>>>>>>>>>>>>> OK');
        } else {
            console.log('>>>>>>>>>>>>>>>>>>>> NOPE')
        }
    };

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
                    <ActionButton
                        title='membership discount'
                        type='discount'
                        onClick={this.onClickDiscount}
                        willCheckout={this.state.willCheckout}
                    />
                    <TotalDisplay total={this.state.displayTotal}/>
                </div>
            </div>
        );
    }
};

export default hot(module)(Application);
