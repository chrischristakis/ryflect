import { useEffect, useRef } from 'react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';
import useForm from '../hooks/useForm';
import style from './Login.module.css';

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const form = useForm({
        username: {
            value: 'chris8787',
            ref: usernameInput
        },
        password: {
            value: 'password',
            ref: passwordInput
        },
    });
    
    useEffect(() => {
        document.title = `ryflect | login`;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        form.resetFieldsStyle();

        try {
            await login(form.data['username'].value, form.data['password'].value);
            navigate('/');
        }
        catch(err) {
            const offendingFields = handleError(err);
            form.handleOffendingFields(offendingFields);
        }
    };

    return (
        <div className={style['login-wrapper']}>
            <div>
                <label>
                    username:
                    <br/>
                    <input name='username' ref={usernameInput} type='text' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input name='password' ref={passwordInput} type='password' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <br/>
            <Button text='login' type='submit' clickEvent={handleSubmit}/>
        </div>
    );
}

export default Login;