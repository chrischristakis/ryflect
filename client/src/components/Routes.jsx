import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { ReactComponent as Loading } from '../assets/loading.svg';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children, redirect }) {
    const { isAuthenticated } = useAuth();
    const [authed, setAuthed] = useState({valid: false, loading: true});

    useEffect(() => {
        (async function() {
            if(await isAuthenticated()) {
                setAuthed({valid: true, loading: false});
            }
            else
                setAuthed({valid: false, loading: false});
        })();

        return () => {
            setAuthed({valid: false, loading: true});
        };
    }, [isAuthenticated]);

    if(authed.loading)
        return <Loading/>

    return (
        <>
            {authed.valid? children : redirect}
        </>
    );
}