import style from './Navbar.module.css'
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa'

function Navbar() {

    const location = useLocation();

    return (
        <div className={style.navbar}>

            { // Back button renders on any page except home
                location.pathname !== '/' &&
                <Link to='/' className={style['back-link']}>
                    <FaArrowLeft style={{color: 'white', fontSize: '30px'}}/>
                </Link>
            }

            <h1 className={style.title}>
                <Link to='/' className={style['title-link']}>ryflect</Link>
            </h1>
        </div>
    );
}

export default Navbar;