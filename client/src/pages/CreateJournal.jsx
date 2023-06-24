import { useRef, useState } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import style from './CreateJournal.module.css';

function CreateJournal() {

    const [entryText, setEntryText] = useState('');
    const navigate = useNavigate();
    const textarea = useRef(null);
    const date = new Date();

    const handleChange = (e) => {
        setEntryText(e.target.value);
    };

    const handleClick = (e) => {
        if(!textarea.current) return;

        textarea.current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Stop default reload after submitting form

        // Submit data via post then re route to home.
        const data = {
            text: entryText
        }; 

        try {
            await axios.post(API_URL + '/api/journals', data, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });
            navigate('/');
        }
        catch(err) {
            if(err.response && err.response.data && err.response.data.error)
                toast.error(err.response.data.error, {position: 'top-center'});
            else
                toast.error('Something went wrong.', {position: 'top-center'});
        }
        
    };

    const textParser = (text) => {
        let parsed = text;

        parsed = parsed.replace(/\*([^\s][^*]+?[^\s])\*/g, '<strong>$1</strong>');
        parsed = parsed.replace(/_([^\s][^_]+?[^\s])_/g, '<em>$1</em>');

        return {__html: DOMPurify.sanitize(parsed)};
    };

    console.log(entryText)

    return (
        <div>
            <h3>{getDate(date)}</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    ref={textarea}
                    value={entryText}
                    onChange={handleChange}
                />
                <div 
                    style={{whiteSpace: 'pre'}} 
                    dangerouslySetInnerHTML={textParser(entryText)} 
                    onClick={handleClick}
                />
                <Button text="i'm done!" type='submit'/>
            </form>
        </div>
    );
}

export default CreateJournal;