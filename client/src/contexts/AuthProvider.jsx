import { createContext, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();
    
    // Check if we have a jwt cookie present, if so assume we're logged in already
    function checkLoginCookie() {        
        return Cookies.get('jwt') !== undefined;
    }

    // Get the cookie containing the username that is sent with the JWT cookie
    function getUsernameCookie() {
        const username = Cookies.get('username');
        return username? username : 'undefined';
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
                checkLoginCookie,
                getUsernameCookie,
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