import { useEffect, useState } from "react";
import axios from 'axios';
import Timeline from "../components/Timeline";

function Home() {

    const [jwt, setJwt] = useState(null);
    const [journalIDs, setJournalIDs] = useState({});

    useEffect(() => {
        (async function() {
            
            // Temporary login for testing
            const body = {
                username: "chris8787",
                password: "password"
            };

            try {
                const response = await axios.post("http://localhost:5000/api/auth/login", body);
                setJwt(response.data);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, []);

    useEffect(() => {
        jwt && (async function() {
            try{
                const response = await axios.get("http://localhost:5000/api/journals", {
                    headers: {
                        auth: jwt
                    }
                });
    
                setJournalIDs(response.data);
            }
            catch(err) {
                console.log(err);
            }
        })();
    }, [jwt]);

    return (
        <Timeline ids={journalIDs}/>
    );
}

export default Home;