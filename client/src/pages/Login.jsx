import { useState, useRef } from 'react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';

function Login() {

    const [username, setUsername] = useState('chris8787');
    const [password, setPassword] = useState('password');
    const { login } = useAuth();
    const navigate = useNavigate();

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const handleOffendingFields = (fields) => {
        if(fields.length === 0) {
            usernameInput.current.style.border = '1px solid black';
            usernameInput.current.style.border = '1px solid black';
        }

        if(fields.includes('username') && usernameInput.current)
            usernameInput.current.style.border = '1px solid red';
        if(fields.includes('password') && passwordInput.current)
            passwordInput.current.style.border = '1px solid red';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        usernameInput.current.style.border = '1px solid black';
        passwordInput.current.style.border = '1px solid black';
        
        try {
            await login(username, password);
            navigate('/');
        }
        catch(err) {
            const offendingFields = handleError(err);
            handleOffendingFields(offendingFields);
        }
    };

    const handleInput = (callback, ref) => {
        return (e) => {
            ref.current.style.border = '1px solid black';
            callback(e.target.value);
        }
    }

    return (
        <form>
            <div>
                <label>
                    username:
                    <br/>
                    <input ref={usernameInput} type='text' onChange={handleInput(setUsername, usernameInput)}></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input ref={passwordInput} type='text' onChange={handleInput(setPassword, passwordInput)}></input>
                </label>
            </div>
            <Button text='login' type='submit' clickEvent={handleSubmit}/>
        </form>
    );
}

export default Login;