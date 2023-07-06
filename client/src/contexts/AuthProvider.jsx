import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    
    // Check if we have a jwt cookie present, if so assume we're logged in already
    async function isAuthenticated() { 
        try {
            const res = await axios.get(API_URL+"/api/auth/ping");
            if(!res.data.auth) {
                setUsername(null)
                return false;
            }
            setUsername(res.data.username)
            return true;
        }
        catch(err) {
            handleError(err);
            setUsername(null);
            return false;
        }
    }

    async function login(username, password) {
        const body = {
            username: username,
            password: password
        };

        try {
            await axios.post(API_URL+"/api/auth/login", body);
        }
        catch(err) {
            throw err;
        }
    }

    async function logout() {
        // TODO: clear cookie with express call
        try {
            await axios.post(API_URL+"/api/auth/logout");
            navigate('/login'); // Redirect back to login page
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{
                isAuthenticated,
                username,
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
