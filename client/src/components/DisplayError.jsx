function DisplayError({code='500', text='Something went wrong.', imgPath=''}) {
    return (
        <div>
            <h2>{code}</h2>
            <p>{text}</p>
            {
                imgPath? 
                <img src={imgPath} alt=';('/>
                :
                null
            }
        </div>
    );
}

export default DisplayError;