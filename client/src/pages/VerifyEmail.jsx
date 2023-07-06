import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_URL } from '../config';

function VerifyEmail() {

    const { id } = useParams();
    const navigate = useNavigate();

    // So we don't try to verify multiple times
    const [callMade, setCallMade] = useState(false);
    
    const [invalidLink, setInvalidLink] = useState(false);

    useEffect(() => {
        if(id && !callMade) {
            setCallMade(true);
            (async function() {
                try {
                    await axios.get(API_URL + '/api/auth/verify/'+id);
                    navigate('/'); // Bring them to the home page now that they're authenticated
                }
                catch(err) {
                    setInvalidLink(true);
                }
            })();
        }
    }, [id, navigate, callMade]);

    return (
        <div>
            {
            (!invalidLink)? 
                <p>please wait a moment as we activate your account...</p>   
            :
                <p>This link is no longer valid. Please try <Link to='/register'>registering</Link> again.</p>  
            }
        </div>
    );
}

export default VerifyEmail;