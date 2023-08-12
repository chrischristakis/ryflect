import { useState } from 'react';
import style from './Accordion.module.css';
import {MdExpandMore, MdExpandLess} from 'react-icons/md';

function Accordion({header, content}) {
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div className={style['accordion-wrapper']}>
            <div className={style['accordion-header']} onClick={() => setExpanded(!expanded)}>
                <p>{header}</p>
                {
                    !expanded?
                        <MdExpandMore className={style['accordion-icon']} size={30} color={'black'}/>
                        :
                        <MdExpandLess className={style['accordion-icon']} size={30} color={'black'}/>
                }
            </div>
            <div className={`${style['accordion-content']} ${expanded? style['expanded'] : style['collapsed']}`}>
                <p>{content}</p>
            </div>
        </div>
    );
}

export default Accordion;