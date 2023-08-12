import style from './Footer.module.css';

function Footer() {
    const date = new Date();

    return (
        <footer style={{backgroundColor: 'black', color: 'white'}}>
            <p className={style.copyright}>© {date.getUTCFullYear()} ryflect.ca</p>
            <p className={style['made-by']}>
                Made by <a href='https://chrischristakis.com' target='_blank' rel='noreferrer'>Chris Christakis</a>
            </p>
        </footer>
    );
}

export default Footer;