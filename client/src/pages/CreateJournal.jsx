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

    const handleKeyDown = (e) => {
        // Make sure text box is focused
        if (document.activeElement !== textarea.current) return;

        // Add a new line when user presses enter
        if(e.key === 'Enter') {
            setEntryText(entryText + '&#x5C;n');
        }

        // Delete the new line escaped characters when backspace on a new line.
        if(e.key === 'Backspace' && entryText.endsWith('&#x5C;n')) {
            setEntryText(entryText.slice(0, '&#x5C;n'.length * -1));
            e.preventDefault();
        }
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
        parsed = parsed.replace(/&#x5C;n/g, '<br>');  // \n is escaped, so we need to deal with its html entity.

        return {__html: DOMPurify.sanitize(parsed)};
    };

    return (
        <div>
            <h3>{getDate(date)}</h3>
            <form onSubmit={handleSubmit}>
                <textarea className={style.editor}
                          ref={textarea} name='text' onChange={handleChange} 
                          onKeyDown={handleKeyDown} value={entryText}/>
                          
                <div className={style.preview}
                     style={{backgroundColor:'tomato'}}
                     dangerouslySetInnerHTML={textParser(entryText)} 
                     onClick={handleClick} />
                <Button text="i'm done!" type='submit'/>
            </form>
        </div>
    );
}

export default CreateJournal;