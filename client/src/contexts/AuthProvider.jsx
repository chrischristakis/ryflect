import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [loggedIn, setLoggedIn] = useState(false);

    // ping the server with our cookie to see if we can log in.
    async function refreshLogin() {        
        try {
            await axios.get(API_URL+"/api/auth/ping");
            setLoggedIn(true);
        }
        catch(err) {
            setLoggedIn(false);
        }
    }

    async function login(username, password) {
        const body = {
            username: username,
            password: password
        };

        try {
            await axios.post(API_URL+"/api/auth/login", body);
            setLoggedIn(true);
        }
        catch(err) {
            throw err;
        }
    }

    function logout() {
        // TODO: clear cookie
        setLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{
                refreshLogin,
                loggedIn,
                login,
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
