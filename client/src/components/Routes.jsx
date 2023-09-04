import { useAuth} from '../contexts/AuthProvider';
import { ReactComponent as Loading } from '../assets/loading.svg';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children, redirect }) {
    const { username, loading } = useAuth();

    if(loading)
        return <Loading/>;

    return (
        <>
            {username? children : redirect}
        </>
    );
}