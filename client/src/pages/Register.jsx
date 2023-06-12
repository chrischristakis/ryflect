import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { API_URL } from '../config';
import { handleError } from '../utils/HandleResponse';
import { toast } from 'react-toastify';

function Register() {

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [repassword, setRepassword] = useState();
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [awaitVerify, setAwaitVerify] = useState();
    const [verificationId, setVerificationId] = useState();

    const repasswordInput = useRef();
    const passwordInput = useRef();
    const emailInput = useRef();
    const usernameInput = useRef();

    // Check if passwords match whenever they change
    useEffect(() => {
        if(!password || !repassword) {
            repasswordInput.current.style.border = '1px solid black';
            return;
        }

        if(password !== repassword) {
            setPasswordsMatch(false);
            repasswordInput.current.style.border = '1px solid red';
        }
        else {
            setPasswordsMatch(true);
            repasswordInput.current.style.border = '1px solid green';
        }
    }, [password, repassword]);

    const handleOffendingFields = (fields) => {
        if(fields.length === 0) {
            passwordInput.current.style.border = '1px solid black';
            usernameInput.current.style.border = '1px solid black';
            repasswordInput.current.style.border = '1px solid black';
            emailInput.current.style.border = '1px solid black';
        }

        if(fields.includes('username') && usernameInput.current)
            usernameInput.current.style.border = '1px solid red';
        if(fields.includes('password') && passwordInput.current)
            passwordInput.current.style.border = '1px solid red';
        if(fields.includes('email') && passwordInput.current)
            emailInput.current.style.border = '1px solid red';
        if(fields.includes('repassword') && passwordInput.current)
            repasswordInput.current.style.border = '1px solid red';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!passwordsMatch)
            return toast.error('Passwords do not match.', {position: 'top-center'});

        const body = {
            username: username,
            password: password,
            email: email
        }

        try {
            const response = await axios.post(API_URL + '/api/auth/register', body);
            setVerificationId(response.data);
            setAwaitVerify(true);
        }
        catch(err) {
            const offendingFields = handleError(err);
            handleOffendingFields(offendingFields);
        }
    }

    // We love currying in this house.
    const handleChange = (callback, ref) => {
        return (e) => {
            ref.current.style.border = '1px solid black';  // incase input box is red
            callback(e.target.value);
        };
    }

    const resendEmail = async () => {
        try {
            await axios.get(API_URL+'/api/auth/resend/'+verificationId);
        }
        catch(err) {
            handleError(err);
        }
    }

    // If user registered and is waiting verification, show them this instead
    if(awaitVerify)
        return (
            <div>
                <p>please check your inbox for a verification email from us, and you’ll be on your way!</p>
                <Button text='Resend email' clickEvent={resendEmail} cooldown={20000}></Button>
            </div>
        );

    return (
        <form>
            <div>
                <label>
                    username:
                    <br/>
                    <input ref={usernameInput} type='text' onChange={handleChange(setUsername, usernameInput)}></input>
                </label>
            </div>
            <div>
                <label>
                    email:
                    <br/>
                    <input ref={emailInput} type='text' onChange={handleChange(setEmail, emailInput)}></input>
                </label>
            </div>
            <div>
                <label>
                    password:
                    <br/>
                    <input ref={passwordInput} type='text' onChange={handleChange(setPassword, passwordInput)}></input>
                </label>
            </div>
            <div>
                <label>
                    re-enter password:
                    <br/>
                    <input ref={repasswordInput} type='text' onChange={handleChange(setRepassword, repasswordInput)}></input>
                </label>
            </div>
            <Button text='register' type='submit' clickEvent={handleSubmit}/>
        </form>
    );
}

export default Register;