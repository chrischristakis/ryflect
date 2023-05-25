import style from './Navbar.module.css'

function Navbar() {
    return (
        <div className={style.navbar}>
            <h1 className={style.title}>ryflect</h1>
        </div>
    );
}

export default Navbar;