import ReactMarkdown from 'react-markdown';
import mdFile from '../assets/privacypolicy.md';
import { useEffect, useState } from 'react';
import style from './PrivacyPolicy.module.css';

function PrivacyPolicy() {

    const [mdText, setMdText] = useState();

    useEffect(() => {
        fetch(mdFile)
            .then((res) => res.text())
            .then((txt) => setMdText(txt));
        document.title = 'ryflect | privacy policy';
    }, []);

    return (
        <div className={style['policy-wrapper']}>
            <ReactMarkdown>{mdText}</ReactMarkdown>
        </div>
    );
}

export default PrivacyPolicy;