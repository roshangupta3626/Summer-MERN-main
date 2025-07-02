const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const send = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_EMAIL_ID,
            to,
            subject,
            text: body,
        };
        await transport.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = send;
