import { useEffect, useState, useRef } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { handleError } from '../utils/HandleResponse.js';
import { EMOJIS, MAX_FUTURE_YEARS, MAX_BYTES, RANDOM_MESSAGES, lightTheme } from '../utils/Constants.js';
import PopUp from '../components/PopUp.jsx';
import style from './CreatePage.module.css';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// For quill
import 'quill-paste-smart';  // Whoever made this, thank you. Prevents unwanted rich text pasting.
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],  // Add or customize other formatting options as needed
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],  // Add both ordered and bullet list options
        [{ 'indent': '-1'}, { 'indent': '+1' }],  // Add indent and outdent options
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
}

const randomFromArray = (arr) => {
    if(arr.length === 0) return;
    if(arr.length === 1) return arr[0];

    return arr[Math.floor(Math.random() * arr.length)];
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
    const [emoji, setEmoji] = useState(randomFromArray([...EMOJIS]));
    const [placeholder] = useState(randomFromArray(RANDOM_MESSAGES))
    const [hideConfirmPopup, setHideConfirmPopup] = useState(true);
    const [dateString, setDateString] = useState(null);
    const [validDate, setValidDate] = useState(false);
    const [overCapacity, setOverCapacity] = useState(false);

    const navigate = useNavigate();
    const quillRef = useRef();

    useEffect(() => {
        if(isCapsule) {
            date.setUTCFullYear(selectedYear);
            date.setUTCMonth(selectedMonth);
            date.setUTCDate(selectedDay);

            const today = new Date();
            let upper_bound = new Date();
            upper_bound.setUTCFullYear(upper_bound.getUTCFullYear() + MAX_FUTURE_YEARS + 1);
            upper_bound.setUTCDate(1);
            upper_bound.setUTCMonth(0);
            upper_bound.setUTCHours(0, 0, 0, 0);
            if(date > today && date < upper_bound)
                setValidDate(true);

            document.title = `ryflect | create time capsule`;
        }
        else {
            setValidDate(true);
            document.title = `ryflect | create`;
        }

        setDateString(getDate(date));
    }, [isCapsule, selectedDay, selectedMonth, selectedYear]);

    useEffect(() => {
        if(!quillRef.current) return;

        if(!overCapacity) {
            quillRef.current.editor.root.style.backgroundColor = lightTheme.secondary;
            return;
        }

        quillRef.current.editor.root.style.backgroundColor = 'tomato';
        toast.error('Your journal is too large! Try making it shorter.', {position: 'top-center'});

    }, [overCapacity])

    const handleSubmitJournal = async (e) => {
        e.preventDefault();  // Stop default reload after submitting form

        // Submit data via post then re route to home.
        let data = {
            text: entryText,
            emoji: emoji
        }; 

        console.log(entryText)

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

    const byteSize = (str) => new Blob([str]).size;

    const handleTextChange = (richtext) => {
        const bytes = byteSize(richtext);

        if(bytes > MAX_BYTES)
            setOverCapacity(true);
        else
            setOverCapacity(false);

        setEntryText(richtext);
    }

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
        <div className={style['create-wrapper']}>
            <div className={style['title-wrapper']}>
                <h2 style={{color: isCapsule? lightTheme.tertiaryDarker : lightTheme.primary }}>
                    {dateString} <span style={{userSelect: 'none'}} onClick={() => setEmoji(randomFromArray([...EMOJIS]))}>{emoji}</span>
                </h2>
                {isCapsule && <p><em style={{color: lightTheme.tertiaryDarker}}>time capsule</em></p>}
            </div>

            <div className={style['editor-wrapper']}>
                <ReactQuill 
                    ref={quillRef} 
                    modules={modules} 
                    placeholder={placeholder}
                    onChange={handleTextChange} 
                    theme="snow"
                />
            </div>

            <div className={style['button-wrapper']}>
                <Button 
                    className={style['confirm']} 
                    text="i'm done!" 
                    clickEvent={() => setHideConfirmPopup(false)} 
                    disabled={overCapacity} 
                    lightButton={true} 
                    slideHover={true}
                />
            </div>
        </div>
        </>
    );
}

export default CreatePage;