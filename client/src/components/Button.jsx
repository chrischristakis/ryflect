function Button({text="placeholder", clickEvent= () => {}}) {
    return <button onClick={clickEvent}>{text}</button>
}

export default Button;