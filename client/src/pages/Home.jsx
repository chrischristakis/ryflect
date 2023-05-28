import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';

function Home() {

    const [journalIDs, setJournalIDs] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            
            // Temporary login for testing
            const body = {
                username: "chris8787",
                password: "password"
            };

            try {
                let response = await axios.post(API_URL+"/api/auth/login", body);
                localStorage.setItem('jwt', response.data);

                response = await axios.get(API_URL+"/api/journals", {
                    headers: {
                        auth: localStorage.getItem('jwt')
                    }
                });
    
                setJournalIDs(response.data);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, []);

    return (
        <div>
            <Timeline ids={journalIDs}/>
            <Button text='new entry' clickEvent={() => navigate('/create')}/>
            <Recents/>
        </div>
    );
}

export default Home;