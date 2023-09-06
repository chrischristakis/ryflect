import style from './PopUp.module.css';
import { RxCross1 } from 'react-icons/rx';
import { lightTheme } from '../utils/Constants.js';

function PopUp({children, hidden=true, setHiddenState=()=>{}, exitColor=lightTheme.primary}) {
    if(hidden)
        return;

    const handleClickOut = (e) => {
        setHiddenState(true);
    }

    return (
        <div className={style['screen-wrapper']} onClick={handleClickOut}>
            <div className={style['popup-wrapper']}
                 onClick={(e) => {e.stopPropagation() /*dont listen to upper div click event*/}}
            >
                <button onClick={handleClickOut} className={style['exit-button']}><RxCross1 size={28} color={exitColor}/></button>
                {children}
            </div>
        </div>
    );
}

export default PopUp;