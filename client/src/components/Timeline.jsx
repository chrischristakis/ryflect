import { useEffect, useState } from 'react';
import { getDaysInYear, isEmpty, getCurrentDayInYear } from '../utils/utils';
import style from './Timeline.module.css';

function Timeline(props) {
    const [timeline, setTimeline] = useState([]);

    // Update whenever journalIDs are valid
    useEffect(() => {
        !isEmpty(props.ids) && (function () {
            // Set current days in this year (366 || 365)
            const date = new Date();
            const year = date.getUTCFullYear();
            const daysInYear = getDaysInYear(year);
            const currentDay = getCurrentDayInYear(date);

            let temp_timeline = [];
            for(let i = 0; i < daysInYear; i++) {
                // Active tells us if there was activity on a certain day by checking the journalIDs map
                let active = (year in props.ids && props.ids[year].ids[i]);
                let isCurrentDay = (i == currentDay);
                temp_timeline.push(<div key={`timeline-${i}`} 
                                        className={`${style.cell} ${active && style['active-cell']} ${isCurrentDay && style['current-cell']}`}>
                                    </div>);
            }
            setTimeline(temp_timeline);
        })();
    }, [props.ids]);

    return (
        <div className={style.timeline}>
            {timeline}
        </div>
    );
}

export default Timeline;