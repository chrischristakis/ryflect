import { useEffect, useRef } from 'react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';
import useForm from '../hooks/useForm';
import style from './Login.module.css';
import Input from '../components/Input';

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const form = useForm({
        username: {
            value: '',
            ref: usernameInput
        },
        password: {
            value: '',
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
            <h2>login</h2>
            <div className={style['input-wrapper']}>
                <Input
                    label='username:'
                    name='username' 
                    ref={usernameInput} 
                    type='text' 
                    onChange={form.handleDataChange}
                />
                <Input
                    label='password:'
                    name='password'
                    ref={passwordInput} 
                    type='password'
                    onChange={form.handleDataChange}
                />
            </div>
            <Button text='login' type='submit' clickEvent={handleSubmit}/>
        </div>
    );
}

export default Login;