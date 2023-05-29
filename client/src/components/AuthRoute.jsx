import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
function AuthRoute({ children }) {
    const { loggedIn } = useAuth();

    return (
        <>
            {loggedIn? children : <Navigate to='/login'/>}
        </>
    );
}

export default AuthRoute;