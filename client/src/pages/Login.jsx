import Button from '../components/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login('chris8787', 'password');
        navigate('/');
    };

    return (
        <form>
            <div>
                <label>
                    username:
                    <br/>
                    <input type='text'></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input type='text'></input>
                </label>
            </div>
            <Button text='login' type='submit' clickEvent={handleSubmit}/>
        </form>
    );
}

export default Login;