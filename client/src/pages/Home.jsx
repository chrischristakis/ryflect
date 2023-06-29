import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';
import useCountdown from '../hooks/useCountdown';

let endDate = new Date();
endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
endDate.setUTCHours(0, 0, 0, 0); 

function Home() {
    const [journalIDs, setJournalIDs] = useState({data: {}, loaded: false});
    const [entryCreated, setEntryCreated] = useState(true); // Just assume true at first in the event something isn't properly loaded.
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();
    const { countdown, countdownDone, setCountdownDone, setEndDate } = useCountdown(endDate);

    useEffect(() => {
        (async function() {
            try {
                const response = await axios.get(API_URL+"/api/journals");
                setJournalIDs({data: response.data, loaded: true});

                // Check if the user made a journal entry today
                const entryCreatedRequest = await axios.get(API_URL+"/api/journals/check");
                setEntryCreated(entryCreatedRequest.data);
            }
            catch(err) {
                handleError(err);
            }
        })();
    }, []);

    useEffect(() => {
        if(!countdownDone) return;

        endDate = new Date();
        endDate.setUTCHours(23);
        endDate.setUTCMinutes(59);
        endDate.setUTCSeconds(0);
        endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
        endDate.setUTCHours(0, 0, 0, 0);         

        setEndDate(endDate);
        setEntryCreated(false);
        setDate(new Date());
        setCountdownDone(false);
    }, [countdownDone, setCountdownDone, setEndDate, setEntryCreated, setDate]);

    if(!journalIDs.loaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Timeline ids={journalIDs.data} date={date}/>
            {
                entryCreated?
                    <div>
                        <Button text={countdown} clickEvent={() => navigate('/create')} disabled={entryCreated}/>
                        <p>You finished a journal today :)</p>
                    </div>
                    :
                    <Button text='new entry' clickEvent={() => navigate('/create')} disabled={entryCreated}/>
            }
            <Recents/>
        </div>
    );
}

export default Home;