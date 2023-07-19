import { createContext, useContext, useState } from 'react';

const JournalContext = createContext();

export function JournalProvider({children}) {

    const [hasJournaledToday, setHasJournaledToday] = useState(true);

    return (
        <JournalContext.Provider value={{
            hasJournaledToday, setHasJournaledToday
            }}
        >
            {children}
        </JournalContext.Provider>
    );
}

export function useJournalInfo() {
    return useContext(JournalContext);
}