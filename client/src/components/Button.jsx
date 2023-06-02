import { useState } from 'react';

function Button({text="placeholder", clickEvent=async ()=>{}, type='button', cooldown=0}) {

    const [loading , setLoading] = useState(false);

    const doneLoadingWithCooldown = () => {
        if(cooldown <= 0)
            return setLoading(false);
        
        setTimeout(() => {
            setLoading(false);
        }, cooldown);
    }

    const handleClick = async (e) => {
        setLoading(true);
        try {
            await clickEvent(e);
            doneLoadingWithCooldown();
        }
        catch(err) {
            doneLoadingWithCooldown();
        }
    };

    return (
        <button onClick={handleClick} type={type} disabled={loading}>{text}</button>
    );
}

export default Button;