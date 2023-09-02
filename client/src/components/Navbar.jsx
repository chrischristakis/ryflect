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
                <Link to='/' className={style['title-link']}>
                    ryflect
                </Link>
            </h1>
            <UserMenu/>

        </nav>
    );
}

function UserMenu() {

    const { logout, username } = useAuth();
    const [expanded, setExpanded] = useState(false);

    function DropdownItem({text='placeholder', link='#', isUrl=false, click= (e) => {}}) {
        
        const handleClick = (e) => {
            click(e);
            setExpanded(false);
        }
        
        return (
            <li>
                {
                    !isUrl?
                        <Link className={style['dropdown-link']} to={link} onClick={handleClick}>{text}</Link>
                    :
                        <a className={style['dropdown-link']} href={link}  onClick={handleClick} target='_blank' rel='noreferrer'>{text}</a>
                }
            </li>
        );
    }

    if(username)
        return(
            <>
                <div className={style['username-dropdown']} onClick={(_) => setExpanded(!expanded)}>
                    {username} <span className={style['username-dropdown-arrow']}>{expanded? '▲' : '▼'}</span>
                </div>
                {
                    expanded &&
                    <div className={style.overlay}>
                        <ul className={style.dropdown}>
                            <DropdownItem text='logout' click={async () => {await logout()}}/>
                            <DropdownItem text='FAQ' link='/faq'/>
                            <DropdownItem text='change password' link='/change-password'/>
                            <DropdownItem text='privacy policy' link='/privacy-policy'/>
                            <DropdownItem text='repository' link='https://github.com/chrischristakis/ryflect' isUrl={true}/>
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
                <FaArrowLeft size={30} className={style['back-icon']}/>
            </Link>
        );
}

export default Navbar;