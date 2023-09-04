import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    async function login(username, password) {
        const body = {
            username: username,
            password: password
        };

        try {
            await axios.post(API_URL+"/api/auth/login", body);
            setUsername(username);
        }
        catch(err) {
            throw err;
        }
    }

    async function logout() {
        try {
            await axios.post(API_URL+"/api/auth/logout");
            setUsername(null);
            navigate('/login'); // Redirect back to login page
        }
        catch(err) {
            console.log(err);
        }
    }

    // This runs every time we refresh, or we enter a new page. 
    // Refreshes our auth info for use.
    useEffect(() => {
        setLoading(true);
        (async function() {
            try {
                const res = await axios.get(API_URL+"/api/auth/ping");
                if(!res.data.auth)
                    setUsername(null)
                else
                    setUsername(res.data.username)
            }
            catch(err) {
                handleError(err);
                setUsername(null);
                return false;
            }
            finally {
                setLoading(false);
            }
        })();
    }, [location]);

    return (
        <AuthContext.Provider value={{
                username,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
