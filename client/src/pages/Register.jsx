import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import PopUp from '../components/PopUp';
import axios from 'axios';
import { API_URL } from '../config';
import { handleError } from '../utils/HandleResponse';
import { toast } from 'react-toastify';
import useForm from '../hooks/useForm';
import style from './Register.module.css';
import Input from '../components/Input';
import {IoIosCheckmarkCircleOutline} from 'react-icons/io';
import { lightTheme } from '../utils/Constants';

function Register() {

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [awaitVerify, setAwaitVerify] = useState();
    const [verificationId, setVerificationId] = useState();
    const [resendDisabled, setResendDisabled] = useState(false);
    const [hideConfirm, setHideConfirm] = useState(true);

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

    useEffect(() => {
        document.title = `ryflect | register`;
    }, []);

    // Check if passwords match whenever they change
    useEffect(() => {
        if(!repasswordInput.current || !passwordInput.current)  // Refs aren't properly set.
            return;

        if(!form.data.password.value || !form.data.repassword.value) {
            form.defaultField(form.data.repassword)
            return;
        }

        if(form.data.password.value !== form.data.repassword.value) {
            setPasswordsMatch(false);
            form.offendingField(form.data.repassword)
        }
        else {
            setPasswordsMatch(true);
            form.defaultField(form.data.repassword)
        }
    }, [form.data.password.value, form.data.repassword.value, form]);

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
    }

    // If user registered and is waiting verification, show them this instead pf the registration form
    if(awaitVerify)
        return (
            <div className={style['await-verification-wrapper']}>
                <IoIosCheckmarkCircleOutline size={100} fill={lightTheme.primary}/>
                <p>please check your inbox for a verification email from us</p>
                <p><strong><em>if you did not get an email, please check your spam folder.</em></strong></p>
                <button className={style['resend-button']} onClick={resendEmail} disabled={resendDisabled}>resend email</button>
            </div>
        );

    return (
        <>
        <PopUp
            hidden={hideConfirm}
            setHiddenState={setHideConfirm}
        >
            <div className={style['confirm-popup-wrapper']}>
                <p><strong>Please remember your password, there's no way to recover it if it's lost!</strong></p>
                <p><em>We cannot help recover journals from an account with a lost password.</em></p>
                <Button text={"got it!"} clickEvent={handleSubmit} lightButton={true} slideHover={true}/>
            </div>
        </PopUp>
        <div className={style['register-wrapper']}>
            <h2>register</h2>
            <div className={style['input-wrapper']}>
                <Input
                    label='username:'
                    name='username' 
                    ref={usernameInput} 
                    type='text' 
                    onChange={form.handleDataChange}
                />
                <Input
                    label='email:'
                    name='email' 
                    ref={emailInput} 
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
                <Input
                    label='confirm password:'
                    name='repassword' 
                    ref={repasswordInput} 
                    type='password'
                    onChange={form.handleDataChange}
                />
            </div>
            <Button text='register' type='submit' clickEvent={() => {
                    if(!passwordsMatch)
                        return toast.error('Passwords do not match.', {position: 'top-center'});
                    setHideConfirm(false);
                }}
            />
        </div>
        </>
    );
}

export default Register;