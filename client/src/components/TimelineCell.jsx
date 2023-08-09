import { useRef, useState } from 'react';
import style from './TimelineCell.module.css';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { FaUnlock } from 'react-icons/fa';
import PopUp from './PopUp.jsx';
import Button from './Button';
import { getDate } from '../utils/utils';

const TOOLTIP_WIDTH = 190; //px

function TimelineCell({journalID, capsuleInfo, canCreateCapsule, isCurrentDay, date, containerRef}) {

    const [hideCapsulePopUp, setHideCapsulePopUp] = useState(true);
    const [hideSelectPopUp, setHideSelectPopUp] = useState(true);
    const [shakeLock, setShakeLock] = useState(false); // little animation

    // We're gonna need to access all of these DOM elements, store them in refs
    const tooltipText = useRef(null);
    const tooltip = useRef(null);
    const cell = useRef(null);
    const arrow = useRef(null);
    const navigate = useNavigate();

    const tooltipMouseEnter = (e) => {
        // Check if the tooltip is in the bounds of the div horizontally,
        // if it isn't, we'll nudge it.

        if(!tooltip.current || !containerRef.current || !tooltip.current)
            return;

        const textRef = tooltipText.current;
        const textBounds = textRef.getBoundingClientRect();
        const containerBounds = containerRef.current.getBoundingClientRect();

        if(textBounds.left <= containerBounds.left)
            textRef.style.marginLeft = `-${TOOLTIP_WIDTH/2 - (containerBounds.left - textBounds.left)}px`;
        if(textBounds.right >= containerBounds.right)
            textRef.style.marginLeft = `-${TOOLTIP_WIDTH/2 + (textBounds.right - containerBounds.right)}px`;

        tooltip.current.style.visibility = 'visible';
    }

    const tooltipMouseLeave = (e) => {
        if(!tooltip.current || !tooltip.current)
            return;

        tooltipText.current.style.marginLeft = `-${TOOLTIP_WIDTH/2}px`;  //  Resets margin so the MouseEnter logic works again.
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
    };

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
             onClick={clickCell}
             onMouseEnter={tooltipMouseEnter}
             onMouseLeave={tooltipMouseLeave}
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
            <div className={style['tooltip']} ref={tooltip}>
                <span 
                    className={style['tooltip-text']} 
                    style={{width: `${TOOLTIP_WIDTH}px`, marginLeft: `-${TOOLTIP_WIDTH/2}px`}}
                    ref={tooltipText}
                >
                {capsuleInfo?
                        <><em style={{color: '#FFBF00'}}>unlocks on:</em><br/>{getDate(date)}</>
                    :
                        getDate(date)
                }
                </span>
                <span ref={arrow} className={style['tooltip-arrow']}></span>
            </div>
        </div>
        </>
    );
}

export default TimelineCell;