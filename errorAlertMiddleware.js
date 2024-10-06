const nodemailer = require('nodemailer');

/**
 * Configuration du transporteur d'e-mail pour les alertes d'erreur.
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Remplacez par votre hôte SMTP
    port: 587, // Port SMTP (587 pour TLS)
    secure: false, // true pour le port 465, false pour les autres ports
    auth: {
        user: 'your-email@example.com', // Remplacez par votre adresse e-mail
        pass: 'your-email-password', // Remplacez par votre mot de passe
    },
});

/**
 * Middleware de gestion des erreurs et d'envoi d'alertes par e-mail.
 */
const errorAlertMiddleware = (err, req, res, next) => {
    console.error('Erreur:', err.stack); // Log de l'erreur sur la console

    // Créer un message d'alerte par e-mail
    const mailOptions = {
        from: 'your-email@example.com', // Expéditeur
        to: 'admin@example.com', // Adresse de l'administrateur
        subject: 'Alerte d\'Erreur - InnoStream',
        text: `Une erreur est survenue dans l'application InnoStream :\n\n${err.stack}`, // Contenu du message
    };

    // Envoyer l'e-mail d'alerte
    transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
            return console.error('Erreur lors de l\'envoi de l\'alerte par e-mail:', mailErr);
        }
        console.log('Alerte d\'erreur envoyée:', info.response);
    });

    // Répondre avec un message d'erreur générique
    res.status(500).json({
        status: 'error',
        message: 'Une erreur est survenue, nous sommes désolés. Veuillez réessayer plus tard.',
    });
};

/**
 * Middleware pour gérer les erreurs 404.
 */
const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ressource non trouvée.',
    });
};

/**
 * Appliquer le middleware d'erreur dans l'application.
 */
const applyErrorMiddleware = (app) => {
    app.use(errorAlertMiddleware);
    app.use(notFoundMiddleware);
};

module.exports = applyErrorMiddleware;