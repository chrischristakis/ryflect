import { useAuth} from '../contexts/AuthProvider';
import { ReactComponent as Loading } from '../assets/loading.svg';

// Simply allows us to redirect the user if they're not logged in; an authentication wrapper.
export function AuthRoute({ children, redirect }) {
    const { username, loading } = useAuth();

    if(loading)
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 90px)'}}>
                <Loading/>
            </div>
        );

    return (
        <>
            {username? children : redirect}
        </>
    );
}