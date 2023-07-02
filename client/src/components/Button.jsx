import { useState } from 'react';
import { ReactComponent as Loading } from '../assets/loading.svg';

function Button({text="placeholder", clickEvent=async ()=>{}, type='button', disabled=false}) {

    const [loading , setLoading] = useState(false);

    const handleClick = async (e) => {
        setLoading(true);
        try {
            //await new Promise(resolve => setTimeout(resolve, 5000)); For throttle testing
            await clickEvent(e);
            setLoading(false);
        }
        catch(err) {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleClick} type={type} disabled={loading || disabled}>
            {loading? <Loading/> : text}
        </button>
    );
}

export default Button;