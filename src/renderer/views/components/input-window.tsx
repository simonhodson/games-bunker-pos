import { Event } from 'electron';
import React, { InputHTMLAttributes, useState } from 'react';
import '../App-Styles';

const BARCODE_THRESHOLD_VAL = 5;

interface Props {
    onSubmitProp: (value: string) => void;
    forwardRef: React.RefObject<HTMLInputElement>
}

export const InputWindow: React.FC<Props> = ({ onSubmitProp, forwardRef }) => {
    const [capt, setCapt] = useState<string>('');

    const handleScannerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCapt(e.target.value);
        e.preventDefault();
    }

    const scannerOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (capt.length < BARCODE_THRESHOLD_VAL) return;
        e.preventDefault();
        // Return a value to be used in component
        onSubmitProp(capt);
        // Clear window
        setCapt('');
    }

    return (
        <div className='inputWindow'>
            <form onSubmit={e => scannerOnSubmit(e)} >
                <input onChange={(e) => handleScannerInput(e)} value={capt} autoFocus={true} ref={forwardRef} />
            </form>
        </div>
    )
}