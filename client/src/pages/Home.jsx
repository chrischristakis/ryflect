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
import { FaQuestionCircle } from 'react-icons/fa';
import PopUp from '../components/PopUp';
import capsuleDemo from '../assets/capsuleDemo.mp4';
import { lightTheme } from '../utils/Constants';

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
                    <p className={style['entry-made']}><em>you made a journal today :)</em></p>
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

function CreateCapsuleButton() {
    const [hideCapsulePopup, setHideCapsulePopUp] = useState(true);
    return (
        <>
            <PopUp
                hidden={hideCapsulePopup}
                setHiddenState={setHideCapsulePopUp}
            >
                <div className={style['create-capsule-popup']}>
                    <p style={{fontSize: '1.5em'}}><strong>What is a <span style={{color: lightTheme.tertiaryDarker}}>time capsule</span>?</strong></p>
                    <p>A time capsule entry is a journal entry that will not open until a specified date of your choosing.</p>
                    <p>To create one, select any future date on the timeline:</p>
                    <video className={style['video']} playsInline autoPlay loop muted src={capsuleDemo} type="video/mp4">
                        Your browser does not support the videos.
                    </video>
                </div>
            </PopUp>
            <Button 
                text={<div className={style['create-capsule-button']}>create time capsule <FaQuestionCircle/></div>} 
                lightButton={true} 
                clickEvent={(e) => setHideCapsulePopUp(false)}
            />
        </>
    );
}

function Home() {
    const [date, setDate] = useState(now);

    return (
        <div className={style['home-wrapper']}>
            <div id={style['pane1']}>
            <JournalProvider>
                <div className={style['timeline-wrapper']}>
                    <Timeline date={date}/>
                </div>
                <NewEntryButton setDate={setDate}/>
                <CreateCapsuleButton/>
            </JournalProvider>
            </div>
            <div id={style['pane2']}>
            <h3 className={style['recents-title']}>recent entries</h3>
            <div className={style['recents-wrapper']}>
                <Recents/>
            </div>
            </div>
        </div>
    );
}

export default Home;