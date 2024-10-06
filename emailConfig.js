require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuration de Nodemailer pour l'envoi d'emails
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail', // Service de messagerie (ex : 'gmail', 'yahoo', 'smtp')
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Hôte SMTP (si un service personnalisé est utilisé)
  port: parseInt(process.env.EMAIL_PORT) || 587, // Port SMTP (465 pour SSL, 587 pour TLS)
  secure: process.env.EMAIL_SECURE === 'true', // Définit si SSL/TLS est utilisé pour la connexion
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Adresse email de l'expéditeur
    pass: process.env.EMAIL_PASSWORD || 'your-email-password', // Mot de passe de l'adresse email
  },
  from: process.env.EMAIL_FROM || 'InnoStream <no-reply@innostream.com>', // Adresse email de l'expéditeur par défaut
};

// Création du transporteur de messagerie
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure, // true pour 465, false pour les autres ports
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
  tls: {
    rejectUnauthorized: false, // Utilisé pour éviter les erreurs SSL
  },
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: emailConfig.from,
    to: to, // Destinataire
    subject: subject, // Sujet de l'email
    text: text, // Version texte du message
    html: html, // Version HTML du message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès :', info.response);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};