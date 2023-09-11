import style from './DisplayError.module.css';

function DisplayError({code='500', text='Something went wrong.', image=null}) {
    return (
        <div className={style['error-wrapper']}>
            <h2 className={style['error-code']}>{code}</h2>
            <p className={style['error-text']}>{text}</p>
            {
                image? 
                <img src={image.component} alt=';(' width={image.width}/>
                :
                null
            }
        </div>
    );
}

export default DisplayError;