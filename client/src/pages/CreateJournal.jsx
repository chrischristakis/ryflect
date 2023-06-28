import { useState } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    const navigate = useNavigate();
    const date = new Date();

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

    return (
        <div>
            <h3>{getDate(date)}</h3>
            <ReactQuill modules={modules} placeholder="Type here..." onChange={setEntryText} theme="snow"/>
            <form onSubmit={handleSubmit}>
                <Button text="i'm done!" type='submit'/>
            </form>
        </div>
    );
}

export default CreateJournal;