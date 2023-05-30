import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

function Home() {

    const [journalIDs, setJournalIDs] = useState({});
    const navigate = useNavigate();
    const { jwt } = useAuth();

    useEffect(() => {
        (async function() {        
            try {
                const response = await axios.get(API_URL+"/api/journals", {
                    headers: {
                        auth: jwt
                    }
                });
    
                setJournalIDs(response.data);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, [jwt]);

    return (
        <div>
            <Timeline ids={journalIDs}/>
            <Button text='new entry' clickEvent={() => navigate('/create')}/>
            <Recents/>
        </div>
    );
}

export default Home;