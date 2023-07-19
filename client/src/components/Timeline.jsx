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
    const [journalIDs, setJournalIDs] = useState(null);
    const [carouselVals, setCarouselVals] = useState([]);

    useEffect(() => {
        (async function() {
            try {
                const journalResponse = await axios.get(API_URL + '/api/journals');

                // get the lowest year in the map
                const earliest_year = Math.min(...Object.keys(journalResponse.data), 2023);

                let yearRange = [];
                for (let i = earliest_year; i <= earliest_year + MAX_FUTURE_YEARS; i++)
                    yearRange.push(i);

                setCarouselVals(yearRange);
                setJournalIDs(journalResponse.data);
            }
            catch(err) {
                console.log(err);
                handleError(err);
            }
        })();
    }, [date]);

    useEffect(() => {
        if(!journalIDs || !date)
            return;

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

    return (
        <div className={style['timeline-wrapper']}>
            {!journalIDs?
                <div><Loading/></div>
            :
                <>
                <div className={style['year-selector']}>
                    <Carousel
                        values={carouselVals.map((e) => e.toString())}
                        cellWidth={60}
                        cellHeight={35}
                        cellGap={25}
                        selectedIndex={1}
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