import React from 'react';
import '../App-Styles.css';

interface Props {
    title: string;
}

export const Banner: React.FC<Props> = ({ title }) => {
    return (
        <div className='banner'>
            <h3>{title}</h3>
        </div>
    )
}