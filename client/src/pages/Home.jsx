import { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { useNavigate } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown';
import { API_URL } from '../config';
import { JournalProvider, useJournalInfo } from '../contexts/JournalProvider.jsx';
import style from './Home.module.css';
import axios from 'axios';
import { handleError } from '../utils/HandleResponse';
import { ReactComponent as Loading } from '../assets/loading.svg';

let now = new Date();
let endDate = new Date();
endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
endDate.setUTCHours(0, 0, 0, 0); 

function NewEntryButton({setDate}) {
    const { countdown, countdownDone, setCountdownDone, setEndDate } = useCountdown(endDate);
    const { hasJournaledToday, setHasJournaledToday } = useJournalInfo();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            try {
                const journalCreatedResponse = await axios.get(API_URL + '/api/journals/check');
                setHasJournaledToday(journalCreatedResponse.data);
                setLoading(false);
            }
            catch(err) {
                handleError(err);
            }
        })();
    }, [setHasJournaledToday]);

    useEffect(() => {
        if(!countdownDone) return;

        endDate = new Date();
        endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
        endDate.setUTCHours(0, 0, 0, 0);         

        setEndDate(endDate);
        setHasJournaledToday(false); // Turn button back on
        setDate(new Date());  // Updates the timeline
        setCountdownDone(false); // Count down resets
    }, [countdownDone, setCountdownDone, setEndDate, setDate, setHasJournaledToday]);

    if(loading)
        return (
            <div className={style['create-entry-wrapper']}>
                <Loading/>
            </div>
        );

    return (
        <div className={style['create-entry-wrapper']}>
            {
                hasJournaledToday?
                    <>
                    <Button 
                        text={countdown} 
                        clickEvent={() => navigate('/create')} 
                        disabled={hasJournaledToday}
                    />
                    <p><em>you made a journal today :)</em></p>
                    </>
                    :
                    <Button 
                        text='new entry' 
                        clickEvent={() => navigate('/create')} 
                        disabled={hasJournaledToday}
                    />
            }
        </div>
    );
}

function Home() {
    const [date, setDate] = useState(now);

    return (
        <div className={style['home-wrapper']}>
            <JournalProvider>
                <div className={style['timeline-wrapper']}>
                    <Timeline date={date}/>
                </div>
                <NewEntryButton setDate={setDate}/>
            </JournalProvider>
            <hr/>
            <div className={style['recents-wrapper']}>
                <Recents/>
            </div>
        </div>
    );
}

export default Home;