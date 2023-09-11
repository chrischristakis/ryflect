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
import { lightTheme } from '../utils/Constants';

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
                document.title = `ryflect | ${getDate(new Date(tempEntry.date))}`
            }
            catch(err) {
                if(err.response && (err.response.status === 403 || err.response.status === 401))
                    setUnauthorized(true);
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
        <div className={style['view-wrapper']}>
            <div className={style['title-wrapper']}>
                <h2 style={{color: entry.is_time_capsule? lightTheme.tertiaryDarker : lightTheme.primary }}>{formattedDate} {entry.emoji}</h2>
                { entry.is_time_capsule && <p><em style={{color: lightTheme.tertiaryDarker}}>time capsule</em></p> }
            </div>
            <div 
                className={style['text-container']}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.richtext) }}
            />
        </div>
    );
}

export default ViewJournal;