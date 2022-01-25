import { Event } from 'electron';
import React, { useState } from 'react';
import '../App-Styles';

interface Props {
    onSubmitProp: (value: string) => void;
}

export const InputWindow: React.FC<Props> = ({ onSubmitProp }) => {
    const [capt, setCapt] = useState<string>('');

    const handleScannerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCapt(e.target.value);
        e.preventDefault();
    }

    const scannerOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Return a value to be used in component
        onSubmitProp(capt);
        // Clear window
        setCapt('');
    }

    return (
        <div className='inputWindow'>
            <form onSubmit={e => scannerOnSubmit(e)} >
                <input onChange={(e) => handleScannerInput(e)} value={capt} autoFocus={true}/>
            </form>
        </div>
    )
}