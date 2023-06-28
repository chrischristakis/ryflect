import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import DOMPurify from "dompurify";

function ViewJournal() {

    const { id } = useParams();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(API_URL + '/api/journals/id/'+id);
                let tempEntry = res.data;

                setEntry(tempEntry);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, [id]);

    if(!entry)
        return <p>Loading...</p>;

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