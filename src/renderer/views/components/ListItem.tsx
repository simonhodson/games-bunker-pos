import React from 'react';
import '../App-Styles';

interface Props {
    itemName: string;
    itemDescription: string;
    itemCode: string;
    itemPrice: string;
    uid: string;
    onClick: (itemCode: string) => void;
}

export const ListItem: React.FC<Props> = ({
    itemName,
    itemDescription,
    itemPrice,
    itemCode,
    uid,
    onClick
})  => {
    return (
        <div className='listItemWrapper' onClick={() => onClick(uid)} >
            <div className='listRow'>
                <p id='listTitleText'>{itemName}</p>
            </div>
            <div className='listRow'>
                <p id='listDescText' >{itemDescription}</p>
            </div>
            <div className='listBottomRow'>
                <div style={{ display: 'inline-flex', flexDirection: 'row'}}>
                    <p className='listBottomText' style={{paddingRight: '10px' }}>Item Code:</p>
                    <p className='listBottomText'>{`${itemCode}`}</p>
                </div>
                {/* <div id='listBlank'/> */}
                <p id='priceText'>{itemPrice}</p>
            </div>
            
        </div>
    );
}
