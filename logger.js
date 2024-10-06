const winston = require('winston');
const path = require('path');

// Configuration du logger avec Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
    ],
});

// Fonction pour enregistrer un message d'erreur
function logError(message) {
    logger.error(message);
}

// Fonction pour enregistrer un message d'information
function logInfo(message) {
    logger.info(message);
}

module.exports = {
    logger,
    logError,
    logInfo
};