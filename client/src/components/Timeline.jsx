import { useEffect, useState } from 'react';
import { getDaysInYear, getCurrentDayInYear, getDate, getDateFromIndex } from '../utils/utils';
import style from './Timeline.module.css';
import TimelineCell from './TimelineCell';
import { handleError } from '../utils/HandleResponse';
import axios from 'axios';
import { API_URL } from '../config';
import { ReactComponent as Loading } from '../assets/loading.svg';
import Carousel from '../components/Carousel.jsx';

const MAX_FUTURE_YEARS = 50;

function Timeline({date}) {
    const [timeline, setTimeline] = useState([]);
    const [selectedYear, setSelectedYear] = useState(date.getUTCFullYear());
    const [journalMap, setJournalMap] = useState(null);
    const [carouselVals, setCarouselVals] = useState([]);
    const [initialYearIndex, setInitialYearIndex] = useState(0);

    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(API_URL + '/api/journals');

                const current_year = date.getUTCFullYear();
                const earliest_year = Math.min(...Object.keys(res.data), current_year);

                let yearRange = [];
                for (let i = earliest_year; i <= current_year + MAX_FUTURE_YEARS; i++) {
                    yearRange.push(i);
                    
                    // Centers the carousel at the current year, not the year of the first entry.
                    if(i === current_year)
                        setInitialYearIndex(yearRange.length - 1);
                }

                setCarouselVals(yearRange);
                setJournalMap(res.data);
            }
            catch(err) {
                handleError(err);
            }
        })();
    }, [date]);

    useEffect(() => {
        if(!journalMap || !date)
            return;

        // - Build timeline based off these journalIDs - //
        const daysInYear = getDaysInYear(selectedYear);
        const currDay = {year: date.getUTCFullYear(), day:getCurrentDayInYear(date)};

        const yearMap = journalMap[selectedYear];

        let temp_timeline = [];
        for(let i = 0; i < daysInYear; i++) {

            // So that we dont see the current day selector on other years as we scroll through them
            const isCurrentDay = (i === currDay.day && selectedYear === currDay.year); 
            const dateString = getDate(getDateFromIndex(i, selectedYear));

            if(!yearMap) {
                temp_timeline.push(<TimelineCell key={i} isCurrentDay={isCurrentDay} date={dateString}/>);
                continue;
            }

            const ids = yearMap[i];
            const journalID = (ids && ids['journalID'])? ids['journalID']: null;
            const capsuleID = (ids && ids['capsuleID'])? ids['capsuleID']: null;

            temp_timeline.push(<TimelineCell key={i} journalID={journalID} capsuleID={capsuleID} isCurrentDay={isCurrentDay} date={dateString}/>);
        }
        setTimeline(temp_timeline);
    }, [date, journalMap, selectedYear]); // We reload timeline either when our ids are loaded, or year is changed.

    return (
        <div className={style['timeline-wrapper']}>
            {!journalMap?
                <div><Loading/></div>
            :
                <>
                <div className={style['year-selector']}>
                    <Carousel
                        values={carouselVals.map((e) => e.toString())}
                        cellWidth={60}
                        cellHeight={35}
                        cellGap={25}
                        initialIndex={initialYearIndex}
                        indexChangeCallback={(index) => {setSelectedYear(carouselVals[index])}}
                    />
                </div>
                <div className={style.timeline}>
                    {timeline}
                </div>
                </>
            }
        </div>
    );
}

export default Timeline;