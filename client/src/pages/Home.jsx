import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';

function Home() {

    const [journalIDs, setJournalIDs] = useState({data: {}, loaded: false});
    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            try {
                const response = await axios.get(API_URL+"/api/journals");
                setJournalIDs({data: response.data, loaded: true});
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, []);


    if(!journalIDs.loaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Timeline ids={journalIDs.data}/>
            <Button text='new entry' clickEvent={() => navigate('/create')}/>
            <Recents/>
        </div>
    );
}

export default Home;