import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { handleError } from '../utils/HandleResponse';
import { ReactComponent as Loading } from '../assets/loading.svg';
import { getDate } from '../utils/utils.js';
import style from './Recents.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { lightTheme } from '../utils/Constants';

const MAX_PLAINTEXT_CHARS = 100;
const PAGE_LIMIT = 5;

function Recents() {

    const [recents, setRecents] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [addScrollbar, setAddScrollbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            try {
                let response = await axios.get(API_URL+"/api/journals/recents?skip=0&limit="+PAGE_LIMIT);
                setRecents(response.data);
            }
            catch(err) {
                handleError(err);
            }

        })();

        function handleResize() {
            if (window.innerWidth > 900)
              setAddScrollbar(true);
            else
              setAddScrollbar(false);
        }
        handleResize();
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const richtextToPlaintext = (richtext) => {
        // Removes html tags first, then removes any double spaces for formatting.
        let plaintext = richtext.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ");
        return (plaintext.length >= MAX_PLAINTEXT_CHARS)? plaintext.slice(0, MAX_PLAINTEXT_CHARS) + '...' : plaintext;
    };

    const loadMoreRecents = async () => {
        try {
            let response = await axios.get(API_URL+"/api/journals/recents?skip="+recents.length+"&limit="+PAGE_LIMIT);
            setRecents([...recents, ...response.data]);
            if(response.data.length === 0)
                setHasMore(false);
        }
        catch(err) {
            handleError(err);
        }
    }

    if(!recents)
        return <Loading/>;

    if(recents.length === 0)
        return (
            <div className={style['no-entries-wrapper']}>
                <p className={style['no-entries']}>you have no recent journals... create an entry and change that :)</p>
            </div>
        );

    return (
        <div id={'infinite-scroll'} className={style['recents-wrapper']}>
            <InfiniteScroll
                dataLength={recents.length}
                next={loadMoreRecents}
                hasMore={hasMore}
                loader={<Loading/>}
                scrollableTarget = {addScrollbar? 'infinite-scroll' : ''}
            >
                {
                    recents.map((e, i) =>
                        <div key={e.id + i}
                            className={style['recent-wrapper']}
                            onClick={_ => navigate('/view/' + e.id)}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={style['date-title']}>
                                {
                                    e.is_time_capsule?
                                        <>
                                        <h3 style={{margin: 0, color: lightTheme.tertiaryDarker}}>{getDate(new Date(e.date))} {e.emoji}</h3>
                                        <em style={{color: lightTheme.tertiaryDarker}}>time capsule</em>
                                        </>
                                    :
                                        <h3 style={{margin: 0}}>{getDate(new Date(e.date))} {e.emoji}</h3>

                                }
                            </div>
                            <div className={style['recent-text-wrapper']}>
                                <div 
                                    className={style['recent-text-content']}
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(richtextToPlaintext(e.richtext)) }}
                                />
                            </div>
                        </div>
                    )
                }  
            </InfiniteScroll>
        </div> 
    );
}

export default Recents;