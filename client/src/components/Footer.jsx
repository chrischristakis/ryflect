import style from './Footer.module.css';

function Footer() {
    return (
        <footer>
            <p className={style.copyright}>© 2023 ryflect.ca</p>
            <p className={style['made-by']}>
                <span className={style['made-by-text']}>Made by </span>
                <a href='https://chrischristakis.com' target='_blank' rel='noreferrer' className={style.name}>Chris Christakis</a>
            </p>
        </footer>
    );
}

export default Footer;