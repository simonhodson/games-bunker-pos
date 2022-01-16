import React from 'react';
import '../App-Styles';
import { useState } from 'react';

interface Props {
    type: string;
    value: number;
    onClick: (itemCode: string) => void;
}

export const UniqueListItem: React.FC<Props> = ({ type, onClick, value })  => {
    const [title, setTitle] = useState<string>('Discount Applied');
    return (
        <div className='listItemWrapper' onClick={() => onClick(type)} >
            <h3>{`${title} - ${value}%`}</h3>
        </div>
    );
}
