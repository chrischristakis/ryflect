function Button({text="placeholder", clickEvent= () => {}, type='button'}) {
    return <button onClick={clickEvent} type={type}>{text}</button>
}

export default Button;