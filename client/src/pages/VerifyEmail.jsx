import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthProvider';

function VerifyEmail() {

    const { id } = useParams();
    const { checkLoginCookie } = useAuth();
    const navigate = useNavigate();

    // So we don't try to verify multiple times
    const [callMade, setCallMade] = useState(false);

    useEffect(() => {
        if(id && !callMade) {
            setCallMade(true);
            (async function() {
                try {
                    await axios.get(API_URL + '/api/auth/verify/'+id);
                    checkLoginCookie() && navigate('/'); // Bring them to the home page now that they're authenticated
                }
                catch(err) {
                    console.log(err);
                }
            })();
        }
    }, [id, navigate, callMade, checkLoginCookie]);

    return (
        <div>
            <p>please wait a moment as you account becomes activated...</p>
        </div>
    );
}

export default VerifyEmail;