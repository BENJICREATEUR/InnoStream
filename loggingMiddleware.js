const fs = require('fs');
const path = require('path');

// Chemin du fichier de log
const logFilePath = path.join(__dirname, '../logs/requests.log');

/**
 * Middleware de journalisation pour enregistrer les requêtes entrantes.
 */
const loggingMiddleware = (req, res, next) => {
    const startTime = process.hrtime(); // Enregistrer le temps de début

    // Écouter l'événement 'finish' pour capturer le statut de la réponse
    res.on('finish', () => {
        const elapsedTime = process.hrtime(startTime); // Calculer le temps d'exécution
        const duration = (elapsedTime[0] * 1e3 + elapsedTime[1] * 1e-6).toFixed(3); // Convertir en millisecondes

        // Construire le message de log
        const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration} ms\n`;

        // Écrire le message de log dans le fichier
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture dans le fichier de log:', err);
            }
        });
    });

    next(); // Passer au middleware suivant
};

/**
 * Initialiser le fichier de log au démarrage de l'application.
 */
const initializeLogFile = () => {
    fs.writeFile(logFilePath, '=== Journal des Requêtes InnoStream ===\n', (err) => {
        if (err) {
            console.error('Erreur lors de la création du fichier de log:', err);
        }
    });
};

module.exports = { loggingMiddleware, initializeLogFile };