import React from 'react';
import { useWindowSize } from '../../../../tools/custom-hooks/layout-hook';

interface Props {
    onClick: (e: React.MouseEvent) => void;
}

type WindowPos = {
    top: string;
    left: string;
}

export const DiscountWindow: React.FC<Props> = ({ onClick }) => {
    const [width, height] = useWindowSize();

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

    return (
        <div id="dc" className="discountWindow" style={getCurrentSize()}>
            <p>{height}</p>
            <p>{width}</p>
        </div>
    );


}