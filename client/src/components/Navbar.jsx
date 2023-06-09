import style from './Navbar.module.css'
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthProvider';

function Navbar() {

    const location = useLocation();
    const { checkLoginCookie, logout } = useAuth();

    const handleLogout = async (e) => {
        try {
            logout();
        }
        catch(err) {
            console.log(err);
        }
    };

    return (
        <div className={style.navbar}>

            { // Back button renders on any page except home
                location.pathname !== '/' && location.pathname !== '/home' &&
                <Link to='/' className={style['back-link']}>
                    <FaArrowLeft style={{color: 'white', fontSize: '30px'}}/>
                </Link>
            }

            <h1 className={style.title}>
                <Link to='/' className={style['title-link']}>ryflect</Link>
            </h1>
            {
                checkLoginCookie() ? <button onClick={handleLogout}>logout</button> : null 
            }
        </div>
    );
}

export default Navbar;