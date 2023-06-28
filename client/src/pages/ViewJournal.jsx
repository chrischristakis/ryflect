import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import DOMPurify from "dompurify";
import { handleError } from '../utils/HandleResponse';
import DisplayError from '../components/DisplayError';

function ViewJournal() {

    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(API_URL + '/api/journals/id/'+id);
                let tempEntry = res.data;

                setEntry(tempEntry);
            }
            catch(err) {
                if(err.response && err.response.status === 403)
                    setUnauthorized(true);
                else
                    handleError(err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if(loading)
        return <p>Loading...</p>;

    if(unauthorized)
        return <DisplayError code='403' text='You are not authorized to view this content'/>;

    if(!entry)
        return <DisplayError code='404' text='This journal does not exist'/>;

    return (
        <div>
            <h3>{entry.date}</h3>
            <div 
                style={{whiteSpace: 'pre'}} 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.richtext) }}
            />
        </div>
    );
}

export default ViewJournal;