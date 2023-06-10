import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

function Recents() {

    const [recents, setRecents] = useState({data:[], loaded: false});
    const navigate = useNavigate();
    const { jwt } = useAuth();

    useEffect(() => {
        (async function() {
            let responseIds = [];
            try {
                // Get our recent journal's IDs
                let response = await axios.get(API_URL+"/api/journals/recents", {
                    headers: {
                        auth: jwt
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
                            auth: jwt
                        }
                    });

                    return response.data; // Contains actual journal entries
                }
                catch(err) {
                    console.log(err);
                    return null;
                }
            }));

            setRecents({data:responseIds, loaded: true});
        })();
    }, [jwt]);

    if(!recents.loaded)
        return <div>Loading...</div>;

    if(recents.data.length === 0)
        return (
            <p>you have no recent journals... create an entry and change that :)</p>
        );

    return (
        <div>
            {
                recents.data.map((e) => {
                    return (
                        <div key={e.id}
                             onClick={_ => navigate('/view/' + e.id)}
                             style={{cursor: 'pointer'}}
                        >
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