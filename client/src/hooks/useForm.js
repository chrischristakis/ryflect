import { useState } from 'react';
import { lightTheme } from '../utils/Constants.js';

const DEFAULT_BORDER = '1px solid ' + lightTheme.primary;
const OFFENDING_BORDER = '1px solid tomato';

export default function useForm(initial = {}) {
    const [data, setData] = useState(initial);

    // Called onChange, to update data
    const handleDataChange = (e) => {
        setData({...data, [e.target.name]: {...data[e.target.name], value: e.target.value}});
        data[e.target.name].ref.current.style.border = DEFAULT_BORDER; // Reset border incase it's red when entering new data
    };

    const resetFieldsStyle = () => {
        for(const field in data) {
            if(data[field].ref.current)
                data[field].ref.current.style.border = DEFAULT_BORDER;
        }
    };

    // Turn offending fields red
    const handleOffendingFields = (fields) => {
        for(const field of fields) {
            if(data[field] && data[field].ref.current)
                data[field].ref.current.style.border = OFFENDING_BORDER;
            else
                console.error(`Cannot find field ${field} in form data, or ref isn't set`);
        }
    };

    const defaultField = (fieldObj) => {
        if(!fieldObj?.ref?.current) return;
        fieldObj.ref.current.style.border = DEFAULT_BORDER;
    }

    const offendingField = (fieldObj) => {
        if(!fieldObj?.ref?.current) return;
        fieldObj.ref.current.style.border = OFFENDING_BORDER;
    }

    return { 
        data, 
        handleDataChange, 
        handleOffendingFields, 
        resetFieldsStyle,
        defaultField,
        offendingField
    };
}