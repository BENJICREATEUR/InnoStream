const nodemailer = require('nodemailer');

// Configuration du transporteur de mails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Fonction pour envoyer un email
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
}

// Fonction pour envoyer un email de confirmation
async function sendConfirmationEmail(user) {
    const subject = 'Confirmez votre compte InnoStream';
    const text = `Bonjour ${user.name},\n\nMerci de vous être inscrit sur InnoStream! Veuillez confirmer votre compte en cliquant sur le lien suivant:\n\n${process.env.CONFIRMATION_URL}/${user.confirmationCode}`;
    
    return sendEmail(user.email, subject, text);
}

module.exports = {
    sendEmail,
    sendConfirmationEmail
};