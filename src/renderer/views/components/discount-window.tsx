import React, { useState } from 'react';
import { useWindowSize } from '../../../../tools/custom-hooks/layout-hook';
import '../App-Styles.css';
import { SmallButton } from './small-button';
import * as conf from '../../../config/config';

interface Props {
    apply: (toApply: boolean, percentage?: number) => void;
}

type WindowPos = {
    top: string;
    left: string;
}

export const DiscountWindow: React.FC<Props> = ({ apply }) => {
    const [width, height] = useWindowSize();
    const [discount, setDiscount] = useState<number>(conf.DEFAULT_DISCOUNT)

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

    const onApply= (e: React.MouseEvent): void => {
        e.preventDefault();
        apply(true, discount);
    };

    const onCancel = (e: React.MouseEvent): void => {
        e.preventDefault();
        apply(false);
    }

    return (
        <div id="dc" className="discountWindow" style={getCurrentSize()}>
            <div id='discountBody'>
                <p className='discountBodyText' style={{fontSize: '1.5em'}}>Apply Discount?</p>
                <p className='discountBodyText'>{`Current default discount ${discount}%`}</p>
            </div>
            <div id='discountButtonRow'>
                <SmallButton title='no' onClick={(e) => onCancel(e)} /> 
                <SmallButton title='yes' onClick={(e) => onApply(e)} />
                
            </div> 
        </div>
    );


}