import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { API_URL } from '../config';
import { handleError } from '../utils/HandleResponse';
import { toast } from 'react-toastify';
import useForm from '../hooks/useForm';
import style from './Register.module.css';

function Register() {

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [awaitVerify, setAwaitVerify] = useState();
    const [verificationId, setVerificationId] = useState();
    const [resendDisabled, setResendDisabled] = useState(false);

    const repasswordInput = useRef(null);
    const passwordInput = useRef(null);
    const emailInput = useRef(null);
    const usernameInput = useRef(null);

    const form = useForm({
        username: {
            value: '',
            ref: usernameInput
        },
        email: {
            value: '',
            ref: emailInput
        },
        password: {
            value: '',
            ref: passwordInput
        },
        repassword: {
            value: '',
            ref: repasswordInput
        },
    });

    // Check if passwords match whenever they change
    useEffect(() => {
        if(!repasswordInput.current || !passwordInput.current)  // Refs aren't properly set.
            return;

        if(!form.data.password.value || !form.data.repassword.value) {
            repasswordInput.current.style.border = '1px solid black';
            return;
        }

        if(form.data.password.value !== form.data.repassword.value) {
            setPasswordsMatch(false);
            repasswordInput.current.style.border = '1px solid red';
        }
        else {
            setPasswordsMatch(true);
            repasswordInput.current.style.border = '1px solid black';
        }
    }, [form.data.password.value, form.data.repassword.value]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        form.resetFieldsStyle();

        if(!passwordsMatch)
            return toast.error('Passwords do not match.', {position: 'top-center'});

        const body = {
            username: form.data.username.value,
            password: form.data.password.value,
            email: form.data.email.value
        }

        try {
            const response = await axios.post(API_URL + '/api/auth/register', body);
            setVerificationId(response.data);
            setAwaitVerify(true);
        }
        catch(err) {
            const offendingFields = handleError(err);
            form.handleOffendingFields(offendingFields);
        }
    }

    const resendEmail = async (e) => {
        setResendDisabled(true);
        try {
            await axios.get(API_URL+'/api/auth/resend/'+verificationId);
            toast.success('Email sent!', {position: 'top-center'});
        }
        catch(err) {
            handleError(err);
        }
        finally {
            setTimeout(() => {
                setResendDisabled(false);
            }, 12000);
        }
    }

    // If user registered and is waiting verification, show them this instead pf the registration form
    if(awaitVerify)
        return (
            <div className={style['await-verification-wrapper']}>
                <p>please check your inbox for a verification email from us, and you’ll be on your way!</p>
                <button onClick={resendEmail} disabled={resendDisabled}>resend email</button>
            </div>
        );

    return (
        <div className={style['register-wrapper']}>
            <div>
                <label>
                    username:
                    <br/>
                    <input name='username' ref={usernameInput} type='text' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <div>
                <label>
                    email:
                    <br/>
                    <input name='email' ref={emailInput} type='text' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input name='password' ref={passwordInput} type='password' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <div>
                <label>
                    re-enter password:
                    <br/>
                    <input name='repassword' ref={repasswordInput} type='password' onChange={form.handleDataChange}></input>
                </label>
            </div>
            <br/>
            <Button text='register' type='submit' clickEvent={handleSubmit}/>
        </div>
    );
}

export default Register;