import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { handleError } from '../utils/HandleResponse.js';
import { emojis } from '../utils/Constants.js';

// For quill
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],  // Add or customize other formatting options as needed
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],  // Add both ordered and bullet list options
        [{ 'indent': '-1'}, { 'indent': '+1' }],  // Add indent and outdent options
      ],
}

function CreateJournal() {
    const [entryText, setEntryText] = useState('');
    const [emoji, setEmoji] = useState();
    const navigate = useNavigate();
    const date = new Date();

    const randomEmoji = () => {
        const emojiArray = [...emojis];
        const selected = emojiArray[Math.floor(Math.random() * emojiArray.length)];
        return selected;
    }

    useEffect(() => {
        setEmoji(randomEmoji());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Stop default reload after submitting form

        // Submit data via post then re route to home.
        const data = {
            text: entryText,
            emoji: emoji
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
            handleError(err);
        }
        
    };

    return (
        <div>
            <h3>{getDate(date)} <span style={{userSelect: 'none'}} onClick={() => setEmoji(randomEmoji())}>{emoji}</span></h3>
            <ReactQuill modules={modules} placeholder="Type here..." onChange={setEntryText} theme="snow"/>
            <Button text="i'm done!" clickEvent={handleSubmit} shouldConfirm={true}/>
        </div>
    );
}

export default CreateJournal;