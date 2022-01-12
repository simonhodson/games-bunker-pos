import React, { useState, useEffect } from 'react';
import '../App-Styles.css';

interface Props {
    onClick: (e: React.MouseEvent) => void;
}

const CHECKOUT = "checkout"

export const CheckoutButton: React.FC<Props> = ({ onClick }) => {

    return (
        <div className='actionButton' onClick={(e) => onClick(e)} >
            <p className='actionButtonTitle'>{CHECKOUT.toUpperCase()}</p>
        </div>
    );
}