import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Recents() {

    const [recents, setRecents] = useState([]);

    useEffect(() => {
        (async function() {

            let responseIds = [];
            try {
                // Get our recent journal's IDs
                let response = await axios.get(API_URL+"/api/journals/recents", {
                    headers: {
                        auth: localStorage.getItem('jwt')
                    }
                });
                responseIds = response.data;
            }
            catch(err) {
                console.log(err);
            }
            
            // Use the IDs to get the actual journals
            responseIds = await Promise.all(responseIds.map(async (id) => {
                try {
                    let response = await axios.get(API_URL+"/api/journals/id/"+id, {
                        headers: {
                            auth: localStorage.getItem('jwt')
                        }
                    });

                    return response.data; // Contains actual journal entries
                }
                catch(err) {
                    console.log(err);
                    return null;
                }
            }));

            setRecents(responseIds);
        })();
    }, []);

    return (
        <div>
            {
                recents.map((e) => {
                    return (
                        <div key={e.id}>
                            <h3>{e.date}</h3>
                            <p>{e.text}</p>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Recents;