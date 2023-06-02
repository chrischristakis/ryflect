import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthProvider';

function VerifyEmail() {

    const { id } = useParams();
    const { loginJwt, loggedIn } = useAuth();
    const navigate = useNavigate();

    const [callMade, setCallMade] = useState(false);

    useEffect(() => {
        if(id && !callMade) {
            setCallMade(true);
            (async function() {
                try {
                    const res = await axios.get(API_URL + '/api/auth/verify/'+id);
                    loginJwt(res.data);
                }
                catch(err) {
                    console.log(err);
                }
            })();
        }
    }, [id, navigate, loginJwt, callMade]);

    useEffect(() => {
        loggedIn && navigate('/') // Bring them to the home page now that they're authenticated
    }, [loggedIn, navigate])

    return (
        <div>
            <p>thanks :) you'll be redirected shortly. If not, please click <Link to='/'>here</Link></p>
        </div>
    );
}

export default VerifyEmail;