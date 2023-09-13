import React from 'react';

const Input = React.forwardRef((props, ref) => {

    return (
        <div>
            <label>
                {props.label}
                <br/>
                <input {...props} ref={ref}></input>
            </label>
        </div>
    )
});

export default Input;