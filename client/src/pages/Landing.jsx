import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function Landing() {

    const navigate = useNavigate();

    return (
        <>
            <br/><br/>
            <Button text='login' clickEvent={_=> navigate('/login')}/>
            <Button text='register' clickEvent={_=> navigate('/register')}/>
        </>
    );
}

export default Landing;