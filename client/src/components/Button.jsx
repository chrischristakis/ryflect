import { useEffect, useState } from 'react';
import { ReactComponent as Loading } from '../assets/loading.svg';
import style from './Button.module.css';

function Button({text="placeholder", clickEvent=async ()=>{}, type='button', disabled=false, shouldConfirm=false}) {

    const [loading , setLoading] = useState(false);
    const [displayConfirm, setDisplayConfirm] = useState(false);

    // After 5 seconds, if they havent confirmed, reset button.
    useEffect(() => {
        if(!displayConfirm) 
            return;

        setTimeout(() => {
            if(displayConfirm)
                setDisplayConfirm(false);
        }, 4000);
    }, [displayConfirm, setDisplayConfirm])

    const handleClick = async (e) => {
        if(shouldConfirm && !displayConfirm) {
            setDisplayConfirm(true);
            return;
        }

        setLoading(true);
        try {
            //await new Promise(resolve => setTimeout(resolve, 5000)); //For throttle testing
            await clickEvent(e);
            setLoading(false);
        }
        catch(err) {
            // This should be caught in our click event, however, we could move it here.
        }
        finally {
            setDisplayConfirm(false);
            setLoading(false);
        }
    };

    return (
        <button className={`${style.button} ${displayConfirm? style.confirm : style.normal}`} onClick={handleClick} type={type} disabled={loading || disabled}>
            {loading? 
                <Loading fill='white'/> 
                : 
                displayConfirm ? 
                    'you sure?'
                    :
                    text
            }
        </button>
    );
}

export default Button;