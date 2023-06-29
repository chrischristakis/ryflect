import { useEffect, useState } from 'react';

// Reset callback should provide a mechanism 
export default function useCountdown(targetDate) {
    const [countdown, setCountdown] = useState('--:--:--');
    const [countdownDone, setCountdownDone] = useState(false);
    const [endDate, setEndDate] = useState(targetDate);

    useEffect(() => {
        function update() {
            if(countdownDone)
                return;

            const now = new Date();
            const elapsedMS = endDate.getTime() - now.getTime();

            if(elapsedMS <= 0) {
                setCountdown('00:00:00');
                setCountdownDone(true);
            }
            else {
                const hours = Math.floor((elapsedMS % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
                const minutes = Math.floor((elapsedMS % (1000 * 60 * 60)) / (1000 * 60)).toString();
                const seconds = Math.floor((elapsedMS % (1000 * 60)) / 1000).toString();
    
                setCountdown(`${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`);
            }
        }

        update();
        const interval = setInterval(() => {
            update();
        }, 1000);

        return () => { // Called when hook unmounts; a destructor.
            clearInterval(interval)
        }
    }, [endDate, countdownDone]);

    return { 
        countdown, 
        countdownDone, 
        setCountdownDone, 
        setEndDate 
    };
}