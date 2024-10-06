const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;

// Définition du format du log
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configuration du logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Niveau de log (info, error, warn, etc.)
  format: combine(
    timestamp(), // Ajoute un timestamp à chaque log
    json(), // Format JSON pour une meilleure gestion des logs
    logFormat // Utilisation du format défini
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(), // Ajoute de la couleur aux logs dans la console
        logFormat // Utilise le format de log personnalisé
      ),
    }),
    new transports.File({
      filename: 'logs/error.log', // Fichier pour les logs d'erreur
      level: 'error', // Seules les erreurs sont enregistrées ici
    }),
    new transports.File({
      filename: 'logs/combined.log', // Fichier pour tous les logs
    }),
  ],
});

// Fonction pour gérer les logs d'exception et les promesses non gérées
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new transports.File({ filename: 'logs/exceptions.log' }) // Enregistre les exceptions non gérées
  );

  process.on('unhandledRejection', (reason, promise) => {
    throw reason; // Les rejets de promesse non gérés seront traités comme des exceptions
  });
}

module.exports = logger;