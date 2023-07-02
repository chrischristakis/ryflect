import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import DOMPurify from 'dompurify';
import { handleError } from '../utils/HandleResponse';
import { ReactComponent as Loading } from '../assets/loading.svg';

const MAX_PLAINTEXT_CHARS = 100;

function Recents() {

    const [recents, setRecents] = useState({data:[], loaded: false});
    const navigate = useNavigate();
    const { jwt } = useAuth();

    useEffect(() => {
        (async function() {
            try {
                let response = await axios.get(API_URL+"/api/journals/recents", {
                    headers: {
                        auth: jwt
                    }
                });

                setRecents({data:response.data, loaded: true});
            }
            catch(err) {
                handleError(err);
            }

        })();
    }, [jwt]);

    const richtextToPlaintext = (richtext) => {
        // Removes html tags first, then removes any double spaces for formatting.
        let plaintext = richtext.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ");
        return (plaintext.length >= MAX_PLAINTEXT_CHARS)? plaintext.slice(0, MAX_PLAINTEXT_CHARS) + '...' : plaintext;
    };

    if(!recents.loaded)
        return <Loading/>;

    if(recents.data.length === 0)
        return (
            <p>you have no recent journals... create an entry and change that :)</p>
        );

    return (
        <div>
            {
                recents.data.map((e, i) => {
                    return (
                        <div key={e.id + i}
                             onClick={_ => navigate('/view/' + e.id)}
                             style={{cursor: 'pointer'}}
                        >
                            <h3>{e.date} {e.emoji}</h3>
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(richtextToPlaintext(e.richtext)) }}/>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Recents;