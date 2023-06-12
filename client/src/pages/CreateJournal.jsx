import { useState } from 'react';
import Button from '../components/Button';
import { getDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

function CreateJournal() {

    const [entryText, setEntryText] = useState('');
    const navigate = useNavigate();
    const date = new Date();

    const handleChange = (e) => {
        setEntryText(e.target.value);
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

    return (
        <div>
            <h3>{getDate(date)}</h3>
            <form onSubmit={handleSubmit}>
                <input type='text' name='text' onChange={handleChange}></input>
                <Button text="i'm done!" type='submit'/>
            </form>
        </div>
    );
}

export default CreateJournal;