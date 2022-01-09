import React from 'react';
import '../App-Styles.css';

interface Props {
    total: string;
}

export const TotalDisplay: React.FC<Props> = ({ total }) => {
    return (
        <div id='totalDisplayWrapper' >
            <div className='totalRows'>
                <h3 className='totalTextColor'>Total:</h3>
            </div>
            <div className='totalRows'>
                <p className='totalTextColor' id='totalText'>{total}</p>
            </div>
        </div>
    )
}

