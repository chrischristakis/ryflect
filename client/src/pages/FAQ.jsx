import Accordion from '../components/Accordion';
import style from './FAQ.module.css';

const faqData = [
    {
        header: 'What is Ryflect?',
        content: `Ryflect is a 'once a day' journaling application that aims to provide a clean, secure, and intuitive platform for creating journal 
            entries in both the present and future. It is completely free, with no premium plans. The application is created and managed by me, 
            Chris Christakis, and the source code is publicly available on GitHub.`
    },
    {
        header: "I didn't get a verification email after registering...",
        content: `Make sure you check your spam/junk folder. Since I'm automating emails from a gmail account, most email hosts will send Ryflect's emails
            to spam. If you don't get one still, please email me at ryflectsite@gmail.com and I can try to help resolve it.`
    },
    {
        header: 'Is Ryflect open-source?',
        content: `Depends on your interpretation of the word. The code is available to view on GitHub in a monorepo. You can find the link to the repository at the bottom of the website. 
            This repository encapsulates the entire application. So it is open to inspect, however, it is not open to modification/contribution.`
    },
    {
        header: 'Are my journal entries secure?',
        content: `To the best of my ability, yes. Entries are encrypted when saved into the database using your password, so even if there was a data leak 
            (knock on wood) journal entries and passwords would not be compromised.`
    },
    {
        header: 'I forgot my password, what do I do?',
        content: `Unfortunately, nothing can be done about this. Sometimes convenience needs to be sacrificed for security, and since your entries are encrypted
            using your password, they can only be decrypted with that password. If you know your password already though, you can always change your current password
            for another one in the user dropdown.`
    },
    {
        header: 'Why can I only make one journal per day?',
        content: `I personally find it difficult to consistently journal every day, and 
        my idea to solve that was to incentivize journaling with restrictions. By limiting journals to once per day, it encourages you to reflect ( ;) ) on the day as
        a whole, and also provides an incentive to visit each day. Checking off those little black boxes daily ended up being a pretty strong motivator for me personally
        while developing the website, so that's how it ended up.`
    },
    {
        header: 'When can I make another journal entry?',
        content: `The daily reset is at 12:00am UTC, or 8:00pm EST.`
    },
    {
        header: 'What are time capsule entries?',
        content: `Simply a way for you to leave notes, journals, words, or anything for yourself in the future. You can pick any reasonable date in the future
            and write something that you will not be able to view again until that date.`
    },
    {
        header: 'Is there a limit to how many time capsules I can make?',
        content: `Yep. Currently you can have up to 100 pending capsules at once.`
    },
    {
        header: 'Can I delete journal entries?',
        content: `Not on your own. Remember no one but you can read them, unless someone has access to your account. (Make strong passwords, please.)
            If you still want to delete your account and data I'd be open to doing so for you if you email me at ryflectsite@gmail.com.`
    },
    {
        header: 'What is Ryflect made with?',
        content: `Ryflect is a MERN app (Mongo, Express, React, NodeJS)`
    },
    {
        header: 'Is Ryflect going to be updated?',
        content: `Arbitrarily. Of course I'll maintain it and keep it up, but updates are not going to be consistent as Ryflect is an unmonetized project. If you
            have any bugs you find or feature ideas I'd love to hear them though so feel free to send an email to ryflectsite@gmail.com :)`
    },
]

function FAQ() {
    return (
        <div className={style['faq-wrapper']}>
            <div className={style.title}>
                <h1>FAQ</h1>
                <p><em>Frequently Asked Questions</em></p>
            </div>
            <div className={style['faq-container']}>
                {
                    faqData.map((obj, index) =>
                        <Accordion key={index} header={obj.header} content={obj.content}/>
                    )
                }
            </div>
        </div>
    );
}

export default FAQ;