import { useAuth } from '../contexts/AuthProvider';
import { useEffect, useState } from 'react';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children, redirect }) {
    const { loggedIn, refreshLogin } = useAuth();
    const [loading, setLoading] = useState(true);

    // If we're not already logged in, check if we have cookie stored and we can authenticate ourselves.
    useEffect(() => {
        if(!loggedIn) {
            (async () => {
                await refreshLogin();
                setLoading(false);
            } )();
        }
        else
            setLoading(false);  
    }, [loggedIn, refreshLogin, loading]);

    if(loading)
        return <div>Loading...</div>;

    return (
        <>
            {loggedIn? children : redirect}
        </>
    );
}