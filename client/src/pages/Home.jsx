import { useEffect, useState } from "react";
import axios from 'axios';
import { getDaysInYear } from "../utils/utils";

function Home() {

    const [jwt, setJwt] = useState(null);
    const [journalIDs, setJournalIDs] = useState({});
    const [daysInYear, setDaysInYear] = useState(0);

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

            // Set current days in this year
            const date = new Date();
            setDaysInYear(getDaysInYear(date.getUTCFullYear()))
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
        <div>
            {daysInYear}
        </div>
    );
}

export default Home;