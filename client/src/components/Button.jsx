import { useState } from 'react';
import { ReactComponent as Loading } from '../assets/loading.svg';
import style from './Button.module.css';
import { lightTheme } from '../utils/Constants.js';

function Button({text="placeholder", clickEvent=async ()=>{}, type='button', disabled=false, lightButton=false, slideHover=false, fillContainer=false}) {

    const [loading , setLoading] = useState(false);

    const handleClick = async (e) => {
        setLoading(true);
        try {
            //await new Promise(resolve => setTimeout(resolve, 2000)); //For throttle testing
            await clickEvent(e);
            setLoading(false);
        }
        catch(err) {
            // This should be caught in our click event, however, we could move it here.
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <button className={`
                ${style.button} 
                ${lightButton? style.light : style.normal} 
                ${slideHover && style['slide-hover']} 
                ${fillContainer && style['fill-container']}`
            } 
            onClick={handleClick} 
            type={type} 
            disabled={loading || disabled}
        >
            {loading? 
                <Loading fill={lightButton? lightTheme.primary : lightTheme.secondary}/> 
                : 
                text
            }
        </button>
    );
}

export default Button;