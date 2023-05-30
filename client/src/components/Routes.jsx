import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import Home from '../pages/Home';
import Landing from '../pages/Landing';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children }) {
    const { loggedIn } = useAuth();

    return (
        <>
            {loggedIn? children : <Navigate to='/login'/>}
        </>
    );
}

// A mouthful, but all it does is let us decide whether '/' points to the home page or landing page,
// depending on if the user is logged in.
export function HomeLandingSelector() {
    const { loggedIn } = useAuth();

    return (
        <>
            {loggedIn? <Home/> : <Landing/>}
        </>
    );
}