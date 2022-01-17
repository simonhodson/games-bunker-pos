import { TransactionState } from '@src/ts-structures/types';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from '../../../../tools/custom-hooks/layout-hook';
import '../App-Styles.css';
import { SmallButton } from './small-button';

interface Props {
    receiptAction: (receipt: boolean) => void;
    transactionState: TransactionState
}

type WindowPos = {
    top: string;
    left: string;
}

export const ReceiptWindow: React.FC<Props> = ({ receiptAction, transactionState }) => {
    const [width, height] = useWindowSize();
    const [tState, setTState] = useState<TransactionState>('sending');

    useEffect(() => {
        setTState(transactionState);
    }, [transactionState])

    const getCurrentSize = (): WindowPos => {
        // TOOD: Add refs to dynamically change these values from CSS sheet
        // Left pane is 70% of window size, below width calc attempts to keep discount window central to left pane
        const thisHeight = 400;
        const thisWidth = 400;
        const t = (height - thisHeight) / 2;
        const l = ((width * 0.7) - thisWidth) / 2;
        return {
            top: `${t}px`,
            left: `${l}px`
        }
    }

    const onPress = (e: React.MouseEvent, receipt: boolean): void => {
        e.preventDefault();
        receiptAction(receipt);
    };

    return (
        <div id="dc" className="receiptWindow" style={getCurrentSize()}>
            <div id='discountBody'>
                {tState === 'sending' &&
                    (<p className='discountBodyText' style={{fontSize: '1.5em'}}>Please Wait</p>)
                }
                {tState === 'printing' &&
                    (<p className='discountBodyText' style={{fontSize: '1.5em'}}>Please Wait</p>)
                }
                {tState === 'completed' && <p className='discountBodyText' style={{fontSize: '1.5em'}}>Print Receipt?</p>}
            </div>
            <div id='discountButtonRow'>
                {tState === 'sending' && (
                    <p>SENDING.....</p>
                )}
                {tState === 'printing' && (
                    <p>PRINTING....</p>
                )}
                {tState === 'completed' && (
                    <>
                        <SmallButton title='no' onClick={(e) => onPress(e, false)} /> 
                        <SmallButton title='yes' onClick={(e) => onPress(e, true)} />
                    </>
                )}
            </div> 
        </div>
    );


}