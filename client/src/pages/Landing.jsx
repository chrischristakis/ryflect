import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../components/Button';
import style from './Landing.module.css';
import HomeImg from '../assets/home.png';
import DesktopHomeImg from '../assets/home-desktop.png';
import { GrSecure } from 'react-icons/gr';
import { TbPigMoney } from 'react-icons/tb';
import { BsFillPencilFill } from 'react-icons/bs';
import { AiFillCode } from 'react-icons/ai';

function Landing() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = `ryflect`;
    }, []);

    return (
        <div className={style['landing-wrapper']}>
            <div className={style['top-portion']}>
                <div className={style['button-portion']}>
                    <p>journal everywhere, for the present or future.</p>
                    <div className={style['button-container']}>
                        <Button text={'login'} clickEvent={_=> navigate('/login')} fillContainer={true}/>
                        <Button text={'register'} clickEvent={_=> navigate('/register')} lightButton={true} fillContainer={true}/>
                    </div>
                </div>
                <div className={style['desktop-img-div']}>
                    <img src={DesktopHomeImg} alt=':(' width={200}/>
                </div>
            </div>
            <div className={style['mobile-img-div']}>
                <div className={style['black-box']}></div>
                <img src={HomeImg} alt=':(' width={200}/>
            </div>
            <h2 className={style['title-break']}>what is ryflect?</h2>
            <p className={style['explanation-paragraph']}>ryflect is a once-a-day journaling platform with an emphasis on ease of use while still providing everything you may expect from a journal app. explore your past habits using a timeline of your entries, or create an entry that you cannot open until the future.</p>
            <h2 className={style['title-break']}>why use ryflect?</h2>
            <div className={style['box-container']}>
                <div className={style['box']}>
                    <div className={style['box-title']}><p>everything is encrypted</p><span><GrSecure size={30}/></span></div>
                    <p>with AES256 encryption, ryflect encrypts journal entries using your password, so nobody except you can view your data.</p>
                </div>
                <div className={style['box']}>
                    <div className={style['box-title']}><p>everything is free</p><span><TbPigMoney size={30}/></span></div>
                    <p>ryflect has no premium plans. everything it offers is free.</p>
                </div>
                <div className={style['box']}>
                    <div className={style['box-title']}><p>everything is easy to use</p><span><BsFillPencilFill size={30}/></span></div>
                    <p>no journaling medium should be difficult and cluttered. ryflect aims to be an easy all-in-one companion for you.</p>
                </div>
                <div className={style['box']}>
                    <div className={style['box-title']}><p>everything is open source</p><span><AiFillCode size={30}/></span></div>
                    <p>ryflect is available to view in its entirety on 
                        on <a href='https://github.com/chrischristakis/ryflect' target='_blank' rel='noreferrer'>GitHub</a>;
                        transparency is vital.
                    </p>
                </div>
            </div>
            <p className={style['bottom-portion']}>still have questions?<br/> visit our <Link to='/faq'>faq</Link> and <Link to='/privacy-policy'>privacy policy</Link></p>
        </div>
    );
}

export default Landing;