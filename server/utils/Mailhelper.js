const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { WEBAPP_URL, ENV, TEST_EMAIL, GMAIL_USERNAME } = require('../utils/config.js');

const client = nodemailer.createTransport(smtpTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    from: process.env.GMAIL_USERNAME
}));

async function sendMail(recipient, subject, body, text='This email contains HTML content. Please use a supported viewer.') {
    try {
        const response = await client.sendMail(
            {
                from: "ryflect <"+process.env.GMAIL_USERNAME+">",
                to: recipient,
                subject: subject,
                text: text,
                html: body
            }
        );
        return response;
    }
    catch(err) {
        throw err;
    }
};

module.exports.sendMail = sendMail;

module.exports.sendVerification = async function(recipient, verificationID) {
    const emailBody = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Verify</title>
        </head>
        <body>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center">
                        <br/><br/>
                        <h1 style='color: black;'>Thank you for registering!</h1>
                        <h3 style='color: black;'>To start using ryflect, please visit the following link:</h3>
                        <br/>
                        <a href='${WEBAPP_URL}/verify/${verificationID}'
                        style='text-decoration:none!important; border: 4px solid black; padding: 20px; font-size: 1.8em; color: black;'\
                        >
                                Verify
                        </a>
                        <a href='${WEBAPP_URL}/verify/${verificationID}'>${WEBAPP_URL}/verify/${verificationID}</a>
                        <br/><br/><br/>    
                        <p><em style='color: #6a6a6a;'>If you did not register, please ignore this email.</em></p>
                        <p><em style='color: #6a6a6a;'>This link will expire in 15 minutes.</em></p>
                    </td>
                </tr>
            </table>
        </body>
    </html>`;
    
    recipient = (ENV !== 'development')? recipient : TEST_EMAIL;
    
    try {
        const response = await sendMail(recipient, 
                                        'Verify your account', 
                                        emailBody);
        return response;
    }
    catch(err) {
        throw err;
    }
};

module.exports.sendCapsuleNotification = async (recipient, capsuleDate) => {
    const emailBody = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Time capsule reminder</title>
            </head>
            <body>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <h1>A time capsule you made on ${capsuleDate} has been unlocked!</h1>
                            <br/><br>
                            <p>This is an automated response to inform you that your time capsule has opened and you can view it.</p>
                            <p>Please visit <a href='https://ryflect.ca'>ryflect</a> to see what you left for yourself :)</p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;

    recipient = (ENV !== 'development')? recipient : TEST_EMAIL;
    
    try {
        const response = await sendMail(recipient, 
                                        'A time capsule has unlocked!', 
                                        emailBody);
        return response;
    }
    catch(err) {
        throw err;
    }
}