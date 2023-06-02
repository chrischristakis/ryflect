import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState('chris8787');
    const [password, setPassword] = useState('password');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await login(username, password);
            navigate('/');
        }
        catch(err) {
            console.log(err);
        }
    };

    const handleInput = (callback) => {
        return (e) => {
            callback(e.target.value);
        }
    }

    return (
        <form>
            <div>
                <label>
                    username:
                    <br/>
                    <input type='text' onChange={handleInput(setUsername)}></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input type='text' onChange={handleInput(setPassword)}></input>
                </label>
            </div>
            <Button text='login' type='submit' clickEvent={handleSubmit}/>
        </form>
    );
}

export default Login;