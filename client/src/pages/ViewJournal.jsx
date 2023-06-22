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

                // Format text, * is bold, _ is italics, \n is new line (&#x5C;n)
                tempEntry.text = tempEntry.text.replace(/\*([^\s][^*]+?[^\s])\*/g, '<strong>$1</strong>');
                tempEntry.text = tempEntry.text.replace(/_([^\s][^_]+?[^\s])_/g, '<em>$1</em>');
                tempEntry.text = tempEntry.text.replace(/&#x5C;n/g, '<br>');  // \n is escaped, so we need to deal with its html entity.

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
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.text) }}/>
        </div>
    );
}

export default ViewJournal;