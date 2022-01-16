import React, { useState, useEffect } from 'react';
import '../App-Styles.css';
import { ActionTypes } from '../../../ts-structures/types';

interface Props {
    onClick: (e: React.MouseEvent, type: ActionTypes) => void;
    title: string;
    type: ActionTypes;
    disbaled?: boolean;
}

export const GenericButton: React.FC<Props> = ({onClick, title, type, disbaled}) => {

    return (
        <div
            className='actionButton'
            onClick={(e) => {
                if (disbaled) return
                onClick(e, type)
            }}
        >
            <p className='actionButtonTitle'>{title.toUpperCase()}</p>
        </div>
    );
}