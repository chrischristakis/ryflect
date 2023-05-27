import { useEffect, useState } from 'react';
import { getDaysInYear, getCurrentDayInYear } from '../utils/utils';
import style from './Timeline.module.css';
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'

function Timeline(props) {
    const [timeline, setTimeline] = useState([]);
    const [date, setDate] = useState();
    const [year, setYear] = useState(0);

    useEffect(() => {
        const d = new Date();
        setDate(d);
        setYear(d.getUTCFullYear());
    }, [])

    useEffect(() => {
        if(!date)  // dat emust be initialized for this to work
            return;

        const daysInYear = getDaysInYear(year);
        const currDay = {year: date.getUTCFullYear(), day:getCurrentDayInYear(date)};

        let temp_timeline = [];
        for(let i = 0; i < daysInYear; i++) {
            // Active tells us if there was activity on a certain day by checking the journalIDs map
            let active = (year in props.ids && props.ids[year].ids[i]);

            // So that we dont see the current day selector on other years as we scroll through them
            let isCurrentDay = (i === currDay.day && year === currDay.year); 

            temp_timeline.push(<div key={`timeline-${i}`} 
                                    className={`${style.cell} ${active && style['active-cell']} ${isCurrentDay && style['current-cell']}`}>
                                </div>);
        }
        setTimeline(temp_timeline);
    }, [year, props.ids, date]); // We reload timeline either when our ids are loaded, or year is changed.

    return (
        <>
            <div className={style['year-selector']}>
                <span onClick={() => setYear(year-1)} style={{cursor: 'pointer'}}><FaArrowLeft style={{color: 'black', fontSize: '30px'}}/></span>
                <span>{year}</span>
                <span onClick={() => setYear(year+1)} style={{cursor: 'pointer'}}><FaArrowRight style={{color: 'black', fontSize: '30px'}}/></span>
            </div>
            <div className={style.timeline}>
                {timeline}
            </div>
        </>
    );
}

export default Timeline;