import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import './Application.less';
import { InputWindow } from './components/input-window';
import ItemData from '../../models/item-data';
import { ListItem } from './components/list-item';
import { getStock, postTransaction, buildStockAdjustmentRecord } from '../../services/services';
import { TotalDisplay } from './components/total-display';
import { DiscountWindow } from './components/discount-window';
import { GenericButton } from './components/generic-button';
import { ActionTypes, TransactionState } from '../../ts-structures/types';
import { Banner } from './components/banner';
import { ReceiptWindow } from './components/receipt-window';
import fileContext from '../../../misc/file-service/files-service-context-api';
import { IStockItem, IStockList } from '../../ts-structures/interfaces';

interface IState {
    appLoading: boolean;
    listItems: ItemData[] | [];
    currentTotal: number;
    displayTotal: string;
    willCheckout: boolean;
    showDiscountWindow: boolean;
    disableListActions: boolean;
    appliedDiscountValue: number | null;
    appliedDiscountPercentage: number | null;
    showReceipt: boolean;
    transactionState: TransactionState;
    stockArray: IStockItem[];
    showCheckout: boolean;
    showEditList: boolean;
    showCompleteTransaction: boolean;
    showCancel: boolean;
}

class Application extends React.Component<{}, IState, {}> {
    focusRef: React.RefObject<HTMLInputElement>;

    constructor(props: React.Component) {
        super(props);
        this.focusRef = React.createRef();
        this.state = {
            appLoading: true,
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00',
            willCheckout: false,
            showDiscountWindow: false,
            disableListActions: false,
            appliedDiscountValue: null,
            appliedDiscountPercentage: null,
            showReceipt: false,
            transactionState: 'pending',
            stockArray: [],
            showCheckout: false,
            showEditList: false,
            showCompleteTransaction: false,
            showCancel: false,
        }
        this.renderListItem = this.renderListItem.bind(this);
    }

    async componentDidMount(): Promise<void> {
        try {
            const stockList = await getStock();

            if (!stockList) {
                // TODO If not stock list, raise and error to update.
                console.log('STOCK LIST NOT AVAILABLE');
            } else {
                await fileContext.writeStockFile(stockList);
                this.onLoaded(stockList); 
            }
        }
        catch(error) {
            console.error(`@Application: On Mount ${String(error)}`);
        }
    }

    onLoaded = async (newStockList: IStockList) => {
        let currentStock: IStockList | null = null;

        try {
            currentStock = await fileContext.readStockFile();
        } catch (error) {
            console.error(`@${this.onLoaded.name}: ${String(error)}`);
        }
        this.setState({ appLoading: false, stockArray: newStockList.data });
    }

    onSubmitItem = (itemId: string) => {
        if (!itemId) return;
        if (this.state.disableListActions) return;
        if (!this.state.showCancel) this.setState({ showCancel: true });
    
        const currentItemsInList = this.state.listItems ?? [];
        // Consider making an object holding all the required data for an item on it's return;
        // API to use item number to get back item data

            const newRawItem = this.state.stockArray.find(i => i.uuid === itemId);
            if (!newRawItem) return; // <--- Add display result here
            if (!this.state.showCheckout) this.setState({ showCheckout: true });

            const itemData: ItemData = new ItemData(
                newRawItem.uuid,
                newRawItem,
            );
            currentItemsInList.push(itemData);
            this.setState(prevState => (
                {
                    listItems: [...currentItemsInList],
                    currentTotal: prevState.currentTotal + parseFloat(itemData.itemData.itemPrice),
                    displayTotal:  (prevState.currentTotal + parseFloat(itemData.itemData.itemPrice)).toFixed(2),
                }
            ));
            return;
    }

    onRemoveListItem = (itemCode: string): void => {
        if (this.state.disableListActions) return;
        if (this.state.listItems.length === 0) return;

        const itemData = this.state.listItems.find(itemToRemove => {
            return itemToRemove.getListId === itemCode;
        });

        const tempList = this.state.listItems.filter(item => {
            return item.getListId !== itemCode;
        });
        console.log('TEMPT LIST ', tempList.length)

        this.setState(prevState => (
            {
                listItems: tempList,
                currentTotal: prevState.currentTotal - parseFloat(itemData.itemData.itemPrice),
                displayTotal:  (prevState.currentTotal - parseFloat(itemData.itemData.itemPrice)).toFixed(2)
            }
        ));

        if (tempList.length === 0) {
            this.resetForNewTransaction();
        }
    }

    onApplyDiscount = (toApply: boolean, percentage?: number): void => {
        if (!toApply) {
            this.setState({
                showDiscountWindow: false,
                showCompleteTransaction: true,
            });
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
                showCompleteTransaction: true,
                disableListActions: false,
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
                    disableListActions: true,
                    willCheckout: true,
                    showCheckout: false,
                    showEditList: true
                });
                break;
            case 'editList':
                // Remove discount applied then
                this.setState({ disableListActions: false });
                if (this.state.appliedDiscountValue) {
                    this.setState( prevState => ({
                        currentTotal: prevState.currentTotal + prevState.appliedDiscountValue,
                        displayTotal: (prevState.currentTotal + prevState.appliedDiscountValue).toFixed(2),
                        appliedDiscountValue: null,
                        appliedDiscountPercentage: null,
                        willCheckout: false,
                        showCheckout: true,
                        showEditList: false,
                        showCompleteTransaction: false,
                    }));
                } else {
                    this.setState({
                        willCheckout: false,
                        showCheckout: true,
                        showEditList: false,
                        showCompleteTransaction: false,
                    })
                }
                break;
            case 'complete':
                this.setState({ showCancel: false, showCompleteTransaction: false })
                void this.onCompleteTransaction()
                break;
            case 'focus':
                this.focusRef.current.focus();
                return;
            case 'cancel':
                this.resetForNewTransaction(true);
                return;
        }
        
    };

    onCompleteTransaction = async (): Promise<void> => {
        this.setState({
            showReceipt: true,
            transactionState: 'sending',
            showEditList: false
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

    resetForNewTransaction = (cancelButton?: boolean): void => {
        if (cancelButton) {
            window.alert('Are you sure ?')
        };
        this.setState({
            listItems: [],
            currentTotal: 0,
            displayTotal: '0.00',
            willCheckout: false,
            showDiscountWindow: false,
            disableListActions: false,
            appliedDiscountValue: null,
            appliedDiscountPercentage: null,
            showReceipt: false,
            transactionState: 'pending',
            showCheckout: false,
            showEditList: false,
            showCompleteTransaction: false,
            showCancel: false
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
                            <InputWindow onSubmitProp={this.onSubmitItem} forwardRef={this.focusRef} />
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
                    {!this.state.willCheckout && <GenericButton
                        onClick={this.onClickMarshalling}
                        title={this.state.listItems.length > 0 ? 'Focus' : 'Start'}
                        type='focus'
                        />
                    }
                    {this.state.showEditList &&
                        <GenericButton
                            onClick={this.onClickMarshalling}
                            title='edit list'
                            type='editList'
                        />
                    }
                    {this.state.showCheckout && <GenericButton
                        onClick={this.onClickMarshalling}
                        title='Checkout'
                        type='checkout'
                        />
                    }
                    {this.state.showCancel && <GenericButton
                        onClick={this.onClickMarshalling}
                        title='Cancel'
                        type='cancel'
                        />
                    }
                    {this.state.showCompleteTransaction && (
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
                {this.state.showReceipt && (
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
