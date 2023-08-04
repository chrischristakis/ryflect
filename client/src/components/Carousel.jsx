import { useEffect, useState } from 'react';
import style from './Carousel.module.css';

// TODO:
/*
    - Animate snapping
*/

function Carousel({values=[], cellWidth=50, cellHeight=50, cellGap=30, initialIndex=0, indexChangeCallback=()=>{}}) {

    const [currIndex, setCurrIndex] = useState(initialIndex);
    const [selectedOffset, setSelectedOffset] = useState(0);

    // To center an even number of children
    const evenBias = (values.length % 2 === 0)? (cellWidth + cellGap) : 0;
    const widthOfCellPlusGap = ((cellWidth + cellGap)*2);
    const centerIndex = Math.floor(values.length / 2);  // Index of the middle element of the list

    useEffect(() => {
        // Center the children at the selected index. 
        const offsetToCenterSelectedIndex = widthOfCellPlusGap * (centerIndex - currIndex - ((values.length % 2 === 0)? 1 : 0));

        setSelectedOffset(offsetToCenterSelectedIndex);
    }, [currIndex, values.length, centerIndex, widthOfCellPlusGap]);

    return (
        <div 
            className={style.carousel} 
            style={{columnGap: `${cellGap}px`}}
        >
            {values.map((value, index) => {
                let offset = 0;
                if(index === 0)  // Our leftmost child will act as our base for our offset
                    offset = `${evenBias + selectedOffset}px`;

                return (
                    <div 
                        key={index} 
                        className={`${style['carousel-item']} ${index === currIndex? style['selected-item'] : null}`} 
                        style={{marginLeft: offset, 
                            minWidth: `${cellWidth}px`, maxWidth: `${cellWidth}px`, 
                            minHeight: `${cellHeight}px`, maxHeight: `${cellHeight}px`}}
                        onClick={() => {
                            setCurrIndex(index);
                            indexChangeCallback(index);
                        }}
                    >
                        {value}
                    </div>
                );
            })}
        </div>
    );
}

export default Carousel;