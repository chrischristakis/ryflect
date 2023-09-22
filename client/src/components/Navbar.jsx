import style from './Navbar.module.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { useState } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { lightTheme } from '../utils/Constants';

function Navbar() {

    const [expanded, setExpanded] = useState(false);
    const { username } = useAuth();

    return (
        <nav className={style.navbar}>
            <div className={style.left}>;-)</div>
            <div className={style.center}>
                <h1 className={style.title}>
                    <Link to='/' className={style['title-link']}>
                        <Logo fill={lightTheme.secondary} className={style['logo']}/>
                    </Link>
                </h1>
            </div>
            <div className={style.right}>
                {
                    username &&
                    <div className={style['username-dropdown']} onClick={(_) => setExpanded(!expanded)}>
                        <span className={style['username-dropdown-username']}>{username}</span>
                        <span className={style['username-dropdown-arrow']}>{expanded? '▲' : '▼'}</span>
                    </div>
                }
            </div>
            <UserMenu expanded={expanded} setExpanded={setExpanded}/>
        </nav>
    );
}

function UserMenu({expanded=false, setExpanded=()=>{}}) {

    const { logout, username } = useAuth();
    
    function DropdownItem({text='placeholder', link='#', isUrl=false, click= (e) => {}}) {
        
        const handleClick = (e) => {
            click(e);
            setExpanded(false);
        }
        
        return (
            <li className={style['dropdown-item']}>
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

export default Navbar;