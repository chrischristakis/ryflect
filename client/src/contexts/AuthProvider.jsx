import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [jwt, setJwt] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);

    async function login(username, password) {
        const body = {
            username: username,
            password: password
        };

        try {
            let response = await axios.post(API_URL+"/api/auth/login", body);
            setJwt(response.data);
            setLoggedIn(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    function logout() {
        setJwt(null);
        setLoggedIn(false);
    }

    function loginJwt(_jwt) {
        setJwt(_jwt)
        setLoggedIn(true)
    }

    return (
        <AuthContext.Provider value={{
                jwt, 
                loggedIn, 
                login,
                loginJwt, 
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
