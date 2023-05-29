import { useRef } from 'react';
import style from './TimelineCell.module.css';
import { useNavigate } from 'react-router-dom';

// Calculate the x distance from the arrow to the cell it belongs to
function getDistanceFromArrowToCell(arrowRef, cellRef) {
    const arrowBounds = arrowRef.getBoundingClientRect();
    const cellBounds = cellRef.getBoundingClientRect();
    return (cellBounds.left + cellBounds.width/2) - (arrowBounds.left + arrowBounds.width/2);
}

function TimelineCell({journalId, isCurrentDay, date}) {

    // We're gonna need to access all of these DOM elements, store them in refs
    const tooltip = useRef(null)
    const cell = useRef(null);
    const arrow = useRef(null);
    const navigate = useNavigate();

    const tooltipMouseEnter = (e) => {
    
        // Make sure tooltip cannot leave the screen bounds
        const tooltipBounds = tooltip.current.getBoundingClientRect();

        if(tooltipBounds.left < 0) {
            tooltip.current.style.marginLeft = `${-tooltipBounds.width/2 - tooltipBounds.left}px`;

            // Since tooltip is locked in place, arrow must attach to the cell the cursor is actually on
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell(arrow.current, cell.current) - 10}px`;
        }
        if(tooltipBounds.right > window.innerWidth) {
            tooltip.current.style.marginLeft = `${-tooltipBounds.width/2 - (tooltipBounds.right - window.innerWidth)}px`;
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell(arrow.current, cell.current) - 10}px`;
        }

        tooltip.current.style.visibility = 'visible';
    }

    const tooltipMouseLeave = (e) => {
        tooltip.current.style.visibility = 'hidden';
    }

    const clickCell = (e) => {
        if(!journalId)
            return;
        
        navigate('/view/'  + journalId);
    }

    return (
        <div ref = {cell}
             className={`${style.cell} 
                         ${journalId && style['active-cell']} 
                         ${isCurrentDay && style['current-cell']}`}
             onMouseEnter={tooltipMouseEnter}
             onMouseLeave={tooltipMouseLeave}
             onClick={clickCell}
        >
            <span ref={tooltip} className={style['tooltip']}>
                <p>{date}</p>
                <span ref={arrow} className={style['tooltip-arrow']}></span>
            </span>
        </div>
    );
}

export default TimelineCell;