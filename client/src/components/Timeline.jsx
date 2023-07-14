import { useEffect, useState } from 'react';
import { getDaysInYear, getCurrentDayInYear, getDate, getDateFromIndex } from '../utils/utils';
import style from './Timeline.module.css';
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'
import TimelineCell from './TimelineCell';
import { handleError } from '../utils/HandleResponse';
import axios from 'axios';
import { API_URL } from '../config';
import { ReactComponent as Loading } from '../assets/loading.svg'; 

const MAX_FUTURE_YEARS = 100;

function Timeline({date}) {
    const [timeline, setTimeline] = useState([]);
    const [selectedYear, setSelectedYear] = useState(date.getUTCFullYear());
    const [upperYearBound, setUpperYearBound] = useState(date.getUTCFullYear() + MAX_FUTURE_YEARS);
    const [lowerYearBound, setLowerYearBound] = useState(date.getUTCFullYear());
    const [journalIDs, setJournalIDs] = useState(null);

    useEffect(() => {
        (async function() {
            try {
                const response = await axios.get(API_URL + '/api/journals');

                // get the lowest year in the map
                const earliest_year = Math.min(...Object.keys(response.data));

                setLowerYearBound(earliest_year);
                setJournalIDs(response.data);
            }
            catch(err) {
                console.log(err);
                handleError(err);
            }
        })();
    }, []);

    useEffect(() => {
        if(!journalIDs || !date)
            return;

        setUpperYearBound(date.getUTCFullYear() + MAX_FUTURE_YEARS);

        // - Build timeline based off these journalIDs - //
        const daysInYear = getDaysInYear(selectedYear);
        const currDay = {year: date.getUTCFullYear(), day:getCurrentDayInYear(date)};

        let temp_timeline = [];
        for(let i = 0; i < daysInYear; i++) {

            const journalId = (selectedYear in journalIDs && journalIDs[selectedYear].ids[i])? 
                journalIDs[selectedYear].ids[i] : null;

            // So that we dont see the current day selector on other years as we scroll through them
            const isCurrentDay = (i === currDay.day && selectedYear === currDay.year); 
            const dateString = getDate(getDateFromIndex(i, selectedYear));

            temp_timeline.push(<TimelineCell key={i} journalId={journalId} isCurrentDay={isCurrentDay} date={dateString}/>);
        }
        setTimeline(temp_timeline);
    }, [date, journalIDs, selectedYear]); // We reload timeline either when our ids are loaded, or year is changed.

    if(!journalIDs)
        return <Loading/>;

    return (
        <div className={style['timeline-wrapper']}>
            <div className={style['year-selector']}>
                <span className={style['arrow-wrapper']}>
                    {
                        selectedYear <= lowerYearBound? null
                        :
                        <FaArrowLeft style={{color: 'black', fontSize: '40px', cursor: 'pointer'}} onClick={() => setSelectedYear(selectedYear-1)}/>
                    }
                </span>

                <span className={style['selected-year']} onClick={() => setSelectedYear(date.getUTCFullYear())}>
                    {selectedYear}
                </span>

                <span className={style['arrow-wrapper']}>
                    {
                        selectedYear >= upperYearBound? null
                        :
                        <FaArrowRight style={{color: 'black', fontSize: '40px', cursor: 'pointer'}} onClick={() => setSelectedYear(selectedYear+1)}/>
                    }
                </span>
            </div>
            <div className={style.timeline}>
                {timeline}
            </div>
        </div>
    );
}

export default Timeline;