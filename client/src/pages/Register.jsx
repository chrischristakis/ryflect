import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { API_URL } from '../config';

function Register() {

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [repassword, setRepassword] = useState();
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const repasswordInput = useRef();
    const passwordInput = useRef();
    const emailInput = useRef();
    const usernameInput = useRef();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!passwordsMatch)
            return alert('Passwords should match');

        const body = {
            username: username,
            password: password,
            email: email
        }

        try {
            await axios.post(API_URL + '/api/auth/register', body);
            console.log("Success!");
        }
        catch(err) {
            switch(err.response.status) {
                case 400:
                case 409:
                    const data = err.response.data;
                    for(const [field, errors] of Object.entries(data.error)) {
                        if(field.toLowerCase() === 'username')
                            usernameInput.current.style.border = '1px solid red';
                        if(field.toLowerCase() === 'password')
                            passwordInput.current.style.border = '1px solid red';
                        if(field.toLowerCase() === 'email')
                            emailInput.current.style.border = '1px solid red';
                        
                        alert(errors.join(', '));
                    }
                    break;
                default:
                    alert('Something went wrong on our end...');
                    break;
            }
        }
    }

    // We love currying in this house.
    const handleChange = (callback, ref) => {
        return (e) => {
            ref.current.style.border = '1px solid black';  // resets old bad input red box
            callback(e.target.value);
        };
    }

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