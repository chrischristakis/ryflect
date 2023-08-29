import { useEffect, useRef, useState } from 'react';
import { getDaysInYear, getCurrentDayInYear, getDateFromIndex } from '../utils/utils';
import style from './Timeline.module.css';
import TimelineCell from './TimelineCell';
import { handleError } from '../utils/HandleResponse';
import axios from 'axios';
import { API_URL } from '../config';
import { MAX_FUTURE_YEARS } from '../utils/Constants';
import { ReactComponent as Loading } from '../assets/loading.svg';
import Carousel from '../components/Carousel.jsx';

function Timeline({date}) {
    const [timeline, setTimeline] = useState([]);
    const [journalMap, setJournalMap] = useState(null);
    const [carouselVals, setCarouselVals] = useState([]);
    const [initialYearIndex, setInitialYearIndex] = useState(0);

    const prevSelectedYear = useRef(0);
    const containerRef = useRef(null);

    const populateTimeline = (year, resMap, date) => {
        if(!resMap || !date)
            return;

        const daysInYear = getDaysInYear(year);
        const currDay = {year: date.getUTCFullYear(), day:getCurrentDayInYear(date)};

        const yearMap = resMap[year];

        let temp_timeline = [];
        for(let i = 0; i < daysInYear; i++) {

            // So that we dont see the current day selector on other years as we scroll through them
            const isCurrentDay = (i === currDay.day && year === currDay.year); 
            const dateObj = getDateFromIndex(i, year);
            const isAfterToday = year > currDay.year || (year === currDay.year && i > currDay.day);

            // If no data exists for a year, just skip the later logic.
            if(!yearMap) {
                temp_timeline.push({
                    canCreateCapsule: isAfterToday,
                    isCurrentDay: isCurrentDay,
                    dateObj: dateObj
                });
                continue;
            }

            const ids = yearMap[i];
            const journalID = (ids && ids['journalID'])? ids['journalID']: null;
            const capsuleInfo = (ids && ids['capsuleInfo'])? ids['capsuleInfo']: null;

            temp_timeline.push({
                journalID: journalID,
                capsuleInfo: capsuleInfo,
                canCreateCapsule: isAfterToday,
                isCurrentDay: isCurrentDay,
                dateObj: dateObj
            });
        }
        setTimeline(temp_timeline);
    };

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

                prevSelectedYear.current = current_year;
                populateTimeline(current_year, res.data, date);
            }
            catch(err) {
                handleError(err);
            }
        })();
    }, [date]);

    const handleChangeYear = (index) => {
        if(prevSelectedYear.current === carouselVals[index]) return;

        prevSelectedYear.current = carouselVals[index];
        populateTimeline(carouselVals[index], journalMap, date);
    }

    return (
        <div className={style['timeline-wrapper']} ref={containerRef}>
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
                        indexChangeCallback={handleChangeYear}
                    />
                </div>
                <div className={style.timeline}>
                    {timeline.map((cell, index) =>
                        <TimelineCell
                            key={index}
                            journalID={cell.journalID}
                            capsuleInfo={cell.capsuleInfo}
                            canCreateCapsule={cell.canCreateCapsule}
                            isCurrentDay={cell.isCurrentDay}
                            date={cell.dateObj}
                            containerRef={containerRef}  // We need this to properly bind these within the container
                        />
                    )}
                </div>
                </>
            }
        </div>
    );
}

export default Timeline;