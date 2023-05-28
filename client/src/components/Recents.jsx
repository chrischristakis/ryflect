import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Recents() {

    const [recents, setRecents] = useState([]);

    useEffect(() => {
        (async function() {

            try {
                // Get our recent journal's IDs
                let response = await axios.get(API_URL+"/api/journals/recents", {
                    headers: {
                        auth: localStorage.getItem('jwt')
                    }
                });

                const ids = response.data;
                let temp_recents = [];
                // Use the IDs to get the actual journals
                ids.forEach(async (id) => {
                    response = await axios.get(API_URL+"/api/journals/id/"+id, {
                        headers: {
                            auth: localStorage.getItem('jwt')
                        }
                    });

                    temp_recents.push(response.data);
                });

                setRecents(temp_recents);
            }
            catch(err) {
                console.log(err);
            }

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