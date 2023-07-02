function DisplayError({code='500', text='Something went wrong.', image=null}) {
    return (
        <div>
            <h2>{code}</h2>
            <p>{text}</p>
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