import { useAuth } from '../contexts/AuthProvider';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children, redirect }) {
    const { checkLoginCookie } = useAuth();
    
    return (
        <>
            {checkLoginCookie()? children : redirect}
        </>
    );
}