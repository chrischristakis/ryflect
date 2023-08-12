import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import DOMPurify from "dompurify";
import { handleError } from '../utils/HandleResponse';
import { getDate } from '../utils/utils.js';
import DisplayError from '../components/DisplayError';
import { ReactComponent as Loading } from '../assets/loading.svg';
import style from './ViewJournal.module.css';

function ViewJournal() {

    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formattedDate, setFormattedDate] = useState();

    useEffect(() => {
        id && (async function() {
            try {
                const res = await axios.get(API_URL + '/api/journals/id/'+id);
                let tempEntry = res.data;

                setEntry(tempEntry);
                setFormattedDate(getDate(new Date(tempEntry.date)));
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
        return <Loading/>;

    if(unauthorized)
        return <DisplayError code='403' text='You are not authorized to view this content'/>;

    if(!entry)
        return <DisplayError code='404' text='This journal does not exist'/>;

    return (
        <div>
            <h3>{formattedDate} {entry.emoji}</h3>
            {
                entry.is_time_capsule && <h4 style={{color: '#F28C28'}}><em>time capsule</em></h4>
            }
            <div 
                className={style['text-container']}
                style={{whiteSpace: 'normal'}} 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.richtext) }}
            />
        </div>
    );
}

export default ViewJournal;