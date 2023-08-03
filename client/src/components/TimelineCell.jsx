import { useRef, useState } from 'react';
import style from './TimelineCell.module.css';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { FaUnlock } from 'react-icons/fa';
import PopUp from './PopUp.jsx';
import Button from './Button';
import { getDate } from '../utils/utils';

// Calculate the x distance from the arrow to the cell it belongs to
function getDistanceFromArrowToCell(arrowRef, cellRef) {
    const arrowBounds = arrowRef.getBoundingClientRect();
    const cellBounds = cellRef.getBoundingClientRect();
    return (cellBounds.left + cellBounds.width/2) - (arrowBounds.left + arrowBounds.width/2);
}

function TimelineCell({journalID, capsuleInfo, canCreateCapsule, isCurrentDay, date}) {

    const [hideCapsulePopUp, setHideCapsulePopUp] = useState(true);
    const [hideSelectPopUp, setHideSelectPopUp] = useState(true);
    const [shakeLock, setShakeLock] = useState(false); // little animation

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
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell(arrow.current, cell.current) - 15}px`;
        }
        if(tooltipBounds.right > window.innerWidth) {
            tooltip.current.style.marginLeft = `${-tooltipBounds.width/2 - (tooltipBounds.right - window.innerWidth)}px`;
            arrow.current.style.marginLeft = `${getDistanceFromArrowToCell(arrow.current, cell.current) - 15}px`;
        }

        tooltip.current.style.visibility = 'visible';
    }

    const tooltipMouseLeave = (e) => {
        tooltip.current.style.visibility = 'hidden';
    }

    const clickCell = (e) => {
        if(!journalID && !capsuleInfo && canCreateCapsule)
            return setHideCapsulePopUp(false);
        
        if(journalID && capsuleInfo)
            return setHideSelectPopUp(false);
        
        if(journalID)
            return navigate('/view/' + journalID);

        if(capsuleInfo && capsuleInfo.id && !capsuleInfo.locked)
            return navigate('/view/' + capsuleInfo.id);
    }

    const applyShakeAnim = () => {
        if(shakeLock) return;

        setShakeLock(true);
        setTimeout(() => {
            setShakeLock(false);
        }, 600);
    }

    return (
        <>
        <PopUp 
            hidden={hideCapsulePopUp} 
            setHiddenState={setHideCapsulePopUp}
        >
            <div className={style['create-capsule-popup']}>
                <p>Create a new time capsule entry on <br/><strong>{getDate(date)}</strong>?</p>
                <p><em>You won't be able to open it until then!</em></p>
                <Button text='create' 
                    clickEvent={(e) => {navigate(`/create?selectedYear=${date.getUTCFullYear()}&selectedDay=${date.getUTCDate()}&selectedMonth=${date.getUTCMonth()}`)}} 
                    lightButton={true}
                    slideHover={true}
                />
            </div>
        </PopUp>
        <PopUp 
            hidden={hideSelectPopUp} 
            setHiddenState={setHideSelectPopUp}
        >
            <div className={style['select-popup']}>
                <div className={style['select-popup-journal']} 
                     onClick={() => journalID && navigate('/view/'+journalID)}
                >
                    View Journal
                </div>
                <div className={style['select-popup-capsule']} 
                     onClick={() => capsuleInfo && navigate('/view/'+capsuleInfo.id)}
                >
                    View Capsule
                </div>
            </div>
        </PopUp>
        <div ref={cell}
             className={`${style.cell} 
                         ${journalID && style['journal-cell']}
                         ${shakeLock && style['shake-anim']}
                         ${isCurrentDay && style['current-cell']}`}
             onMouseEnter={tooltipMouseEnter}
             onMouseLeave={tooltipMouseLeave}
             onClick={clickCell}
        >
            {   // For time capsules only
                capsuleInfo && (
                    capsuleInfo.locked?
                    <FaLock 
                        size={14} color={journalID? 'white' : 'black'}
                        onClick={applyShakeAnim} 
                    />
                    :
                    <FaUnlock size={14} color={journalID? 'white' : 'black'}/>
                )
            }
            <span ref={tooltip} className={style['tooltip']}>
                <p>
                    {capsuleInfo? <><em style={{color: '#FFBF00'}}>unlocks on:</em><br/></> : null}
                    {getDate(date)}
                </p>
                <span ref={arrow} className={style['tooltip-arrow']}></span>
            </span>
        </div>
        </>
    );
}

export default TimelineCell;