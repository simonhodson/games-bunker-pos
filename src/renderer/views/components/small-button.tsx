import React from 'react'
import '../App-Styles.css';

interface Props {
    title: string;
    onClick: (e: React.MouseEvent) => void
}

export const SmallButton: React.FC<Props> = ({ title, onClick }) => {
    return(
        <div onClick={(e) => onClick(e)} className='smallButton'>
            <p>{title}</p>
        </div>
    );
}