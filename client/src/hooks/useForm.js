import { useState } from 'react';

export default function useForm(initial = {}) {
    const [data, setData] = useState(initial);

    // Called onChange, to update data
    const handleDataChange = (e) => {
        setData({...data, [e.target.name]: {...data[e.target.name], value: e.target.value}});
        data[e.target.name].ref.current.style.border = '1px solid black'; // Reset border incase it's red when entering new data
    };

    const resetFieldsStyle = () => {
        for(const field in data) {
            if(data[field].ref.current)
                data[field].ref.current.style.border = '1px solid black';
        }
    };

    // Turn offending fields red
    const handleOffendingFields = (fields) => {
        for(const field of fields) {
            if(data[field] && data[field].ref.current)
                data[field].ref.current.style.border = '1px solid red';
            else
                console.log(`Cannot find field ${field} in form data, or ref isn't set`);
        }
    };

    const defaultField = (fieldObj) => {
        if(!fieldObj?.ref?.current) return;
        fieldObj.ref.current.style.border = '1px solid black';
    }

    const offendingField = (fieldObj) => {
        if(!fieldObj?.ref?.current) return;
        fieldObj.ref.current.style.border = '1px solid red';
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