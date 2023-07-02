import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/HandleResponse';
import useCountdown from '../hooks/useCountdown';
import { ReactComponent as Loading } from '../assets/loading.svg';
import style from './Home.module.css';

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
        endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
        endDate.setUTCHours(0, 0, 0, 0);         

        setEndDate(endDate);
        setEntryCreated(false); // Turn button back on
        setDate(new Date());  // Updates the timeline
        setCountdownDone(false); // Count down resets
    }, [countdownDone, setCountdownDone, setEndDate, setEntryCreated, setDate]);

    if(!journalIDs.loaded) {
        return <Loading/>;
    }

    return (
        <div className={style['home-wrapper']}>
            <Timeline ids={journalIDs.data} date={date}/>
            <div className={style['create-entry-wrapper']}>
            {
                entryCreated?
                    <>
                        <Button 
                            text={countdown} 
                            clickEvent={() => navigate('/create')} 
                            disabled={entryCreated}
                        />
                        <p>you made a journal today :)</p>
                    </>
                    :
                    <Button 
                        text='new entry' 
                        clickEvent={() => navigate('/create')} 
                        disabled={entryCreated}
                    />
            }
            </div>
            <hr/>
            <Recents/>
        </div>
    );
}

export default Home;