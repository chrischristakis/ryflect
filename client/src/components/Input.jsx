import React from 'react';
import style from './Input.module.css';

const Input = React.forwardRef((props, ref) => {

    return (
        <div className={style['input-wrapper']}>
            <label>
                {props.label}
                <br/>
                <input {...props} ref={ref} className={style['input-box']}></input>
            </label>
        </div>
    )
});

export default Input;