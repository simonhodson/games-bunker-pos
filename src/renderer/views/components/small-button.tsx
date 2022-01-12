import React from 'react'
import '../App-Styles.css';

interface Props {
    title: string;
    onClick: (e: React.MouseEvent) => void
    type: 'apply' | 'cancel';
}

export const SmallButton: React.FC<Props> = ({ title, type, onClick }) => {
    return(
        <div onClick={(e) => onClick(e)} className='smallButton'>
            <p>{title}</p>
        </div>
    );
}