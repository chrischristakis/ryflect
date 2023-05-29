import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthProvider';

function ViewJournal() {

    const { id } = useParams();
    const { jwt } = useAuth();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(API_URL + '/api/journals/id/'+id, {
                    headers: {
                        auth: jwt
                    }
                });

                setEntry(res.data);
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
            <p>{entry.text}</p>
        </div>
    );
}

export default ViewJournal;