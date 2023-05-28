import { useRef } from 'react';
import style from './TimelineCell.module.css';

function TimelineCell({active, isCurrentDay, date}) {

    // We're gonna need to access all of these DOM elements, store them in refs
    const tooltip = useRef(null)
    const cell = useRef(null);
    const arrow = useRef(null);

    const tooltipMouseEnter = (e) => {
    
        // Make sure tooltip cannot leave the screen bounds
        const tooltipBounds = tooltip.current.getBoundingClientRect();
        
        // Calculate the x distance from the arrow to the cell it belongs to
        function getDistanceFromArrowToCell() {
            const arrowBounds = arrow.current.getBoundingClientRect();
            const cellBounds = cell.current.getBoundingClientRect();
            return (cellBounds.left + cellBounds.width/2) - (arrowBounds.left + arrowBounds.width/2);
        }

        if(tooltipBounds.left < 0) {
            tooltip.current.style.marginLeft = `${-tooltipBounds.width/2 - tooltipBounds.left}px`;

            // Since tooltip is locked in place, arrow must attach to the cell the mouse is actually on
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell() - 10}px`;
        }
        if(tooltipBounds.right > window.innerWidth) {
            tooltip.current.style.marginLeft = `${-tooltipBounds.width/2 - (tooltipBounds.right - window.innerWidth)}px`;
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell() - 10}px`;
        }

        tooltip.current.style.visibility = 'visible';
    }

    const tooltipMouseLeave = (e) => {
        tooltip.current.style.visibility = 'hidden';
    }

    return (
        <div ref = {cell}
             className={`${style.cell} 
                         ${active && style['active-cell']} 
                         ${isCurrentDay && style['current-cell']}`}
             onMouseEnter={tooltipMouseEnter}
             onMouseLeave={tooltipMouseLeave}
        >
            <span ref={tooltip} className={style['tooltip']}>
                {date}
                <span ref={arrow} className={style['tooltip-arrow']}></span>
            </span>
        </div>
    );
}

export default TimelineCell;