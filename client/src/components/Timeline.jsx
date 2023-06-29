import { useEffect, useState } from 'react';
import { getDaysInYear, getCurrentDayInYear, getDate, getDateFromIndex } from '../utils/utils';
import style from './Timeline.module.css';
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'
import TimelineCell from './TimelineCell';

function Timeline({ids, date}) {
    const [timeline, setTimeline] = useState([]);
    const [year, setYear] = useState(0);

    useEffect(() => {
        setYear(date.getUTCFullYear());
    }, [date])

    useEffect(() => {
        if(!date)  // date must be initialized for this to work
            return;

        const daysInYear = getDaysInYear(year);
        const currDay = {year: date.getUTCFullYear(), day:getCurrentDayInYear(date)};

        let temp_timeline = [];
        for(let i = 0; i < daysInYear; i++) {

            const journalId = (year in ids && ids[year].ids[i])? ids[year].ids[i] : null;

            // So that we dont see the current day selector on other years as we scroll through them
            const isCurrentDay = (i === currDay.day && year === currDay.year); 
            const dateInYear = getDate(getDateFromIndex(i, year));

            temp_timeline.push(<TimelineCell key={i} journalId={journalId} isCurrentDay={isCurrentDay} date={dateInYear}/>);
        }
        setTimeline(temp_timeline);
    }, [year, ids, date]); // We reload timeline either when our ids are loaded, or year is changed.

    return (
        <div style={{overflow:'hidden'}}>
            <div className={style['year-selector']}>
                <span onClick={() => setYear(year-1)} style={{cursor: 'pointer'}}><FaArrowLeft style={{color: 'black', fontSize: '30px'}}/></span>
                <span>{year}</span>
                <span onClick={() => setYear(year+1)} style={{cursor: 'pointer'}}><FaArrowRight style={{color: 'black', fontSize: '30px'}}/></span>
            </div>
            <div className={style.timeline}>
                {timeline}
            </div>
        </div>
    );
}

export default Timeline;