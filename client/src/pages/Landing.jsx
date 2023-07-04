import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import style from './Landing.module.css';

function Landing() {

    const navigate = useNavigate();

    return (
        <div className={style['landing-wrapper']}>
            <h1>ryflect</h1>
            <div className={style['button-wrapper']}>
                <Button text='login' clickEvent={_=> navigate('/login')}/>
                <Button text='register' clickEvent={_=> navigate('/register')}/>
            </div>
        </div>
    );
}

export default Landing;