import style from './Navbar.module.css'
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthProvider';
import { useState } from 'react';

function Navbar() {

    return (
        <nav className={style.navbar}>

            <BackButton/>
            <h1 className={style.title}>
                <Link to='/' className={style['title-link']}>ryflect</Link>
            </h1>
            <UserMenu/>

        </nav>
    );
}

function UserMenu() {

    const { logout, checkLoginCookie, getUsernameCookie } = useAuth();
    const [expanded, setExpanded] = useState(false);

    function DropdownItem({text='placeholder', link='#', click= (e) => {}}) {
        return (
            <li>
                <Link className={style['dropdown-link']} to={link} onClick={click}>{text}</Link>
            </li>
        );
    }

    if(checkLoginCookie())
        return(
            <>
                <div className={style['username-dropdown']} onClick={(_) => setExpanded(!expanded)}>
                    {getUsernameCookie()} <span style={{fontSize: '0.7em'}}>{expanded? '▲' : '▼'}</span>
                </div>
                {
                    expanded &&
                    <div className={style.overlay}>
                        <ul className={style.dropdown}>
                            <DropdownItem text='logout' click={logout}/>
                            <DropdownItem text='FAQ'/>
                            <DropdownItem text='change password'/>
                        </ul>
                        <div className={style.screencover} onClick={(_) => setExpanded(false)}></div>
                    </div>
                }
            </>
        );
}

function BackButton() {
    const location = useLocation();

    // Back button renders on any page except home
    if(location.pathname !== '/' && location.pathname !== '/home')
        return (
            <Link to='/' className={style['back-link']}>
                <FaArrowLeft style={{color: 'white', fontSize: '30px'}}/>
            </Link>
        );
}

export default Navbar;