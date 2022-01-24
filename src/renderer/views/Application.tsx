import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import logo from '@assets/images/logo.png';
import './Application.less';
import { InputWindow } from './components/input-window';
import ItemData from '../../models/item-data';
import { ListItem } from './components/list-item';
import { getStockItem, getStock, postTransaction, buildStockAdjustmentRecord } from '../../services/services';
import { TotalDisplay } from './components/total-display';
import { DiscountWindow } from './components/discount-window';
import { GenericButton } from './components/generic-button';
import { ActionTypes, TransactionState } from '../../ts-structures/types';
import { Banner } from './components/banner';
import { ReceiptWindow } from './components/receipt-window';
import fileContext from '../../../misc/file-service/files-service-context-api';

interface IState {
    appLoading: boolean;
    listItems: ItemData[] | [];
    currentTotal: number;
    displayTotal: string;
    willCheckout: boolean;
    showDiscountWindow: boolean;
    disbaleListActions: boolean;
    appliedDiscountValue: number | null;
    appliedDiscountPercentage: number | null;
    showReciept: boolean;
    transactionState: TransactionState;
}

class Application extends React.Component<{}, IState, {}> {

    constructor(props: React.Component) {
        super(props);
        this.state = {
            appLoading: true,
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00',
            willCheckout: false,
            showDiscountWindow: false,
            disbaleListActions: false,
            appliedDiscountValue: null,
            appliedDiscountPercentage: null,
            showReciept: false,
            transactionState: 'pending',
        }
        this.renderListItem = this.renderListItem.bind(this);
    }

    async componentDidMount(): Promise<void> {
        try {
            await getStock();
            await fileContext.writeFile('Text to be written');
            this.onLoaded();
            
        }
        catch(error) {
            console.error(String(error));
        }
    }

    onLoaded = () => {
        this.setState({ appLoading: false });
    }

    onSubmitItem = (itemId: string) => {
        if (this.state.disbaleListActions) return;

        const currentItemsInList = this.state.listItems ?? [];
        // Consider making an object holding all the required data for an item on it's return;
        // API to use item number to get back item data

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
    }

    onRemoveListItem = (itemCode: string): void => {
        if (this.state.disbaleListActions) return;

        const itemData = this.state.listItems.find(itemToRemove => {
            return itemToRemove.getListId === itemCode;
        });

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

    onApplyDiscount = (toApply: boolean, percentage?: number): void => {
        if (!toApply) {
            this.setState({ showDiscountWindow: false });
            // Run next step of checkout
            return;
        }

        if (percentage) {
            const newTotal = this.state.currentTotal - (this.state.currentTotal * (percentage / 100));
            this.setState(prevState => ({
                currentTotal: newTotal,
                displayTotal: String(newTotal.toFixed(2)),
                showDiscountWindow: false,
                appliedDiscountValue: prevState.currentTotal - newTotal,
                appliedDiscountPercentage: percentage,
            }));
            // Run next step of checkout
            return;
        }

    }

    
    onClickMarshalling = (e: React.MouseEvent, type: ActionTypes) => {
        e.preventDefault();

        switch (type) {
            case 'checkout':
                if (this.state.currentTotal <= 0) return;
                this.setState({
                    showDiscountWindow: true,
                    disbaleListActions: true,
                    willCheckout: true,
                });
                break;
            case 'editList':
                // Remove discount applied then
                this.setState({ disbaleListActions: false });
                if (this.state.appliedDiscountValue) {
                    this.setState( prevState => ({
                        currentTotal: prevState.currentTotal + prevState.appliedDiscountValue,
                        displayTotal: (prevState.currentTotal + prevState.appliedDiscountValue).toFixed(2),
                        appliedDiscountValue: null,
                        appliedDiscountPercentage: null
                    }));
                }
                break;
            case 'complete':
                void this.onCompleteTransaction()
                break;
        }
        
    };

    onCompleteTransaction = async (): Promise<void> => {
        this.setState({
            showReciept: true,
            transactionState: 'sending'
        })
        // Whatever the response send api
        await postTransaction({
            orderNumber: 1,
            itemList: buildStockAdjustmentRecord(this.state.listItems),
            transactionTimeStamp: new Date()
        });

        this.setState({
            transactionState: 'completed'
        });
    }

    onPrintReceipt(receipt: boolean): void {
        if (receipt) {
            // Begin a CSV process with the list
            this.setState({ transactionState: 'printing' });
            setTimeout(() => {
                this.resetForNewTransaction()
            }, 3000)
        } else {
                    // RESET ALL STATE
        this.resetForNewTransaction();
        }


    }

    resetForNewTransaction = (): void => {
        this.setState({
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00',
            willCheckout: false,
            showDiscountWindow: false,
            disbaleListActions: false,
            appliedDiscountValue: null,
            appliedDiscountPercentage: null,
            showReciept: false,
            transactionState: 'pending',
        });
    }

    renderListItem() {
        return this.state.listItems.map((item, idx) => {
            return (
                <ListItem
                    key={`@Item_${idx}_${item.barcodeId}`}
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
            <div id='main'>
                <div className='leftPane'>
                    {this.state.appLoading ? (
                        <div style={{ marginTop: '100px'}}>
                            <h2>LOADING....</h2>
                        </div>
                    ) : (
                        <>
                            <InputWindow onSubmitProp={this.onSubmitItem} />
                            <div style={{ marginTop: '15px' }}/>
                            {this.state.appliedDiscountPercentage &&
                                <Banner title={`Discount applied ${this.state.appliedDiscountPercentage}%`}/>
                            }
                            {this.renderListItem()}
                        </>
                    )}

                </div>
                <div className='rightPane'>
                    <TotalDisplay total={this.state.displayTotal}/>
                    <div style={{height: '1.7em'}} />
                    <GenericButton
                        onClick={this.onClickMarshalling}
                        title='Checkout'
                        type='checkout'
                    />
                    {this.state.appliedDiscountValue &&
                        <GenericButton
                            onClick={this.onClickMarshalling}
                            title='edit list'
                            type='editList'
                        />
                    }
                    {this.state.willCheckout && (
                        <>
                            <div style={{height: '2.7em'}} />
                            <GenericButton
                                onClick={this.onClickMarshalling}
                                title='Complete Transaction'
                                type='complete'
                            />
                        </>
                    )}
                </div>
                {this.state.showDiscountWindow && (
                    <DiscountWindow
                        apply={this.onApplyDiscount}
                    />
                )}
                {this.state.showReciept && (
                    <ReceiptWindow
                        receiptAction={(receipt) => this.onPrintReceipt(receipt)}
                        transactionState={this.state.transactionState}
                    />
                )}
            </div>
        );
    }
};

export default hot(module)(Application);
