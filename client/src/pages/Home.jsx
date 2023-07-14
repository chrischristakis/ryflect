import { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import Recents from '../components/Recents';
import { useNavigate } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown';
import style from './Home.module.css';

let now = new Date();
let endDate = new Date();
endDate.setUTCDate(endDate.getUTCDate() + 1); // Date until 12am of the next day
endDate.setUTCHours(0, 0, 0, 0); 

function Home() {
    const [entryCreated, setEntryCreated] = useState(true); // Just assume true at first in the event something isn't properly loaded.
    const [date, setDate] = useState(now);
    const navigate = useNavigate();
    const { countdown, countdownDone, setCountdownDone, setEndDate } = useCountdown(endDate);

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

    return (
        <div className={style['home-wrapper']}>
            <Timeline date={date}/>
            <div className={style['create-entry-wrapper']}>
            {
                entryCreated?
                    <>
                        <Button 
                            text={countdown} 
                            clickEvent={() => navigate('/create')} 
                            disabled={entryCreated}
                        />
                        <p><em>you made a journal today :)</em></p>
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