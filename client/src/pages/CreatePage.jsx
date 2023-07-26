import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { handleError } from '../utils/HandleResponse.js';
import { EMOJIS, MAX_FUTURE_YEARS } from '../utils/Constants.js';
import PopUp from '../components/PopUp.jsx';
import style from './CreatePage.module.css';
import { useLocation } from 'react-router-dom';

// For quill
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],  // Add or customize other formatting options as needed
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],  // Add both ordered and bullet list options
        [{ 'indent': '-1'}, { 'indent': '+1' }],  // Add indent and outdent options
      ],
}

const randomEmoji = () => {
    const emojiArray = [...EMOJIS];
    const selected = emojiArray[Math.floor(Math.random() * emojiArray.length)];
    return selected;
}

let date = new Date();

function CreatePage() {
    // To extract query params, which we use to determine if this entry is a time capsule or not.
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const selectedYear = queryParams.get('selectedYear');
    const selectedMonth = queryParams.get('selectedMonth');
    const selectedDay = queryParams.get('selectedDay');
    const isCapsule = selectedDay && selectedMonth && selectedYear;

    const [entryText, setEntryText] = useState('');
    const [emoji, setEmoji] = useState();
    const [hideConfirmPopup, setHideConfirmPopup] = useState(true);
    const [dateString, setDateString] = useState(null);
    const [validDate, setValidDate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setEmoji(randomEmoji());

        if(isCapsule) {
            date.setUTCFullYear(selectedYear);
            date.setUTCMonth(selectedMonth);
            date.setUTCDate(selectedDay);

            const today = new Date();
            let upper_bound = new Date();
            upper_bound.setUTCFullYear(upper_bound.getUTCFullYear() + MAX_FUTURE_YEARS);
            if(date > today && date < upper_bound)
                setValidDate(true);
        }
        else
            setValidDate(true);

        setDateString(getDate(date));
    }, [isCapsule, selectedDay, selectedMonth, selectedYear]);

    const handleSubmitJournal = async (e) => {
        e.preventDefault();  // Stop default reload after submitting form

        // Submit data via post then re route to home.
        let data = {
            text: entryText,
            emoji: emoji
        }; 

        try {
            if(!isCapsule)
                await axios.post(API_URL + '/api/journals', data, {
                    headers: {
                        'Content-Type': 'application/json' 
                    }
                });
            else {
                data = {
                    ...data,
                    unlock_year: selectedYear,
                    unlock_month: selectedMonth,
                    unlock_day: selectedDay
                }
                await axios.post(API_URL + '/api/journals/timecapsule', data, {
                    headers: {
                        'Content-Type': 'application/json' 
                    }
                });
            }

            navigate('/');
        }
        catch(err) {
            handleError(err);
        }
        
    };

    if(!validDate) {
        return (
            <div>You selected an invalid date :(</div>
        );
    }

    return (
        <>
        <PopUp
            hidden={hideConfirmPopup}
            setHiddenState={setHideConfirmPopup}
        >
            <div className={style['confirm-popup-wrapper']}>
                {
                    isCapsule?
                        <>
                        <p>Are you sure you'd like to create this capsule entry?</p>
                        <p><em>You will not be able to view it until <strong>{dateString}!</strong></em></p>
                        <Button text={"i'm sure"} clickEvent={handleSubmitJournal} lightButton={true} slideHover={true}/>
                        </>
                        :
                        <>
                        <p>Are you sure you'd like to create this entry?</p>
                        <p><em>Journals can only be made once per day!</em></p>
                        <Button text={"i'm sure"} clickEvent={handleSubmitJournal} lightButton={true} slideHover={true}/>
                        </>
                }
            </div>
        </PopUp>
        <div>
            <h3>{dateString} <span style={{userSelect: 'none'}} onClick={() => setEmoji(randomEmoji())}>{emoji}</span></h3>
            {isCapsule && <h3 style={{color: '#F28C28'}}><em>time capsule</em></h3>}
            <ReactQuill modules={modules} placeholder="Type here..." onChange={setEntryText} theme="snow"/>
            <br/>
            <Button text="i'm done!" clickEvent={() => setHideConfirmPopup(false)}/>
        </div>
        </>
    );
}

export default CreatePage;