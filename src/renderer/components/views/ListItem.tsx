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
            <h3 className='blockIem'>{itemName}</h3>
            <p className='blockIem' > {itemDescription}</p>
            <div style={{ flexDirection: 'row' }}>
                <p style={{ display: 'inline' }}>Item Code: </p>
                <p style={{ display: 'inline' }}>{itemCode}</p>
                {/* <div style={{display: 'inline' }} /> */}
                <p id='priceText'>{itemPrice}</p>
            </div>
            
        </div>
    );
}

// uuid	"12345"
// itemName	"Blue paint"
// itemDescription	"35ml bottle"
// itemPrice	4.45