import React, { useState, useEffect } from 'react';
import '../App-Styles.css';

type ActionTypes = 'discount' | 'checkout';

interface Props {
    onClick: (e: React.MouseEvent) => void;
    title: string;
    type: ActionTypes;
    willCheckout: boolean;
}

export const ActionButton: React.FC<Props> = ({ onClick, title, type, willCheckout }) => {
    const [visBool, setVisibility] = useState<boolean>(true);
    useEffect(() => {

    }, [willCheckout])

    switch (type) {
        case 'discount':
            break;
        default:
            break;
    };

    return (
        <div
            className='actionButton'
            onClick={(e) => onClick(e)}
            style={{ visibility: visBool ? 'visible' : 'hidden' }}
        >
            <p className='actionButtonTitle'>{title.toUpperCase()}</p>
        </div>
    );
}